const OLLAMA_API_URL = "http://localhost:11434";

export async function generateChatResponse(
  messages: { role: string; content: string }[],
  model: string,
  onUpdate: (newChunk: string) => void
) {
  const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true, // Ensure streaming is enabled
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to generate response");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let partialData = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    partialData += chunk;

    // Split the chunk into individual JSON objects
    const jsonObjects = partialData
      .split("\n")
      .filter((line) => line.trim() !== "");

    partialData = ""; // Reset for next batch

    for (const jsonStr of jsonObjects) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.message && parsed.message.content) {
          onUpdate(parsed.message.content); // Send new content to UI
        }
      } catch (error) {
        // Handle case where JSON isn't fully formed yet (streaming issue)
        partialData = jsonStr;
      }
    }
  }
}

export async function getInstalledModels() {
  const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
  if (!response.ok) throw new Error("Failed to fetch installed models");
  return response.json();
}

export async function getModelInfo(model: string) {
  const response = await fetch(`${OLLAMA_API_URL}/api/show`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model }),
  });
  if (!response.ok) throw new Error("Failed to fetch model info");
  return response.json();
}

export async function pullModel(model: string) {
  const response = await fetch(`${OLLAMA_API_URL}/api/pull`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model }),
  });
  if (!response.ok) throw new Error("Failed to pull model");
  return response.json();
}

export async function deleteModel(model: string) {
  const response = await fetch(`${OLLAMA_API_URL}/api/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model }),
  });
  if (!response.ok) throw new Error("Failed to delete model");
  return response.json();
}

export async function getRunningModels() {
  const response = await fetch(`${OLLAMA_API_URL}/api/ps`);
  if (!response.ok) throw new Error("Failed to fetch running models");
  return response.json();
}

// Recommended models (can be dynamically updated in the future)
export const RECOMMENDED_MODELS = [
  "deepseek-coder:1.3b",
  "deepseek-coder:6.7b",
  "deepseek-r1:1.5b",
  "deepseek-r1:7b",
  "deepseek-r1:8b",
  "deepseek-r1:14b",
  "deepseek-r1:32b",
  "deepseek-r1:70b",
  "deepseek-r1:671b",
  "deepseek-r1:1.5b-qwen-distill-fp16",
  "deepseek-r1:1.5b-qwen-distill-q4_K_M",
  "deepseek-r1:1.5b-qwen-distill-q8_0",
  "deepseek-r1:14b-qwen-distill-fp16",
  "deepseek-r1:14b-qwen-distill-q4_K_M",
  "deepseek-r1:14b-qwen-distill-q8_0",
  "deepseek-r1:32b-qwen-distill-fp16",
  "deepseek-r1:32b-qwen-distill-q4_K_M",
  "deepseek-r1:32b-qwen-distill-q8_0",
  "deepseek-r1:671b-fp16",
  "deepseek-r1:671b-q8_0",
  "deepseek-r1:70b-llama-distill-fp16",
  "deepseek-r1:70b-llama-distill-q4_K_M",
  "deepseek-r1:70b-llama-distill-q8_0",
  "deepseek-r1:7b-qwen-distill-fp16",
  "deepseek-r1:7b-qwen-distill-q4_K_M",
  "deepseek-r1:7b-qwen-distill-q8_0",
  "deepseek-r1:8b-llama-distill-fp16",
  "deepseek-r1:8b-llama-distill-q4_K_M",
  "deepseek-r1:8b-llama-distill-q8_0",
  "llama2:7b",
  "llama2:13b",
  "mistral:7b",
  "mistral:8x7b",
  "mistral:32b",
  "codellama:7b",
  "codellama:13b",
  "codellama:34b",
  "neural-chat:7b",
  "neural-chat:13b",
  "orca-mini:3b",
  "orca-mini:7b",
  "vicuna:7b",
  "vicuna:13b",
  "wizard-vicuna:7b",
  "wizard-vicuna:13b",
  "gemma:2b",
  "gemma:7b",
  "phi:1.5",
  "phi:2",
  "yi:6b",
  "yi:9b",
  "yi:34b",
  "qwen:1.8b",
  "qwen:7b",
  "qwen:14b",
  "qwen:72b",
  "mixtral:8x7b",
  "baichuan:7b",
  "baichuan:13b",
  "baichuan:62b",
  "falcon:7b",
  "falcon:40b",
  "stablelm:3b",
  "stablelm:7b",
  "stablelm-2:1.6b",
  "stablelm-2:7b",
  "openhermes:2.5",
  "openhermes:2.5-mistral",
  "zephyr:7b",
  "zephyr:beta",
  "zephyr:alpha",
  "solar:0.7b",
  "solar:10.7b",
  "command-r:7b",
  "command-r:34b",
  "command-r-plus:7b",
  "command-r-plus:34b",
  "nous-hermes:7b",
  "nous-hermes:13b",
  "nous-hermes-2:yi-34b",
  "nous-hermes-2:mistral",
  "reka:core",
  "reka:edge",
  "reka:flash",
  "goliath:6.9b",
  "goliath:12.9b",
  "goliath:33b",
];
