# Interactive Quickstart Widget

## Complete list of Deployment platforms:
- Laptop with Transformers
- Laptop with Ollama
- Laptop with llama.cpp
- Macbook with MLX
- iOS with LEAP SDK
- Android with LEAP SDK
- Cloud with vLLM
- Browser with Transformers.js

## Complete list of use cases:
- Chat completions
- Vision understanding
- Audio & Transcription
- Code generation
- Text embeddings
- Function Calling & Agents

## Complete list of models:
- LiquidAI/LFM2-8B-A1B
- LiquidAI/LFM2-2.6B
- LiquidAI/LFM2-1.2B
- LiquidAI/LFM2-700M
- LiquidAI/LFM2-350M
- LiquidAI/LFM2-VL-3B
- LiquidAI/LFM2-VL-1.6B
- LiquidAI/LFM2-VL-450M
- LiquidAI/LFM2-Audio-1.5B
- LiquidAI/LFM2-ColBERT-350M

## Compatibility matrix between use cases, deployment platforms and models
- LFM2 models
  - Models:
    - LiquidAI/LFM2-8B-A1B
      - Description: On-device MoE with 8B parameters, 1B active, comparable to 3-4B dense models and faster than Qwen3-1.7B. Code and knowledge capabilities are significantly improved compared to LFM2-2.6B.

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

  - Deployment platforms:
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

  - Deployment platforms:
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
  - Deployment platforms:
    - liquid-audio library
    - llama.cpp

- LiquidAI/LFM2-ColBERT-350M
  - Description: late interaction retriever with excellent multilingual performance. It allows you to store documents in one language (for example, a product description in English) and retrieve them in many languages with high accuracy.
  - Use cases:
    - Text Embeddings
  - Deployment platforms:
    - Transformers

- Models to exclude
  - LiquidAI/LFM2-1.2B-Extract
  - LiquidAI/LFM2-350M-Extract
  - LiquidAI/LFM2-350M-ENJP-MT
  - LiquidAI/LFM2-1.2B-RAG
  - LiquidAI/LFM2-1.2B-Tool
  - LiquidAI/LFM2-350M-Math
  - LiquidAI/LFM2-350M-PII-Extract-JP

## Tutorial templates

- Use case: Chat completions
- Deployment platform: Laptop with Transformers
- Model: {MODEL}
- Models:
  - LiquidAI/LFM2-8B-A1B
  - LiquidAI/LFM2-2.6B
  - LiquidAI/LFM2-1.2B
  - LiquidAI/LFM2-700M
  - LiquidAI/LFM2-350M
  - LiquidAI/LFM2-VL-3B
  - LiquidAI/LFM2-VL-1.6B
  - LiquidAI/LFM2-VL-450M
  - LiquidAI/LFM2-Audio-1.5B
  - LiquidAI/LFM2-ColBERT-350M

## Steps

## Step 1. Install Python dependencies

```
pip install transformers torch
```

## Step 2. Run inference with the `pipeline()` interface

```
from transformers import pipeline

# Load model
generator = pipeline("text-generation", "LiquidAI/LFM2-1.2B", device_map="auto")

# Generate
messages = [{"role": "user", "content": "What is machine learning?"}]
response = generator(messages, max_new_tokens=256)
print(response[0]["generated_text"][-1]["content"])
```
