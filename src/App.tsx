import { useState } from "react";
import "./App.css";
import { aiService } from "./services/aiService";

interface AIProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  provider?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const AI_PROVIDERS: AIProvider[] = [
  { id: "chatgpt", name: "ChatGPT 5", icon: "🤖", color: "#10a37f" },
  { id: "gemini", name: "Gemini 2.5 Pro", icon: "✨", color: "#4285f4" },
  { id: "deepseek", name: "DeepSeek", icon: "🔍", color: "#6366f1" },
  {
    id: "perplexity",
    name: "Perplexity Sonar Pro",
    icon: "🔮",
    color: "#7c3aed",
  },
  { id: "claude", name: "Claude Sonnet", icon: "🎭", color: "#f97316" },
];

function App() {
  const [activeProvider, setActiveProvider] = useState<AIProvider>(
    AI_PROVIDERS[0]
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      provider: activeProvider.id,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      // Check if provider is configured
      if (!aiService.isProviderConfigured(activeProvider.id)) {
        throw new Error(
          `${activeProvider.name} API key not configured. Please add the API key to your .env file.`
        );
      }

      // Convert messages to conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      }));

      // Call the real AI service
      const response = await aiService.sendMessage({
        message: currentMessage,
        provider: activeProvider.id,
        conversationHistory,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        provider: activeProvider.id,
        usage: response.usage,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Service Error:", error);

      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ Error: ${
          error instanceof Error
            ? error.message
            : "Failed to get response from AI service"
        }`,
        isUser: false,
        timestamp: new Date(),
        provider: activeProvider.id,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">🤡</span>
              {!sidebarCollapsed && (
                <span className="logo-text">Shit Fiesta</span>
              )}
            </div>
            <button
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {!sidebarCollapsed && (
            <button className="new-chat-btn" onClick={() => setMessages([])}>
              <span>+ New Chat</span>
            </button>
          )}
        </div>

        <div className="chat-history">
          {!sidebarCollapsed && (
            <div className="section-title">
              <span>Projects</span>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="plan-info">
              <div className="plan-badge">Free Plan</div>
              <div className="usage-info">0 / 3 messages used</div>
              <button className="upgrade-btn">Upgrade Plan</button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div
        className={`chat-interface ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {/* Provider Tabs */}
        <div className="provider-tabs">
          {AI_PROVIDERS.map((provider) => {
            const isConfigured = aiService.isProviderConfigured(provider.id);
            return (
              <button
                key={provider.id}
                className={`provider-tab ${
                  activeProvider.id === provider.id ? "active" : ""
                } ${!isConfigured ? "unconfigured" : ""}`}
                onClick={() => setActiveProvider(provider)}
                style={{
                  borderBottomColor:
                    activeProvider.id === provider.id
                      ? provider.color
                      : "transparent",
                  color:
                    activeProvider.id === provider.id ? provider.color : "#666",
                }}
                title={
                  !isConfigured
                    ? `${provider.name} - API key not configured`
                    : provider.name
                }
              >
                <span className="provider-icon">{provider.icon}</span>
                <span className="provider-name">{provider.name}</span>
                {!isConfigured && <span className="config-indicator">⚠️</span>}
                <button className="tab-close">×</button>
              </button>
            );
          })}
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-content">
                <h1>Welcome to AI Fiesta</h1>
                <p>Choose an AI provider and start chatting!</p>
                <div className="provider-grid">
                  {AI_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      className="provider-card"
                      onClick={() => setActiveProvider(provider)}
                      style={{ borderColor: provider.color }}
                    >
                      <span className="provider-icon">{provider.icon}</span>
                      <span className="provider-name">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.isUser ? "user" : "ai"}`}
                >
                  <div className="message-content">
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message ai">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="message-input"
                rows={1}
              />
              <div className="input-actions">
                <button className="action-btn" title="Generate Image">
                  🖼️
                </button>
                <button className="action-btn" title="Upload Image">
                  📎
                </button>
                <button
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  title="Send message"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
