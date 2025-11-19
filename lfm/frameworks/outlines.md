# Outlines

[Outlines](https://github.com/dottxt-ai/outlines) is a library for constrained text generation with LLMs. It provides two powerful approaches: **JSON Schema** for structured data extraction and **context-free grammars (CFGs)** for custom formats like function calling.

:::tip[**Use Outlines for:**]
- Guaranteed valid function calls and structured outputs
- JSON schema validation and data extraction
- Applications requiring pre-defined output formats
:::

Outlines enforces output constraints at generation time with zero runtime overhead, ensuring your model always produces parseable, valid results.

## Installation

Install Outlines with Transformers support:

```
pip install outlines transformers torch
```

## Setup

Outlines provides a simple interface for constrained generation. The examples below use Transformers, but Outlines works with all major inference frameworks including [vLLM](../inference/vllm.md), [llama.cpp](../inference/llama-cpp.md), [MLX](../inference/mlx.md), [Ollama](../inference/ollama.md), and more. See the [Outlines documentation](https://dottxt-ai.github.io/outlines/latest/) for framework-specific examples.

Start by wrapping your model:

```python
import outlines
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model with Outlines
model = outlines.from_transformers(
    AutoModelForCausalLM.from_pretrained("LiquidAI/LFM2-1.2B", device_map="auto"),
    AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")
)
```

## Basic Output Types

For simple use cases, Outlines supports several built-in output types that don't require schemas or grammars.

### Python Types

Generate outputs constrained to basic Python types:

```python
# Integer output
result = model("How many states are in the USA?", int, max_new_tokens=10)
print(result)  # Output: 50

# Float output
result = model("What is pi to 2 decimal places?", float, max_new_tokens=10)
print(result)  # Output: 3.14

# Boolean output
result = model("Is Python a programming language? Answer true or false.", bool, max_new_tokens=10)
print(result)  # Output: True
```

### Multiple Choice

Constrain outputs to a predefined list of options:

```python
from outlines.types import Choice

# Simple choice
colors = Choice(["red", "blue", "green", "yellow"])
result = model("What color is the sky?", colors, max_new_tokens=10)
print(result)  # Output: blue

# Categorical data
categories = Choice(["sports", "politics", "technology", "entertainment"])
result = model("Classify this headline: 'New AI model breaks records'", categories, max_new_tokens=10)
print(result)  # Output: technology
```

### Regex Patterns

Use regular expressions to define custom output formats:

```python
from outlines.types import Regex

# Phone number format
phone_pattern = Regex(r"\d{3}-\d{3}-\d{4}")
result = model("Generate a US phone number:", phone_pattern, max_new_tokens=20)
print(result)  # Output: 555-123-4567

# Email format
email_pattern = Regex(r"[a-z0-9]+@[a-z]+\.[a-z]+")
result = model("Generate an email address:", email_pattern, max_new_tokens=30)
print(result)  # Output: user@example.com

# Date format (YYYY-MM-DD)
date_pattern = Regex(r"\d{4}-\d{2}-\d{2}")
result = model("What is today's date?", date_pattern, max_new_tokens=15)
print(result)  # Output: 2025-01-15
```

## Advanced Structured Generation

For more complex use cases, Outlines offers two powerful approaches:

## JSON Schema (Structured Data)

Use `JSONSchema` when you need to extract structured data that maps cleanly to JSON. This is ideal for data extraction, API responses, and structured outputs.

**When to use:**
- Extracting information from unstructured text
- Generating API-compatible responses
- Creating structured database entries
- Parsing documents into predefined formats

```python
from outlines.types import JSONSchema

schema = JSONSchema('''{
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"},
        "city": {"type": "string"}
    },
    "required": ["name", "age", "city"]
}''')

prompt = "Extract information: John is 30 years old and lives in Boston."
result = model(prompt, schema, max_new_tokens=128)
print(result)
# Output: {"name": "John", "age": 30, "city": "Boston"}
```

### Complex JSON Structures

JSON schemas support nested objects and arrays:

```python
schema = JSONSchema('''{
    "type": "object",
    "properties": {
        "product": {"type": "string"},
        "price": {"type": "number"},
        "features": {
            "type": "array",
            "items": {"type": "string"}
        }
    }
}''')

prompt = "Describe this laptop: MacBook Pro with M3 chip and 16GB RAM, priced at $2499."
result = model(prompt, schema, max_new_tokens=256)
```

## Grammar-Based Generation (Function Calling)

Use context-free grammars (CFGs) when you need precise control over output format. This approach is more token-efficient than JSON and provides stronger guarantees for function calling and custom formats.

**When to use:**
- Function calling with specific syntax (Pythonic, custom formats)
- Token-efficient outputs (fewer tokens than JSON)
- Custom DSLs or specialized formats
- Edge applications where token count matters

Grammars use [Lark syntax](https://lark-parser.readthedocs.io/) to define valid output structures:

```python
from outlines.types import CFG

# Define grammar for function calls
grammar = """
?start: "<|tool_call_start|>[" function "]<|tool_call_end|>"

?function: play_media | set_volume

?play_media: "play_media(" media_args ")"
?media_args: "device = " device ", source = " source
?device: "'speaker'" | "'tv'"
?source: "'spotify'" | "'netflix'" | "'youtube'"

?set_volume: "set_volume(" volume ")"
?volume: "0" | "0.1" | "0.2" | "0.3" | "0.4" | "0.5" | "0.6" | "0.7" | "0.8" | "0.9" | "1.0"
"""

# Generate function call
prompt = "Play Spotify on the speaker at high volume."
result = model(prompt, CFG(grammar), max_new_tokens=64)
print(result)
# Output: <|tool_call_start|>[play_media(device = 'speaker', source = 'spotify')]<|tool_call_end|>
```

### Grammar Syntax

Grammars define rules using Lark syntax:

- **Rules**: Define patterns with `rule_name: pattern`
- **Alternatives**: Use `|` for choices (e.g., `"red" | "blue"`)
- **Optional**: Wrap in `()?` for optional parts
- **Repetition**: Use `*` for zero or more, `+` for one or more
- **Literals**: Wrap strings in quotes `"literal"`

### Multiple Function Calls

Grammars support multiple function calls in a single response:

```python
grammar = """
?start: "<|tool_call_start|>[" tool_calls "]<|tool_call_end|>"

?tool_calls: (function ", ")* function

?function: play_media | set_volume | close_blinds

?play_media: "play_media(" media_args ")"
?media_args: "device = " device ", source = " source
?device: "'speaker'" | "'tv'"
?source: "'spotify'" | "'netflix'"

?set_volume: "set_volume(" volume ")"
?volume: "0.5" | "0.7" | "0.9" | "1.0"

?close_blinds: "close_blinds(" ("percentage = " percentage)? ")"
?percentage: "50" | "75" | "100"
"""

prompt = "It's movie time! Close the blinds and play Netflix on the TV at medium volume."
result = model(prompt, CFG(grammar), max_new_tokens=128)
print(result)
# Output: <|tool_call_start|>[close_blinds(percentage = 100), play_media(device = 'tv', source = 'netflix'), set_volume(0.7)]<|tool_call_end|>
```

## Choosing the Right Approach

| Approach | Best For | Complexity | Token Efficiency |
|----------|----------|------------|------------------|
| **Python Types** | Simple typed outputs (int, float, bool) | Lowest | Highest |
| **Multiple Choice** | Classification, categorical data | Low | High |
| **Regex** | Custom formats (phone, email, dates) | Low-Medium | High |
| **JSON Schema** | Data extraction, API responses, nested structures | Medium | Moderate |
| **Grammar (CFG)** | Function calling, custom DSLs, complex formats | High | High - up to 2.6x fewer tokens |

**Rule of thumb:**
- Start with **Python Types** or **Multiple Choice** for simple outputs
- Use **Regex** for custom formats like phone numbers or dates
- Use **JSON Schema** for structured data extraction with nested objects
- Use **Grammars** for function calling, custom DSLs, or when token efficiency is critical

## Edge Applications

Outlines is particularly effective for edge deployment with compact models like `LiquidAI/LFM2-350M`. The combination provides:

- **Reliability**: Constraints guarantee valid outputs every time
- **Efficiency**: Pythonic function calls use ~2.6x fewer tokens than JSON
- **Low latency**: Zero runtime overhead from constraint enforcement
- **Deterministic**: No parsing failures or retry loops

:::note
Runtime masking adds a small, predictable overhead per step of a few microseconds; compile time scales with schema/grammar complexity.
:::

For a detailed example of using Outlines with LFM2-350M for smart home control, see our [blog post on structured generation](https://www.liquid.ai/blog/liquid-txt-collaboration).

## Reference

- [Outlines GitHub](https://github.com/dottxt-ai/outlines)
- [Outlines Documentation](https://dottxt-ai.github.io/outlines/)
- [LFM2 × .txt Collaboration Blog Post](https://www.liquid.ai/blog/liquid-txt-collaboration)
