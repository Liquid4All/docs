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

LFM2.5 supports function calling with a simplified format:

- **Function Definition**: Provide tools as a JSON object in the system prompt (recommended), or use `tokenizer.apply_chat_template()` with the `tools` argument
- **Function Call**: Model generates Pythonic function calls between `<|tool_call_start|>` and `<|tool_call_end|>` tokens. You can override to JSON format by requesting it in the system prompt
- **Function Execution**: Execute the function call and return results as a `tool` role message
- **Final Answer**: Model interprets the tool result and responds to the original user prompt in plain text

## Defining Tools

**Recommended:** Provide tools as a JSON object in the system prompt. Alternatively, use `tokenizer.apply_chat_template()` with the `tools` argument.

### JSON in System Prompt (Recommended)

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

### Using apply_chat_template()

You can also use `apply_chat_template()` with Python functions or JSON schemas:

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
inputs = tokenizer.apply_chat_template(messages, tools=[get_current_temperature], ...)
```

## Complete Example

The tool use workflow:

1. **Define tools** as JSON in the system prompt (or use `apply_chat_template()` with `tools`)
2. **Generate** - model generates Pythonic function calls between `<|tool_call_start|>` and `<|tool_call_end|>` tokens
3. **Execute** the function call and append result with `role="tool"`
4. **Regenerate** - model interprets the tool result and responds to the user

**Example:**

```python
import json
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("LiquidAI/LFM2.5-1.2B-Instruct", torch_dtype="bfloat16", device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2.5-1.2B-Instruct")

# Define tools as JSON
tools = [{
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

# Create conversation with tools in system prompt
messages = [
    {"role": "system", "content": f"List of tools: {json.dumps(tools)}"},
    {"role": "user", "content": "What is the current status of candidate ID 12345?"}
]

# Generate first response (may include tool call)
inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_dict=True, return_tensors="pt")
outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
response = tokenizer.decode(outputs[0][len(inputs["input_ids"][0]):], skip_special_tokens=False)

# Parse tool call: <|tool_call_start|>[get_candidate_status(candidate_id="12345")]<|tool_call_end|>
# Execute function and append result
def get_candidate_status(candidate_id: str):
    return [{"candidate_id": candidate_id, "status": "Interview Scheduled", "position": "Clinical Research Associate", "date": "2023-11-20"}]

messages.append({"role": "assistant", "content": response})
messages.append({"role": "tool", "content": json.dumps(get_candidate_status("12345"))})

# Generate final response
inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_dict=True, return_tensors="pt")
outputs = model.generate(**inputs.to(model.device), max_new_tokens=256)
final = tokenizer.decode(outputs[0][len(inputs["input_ids"][0]):], skip_special_tokens=True)
```

**Formatted output example:**

```
<|startoftext|><|im_start|>system
List of tools: [{"name": "get_candidate_status", ...}]<|im_end|>
<|im_start|>user
What is the current status of candidate ID 12345?<|im_end|>
<|im_start|>assistant
<|tool_call_start|>[get_candidate_status(candidate_id="12345")]<|tool_call_end|>Checking the current status of candidate ID 12345.<|im_end|>
<|im_start|>tool
[{"candidate_id": "12345", "status": "Interview Scheduled", ...}]<|im_end|>
<|im_start|>assistant
The candidate with ID 12345 is currently in the "Interview Scheduled" stage...<|im_end|>
```

**Note:** By default, LFM2.5 generates Pythonic function calls. To get JSON format, add "Output function calls as JSON" to your system prompt.

## Using Vision Models for Text-Only Tool Calling

LFM2.5-VL vision models can also be used for text-only function calling. Use the tokenizer from the processor:

```python
from transformers import AutoProcessor, AutoModelForImageTextToText

processor = AutoProcessor.from_pretrained("LiquidAI/LFM2.5-VL-1.6B")
model = AutoModelForImageTextToText.from_pretrained("LiquidAI/LFM2.5-VL-1.6B", device_map="auto", dtype="bfloat16")

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

# Apply chat template with tools using processor.tokenizer
inputs = processor.tokenizer.apply_chat_template(
    messages,
    tools=tools,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
)

input_ids = inputs["input_ids"].to(model.device)
outputs = model.generate(input_ids, max_new_tokens=256)
response = processor.tokenizer.decode(outputs[0, input_ids.shape[1]:], skip_special_tokens=False)
```

## Managing Tool Lists

- **Context usage**: Tool definitions are inserted as text in the prompt, consuming context tokens. Large tool lists (100+ tools) can use significant portions of your context window.
- **Large tool lists**: Only include tools relevant to the current request. Consider tool selection or categorization strategies to reduce context usage.
- **Best practices**: Provide clear, concise tool descriptions. Group related tools when possible. Remove unused tools from the list when they're not needed.
