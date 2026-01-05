# Chat Template

LFM2 uses a ChatML-like chat template to structure conversations. This page covers the chat template format for both text and vision models.

## Overview

The chat template defines how conversations are structured using special tokens and roles. Here's an example conversation:

```
<|startoftext|><|im_start|>system
You are a helpful assistant trained by Liquid AI.<|im_end|>
<|im_start|>user
What is C. elegans?<|im_end|>
<|im_start|>assistant
It's a tiny nematode that lives in temperate soil environments.<|im_end|>
```

## Format Structure

### Special Tokens

Conversations are formatted using special tokens:

- **`<|im_start|>`** — Marks the beginning of a message. Always followed by the role name (`system`, `user`, `assistant`, or `tool`) and a line break.
- **`<|im_end|>`** — Marks the end of a message.
- **`<|startoftext|>`** — Optional token at the beginning of conversations (typically handled automatically).

### Roles

LFM2 supports four conversation roles:

- **`system`** — (Optional) Sets the assistant's behavior and context. Defines who the assistant is and how it should respond.
- **`user`** — Messages from the user containing questions, instructions, or requests.
- **`assistant`** — Responses from the model.
- **`tool`** — Results from tool/function execution. Used for [tool use](tool-use.md) workflows.

## Text Models

For text-only LFM2 models, you can apply the chat template using the [`.apply_chat_template()`](https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating#using-applychattemplate) method from Hugging Face Transformers:

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2.5-1.2B-Instruct")

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is machine learning?"}
]

# Apply chat template
prompt = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)
print(prompt)
```

## Vision Models

LFM2-VL vision-language models use the same ChatML-like format with additional support for images. When formatted, images are represented with a sentinel token (`<image>`), which is automatically replaced with image tokens by the processor.

### Conversation Format

When creating conversations for vision models, use a structured format with `content` as a list containing image and text entries:

```python
conversation = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": image},  # PIL Image or loaded image
            {"type": "text", "text": "What is in this image?"},
        ],
    },
]
```

### Formatted Output

After applying the chat template, the conversation is formatted as:

```
<|startoftext|><|im_start|>system
You are a helpful multimodal assistant by Liquid AI.<|im_end|>
<|im_start|>user
<image>What is in this image?<|im_end|>
<|im_start|>assistant
This image shows a Caenorhabditis elegans (C. elegans) nematode.<|im_end|>
```

### Usage

For vision models, you can apply the chat template using the processor's `.apply_chat_template()` method:

```python
from transformers import AutoProcessor
from transformers.image_utils import load_image

processor = AutoProcessor.from_pretrained("LiquidAI/LFM2.5-VL-1.6B")

# Load image and create conversation
image = load_image("path/to/image.jpg")  # or use PIL Image
conversation = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": image},
            {"type": "text", "text": "What is in this image?"},
        ],
    },
]

# Apply chat template
prompt = processor.apply_chat_template(
    conversation,
    tokenize=False,
    add_generation_prompt=True
)
print(prompt)
```

## Template Definition

The complete chat template definition can be found in the `chat_template.jinja` file in each model's Hugging Face repository.
