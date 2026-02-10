#!/usr/bin/env python3
import argparse
import json
import logging
import pathlib
import sys

logger = logging.getLogger(__name__)

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
NOTEBOOK_PATH = REPO_ROOT / "notebooks" / "quickstart_snippets.ipynb"
SNIPPETS_DIR = REPO_ROOT / "snippets" / "quickstart"

SHIKI_STYLE = (
    'className="shiki shiki-themes github-light github-dark" '
    "style={{backgroundColor: '#fff', '--shiki-dark-bg': '#24292e', "
    "color: '#24292e', '--shiki-dark': '#e1e4e8'}}"
)

SHIKI_STYLE_WITH_MARGIN = (
    'className="shiki shiki-themes github-light github-dark" '
    "style={{backgroundColor: '#fff', '--shiki-dark-bg': '#24292e', "
    "color: '#24292e', '--shiki-dark': '#e1e4e8', marginTop: '0.5rem'}}"
)

REPLACEMENTS = {
    "text": [
        ("LiquidAI/LFM2.5-1.2B-Instruct-GGUF", "${ggufRepo}"),
        ("LiquidAI/LFM2.5-1.2B-Instruct", "${modelId}"),
    ],
    "vl": [
        ("LiquidAI/LFM2.5-VL-1.6B-GGUF", "${ggufRepo}"),
        ("LiquidAI/LFM2.5-VL-1.6B", "${modelId}"),
    ],
}

# === Snippet Configuration ===

SNIPPET_CONFIG = {
    "text-transformers": {
        "component_name": "TextTransformers",
        "props": "{ modelId }",
        "replacement_group": "text",
        "source": "notebook",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": 'pip install "transformers>=5.0.0" torch accelerate'},
            {"type": "label", "text": "Download & Run:"},
            {"type": "notebook_code", "language": "python"},
        ],
    },
    "text-vllm": {
        "component_name": "TextVllm",
        "props": "{ modelId }",
        "replacement_group": "text",
        "source": "notebook",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "pip install vllm==0.14"},
            {"type": "label", "text": "Run:"},
            {"type": "notebook_code", "language": "python"},
        ],
    },
    "text-llamacpp": {
        "component_name": "TextLlamacpp",
        "props": "{ ggufRepo }",
        "replacement_group": "text",
        "source": "config",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "brew install llama.cpp"},
            {"type": "label", "text": "Run:"},
            {"type": "code_block", "language": "bash",
             "code": "llama-cli -hf ${ggufRepo} -c 4096 --color -i"},
            {"type": "raw_html",
             "html": '<p>The <code>-hf</code> flag downloads the model directly from Hugging Face. For other installation methods and advanced usage, see the <a href="/docs/inference/llama-cpp">llama.cpp guide</a>.</p>'},
        ],
    },
    "vl-transformers": {
        "component_name": "VlTransformers",
        "props": "{ modelId }",
        "replacement_group": "vl",
        "source": "notebook",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": 'pip install "transformers>=5.0.0" pillow torch'},
            {"type": "note", "children": [
                {"type": "text",
                 "text": "Transformers v5 is newly released. If you encounter issues, fall back to the pinned git source:"},
                {"type": "code_block_margin", "language": "bash",
                 "code": "pip install git+https://github.com/huggingface/transformers.git@3c2517727ce28a30f5044e01663ee204deb1cdbe pillow torch"},
            ]},
            {"type": "label", "text": "Download & Run:"},
            {"type": "notebook_code", "language": "python"},
        ],
    },
    "vl-vllm": {
        "component_name": "VlVllm",
        "props": "{ modelId }",
        "replacement_group": "vl",
        "source": "notebook",
        "sections": [
            {"type": "warning",
             "text": "vLLM support for LFM Vision Models requires a specific version. Install from the custom source below."},
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "VLLM_PRECOMPILED_WHEEL_COMMIT=72506c98349d6bcd32b4e33eec7b5513453c1502 \\\n  VLLM_USE_PRECOMPILED=1 \\\n  pip install git+https://github.com/vllm-project/vllm.git"},
            {"type": "code_block", "language": "bash",
             "code": 'pip install "transformers>=5.0.0" pillow'},
            {"type": "note", "children": [
                {"type": "text",
                 "text": "Transformers v5 is newly released. If you encounter issues, fall back to the pinned git source:"},
                {"type": "code_block_margin", "language": "bash",
                 "code": "pip install git+https://github.com/huggingface/transformers.git@3c2517727ce28a30f5044e01663ee204deb1cdbe pillow"},
            ]},
            {"type": "label", "text": "Run:"},
            {"type": "notebook_code", "language": "python"},
        ],
    },
    "vl-llamacpp": {
        "component_name": "VlLlamacpp",
        "props": "{ ggufRepo }",
        "replacement_group": "vl",
        "source": "config",
        "sections": [
            {"type": "raw_html",
             "html": "<p>llama.cpp enables efficient CPU inference for vision models.</p>"},
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "brew install llama.cpp"},
            {"type": "raw_html",
             "html": '<p>Or download pre-built binaries from <a href="https://github.com/ggml-org/llama.cpp/releases">llama.cpp releases</a>.</p>'},
            {"type": "label", "text": "Run:"},
            {"type": "code_block", "language": "bash",
             "code": "llama-cli \\\n    -hf ${ggufRepo}:Q4_0 \\\n    --image test_image.jpg \\\n    -p \"What's in this image?\" \\\n    -n 128"},
            {"type": "raw_html",
             "html": '<p>The <code>-hf</code> flag downloads the model directly from Hugging Face. Use <code>--image-max-tokens</code> to control image token budget.</p>'},
            {"type": "raw_html",
             "html": '<p>For server deployment and advanced usage, see the <a href="/docs/inference/llama-cpp#vision-models">llama.cpp guide</a>.</p>'},
        ],
    },
}


def read_notebook_cells():
    with open(NOTEBOOK_PATH) as f:
        nb = json.load(f)

    cells = {}
    for cell in nb["cells"]:
        snippet_name = cell.get("metadata", {}).get("snippet")
        if snippet_name and cell["cell_type"] == "code":
            source_lines = cell["source"]
            code = "".join(source_lines)
            cells[snippet_name] = code
    return cells


def apply_replacements(code, group):
    for old, new in REPLACEMENTS[group]:
        code = code.replace(old, new)
    return code


def render_code_block(code, language, style=None):
    if style is None:
        style = SHIKI_STYLE
    # Backslashes must be escaped inside JS template literals
    escaped_code = code.replace("\\", "\\\\")
    lines = [
        f'<pre {style} language="{language}">',
        f'<code language="{language}">',
        "{`" + escaped_code + "`.split('\\n').map((line, i) => <span key={i} className=\"line\">{line}{'\\n'}</span>)}",
        "</code>",
        "</pre>",
    ]
    return "\n".join(lines)


def render_section(section, notebook_code=None):
    section_type = section["type"]

    if section_type == "label":
        return f"<p><strong>{section['text']}</strong></p>"

    if section_type == "code_block":
        return render_code_block(section["code"], section["language"])

    if section_type == "code_block_margin":
        return render_code_block(
            section["code"], section["language"], style=SHIKI_STYLE_WITH_MARGIN
        )

    if section_type == "notebook_code":
        if notebook_code is None:
            msg = "notebook_code section requires notebook code"
            raise ValueError(msg)
        return render_code_block(notebook_code, section["language"])

    if section_type == "raw_html":
        return section["html"]

    if section_type == "warning":
        return f"<Warning>\n{section['text']}\n</Warning>"

    if section_type == "note":
        inner_parts = []
        for child in section["children"]:
            if child["type"] == "text":
                inner_parts.append(child["text"])
            else:
                inner_parts.append(render_section(child))
        return "<Note>\n" + "\n".join(inner_parts) + "\n</Note>"

    if section_type == "text":
        return section["text"]

    msg = f"Unknown section type: {section_type}"
    raise ValueError(msg)


def generate_snippet(name, config, notebook_cells):
    group = config["replacement_group"]
    notebook_code = None

    if config["source"] == "notebook":
        raw_code = notebook_cells.get(name)
        if raw_code is None:
            logger.error("No notebook cell found for snippet %s", name)
            return None
        notebook_code = apply_replacements(raw_code, group)

    parts = []
    for section in config["sections"]:
        parts.append(render_section(section, notebook_code))

    body = "\n".join(parts)
    component_name = config["component_name"]
    props = config["props"]

    return f"export const {component_name} = ({props}) => (\n<div>\n{body}\n</div>\n);\n"


def generate_all():
    notebook_cells = read_notebook_cells()
    results = {}

    for name, config in SNIPPET_CONFIG.items():
        content = generate_snippet(name, config, notebook_cells)
        if content is None:
            return None
        results[name] = content

    return results


def write_snippets(results):
    for name, content in results.items():
        output_path = SNIPPETS_DIR / f"{name}.mdx"
        output_path.write_text(content)
        logger.info("Generated %s", output_path)


def check_freshness(results):
    mismatches = []

    for name, expected in results.items():
        output_path = SNIPPETS_DIR / f"{name}.mdx"
        if not output_path.exists():
            mismatches.append((name, "file does not exist"))
            continue

        actual = output_path.read_text()
        if actual != expected:
            mismatches.append((name, "content differs"))
            logger.error("Snippet %s is out of date. Regenerate with:", name)
            logger.error("  python3 scripts/generate_snippets.py")

    return mismatches


def main():
    parser = argparse.ArgumentParser(
        description="Generate quickstart snippet MDX files from notebook source"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check that committed snippets match generated output (for CI)",
    )
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")

    results = generate_all()
    if results is None:
        sys.exit(1)

    if args.check:
        mismatches = check_freshness(results)
        if mismatches:
            logger.error("Snippet freshness check failed:")
            for name, reason in mismatches:
                logger.error("  %s: %s", name, reason)
            sys.exit(1)
        logger.info("All snippets are up to date.")
    else:
        write_snippets(results)
        logger.info("All snippets generated successfully.")


if __name__ == "__main__":
    main()
