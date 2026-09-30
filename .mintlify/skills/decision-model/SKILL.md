---
name: decision-model
description: Use Liquid AI's d1 decision model for classification, routing, scoring, yes/no decisions, guardrails, reranking, and agent workflow decisions.
license: MIT
compatibility: Requires a Liquid AI API key and HTTPS access to https://api.liquid.ai.
metadata:
  author: Liquid AI
  version: "1.0"
  documentation: https://docs.liquid.ai/lfm/models/decision-models
---

# Liquid d1 Decision Model for Agents

Send context and typed questions to `POST https://api.liquid.ai/decisions/v1/systemone`. Receive structured decisions in `answers`, keyed by your question names. This is a decision model, not a chat endpoint: it evaluates a fixed set of outcomes instead of generating text.

Use it for classification, routing, content moderation, scoring, triage, reranking, guardrails, and selecting an agent's next action. Start with the example below, verify the returned fields, then substitute the user's context and criteria.

## Authentication

Get an API key from [console.liquid.ai](https://console.liquid.ai) (Dashboard > API Keys). Keys are prefixed with `liquid_`.

```bash
export LIQUID_API_KEY="liquid_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Keep the key server-side, outside client bundles and logs.

## Three primitives

Every question uses one of three types:

| If the answer is... | Use | Returns |
|---|---|---|
| Yes or no, where the probability is useful | **noul** | Float 0-1: probability the answer is yes |
| Pick one from unordered categories | **choice** | Selected option + probability distribution + confidence |
| Rate on an ordered scale | **score** | Continuous score + probability distribution + confidence |

Pick the type that matches what your code does next. If it branches on a category, use **choice**. If it gates on a boolean, use **noul**. If it needs a position on a rubric, use **score**.

**Noul vs Score**: A Noul at 0.5 means maximum uncertainty between yes and no. It says nothing about degree. If you want to measure degree (severity, skill level, frustration), use a Score with defined levels. If you need a yes/no gate, use a Noul.

## First request

```bash
curl -s https://api.liquid.ai/decisions/v1/systemone \
  -H "Authorization: Bearer $LIQUID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "d1:free",
    "state": "I was charged twice for my subscription last month. Please refund the duplicate charge today.",
    "questions": {
      "route": {
        "type": "choice",
        "instructions": "Which team should handle this request?",
        "criteria": {
          "billing": "Charges, payments, and refunds",
          "technical": "Product bugs and outages",
          "account": "Login and account settings"
        }
      },
      "urgency": {
        "type": "score",
        "instructions": "How urgent is this request?",
        "criteria": [
          "Routine: no immediate impact",
          "Time-sensitive: should handle today",
          "Critical: immediate harm or system failure"
        ]
      },
      "wants_refund": {
        "type": "noul",
        "instructions": "Does the customer explicitly request a refund?"
      }
    }
  }'
```

## Read the result

A successful response contains `model`, `answers`, and token `usage`:

```json
{
  "model": "d1:free",
  "answers": {
    "route": {
      "type": "choice",
      "choice": "billing",
      "probabilities": {
        "billing": 0.9997,
        "account": 0.0002,
        "technical": 0.0001
      },
      "confidence": 0.9996
    },
    "urgency": {
      "type": "score",
      "score": 1.2,
      "confidence": 0.85,
      "probabilities": {
        "0": 0.05,
        "1": 0.70,
        "2": 0.25
      },
      "legend": {
        "0": "Routine: no immediate impact",
        "1": "Time-sensitive: should handle today",
        "2": "Critical: immediate harm or system failure"
      }
    },
    "wants_refund": {
      "type": "noul",
      "noul": 0.99
    }
  },
  "usage": {
    "input_tokens": 84,
    "output_tokens": 0
  }
}
```

| Question | Key fields | Interpretation |
|---|---|---|
| `route` (choice) | `.choice`, `.confidence`, `.probabilities` | Selected option, how clear-cut, distribution over all options |
| `urgency` (score) | `.score`, `.confidence`, `.probabilities`, `.legend` | Zero-based continuous position on the rubric. 3 levels -> value from 0 to 2 |
| `wants_refund` (noul) | `.noul` | Probability the answer is yes (0.0 to 1.0) |

`usage.output_tokens` is always 0. Decision models do not generate tokens.

## Request rules

- Required fields: `model`, `questions`, and exactly one of `state` or `messages`.
- `state` is the context to evaluate: plain text, a JSON object, or an array. A URL in text is not fetched.
- For conversations, use `messages` (e.g., `[{"role": "user", "content": "..."}]`) instead of `state`.
- Each question needs a unique key, a `type`, and `instructions`.
- `choice` requires `criteria` as an object with 2+ named options. Descriptions can be null.
- `score` requires `criteria` as an ordered array of 2+ rubric levels. Levels are indexed from 0.
- `noul` takes no criteria.
- Multiple questions share the same context in one call and are evaluated in parallel. Adding a question adds little latency compared to adding another API call.
- Responses are non-streaming JSON. Do not send chat settings like `temperature`, `max_tokens`, or `stream`.

## Using confidence and probabilities

Decision models return calibrated probabilities, not just labels. Use them to set thresholds and handle uncertainty:

**Route with fallback when uncertain:**
```bash
# If confidence is low, fall back to the most capable handler
if confidence < 0.5:
    route to most capable handler
```

**Noul with three-way threshold:**
```bash
if noul > 0.8: block
elif noul < 0.2: allow
else: human_review
```

**Score as continuous value:**
```bash
if score >= 2.5: page on-call engineer
elif score >= 1.5: escalate to senior support
else: add to standard queue
```

## When to use d1 vs. an LLM

Use d1 when the answer is one of N known options:
- Classification and categorization
- Routing (tickets, emails, requests)
- Scoring, triage, and prioritization
- Content moderation and guardrails
- Binary decisions (yes/no gates)
- Reranking search results
- LLM-as-judge replacement
- Agent tool-call approval

Use an LLM when the answer is new text the model must compose:
- Text generation (emails, summaries, reports, code)
- Open-ended Q&A
- Multi-turn conversation
- Complex multi-step reasoning

## Python SDK

```bash
pip install typesafe-sdk
```

```python
import os
from typesafe_sdk import TypeSafeClient, Choice, Noul, Score

client = TypeSafeClient(
    api_key=os.environ["LIQUID_API_KEY"],
    base_url="https://api.liquid.ai",
)

result = client.system_one(
    model="d1:free",
    state="I was charged twice for my subscription last month.",
    questions={
        "route": Choice(
            instructions="Which team should handle this request?",
            criteria={
                "billing": "Charges, payments, and refunds",
                "technical": "Product bugs and outages",
                "account": "Login and account settings",
            },
        ),
        "wants_refund": Noul(
            instructions="Does the customer explicitly request a refund?",
        ),
        "urgency": Score(
            instructions="How urgent is this request?",
            criteria=[
                "Routine: no immediate impact",
                "Time-sensitive: should handle today",
                "Critical: immediate harm or system failure",
            ],
        ),
    },
)

print(result.answers["route"].choice)        # "billing"
print(result.answers["route"].confidence)     # 0.99
print(result.answers["wants_refund"].noul)    # 0.99
print(result.answers["urgency"].score)        # 1.2
```

## TypeScript SDK

```bash
npm install @typesafe-ai/sdk
```

```typescript
import { TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient({
  apiKey: process.env.LIQUID_API_KEY!,
  baseURL: "https://api.liquid.ai",
});

const result = await client.systemOne({
  model: "d1:free",
  state: "I was charged twice for my subscription last month.",
  questions: {
    route: {
      type: "choice",
      instructions: "Which team should handle this request?",
      criteria: {
        billing: "Charges, payments, and refunds",
        technical: "Product bugs and outages",
        account: "Login and account settings",
      },
    },
    wants_refund: {
      type: "noul",
      instructions: "Does the customer explicitly request a refund?",
    },
    urgency: {
      type: "score",
      instructions: "How urgent is this request?",
      criteria: [
        "Routine: no immediate impact",
        "Time-sensitive: should handle today",
        "Critical: immediate harm or system failure",
      ],
    },
  },
});

console.log(result.answers.route.choice);        // "billing"
console.log(result.answers.route.confidence);     // 0.99
console.log(result.answers.wants_refund.noul);    // 0.99
console.log(result.answers.urgency.score);        // 1.2
```

## Reference

- [Decision Models](https://docs.liquid.ai/lfm/models/decision-models): API reference, all three primitives, setup
- [Decision Model Guide](https://docs.liquid.ai/guides/decision-model-guide): Migration examples from LLM calls to d1
- [Model Library](https://docs.liquid.ai/lfm/models/complete-library): All available Liquid AI models
