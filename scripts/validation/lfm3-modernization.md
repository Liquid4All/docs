# LFM3 documentation validation

Checked on 2026-11-17. These are integration smoke tests, not quality benchmarks or certification of every checkpoint, platform, or modality.

## Executed checks

| Runtime | Environment | Models and checks | Result |
| --- | --- | --- | --- |
| Transformers 5.23.0 | Modal L4; PyTorch 2.15.0 | LFM3-1.7B, LFM2.5-1.2B-Instruct, LFM2-1.2B text generation; LFM3-VL-2B, LFM2.5-VL-1.6B, LFM2-VL-1.6B image questions | All six passed |
| TRL 1.18.1 / PEFT 0.21.3 | Same L4 environment | LFM3-1.7B: two LoRA optimizer steps, finite loss, adapter attachment and saving | Passed; no training-quality claim |
| vLLM 0.34.0 | Modal H100; Transformers 5.22.2; PyTorch 2.14.0 | LFM3-1.7B, LFM2.5-1.2B-Instruct, LFM2-1.2B, LFM3-VL-2B, LFM2.5-VL-1.6B: chat, SSE streaming, parsed tool calls, constrained JSON | All 20 API probes passed |
| vLLM generated Python snippets | Same H100 environment | Exact text/VL snippets for LFM2.5 and original LFM2 | All four executed successfully |
| SGLang 0.5.24.dev1592+g47361c57b | Modal H100; official v0.5.23-cu130 image plus source integration; Transformers 5.19.0; PyTorch 2.14.1+cu130 | Same five checkpoints as vLLM: chat, SSE streaming, parsed tool calls, constrained JSON | All 20 API probes passed |
| llama.cpp b12359 (b1b770d) | M4 Max / Metal | Q4_K_M text and Q4_0 VL: the same five checkpoints as vLLM; chat, tool calls, constrained JSON | 14/15 passed; original LFM2 text answered in prose rather than calling the tool |
| Ollama 0.40.16 | M4 Max | Official `lfm3` and LFM2.5-1.2B-Instruct GGUF: native chat, tools, JSON; original LFM2-1.2B GGUF: chat and tool request | LFM3/LFM2.5 passed all three; original LFM2 chat passed but its imported model rejected tools with HTTP 400 |
| MLX-VLM 0.8.0 / MLX-LM 0.32.2 | M4 Max; MLX 0.32.4 | LFM3 text/VL, LFM2.5 and original LFM2 text, older LFM2.5-VL, LFM3-Audio ASR, LFM3-Omni TTS | All seven checks passed; TTS produced a nonempty 24 kHz WAV |
| LiquidONNX 26857c2 | Modal CPU; ONNX Runtime 1.30.0; GenAI 0.17.1; Transformers 5.23.0 | Published LFM3 text/VL Q4 graphs; fresh LFM3-1.7B and LFM2.5-1.2B-Instruct Q4 exports and inference; clean pinned uv installation | Both exports and all four inference checks passed |
| New LFM3 Transformers notebook | Modal L4, then repository Modal CI | Execute the exact notebook cells | Passed; all 11 repository notebook CI jobs also passed their configured runnable cells |
| Repository serving verifier | Local b12359 LFM3 server | Chat, SSE streaming, parsed tool name/arguments, strict JSON content | All four checks passed |

Text checks ask for France's capital and require Paris in the answer. Image checks use a synthetic solid red image and require red in the answer. Serving tests inspect structured `tool_calls` and JSON responses rather than treating an HTTP 200 as sufficient. The reusable verifier additionally checks completion reasons and tool arguments.

## Reproduce serving checks

Start the server using the relevant documentation page, then run from the repository root:

```bash
uv run scripts/verify_serving.py \
  --framework vllm --base-url http://localhost:8000/v1 \
  --model LiquidAI/LFM3-1.7B --output /tmp/vllm-lfm3.json

uv run scripts/verify_serving.py \
  --framework sglang --base-url http://localhost:30000/v1 \
  --model LiquidAI/LFM3-VL-2B --vision --output /tmp/sglang-lfm3-vl.json

uv run scripts/verify_serving.py \
  --framework llama --base-url http://localhost:8080/v1 \
  --model lfm3-1.7b --output /tmp/llama-lfm3.json
```

Use `--repetition-penalty 1.05` for the older representative checkpoints and change the server's model/parser settings as documented. The verifier expects a local endpoint without authentication. For vision checks, start a server with the appropriate image encoder/projector.

The SGLang matrix used the Dockerfile dependencies in the guide and `--context-length 4096 --mem-fraction-static 0.8`. Text LFM3 used `qwen3` / `qwen3_coder`; LFM3-VL used `auto` parsers; older checkpoints used `lfm2`. Tool arguments and completion reasons were also inspected for the successful non-streaming requests. The CUDA-image recipe was tested with normal kernel compilation and graph capture enabled. First startup can spend several minutes compiling kernels. The VL model page additionally retains its whitespace constraint flag from the earlier capability verification.

The vLLM matrix used `--max-model-len 4096 --gpu-memory-utilization 0.8 --enforce-eager`. LFM3 used `qwen3` reasoning and `qwen3_coder` tool parsing; older models used `lfm2` tool parsing. Keep vLLM's own Transformers dependency; do not override it with the direct-Transformers guide's pin.

## Findings retained in the docs

- LFM3 on MLX uses MLX-VLM, not the older MLX-LM path.
- LFM3 uses different serving parsers from LFM2/LFM2.5. A parser separates reasoning from final output; it does not switch thinking off.
- ONNX runtime families are different: plain ONNX Runtime for LFM3 and GenAI for older LiquidONNX exports. Published bundles can come from other export pipelines.
- ONNX external data must resolve within the graph folder. Materialize Hugging Face cache symlinks before loading these graphs.
- Original LFM2 tool behavior differs across the tested imports. A missed tool call in llama.cpp is a model response, not proof that its parser lacks support. Ollama's HTTP 400 is a separate imported-model capability restriction.
- Older native bindings, provider recipes, browser demos, training notebooks, and DSpark target/drafter pairs retain their actual checkpoints. They are not made LFM3-compatible by renaming a model ID.

## Validation limits

This change does not freshly certify iOS/Android native builds, Python/Node/.NET in-process bindings, LM Studio/Atomic Chat GUIs, provider deployments, every quantization, MoEs, d1, DSpark, video, or LFM3 audio/omni paths in every runtime. Historical notebooks remain scoped to their original checkpoints. Repository CI exercises their configured runnable cells, respecting existing skip directives and shortened training settings; passing CI is not a full training-quality evaluation. The new training example verifies two optimizer steps; full SFT, DPO, GRPO, and multimodal training require separate evaluation.

## Documentation checks

- Mintlify strict validation and internal broken-link check.
- Public URL snapshot (250 active URLs, including all 13 API endpoint pages).
- Generated snippets match their notebook/generator sources.
- Notebook Ruff and mypy checks.
- Python syntax checks (54 MDX Python blocks) and `git diff --check`.
- Three notebook-preprocessing regression tests, including `%pip` extraction before script execution.
