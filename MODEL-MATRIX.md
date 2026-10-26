# Model Implementation Matrix

> **Maintainer reference only.** This file is excluded from the Mintlify docs build via `.mintignore`.
> Last updated: 2026-10-26

## Quick Reference: Snippet Mapping

| Category | Snippet files | Used by |
|----------|--------------|---------|
| Standard text | `snippets/quickstart/text-transformers.mdx`, `text-vllm.mdx`, `text-sglang.mdx`, `text-llamacpp.mdx` | LFM2.5-1.2B-Instruct, Thinking, JP-202606, JP (deprecated), 350M, 230M, 2.6B; llama.cpp/vLLM/SGLang only for 8B-A1B and 24B-A2B (inline Transformers); LFM2-24B-A2B, 8B-A1B, 2.6B, 2.6B-Exp, 1.2B, 700M, 350M |
| Vision | `snippets/quickstart/vl-transformers.mdx`, `vl-vllm.mdx`, `vl-sglang.mdx`, `vl-llamacpp.mdx` | LFM2.5-VL-3B, VL-1.6B, VL-450M; LFM2-VL-3B, VL-1.6B, VL-450M |
| Audio / Omni | Inline (unique code) | LFM3-Audio-2B, LFM3-Omni-2B, LFM2.5-Audio-1.5B, LFM2.5-Audio-1.5B-JP, LFM2-Audio-1.5B |
| Retrieval | Inline (sentence-transformers / PyLate / GGUF) | LFM2.5-Embedding-350M, LFM2.5-ColBERT-350M, LFM2-ColBERT-350M |
| Encoders | Inline (Transformers / llama.cpp) | LFM2.5-Encoder-350M, LFM2.5-Encoder-230M |
| Decision | Inline (Transformers `system_one` / llama.cpp `/v1/systemone`) | d1-2B, d1-omni-2B, d1-3B, d1-omni-600M; hosted d1.1 and d1-ultra on `lfm/models/d1.mdx` |
| Nanos | Inline (custom prompts/temps) | VL-Extract, Transcript, Math, ENJP-MT, PII-Extract-JP; deprecated Extract, RAG, Tool |

## Full Implementation Matrix

MLX/ONNX "Yes" means a repo exists (LiquidAI, or mlx-community/onnx-community where LiquidAI has none); `lfm/models/complete-library.mdx` links the exact repos. Deprecated models are listed on `lfm/help/deprecations.mdx` and not in the public matrix.

| Model | HF ID | Transformers | llama.cpp | vLLM | Ollama | MLX | ONNX | Notes |
|-------|-------|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **LFM3** |
| 1.7B | `LiquidAI/LFM3-1.7B` | Inline (pipeline, remote code) | Standard (LFM3 build) | Standard | -- | Yes | Yes | 256K ctx; also FP8 and NVFP4 for SGLang; TODO parsers/versions |
| 1.7B-Base | `LiquidAI/LFM3-1.7B-Base` | Base (no chat) | -- | -- | -- | -- | -- | No docs page |
| VL-2B | `LiquidAI/LFM3-VL-2B` | Inline | Inline (llama-server) | Inline (serve) | -- | Yes | Yes | Video input, thinking; TODO versions/flags |
| Audio-2B | `LiquidAI/LFM3-Audio-2B` | Inline (remote code) | TODO | NO | NO | Yes | Yes | 19 speech languages; audio codec bundled in the repo |
| Omni-2B | `LiquidAI/LFM3-Omni-2B` | Inline (remote code) | Inline (realtime server) | NO | NO | Yes | Yes | SGLang text output only; TODO flags |
| d1-2B | `LiquidAI/d1-2B` | system_one (remote code) | TODO | NO | NO | Yes | Yes | Typed answers; 128K ctx |
| d1-omni-2B | `LiquidAI/d1-omni-2B` | system_one (remote code) | TODO | NO | NO | Yes | Yes | Audio input; 128K ctx |
| **LFM2.5 Text** |
| 1.2B-Instruct | `LiquidAI/LFM2.5-1.2B-Instruct` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM3-1.7B |
| 1.2B-Thinking | `LiquidAI/LFM2.5-1.2B-Thinking` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM3-1.7B |
| 1.2B-Base | `LiquidAI/LFM2.5-1.2B-Base` | Base (no chat) | -- | Base (no chat) | -- | -- | Yes | Raw text completion; no docs page |
| 1.2B-JP-202606 | `LiquidAI/LFM2.5-1.2B-JP-202606` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM3-1.7B |
| 1.2B-JP | `LiquidAI/LFM2.5-1.2B-JP` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-1.2B-JP-202606 |
| 230M | `LiquidAI/LFM2.5-230M` | Standard | Standard | Standard | Standard | Yes | Yes | Smallest LFM2.5 |
| 350M | `LiquidAI/LFM2.5-350M` | Standard | Standard | Standard | Standard | Yes | Yes | |
| 2.6B | `LiquidAI/LFM2.5-2.6B` | Standard | Standard | Standard | Standard | Yes | Yes | 131K ctx, 128K vocab |
| 8B-A1B | `LiquidAI/LFM2.5-8B-A1B` | Inline | Standard | Standard | Standard | Yes | Yes | MoE, 128K ctx |
| 24B-A2B | `LiquidAI/LFM2.5-24B-A2B` | Inline | Standard | Standard | Standard | Yes | Yes | MoE, 131K ctx; FP8 checkpoint |
| **LFM2.5 Vision & Audio** |
| VL-3B | `LiquidAI/LFM2.5-VL-3B` | VL (v5 req) | VL (--image) | VL | NO (PR#14069) | Yes | Yes | |
| VL-1.6B | `LiquidAI/LFM2.5-VL-1.6B` | VL (v5 req) | VL (--image) | VL | NO (PR#14069) | Yes (community) | Yes | |
| VL-450M | `LiquidAI/LFM2.5-VL-450M` | VL (v5 req) | VL (--image) | VL | NO (PR#14069) | Yes | Yes | |
| Audio-1.5B | `LiquidAI/LFM2.5-Audio-1.5B` | liquid-audio | Custom binary | NO | NO | Yes (community) | Yes | Deprecated; use LFM3-Audio-2B |
| Audio-1.5B-JP | `LiquidAI/LFM2.5-Audio-1.5B-JP` | liquid-audio | Custom binary | NO | NO | NO | NO | Japanese |
| **Decision** |
| d1-3B | `LiquidAI/d1-3B` | system_one (remote code) | /v1/systemone | NO | NO | Yes (mlx-vlm) | NO | Deprecated; use d1-2B. Also d1-3B-w8a8 (torchao INT8) |
| d1-omni-600M | `LiquidAI/d1-omni-600M` | system_one (remote code) | /v1/systemone | NO | NO | Yes (mlx-vlm) | NO | Text + images or audio; 16K ctx |
| d1.1 / d1-ultra | API only (`api.liquid.ai/decisions/v1/systemone`) | -- | -- | -- | -- | -- | -- | Also on OpenRouter and Vercel AI Gateway |
| **LFM2 Text** |
| 24B-A2B | `LiquidAI/LFM2-24B-A2B` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-24B-A2B |
| 2.6B | `LiquidAI/LFM2-2.6B` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-2.6B |
| 2.6B-Exp | `LiquidAI/LFM2-2.6B-Exp` | Standard | Standard | Standard | Standard | Yes (community) | Yes (community) | Deprecated; use LFM2.5-2.6B |
| 700M | `LiquidAI/LFM2-700M` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-1.2B-Instruct |
| 8B-A1B | `LiquidAI/LFM2-8B-A1B` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-8B-A1B |
| 1.2B | `LiquidAI/LFM2-1.2B` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-1.2B-Instruct |
| 350M | `LiquidAI/LFM2-350M` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated; use LFM2.5-350M |
| **LFM2 Vision** |
| VL-3B | `LiquidAI/LFM2-VL-3B` | VL (v5 req) | VL | VL | NO (PR#14069) | Yes | Yes | Deprecated; use LFM2.5-VL-3B |
| VL-1.6B | `LiquidAI/LFM2-VL-1.6B` | VL (v5 req) | VL | VL | NO (PR#14069) | Yes | Yes | Deprecated; use LFM2.5-VL-1.6B |
| VL-450M | `LiquidAI/LFM2-VL-450M` | VL (v5 req) | VL | VL | NO (PR#14069) | Yes | Yes | Deprecated; use LFM2.5-VL-450M |
| **LFM2 Audio** |
| Audio-1.5B | `LiquidAI/LFM2-Audio-1.5B` | liquid-audio | Custom binary | NO | NO | NO | NO | Deprecated; use LFM2.5-Audio-1.5B |
| **Nanos** |
| Encoder-350M | `LiquidAI/LFM2.5-Encoder-350M` | Transformers (MLM / fine-tune) | GGUF | -- | -- | NO | NO | 8K ctx |
| Encoder-230M | `LiquidAI/LFM2.5-Encoder-230M` | Transformers (MLM / fine-tune) | GGUF | -- | -- | NO | NO | 8K ctx |
| Embedding-350M | `LiquidAI/LFM2.5-Embedding-350M` | sentence-transformers | GGUF | -- | -- | Yes (community) | NO | Dense bi-encoder retrieval |
| ColBERT-350M | `LiquidAI/LFM2.5-ColBERT-350M` | PyLate / sentence-transformers | GGUF | -- | -- | Yes (community) | NO | Late-interaction retrieval |
| VL-1.6B-Extract | `LiquidAI/LFM2.5-VL-1.6B-Extract` | temp=0, do_sample=False | VL (--image) | VL | -- | NO | NO | Image schema extraction |
| VL-450M-Extract | `LiquidAI/LFM2.5-VL-450M-Extract` | temp=0, do_sample=False | VL (--image) | VL | -- | NO | NO | Compact image schema extraction |
| 2.6B-Transcript | `LiquidAI/LFM2-2.6B-Transcript` | temp=0.3 | temp=0.3 | -- | -- | Yes (community) | Yes | Structured input |
| 350M-ENJP-MT | `LiquidAI/LFM2-350M-ENJP-MT` | Standard | Standard | -- | -- | Yes (community) | Yes (community) | System prompt controls direction |
| 350M-Math | `LiquidAI/LFM2-350M-Math` | Standard | Standard | -- | -- | NO | Yes (community) | |
| 350M-PII-JP | `LiquidAI/LFM2-350M-PII-Extract-JP` | temp=0 | temp=0 | -- | -- | NO | NO | Japanese-specific |
| 1.2B-Extract | `LiquidAI/LFM2-1.2B-Extract` | temp=0, do_sample=False | temp=0 | -- | -- | NO | Yes (community) | Deprecated; use LFM2.5-1.2B-Instruct |
| 350M-Extract | `LiquidAI/LFM2-350M-Extract` | temp=0, do_sample=False | temp=0 | -- | -- | NO | Yes (community) | Deprecated; use LFM2.5-350M |
| 1.2B-RAG | `LiquidAI/LFM2-1.2B-RAG` | temp=0, do_sample=False | temp=0 | -- | -- | NO | Yes (community) | Deprecated; use LFM2.5-1.2B-Instruct + retrieval models |
| ColBERT-350M | `LiquidAI/LFM2-ColBERT-350M` | PyLate only | GGUF | NO | NO | NO | NO | Deprecated; use LFM2.5-ColBERT-350M |
| 1.2B-Tool | `LiquidAI/LFM2-1.2B-Tool` | -- | -- | -- | -- | NO | Yes (community) | Deprecated, migration guide |

## Version Pins

| Dependency | Version | Reason |
|-----------|---------|--------|
| transformers | `>=5.2.0` | VL models require v5; standard models work with v5 too |
| vLLM | `==0.19.0` | Latest stable with LFM support (text and vision) |
| llama.cpp | Latest via `brew install` or b7075+ binaries | |

## Known Limitations

- **Ollama + VL models**: Does NOT work. PR pending: https://github.com/ollama/ollama/pull/14069
- **vLLM + VL models**: Standard `vllm==0.19.0` install (see `snippets/quickstart/vl-vllm.mdx`)
- **Audio models**: Use `liquid-audio` library, not standard Transformers
- **Audio + llama.cpp**: Requires special binary (`llama-liquid-audio-cli`) with mmproj/vocoder files

## Update Checklist

When updating a version pin or code pattern:

1. Update the relevant snippet file(s) in `snippets/quickstart/`
2. Update the corresponding main inference page in `docs/inference/`
3. Update this matrix if version pins changed
4. Nano/Audio/ColBERT pages: update inline code manually
5. Run `npx mintlify dev` and spot-check a model page
