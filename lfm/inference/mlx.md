# MLX

[MLX](https://github.com/ml-explore/mlx) is Apple's machine learning framework optimized for Apple Silicon. It provides efficient inference on Mac devices with M-series chips (M1, M2, M3, M4) using Metal acceleration for GPU computing.

:::tip[**Use MLX for:**]

- Running models on Apple Silicon Macs
- Efficient on-device inference with Metal GPU acceleration
- Local development on macOS
:::

MLX leverages unified memory architecture on Apple Silicon, allowing seamless data sharing between CPU and GPU. The `mlx-lm` package provides a simple interface for loading and serving LLMs.

## Installation

Install the MLX language model package:

```
pip install mlx-lm
```

## Basic Usage

The `mlx-lm` package provides a simple interface for text generation with MLX models.

See the [Models page](../getting_started/models.md#mlx-models) for all available MLX models, or browse MLX community models at [mlx-community LFM2 models](https://huggingface.co/models?sort=created&search=mlx-communityLFM2).

```python
from mlx_lm import load, generate

# Load model and tokenizer
model, tokenizer = load("mlx-community/LFM2-1.2B-8bit")

# Generate text
prompt = "What is machine learning?"

# Apply chat template
messages = [{"role": "user", "content": prompt}]
prompt = tokenizer.apply_chat_template(
    messages, tokenizer=False, add_generation_prompt=True
)

response = generate(model, tokenizer, prompt=prompt, verbose=True)
print(response)
```

### Generation Parameters

Control text generation behavior using parameters in the `generate()` function. Key parameters:

- **`temperature`** (`float`, default 1.0): Controls randomness (0.0 = deterministic, higher = more random). Typical range: 0.1-2.0
- **`top_p`** (`float`, default 1.0): Nucleus sampling - limits to tokens with cumulative probability ≤ top_p. Typical range: 0.1-1.0
- **`top_k`** (`int`, default 50): Limits to top-k most probable tokens. Typical range: 1-100
- **`max_tokens`** (`int`): Maximum number of tokens to generate
- **`repetition_penalty`** (`float`, default 1.0): Penalty for repeating tokens (>1.0 = discourage repetition). Typical range: 1.0-1.5

Example with custom parameters:

```python
response = generate(
    model, 
    tokenizer, 
    prompt=prompt,
    temperature=0.3,
    top_p=0.9,
    max_tokens=512,
    repetition_penalty=1.05
)
```

## Streaming Generation

Stream responses with `stream_generate()`:

```python
from mlx_lm import load, stream_generate

model, tokenizer = load("mlx-community/LFM2-1.2B-8bit")

messages = [{"role": "user", "content": "Tell me a story about space exploration."}]
prompt = tokenizer.apply_chat_template(
    messages, tokenizer=False, add_generation_prompt=True
)

for token in stream_generate(model, tokenizer, prompt=prompt, max_tokens=512):
    print(token, end="", flush=True)
```

## Serving with mlx-lm

MLX can serve models through an OpenAI-compatible API. Start a server with:

```bash
mlx_lm.server --model mlx-community/LFM2-1.2B-8bit --port 8080
```

### Using the Server

Once running, use the OpenAI Python client:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="mlx-community/LFM2-1.2B-8bit",
    messages=[
        {"role": "user", "content": "Explain quantum computing."}
    ],
    temperature=0.7,
    max_tokens=512
)

print(response.choices[0].message.content)
```

You can also use curl to interact with the server:

<details>
<summary>Curl request example</summary>

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mlx-community/LFM2-1.2B-8bit",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'
```

</details>

## Vision Models

LFM2-VL models support both text and image inputs for multimodal inference. Use `mlx_vlm` to load and generate with vision models:

<details>
<summary>Single Image Example</summary>

```python
from mlx_vlm import load, generate
from mlx_vlm.prompt_utils import apply_chat_template
from mlx_vlm.utils import load_image_processor
from PIL import Image

# Load vision model
model, processor = load("mlx-community/LFM2-VL-1.6B-8bit")

# Load image
image = Image.open("path/to/image.jpg")

# Create prompt
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "text", "text": "What's in this image?"}
        ]
    }
]

# Apply chat template
prompt = apply_chat_template(processor, messages)

# Generate
output = generate(model, processor, image, prompt, verbose=False)
print(output)
```

</details>

<details>
<summary>Multiple Images Example</summary>

```python
images = [
    Image.open("path/to/first.jpg"),
    Image.open("path/to/second.jpg")
]

messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "image"},
            {"type": "text", "text": "What are the differences between these images?"}
        ]
    }
]

prompt = apply_chat_template(processor, messages)
output = generate(model, processor, images, prompt, verbose=False)
print(output)
```

</details>
