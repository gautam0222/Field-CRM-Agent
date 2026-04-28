interface AnthropicMessage {
  role: "user" | "assistant"
  content: string
}

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>
}

export async function createAnthropicMessage(
  messages: AnthropicMessage[],
  options: { model?: string; maxTokens?: number } = {}
) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured")
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: options.model ?? "claude-3-5-sonnet-latest",
      max_tokens: options.maxTokens ?? 1024,
      messages,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Anthropic request failed: ${message}`)
  }

  const data = (await response.json()) as AnthropicResponse
  return data.content?.find((item) => item.type === "text")?.text ?? ""
}
