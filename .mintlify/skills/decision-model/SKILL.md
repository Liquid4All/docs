---
name: decision-model
description: Integrate Liquid AI's d1 decision model or review existing LLM calls for migration to bounded classification, routing, scoring, reranking, and yes/no decisions. Use when the output is a decision over defined outcomes rather than generated text.
metadata:
  author: Liquid AI
  version: "1.0"
  documentation: https://docs.liquid.ai/lfm/models/decision-models
---

# Liquid AI Decision Model Skill

Use Liquid AI's d1 decision model when the output should be a structured decision rather than generated text. Good fits include classification, routing, binary gates, scoring, reranking, triage, moderation, guardrails, LLM-as-judge replacement, agent tool-call approval, and model routing or cascades.

Use an LLM instead when the task requires free-form text generation, creative writing, multi-turn conversation, complex multi-step reasoning, open-ended Q&A, summarization, or code generation.

## Setup

Get an API key from [console.liquid.ai](https://console.liquid.ai):

1. Register or sign in and join an organization.
2. Go to **Dashboard > API Keys**.
3. Create a key and store it server-side, outside client bundles and logs. Keys are prefixed with `liquid_`.

Set the key as an environment variable:

```bash
export LIQUID_API_KEY="liquid_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Requests require a Liquid AI API key and HTTPS access to this decision endpoint:

```text
POST https://console.liquid.ai/decisions/v1/systemone
```

## Request Shape

A decision model call contains:

- `model`: the decision model to use, such as `d1:free`.
- `state`: the context to evaluate, supplied as plain text or a JSON object.
- `questions`: one or more typed questions, each with a name, a `type`, and `instructions`.

Choice questions include `criteria` as an object mapping option names to descriptions. Score questions include `criteria` as an ordered array of rubric descriptions. Noul questions have no criteria. Multiple independent questions can be evaluated in one call against the same state. Use the decision request schema below; this is not a chat-completions endpoint.

## Primitives

Every question uses one of three types:

| If the answer is... | Use | Return shape |
|---|---|---|
| Yes or no, where the probability itself is useful | `noul` | A probability between 0 and 1 |
| One option from an unordered set | `choice` | A selected option, probability distribution, and confidence |
| A rating along an ordered rubric | `score` | A continuous score, probability distribution, legend, and confidence |

Pick the primitive based on what your code does next. Use Choice when code branches on a category. Use Score when code compares against an ordered threshold. Use Noul when code gates on a boolean probability.

Noul and Score are different. A Noul value near `0.5` means uncertainty between yes and no; it does not measure degree or intensity. Use Score for degree, severity, skill level, urgency, or similar ordered concepts.

Score levels are zero-based: an array of four levels produces a continuous score from `0` to `3`, computed as the probability-weighted position on the rubric. Preserve this meaning when replacing a one-based or integer LLM rating; update downstream thresholds or explicitly map the scale.

## Review and Migration

When asked to audit a project, trace candidate model calls through their prompts, schemas or parsers, and downstream consumers. Look for enums, booleans, numeric ratings, routing branches, and loops that score retrieved passages. For each candidate, identify the call site, the current output contract, the proposed primitive and criteria, and any required changes to thresholds or fallback behavior. A recommendation request should produce recommendations; implement replacements when the user requests code changes.

- Classification or routing to one category: use Choice with the labels the caller expects and descriptions that distinguish the options.
- Yes/no checks: use Noul and convert its probability to an action using explicit thresholds. Do not cast a nonzero probability directly to a boolean.
- Ordered severity, priority, quality, or urgency ratings: use Score with clearly defined levels.
- Reranking: evaluate each query/passage pair with Noul for binary relevance or Score for graded relevance, then sort descending. A Choice selects one option; it does not return a ranked list.
- Multiple independent decisions over the same input: combine them into named questions in one request. Keep separate calls when later questions depend on earlier results.

Keep generation calls for prose, code, summaries, or open-ended answers. In a mixed pipeline, replace only the bounded decision stage. Preserve the application's expected labels and error handling, and compare representative inputs with the existing behavior before switching callers.

## Reading Decisions

Read each result from `answers[question_name]`: `.noul` for yes probability, `.choice` for the selected label, or `.score` for the continuous rating. Choice and Score also expose `.probabilities` and `.confidence`; Score includes `.legend` mapping positions to rubric descriptions.

Treat HTTP or SDK errors as failures, not decisions; preserve the project's bounded retry policy and fallback behavior.

Use probabilities and confidence to handle ambiguous cases through an application-appropriate fallback. Set thresholds using representative data and the cost of incorrect decisions; example thresholds in the docs are illustrative. A model's tool-call approval verdict is an input to the application's policy, not permission to bypass existing authorization checks.

## cURL Example

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

Example response:

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

Decision models do not generate output tokens, so `usage.output_tokens` is `0`.

## Python Example

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

## References

- [Decision Models](https://docs.liquid.ai/lfm/models/decision-models): primitives, setup, API examples, and response fields
- [Decision Model Guide](https://docs.liquid.ai/guides/decision-model-guide): migration examples from LLM calls to d1
