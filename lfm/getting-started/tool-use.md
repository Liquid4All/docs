# Tool Use

LFM2 models support tool use (also called "function calling"), allowing models to request external functions as part of their responses. This enables models to interact with APIs, databases, calculators, and other tools to provide more accurate and up-to-date information.

:::note[See also]
While all of our models support tool use, [`LFM2-1.2B-Tool`](models.md#liquid-nanos) is specifically optimized for tool calling tasks. Use this as a prompting guide for this model.
:::

## How Tool Use Works

LFM2 implements tool use through a conversational loop:

1. **Define Tools**: Provide tool definitions (functions with descriptions) in the conversation
2. **Model Generates Tool Call**: The model decides when to use a tool and generates a function call
3. **Execute Tool**: Your code executes the function with the model's arguments
4. **Model Responds**: The model receives the tool result and generates a natural language response

## Defining Tools

When using [`apply_chat_template()`](https://huggingface.co/docs/transformers/v4.57.1/en/internal/tokenization_utils#transformers.PreTrainedTokenizerBase.apply_chat_template), pass tools via the `tools` argument. You can use either Python functions or JSON schemas.

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

Here's a complete example showing the full tool use workflow:

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
checkpoint = "LiquidAI/LFM2-1.2B"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForCausalLM.from_pretrained(
    checkpoint,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

# Define a tool function
def get_candidate_status(candidate_id: str):
    """
    Retrieves the current status of a candidate in the recruitment process.
    
    Args:
        candidate_id: Unique identifier for the candidate
    """
    # Your actual implementation would query a database
    return {
        "candidate_id": candidate_id,
        "status": "Interview Scheduled",
        "position": "Clinical Research Associate",
        "date": "2023-11-20"
    }

tools = [get_candidate_status]

# Step 1: Initial user message
messages = [
    {"role": "system", "content": "You are a helpful HR assistant."},
    {"role": "user", "content": "What is the current status of candidate ID 12345?"}
]

# Step 2: Apply chat template with tools and generate
inputs = tokenizer.apply_chat_template(
    messages,
    tools=tools,
    add_generation_prompt=True,
    return_dict=True,
    return_tensors="pt"
)

outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
response = tokenizer.decode(outputs[0][len(inputs["input_ids"][0]):], skip_special_tokens=False)
print("Model response (with tool call):", response)

# Step 3: Parse and execute the tool call
# In practice, you would parse the tool call from the model's response
# For this example, we'll execute it directly
result = get_candidate_status(candidate_id="12345")
result_str = str(result)

# Append tool execution result to conversation
messages.append({
    "role": "assistant",
    "tool_calls": [{
        "type": "function",
        "function": {
            "name": "get_candidate_status",
            "arguments": '{"candidate_id": "12345"}'
        }
    }]
})
messages.append({
    "role": "tool",
    "content": result_str
})

# Step 4: Generate final response with tool result
inputs = tokenizer.apply_chat_template(
    messages,
    tools=tools,
    add_generation_prompt=True,
    return_dict=True,
    return_tensors="pt"
)

outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
final_response = tokenizer.decode(outputs[0][len(inputs["input_ids"][0]):], skip_special_tokens=True)
print("Final answer:", final_response)
```

## Tool Use Format

LFM2 uses special tokens to structure tool use in conversations:

- **Tool Definitions**: Embedded between `<|tool_list_start|>` and `<|tool_list_end|>` tokens
- **Tool Calls**: Model generates function calls between `<|tool_call_start|>` and `<|tool_call_end|>` tokens
- **Tool Results**: Return tool execution results between `<|tool_response_start|>` and `<|tool_response_end|>` tokens in `tool` role messages

The `apply_chat_template()` method handles these tokens automatically when you pass tools.

## Managing Tool Lists

- **Context usage**: Tool definitions are inserted as text in the prompt, consuming context tokens. Large tool lists (100+ tools) can use significant portions of your context window.
- **Large tool lists**: Only include tools relevant to the current request. Consider tool selection or categorization strategies to reduce context usage.
- **Best practices**: Provide clear, concise tool descriptions. Group related tools when possible. Remove unused tools from the list when they're not needed.
