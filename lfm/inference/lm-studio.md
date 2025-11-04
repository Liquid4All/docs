# LM Studio

[LM Studio](https://lmstudio.ai) is a desktop application for running LLMs locally with a graphical interface.

:::tip[**Use LM Studio for:**]
- No command-line setup required
- Easy model discovery and download
- Quick testing with a built-in chat interface
:::

## Installation

Download and install LM Studio directly from [lmstudio.ai](https://lmstudio.ai/download).

## Downloading Models

1. Open LM Studio and click the **Search** tab (🔍)
2. Search for "LiquidAI" or "LFM2"
3. Select a model and quantization level (`Q4_K_M` recommended)
4. Click **Download**

See the [Models page](../getting-started/models.md#gguf-models) for all available GGUF models.

## Using the Chat Interface

1. Go to the **Chat** tab (💬)
2. Select your model from the dropdown
3. Adjust parameters (`temperature`, `max_tokens`, `top_p`) in the sidebar
4. Start chatting

## Generation Parameters

Control text generation behavior using the GUI sidebar or API parameters. Key parameters:

- **`temperature`** (`float`, default 1.0): Controls randomness (0.0 = deterministic, higher = more random). Typical range: 0.1-2.0
- **`top_p`** (`float`, default 1.0): Nucleus sampling - limits to tokens with cumulative probability ≤ top_p. Typical range: 0.1-1.0
- **`top_k`** (`int`, default 40): Limits to top-k most probable tokens. Typical range: 1-100
- **`max_tokens`** (`int`): Maximum number of tokens to generate
- **`repetition_penalty`** (`float`, default 1.0): Penalty for repeating tokens (>1.0 = discourage repetition). Typical range: 1.0-1.5
- **`stop`** (`str` or `list[str]`): Strings that terminate generation when encountered

Via the OpenAI-compatible API:

```python
response = client.chat.completions.create(
    model="local-model",
    messages=[{"role": "user", "content": "What is machine learning?"}],
    temperature=0.7,
    top_p=0.9,
    top_k=40,
    max_tokens=512,
    repetition_penalty=1.1,
)
```

## Running the Server

Start an OpenAI-compatible server for programmatic access:

1. Go to the **Developer** tab (⚙️)
2. Select your model
3. Click **Start Server** (runs at `http://localhost:1234`)

Use the OpenAI Python client:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="local-model",  # Any string works
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ],
    temperature=0.7,
    max_tokens=512
)

print(response.choices[0].message.content)
```

### Streaming Responses

```python
stream = client.chat.completions.create(
    model="local-model",
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
curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "local-model",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'
```

</details>

## Vision Models

Search for "LiquidAI LFM2-VL" to download vision models. In the **Chat** tab:
- Drag and drop images into the chat
- Click the image icon to upload
- Provide image URLs

<details>
<summary>Using the API</summary>

```python
from openai import OpenAI
import base64

client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="not-needed"
)

# Encode image to base64
with open("image.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="local-model",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
                {"type": "text", "text": "What's in this image?"}
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

</details>

## Tips

- **GPU Acceleration**: Automatically detects and uses available GPUs
- **Model Management**: Delete models from the **My Models** section
- **Performance**: Adjust GPU layers in server settings for speed/memory balance
- **Quantization**: Q4 is faster, Q6/Q8 have better quality
