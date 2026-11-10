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
        "props": "{ modelId, samplingParams }",
        "replacement_group": "text",
        "source": "config",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": 'pip install "transformers>=5.2.0" torch accelerate'},
            {"type": "label", "text": "Download & Run:"},
            {"type": "code_block", "language": "python",
             "code": (
                 "from transformers import AutoModelForCausalLM, AutoTokenizer\n"
                 "\n"
                 'model_id = "${modelId}"\n'
                 "model = AutoModelForCausalLM.from_pretrained(\n"
                 "    model_id,\n"
                 '    device_map="auto",\n'
                 '    dtype="bfloat16",\n'
                 ")\n"
                 "tokenizer = AutoTokenizer.from_pretrained(model_id)\n"
                 "\n"
                 "inputs = tokenizer.apply_chat_template(\n"
                 '    [{"role": "user", "content": "What is machine learning?"}],\n'
                 "    add_generation_prompt=True,\n"
                 '    return_tensors="pt",\n'
                 "    tokenize=True,\n"
                 "    return_dict=True,\n"
                 ").to(model.device)\n"
                 "\n"
                 "output = model.generate(**inputs, ${samplingParams}max_new_tokens=512)\n"
                 'input_length = inputs["input_ids"].shape[1]\n'
                 "response = tokenizer.decode(output[0][input_length:], skip_special_tokens=True)\n"
                 "print(response)"
             )},
        ],
    },
    "text-vllm": {
        "component_name": "TextVllm",
        "props": "{ modelId, samplingParams, maxTokens }",
        "replacement_group": "text",
        "source": "config",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "pip install -U vllm"},
            {"type": "label", "text": "Run:"},
            {"type": "code_block", "language": "python",
             "code": (
                 "from vllm import LLM, SamplingParams\n"
                 "\n"
                 'llm = LLM(model="${modelId}")\n'
                 "\n"
                 "sampling_params = SamplingParams(${samplingParams}max_tokens=${maxTokens || 512})\n"
                 "\n"
                 'output = llm.chat([{"role": "user", "content": "What is machine learning?"}], sampling_params)\n'
                 "print(output[0].outputs[0].text)"
             )},
        ],
    },
    "text-llamacpp": {
        "component_name": "TextLlamacpp",
        "props": "{ ggufRepo, samplingFlags }",
        "replacement_group": "text",
        "source": "config",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "brew install llama.cpp"},
            {"type": "label", "text": "Run:"},
            # samplingFlags is optional: LFM3 GGUFs store their sampling defaults
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{samplingFlags ? `llama cli -hf ${ggufRepo} \\\\\n    ${samplingFlags}` : `llama cli -hf ${ggufRepo}`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p><strong>Web chat UI and OpenAI-compatible API</strong> at <code>http://localhost:9931</code>:</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{samplingFlags ? `llama serve -hf ${ggufRepo} \\\\\n    ${samplingFlags}` : `llama serve -hf ${ggufRepo}`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p>The <code>-hf</code> flag downloads the model directly from Hugging Face. For other installation methods and advanced usage, see the <a href="/deployment/on-device/llama-cpp">llama.cpp guide</a>.</p>'},
        ],
    },
    "vl-transformers": {
        "component_name": "VlTransformers",
        "props": '{ modelId, samplingArgs = "temperature=0.1, min_p=0.15, repetition_penalty=1.05" }',
        "replacement_group": "vl",
        "code_replacements": [
            (
                "temperature=0.1, min_p=0.15, repetition_penalty=1.05",
                "${samplingArgs}",
            ),
        ],
        "source": "notebook",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": 'pip install "transformers>=5.2.0" pillow torch torchvision accelerate'},
            {"type": "label", "text": "Download & Run:"},
            {"type": "notebook_code", "language": "python"},
        ],
    },
    "vl-vllm": {
        "component_name": "VlVllm",
        "props": '{ modelId, samplingArgs = "temperature=0.1, min_p=0.15, repetition_penalty=1.05" }',
        "replacement_group": "vl",
        "code_replacements": [
            (
                "    temperature=0.1,\n"
                "    min_p=0.15,\n"
                "    repetition_penalty=1.05,\n",
                "    ${samplingArgs},\n",
            ),
        ],
        "source": "notebook",
        "sections": [
            {"type": "label", "text": "Install:"},
            {"type": "code_block", "language": "bash",
             "code": "uv pip install vllm==0.19.0"},
            {"type": "code_block", "language": "bash",
             "code": 'uv pip install transformers==5.5.0 pillow'},
            {"type": "label", "text": "Run:"},
            {"type": "notebook_code", "language": "python"},
        ],
    },
    "vl-llamacpp": {
        "component_name": "VlLlamacpp",
        "props": "{ ggufRepo, samplingFlags }",
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
            # samplingFlags is optional: LFM3 GGUFs store their sampling defaults
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`llama cli \\\\\n    -hf ${ggufRepo}:Q4_0 \\\\\n    --image test_image.jpg \\\\\n    -p "What\'s in this image?"${samplingFlags ? ` \\\\\n    ${samplingFlags}` : ""}`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p><strong>Web chat UI and OpenAI-compatible API</strong> at <code>http://localhost:9931</code>:</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{samplingFlags ? `llama serve -hf ${ggufRepo}:Q4_0 \\\\\n    ${samplingFlags}` : `llama serve -hf ${ggufRepo}:Q4_0`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p>The <code>-hf</code> flag downloads the model and its vision projector directly from Hugging Face. Use <code>--image-max-tokens</code> to control image token budget.</p>'},
            {"type": "raw_html",
             "html": '<p>For advanced usage, see the <a href="/deployment/on-device/llama-cpp#vision-models">llama.cpp guide</a>.</p>'},
        ],
    },
    "audio-llamacpp": {
        "component_name": "AudioLlamacpp",
        "props": "{ ggufRepo, serveFlags, ttsFlags, asrAutoLanguage = false }",
        "source": "config",
        "preamble": 'const modelName = ggufRepo.split("/")[1].replace(/-GGUF$/, "");',
        "sections": [
            {"type": "raw_html",
             "html": '<p>Requires llama.cpp 0.8.0 (b11960) or later. Add a quantization tag to pick a file; with <code>-hf</code>, llama.cpp also downloads the projector.</p>'},
            {"type": "raw_html",
             "html": '<p><strong>Web chat and API server:</strong></p>'},
            {"type": "raw_html",
             "html": '<p>Start a web chat UI and an OpenAI-compatible API at <code>http://localhost:9931</code>:</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`llama serve -hf ${ggufRepo}:Q4_K_M${serveFlags ? ` ${serveFlags}` : ""}`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p>The server also handles real-time voice conversations, including tool calls, on its <code>/v1/realtime</code> WebSocket API. The recommended sampling parameters are stored in the GGUF, so no sampling flags are needed. To ask one question from the command line, use <code>llama cli</code>.</p>'},
            {"type": "raw_html",
             "html": '<p><strong>ASR (Audio to Text):</strong></p>'},
            {"type": "raw_html",
             "html": '<p>Use the system prompt <code>Perform ASR in &lt;language&gt;.</code>{asrAutoLanguage ? <>, or <code>Perform ASR.</code> to let the model infer the language.</> : null} Pass it with <code>-sys</code>: as a regular prompt, the model describes the audio instead of transcribing it.</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`llama cli -hf ${ggufRepo}:Q4_K_M \\\\\n  --audio speech.wav -sys "Perform ASR in English." -p "<__media__>"`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p><strong>TTS (Text to Audio):</strong></p>'},
            {"type": "raw_html",
             "html": '<p><code>--tts-lang</code> takes a language code (default <code>en</code>) and <code>--tts-voice</code> is <code>female</code> (default) or <code>male</code>. The audio sampling parameters from the model card are stored in the GGUF.</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`hf download ${ggufRepo} ${modelName}-Q4_K_M.gguf mmproj-${modelName}-Q8_0.gguf --local-dir .\n\nllama-tts -m ${modelName}-Q4_K_M.gguf -mm mmproj-${modelName}-Q8_0.gguf \\\\\n  -p "Hello world"${ttsFlags ? ` ${ttsFlags}` : ""} -o out.wav`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p>For more options, see the <a href="/deployment/on-device/llama-cpp#audio-and-omni-models">llama.cpp guide</a>.</p>'},
        ],
    },
    "omni-llamacpp": {
        "component_name": "OmniLlamacpp",
        "props": "{ ggufRepo, serveFlags, ttsFlags }",
        "source": "config",
        "preamble": 'const modelName = ggufRepo.split("/")[1].replace(/-GGUF$/, "");',
        "sections": [
            {"type": "raw_html",
             "html": '<p>Requires llama.cpp 0.8.0 (b11960) or later. Add a quantization tag to pick a file; with <code>-hf</code>, llama.cpp also downloads the vision and audio projector.</p>'},
            {"type": "raw_html",
             "html": '<p><strong>Web chat and API server:</strong></p>'},
            {"type": "raw_html",
             "html": '<p>Start a web chat UI and an OpenAI-compatible API at <code>http://localhost:9931</code>:</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`llama serve -hf ${ggufRepo}:Q4_K_M${serveFlags ? ` ${serveFlags}` : ""}`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p>The server also handles real-time voice conversations, including tool calls, on its <code>/v1/realtime</code> WebSocket API. The recommended sampling parameters are stored in the GGUF, so no sampling flags are needed. To ask one question from the command line, use <code>llama cli</code>.</p>'},
            {"type": "raw_html",
             "html": '<p><strong>ASR (Audio to Text):</strong></p>'},
            {"type": "raw_html",
             "html": '<p>Use the system prompt <code>Perform ASR in &lt;language&gt;.</code> Pass it with <code>-sys</code>: as a regular prompt, the model describes the audio instead of transcribing it.</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`llama cli -hf ${ggufRepo}:Q4_K_M \\\\\n  --audio speech.wav -sys "Perform ASR in English." -p "<__media__>"`}\n</CodeBlock>'},
            {"type": "label", "text": "Image understanding:"},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`llama cli -hf ${ggufRepo}:Q4_K_M \\\\\n  --image photo.png -p "Describe this image."`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p><strong>Video understanding:</strong> the model sees the frames and hears the soundtrack of the video. Use the system prompt <code>Answer questions about the video using what you see and hear.</code> Video input needs <code>ffmpeg</code> in <code>PATH</code>.</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`curl -sL -o reading.mp4 https://huggingface.co/datasets/raushan-testing-hf/videos-test/resolve/4cba700bd771f44d72b549253da025c32e944d42/sample_demo_1.mp4  # a child reading a book\n\nllama cli -hf ${ggufRepo}:Q4_K_M \\\\\n  --video reading.mp4 -sys "Answer questions about the video using what you see and hear." \\\\\n  -p "What happens here, and what can you hear?"`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p><strong>TTS (Text to Audio):</strong></p>'},
            {"type": "raw_html",
             "html": '<p><code>--tts-lang</code> takes a language code (default <code>en</code>) and <code>--tts-voice</code> is <code>female</code> (default) or <code>male</code>. The audio sampling parameters from the model card are stored in the GGUF.</p>'},
            {"type": "raw_html",
             "html": '<CodeBlock language="bash">\n{`hf download ${ggufRepo} ${modelName}-Q4_K_M.gguf mmproj-${modelName}-Q8_0.gguf --local-dir .\n\nllama-tts -m ${modelName}-Q4_K_M.gguf -mm mmproj-${modelName}-Q8_0.gguf \\\\\n  -p "Hello world"${ttsFlags ? ` ${ttsFlags}` : ""} -o out.wav`}\n</CodeBlock>'},
            {"type": "raw_html",
             "html": '<p>For more options, see the <a href="/deployment/on-device/llama-cpp#audio-and-omni-models">llama.cpp guide</a>.</p>'},
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


def apply_replacements(code, group, code_replacements=()):
    for old, new in REPLACEMENTS[group]:
        code = code.replace(old, new)
    for old, new in code_replacements:
        code = code.replace(old, new)
    return code


def render_code_block(code, language):
    # Backslashes must be escaped inside JS template literals
    escaped_code = code.replace("\\", "\\\\").replace("`", "\\`")
    lines = [
        f'<CodeBlock language="{language}">',
        "{`" + escaped_code + "`}",
        "</CodeBlock>",
    ]
    return "\n".join(lines)


def render_section(section, notebook_code=None):
    section_type = section["type"]

    if section_type == "label":
        return f"<p><strong>{section['text']}</strong></p>"

    if section_type == "code_block":
        return render_code_block(section["code"], section["language"])

    if section_type == "code_block_margin":
        return render_code_block(section["code"], section["language"])

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
    group = config.get("replacement_group")
    notebook_code = None

    if config["source"] == "notebook":
        raw_code = notebook_cells.get(name)
        if raw_code is None:
            logger.error("No notebook cell found for snippet %s", name)
            return None
        notebook_code = apply_replacements(
            raw_code,
            group,
            config.get("code_replacements", ()),
        )

    parts = []
    for section in config["sections"]:
        parts.append(render_section(section, notebook_code))

    body = "\n".join(parts)
    component_name = config["component_name"]
    props = config["props"]

    preamble = config.get("preamble")
    if preamble:
        return f"export const {component_name} = ({props}) => {{\n{preamble}\nreturn (\n<div>\n{body}\n</div>\n);\n}};\n"
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
