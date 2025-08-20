import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Chat } from "../types";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎭</span>
            {!collapsed && <span className="logo-text">AI Fiesta</span>}
          </div>
          <button
            className="collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <button className="new-chat-btn">
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        )}
      </div>

      <div className="chat-history">
        <div className="section-title">
          {!collapsed && <span>Projects</span>}
        </div>

        <div className="chat-list">
          {chats.map((chat) => (
            <div key={chat.id} className="chat-item">
              <MessageSquare size={16} />
              {!collapsed && <span className="chat-title">{chat.title}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="plan-info">
          {!collapsed && (
            <>
              <div className="plan-badge">Free Plan</div>
              <div className="usage-info">0 / 3 messages used</div>
              <button className="upgrade-btn">Upgrade Plan</button>
            </>
          )}
        </div>

        <div className="footer-actions">
          <button className="footer-btn" title="Settings">
            <Settings size={16} />
            {!collapsed && <span>Settings</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
