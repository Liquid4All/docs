import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

# Ollama

[Ollama](https://ollama.com) is a command-line tool for running LLMs locally with a simple interface. It provides easy model management and serving with an OpenAI-compatible API.

:::tip[**Use Ollama for:**]
- Simple command-line interface
- Quick local model serving
- Docker-based deployment
:::

Ollama uses GGUF models and supports GPU acceleration (CUDA, Metal, ROCm).

## Installation

<Tabs>
<TabItem value="macos-windows" label="macOS and Windows" default>

Download directly from [ollama.com/download](https://ollama.com/download).

</TabItem>
<TabItem value="linux" label="Linux">

```
curl -fsSL https://ollama.com/install.sh | sh
```

</TabItem>
<TabItem value="docker" label="Docker">

Run Ollama with GPU acceleration inside Docker containers:

**CPU only:**
```
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

**NVIDIA GPU:**
```
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Then run a model:
```
docker exec -it ollama ollama run hf.co/LiquidAI/LFM2-1.2B-GGUF
```

See the [Ollama Docker documentation](https://ollama.com/blog/ollama-is-now-available-as-an-official-docker-image) for more details.

</TabItem>
</Tabs>

## Using LFM2 Models

Ollama can load GGUF models directly from Hugging Face or from local files.

### Running GGUFs

You can run LFM2 models directly from Hugging Face:

```bash
ollama run hf.co/LiquidAI/LFM2-1.2B-GGUF
```

See the [Models page](../getting_started/models.md#gguf-models) for all available GGUF repositories.

To use a local GGUF file, first download a model from Hugging Face:

```bash
pip install huggingface-hub
hf download LiquidAI/LFM2-1.2B-GGUF {quantization}.gguf --local-dir .
```

Replace `{quantization}` with your preferred quantization level (e.g., `q4_k_m`, `q8_0`).

Then run the local model:

```bash
ollama run /path/to/model.gguf
```

<details>
<summary>Custom Setup with Modelfile</summary>

For custom configurations (specific quantization, chat template, or parameters), create a Modelfile.

Create a plain text file named `Modelfile` (no extension) with the following content:

```
FROM /path/to/model.gguf

TEMPLATE """<|startoftext|><|im_start|>system
{{ .System }}<|im_end|>
<|im_start|>user
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|endoftext|>"
```

Import the model with the Modelfile:

```bash
ollama create my-model -f Modelfile
```

Then run it:

```bash
ollama run my-model
```

</details>

## Basic Usage

Interact with models through the command-line interface.

### Interactive Chat

```bash
ollama run hf.co/LiquidAI/LFM2-1.2B-GGUF
```

Type your messages and press Enter. Use `/bye` to exit.

### Single Prompt

```bash
ollama run hf.co/LiquidAI/LFM2-1.2B-GGUF "What is machine learning?"
```

If you imported a model with a custom name using a Modelfile, use that name instead (e.g., `ollama run my-model`).

## Serving Models

Ollama automatically starts a server on `http://localhost:11434` with an OpenAI-compatible API for programmatic access.

### Python Client

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="hf.co/LiquidAI/LFM2-1.2B-GGUF",
    messages=[
        {"role": "user", "content": "Explain quantum computing."}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

<details>
<summary>Curl request examples</summary>

Ollama provides two native API endpoints:

**Generate API** (simple completion):
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "hf.co/LiquidAI/LFM2-1.2B-GGUF",
  "prompt": "What is artificial intelligence?"
}'
```

**Chat API** (conversational format):
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "hf.co/LiquidAI/LFM2-1.2B-GGUF",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}'
```

</details>

## Vision Models

LFM2-VL GGUF models can also be used for multimodal inference with Ollama.

<details>
<summary>Interactive Chat with Images</summary>

Run a vision model directly and provide images in the chat:

```bash
ollama run hf.co/LiquidAI/LFM2-VL-1.6B-GGUF
```

In the interactive chat, you can ask questions about images using the `/image` command followed by the file path:

```
>>> /image path/to/image.jpg What's in this image?
```

Or provide the image path directly in your prompt:

```
>>> Describe the contents of ~/Downloads/photo.png
```

</details>

<details>
<summary>Using the API</summary>

```python
from openai import OpenAI
import base64

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="not-needed"
)

# Encode image to base64
with open("image.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="hf.co/LiquidAI/LFM2-VL-1.6B-GGUF",
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

## Model Management

List installed models:
```bash
ollama list
```

Remove a model:
```bash
ollama rm hf.co/LiquidAI/LFM2-1.2B-GGUF
```

Show model information:
```bash
ollama show hf.co/LiquidAI/LFM2-1.2B-GGUF
```
