#!/usr/bin/env python3
"""
Run code cells from a notebook on a Modal GPU as a single combined script.

Pip install lines are extracted from ALL cells, collected as image dependencies,
and stripped from the script so they don't run at execution time.
Non-skipped cells are concatenated into one script and executed together,
preserving shared state (variables, imports) across cells just like a real notebook.

Usage:
  python run_notebook_test.py --notebook notebooks/LFM2_Inference_with_Transformers.ipynb
  python run_notebook_test.py --notebook notebooks/LFM2_Inference_with_Transformers.ipynb --gpu A10G
  python run_notebook_test.py --notebook notebooks/LFM2_Inference_with_Transformers.ipynb --dry-run
"""

import argparse
import re
import sys
import time
from pathlib import Path
import json
import modal

sys.path.insert(0, str(Path(__file__).resolve().parent / "tests"))


def extract_code_cells(notebook_path: Path) -> list[dict]:
    """Return a list of code cell dicts with 'source', 'index', and 'skipped' keys."""
    with open(notebook_path) as f:
        nb = json.load(f)

    cells = []
    code_index = 0
    for cell in nb.get("cells", []):
        if cell["cell_type"] != "code":
            continue

        source = "".join(cell["source"])
        skip = (
            "# test:skip" in source
            or cell.get("metadata", {}).get("test_skip", False)
        )

        cells.append({
            "index": code_index,
            "source": source,
            "skipped": skip,
        })
        code_index += 1

    return cells

def parse_packages_from_cell(source: str) -> tuple[list[list[str]], list[str]]:
    """Parse dependency cell into pip package groups and shell setup commands.

    Returns (pip_package_groups, setup_commands).  Each ``pip install`` line
    becomes its own group so that install ordering is preserved (e.g. packages
    that need torch at build time can be installed in a later group).
    Non-pip ``!`` lines become setup commands that run before the Python script.
    Lines after ``# !modal_skip_rest`` are ignored; lines with
    ``# !modal_skip`` are skipped individually.
    """
    package_groups: list[list[str]] = []
    setup_commands = []
    for line in source.splitlines():
        line = line.strip()
        # Stop processing if we hit a modal_skip_rest directive
        if "!modal_skip_rest" in line:
            break
        # Skip individual lines marked with modal_skip
        if "!modal_skip" in line:
            continue
        # Match: !pip install ..., !uv pip install ..., pip install ...
        match = re.match(r"^!?\s*(?:uv\s+)?pip\s+install\s+(.+)", line)
        if match:
            group = []
            for token in re.split(r"[,\s]+", match.group(1)):
                token = token.strip('"').strip("'").strip(",")
                if token and not token.startswith("-"):
                    group.append(token)
            if group:
                package_groups.append(group)
        elif line.startswith("!"):
            setup_commands.append(line[1:].strip())
    return package_groups, setup_commands


def strip_pip_lines(source: str) -> str:
    """Remove pip install lines (and their continuations) from cell source.

    This is used after packages have been extracted so that pip installs
    run as image-level dependencies rather than at script execution time.
    """
    lines = source.splitlines()
    cleaned: list[str] = []
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if re.match(r"^!?\s*(?:uv\s+)?pip\s+install\s+", stripped):
            # Skip this line and any backslash-continuation lines
            while stripped.endswith("\\") and i + 1 < len(lines):
                i += 1
                stripped = lines[i].strip()
            i += 1
            continue
        cleaned.append(lines[i])
        i += 1
    return "\n".join(cleaned)


TRAINER_PATTERNS = re.compile(r"\b(?:SFTTrainer|GRPOTrainer|DPOTrainer|Trainer)\s*\(")


def is_training_notebook(code_cells: list[dict]) -> bool:
    """Return True if any cell instantiates a HF Trainer."""
    return any(TRAINER_PATTERNS.search(c["source"]) for c in code_cells)

# Default to lower epoch to speed up testing pipeline
def patch_training_epochs(source: str, epochs: float = 0.01) -> str:
    """Replace num_train_epochs=<any value> with a minimal value for smoke testing."""
    return re.sub(
        r"num_train_epochs\s*=\s*[0-9.]+",
        f"num_train_epochs={epochs}",
        source,
    )


def filter_cells(code_cells: list[dict]) -> list[dict]:
    """Apply !modal_skip and !modal_skip_rest directives.

    - !modal_skip: skip only that cell
    - !modal_skip_rest: skip that cell and all remaining cells
    """
    filtered = []
    for cell in code_cells:
        source = cell["source"]
        if "!modal_skip_rest" in source:
            break
        if "!modal_skip" in source and "!modal_skip_rest" not in source:
            continue
        filtered.append(cell)
    return filtered


def preprocess_cell(source: str) -> tuple[str, list[str]]:
    """Transform cell source so shell lines become valid Python.

    Returns (transformed_source, setup_commands).
    - ``%%bash`` cells are collected as setup commands and excluded from the script.
    - ``!`` lines are converted to ``subprocess.run()`` calls.
    - Pure Python lines are unchanged.
    """
    lines = source.splitlines()
    setup_commands: list[str] = []

    # Detect %%bash magic (may follow comment lines)
    non_comment = [l for l in lines if l.strip() and not l.strip().startswith("#")]
    if non_comment and non_comment[0].strip() == "%%bash":
        bash_lines: list[str] = []
        found_magic = False
        for line in lines:
            if not found_magic:
                if line.strip() == "%%bash":
                    found_magic = True
                continue
            bash_lines.append(line)
        if bash_lines:
            setup_commands.append("\n".join(bash_lines))
        return "", setup_commands

    # Convert ! lines to subprocess.run(), joining backslash continuations
    transformed: list[str] = []
    i = 0
    while i < len(lines):
        stripped = lines[i].lstrip()
        if stripped.startswith("!"):
            indent = lines[i][: len(lines[i]) - len(stripped)]
            cmd_parts = [stripped[1:]]
            # Collect continuation lines ending with backslash
            while cmd_parts[-1].rstrip().endswith("\\") and i + 1 < len(lines):
                i += 1
                cmd_parts.append(lines[i])
            full_cmd = "\n".join(cmd_parts)
            # Ensure uv/pip installs use --system (no venv in containers)
            if re.match(r"(?:uv\s+)?pip\s+install", full_cmd) and "--system" not in full_cmd:
                full_cmd = full_cmd.replace("pip install", "pip install --system", 1)
            transformed.append(f"{indent}subprocess.run({full_cmd!r}, shell=True, check=True)")
        else:
            transformed.append(lines[i])
        i += 1
    return "\n".join(transformed), setup_commands


def combine_cells(code_cells: list[dict]) -> tuple[str, list[str]]:
    """Concatenate code cells into a single script with cell markers.

    Returns (combined_code, setup_commands) after preprocessing each cell.
    """
    parts = []
    all_setup: list[str] = []
    has_subprocess_import = False

    for cell in code_cells:
        source, setup_cmds = preprocess_cell(cell["source"])
        all_setup.extend(setup_cmds)
        if source.strip():
            if not has_subprocess_import and "subprocess.run(" in source:
                has_subprocess_import = True
            parts.append(f"# --- cell {cell['index']} ---")
            parts.append(source)

    code = "\n\n".join(parts)
    # Prepend subprocess import if we generated subprocess.run() calls
    if has_subprocess_import:
        code = "import subprocess\n\n" + code
    return code, all_setup


def main():
    parser = argparse.ArgumentParser(description="Run notebook code cells on Modal as a single script")
    parser.add_argument("--notebook", required=True, help="Path to .ipynb file")
    parser.add_argument("--gpu", default="A10G", help="GPU type (default: A10G)")
    parser.add_argument("--dry-run", action="store_true", help="Print combined script and packages without running")
    parser.add_argument("--skip-packages", nargs="+", default=[], metavar="PKG",
                        help="Package names to exclude from installation (e.g. --skip-packages flash-attn)")
    args = parser.parse_args()

    notebook_path = Path(args.notebook)
    if not notebook_path.exists():
        print(f"Error: notebook not found: {notebook_path}")
        sys.exit(1)

    cells = extract_code_cells(notebook_path)
    if not cells:
        print("No code cells found.")
        sys.exit(1)

    # Filter out skipped / modal_skip cells
    code_cells = [c for c in cells if not c["skipped"]]
    code_cells = filter_cells(code_cells)

    if not code_cells:
        print(f"Notebook {notebook_path.name}: no runnable code cells (all skipped) — passing.")
        sys.exit(0)

    # Extract pip packages from ALL cells, then strip those lines from source.
    # Only collect packages here — shell commands (! lines, %%bash) in regular
    # cells are handled by preprocess_cell inside combine_cells.
    pip_packages: list[list[str]] = []
    for cell in code_cells:
        pkgs, _setup = parse_packages_from_cell(cell["source"])
        pip_packages.extend(pkgs)
        cell["source"] = strip_pip_lines(cell["source"])

    # Filter out skipped packages
    if args.skip_packages:
        skip_set = set(args.skip_packages)
        pip_packages = [
            [pkg for pkg in group if pkg not in skip_set]
            for group in pip_packages
        ]
        pip_packages = [g for g in pip_packages if g]  # drop empty groups

    combined, setup_commands = combine_cells(code_cells)
    skipped = len(cells) - len(code_cells)

    # Auto-detect training notebooks: upgrade GPU and patch epochs for smoke testing
    is_training = is_training_notebook(code_cells)
    if is_training:
        if args.gpu == "A10G":  # only override if user didn't specify
            args.gpu = "H100"
        combined = patch_training_epochs(combined, epochs=0.01)

    print(f"{'=' * 50}")
    print(f"Notebook: {notebook_path.name}")
    if is_training:
        print(f"Type:     training (auto: GPU→{args.gpu}, epochs→0.01)")
    all_packages = [pkg for group in pip_packages for pkg in group]
    print(f"Packages: {all_packages or '(none)'} ({len(pip_packages)} install group(s))")
    if setup_commands:
        print(f"Setup:    {len(setup_commands)} command(s)")
    print(f"GPU:      {args.gpu}")
    print(f"Cells:    {len(code_cells)} to run, {skipped} skipped")
    print(f"{'=' * 50}\n")

    if args.dry_run:
        if setup_commands:
            print("=== SETUP COMMANDS ===")
            for i, cmd in enumerate(setup_commands):
                print(f"\n--- setup {i} ---")
                print(cmd)
            print(f"\n=== PYTHON SCRIPT ===\n")
        print(combined)
        return

    try:
        run_code = modal.Function.from_name("ci-runner", "run_code")
    except modal.exception.NotFoundError:
        print("Error: Modal app 'ci-runner' not deployed.")
        print("Run this first: modal deploy modal_runner.py")
        sys.exit(1)

    print("Submitting to Modal...")
    start_time = time.time()
    result = run_code.remote(code=combined, pip_packages=pip_packages, setup_commands=setup_commands)

    print("\n--- STDOUT ---")
    print(result["stdout"] or "(empty)")

    if result["stderr"]:
        print("\n--- STDERR ---")
        print(result["stderr"])

    if result["error"]:
        print(f"\n✗ FAILED: {result['error']}")
        sys.exit(1)

    elapsed = time.time() - start_time
    print(f"\nRuntime: {elapsed:.2f}s")
    print(f"✓ All {len(code_cells)} cells passed")


if __name__ == "__main__":
    main()
