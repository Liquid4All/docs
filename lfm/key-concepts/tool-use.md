# Tool Use

LFM2.5 and LFM2 models support tool use (function calling), enabling models to interact with APIs, databases, and external services to provide accurate, up-to-date information.

## Overview

The tool use workflow follows four steps:

1. **Define** tools as JSON in the system prompt or via [`apply_chat_template()`](https://huggingface.co/docs/transformers/en/chat_extras#passing-tools)
2. **Generate** a response where the model outputs function calls between special tokens
3. **Execute** the function and return results as a `tool` role message
4. **Regenerate** to let the model interpret results and respond to the user

LFM2.5 wraps tool calls in `<|tool_call_start|>` and `<|tool_call_end|>` tokens. LFM2 additionally wraps tool definitions in `<|tool_list_start|>`/`<|tool_list_end|>` and responses in `<|tool_response_start|>`/`<|tool_response_end|>`.

By default, models generate Pythonic function calls. Add "Output function calls as JSON" to your system prompt for JSON format.

## Defining Tools

You have two options for providing tool definitions.

**Option 1: JSON in the system prompt (recommended)**

```python
tools_json = [{
    "name": "get_candidate_status",
    "description": "Retrieves the current status of a candidate in the recruitment process",
    "parameters": {
        "type": "object",
        "properties": {
            "candidate_id": {
                "type": "string",
                "description": "Unique identifier for the candidate"
            }
        },
        "required": ["candidate_id"]
    }
}]

messages = [
    {"role": "system", "content": f"List of tools: {json.dumps(tools_json)}"},
    {"role": "user", "content": "What is the current status of candidate ID 12345?"}
]
```

**Option 2: Python functions via [`apply_chat_template()`](https://huggingface.co/docs/transformers/en/chat_extras#passing-tools)**

```python
def get_current_temperature(location: str, unit: str):
    """
    Get the current temperature at a location.
    
    Args:
        location: The location to get the temperature for, in the format "City, Country"
        unit: The unit to return the temperature in. (choices: ["celsius", "fahrenheit"])
    """
    return 22.

messages = [{"role": "user", "content": "What's the weather in San Francisco?"}]
inputs = tokenizer.apply_chat_template(
    messages,
    tools=[get_current_temperature],
    add_generation_prompt=True,
    return_dict=True,
    return_tensors="pt"
)
```

## Complete Example

Start by loading the model and defining your tools and conversation:

```python
import json
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained(
    "LiquidAI/LFM2.5-1.2B-Instruct",
    dtype="bfloat16",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2.5-1.2B-Instruct")

tools = [{
    "name": "get_candidate_status",
    "description": "Retrieves the current status of a candidate in the recruitment process",
    "parameters": {
        "type": "object",
        "properties": {
            "candidate_id": {
                "type": "string",
                "description": "Unique identifier for the candidate",
            }
        },
        "required": ["candidate_id"],
    },
}]

messages = [
    {"role": "system", "content": f"List of tools: {json.dumps(tools)}"},
    {"role": "user", "content": "What is the current status of candidate ID 12345?"},
]
```

Generate the first response. The model may decide to call a tool:

```python
inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    return_dict=True,
    return_tensors="pt"
)
outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
response = tokenizer.decode(
    outputs[0][len(inputs["input_ids"][0]):],
    skip_special_tokens=False
)
```

The model outputs a tool call wrapped in special tokens:

```
<|tool_call_start|>[get_candidate_status(candidate_id="12345")]<|tool_call_end|>Checking the current status of candidate ID 12345.
```

Parse the tool call and execute the function externally. Here we use a mock function that simulates what would typically be an API call to your recruitment system:

```python
# Mock function (replace with actual API call in production)
def get_candidate_status(candidate_id: str):
    return [{
        "candidate_id": candidate_id,
        "status": "Interview Scheduled",
        "position": "Clinical Research Associate",
        "date": "2023-11-20",
    }]

messages.append({"role": "assistant", "content": response})
messages.append({"role": "tool", "content": json.dumps(get_candidate_status("12345"))})
```

Generate again so the model can interpret the tool result and respond to the user:

```python
inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    return_dict=True,
    return_tensors="pt"
)
outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
final = tokenizer.decode(
    outputs[0][len(inputs["input_ids"][0]):],
    skip_special_tokens=True
)
```

The full conversation now looks like this:

```
<|startoftext|><|im_start|>system
List of tools: [{"name": "get_candidate_status", ...}]<|im_end|>
<|im_start|>user
What is the current status of candidate ID 12345?<|im_end|}
<|im_start|>assistant
<|tool_call_start|>[get_candidate_status(candidate_id="12345")]<|tool_call_end|>Checking the current status of candidate ID 12345.<|im_end|>
<|im_start|>tool
[{"candidate_id": "12345", "status": "Interview Scheduled", ...}]<|im_end|>
<|im_start|>assistant
The candidate with ID 12345 is currently in the "Interview Scheduled" stage.<|im_end|>
```

## Vision Models

LFM2-VL and LFM2.5-VL vision models support text-only function calling. Use the tokenizer from the processor:

```python
from transformers import AutoProcessor, AutoModelForImageTextToText

processor = AutoProcessor.from_pretrained("LiquidAI/LFM2.5-VL-1.6B")
model = AutoModelForImageTextToText.from_pretrained(
    "LiquidAI/LFM2.5-VL-1.6B",
    device_map="auto",
    dtype="bfloat16"
)

tools = [{
    "name": "get_weather",
    "description": "Get current weather for a location",
    "parameters": {
        "type": "object",
        "properties": {"location": {"type": "string"}},
        "required": ["location"]
    }
}]

messages = [{"role": "user", "content": "What's the weather in Paris?"}]

inputs = processor.tokenizer.apply_chat_template(
    messages,
    tools=tools,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
)

input_ids = inputs["input_ids"].to(model.device)
outputs = model.generate(input_ids, max_new_tokens=256)
response = processor.tokenizer.decode(
    outputs[0, input_ids.shape[1]:],
    skip_special_tokens=False
)
```

## Best Practices

Tool definitions consume context tokens since they're inserted as text. For large tool lists (100+ tools), this can use significant portions of your context window.

To manage this effectively, only include tools relevant to the current request. Write clear, concise descriptions. Group related tools and remove unused ones when they're not needed.
