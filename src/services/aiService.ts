import { OpenAIService } from "./openai";
import { AnthropicService } from "./anthropic";
import { GoogleService } from "./google";
import { PerplexityService } from "./perplexity";
import { DeepSeekService } from "./deepseek";
import type { ChatRequest, ChatResponse } from "./types";

export class AIService {
  private openai: OpenAIService | null = null;
  private anthropic: AnthropicService | null = null;
  private google: GoogleService | null = null;
  private perplexity: PerplexityService | null = null;
  private deepseek: DeepSeekService | null = null;

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // OpenAI / ChatGPT
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const openaiBaseUrl = import.meta.env.VITE_OPENAI_BASE_URL;
    if (openaiKey && openaiBaseUrl) {
      this.openai = new OpenAIService({
        apiKey: openaiKey,
        baseUrl: openaiBaseUrl,
        model: "gpt-4o",
      });
    }

    // Anthropic / Claude
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    const anthropicBaseUrl = import.meta.env.VITE_ANTHROPIC_BASE_URL;
    if (anthropicKey && anthropicBaseUrl) {
      this.anthropic = new AnthropicService({
        apiKey: anthropicKey,
        baseUrl: anthropicBaseUrl,
        model: "claude-3-5-sonnet-20241022",
      });
    }

    // Google / Gemini
    const googleKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const googleBaseUrl = import.meta.env.VITE_GOOGLE_BASE_URL;
    if (googleKey && googleBaseUrl) {
      this.google = new GoogleService({
        apiKey: googleKey,
        baseUrl: googleBaseUrl,
        model: "gemini-2.0-flash-exp",
      });
    }

    // Perplexity
    const perplexityKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    const perplexityBaseUrl = import.meta.env.VITE_PERPLEXITY_BASE_URL;
    if (perplexityKey && perplexityBaseUrl) {
      this.perplexity = new PerplexityService({
        apiKey: perplexityKey,
        baseUrl: perplexityBaseUrl,
        model: "llama-3.1-sonar-large-128k-online",
      });
    }

    // DeepSeek
    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const deepseekBaseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL;
    if (deepseekKey && deepseekBaseUrl) {
      this.deepseek = new DeepSeekService({
        apiKey: deepseekKey,
        baseUrl: deepseekBaseUrl,
        model: "deepseek-chat",
      });
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    switch (request.provider) {
      case "chatgpt":
        if (!this.openai) {
          throw new Error(
            "OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file."
          );
        }
        return await this.openai.sendMessage(request);

      case "claude":
        if (!this.anthropic) {
          throw new Error(
            "Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file."
          );
        }
        return await this.anthropic.sendMessage(request);

      case "gemini":
        if (!this.google) {
          throw new Error(
            "Google API key not configured. Please add VITE_GOOGLE_API_KEY to your .env file."
          );
        }
        return await this.google.sendMessage(request);

      case "perplexity":
        if (!this.perplexity) {
          throw new Error(
            "Perplexity API key not configured. Please add VITE_PERPLEXITY_API_KEY to your .env file."
          );
        }
        return await this.perplexity.sendMessage(request);

      case "deepseek":
        if (!this.deepseek) {
          throw new Error(
            "DeepSeek API key not configured. Please add VITE_DEEPSEEK_API_KEY to your .env file."
          );
        }
        return await this.deepseek.sendMessage(request);

      default:
        throw new Error(`Unsupported provider: ${request.provider}`);
    }
  }

  isProviderConfigured(provider: string): boolean {
    switch (provider) {
      case "chatgpt":
        return this.openai !== null;
      case "claude":
        return this.anthropic !== null;
      case "gemini":
        return this.google !== null;
      case "perplexity":
        return this.perplexity !== null;
      case "deepseek":
        return this.deepseek !== null;
      default:
        return false;
    }
  }

  getConfiguredProviders(): string[] {
    const providers: string[] = [];
    if (this.openai) providers.push("chatgpt");
    if (this.anthropic) providers.push("claude");
    if (this.google) providers.push("gemini");
    if (this.perplexity) providers.push("perplexity");
    if (this.deepseek) providers.push("deepseek");
    return providers;
  }
}

// Create a singleton instance
export const aiService = new AIService();
