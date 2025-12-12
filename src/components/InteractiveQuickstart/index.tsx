import CodeBlock from '@theme/CodeBlock';
import React, { useState } from 'react';

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
      title: 'LFM2-8B-A1B with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description:
            'Install the latest version of transformers with the specific commit that supports LFM2 models.',
          code: `pip install git+https://github.com/huggingface/transformers.git@0c9a72e4576fe4c84077f066e585129c97bfd4e6 bitsandbytes`,
          language: 'bash',
        },
        {
          title: 'Run inference',
          description: 'Use the pipeline interface for quick and easy text generation.',
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
  },

  'LFM2-1.2B': {
    transformers: {
      title: 'LFM2-1.2B with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Python dependencies',
          description:
            'Install the latest version of transformers with the specific commit that supports LFM2 models.',
          code: `pip install git+https://github.com/huggingface/transformers.git@0c9a72e4576fe4c84077f066e585129c97bfd4e6`,
          language: 'bash',
        },
        {
          title: 'Run inference with the pipeline() interface',
          description: 'Use the pipeline interface for quick and easy text generation.',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "LiquidAI/LFM2-1.2B"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    dtype="bfloat16",
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

print(tokenizer.decode(output[0], skip_special_tokens=False))`,
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
      title: 'LFM2-1.2B with Ollama',
      description: 'Easy local deployment with OpenAI-compatible API for seamless integration.',
      steps: [
        {
          title: 'Install Ollama',
          description: 'Download and install Ollama for your operating system.',
          code: `curl -fsSL https://ollama.ai/install.sh | sh`,
          language: 'bash',
        },
        {
          title: 'Pull and Run Model',
          description: 'Download and start the LFM2 model locally.',
          code: `ollama run hf.co/LiquidAI/LFM2-1.2B-GGUF`,
          language: 'bash',
        },
        {
          title: 'Connect via OpenAI API',
          description: 'Use the familiar OpenAI client to interact with your local model.',
          code: `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # required but unused
)

response = client.chat.completions.create(
    model="hf.co/LiquidAI/LFM2-1.2B-GGUF",
    messages=[{"role": "user", "content": "What is machine learning?"}]
)
print(response.choices[0].message.content)`,
          language: 'python',
        },
      ],
      tips: [
        'Ollama runs as a local server on port 11434',
        'Compatible with any OpenAI SDK or library',
        'Models are cached locally for faster subsequent loads',
      ],
    },

    vllm: {
      title: 'LFM2-1.2B with vLLM',
      description: 'High-throughput serving for production deployments and GPU clusters.',
      steps: [
        {
          title: 'Install vLLM',
          description: 'Install vLLM for optimized inference serving.',
          code: `pip install vllm`,
          language: 'bash',
        },
        {
          title: 'Direct Inference',
          description: 'Use vLLM directly for batch inference with optimized performance.',
          code: `from vllm import LLM, SamplingParams

# Initialize model
llm = LLM(model="LiquidAI/LFM2-1.2B")

# Generate responses
prompts = ["What is machine learning?"]
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(output.outputs[0].text)`,
          language: 'python',
        },
        {
          title: 'OpenAI-Compatible Server',
          description: "Start a server that's compatible with OpenAI API for easy integration.",
          code: `python -m vllm.entrypoints.openai.api_server \\
    --model LiquidAI/LFM2-1.2B \\
    --host 0.0.0.0 \\
    --port 8000`,
          language: 'bash',
        },
      ],
      tips: [
        'vLLM automatically optimizes for your hardware',
        'Supports continuous batching for higher throughput',
        'Great for serving multiple concurrent requests',
      ],
    },
  },

  'LFM2-VL-1.6B': {
    transformers: {
      title: 'LFM2-VL-1.6B Vision Model',
      description:
        'Multimodal model that can process both text and images for comprehensive understanding.',
      steps: [
        {
          title: 'Install Dependencies',
          description: 'Install the required packages including image processing libraries.',
          code: `pip install transformers torch pillow`,
          language: 'bash',
        },
        {
          title: 'Load Model and Processor',
          description: 'Load both the model and processor for handling multimodal inputs.',
          code: `from transformers import AutoProcessor, AutoModelForImageTextToText
from transformers.image_utils import load_image

# Load model and processor
model = AutoModelForImageTextToText.from_pretrained(
    "LiquidAI/LFM2-VL-1.6B",
    device_map="auto",
    dtype="bfloat16"
)
processor = AutoProcessor.from_pretrained("LiquidAI/LFM2-VL-1.6B")`,
          language: 'python',
        },
        {
          title: 'Process Image and Text',
          description: 'Create a conversation with both image and text inputs.',
          code: `# Load image and create conversation
url = "https://www.ilankelman.org/stopsigns/australia.jpg"
image = load_image(url)
conversation = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": image},
            {"type": "text", "text": "What is in this image?"},
        ],
    },
]

# Generate response
inputs = processor.apply_chat_template(
    conversation,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
    tokenize=True,
).to(model.device)
outputs = model.generate(**inputs, max_new_tokens=64)
response = processor.batch_decode(outputs, skip_special_tokens=True)[0]
print(response)`,
          language: 'python',
        },
      ],
      tips: [
        'Supports various image formats (JPEG, PNG, WebP)',
        'Can handle multiple images in one conversation',
        'Use bfloat16 for better performance on modern GPUs',
      ],
    },
  },
};

// Function to create Transformers tutorial for any LFM2 model
const createTransformersTutorial = (model) => {
  const installCommand =
    model.id === 'LFM2-8B-A1B'
      ? `pip install git+https://github.com/huggingface/transformers.git@0c9a72e4576fe4c84077f066e585129c97bfd4e6 bitsandbytes`
      : `pip install git+https://github.com/huggingface/transformers.git@0c9a72e4576fe4c84077f066e585129c97bfd4e6`;

  const modelConfig = model.id === 'LFM2-8B-A1B' ? `    load_in_8bit=True,` : '';

  return {
    title: `${model.name} with Transformers`,
    description: `Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.`,
    steps: [
      {
        title: 'Install Python dependencies',
        description:
          'Install the latest version of transformers with the specific commit that supports LFM2 models.',
        code: installCommand,
        language: 'bash',
      },
      {
        title: 'Run inference with the pipeline() interface',
        description: 'Use the pipeline interface for quick and easy text generation.',
        code: `from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "${model.name}"
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    dtype="bfloat16",${modelConfig}
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

print(tokenizer.decode(output[0], skip_special_tokens=False))`,
        language: 'python',
      },
    ],
    tips: [
      'Use `device_map="auto"` for automatic GPU/CPU selection',
      'Uncomment `attn_implementation="flash_attention_2"` on compatible GPUs for faster inference',
      'Adjust temperature and min_p parameters to control generation creativity',
      "Try different prompts to explore the model's capabilities",
    ],
  };
};

// Generate placeholder tutorials for missing combinations
models.forEach((model) => {
  if (!tutorialTemplates[model.id]) {
    tutorialTemplates[model.id] = {};
  }

  platforms.forEach((platform) => {
    if (!tutorialTemplates[model.id][platform.id]) {
      // Use the standard Transformers template for LFM2 models with Transformers platform
      if (platform.id === 'transformers' && model.name.includes('LFM2')) {
        tutorialTemplates[model.id][platform.id] = createTransformersTutorial(model);
      } else {
        tutorialTemplates[model.id][platform.id] = {
          title: `${model.name} on ${platform.name}`,
          description: `Tutorial for ${model.name} deployment using ${platform.name} - coming soon!`,
          steps: [
            {
              title: 'Setup',
              description: `Instructions for setting up ${model.name} with ${platform.name}.`,
              code: `# Setup instructions for ${model.name} with ${platform.name} coming soon!`,
              language: 'bash',
            },
          ],
          tips: [`${platform.name} integration with ${model.name} is being developed`],
        };
      }
    }
  });
});

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
      <div className={styles.modelLinks}>
        <a
          href={`https://huggingface.co/${model.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.modelLink}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={styles.hfIcon}>🤗</span>
          Model weights
        </a>
        <a
          href={`https://huggingface.co/${model.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.modelLink}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={styles.docIcon}>📄</span>
          Model card
        </a>
      </div>
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
        // icon: '🚀',
      };
    } else if (!selectedPlatform) {
      return {
        title: 'Step 2. Choose your deployment platform',
        subtitle: `Deploy your ${selectedUseCase.name.toLowerCase()} solution on your preferred deployment platform`,
        // icon: '🚀',
      };
    } else if (!selectedModel) {
      return {
        title: 'Step 3. Choose model size',
        subtitle: `Select the best LFM model for your ${selectedUseCase.name.toLowerCase()} use case`,
        // icon: '🚀',
      };
    } else {
      return {
        title: '',
        subtitle: '',
        // icon: '📚',
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
            <div className={styles.nextStepCard}>
              <h3>🚀 Advanced Usage</h3>
              <p>Learn about fine-tuning, custom parameters, and advanced configuration options.</p>
            </div>
            <div className={styles.nextStepCard}>
              <h3>🔧 Deployment</h3>
              <p>Deploy your model to production with optimized settings and scaling strategies.</p>
            </div>
            <div className={styles.nextStepCard}>
              <h3>📚 API Reference</h3>
              <p>Explore the complete API documentation and available model parameters.</p>
            </div>
            <div className={styles.nextStepCard}>
              <h3>💬 Community</h3>
              <p>Join our Discord community to ask questions and share your implementations.</p>
            </div>
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
