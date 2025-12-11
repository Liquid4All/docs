import React, { useState } from 'react';

import styles from './styles.module.css';

// Model definitions grouped by category
const modelCategories = {
  'Text-Only Models': [
    {
      id: 'LFM2-8B',
      name: 'LFM2-8B',
      description: 'Large model for complex tasks',
      size: '8B',
      type: 'text',
      icon: '🔥',
      huggingfaceId: 'LiquidAI/LFM2-8B',
    },
    {
      id: 'LFM2-1.2B',
      name: 'LFM2-1.2B',
      description: 'Compact model for general use',
      size: '1.2B',
      type: 'text',
      icon: '💬',
      huggingfaceId: 'LiquidAI/LFM2-1.2B',
    },
    {
      id: 'LFM2-350M',
      name: 'LFM2-350M',
      description: 'Ultra-lightweight for edge devices',
      size: '350M',
      type: 'text',
      icon: '🎯',
      huggingfaceId: 'LiquidAI/LFM2-350M',
    },
  ],
  'Text + Vision Models': [
    {
      id: 'LFM2-VL-1.6B',
      name: 'LFM2-VL-1.6B',
      description: 'Vision-language multimodal model',
      size: '1.6B',
      type: 'vision',
      icon: '👁️',
      huggingfaceId: 'LiquidAI/LFM2-VL-1.6B',
    },
  ],
  'Audio Models': [
    {
      id: 'LFM2-Audio-Chat',
      name: 'LFM2-Audio-Chat',
      description: 'Audio processing and conversation',
      size: '1.2B',
      type: 'audio',
      icon: '🎵',
      huggingfaceId: 'LiquidAI/LFM2-Audio-Chat',
    },
  ],
};

// Flatten models for easier access
const models = Object.values(modelCategories).flat();

// Platform definitions
const platforms = [
  {
    id: 'transformers',
    name: 'Transformers',
    description: 'Research & prototyping',
    icon: '🤗',
    category: 'laptop',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Easy local deployment',
    icon: '🔧',
    category: 'laptop',
  },
  {
    id: 'llamacpp',
    name: 'llama.cpp',
    description: 'High-performance C++',
    icon: '🦙',
    category: 'laptop',
  },
  {
    id: 'mlx',
    name: 'MLX',
    description: 'Apple Silicon optimized',
    icon: '⚡',
    category: 'laptop',
  },
  {
    id: 'ios',
    name: 'iOS',
    description: 'Swift & Objective-C',
    icon: '🍎',
    category: 'mobile',
  },
  {
    id: 'android',
    name: 'Android',
    description: 'Java & Kotlin',
    icon: '🤖',
    category: 'mobile',
  },
  {
    id: 'vllm',
    name: 'vLLM',
    description: 'High-throughput serving',
    icon: '⚡',
    category: 'cloud',
  },
  {
    id: 'transformersjs',
    name: 'Transformers.js',
    description: 'JavaScript & WebAssembly',
    icon: '🌐',
    category: 'browser',
  },
];

// Tutorial templates with structured steps
const tutorialTemplates = {
  'LFM2-1.2B': {
    transformers: {
      title: 'LFM2-1.2B with Transformers',
      description:
        'Perfect for research, prototyping, and quick experimentation in Jupyter notebooks.',
      steps: [
        {
          title: 'Install Dependencies',
          description:
            'First, install the required packages. We recommend using a virtual environment.',
          code: `pip install transformers torch`,
          language: 'bash',
        },
        {
          title: 'Load the Model',
          description: 'Use the pipeline interface for quick and easy text generation.',
          code: `from transformers import pipeline

# Load the model
generator = pipeline("text-generation", "LiquidAI/LFM2-1.2B", device_map="auto")`,
          language: 'python',
        },
        {
          title: 'Generate Text',
          description: 'Create a conversation and generate responses from the model.',
          code: `# Generate text
messages = [{"role": "user", "content": "What is machine learning?"}]
response = generator(messages, max_new_tokens=256)
print(response[0]["generated_text"][-1]["content"])`,
          language: 'python',
        },
      ],
      tips: [
        'Use `device_map="auto"` for automatic GPU/CPU selection',
        'Adjust `max_new_tokens` to control response length',
        'Try different temperature values for varied creativity',
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

// Generate placeholder tutorials for missing combinations
models.forEach((model) => {
  if (!tutorialTemplates[model.id]) {
    tutorialTemplates[model.id] = {};
  }

  platforms.forEach((platform) => {
    if (!tutorialTemplates[model.id][platform.id]) {
      tutorialTemplates[model.id][platform.id] = {
        title: `${model.name} with ${platform.name}`,
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
  });
});

interface ModelCardProps {
  model: (typeof models)[0];
  isSelected: boolean;
  onClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, onClick }) => (
  <div className={`${styles.modelCard} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
    <div className={styles.modelIcon}>{model.icon}</div>
    <h3>{model.name}</h3>
    <p className={styles.modelSize}>{model.size}</p>
    <p className={styles.modelDescription}>{model.description}</p>
    {model.type === 'vision' && <span className={styles.visionBadge}>Vision</span>}
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
  const [selectedModel, setSelectedModel] = useState<(typeof models)[0] | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<(typeof platforms)[0] | null>(null);

  const reset = () => {
    setSelectedModel(null);
    setSelectedPlatform(null);
  };

  const goBackToModels = () => {
    setSelectedModel(null);
    setSelectedPlatform(null);
  };

  const goBackToPlatforms = () => {
    setSelectedPlatform(null);
  };

  const getTutorial = () => {
    if (!selectedModel || !selectedPlatform) return null;
    return (
      tutorialTemplates[selectedModel.id]?.[selectedPlatform.id] || {
        title: `${selectedModel.name} with ${selectedPlatform.name}`,
        description: 'Tutorial coming soon!',
        steps: [],
        tips: [],
      }
    );
  };

  const getHeaderContent = () => {
    if (!selectedModel) {
      return {
        title: 'Choose your model',
        subtitle: 'Select an LFM model to get started',
        icon: '🚀',
      };
    } else if (!selectedPlatform) {
      return {
        title: 'Choose your platform',
        subtitle: `Deploy ${selectedModel.name} on your preferred platform`,
        icon: '🚀',
      };
    } else {
      return {
        title: 'Your tutorial is ready!',
        subtitle: `Step-by-step guide for ${selectedModel.name} on ${selectedPlatform.name}`,
        icon: '📚',
      };
    }
  };

  const headerContent = getHeaderContent();

  if (!selectedModel) {
    return (
      <div className={styles.quickstartContainer}>
        <div className={styles.header}>
          <h2>
            {headerContent.icon} {headerContent.title}
          </h2>
          <p>{headerContent.subtitle}</p>
        </div>

        <div className={styles.modelCategoriesContainer}>
          {Object.entries(modelCategories).map(([categoryName, categoryModels]) => (
            <div key={categoryName} className={styles.modelCategory}>
              <h3 className={styles.categoryTitle}>{categoryName}</h3>
              <div className={styles.categoryModelsGrid}>
                {categoryModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={false}
                    onClick={() => setSelectedModel(model)}
                  />
                ))}
              </div>
            </div>
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
              {selectedModel.icon} {selectedModel.name}
            </span>
            <button className={styles.changeButton} onClick={goBackToModels}>
              Change model
            </button>
          </div>
          <p>{headerContent.subtitle}</p>
        </div>

        <div className={styles.platformsGrid}>
          {platforms.map((platform) => (
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
            {selectedModel.icon} {selectedModel.name}
          </span>
          <span className={styles.separator}>→</span>
          <span className={styles.selectedItem}>
            {selectedPlatform.icon} {selectedPlatform.name}
          </span>
          <div className={styles.buttonGroup}>
            <button className={styles.changeButton} onClick={goBackToPlatforms}>
              Change platform
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
          <p className={styles.tutorialDescription}>{tutorial.description}</p>
        </div>

        <div className={styles.stepsContainer}>
          {tutorial.steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <h3>{step.title}</h3>
              </div>

              <p className={styles.stepDescription}>{step.description}</p>

              <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                  <span>{step.language}</span>
                  <button
                    className={styles.copyButton}
                    onClick={() => navigator.clipboard.writeText(step.code)}
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {tutorial.tips && tutorial.tips.length > 0 && (
          <div className={styles.tipsContainer}>
            <h3>💡 Pro Tips</h3>
            <ul className={styles.tipsList}>
              {tutorial.tips.map((tip, index) => (
                <li key={index} className={styles.tip}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className={styles.resetButton} onClick={reset}>
        ↻ Start over
      </button>
    </div>
  );
};

export default InteractiveQuickstart;
