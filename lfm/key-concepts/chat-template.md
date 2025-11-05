# Chat Template

LFM2 uses a ChatML-like chat template to structure conversations. Here's an example conversation:

```
<|startoftext|><|im_start|>system
You are a helpful assistant trained by Liquid AI.<|im_end|>
<|im_start|>user
What is C. elegans?<|im_end|>
<|im_start|>assistant
It's a tiny nematode that lives in temperate soil environments.<|im_end|>
```

## Special Tokens

Conversations are formatted using special tokens:

- **`<|im_start|>`** — Marks the beginning of a message. Always followed by the role name (`system`, `user`, `assistant`, or `tool`) and a line break.
- **`<|im_end|>`** — Marks the end of a message.
- **`<|startoftext|>`** — Optional token at the beginning of conversations (typically handled automatically).

## Roles

LFM2 supports four conversation roles:

- **`system`** — (Optional) Sets the assistant's behavior and context. Defines who the assistant is and how it should respond.
- **`user`** — Messages from the user containing questions, instructions, or requests.
- **`assistant`** — Responses from the model.
- **`tool`** — Results from tool/function execution. Used for [tool use](tool-use.md) workflows.

## Using the Chat Template

You can automatically apply the chat template using the [`.apply_chat_template()`](https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating#using-applychattemplate) method from Hugging Face Transformers:

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")

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

The complete chat template definition can be found in the `chat_template.jinja` file in each model's Hugging Face repository.

Coming soon...
