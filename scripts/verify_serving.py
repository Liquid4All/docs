# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx", "pillow"]
# ///
import argparse
import base64
import io
import json
import logging
import pathlib

import httpx
from PIL import Image

logger = logging.getLogger(__name__)


def verify(args: argparse.Namespace) -> dict:
    content: str | list[dict] = "What is the capital of France?"
    expected = "paris"
    if args.vision:
        buffer = io.BytesIO()
        Image.new("RGB", (224, 224), "red").save(buffer, format="PNG")
        url = "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()
        content = [
            {"type": "image_url", "image_url": {"url": url}},
            {
                "type": "text",
                "text": "What is the dominant color? Answer with the color.",
            },
        ]
        expected = "red"
    penalty = "repeat_penalty" if args.framework == "llama" else "repetition_penalty"
    body = {
        "model": args.model,
        "messages": [{"role": "user", "content": content}],
        "temperature": 0.1,
        "max_tokens": 2048,
        "top_k": 50,
        penalty: args.repetition_penalty,
    }
    endpoint = args.base_url.rstrip("/") + "/chat/completions"
    checks = []
    with httpx.Client(timeout=180) as client:
        response = client.post(endpoint, json=body)
        response.raise_for_status()
        choice = response.json()["choices"][0]
        text = choice["message"].get("content") or ""
        checks.append(
            {
                "kind": "chat",
                "pass": expected in text.lower()
                and choice["finish_reason"] != "length",
                "text": text,
            }
        )

        fragments = []
        finish = None
        with client.stream("POST", endpoint, json={**body, "stream": True}) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if not line.startswith("data: ") or line == "data: [DONE]":
                    continue
                chunk = json.loads(line[6:])
                if not chunk.get("choices"):
                    continue
                choice = chunk["choices"][0]
                fragments.append(choice.get("delta", {}).get("content") or "")
                finish = choice.get("finish_reason") or finish
        text = "".join(fragments)
        checks.append(
            {
                "kind": "stream",
                "pass": expected in text.lower() and finish == "stop",
                "text": text,
            }
        )

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "description": "Get current weather for a city.",
                    "parameters": {
                        "type": "object",
                        "properties": {"city": {"type": "string"}},
                        "required": ["city"],
                        "additionalProperties": False,
                    },
                },
            }
        ]
        response = client.post(
            endpoint,
            json={
                **body,
                "messages": [
                    {
                        "role": "user",
                        "content": "Call get_weather to look up the weather in Paris.",
                    }
                ],
                "tools": tools,
                "tool_choice": "auto",
            },
        )
        response.raise_for_status()
        calls = response.json()["choices"][0]["message"].get("tool_calls") or []
        valid = False
        if calls and calls[0]["function"]["name"] == "get_weather":
            arguments = json.loads(calls[0]["function"]["arguments"])
            valid = arguments.get("city", "").lower() == "paris"
        checks.append({"kind": "tools", "pass": valid, "calls": calls})

        schema = {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
            "additionalProperties": False,
        }
        response = client.post(
            endpoint,
            json={
                **body,
                "messages": [
                    {
                        "role": "user",
                        "content": "Return the capital of France as JSON with a city field.",
                    }
                ],
                "response_format": {
                    "type": "json_schema",
                    "json_schema": {
                        "name": "capital",
                        "strict": True,
                        "schema": schema,
                    },
                },
            },
        )
        response.raise_for_status()
        choice = response.json()["choices"][0]
        text = choice["message"].get("content") or ""
        try:
            answer = json.loads(text)
            valid = set(answer) == {"city"} and answer["city"].lower() == "paris"
        except (ValueError, TypeError, AttributeError):
            valid = False
        checks.append(
            {
                "kind": "json",
                "pass": valid and choice["finish_reason"] != "length",
                "text": text,
            }
        )
    return {
        "model": args.model,
        "framework": args.framework,
        "base_url": args.base_url,
        "checks": checks,
        "pass": all(check["pass"] for check in checks),
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check chat, streaming, tools, and JSON against a running local model server."
    )
    parser.add_argument(
        "--base-url",
        required=True,
        help="Local OpenAI-compatible base URL, including /v1",
    )
    parser.add_argument("--model", required=True)
    parser.add_argument(
        "--framework", choices=["vllm", "sglang", "llama"], required=True
    )
    parser.add_argument("--vision", action="store_true")
    parser.add_argument("--repetition-penalty", type=float, default=1.1)
    parser.add_argument("--output", type=pathlib.Path, required=True)
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO)
    result = verify(args)
    args.output.write_text(json.dumps(result, indent=2) + "\n")
    for check in result["checks"]:
        logger.info("%s: %s", check["kind"], "PASS" if check["pass"] else "FAIL")
    if not result["pass"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
