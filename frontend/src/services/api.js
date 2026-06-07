const BASE_URL = import.meta.env.VITE_API_URL;

export async function streamMessage(sessionId, message, onChunk) {
  const response = await fetch(`${BASE_URL}/chat/stream`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    onChunk(chunk);
  }

  const remaining = decoder.decode();
  if (remaining) {
    onChunk(remaining);
  }
}

export async function getSessions() {
  const response = await fetch(`${BASE_URL}/sessions`);

  if (!response.ok) {
    throw new Error("Failed to load sessions");
  }

  return await response.json();
}
export async function getChatHistory(sessionId) {
  const response = await fetch(`${BASE_URL}/chat-history/${sessionId}`);

  if (!response.ok) {
    throw new Error("Failed to load history");
  }

  return await response.json();
}
