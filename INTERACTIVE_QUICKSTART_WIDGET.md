# Interactive Quickstart Widget

List of Inference engines:
- Transformers
- Ollama
- llama.cpp
- MLX
- iOS
- Android
- vLLM
- Transformers.js

List of use cases:
- Chat completions
- Vision understanding
- Audio & Transcription
- Code generation
- Text embeddings
- Function Calling & Agents

List of models with descriptions and supported deployment platforms:

- LFM2 models
  - Models:
    - LiquidAI/LFM2-8B-A1B
      - Description: LFM2-8B-A1B is the best on-device MoE in terms of both quality (comparable to 3-4B dense models) and speed (faster than Qwen3-1.7B). Code and knowledge capabilities are significantly improved compared to LFM2-2.6B. Quantized variants fit comfortably on high-end phones, tablets, and laptops.

    - LiquidAI/LFM2-2.6B
      - Description: Mid-size model for balanced performance

    - LiquidAI/LFM2-1.2B
      - Description: Compact model for general use

    - LiquidAI/LFM2-700M
      - Description: Smaller efficient model

    - LiquidAI/LFM2-350M
      - Description: Ultra-lightweight for edge devices
  
  - Use cases:
    - Text completions
    - Code generation
    - Function calling and Agents
  - Inference engines:
    - Transformers
    - Ollama
    - llama.cpp
    - MLX
    - iOS
    - Android
    - vLLM

- LFM2-VL
  - Models:
    - LiquidAI/LFM2-VL-3B
      - Description: Lightweight 3B vision-language model with enhanced visual reasoning and fine-grained perception, built on the LFM2 backbone for efficient multimodal understanding at variable resolutions.
    - LiquidAI/LFM2-VL-1.6B
      - Description: Compact 1.6B vision-language model balancing strong multimodal capabilities with efficient inference, built on the LFM2 backbone for practical visual understanding at variable resolutions.
    - LiquidAI/LFM2-VL-450M
      - Description: Ultra-lightweight 450M vision-language model optimized for resource-constrained deployments, delivering essential multimodal understanding with minimal compute requirements and efficient on-device inference
  - Use cases:
    - Vision understanding

  - Inference engines:
    - Transformers
    - Ollama
    - llama.cpp
    - iOS
    - Android

- LFM2-Audio
  - Models
    - LiquidAI/LFM2-Audio-1.5B
      - Description:
  - Use cases:
    - Audio & Transcription

- LiquidAI/LFM2-ColBERT-350M
  - Description: late interaction retriever with excellent multilingual performance. It allows you to store documents in one language (for example, a product description in English) and retrieve them in many languages with high accuracy.
  - Use cases:
    - Text Embeddings
  - Inference engines:
    - Transformers

- Models to exclude
  - LiquidAI/LFM2-1.2B-Extract
  - LiquidAI/LFM2-350M-Extract
  - LiquidAI/LFM2-350M-ENJP-MT
  - LiquidAI/LFM2-1.2B-RAG
  - LiquidAI/LFM2-1.2B-Tool
  - LiquidAI/LFM2-350M-Math
  - LiquidAI/LFM2-350M-PII-Extract-JP
