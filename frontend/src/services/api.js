const BASE_URL = import.meta.env.VITE_API_URL;
export async function streamMessage(message, onChunk) {
  const response = await fetch(`${BASE_URL}/chat/stream`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      session_id: "1234",
      message,
    }),
  });

  const reader = response.body.getReader();//chunk-by-chunk reading

  const decoder = new TextDecoder();//Uint8Array → readable text

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value);

    onChunk(chunk);
  }
}
