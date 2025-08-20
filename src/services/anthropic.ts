import type { ChatRequest, ChatResponse, APIConfig } from "./types";

export class AnthropicService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.config.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model || "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [
          ...(request.conversationHistory || []),
          { role: "user", content: request.message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`
      );
    }
    console.log("Running");

    const data = await response.json();

    return {
      content: data.content[0].text,
      provider: "anthropic",
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
    };
  }
}
