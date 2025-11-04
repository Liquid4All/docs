# vLLM

[vLLM](https://github.com/vllm-project/vllm) is a high-throughput and memory-efficient inference engine for LLMs. It supports efficient serving with PagedAttention, continuous batching, and optimized CUDA kernels.

:::tip[**Use vLLM for:**]
- High-throughput inference and production deployments with GPU acceleration
- Batch processing of many prompts
- Serving models via an API
:::

vLLM offers significantly higher throughput than [Transformers](transformers.md), making it ideal for serving many concurrent requests. However, it requires a CUDA-compatible GPU. For CPU-only environments, consider using [llama.cpp](llama-cpp.md) instead.

## Installation

You need to install [`vLLM`](https://github.com/vllm-project/vllm) v0.10.2 or a more recent version:

```
pip install vllm==0.10.2 --extra-index-url https://wheels.vllm.ai/0.10.2/ --torch-backend=auto
```

## Basic Usage

The `LLM` class provides a simple interface for offline inference. Use the [`chat()`](https://docs.vllm.ai/en/v0.6.0/dev/offline_inference/llm.html) method to automatically apply the chat template and generate text:

```python
from vllm import LLM, SamplingParams

# Initialize the model
llm = LLM(model="LiquidAI/LFM2-1.2B")

# Define sampling parameters
sampling_params = SamplingParams(
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_tokens=512
)

# Generate answer
prompt = "What is C. elegans?"
output = llm.chat(prompt, sampling_params)
print(output[0].outputs[0].text)
```

### Sampling Parameters

Control text generation behavior using [`SamplingParams`](https://docs.vllm.ai/en/v0.4.1/dev/sampling_params.html). Key parameters:

- **`temperature`** (`float`, default 1.0): Controls randomness (0.0 = deterministic, higher = more random). Typical range: 0.1-2.0
- **`top_p`** (`float`, default 1.0): Nucleus sampling - limits to tokens with cumulative probability ≤ top_p. Typical range: 0.1-1.0
- **`top_k`** (`int`, default -1): Limits to top-k most probable tokens (-1 = disabled). Typical range: 1-100
- **`min_p`** (`float`): Minimum token probability threshold. Typical range: 0.01-0.2
- **`max_tokens`** (`int`): Maximum number of tokens to generate
- **`repetition_penalty`** (`float`, default 1.0): Penalty for repeating tokens (>1.0 = discourage repetition). Typical range: 1.0-1.5
- **`stop`** (`str` or `list[str]`): Strings that terminate generation when encountered

Create a `SamplingParams` object:

```python
from vllm import SamplingParams

sampling_params = SamplingParams(
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_tokens=512,
)
```

For a complete list of parameters, see the [vLLM Sampling Parameters documentation](https://docs.vllm.ai/en/v0.4.1/dev/sampling_params.html).

## Batched Generation

vLLM automatically batches multiple prompts for efficient processing. You can control batch behavior and generate responses for large datasets:

```python
from vllm import LLM, SamplingParams

llm = LLM(model="LiquidAI/LFM2-1.2B")

sampling_params = SamplingParams(
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_tokens=512
)

# Large batch of prompts
prompts = [
    "Explain quantum computing in one sentence.",
    "What are the benefits of exercise?",
    "Write a haiku about programming.",
    # ... many more prompts
]

# Generate list of answers
outputs = llm.chat(prompts, sampling_params)
for i, output in enumerate(outputs):
    print(f"Prompt {i}: {output.prompt}")
    print(f"Generated: {output.outputs[0].text}\n")
```

## OpenAI-Compatible Server

vLLM can serve models through an OpenAI-compatible API, allowing you to use existing OpenAI client libraries:

```bash
vllm serve LiquidAI/LFM2-1.2B \
    --host 0.0.0.0 \
    --port 8000 \
    --dtype auto
```

Optional parameters:
- `--max-model-len L`: Set maximum context length
- `--gpu-memory-utilization 0.9`: Set GPU memory usage (0.0-1.0)

### Chat Completions

Once running, you can use the OpenAI Python client or any OpenAI-compatible tool:

```python
from openai import OpenAI

# Point to your vLLM server
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"  # vLLM doesn't require authentication by default
)

# Chat completion
response = client.chat.completions.create(
    model="LiquidAI/LFM2-1.2B",
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ],
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_tokens=512
)

print(response.choices[0].message.content)

# Streaming response
stream = client.chat.completions.create(
    model="LiquidAI/LFM2-1.2B",
    messages=[
        {"role": "user", "content": "Tell me a story."}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

<details>
<summary>Curl request example</summary>

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "LiquidAI/LFM2-1.2B",
    "messages": [
      {"role": "user", "content": "What is AI?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

</details>

## Vision Models

vLLM supports LFM2-VL multimodal models for both offline inference and serving.

<details>
<summary>Offline Inference</summary>

```python
from vllm import LLM, SamplingParams
from vllm.assets.image import ImageAsset

# Initialize vision model
llm = LLM(model="LiquidAI/LFM2-VL-1.6B")

sampling_params = SamplingParams(
    temperature=0.1,
    min_p=0.15,
    repetition_penalty=1.05,
    max_tokens=512
)

# Load image
image = ImageAsset("path/to/image.jpg").pil_image

# Create prompt with image placeholder
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "text", "text": "What's in this image?"}
        ]
    }
]

# Generate
output = llm.chat(messages, sampling_params=sampling_params, images=[image])
print(output[0].outputs[0].text)
```

</details>

<details>
<summary>OpenAI-Compatabile Server</summary>

Start a server with a vision model:

```bash
vllm serve LiquidAI/LFM2-VL-1.6B --port 8000
```

Use the OpenAI client with image URLs or base64-encoded images:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="LiquidAI/LFM2-VL-1.6B",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}},
                {"type": "text", "text": "Describe this image."}
            ]
        }
    ],
    temperature=0.1,
    min_p=0.15,
    repetition_penalty=1.05,
    max_tokens=512
)

print(response.choices[0].message.content)
```

</details>
