'use client';

import {
  IconBrandApple,
  IconBrandUbuntu,
  IconBrandWindows,
  IconExternalLink,
} from '@tabler/icons-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OperatingSystem = 'Windows' | 'macOS' | 'Ubuntu';
type LlamaBinary = {
  name: string;
  downloadUrl: string;
};

const ARTIFACT_MAP: Record<OperatingSystem, Record<string, LlamaBinary>> = {
  Windows: {
    'Nvidia GPU': {
      name: 'llama-b6178-bin-win-cuda-12.4-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-win-cuda-12.4-x64.zip',
    },
    'Intel GPU': {
      name: 'llama-b6178-bin-win-sycl-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-win-sycl-x64.zip',
    },
    'AMD GPU': {
      name: 'llama-b6178-bin-win-vulkan-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-win-vulkan-x64.zip',
    },
    'Other GPU': {
      name: 'llama-b6178-bin-win-vulkan-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-win-vulkan-x64.zip',
    },
    'Qualcomm Snapdragon CPU': {
      name: 'llama-b6178-bin-win-cpu-arm64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-win-cpu-arm64.zip',
    },
    'Other (CPU-only)': {
      name: 'llama-b6178-bin-win-cpu-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-win-cpu-x64.zip',
    },
  },
  macOS: {
    Intel: {
      name: 'llama-b6178-bin-macos-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-macos-x64.zip',
    },
    'Apple Silicon': {
      name: 'llama-b6178-bin-macos-arm64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-macos-arm64.zip',
    },
  },
  Ubuntu: {
    GPU: {
      name: 'llama-b6178-bin-ubuntu-vulkan-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-ubuntu-vulkan-x64.zip',
    },
    'CPU-only': {
      name: 'llama-b6178-bin-ubuntu-x64.zip',
      downloadUrl:
        'https://github.com/ggml-org/llama.cpp/releases/download/b6178/llama-b6178-bin-ubuntu-x64.zip',
    },
  },
};

const SECONDARY_QUESTION_MAP: Record<OperatingSystem, string> = {
  Windows: 'What backend do you plan to use?',
  macOS: 'What chip do you have?',
  Ubuntu: 'What backend do you plan to use?',
};

const LlamaCppBinaryPicker: React.FC = () => {
  const [selectedOperatingSystem, setSelectedOperatingSystem] =
    useState<OperatingSystem>('Windows');
  const [selectedSecondary, setSelectedSecondary] = useState<string>('');

  const secondOptions = useMemo(() => {
    return Object.keys(ARTIFACT_MAP[selectedOperatingSystem]).sort();
  }, [selectedOperatingSystem]);

  useEffect(() => {
    setSelectedSecondary(secondOptions[0]);
  }, [secondOptions]);

  const llamaBinary = ARTIFACT_MAP[selectedOperatingSystem][selectedSecondary];

  return (
    <div className="my-4 flex flex-col gap-6 border rounded-xl p-6 bg-muted">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <Label className="font-bold">What is your operating system?</Label>
          <Select
            value={selectedOperatingSystem}
            onValueChange={(value) => setSelectedOperatingSystem(value as OperatingSystem)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Windows">
                <IconBrandWindows /> Windows
              </SelectItem>
              <SelectItem value="macOS">
                <IconBrandApple /> macOS
              </SelectItem>
              <SelectItem value="Ubuntu">
                <IconBrandUbuntu /> Ubuntu
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Label className="font-bold">{SECONDARY_QUESTION_MAP[selectedOperatingSystem]}</Label>
          {selectedOperatingSystem !== undefined && (
            <Select
              value={selectedSecondary}
              onValueChange={(value) => setSelectedSecondary(value)}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {secondOptions.map((v) => (
                  <SelectItem value={v} key={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p>Your best pre-compiled binary:</p>
        {llamaBinary ? (
          <a
            className="font-bold hover:text-accent inline-flex gap-1 items-center"
            href={llamaBinary.downloadUrl}
          >
            {llamaBinary.name} <IconExternalLink className="h-5 w-5" />
          </a>
        ) : (
          '-'
        )}
      </div>
    </div>
  );
};

export default LlamaCppBinaryPicker;
