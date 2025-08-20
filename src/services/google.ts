import type { ChatRequest, ChatResponse, APIConfig } from "./types";

export class GoogleService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const model = this.config.model || "gemini-2.0-flash-exp";

    // Convert conversation history to Google's format
    const contents = [
      ...(request.conversationHistory?.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })) || []),
      {
        role: "user",
        parts: [{ text: request.message }],
      },
    ];

    const response = await fetch(
      `${this.config.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Google API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error("Invalid response from Google API");
    }

    return {
      content: data.candidates[0].content.parts[0].text,
      provider: "google",
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: data.usageMetadata.totalTokenCount,
          }
        : undefined,
    };
  }
}
