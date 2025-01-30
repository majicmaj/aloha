export const MODELS = {
  "deepseek-r1": ["1.5b", "7b", "8b", "14b", "32b", "70b", "671b"],
  "llama3.3": ["tools", "70b"],
  phi4: ["14b"],
  "llama3.2": ["tools", "1b", "3b"],
  "llama3.1": ["tools", "8b", "70b", "405b"],
  "nomic-embed-text": ["embedding"],
  mistral: ["tools", "7b"],
  llama3: ["8b", "70b"],
  qwen: ["0.5b", "1.8b", "4b", "7b", "14b", "32b", "72b", "110b"],
  gemma: ["2b", "7b"],
  qwen2: ["tools", "0.5b", "1.5b", "7b", "72b"],
  "qwen2.5": ["tools", "0.5b", "1.5b", "3b", "7b", "14b", "32b", "72b"],
  phi3: ["3.8b", "14b"],
  llama2: ["7b", "13b", "70b"],
  llava: ["vision", "7b", "13b", "34b"],
  gemma2: ["2b", "9b", "27b"],
  "qwen2.5-coder": ["tools", "0.5b", "1.5b", "3b", "7b", "14b", "32b"],
  codellama: ["7b", "13b", "34b", "70b"],
  tinyllama: ["1.1b"],
  "mxbai-embed-large": ["embedding", "335m"],
  "mistral-nemo": ["tools", "12b"],
  "llama3.2-vision": ["vision", "11b", "90b"],
  starcoder2: ["3b", "7b", "15b"],
  "snowflake-arctic-embed": ["embedding", "22m", "33m", "110m", "137m", "335m"],
  mixtral: ["tools", "8x7b", "8x22b"],
  "deepseek-coder-v2": ["16b", "236b"],
  "dolphin-mixtral": ["8x7b", "8x22b"],
  phi: ["2.7b"],
  codegemma: ["2b", "7b"],
  "deepseek-coder": ["1.3b", "6.7b", "33b"],
  "llama2-uncensored": ["7b", "70b"],
  wizardlm2: ["7b", "8x22b"],
  "dolphin-mistral": ["7b"],
  "all-minilm": ["embedding", "22m", "33m"],
  "dolphin-llama3": ["8b", "70b"],
  "command-r": ["tools", "35b"],
  "bge-m3": ["embedding", "567m"],
  "orca-mini": ["3b", "7b", "13b", "70b"],
  yi: ["6b", "9b", "34b"],
  "llava-llama3": ["vision", "8b"],
  zephyr: ["7b", "141b"],
  "phi3.5": ["3.8b"],
  codestral: ["22b"],
  starcoder: ["1b", "3b", "7b", "15b"],
  "granite-code": ["3b", "8b", "20b", "34b"],
  vicuna: ["7b", "13b", "33b"],
  smollm: ["135m", "360m", "1.7b"],
  "wizard-vicuna-uncensored": ["7b", "13b", "30b"],
  "mistral-openorca": ["7b"],
  qwq: ["tools", "32b"],
  "llama2-chinese": ["7b", "13b"],
  smollm2: ["tools", "135m", "360m", "1.7b"],
  codegeex4: ["9b"],
  openchat: ["7b"],
  aya: ["8b", "35b"],
  "deepseek-v3": ["671b"],
  codeqwen: ["7b"],
  "nous-hermes2": ["10.7b", "34b"],
  "mistral-large": ["tools", "123b"],
  "command-r-plus": ["tools", "104b"],
  openhermes: [],
  "stable-code": ["3b"],
  tinydolphin: ["1.1b"],
  glm4: ["9b"],
  wizardcoder: ["33b"],
  "qwen2-math": ["1.5b", "7b", "72b"],
  bakllava: ["vision", "7b"],
  stablelm2: ["1.6b", "12b"],
  "deepseek-llm": ["7b", "67b"],
  reflection: ["70b"],
  moondream: ["vision", "1.8b"],
  "neural-chat": ["7b"],
  "llama3-gradient": ["8b", "70b"],
  "wizard-math": ["7b", "13b", "70b"],
  "llama3-chatqa": ["8b", "70b"],
  "deepseek-v2": ["16b", "236b"],
  sqlcoder: ["7b", "15b"],
  xwinlm: ["7b", "13b"],
  "minicpm-v": ["vision", "8b"],
  "nous-hermes": ["7b", "13b"],
};

export const RECOMMENDED_MODELS = Object.entries(MODELS)
  .map(([name, variants]) => variants.map((variant) => `${name}:${variant}`))
  .flat();
