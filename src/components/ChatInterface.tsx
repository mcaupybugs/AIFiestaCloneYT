import { useState } from "react";
import { Send, Image, Paperclip } from "lucide-react";
import { AIProvider, Message } from "../types";

interface ChatInterfaceProps {
  activeProvider: AIProvider;
  providers: AIProvider[];
  onProviderChange: (provider: AIProvider) => void;
  sidebarCollapsed: boolean;
}

const ChatInterface = ({
  activeProvider,
  providers,
  onProviderChange,
  sidebarCollapsed,
}: ChatInterfaceProps) => {
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
    setMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response from ${activeProvider.name}. In a real implementation, this would connect to the actual AI service.`,
        isUser: false,
        timestamp: new Date(),
        provider: activeProvider.id,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`chat-interface ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Provider Tabs */}
      <div className="provider-tabs">
        {providers.map((provider) => (
          <button
            key={provider.id}
            className={`provider-tab ${
              activeProvider.id === provider.id ? "active" : ""
            }`}
            onClick={() => onProviderChange(provider)}
            style={{
              borderBottomColor:
                activeProvider.id === provider.id
                  ? provider.color
                  : "transparent",
              color:
                activeProvider.id === provider.id ? provider.color : "#666",
            }}
          >
            <span className="provider-icon">{provider.icon}</span>
            <span className="provider-name">{provider.name}</span>
            <button className="tab-close">×</button>
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1>Welcome to AI Fiesta</h1>
              <p>Choose an AI provider and start chatting!</p>
              <div className="provider-grid">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    className="provider-card"
                    onClick={() => onProviderChange(provider)}
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
                <Image size={20} />
              </button>
              <button className="action-btn" title="Upload Image">
                <Paperclip size={20} />
              </button>
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
