# Notebook Testing Utilities

This directory contains tools for running Jupyter notebooks as smoke tests on [Modal](https://modal.com/) GPUs. The system extracts code cells from `.ipynb` files, collects their dependencies, and executes them remotely to verify they work end-to-end.

## Overview

| File | Purpose |
|---|---|
| `modal_runner.py` | Modal app that runs Python code on a remote GPU container |
| `run_notebook_test.py` | CLI that parses a notebook, extracts dependencies, and submits the combined script to Modal |

## How it works

1. **`run_notebook_test.py`** reads a notebook and extracts all code cells.
2. Pip install lines (`!pip install ...`, `!uv pip install ...`) are extracted from **every** cell, collected as image-level dependencies, and stripped from the script so they don't run at execution time.
3. Shell commands (`!` lines) are converted to `subprocess.run()` calls; `%%bash` cells become setup commands.
4. The remaining cells are concatenated into a single Python script, preserving shared state (variables, imports) across cells just like a real notebook.
5. The script, dependency list, and setup commands are sent to **`modal_runner.py`**'s `run_code` function via Modal's remote invocation.

**`modal_runner.py`** runs on an A10G GPU (default) with a 10-minute timeout. It:
- Installs pip packages in order (each `pip install` line becomes a separate install group to preserve ordering)
- Runs any setup commands (shell commands, `%%bash` cells)
- Executes the combined Python script as a subprocess and captures stdout/stderr

## Usage

### Prerequisites

- A Modal account with a deployed `ci-runner` app
- Modal token configured locally

### Deploy the Modal app (one-time)

```bash
modal deploy util/modal_runner.py
```

### Run a notebook

```bash
python util/run_notebook_test.py --notebook notebooks/MyNotebook.ipynb
```

### Options

| Flag | Description | Default |
|---|---|---|
| `--notebook` | Path to `.ipynb` file (required) | — |
| `--gpu` | GPU type | `A10G` |
| `--dry-run` | Print the combined script and packages without running | off |
| `--skip-packages PKG ...` | Package names to exclude from installation | none |

### Examples

```bash
# Dry run to inspect what would be executed
python util/run_notebook_test.py --notebook notebooks/LFM2_Inference.ipynb --dry-run

# Skip a package that doesn't build in CI
python util/run_notebook_test.py --notebook notebooks/LFM2_Inference.ipynb --skip-packages flash-attn

# Use a different GPU
python util/run_notebook_test.py --notebook notebooks/LFM2_Inference.ipynb --gpu A100
```

## Notebook directives

Control which cells and lines are included in the test run:

| Directive | Scope | Effect |
|---|---|---|
| `# test:skip` | Cell | Skip the entire cell |
| `# !modal_skip` | Line or cell | Skip that line (in dependency parsing) or cell (in cell filtering) |
| `# !modal_skip_rest` | Line or cell | Stop processing — ignore this and all subsequent lines/cells |

These can be placed in comments within any code cell.

## CI workflow

The GitHub Actions workflow (`.github/workflows/run-notebooks.yaml`) automatically:
1. Discovers all `.ipynb` files in the `notebooks/` directory
2. Runs each notebook in parallel as a separate matrix job
3. Triggers on pushes/PRs that change `notebooks/**`, or manually via `workflow_dispatch`
