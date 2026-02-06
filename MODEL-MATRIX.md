# Model Implementation Matrix

> **Maintainer reference only.** This file is excluded from the Mintlify docs build via `.mintignore`.
> Last updated: 2026-02-06

## Quick Reference: Snippet Mapping

| Category | Snippet files | Used by |
|----------|--------------|---------|
| Standard text | `snippets/quickstart/text-transformers.mdx`, `text-vllm.mdx`, `text-llamacpp.mdx` | LFM2.5-1.2B-Instruct, Thinking, JP; LFM2-8B-A1B, 2.6B, 2.6B-Exp, 1.2B, 700M, 350M |
| Vision | `snippets/quickstart/vl-transformers.mdx`, `vl-vllm.mdx`, `vl-llamacpp.mdx` | LFM2.5-VL-1.6B; LFM2-VL-3B, VL-1.6B, VL-450M |
| Audio | Inline (unique code) | LFM2.5-Audio-1.5B, LFM2-Audio-1.5B |
| ColBERT | Inline (PyLate) | LFM2-ColBERT-350M |
| Nanos | Inline (custom prompts/temps) | Extract, RAG, Transcript, Math, ENJP-MT, PII-Extract-JP |

## Full Implementation Matrix

| Model | HF ID | Transformers | llama.cpp | vLLM | Ollama | MLX | ONNX | Notes |
|-------|-------|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **LFM2.5 Text** |
| 1.2B-Instruct | `LiquidAI/LFM2.5-1.2B-Instruct` | Standard | Standard | Standard | Standard | Yes | Yes | Flagship |
| 1.2B-Thinking | `LiquidAI/LFM2.5-1.2B-Thinking` | Standard | Standard | Standard | Standard | Yes | Yes | |
| 1.2B-Base | `LiquidAI/LFM2.5-1.2B-Base` | Base (no chat) | -- | Base (no chat) | -- | -- | Yes | Raw text completion |
| 1.2B-JP | `LiquidAI/LFM2.5-1.2B-JP` | Standard | Standard | Standard | Standard | Yes | Yes | Japanese |
| **LFM2.5 Vision & Audio** |
| VL-1.6B | `LiquidAI/LFM2.5-VL-1.6B` | VL (v5 req) | VL (--image) | VL (custom wheel) | NO (PR#14069) | Yes | Yes | |
| Audio-1.5B | `LiquidAI/LFM2.5-Audio-1.5B` | liquid-audio | Custom binary | NO | NO | NO | Yes | |
| **LFM2 Text** |
| 8B-A1B | `LiquidAI/LFM2-8B-A1B` | Standard | Standard | Standard | Standard | Yes | Yes | MoE |
| 2.6B | `LiquidAI/LFM2-2.6B` | Standard | Standard | Standard | Standard | Yes | Yes | |
| 2.6B-Exp | `LiquidAI/LFM2-2.6B-Exp` | Standard | Standard | Standard | Standard | NO | NO | |
| 1.2B | `LiquidAI/LFM2-1.2B` | Standard | Standard | Standard | Standard | Yes | Yes | Deprecated |
| 700M | `LiquidAI/LFM2-700M` | Standard | Standard | Standard | Standard | Yes | Yes | |
| 350M | `LiquidAI/LFM2-350M` | Standard | Standard | Standard | Standard | Yes | Yes | |
| **LFM2 Vision** |
| VL-3B | `LiquidAI/LFM2-VL-3B` | VL (v5 req) | VL | VL (custom wheel) | NO (PR#14069) | Yes | Yes | |
| VL-1.6B | `LiquidAI/LFM2-VL-1.6B` | VL (v5 req) | VL | VL (custom wheel) | NO (PR#14069) | Yes | Yes | Deprecated |
| VL-450M | `LiquidAI/LFM2-VL-450M` | VL (v5 req) | VL | VL (custom wheel) | NO (PR#14069) | Yes | Yes | |
| **LFM2 Audio** |
| Audio-1.5B | `LiquidAI/LFM2-Audio-1.5B` | liquid-audio | Custom binary | NO | NO | NO | NO | Deprecated |
| **Nanos** |
| 1.2B-Extract | `LiquidAI/LFM2-1.2B-Extract` | temp=0, do_sample=False | temp=0 | -- | -- | NO | Yes | Single-turn, schema prompt |
| 350M-Extract | `LiquidAI/LFM2-350M-Extract` | temp=0, do_sample=False | temp=0 | -- | -- | NO | Yes | Single-turn, schema prompt |
| 1.2B-RAG | `LiquidAI/LFM2-1.2B-RAG` | temp=0, do_sample=False | temp=0 | -- | -- | NO | Yes | Single-turn |
| 2.6B-Transcript | `LiquidAI/LFM2-2.6B-Transcript` | temp=0.3 | temp=0.3 | -- | -- | NO | Yes | Structured input |
| ColBERT-350M | `LiquidAI/LFM2-ColBERT-350M` | PyLate only | NO | NO | NO | NO | NO | Late-interaction retrieval |
| 350M-ENJP-MT | `LiquidAI/LFM2-350M-ENJP-MT` | Standard | Standard | -- | -- | Yes | Yes | System prompt controls direction |
| 350M-Math | `LiquidAI/LFM2-350M-Math` | Standard | Standard | -- | -- | NO | Yes | |
| 350M-PII-JP | `LiquidAI/LFM2-350M-PII-Extract-JP` | temp=0 | temp=0 | -- | -- | NO | NO | Japanese-specific |
| 1.2B-Tool | `LiquidAI/LFM2-1.2B-Tool` | -- | -- | -- | -- | NO | Yes | Deprecated, migration guide |

## Version Pins

| Dependency | Version | Reason |
|-----------|---------|--------|
| transformers | `>=5.0.0` | VL models require v5; standard models work with v5 too |
| transformers (git fallback) | `3c2517727ce28a30f5044e01663ee204deb1cdbe` | For VL if v5 has issues |
| vLLM | `==0.14` | Latest stable with LFM support |
| vLLM (VL custom wheel) | commit `72506c98349d6bcd32b4e33eec7b5513453c1502` | VL support not yet upstream |
| llama.cpp | Latest via `brew install` or b7075+ binaries | |

## Known Limitations

- **Ollama + VL models**: Does NOT work. PR pending: https://github.com/ollama/ollama/pull/14069
- **vLLM + VL models**: Requires custom precompiled wheel (not standard pip install)
- **Audio models**: Use `liquid-audio` library, not standard Transformers
- **Audio + llama.cpp**: Requires special binary (`llama-liquid-audio-cli`) with mmproj/vocoder files

## Update Checklist

When updating a version pin or code pattern:

1. Update the relevant snippet file(s) in `snippets/quickstart/`
2. Update the corresponding main inference page in `docs/inference/`
3. Update this matrix if version pins changed
4. Nano/Audio/ColBERT pages: update inline code manually
5. Run `npx mintlify dev` and spot-check a model page
