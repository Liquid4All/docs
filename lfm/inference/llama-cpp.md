import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

# llama.cpp

[llama.cpp](https://github.com/ggml-org/llama.cpp) is a C++ library for efficient LLM inference with minimal dependencies. It's designed for CPU-first inference with cross-platform support.

:::tip
**Use llama.cpp for:**
- CPU-only environments (no GPU required)
- Local development and testing
- Edge deployment and on-device inference
:::

For GPU-accelerated inference at scale, consider using [vLLM](vllm.md) instead.

## Installation

Install llama.cpp for your target operating system:
<Tabs>
<TabItem value="macos-linux" label="macOS and Linux" default>

```
brew install llama.cpp
```

</TabItem>
<TabItem value="prebuilt" label="Pre-built Binaries">

Download from [llama.cpp releases](https://github.com/ggml-org/llama.cpp/releases).

**File naming:** `llama-<version>-bin-<os>-<feature>-<arch>.zip`

**Quick selection guide:**

- **Windows (CPU)**: `llama-*-bin-win-avx2-x64.zip` for Intel/AMD CPUs
- **Windows (NVIDIA GPU)**: `llama-*-bin-win-cu12-x64.zip` (requires CUDA drivers)
- **macOS (Intel)**: `llama-*-bin-macos-x64.zip`
- **macOS (Apple Silicon)**: `llama-*-bin-macos-arm64.zip`
- **Linux**: `llama-*-bin-linux-x64.zip`

After downloading, unzip and run from that directory.

</TabItem>
<TabItem value="source" label="Build from Source">

```
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release
```

The compiled programs will be in `./build/bin/`.

For detailed build instructions including GPU support, see the [llama.cpp documentation](https://github.com/ggerganov/llama.cpp#build).

</TabItem>
</Tabs>

## Downloading GGUF Models

llama.cpp uses the GGUF format, which stores quantized model weights for efficient inference. All LFM models are available in GGUF format on Hugging Face. See the [Models page](../key-concepts/models.md#gguf-models) for all available GGUF models.

You can download LFM models in GGUF format from Hugging Face as follows:

```
pip install huggingface-hub
hf download LiquidAI/LFM2-1.2B-GGUF lfm2-1.2b-q4_k_m.gguf --local-dir .
```

<details>
<summary>Available quantization levels</summary>

- `Q4_0`: 4-bit quantization, smallest size
- `Q4_K_M`: 4-bit quantization, good balance of quality and size (recommended)
- `Q5_K_M`: 5-bit quantization, better quality with moderate size increase
- `Q6_K`: 6-bit quantization, excellent quality closer to original
- `Q8_0`: 8-bit quantization, near-original quality
- `F16`: 16-bit float, full precision

</details>

## Basic Usage

llama.cpp offers three main interfaces for running inference: `llama-cpp-python` (Python bindings), `llama-server` (OpenAI-compatible server), and `llama-cli` (interactive CLI).

<Tabs>
<TabItem value="python" label="llama-cpp-python" default>

For Python applications, use the `llama-cpp-python` package.

**Installation:**

```bash
pip install llama-cpp-python
```

For GPU support:

```bash
CMAKE_ARGS="-DLLAMA_CUDA=on" pip install llama-cpp-python
```

**Model Setup:**

```python
from llama_cpp import Llama

# Load model
llm = Llama(
    model_path="lfm2-1.2b-q4_k_m.gguf",
    n_ctx=4096,
    n_threads=8
)

# Generate text
output = llm(
    "What is artificial intelligence?",
    max_tokens=512,
    temperature=0.7,
    top_p=0.9
)

print(output["choices"][0]["text"])
```

**Chat Completions:**

```python
response = llm.create_chat_completion(
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing."}
    ],
    temperature=0.7,
    max_tokens=512
)

print(response["choices"][0]["message"]["content"])
```

</TabItem>
<TabItem value="server" label="llama-server">

llama-server provides an OpenAI-compatible API for serving models locally.

**Starting the Server:**

```bash
llama-server -m lfm2-1.2b-q4_k_m.gguf -c 4096 --port 8080
```

Key parameters:
- `-m`: Path to GGUF model file
- `-c`: Context length (default: 4096)
- `--port`: Server port (default: 8080)
- `-ngl 99`: Offload layers to GPU (if available)

**Using the Server:**

Once running at `http://localhost:8080`, use the OpenAI Python client:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="lfm2-1.2b",
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ],
    temperature=0.7,
    max_tokens=512
)

print(response.choices[0].message.content)
```

**Using curl:**

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "lfm2-1.2b",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'
```

</TabItem>
<TabItem value="cli" label="llama-cli">

llama-cli provides an interactive terminal interface for chatting with models.

```bash
llama-cli -m lfm2-1.2b-q4_k_m.gguf -c 4096 --color -i
```

Key parameters:
- `-m`: Path to GGUF model file
- `-c`: Context length
- `--color`: Colored output
- `-i`: Interactive mode
- `-ngl 99`: Offload layers to GPU (if available)

Press Ctrl+C to exit.

</TabItem>
</Tabs>

### Generation Parameters

Control text generation behavior using parameters in the OpenAI-compatible API or command-line flags. Key parameters:

- **`temperature`** (`float`, default 1.0): Controls randomness (0.0 = deterministic, higher = more random). Typical range: 0.1-2.0
- **`top_p`** (`float`, default 1.0): Nucleus sampling - limits to tokens with cumulative probability ≤ top_p. Typical range: 0.1-1.0
- **`top_k`** (`int`, default 40): Limits to top-k most probable tokens. Typical range: 1-100
- **`max_tokens`** / **`--n-predict`** (`int`): Maximum number of tokens to generate
- **`repetition_penalty`** / **`--repeat-penalty`** (`float`, default 1.1): Penalty for repeating tokens (>1.0 = discourage repetition). Typical range: 1.0-1.5
- **`stop`** (`str` or `list[str]`): Strings that terminate generation when encountered

<details>
<summary>llama-cpp-python example</summary>

```python
from llama_cpp import Llama

llm = Llama(
    model_path="lfm2-1.2b-q4_k_m.gguf",
    n_ctx=4096,
    n_threads=8
)

# Text generation with sampling parameters
output = llm(
    "What is machine learning?",
    max_tokens=512,
    temperature=0.7,
    top_p=0.9,
    top_k=40,
    repeat_penalty=1.1,
    stop=["<|im_end|>", "<|endoftext|>"]
)

print(output["choices"][0]["text"])

# Chat completion with sampling parameters
response = llm.create_chat_completion(
    messages=[
        {"role": "user", "content": "Explain quantum computing."}
    ],
    temperature=0.7,
    top_p=0.9,
    top_k=40,
    max_tokens=512,
    repeat_penalty=1.1
)

print(response["choices"][0]["message"]["content"])
```

</details>

<details>
<summary>llama-server (OpenAI-compatible API) example</summary>

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="lfm2-1.2b",
    messages=[{"role": "user", "content": "What is machine learning?"}],
    temperature=0.7,
    top_p=0.9,
    top_k=40,
    max_tokens=512,
    repetition_penalty=1.1,
)

print(response.choices[0].message.content)
```

</details>

For command-line tools (`llama-cli`), use flags like `--temperature`, `--top-p`, `--top-k`, `--repeat-penalty`, and `--n-predict`.

## Vision Models

LFM2-VL GGUF models can also be used for multimodal inference with llama.cpp.

<details>
<summary>Using llama-server</summary>

Start a vision model server:

```bash
llama-server -m lfm2-vl-1.6b-q4_k_m.gguf -c 4096 --port 8080
```

Use with the OpenAI Python client:

```python
from openai import OpenAI
import base64

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="not-needed"
)

# Encode image to base64
with open("image.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="lfm2-vl",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
                {"type": "text", "text": "What's in this image?"}
            ]
        }
    ],
    max_tokens=256
)

print(response.choices[0].message.content)
```

</details>

<details>
<summary>Using llama-cpp-python</summary>

```python
from llama_cpp import Llama
from llama_cpp.llama_chat_format import Llava15ChatHandler

# Initialize with vision support
chat_handler = Llava15ChatHandler(clip_model_path="mmproj-model.gguf")
llm = Llama(
    model_path="lfm2-vl-1.6b-q4_k_m.gguf",
    chat_handler=chat_handler,
    n_ctx=4096
)

# Generate with image
response = llm.create_chat_completion(
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": "file:///path/to/image.jpg"}},
                {"type": "text", "text": "Describe this image."}
            ]
        }
    ]
)

print(response["choices"][0]["message"]["content"])
```

</details>

## Converting Custom Models

If you have a finetuned model or need to create a GGUF from a Hugging Face model:

```bash
# Clone llama.cpp if you haven't already
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Convert model with quantization
python convert_hf_to_gguf.py /path/to/your/model --outfile model.gguf --outtype q4_k_m
```

Use `--outtype` to specify the quantization level (e.g., `q4_0`, `q4_k_m`, `q5_k_m`, `q6_k`, `q8_0`, `f16`).
