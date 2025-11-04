# Transformers

[Transformers](https://github.com/huggingface/transformers) is a library for inference and training of pretrained models.

:::tip
**Use Transformers for:**
- Simple inference without additional dependencies
- Research and experimentation with LFMs
- Integration with the Hugging Face ecosystem
:::

Transformers provides the most flexibility for model development and is ideal for users who want direct access to model internals. For production deployments with high throughput, consider using [vLLM](vllm.md).

## Installation

Install the required dependencies:

```
pip install transformers>=4.57.1 torch>=2.6
```

GPU is recommended for faster inference.

## Basic Usage

The Transformers library provides two interfaces for text generation: [`generate()`](https://huggingface.co/docs/transformers/v4.57.1/en/main_classes/text_generation#transformers.GenerationMixin.generate) for fine-grained control and [`pipeline()`](https://huggingface.co/docs/transformers/en/main_classes/pipelines) for simplicity. We use `generate()` here for direct access to model internals and explicit control over the generation process:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-1.2B"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="bfloat16",
#    attn_implementation="flash_attention_2" <- uncomment on compatible GPU
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate answer
prompt = "What is C. elegans?"
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

output = model.generate(input_ids, max_new_tokens=512)

# Decode only the newly generated tokens (excluding the input prompt)
response = tokenizer.decode(output[0][len(input_ids[0]):], skip_special_tokens=True)
print(response)

# C. elegans, also known as Caenorhabditis elegans, is a small, free-living
# nematode worm (roundworm) that belongs to the phylum Nematoda.
```

**Model loading notes:**
- **`model_id`**: Can be a Hugging Face model ID (e.g., `"LiquidAI/LFM2-1.2B"`) or a local path
- **`device_map="auto"`**: Automatically distributes across available GPUs/CPU (requires `accelerate`). Use `device="cuda"` for single GPU or `device="cpu"` for CPU only
- **`torch_dtype="bfloat16"`**: Recommended for modern GPUs. Use `"auto"` for automatic selection, or `"float32"` (slower, more memory)

<details>
<summary>Click to see a pipeline() example</summary>

The [`pipeline()`](https://huggingface.co/docs/transformers/en/main_classes/pipelines) interface provides a simpler API for text generation with automatic chat template handling. It wraps model loading and tokenization, making it ideal for quick prototyping.

```python
from transformers import pipeline

generator = pipeline(
    "text-generation",
    "LiquidAI/LFM2-1.2B",
    torch_dtype="auto",
    device_map="auto",
)

messages = [
    {"role": "user", "content": "Give me a short introduction to large language models."},
]
messages = generator(messages, max_new_tokens=512)[0]["generated_text"]

messages.append({"role": "user", "content": "In a single sentence."})
messages = generator(messages, max_new_tokens=512)[0]["generated_text"]
```

**Key parameters:**
- **`"text-generation"`**: Task type for the pipeline
- **`model_name_or_path`**: Model ID (e.g., `"LiquidAI/LFM2-1.2B"`) or local path (download locally with `hf download --local-dir ./LFM2-1.2B LiquidAI/LFM2-1.2B`)
- **`torch_dtype="auto"`**: Automatically selects optimal dtype (`bfloat16` on modern devices). Can use `"bfloat16"` explicitly or `"float32"` (slower, more memory)
- **`device_map="auto"`**: Automatically distributes across available GPUs/CPU (requires `accelerate`). Alternative: `device="cuda"` for single GPU, `device="cpu"` for CPU only. Don't mix `device_map` and `device`

The pipeline automatically handles chat templates and tokenization, returning structured output with the generated text.

</details>

### Generation Parameters

Control text generation behavior using [`GenerationConfig`](https://huggingface.co/docs/transformers/v4.57.1/en/main_classes/text_generation#transformers.GenerationConfig). Key parameters:

- **`do_sample`** (`bool`): Enable sampling (`True`) or greedy decoding (`False`, default)
- **`temperature`** (`float`, default 1.0): Controls randomness (0.0 = deterministic, higher = more random). Typical range: 0.1-2.0
- **`top_p`** (`float`, default 1.0): Nucleus sampling - limits to tokens with cumulative probability ≤ top_p. Typical range: 0.1-1.0
- **`top_k`** (`int`, default 50): Limits to top-k most probable tokens. Typical range: 1-100
- **`min_p`** (`float`): Minimum token probability threshold. Typical range: 0.01-0.2
- **`max_new_tokens`** (`int`): Maximum number of tokens to generate (preferred over `max_length`)
- **`repetition_penalty`** (`float`, default 1.0): Penalty for repeating tokens (>1.0 = discourage repetition). Typical range: 1.0-1.5
- **`stop_strings`** (`str` or `list[str]`): Strings that terminate generation when encountered

Use `GenerationConfig` to organize parameters:

```python
from transformers import GenerationConfig

# Create a generation config
generation_config = GenerationConfig(
    do_sample=True,
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_new_tokens=512,
)

# Use it in generate()
output = model.generate(input_ids, generation_config=generation_config)
```

For a complete list of parameters, see the [GenerationConfig documentation](https://huggingface.co/docs/transformers/v4.57.1/en/main_classes/text_generation#transformers.GenerationConfig).

## Streaming Generation

Stream responses as they're generated using `TextStreamer`:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer

# Use the model and tokenizer setup from Basic Usage above

prompt = "Tell me a story about space exploration."
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

streamer = TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
output = model.generate(input_ids, streamer=streamer, max_new_tokens=512)
```

## Batch Generation

Process multiple prompts in a single batch for efficiency. See the [batching documentation](https://huggingface.co/docs/transformers/en/main_classes/text_generation#batch-generation) for more details:

:::note
Batching is not automatically a win for performance. For high-performance batching with optimized throughput, consider using [vLLM](vllm.md).
:::

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Use the model and tokenizer setup from Basic Usage above

# Prepare multiple prompts
prompts = [
    [{"role": "user", "content": "Give me a short introduction to large language models."}],
    [{"role": "user", "content": "Give me a detailed introduction to large language models."}],
]

# Apply chat templates and tokenize
batch = tokenizer.apply_chat_template(
    prompts,
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
    padding=True,
).to(model.device)

# Generate for all prompts in batch
outputs = model.generate(batch, max_new_tokens=512)

# Decode outputs
for output in outputs:
    print(tokenizer.decode(output, skip_special_tokens=True))
```

## Vision Models

LFM2-VL models support both text and images as input. Use `generate()` with the vision model and processor:

```python
from transformers import AutoModelForCausalLM, AutoProcessor
from PIL import Image

# Load vision model and processor
model_id = "LiquidAI/LFM2-VL-1.6B"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="bfloat16",
)
processor = AutoProcessor.from_pretrained(model_id)

# Load image
image = Image.open("path/to/image.jpg")

# Create prompt with image
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "text", "text": "What's in this image?"}
        ]
    }
]

# Apply chat template and process image
prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
inputs = processor(images=image, text=prompt, return_tensors="pt").to(model.device)

# Generate
output = model.generate(**inputs, max_new_tokens=256)

# Decode response
response = processor.batch_decode(output, skip_special_tokens=True)[0]
print(response)
```

<details>
<summary>Multiple Images Example</summary>

```python
from transformers import AutoModelForCausalLM, AutoProcessor
from PIL import Image

# Use the model and processor setup from above

image1 = Image.open("path/to/first.jpg")
image2 = Image.open("path/to/second.jpg")

messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "image"},
            {"type": "text", "text": "What are the differences between these two images?"}
        ]
    }
]

prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
inputs = processor(images=[image1, image2], text=prompt, return_tensors="pt").to(model.device)

output = model.generate(**inputs, max_new_tokens=256)

response = processor.batch_decode(output, skip_special_tokens=True)[0]
print(response)
```

</details>

## FAQ

You may find distributed inference with Transformers is not as fast as you would imagine. Transformers with `device_map="auto"` does not apply tensor parallelism, and it only uses one GPU at a time. For Transformers with tensor parallelism, please refer to [its documentation](https://huggingface.co/docs/transformers/v4.51.3/en/perf_infer_gpu_multi).
