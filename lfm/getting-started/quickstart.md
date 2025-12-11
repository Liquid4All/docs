# Quickstart

Deploy your first LFM model in minutes using your preferred platform.

<div className="deployment-grid">

<div className="deployment-container">
<div className="deployment-header">
<div className="deployment-icon">💻</div>
<h4>Laptops</h4>
<p>Run models locally on your laptop or desktop</p>
</div>
<div className="sub-cards-grid">
<div className="sub-card">
<h5>🤗 Transformers</h5>
<p>Research & prototyping</p>
</div>
<div className="sub-card">
<h5>🦙 llama.cpp</h5>
<p>High-performance C++</p>
</div>
<div className="sub-card">
<h5>🔧 Ollama</h5>
<p>Easy local deployment</p>
</div>
<div className="sub-card">
<h5>⚡ MLX</h5>
<p>Apple Silicon optimized</p>
</div>
</div>
</div>

<div className="deployment-container">
<div className="deployment-header">
<div className="deployment-icon">📱</div>
<h4>Mobile</h4>
<p>On-device inference for iOS and Android applications</p>
</div>
<div className="sub-cards-grid">
<div className="sub-card">
<h5>🍎 iOS</h5>
<p>Swift & Objective-C</p>
</div>
<div className="sub-card">
<h5>🤖 Android</h5>
<p>Java & Kotlin</p>
</div>
</div>
</div>

<div className="deployment-container">
<div className="deployment-header">
<div className="deployment-icon">☁️</div>
<h4>Cloud</h4>
<p>Deploy on AWS, Google Cloud, Azure, and other cloud platforms</p>
</div>
<div className="sub-cards-grid">
<div className="sub-card">
<h5>⚡ vLLM</h5>
<p>High-throughput serving</p>
</div>
</div>
</div>

<div className="deployment-container">
<div className="deployment-header">
<div className="deployment-icon">🌐</div>
<h4>Browser</h4>
<p>Client-side inference directly in web browsers using Transformers.js</p>
</div>
<div className="sub-cards-grid">
<div className="sub-card">
<h5>🤗 Transformers.js</h5>
<p>JavaScript & WebAssembly</p>
</div>
</div>
</div>

</div>

## Run LFM on laptops

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="transformers" label="🤗 Transformers" default>

This is the preferred option for research and quick prototyping in Jupyter notebooks.

### Step 1. Install Transformers and PyTorch

Install Transformers and PyTorch:

```bash
pip install transformers torch
```

GPU is recommended for faster inference, but CPU works too.

:::tip[Recommended]
We recommend you create an isolated virtual environment using a tool like [uv](https://docs.astral.sh/uv/) for better dependency management.

In this case, the above command should be replaced by either:

```bash
uv pip install transformers torch
```
or, even better

```bash
uv add transformers torch
```
:::

### Step 2. Inference with a text-only language model

Use the `pipeline()` interface for quick text generation:

```python
from transformers import pipeline

# Step 1. Select model
# Feel free to replace it with any other text-to-text model from our library:
# https://huggingface.co/collections/LiquidAI/lfm2
model_id = "LiquidAI/LFM2-1.2B"

# Step 2. Load model
generator = pipeline("text-generation", model_id, device_map="auto")

# Step 3. Generate text
messages = [{"role": "user", "content": "What is machine learning?"}]
response = generator(messages, max_new_tokens=256)
print(response[0]["generated_text"][-1]["content"])
```

Try it in [Google Colab →](https://colab.research.google.com/drive/1_q3jQ6LtyiuPzFZv7Vw8xSfPU5FwkKZY?usp=sharing)

### Step 3. Inference with a text+vision language model

```
pip install transformers pillow
```

```python
from transformers import AutoProcessor, AutoModelForImageTextToText
from transformers.image_utils import load_image

# Load model and processor
model_id = "LiquidAI/LFM2-VL-1.6B"
model = AutoModelForImageTextToText.from_pretrained(
    model_id,
    device_map="auto",
    dtype="bfloat16"
)
processor = AutoProcessor.from_pretrained(model_id)

# Load image and create conversation
url = "https://www.ilankelman.org/stopsigns/australia.jpg"
image = load_image(url)
conversation = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": image},
            {"type": "text", "text": "What is in this image?"},
        ],
    },
]

# Generate Answer
inputs = processor.apply_chat_template(
    conversation,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
    tokenize=True,
).to(model.device)
outputs = model.generate(**inputs, max_new_tokens=64)
processor.batch_decode(outputs, skip_special_tokens=True)[0]

# This image depicts a vibrant street scene in what appears to be a Chinatown or similar cultural area. The focal point is a large red stop sign with white lettering, mounted on a pole.
```
</TabItem>

<TabItem value="Ollama" label="Ollama">

### Step 1. Install Ollama

Go to [ollama.com/download](https://ollama.com/download) and follow the instructions for your operating system.

### Step 2. Start an OpenAI-compatible server locally

```bash
ollama run hf.co/LiquidAI/LFM2-1.2B-GGUF
```

Feel free to replace the model name with any other GGUF checkpoint available in [our collection](https://huggingface.co/LiquidAI/models?search=gguf).

### Step 3. Connect to the server

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # required but unused
)

response = client.chat.completions.create(
    model="liquidai/lfm2-1.2b",
    messages=[{"role": "user", "content": "What is machine learning?"}]
)
print(response.choices[0].message.content)
```

### Option 2: Using llama.cpp

```bash
# Install llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && make

# Download GGUF model
wget https://huggingface.co/LiquidAI/LFM2-1.2B-GGUF/resolve/main/lfm2-1.2b.q4_0.gguf

# Run server
./llama-server -m lfm2-1.2b.q4_0.gguf --host 0.0.0.0 --port 8080
```

**Perfect for:** Production deployments, API integrations, existing OpenAI workflows

</TabItem>

</Tabs>

## Next Steps

- **[Explore Models](../key-concepts/models.md)** - Browse all available models and sizes
<!-- - **[Key Concepts](key_concepts.md)** - Understand chat templates, sampling, and tool use -->
- **[Inference](../inference/transformers.md)** - Streaming, vision models, batching, and more
- **[Fine-tuning](../fine-tuning/trl.md)** - Customize models for your use case
- **[Liquid AI Cookbook](https://github.com/Liquid4All/cookbook)** - End‑to‑end finetuning notebooks and project examples

<style>{`
.deployment-grid {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.deployment-card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--ifm-background-surface-color);
  transition: all 0.2s ease;
  text-align: center;
}

.deployment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--ifm-color-primary);
}

.deployment-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.deployment-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ifm-color-emphasis-900);
}

.deployment-card p {
  margin: 0 0 1rem 0;
  color: var(--ifm-color-emphasis-700);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Laptop deployment container with sub-cards */
.deployment-container {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--ifm-background-surface-color);
  transition: all 0.2s ease;
  grid-column: span 2;
}

.deployment-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--ifm-color-primary);
}

.deployment-header {
  text-align: center;
  margin-bottom: 1rem;
}

.deployment-header h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ifm-color-emphasis-900);
}

.deployment-header p {
  margin: 0;
  color: var(--ifm-color-emphasis-700);
  font-size: 0.9rem;
  line-height: 1.4;
}

.sub-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Center single sub-card */
.sub-cards-grid:has(.sub-card:only-child) {
  grid-template-columns: 1fr;
  justify-items: center;
}

.sub-cards-grid .sub-card:only-child {
  max-width: 200px;
}

.sub-card {
  background: var(--ifm-color-emphasis-100);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
}

.sub-card:hover {
  background: var(--ifm-color-emphasis-200);
  border-color: var(--ifm-color-primary);
  transform: scale(1.02);
}

.sub-card h5 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ifm-color-emphasis-900);
}

.sub-card p {
  margin: 0;
  color: var(--ifm-color-emphasis-600);
  font-size: 0.8rem;
  line-height: 1.3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .deployment-container {
    grid-column: span 1;
  }
  
  .sub-cards-grid {
    grid-template-columns: 1fr;
  }
}

/* Active Tab Visibility */
.tabs__item--active {
  background: linear-gradient(135deg, rgba(86, 3, 173, 0.1), rgba(86, 3, 173, 0.05)) !important;
  border-radius: 8px;
}

/* Dark mode enhancement */
[data-theme='dark'] .tabs__item--active {
  background: linear-gradient(135deg, rgba(134, 75, 196, 0.25), rgba(134, 75, 196, 0.15)) !important;
  border: 1px solid rgba(134, 75, 196, 0.3);
}
`}</style>
