const OLLAMA_API_URL = import.meta.env.VITE_URL;

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
      } catch {
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
