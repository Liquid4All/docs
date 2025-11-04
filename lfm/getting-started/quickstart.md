# Quickstart

The easiest way to get started with LFM models in 2 minutes is with [Transformers](../inference/transformers.md). All LFM models are available on [Hugging Face](https://huggingface.co/LiquidAI/collections).

:::note[**Just want to chat with LFM models?**]
Try [Liquid Playground](https://playground.liquid.ai) to interact with our base models directly in your browser—no installation required.
:::

## Installation

Install Transformers and PyTorch:

```bash
pip install transformers torch
```

GPU is recommended for faster inference, but CPU works too.

## Basic Usage

Use the `pipeline()` interface for quick text generation:

```python
from transformers import pipeline

# Load model
generator = pipeline("text-generation", "LiquidAI/LFM2-1.2B", device_map="auto")

# Generate
messages = [{"role": "user", "content": "What is machine learning?"}]
response = generator(messages, max_new_tokens=256)
print(response[0]["generated_text"][-1]["content"])
```

Try it in [Google Colab →](https://colab.research.google.com/drive/1_q3jQ6LtyiuPzFZv7Vw8xSfPU5FwkKZY?usp=sharing)

## Next Steps

- **[Explore Models](models.md)** - Browse all available models and sizes
<!-- - **[Key Concepts](key_concepts.md)** - Understand chat templates, sampling, and tool use -->
- **[Inference](../inference/transformers.md)** - Streaming, vision models, batching, and more
- **[Fine-tuning](../fine-tuning/trl.md)** - Customize models for your use case
- **[Liquid AI Cookbook](https://github.com/Liquid4All/cookbook)** - End‑to‑end finetuning notebooks and project examples
