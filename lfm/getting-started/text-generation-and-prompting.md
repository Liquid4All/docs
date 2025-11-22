# Text Generation and Prompting

This guide covers how to effectively use system prompts, user prompts, and assistant prompts with LFM2 models, along with an overview of sampling parameters and special prompting recipes for specific models.

## Prompt Roles

LFM2 models use a structured conversation format with three main prompt roles:

### System Prompt

The system prompt (optional) sets the assistant's behavior, context, and instructions. It defines who the assistant is and how it should respond.

**Use cases:**
- Setting the assistant's personality or role
- Providing context about the task or domain
- Specifying output format requirements
- Defining constraints or guidelines

**Example:**
```python
messages = [
    {"role": "system", "content": "You are a helpful coding assistant. Always provide code examples with explanations."},
    {"role": "user", "content": "How do I sort a list in Python?"}
]
```

### User Prompt

The user prompt contains the actual question, instruction, or request from the user. This is the primary input that the model will respond to.

**Example:**
```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Explain quantum computing in simple terms."}
]
```

### Assistant Prompt

The assistant prompt allows you to provide a partial response that the model will continue from. This is useful for:

- **Multi-turn conversations**: Continuing a previous assistant response or building conversation history
- **Few-shot prompting**: Providing example interactions to guide the model's behavior
- **Prefill**: Starting the model with a specific format or structure (e.g., JSON opening brace)

**Example (multi-turn conversation):**
```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the benefits of exercise?"},
    {"role": "assistant", "content": "Exercise has many benefits including:\n1. Improved cardiovascular health\n2. "},  # Partial response
]
```

**Example (few-shot prompting):**
```python
messages = [
    {"role": "system", "content": "You are a helpful assistant that formats dates."},
    {"role": "user", "content": "2024-01-15"},
    {"role": "assistant", "content": "January 15, 2024"},
    {"role": "user", "content": "2024-12-25"},
    {"role": "assistant", "content": "December 25, 2024"},
    {"role": "user", "content": "2024-03-08"}  # Model is more likely to follow the pattern
]
```

**Example (prefill for structured output):**
```python
messages = [
    {"role": "system", "content": "Extract information and return as JSON."},
    {"role": "user", "content": "Extract the name and age from: John is 30 years old."},
    {"role": "assistant", "content": "{\n  \"name\": "}  # Prefill with JSON structure
]
```

For full structured generation with schema validation, consider using [Outlines](../frameworks/outlines.md), which provides robust support for constrained generation.

## Sampling Parameters

Sampling parameters control how the model generates text, balancing creativity, determinism, and output quality.

**Temperature** (`temperature`) - Controls randomness (0.0-2.0). Lower values (0.1-0.7) produce more deterministic outputs; higher values (0.8-1.5) increase creativity.

**Top-p (Nucleus Sampling)** (`top_p`) - Samples from tokens whose cumulative probability exceeds `p` (0.0-1.0). Lower values (0.1-0.5) are more focused; higher values (0.7-0.95) allow more diversity.

**Top-k** (`top_k`) - Limits sampling to the top `k` most likely tokens. Lower values (10-50) focus on high-probability tokens; higher values (50-100) increase diversity.

**Min-p** (`min_p`) - Filters tokens below `min_p * max_probability` (0.0-1.0). Helps maintain quality while allowing diversity.

**Repetition Penalty** (`repetition_penalty`) - Reduces likelihood of repetition (1.0 = no penalty, 2.0+ = strong penalty). Values > 1.0 help prevent repetitive outputs.

**Max Tokens** (`max_tokens`, `max_new_tokens`) - Maximum number of tokens to generate, preventing infinite generation.

Each inference platform has slightly different implementations for sampling parameters. Check the specific inference platform documentation (e.g., [Transformers](../inference/transformers.md), [vLLM](../inference/vllm.md), [llama.cpp](../inference/llama-cpp.md)) for exact parameter names and syntax.

### Recommended Settings

**Recommended configuration for all text models:**
- `temperature=0.3`
- `min_p=0.15`
- `repetition_penalty=1.05`

Liquid-Nanos models may have [special prompting recipes](#special-prompting-recipes) with different recommended parameters. See the Special Prompting Recipes section below for model-specific guidance.

## Special Prompting Recipes

Certain LFM2 models have specialized prompting requirements for optimal performance.

### LFM2-Extract

LFM2-Extract models are designed for structured information extraction. They require a specific system prompt format that defines the extraction schema.

**Generation Parameters:**
We strongly recommend using greedy decoding with `temperature=0`.

**System Prompt:**
If no system prompt is provided, the model will default to JSON outputs. We recommend providing a system prompt with a specific format (JSON, XML, or YAML) and a given schema to improve accuracy (see the following example).

**System Prompt Format:**
```
Identify and extract information matching the following schema. Return data as a JSON object. Missing data should be omitted.

Schema:
- field_name: "Description of what to extract"
- nested_object:
  - nested_field: "Description"
```

<details>
<summary>Example</summary>

**System Prompt:**
```
Identify and extract information matching the following schema. Return data as a JSON object. Missing data should be omitted.

Schema:
- project_name: "The name of the martial arts venture"
- executive_summary: "A brief overview of the business"
- financial_projections:
  - startup_costs: "Initial investment required"
  - projected_revenue_year_1: "Expected revenue in the first year"
  - projected_revenue_year_3: "Expected revenue in the third year"
  - return_on_investment: "Timeframe for recouping investment"
- facility_details:
  - location:
    - address: "Full address of the facility"
    - latitude: "Latitude coordinate"
    - longitude: "Longitude coordinate"
    - distance_to_park_boundary: "Distance to park boundary"
    - noise_level_assessment: "Noise level rating"
```

**User Prompt:**
```
We have secured a lease for a facility located at 345 Ocean View Drive, Seward, AK 99664. The facility offers 3000 sq ft of dedicated training space. Its location is approximately 2 miles from the boundary of the Kenai Fjords National Park. A noise level assessment has been conducted, resulting in a rating of Moderate. The coordinates of the facility are 60.1728° N latitude and 149.3422° W longitude.
```

**Assistant Response:**
```json
{
  "project_name": "Arctic Spirit Martial Arts",
  "executive_summary": "This business plan outlines the establishment of a premier martial arts training center in Seward, Alaska.",
  "financial_projections": {
    "startup_costs": "$75000",
    "projected_revenue_year_1": "$120000",
    "projected_revenue_year_3": "$250000",
    "return_on_investment": "3 years"
  },
  "facility_details": {
    "location": {
      "address": "345 Ocean View Drive, Seward, AK 99664",
      "latitude": "60.1728° N",
      "longitude": "149.3422° W",
      "distance_to_park_boundary": "2 miles",
      "noise_level_assessment": "Moderate"
    }
  }
}
```

</details>

⚠️ **The model is intended for single turn conversations.**

---

### LFM2-RAG

LFM2-RAG models are optimized for Retrieval-Augmented Generation tasks. They work best when provided with relevant documents in the system prompt.

**Generation Parameters:**
We recommend using greedy decoding with `temperature=0`.

**System Prompt Format:**
```
The following documents may provide you additional information to answer questions:

<document1>
[Document content here]
</document1>

<document2>
[Document content here]
</document2>
```

<details>
<summary>Example</summary>

**System Prompt:**
```
The following documents may provide you additional information to answer questions:

<document1>
The centre, which was created in 1906, has been instrumental in advancing agriculture research. The library at the Agriculture Canada research centre in Lethbridge serves 48 scientists and 85 technicians, along with many visiting staff and students.
</document1>
```

**User Prompt:**
```
How many individuals were reported to be served by the library at the Agriculture Canada research centre in Lethbridge?
```

**Assistant Response:**
```
The library at the Agriculture Canada research centre in Lethbridge was reported to serve 48 scientists and 85 technicians, along with many visiting staff and students.
```

</details>

---

### LFM2-Tool

LFM2-Tool models are optimized for efficient and precise tool calling.

**Generation Parameters:**
We recommend using greedy decoding with `temperature=0`.

For detailed information on tool use, including how to define tools, format tool calls, and handle tool responses, see the [Tool Use](../key-concepts/tool-use.md) guide.

---

### LFM2-350M-ENJP-MT

LFM2-350M-ENJP-MT is a specialized English-Japanese translation model that requires a specific system prompt to specify translation direction.

**System Prompts:**

LFM2-350M-ENJP-MT will not work without one of the two following system prompts:

- **`"Translate to Japanese."`** for English to Japanese translation
- **`"Translate to English."`** for Japanese to English translation

**Chat Template:**

The chat template can be applied using the dedicated `.apply_chat_template()` function from Hugging Face transformers. However, you must supply the system prompt that specifies the translation directionality.

<details>
<summary>Example</summary>

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-350M-ENJP-MT")

chat = [
    {"role": "system", "content": "Translate to Japanese."},
    {"role": "user", "content": "What is C. elegans?"}
]

prompt = tokenizer.apply_chat_template(chat, tokenize=False)
print(prompt)
```

**Output:**
```
<|startoftext|><|im_start|>system
Translate to Japanese.<|im_end|>
<|im_start|>user
What is C. elegans?<|im_end|>
<|im_start|>assistant
C. elegansとは何ですか？<|im_end|>
```

</details>

⚠️ **The model is intended for single turn conversations.**

---

### LFM2-350M-PII-Extract-JP

LFM2-350M-PII-Extract-JP is designed to extract personally identifiable information (PII) from Japanese text and output it in JSON format. The output can be used to mask sensitive information in contracts, emails, personal medical reports, insurance bills, etc. directly on-device.

**Generation Parameters:**
We strongly recommend using greedy decoding with `temperature=0`.

**System Prompt:**
This checkpoint requires the following system prompt format:

```
Extract <address>, <company_name>, <email_address>, <human_name>, <phone_number>
```

The model can be configured to extract only specific entities. For example, `Extract <human_name>` will output only human names. For optimal performance, entity categories should be listed in alphabetical order as shown above.

**Output Format:**
The model outputs JSON format with lists for each category. If no entities are found for a category, an empty list is returned. If entities exist, a list of extracted strings is returned for that category.

The model is trained to output entities exactly as they appear in the text. If the same entity appears multiple times with different notation variations, all variations are output to enable exact-match masking.

<details>
<summary>Example</summary>

**System Prompt:**
```
Extract <address>, <company_name>, <email_address>, <human_name>, <phone_number>
```

**User Prompt:**
```
こんにちは、ラミンさんに B200 GPU を 10000 台 至急請求してください。連絡先は celegans@liquid.ai (電話番号010-000-0000) で、これは C. elegans 線虫に着想を得たニューラルネットワークアーキテクチャを 今すぐ構築するために不可欠です。
```

**Assistant Response:**
```json
{"address": [], "company_name": [], "email_address": ["celegans@liquid.ai"], "human_name": ["ラミン"], "phone_number": ["010-000-0000"]}
```

</details>

⚠️ **The model is intended for single turn conversations.**
