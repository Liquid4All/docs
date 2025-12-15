def generate_chat_completion_with_ollama(
    model_name: str = 'hf.co/LiquidAI/LFM2-2.6B-GGUF',
    stream: bool = False,
):
    print("Hello from runnable-examples!")

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



if __name__ == "__main__":
    generate_chat_completion_with_ollama(
        model_name='hf.co/LiquidAI/LFM2-2.6B-GGUF',
        stream=False,
    )

    generate_chat_completion_with_ollama(
        model_name='hf.co/LiquidAI/LFM2-2.6B-GGUF',
        stream=True,
    )

