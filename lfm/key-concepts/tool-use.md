# Tool Use

LFM2 models support tool use (also called "function calling"), allowing models to request external functions as part of their responses. This enables models to interact with APIs, databases, calculators, and other tools to provide more accurate and up-to-date information.

:::note[See also]
For improved tool calling performance, see [`LFM2-1.2B-Tool`](models.md#liquid-nanos), a Liquid Nano model specifically optimized for tool calling tasks.
:::

## How Tool Use Works

LFM2 implements tool use through a conversational loop:

1. **Define Tools**: Provide tool definitions (functions with descriptions) in the conversation
2. **Model Generates Tool Call**: The model decides when to use a tool and generates a function call
3. **Execute Tool**: Your code executes the function with the model's arguments
4. **Model Responds**: The model receives the tool result and generates a natural language response

## Tool Use Format

LFM2 uses special tokens to structure tool use in conversations:

- **Tool Definitions**: Embedded between `<|tool_list_start|>` and `<|tool_list_end|>` tokens
- **Tool Calls**: Model generates function calls between `<|tool_call_start|>` and `<|tool_call_end|>` tokens
- **Tool Results**: Return tool execution results between `<|tool_response_start|>` and `<|tool_response_end|>` tokens in `tool` role messages

When using [`apply_chat_template()`](https://huggingface.co/docs/transformers/v4.57.1/en/internal/tokenization_utils#transformers.PreTrainedTokenizerBase.apply_chat_template), these tokens are handled automatically. You can also manually format tools using these tokens directly.

## Defining Tools

When using `apply_chat_template()`, pass tools via the `tools` argument. You can use either Python functions or JSON schemas.

### Python Functions

Pass functions directly with Google-style docstrings. The parser automatically extracts function name, arguments, types, and descriptions:

```python
def get_current_temperature(location: str, unit: str):
    """
    Get the current temperature at a location.
    
    Args:
        location: The location to get the temperature for, in the format "City, Country"
        unit: The unit to return the temperature in. (choices: ["celsius", "fahrenheit"])
    """
    return 22.  # A real function should probably actually get the temperature!

tools = [get_current_temperature]
```

### JSON Schemas

Alternatively, pass tools as JSON schema dictionaries:

```python
tools = [{
  "type": "function",
  "function": {
    "name": "get_current_temperature",
    "description": "Get the current temperature at a location.",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The location to get the temperature for, in the format 'City, Country'"
        },
        "unit": {
          "type": "string",
          "description": "The unit to return the temperature in. (choices: ['celsius', 'fahrenheit'])"
        }
      },
      "required": ["location", "unit"]
    }
  }
}]
```

## Complete Example

The tool use workflow follows these steps:

1. **Define tools** and include them in the conversation using `apply_chat_template()` with the `tools` argument
2. **Generate with tools** - the model may generate tool calls between `<|tool_call_start|>` and `<|tool_call_end|>` tokens
3. **Parse and execute** the tool call from the model's response
4. **Append tool result** to messages with `role="tool"` and regenerate for the final response

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("LiquidAI/LFM2-1.2B", torch_dtype="bfloat16", device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")

# Define tool
def get_status(id: str):
    """Get status for an ID."""
    return {"status": "active"}

messages = [{"role": "user", "content": "Get status for ID 123"}]

# Generate with tools
inputs = tokenizer.apply_chat_template(messages, tools=[get_status], add_generation_prompt=True, return_dict=True, return_tensors="pt")
outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
response = tokenizer.decode(outputs[0][len(inputs["input_ids"][0]):], skip_special_tokens=False)

# Parse tool call, execute, and append result
messages.append({"role": "assistant", "tool_calls": [...]})  # Parse from response
messages.append({"role": "tool", "content": str(get_status("123"))})

# Generate final response
inputs = tokenizer.apply_chat_template(messages, tools=[get_status], add_generation_prompt=True, return_dict=True, return_tensors="pt")
outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
final = tokenizer.decode(outputs[0][len(inputs["input_ids"][0]):], skip_special_tokens=True)
```

## Manual Tool Formatting

You can manually format tools using special tokens instead of `apply_chat_template()`. Define tools as Python functions or JSON schemas, then list them between `<|tool_list_start|>` and `<|tool_list_end|>` tokens:

```python
import json
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "LiquidAI/LFM2-1.2B"
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto", torch_dtype="bfloat16")
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Define tools (as JSON schema or Python functions)
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get the current weather for a location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "The city and state"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location", "unit"]
        }
    }
}]

# Manually format prompt with tools
tool_definitions = json.dumps(tools)
prompt = f"<|tool_list_start|>{tool_definitions}<|tool_list_end|><|startoftext|><|im_start|>system\nYou are a helpful assistant.<|im_end|>\n<|im_start|>user\nWhat's the weather in San Francisco?<|im_end|>\n<|im_start|>assistant\n"

# Generate
input_ids = tokenizer.encode(prompt, return_tensors="pt").to(model.device)
output = model.generate(input_ids, max_new_tokens=512)
response = tokenizer.decode(output[0][len(input_ids[0]):], skip_special_tokens=False)
print(response)
```

## Managing Tool Lists

- **Context usage**: Tool definitions are inserted as text in the prompt, consuming context tokens. Large tool lists (100+ tools) can use significant portions of your context window.
- **Large tool lists**: Only include tools relevant to the current request. Consider tool selection or categorization strategies to reduce context usage.
- **Best practices**: Provide clear, concise tool descriptions. Group related tools when possible. Remove unused tools from the list when they're not needed.
