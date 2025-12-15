import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.css';

// Model definitions with use case and platform support
const models = [
  {
    id: 'LFM2-8B-A1B',
    name: 'LiquidAI/LFM2-8B-A1B',
    description:
      'Mixture of experts with 8B parameters, 1B active per token, comparable to 3-4B dense models and faster than 2B parameter models.',
    size: '8B',
    useCases: ['chat-completions', 'coding', 'function-calling'],
    platforms: [
      'transformers',
      'ollama',
      'llamacpp',
      'mlx',
      'ios',
      'android',
      'vllm',
      'transformersjs',
    ],
  },
  {
    id: 'LFM2-2.6B',
    name: 'LiquidAI/LFM2-2.6B',
    description: 'Mid-size model for balanced performance',
    size: '2.6B',
    useCases: ['chat-completions', 'coding', 'function-calling'],
    platforms: [
      'transformers',
      'ollama',
      'llamacpp',
      'mlx',
      'ios',
      'android',
      'vllm',
      'transformersjs',
    ],
  },
  {
    id: 'LFM2-1.2B',
    name: 'LiquidAI/LFM2-1.2B',
    description: 'Compact model for general use',
    size: '1.2B',
    useCases: ['chat-completions', 'coding', 'function-calling'],
    platforms: [
      'transformers',
      'ollama',
      'llamacpp',
      'mlx',
      'ios',
      'android',
      'vllm',
      'transformersjs',
    ],
  },
  {
    id: 'LFM2-700M',
    name: 'LiquidAI/LFM2-700M',
    description: 'Smaller efficient model',
    size: '700M',
    useCases: ['chat-completions', 'coding', 'function-calling'],
    platforms: [
      'transformers',
      'ollama',
      'llamacpp',
      'mlx',
      'ios',
      'android',
      'vllm',
      'transformersjs',
    ],
  },
  {
    id: 'LFM2-350M',
    name: 'LiquidAI/LFM2-350M',
    description: 'Ultra-lightweight for edge devices',
    size: '350M',
    useCases: ['chat-completions', 'coding', 'function-calling'],
    platforms: [
      'transformers',
      'ollama',
      'llamacpp',
      'mlx',
      'ios',
      'android',
      'vllm',
      'transformersjs',
    ],
  },
  {
    id: 'LFM2-VL-3B',
    name: 'LiquidAI/LFM2-VL-3B',
    description:
      'Lightweight 3B vision-language model with enhanced visual reasoning and fine-grained perception, built on the LFM2 backbone for efficient multimodal understanding at variable resolutions.',
    size: '3B',
    useCases: ['vision'],
    platforms: ['transformers', 'ollama', 'llamacpp', 'ios', 'android', 'transformersjs'],
  },
  {
    id: 'LFM2-VL-1.6B',
    name: 'LiquidAI/LFM2-VL-1.6B',
    description:
      'Compact 1.6B vision-language model balancing strong multimodal capabilities with efficient inference, built on the LFM2 backbone for practical visual understanding at variable resolutions.',
    size: '1.6B',
    useCases: ['vision'],
    platforms: ['transformers', 'ollama', 'llamacpp', 'ios', 'android', 'transformersjs'],
  },
  {
    id: 'LFM2-VL-450M',
    name: 'LiquidAI/LFM2-VL-450M',
    description:
      'Ultra-lightweight 450M vision-language model optimized for resource-constrained deployments, delivering essential multimodal understanding with minimal compute requirements and efficient on-device inference',
    size: '450M',
    useCases: ['vision'],
    platforms: ['transformers', 'ollama', 'llamacpp', 'ios', 'android', 'transformersjs'],
  },
  {
    id: 'LFM2-Audio-1.5B',
    name: 'LiquidAI/LFM2-Audio-1.5B',
    description: 'Audio processing and conversation model for speech and audio understanding tasks',
    size: '1.5B',
    useCases: ['audio'],
    platforms: ['liquid-audio', 'llamacpp'],
  },
  {
    id: 'LFM2-ColBERT-350M',
    name: 'LiquidAI/LFM2-ColBERT-350M',
    description:
      'Late interaction retriever with excellent multilingual performance. It allows you to store documents in one language (for example, a product description in English) and retrieve them in many languages with high accuracy.',
    size: '350M',
    useCases: ['embeddings'],
    platforms: ['transformers', 'transformersjs'],
  },
];

// Use cases definition
const useCases = [
  {
    id: 'chat-completions',
    name: 'Chat Completions',
    description: 'Conversational AI and text generation for chatbots and assistants',
    icon: '💬',
  },
  {
    id: 'vision',
    name: 'Vision Understanding',
    description: 'Analyze images, describe visual content, and answer questions about pictures',
    icon: '👁️',
  },
  {
    id: 'audio',
    name: 'Audio & Transcription',
    description: 'Process audio, transcribe speech, and audio-based conversations',
    icon: '🎵',
  },
  {
    id: 'coding',
    name: 'Code Generation',
    description: 'Generate, debug, and explain code across multiple programming languages',
    icon: '💻',
  },
  {
    id: 'embeddings',
    name: 'Text Embeddings',
    description: 'Generate vector representations of text for search and similarity tasks',
    icon: '🔍',
  },
  {
    id: 'function-calling',
    name: 'Function Calling & Agents',
    description: 'Build agentic workflows with structured outputs and tool integration',
    icon: '🛠️',
  },
];

// Platform definitions
const platforms = [
  {
    id: 'transformers',
    name: 'Laptop with Transformers',
    description: 'Research & prototyping',
    icon: '🤗',
    category: 'laptop',
  },
  {
    id: 'ollama',
    name: 'Laptop with Ollama',
    description: 'Easy local deployment',
    icon: '🦙',
    category: 'laptop',
  },
  {
    id: 'llamacpp',
    name: 'Laptop with llama.cpp',
    description: 'High-performance C++',
    icon: '⚡',
    category: 'laptop',
  },
  {
    id: 'mlx',
    name: 'Macbook with MLX',
    description: 'Apple Silicon optimized',
    icon: '🍎',
    category: 'laptop',
  },
  {
    id: 'ios',
    name: 'iOS with LEAP SDK',
    description: 'Swift & Objective-C',
    icon: '📱',
    category: 'mobile',
  },
  {
    id: 'android',
    name: 'Android with LEAP SDK',
    description: 'Java & Kotlin',
    icon: '🤖',
    category: 'mobile',
  },
  {
    id: 'vllm',
    name: 'Cloud with vLLM',
    description: 'High-throughput serving',
    icon: '☁️',
    category: 'cloud',
  },
  {
    id: 'transformersjs',
    name: 'Browser with Transformers.js',
    description: 'JavaScript & WebAssembly',
    icon: '🌐',
    category: 'browser',
  },
  {
    id: 'liquid-audio',
    name: 'liquid-audio library',
    description: 'Audio processing library',
    icon: '🎵',
    category: 'library',
  },
];

// Tutorial templates with structured steps
const tutorialTemplates = {
  'LFM2-8B-A1B': {
    transformers: {
      title: 'LiquidAI/LFM2-8B-A1B with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description: '',
          code: `pip install git+https://github.com/huggingface/transformers.git@0c9a72e4576fe4c84077f066e585129c97bfd4e6 bitsandbytes`,
          language: 'shell',
        },
        {
          title: 'Run inference',
          description: '',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-8B-A1B"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    dtype="bfloat16",
    load_in_8bit=True,
#    attn_implementation="flash_attention_2" <- uncomment on compatible GPU
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate answer
prompt = "What is C. elegans?"
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

output = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_new_tokens=512,
)

print(tokenizer.decode(output[0], skip_special_tokens=False))

# <|startoftext|><|im_start|>user
# What is C. elegans?<|im_end|>
# <|im_start|>assistant
# C. elegans, also known as Caenorhabditis elegans, is a small, free-living
# nematode worm (roundworm) that belongs to the phylum Nematoda.`,
          language: 'python',
        },
      ],
      tips: [
        'Use `device_map="auto"` for automatic GPU/CPU selection',
        'Uncomment `attn_implementation="flash_attention_2"` on compatible GPUs for faster inference',
        'Adjust temperature and min_p parameters to control generation creativity',
        "Try different prompts to explore the model's capabilities",
      ],
    },
    ollama: {
      title: 'LiquidAI/LFM2-8B-A1B with Ollama',
      description:
        'Perfect for fast local development using an OpenAI API compatible server. Ollama is not intended for production-ready deployments.',
      steps: [
        {
          title: 'Install Ollama',
          description:
            'Go to ollama.com/download and follow the installation instructions for your operating system. MacOS, Linux and Windows are supported.',
          code: `# Download from https://ollama.com/download`,
          language: 'shell',
        },
        {
          title: 'Pull the model checkpoint from Hugging Face and start the server',
          description:
            'After running this command for the first time, the model weights will be cached in your local drive.',
          code: `ollama pull hf.co/LiquidAI/LFM2-8B-A1B-GGUF`,
          language: 'shell',
        },
        {
          title: 'Request chat completions',
          description: 'Install the OpenAI Python SDK and generate chat completion with the model.',
          code: `pip install openai`,
          language: 'shell',
        },
        {
          title: 'Generate chat completion',
          description: 'Use the OpenAI client to interact with your local Ollama server.',
          code: `def generate_chat_completion_with_ollama(
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

# Print the full completion at once
generate_chat_completion_with_ollama(stream=False)

# Stream tokens as they are produced
generate_chat_completion_with_ollama(stream=True)`,
          language: 'python',
        },
      ],
      tips: [
        'Model weights are cached locally after first download',
        'Use "ollama list" to check cached models',
        'Supports both streaming and non-streaming responses',
        'Compatible with OpenAI SDK for easy integration',
      ],
    },
  },

  'LFM2-2.6B': {
    transformers: {
      title: 'LiquidAI/LFM2-2.6B with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description: '',
          code: `pip install transformers
# if you are using uv do
# uv pip install transformers`,
          language: 'shell',
        },
        {
          title: 'Run inference',
          description: '',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-2.6B"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="bfloat16",
#    attn_implementation="flash_attention_2" <- uncomment on compatible GPU
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate answer
prompt = "What is C. elegans?"
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

output = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_new_tokens=512,
)

print(tokenizer.decode(output[0], skip_special_tokens=False))

# <|startoftext|><|im_start|>user
# What is C. elegans?<|im_end|>
# <|im_start|>assistant
# C. elegans, also known as Caenorhabditis elegans, is a small, free-living
# nematode worm (roundworm) that belongs to the phylum Nematoda.`,
          language: 'python',
        },
      ],
      tips: [
        'Use `device_map="auto"` for automatic GPU/CPU selection',
        'Uncomment `attn_implementation="flash_attention_2"` on compatible GPUs for faster inference',
        'Adjust temperature and min_p parameters to control generation creativity',
        "Try different prompts to explore the model's capabilities",
      ],
    },
    ollama: {
      title: 'LiquidAI/LFM2-2.6B with Ollama',
      description:
        'Perfect for fast local development using an OpenAI API compatible server. Ollama is not intended for production-ready deployments.',
      steps: [
        {
          title: 'Install Ollama',
          description:
            'Go to ollama.com/download and follow the installation instructions for your operating system. MacOS, Linux and Windows are supported.',
          code: `# Download from https://ollama.com/download`,
          language: 'shell',
        },
        {
          title: 'Pull the model checkpoint from Hugging Face and start the server',
          description:
            'After running this command for the first time, the model weights will be cached in your local drive.',
          code: `ollama pull hf.co/LiquidAI/LFM2-2.6B-GGUF`,
          language: 'shell',
        },
        {
          title: 'Request chat completions',
          description: 'Install the OpenAI Python SDK',
          code: `pip install openai`,
          language: 'shell',
        },
        {
          title: 'Generate chat completion with streaming support',
          description:
            'Generate chat completion with the model, either streaming or non-streaming the response.',
          code: `def generate_chat_completion_with_ollama(
    model_name: str = 'hf.co/LiquidAI/LFM2-2.6B-GGUF',
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
  model_name='hf.co/LiquidAI/LFM2-2.6B-GGUF',
  stream=False,
)

# Stream tokens to the console as they are produced - useful for user-facing applications
# that need to provide feedback to the user in real-time.
generate_chat_completion_with_ollama(
  model_name='hf.co/LiquidAI/LFM2-2.6B-GGUF',
  stream=True,
)`,
          language: 'python',
        },
      ],
      tips: [
        'Model weights are cached locally after first download',
        'Use "ollama list" to check cached models',
        'Supports both streaming and non-streaming responses',
        'Compatible with OpenAI SDK for programmatic usage',
      ],
    },
  },

  'LFM2-1.2B': {
    transformers: {
      title: 'LiquidAI/LFM2-1.2B with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description: '',
          code: `pip install transformers
# if you are using uv do
# uv pip install transformers`,
          language: 'shell',
        },
        {
          title: 'Run inference',
          description: '',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-1.2B"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="bfloat16",
#    attn_implementation="flash_attention_2" <- uncomment on compatible GPU
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate answer
prompt = "What is C. elegans?"
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

output = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_new_tokens=512,
)

print(tokenizer.decode(output[0], skip_special_tokens=False))

# <|startoftext|><|im_start|>user
# What is C. elegans?<|im_end|>
# <|im_start|>assistant
# C. elegans, also known as Caenorhabditis elegans, is a small, free-living
# nematode worm (roundworm) that belongs to the phylum Nematoda.`,
          language: 'python',
        },
      ],
      tips: [
        'Use `device_map="auto"` for automatic GPU/CPU selection',
        'Uncomment `attn_implementation="flash_attention_2"` on compatible GPUs for faster inference',
        'Adjust temperature and min_p parameters to control generation creativity',
        "Try different prompts to explore the model's capabilities",
      ],
    },
  },

  'LFM2-700M': {
    transformers: {
      title: 'LiquidAI/LFM2-700M with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description: '',
          code: `pip install transformers
# if you are using uv do
# uv pip install transformers`,
          language: 'shell',
        },
        {
          title: 'Run inference',
          description: '',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-700M"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="bfloat16",
#    attn_implementation="flash_attention_2" <- uncomment on compatible GPU
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate answer
prompt = "What is C. elegans?"
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

output = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_new_tokens=512,
)

print(tokenizer.decode(output[0], skip_special_tokens=False))

# <|startoftext|><|im_start|>user
# What is C. elegans?<|im_end|>
# <|im_start|>assistant
# C. elegans, also known as Caenorhabditis elegans, is a small, free-living
# nematode worm (roundworm) that belongs to the phylum Nematoda.`,
          language: 'python',
        },
      ],
      tips: [
        'Use `device_map="auto"` for automatic GPU/CPU selection',
        'Uncomment `attn_implementation="flash_attention_2"` on compatible GPUs for faster inference',
        'Adjust temperature and min_p parameters to control generation creativity',
        "Try different prompts to explore the model's capabilities",
      ],
    },
  },

  'LFM2-350M': {
    transformers: {
      title: 'LiquidAI/LFM2-350M with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description: '',
          code: `pip install transformers
# if you are using uv do
# uv pip install transformers`,
          language: 'shell',
        },
        {
          title: 'Run inference',
          description: '',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-350M"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="bfloat16",
#    attn_implementation="flash_attention_2" <- uncomment on compatible GPU
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate answer
prompt = "What is C. elegans?"
input_ids = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True,
    return_tensors="pt",
    tokenize=True,
).to(model.device)

output = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.3,
    min_p=0.15,
    repetition_penalty=1.05,
    max_new_tokens=512,
)

print(tokenizer.decode(output[0], skip_special_tokens=False))

# <|startoftext|><|im_start|>user
# What is C. elegans?<|im_end|>
# <|im_start|>assistant
# C. elegans, also known as Caenorhabditis elegans, is a small, free-living
# nematode worm (roundworm) that belongs to the phylum Nematoda.`,
          language: 'python',
        },
      ],
      tips: [
        'Use `device_map="auto"` for automatic GPU/CPU selection',
        'Uncomment `attn_implementation="flash_attention_2"` on compatible GPUs for faster inference',
        'Adjust temperature and min_p parameters to control generation creativity',
        "Try different prompts to explore the model's capabilities",
      ],
    },
  },
};

// Modality definitions
const modalityIcons = {
  text: '📝',
  vision: '👁️',
  audio: '🎵',
};

interface UseCaseCardProps {
  useCase: (typeof useCases)[0];
  isSelected: boolean;
  onClick: () => void;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, isSelected, onClick }) => (
  <div className={`${styles.useCaseCard} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
    <div className={styles.useCaseIcon}>{useCase.icon}</div>
    <div className={styles.useCaseInfo}>
      <h3>{useCase.name}</h3>
      <p className={styles.useCaseDescription}>{useCase.description}</p>
    </div>
  </div>
);

interface ModalityIconsProps {
  supportedModalities: string[];
}

const ModalityIcons: React.FC<ModalityIconsProps> = ({ supportedModalities }) => (
  <div className={styles.modalityIcons}>
    {Object.entries(modalityIcons).map(([modality, icon]) => (
      <span
        key={modality}
        className={`${styles.modalityIcon} ${
          supportedModalities.includes(modality) ? styles.modalityActive : styles.modalityInactive
        }`}
        title={modality}
      >
        {icon}
      </span>
    ))}
  </div>
);

interface ModelCardProps {
  model: (typeof models)[0];
  isSelected: boolean;
  onClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, onClick }) => (
  <div className={`${styles.modelCard} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
    <div className={styles.modelInfo}>
      <h3>{model.name}</h3>
      <p className={styles.modelDescription}>{model.description}</p>
    </div>
  </div>
);

interface PlatformCardProps {
  platform: (typeof platforms)[0];
  isSelected: boolean;
  onClick: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, isSelected, onClick }) => (
  <div className={`${styles.platformCard} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
    <div className={styles.platformIcon}>{platform.icon}</div>
    <h4>{platform.name}</h4>
    <p>{platform.description}</p>
  </div>
);

const InteractiveQuickstart: React.FC = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<(typeof useCases)[0] | null>(null);
  const [selectedModel, setSelectedModel] = useState<(typeof models)[0] | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<(typeof platforms)[0] | null>(null);

  // URL parameter handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const useCaseParam = urlParams.get('useCase');
    const modelParam = urlParams.get('model');
    const platformParam = urlParams.get('platform');

    // Set use case from URL
    if (useCaseParam) {
      const useCase = useCases.find((uc) => uc.id === useCaseParam);
      if (useCase) {
        setSelectedUseCase(useCase);
      }
    }

    // Set model from URL
    if (modelParam) {
      const model = models.find((m) => m.id === modelParam);
      if (model) {
        setSelectedModel(model);
      }
    }

    // Set platform from URL
    if (platformParam) {
      const platform = platforms.find((p) => p.id === platformParam);
      if (platform) {
        setSelectedPlatform(platform);
      }
    }
  }, []);

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedUseCase) {
      params.set('useCase', selectedUseCase.id);
    }
    if (selectedModel) {
      params.set('model', selectedModel.id);
    }
    if (selectedPlatform) {
      params.set('platform', selectedPlatform.id);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedUseCase, selectedModel, selectedPlatform]);

  const reset = () => {
    setSelectedUseCase(null);
    setSelectedModel(null);
    setSelectedPlatform(null);
  };

  const goBackToUseCases = () => {
    setSelectedUseCase(null);
    setSelectedModel(null);
    setSelectedPlatform(null);
  };

  const goBackToModels = () => {
    setSelectedModel(null);
  };

  const goBackToPlatforms = () => {
    setSelectedPlatform(null);
  };

  const handleUseCaseSelection = (useCase: (typeof useCases)[0]) => {
    setSelectedUseCase(useCase);
  };

  const getAvailablePlatforms = (useCase: (typeof useCases)[0]) => {
    // Define platform availability by use case based on documentation
    const useCasePlatformMap = {
      'chat-completions': [
        'transformers',
        'ollama',
        'llamacpp',
        'mlx',
        'ios',
        'android',
        'vllm',
        'transformersjs',
      ],
      coding: [
        'transformers',
        'ollama',
        'llamacpp',
        'mlx',
        'ios',
        'android',
        'vllm',
        'transformersjs',
      ],
      'function-calling': [
        'transformers',
        'ollama',
        'llamacpp',
        'mlx',
        'ios',
        'android',
        'vllm',
        'transformersjs',
      ],
      vision: ['transformers', 'ollama', 'llamacpp', 'ios', 'android', 'transformersjs'],
      audio: ['liquid-audio', 'llamacpp'], // Updated based on documentation
      embeddings: ['transformers', 'transformersjs'],
    };

    const availablePlatformIds = useCasePlatformMap[useCase.id] || [];
    return platforms.filter((platform) => availablePlatformIds.includes(platform.id));
  };

  const getTutorial = () => {
    if (!selectedModel || !selectedPlatform) return null;
    return (
      tutorialTemplates[selectedModel.id]?.[selectedPlatform.id] || {
        title: `${selectedModel.name} on ${selectedPlatform.name}`,
        description: 'Tutorial coming soon!',
        steps: [],
        tips: [],
      }
    );
  };

  const getHeaderContent = () => {
    if (!selectedUseCase) {
      return {
        title: 'Step 1. Choose your use case',
        subtitle: 'Get personalized code snippets for your specific model and deployment platform.',
        icon: '🚀',
      };
    } else if (!selectedPlatform) {
      return {
        title: 'Step 2. Choose your deployment platform',
        subtitle: `Deploy your ${selectedUseCase.name.toLowerCase()} solution on your preferred deployment platform`,
        icon: '🚀',
      };
    } else if (!selectedModel) {
      return {
        title: 'Step 3. Choose model size',
        subtitle: `Each model represent a different trade-off between quality and speed/memory consumption`,
        icon: '🚀',
      };
    } else {
      return {
        title: '',
        subtitle: '',
        icon: '📚',
      };
    }
  };

  const headerContent = getHeaderContent();

  if (!selectedUseCase) {
    return (
      <div className={styles.quickstartContainer}>
        <div className={styles.header}>
          <h2>
            {headerContent.icon} {headerContent.title}
          </h2>
          <p>{headerContent.subtitle}</p>
        </div>

        <div className={styles.useCasesContainer}>
          {useCases.map((useCase) => (
            <UseCaseCard
              key={useCase.id}
              useCase={useCase}
              isSelected={false}
              onClick={() => handleUseCaseSelection(useCase)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedPlatform) {
    return (
      <div className={styles.quickstartContainer}>
        <div className={styles.header}>
          <h2>
            {headerContent.icon} {headerContent.title}
          </h2>
          <div className={styles.breadcrumb}>
            <span className={styles.selectedItem}>
              {selectedUseCase.icon} {selectedUseCase.name}
            </span>
            <button className={styles.changeButton} onClick={goBackToUseCases}>
              Change use case
            </button>
          </div>
          <p>{headerContent.subtitle}</p>
        </div>

        <div className={styles.platformsGrid}>
          {getAvailablePlatforms(selectedUseCase).map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              isSelected={false}
              onClick={() => setSelectedPlatform(platform)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedModel) {
    return (
      <div className={styles.quickstartContainer}>
        <div className={styles.header}>
          <h2>
            {headerContent.icon} {headerContent.title}
          </h2>
          <div className={styles.breadcrumb}>
            <span className={styles.selectedItem}>
              {selectedUseCase.icon} {selectedUseCase.name}
            </span>
            <span className={styles.separator}>→</span>
            <span className={styles.selectedItem}>
              {selectedPlatform.icon} {selectedPlatform.name}
            </span>
            <div className={styles.buttonGroup}>
              <button className={styles.changeButton} onClick={goBackToUseCases}>
                Change use case
              </button>
              <button className={styles.changeButton} onClick={goBackToPlatforms}>
                Change deployment platform
              </button>
            </div>
          </div>
          <p>{headerContent.subtitle}</p>
        </div>

        <div className={styles.modelsContainer}>
          {models
            .filter((model) => {
              // Filter models based on use case and platform support
              const supportsUseCase = model.useCases.includes(selectedUseCase.id);
              const supportsPlatform = model.platforms.includes(selectedPlatform.id);
              return supportsUseCase && supportsPlatform;
            })
            .map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={false}
                onClick={() => setSelectedModel(model)}
              />
            ))}
        </div>
      </div>
    );
  }

  const tutorial = getTutorial();
  if (!tutorial) return null;

  return (
    <div className={styles.quickstartContainer}>
      <div className={styles.header}>
        <h2>
          {headerContent.icon} {headerContent.title}
        </h2>
        <div className={styles.breadcrumb}>
          <span className={styles.selectedItem}>
            {selectedUseCase.icon} {selectedUseCase.name}
          </span>
          <span className={styles.separator}>→</span>
          <span className={styles.selectedItem}>
            {selectedPlatform.icon} {selectedPlatform.name}
          </span>
          <span className={styles.separator}>→</span>
          <span className={styles.selectedItem}>{selectedModel.name}</span>
          <div className={styles.buttonGroup}>
            <button className={styles.changeButton} onClick={goBackToUseCases}>
              Change use case
            </button>
            <button className={styles.changeButton} onClick={goBackToPlatforms}>
              Change deployment platform
            </button>
            <button className={styles.changeButton} onClick={goBackToModels}>
              Change model
            </button>
          </div>
        </div>
        <p>{headerContent.subtitle}</p>
      </div>

      <div className={styles.tutorialContainer}>
        <div className={styles.tutorialHeader}>
          <h1>{tutorial.title}</h1>
          {tutorial.description && !tutorial.description.includes('coming soon') && (
            <p className={styles.tutorialDescription}>{tutorial.description}</p>
          )}
          <div className={styles.colabButtonContainer}>
            <a
              target="_blank"
              href="https://colab.research.google.com/drive/1_q3jQ6LtyiuPzFZv7Vw8xSfPU5FwkKZY?usp=sharing"
              rel="noopener noreferrer"
            >
              <img
                src="https://colab.research.google.com/assets/colab-badge.svg"
                alt="Open In Colab"
              />
            </a>
          </div>
        </div>

        <div className={styles.stepsContainer}>
          {tutorial.steps.map((step, index) => (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <CodeBlock language={step.language} title={step.language}>
                {step.code}
              </CodeBlock>
            </div>
          ))}
        </div>

        <div className={styles.nextStepsContainer}>
          <h2>Next steps</h2>
          <div className={styles.nextStepsGrid}>
            <a href="/lfm/fine-tuning/trl" className={styles.nextStepCard}>
              <h3>🎯 Fine-tuning guides</h3>
              <p>
                Learn how to fine-tune LFM2 models on your specific datasets for optimal
                performance.
              </p>
            </a>
            <a href="/examples" className={styles.nextStepCard}>
              <h3>📚 Examples</h3>
              <p>Explore practical examples and use cases to get inspired for your next project.</p>
            </a>
            <a
              href="https://discord.gg/DFU3WQeaYD"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.nextStepCard}
            >
              <h3>💬 Community</h3>
              <p>Join our Discord community to ask questions and share your implementations.</p>
            </a>
          </div>
        </div>
      </div>

      <button className={styles.resetButton} onClick={reset}>
        ↻ Start over
      </button>
    </div>
  );
};

export default InteractiveQuickstart;
