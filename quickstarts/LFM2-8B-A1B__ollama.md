# LiquidAI/LFM2-8B-A1B with Ollama

Perfect for fast local development using an OpenAI API compatible server.
Ollama is not intended for production-ready deployments.

## Install Ollama

Go to [ollama.com/download](https://ollama.com/download) and follow the installation instructions
for your operating system. MacOS, Linux and Windows are supported.

## Pull the model checkpoint from Hugging Face and start the server

```shell
ollama run hf.co/LiquidAI/LFM2-8B-A1B-GGUF
```

After running this command for the first time, the model weights will be cached in your local drive. When you run the command for the second time, Ollama will directly load the model weights from disk into memory without trigger a re-download from Hugging Face.

You can check the list of models weights available in your cache with
```shell
ollama list
```

## Request chat completions

Install the OpenAI Python SDK
```shell
pip install openai
```

Generate chat completion with the model, either streaming or non-streaming the response.
```python
def generate_chat_completion_with_ollama(
    model_name: str = 'hf.co/LiquidAI/LFM2-8B-A1B-GGUF',
    stream: bool = False,
):
    from openai import OpenAI

    # Point to local Ollama server
    client = OpenAI(
        base_url='http://localhost:11434/v1',
        api_key='ollama',  # required but unused
    )

    response = client.chat.completions.create(
        model=model_name, # model name is ignored by Ollama
        messages=[
            {
                'role': 'user',
                'content': 'Why is C.Elegans?'
            }
        ],
        stream=stream,
    )

    if stream:
        for chunk in response:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end='', flush=True)
        print()
    else:
        print(response.choices[0].message.content)

# Print the full completion at once - useful for offline jobs and applications that do not
# require instant feedback to the user.
generate_chat_completion_with_ollama(
  model_name='hf.co/LiquidAI/LFM2-8B-A1B-GGUF',
  stream=False,
)

# Stream tokens to the console as they are produced - useful for user-facing applications
# that need to provide feedback to the user in real-time.
generate_chat_completion_with_ollama(
  model_name='hf.co/LiquidAI/LFM2-8B-A1B-GGUF',
  stream=True,
)
```
