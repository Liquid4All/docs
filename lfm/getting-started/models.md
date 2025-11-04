# Models

The LFM model collection includes general-purpose language models, vision-language models, task-specific models, and audio models across various parameter sizes.

- These models are built on the backbone of a new hybrid architecture that's designed for incredibly fast training and inference. Learn more in our [blog post](https://www.liquid.ai/blog/liquid-foundation-models-v2-our-second-series-of-generative-ai-models).
- All models support a **32k token text context length** for extended conversations and document processing.
- Our models are compatible with various open-source deployment libraries including [Transformers](../inference/transformers.md), [llama.cpp](../inference/llama-cpp.md), [vLLM](../inference/vllm.md), [MLX](../inference/mlx.md), [Ollama](../inference/ollama.md), and our own edge deployment platform [LEAP](../frameworks/leap.md).

## 💬 LFM2

[LFM2](https://huggingface.co/collections/LiquidAI/lfm2-686d721927015b2ad73eaa38) is a family of general-purpose text-only language models optimized for edge AI and on-device deployment.

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-8B-A1B`](https://huggingface.co/LiquidAI/LFM2-8B-A1B) | MoE model with 8B total parameters, 1.5B active per token for efficient inference. Best performance. |
| [`LiquidAI/LFM2-2.6B`](https://huggingface.co/LiquidAI/LFM2-2.6B) | High-performance model balancing capability and efficiency. |
| [`LiquidAI/LFM2-1.2B`](https://huggingface.co/LiquidAI/LFM2-1.2B) | Compact model for resource-constrained environments. |
| [`LiquidAI/LFM2-700M`](https://huggingface.co/LiquidAI/LFM2-700M) | Lightweight model for edge deployment. |
| [`LiquidAI/LFM2-350M`](https://huggingface.co/LiquidAI/LFM2-350M) | Tiny model for big data operations and edge deployment. Fastest inference. |

## 👁️ LFM2-VL

[LFM2-VL](https://huggingface.co/collections/LiquidAI/lfm2-vl-68963bbc84a610f7638d5ffa) is a family of Vision Language Models (VLMs) that support text and image as inputs and text as outputs. These models are built on the LFM2 text model backbone with dynamic, user-tunable SigLIP2 NaFlex image encoders (Base 86M and shape-optimized 400M variants).

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-VL-3B`](https://huggingface.co/LiquidAI/LFM2-VL-3B) | Highest-capacity multimodal model with enhanced visual understanding and reasoning. |
| [`LiquidAI/LFM2-VL-1.6B`](https://huggingface.co/LiquidAI/LFM2-VL-1.6B) | Fast and capable model for scene understanding and other vision language tasks. |
| [`LiquidAI/LFM2-VL-450M`](https://huggingface.co/LiquidAI/LFM2-VL-450M) | Compact multimodal model for edge deployment and fast inference. |

## 🎵 LFM2-Audio

[LFM2-Audio](https://huggingface.co/collections/LiquidAI/lfm2-audio-68ddd9cf81a89f1f4b5bb391) is a family of audio foundation models that support text and audio both as inputs and outputs.

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-Audio-1.5B`](https://huggingface.co/LiquidAI/LFM2-Audio-1.5B) | Audio-to-audio processing model for speech tasks, like chat, ASR, and TTS. |

## 🎯 Liquid Nanos

[Liquid Nanos](https://huggingface.co/collections/LiquidAI/liquid-nanos-68b98d898414dd94d4d5f99a) are task-specific models fine-tuned for specialized use cases.

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-1.2B-Extract`](https://huggingface.co/LiquidAI/LFM2-1.2B-Extract) | Extract important information from a wide variety of unstructured documents into structured outputs like JSON. |
| [`LiquidAI/LFM2-350M-Extract`](https://huggingface.co/LiquidAI/LFM2-350M-Extract) | Smaller version of the extraction model. |
| [`LiquidAI/LFM2-350M-ENJP-MT`](https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT) | Near real-time bi-directional Japanese/English translation of short-to-medium inputs. |
| [`LiquidAI/LFM2-1.2B-RAG`](https://huggingface.co/LiquidAI/LFM2-1.2B-RAG) | Answer questions based on provided contextual documents, for use in RAG systems. |
| [`LiquidAI/LFM2-1.2B-Tool`](https://huggingface.co/LiquidAI/LFM2-1.2B-Tool) | Efficient model optimized for concise and precise tool calling. See the [Tool Use guide](tool-use.md) for details. |
| [`LiquidAI/LFM2-350M-Math`](https://huggingface.co/LiquidAI/LFM2-350M-Math) | Tiny reasoning model designed for tackling tricky math problems. |
| [`LiquidAI/LFM2-350M-PII-Extract-JP`](https://huggingface.co/LiquidAI/LFM2-350M-PII-Extract-JP) | Extract personally identifiable information (PII) from Japanese text and output it in JSON format. |
| [`LiquidAI/LFM2-ColBERT-350M`](https://huggingface.co/LiquidAI/LFM2-ColBERT-350M) | Embed documents and queries for fast retrieval and reranking across many languages. |

## GGUF Models

GGUF quantized versions are available for all LFM2 models for efficient inference with [llama.cpp](../inference/llama-cpp.md), [LM Studio](../inference/lm-studio.md), and [Ollama](../inference/ollama.md). These models offer reduced memory usage and faster CPU inference.

To access our official GGUF models, append `-GGUF` to any model repository name (e.g., `LiquidAI/LFM2-1.2B-GGUF`). All models are available in multiple quantization levels (`Q4_0`, `Q4_K_M`, `Q5_K_M`, `Q6_K`, `Q8_0`, `F16`).

## MLX Models

MLX quantized versions are available for many of the LFM2 model library for efficient inference on Apple Silicon with [MLX](../inference/mlx.md). These models leverage unified memory architecture for optimal performance on M-series chips.

Browse all MLX-compatible models at [mlx-community LFM2 models](https://huggingface.co/mlx-community/collections?search=LFM). All models are available in multiple quantization levels (`4-bit`, `5-bit`, `6-bit`, `8-bit`, `bf16`).
