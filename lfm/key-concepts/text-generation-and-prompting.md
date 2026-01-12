# Prompting Guide

This guide covers how to effectively use system prompts, user prompts, and assistant prompts with LFM2 models, along with an overview of sampling parameters and special prompting recipes for specific models.

## Prompt Roles

LFM2 models use a structured conversation format with three prompt roles:

- **`system`** (optional) - Sets assistant behavior, context, and instructions. Use for personality, task context, output format, or constraints.
- **`user`** - Contains the question, instruction, or request from the user.
- **`assistant`** - Provides a partial response for the model to continue from. Useful for multi-turn conversations, few-shot prompting, or prefilling structured outputs (e.g., JSON opening brace).

**Example:**
```python
messages = [
    {"role": "system", "content": "You are a helpful coding assistant."},
    {"role": "user", "content": "How do I sort a list in Python?"}
]
```

<details>
<summary>Additional examples: few-shot prompting and prefill</summary>

**Multi-turn conversations / Few-shot prompting:**

Continue a previous conversation or provide example interactions to guide the model's behavior. The model learns from the conversation history and applies patterns to new inputs.

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the benefits of exercise?"},
    {"role": "assistant", "content": "Exercise has many benefits including:\n1. Improved cardiovascular health\n2. "},  # Partial response to continue
    {"role": "user", "content": "Tell me more about cardiovascular health."}
]
```

Or provide few-shot examples:

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant that formats dates."},
    {"role": "user", "content": "2024-01-15"},
    {"role": "assistant", "content": "January 15, 2024"},
    {"role": "user", "content": "2024-12-25"},
    {"role": "assistant", "content": "December 25, 2024"},
    {"role": "user", "content": "2024-03-08"}  # Model follows the pattern
]
```

**Prefill for structured output:**

Start the model with a specific format or structure (e.g., JSON opening brace) to guide it toward structured outputs.

```python
messages = [
    {"role": "system", "content": "Extract information and return as JSON."},
    {"role": "user", "content": "Extract the name and age from: John is 30 years old."},
    {"role": "assistant", "content": "{\n  \"name\": "}  # Prefill with JSON structure
]
```

</details>

For structured generation with schema validation, see [Outlines](../frameworks/outlines.md).

## 💬 Text Models

Control text generation behavior, balancing creativity, determinism, and quality:

- **`temperature`** (0.0-2.0) - Randomness control. Lower (0.1-0.7) = deterministic; higher (0.8-1.5) = creative.
- **`top_p`** (0.0-1.0) - Nucleus sampling. Lower (0.1-0.5) = focused; higher (0.7-0.95) = diverse.
- **`top_k`** - Limits to top-k tokens. Lower (10-50) = high-probability; higher (50-100) = diverse.
- **`min_p`** (0.0-1.0) - Filters tokens below `min_p * max_probability`. Maintains quality with diversity.
- **`repetition_penalty`** (1.0+) - Reduces repetition. 1.0 = no penalty; >1.0 = prevents repetition.
- **`max_tokens`** / **`max_new_tokens`** - Maximum tokens to generate.

Parameter names and syntax vary by platform. See [Transformers](../inference/transformers.md), [vLLM](../inference/vllm.md), or [llama.cpp](../inference/llama-cpp.md) for details.

### Recommended Settings <span style={{display: 'none'}}>Text</span>

**For LFM2.5 text models:**
- `temperature=0.1`
- `top_k=50`
- `top_p=0.1`
- `repetition_penalty=1.05`

**For LFM2 text models:**
- `temperature=0.3`
- `min_p=0.15`
- `repetition_penalty=1.05`

Note that Liquid Nanos have [special requirements](#liquid-nanos) with different parameters.

## 👁️ Vision Models

LFM2-VL models use a **variable resolution encoder** to control the quality/speed tradeoff by adjusting how images are tokenized.

### Image Token Management

Control image tokenization with:
- **`min_image_tokens`** - Minimum tokens for image encoding
- **`max_image_tokens`** - Maximum tokens for image encoding  
- **`do_image_splitting`** - Split large images into 512×512 patches

**How it works:** Large images are split into non-overlapping patches, then a 2-layer MLP connector with pixel unshuffle reduces tokens (e.g., 256×384 → 96 tokens, 1000×3000 → 1,020 tokens). Adjust `min_image_tokens` and `max_image_tokens` to balance quality vs. speed.

**Example configurations:**
```python
# High quality (slower)
max_image_tokens=256, min_image_tokens=128

# Balanced
max_image_tokens=128, min_image_tokens=64

# Fast (lower quality)
max_image_tokens=64, min_image_tokens=32
```

### Recommended Settings <span style={{display: 'none'}}>Vision</span>

**For vision models:**
- `temperature=0.1`
- `min_p=0.15`
- `repetition_penalty=1.05`
- `min_image_tokens=64`
- `max_image_tokens=256`
- `do_image_splitting=True`

## 🎯 Liquid Nanos

### LFM2-Extract

Structured information extraction models. Use `temperature=0` (greedy decoding).

**System Prompt Format:**
```
Identify and extract information matching the following schema. Return data as a JSON object. Missing data should be omitted.

Schema:
- field_name: "Description of what to extract"
- nested_object:
  - nested_field: "Description"
```

If no system prompt is provided, defaults to JSON. Specify format (JSON, XML, or YAML) and schema for better accuracy.

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

### LFM2-RAG

Optimized for Retrieval-Augmented Generation. Use `temperature=0` (greedy decoding). Provide relevant documents in the system prompt.

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

### LFM2-Tool

Optimized for efficient and precise tool calling. Use `temperature=0` (greedy decoding). See the [Tool Use](../key-concepts/tool-use.md) guide for details.

### LFM2-350M-ENJP-MT

Specialized English-Japanese translation model. **Requires** one of these system prompts:
- `"Translate to Japanese."` - English → Japanese
- `"Translate to English."` - Japanese → English

Use `.apply_chat_template()` with the system prompt to specify direction.

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

### LFM2-350M-PII-Extract-JP

Extracts PII from Japanese text as JSON. Use `temperature=0` (greedy decoding). Output can mask sensitive information on-device.

**System Prompt Format:**
```
Extract <address>, <company_name>, <email_address>, <human_name>, <phone_number>
```

Extract specific entities by listing only what you need (e.g., `Extract <human_name>`). List categories in alphabetical order for optimal performance.

**Output Format:** JSON with lists per category. Empty lists for missing entities. Outputs entities exactly as they appear (including notation variations) for exact-match masking.

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

### LFM2-2.6B-Transcript

Designed for private, on-device meeting summarization. Use `temperature=0.3` for optimal results.

**Generation Parameters:**
- `temperature=0.3` (strongly recommended)

**System Prompt Format:**
```
You are an expert meeting analyst. Analyze the transcript carefully and provide clear, accurate information based on the content.
```

**Input Format:**

The model expects meeting transcripts in a specific format:

```
<user_prompt>

Title (example: Claims Processing training module)
Date (example: July 2, 2021)
Time (example: 1:00 PM)
Duration (example: 45 minutes)
Participants (example: Julie Franco (Training Facilitator), Amanda Newman (Subject Matter Expert))
----------
**Speaker 1**: Message 1 (example: **Julie Franco**: Good morning, everyone. Thanks for joining me today.)
**Speaker 2**: Message 2 (example: **Amanda Newman**: Good morning, Julie. Happy to be here.)
etc.
```

Replace `<user_prompt>` with one of the following summary types, or combine multiple prompts:

| Summary type | User prompt |
|--------------|-------------|
| Executive summary | Provide a brief executive summary (2-3 sentences) of the key outcomes and decisions from this transcript. |
| Detailed summary | Provide a detailed summary of the transcript, covering all major topics, discussions, and outcomes in paragraph form. |
| Action items | List the specific action items that were assigned during this meeting. Include who is responsible for each item when mentioned. |
| Key decisions | List the key decisions that were made during this meeting. Focus on concrete decisions and outcomes. |
| Participants | List the participants mentioned in this transcript. Include their roles or titles when available. |
| Topics discussed | List the main topics and subjects that were discussed in this meeting. |

<details>
<summary>Example</summary>

**Example inputs and outputs:**

| Title | Input meeting | Model output |
|-------|---------------|--------------|
| Budget planning | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/meeting1.txt) | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/output1.txt) |
| Design review | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/meeting2.txt) | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/output2.txt) |
| Coffee chat / social hour | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/meeting3.txt) | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/output3.txt) |
| Procurement / vendor review | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/meeting4.txt) | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/output4.txt) |
| Task force meeting | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/meeting5.txt) | [Link](https://huggingface.co/LiquidAI/LFM2-2.6B-Transcript/resolve/main/examples/output5.txt) |

**System Prompt:**
```
You are an expert meeting analyst. Analyze the transcript carefully and provide clear, accurate information based on the content.
```

**User Prompt:**
```
Provide a detailed summary of the transcript, covering all major topics, discussions, and outcomes in paragraph form.

Title: Budget Planning Meeting
Date: March 15, 2024
Time: 2:00 PM
Duration: 60 minutes
Participants: Sarah Chen (Finance Director), Mike Johnson (Operations Manager), Lisa Park (HR Manager)
----------
**Sarah Chen**: Good afternoon everyone. Let's start by reviewing our Q1 budget performance.
**Mike Johnson**: Thanks Sarah. Operations came in 5% under budget this quarter.
**Lisa Park**: HR expenses were slightly over due to the new hiring initiative, but we're on track for Q2.
**Sarah Chen**: That's good to hear. For Q2, we need to allocate additional funds for the expansion project.
**Mike Johnson**: I can provide a detailed breakdown by next week.
**Lisa Park**: I'll coordinate with Mike on staffing needs for the expansion.
```

**Assistant Response:**
```
The Budget Planning Meeting on March 15, 2024, reviewed Q1 financial performance and planned for Q2. Operations performed well, coming in 5% under budget, while HR expenses were slightly over due to new hiring. The team discussed allocating additional funds for an expansion project in Q2, with Mike Johnson committing to provide a detailed breakdown by next week and Lisa Park coordinating staffing needs.
```

</details>

**Try it yourself:** See the [meeting summarization cookbook example](https://github.com/Liquid4All/cookbook/tree/main/examples/meeting-summarization) for a complete implementation.

⚠️ **The model is intended for single turn conversations with a specific format.**
