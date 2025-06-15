const OLLAMA_API_URL = import.meta.env.VITE_URL;

export async function generateChatResponse(
  messages: { role: string; content: string }[],
  model: string,
  onUpdate: (newChunk: string) => void,
  signal: AbortSignal
) {
  try {
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
      signal,
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
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Chat generation aborted.");
      return;
    }
    throw error;
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

export async function generateTitle(model: string, prompt: string) {
  const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      prompt: `Generate a short, concise title (4-5 words) for the following prompt: "${prompt}"`,
      stream: false,
      options: {
        num_predict: 1000,
      },
    }),
  });

  const data = await response.json();
  let title = data.response.trim();

  // Remove <think>...</think> blocks
  title = title.replace(/<think>[\s\S]*?<\/think>/g, "");

  // Remove any remaining start <think> tag if the end tag is missing
  title = title.replace(/<think>[\s\S]*/, "");

  // Clean up the title
  title = title.trim();
  if (title.startsWith('"') && title.endsWith('"')) {
    title = title.substring(1, title.length - 1);
  }

  return title;
}
