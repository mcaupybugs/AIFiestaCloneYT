import type { ChatRequest, ChatResponse, APIConfig } from "./types";

export class OpenAIService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || "gpt-4o",
          messages: [
            ...(request.conversationHistory || []),
            { role: "user", content: request.message },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      provider: "openai",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }
}
