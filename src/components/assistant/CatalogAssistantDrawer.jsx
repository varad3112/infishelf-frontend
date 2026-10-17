import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  RotateCcw,
  Zap,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { productService } from '../../services/productService';

const STARTER_QUERIES = [
  {
    icon: '📊',
    label: 'Highest average price category?',
    query: 'Which category has the highest average unit price?',
  },
  {
    icon: '🛒',
    label: 'Unilever items above ₹200',
    query: 'Show me all Unilever items priced above ₹200.',
  },
  {
    icon: '💎',
    label: 'Total catalog inventory value & count',
    query: 'What is our total catalog inventory value and total SKU count?',
  },
  {
    icon: '⭐',
    label: 'Brand with most SKUs',
    query: 'Which brand has the most SKUs in our store?',
  },
  {
    icon: '🏷️',
    label: 'Top 3 most expensive products',
    query: 'Show our top 3 most expensive products across the entire catalog.',
  },
];

export function CatalogAssistantDrawer({ isOpen, onClose, onViewProduct }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await productService.askCopilot(textToSend);
      const data = response?.data || {};

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Catalog query processed successfully.',
        products: data.products || [],
        tokens: data.tokens,
        source: data.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant query error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to reach the Catalog Assistant right now. Please ensure the backend server is running and try again.',
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  // Helper to render bold markdown and lists simply
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} style={{ height: '0.35rem' }} />;
      }

      // Check if bullet point
      const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
      const content = isBullet ? trimmed.substring(2) : trimmed;

      // Simple parser for **bold** text
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const parsedContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} style={{ color: 'var(--text-white)', fontWeight: 600 }}>
              {part.substring(2, part.length - 2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginLeft: '4px',
              marginTop: '3px',
            }}
          >
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}>•</span>
            <span style={{ color: 'var(--text-subtle)' }}>{parsedContent}</span>
          </div>
        );
      }

      return (
        <p key={idx} style={{ margin: '0 0 6px 0', color: 'var(--text-subtle)' }}>
          {parsedContent}
        </p>
      );
    });
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`assistant-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer Panel */}
      <aside
        className={`assistant-drawer-panel ${isOpen ? 'open' : ''}`}
        aria-label="InfiShelf Catalog Assistant"
        role="dialog"
      >
        {/* Header */}
        <div className="assistant-header">
          <div className="assistant-header-brand">
            <div className="assistant-avatar">
              <Bot size={20} />
            </div>
            <div className="assistant-header-info">
              <h3>
                Catalog Assistant
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--accent-primary-subtle)',
                    color: 'var(--accent-primary)',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  Gemini Flash Lite
                </span>
              </h3>
              <p>Ask plain-English questions about your live catalog</p>
            </div>
          </div>

          <div className="assistant-header-actions">
            {messages.length > 0 && (
              <button
                className="assistant-header-btn"
                onClick={handleClear}
                title="Clear conversation"
              >
                <RotateCcw size={12} />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              className="assistant-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close Assistant (Esc)"
              aria-label="Close Assistant Drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="assistant-body">
          {messages.length === 0 ? (
            /* Empty State: Welcome + Starter Prompts */
            <div className="assistant-welcome">
              <div className="assistant-welcome-icon">
                <Bot size={26} />
              </div>
              <h4>Chat with Catalog Assistant</h4>
              <p>
                Query inventory metrics, compare category price levels, or find high-value SKUs in
                real-time without exports.
              </p>

              <div className="assistant-starter-list">
                {STARTER_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    className="assistant-starter-btn"
                    onClick={() => handleSend(sq.query)}
                  >
                    <span className="chip-icon">{sq.icon}</span>
                    <span style={{ flex: 1 }}>{sq.label}</span>
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Conversation Stream */
            messages.map((msg) => (
              <div key={msg.id} className={`assistant-msg-row ${msg.sender}`}>
                <div className="assistant-msg-bubble">
                  {msg.sender === 'user' ? (
                    <div>{msg.text}</div>
                  ) : (
                    <div>
                      {renderFormattedText(msg.text)}

                      {/* Matched Product Cards */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="assistant-cards-grid">
                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              marginTop: '8px',
                            }}
                          >
                            Referenced Products ({msg.products.length}):
                          </div>
                          {msg.products.map((p) => (
                            <div
                              key={p.id}
                              className="assistant-mini-card"
                              onClick={() => {
                                if (onViewProduct) onViewProduct(p);
                              }}
                              title="Click to view full SKU specifications"
                            >
                              <img
                                src={p.image_url || '/placeholder.png'}
                                alt={p.name}
                                className="assistant-mini-thumb"
                                onError={(e) => {
                                  e.target.src =
                                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80';
                                }}
                              />
                              <div className="assistant-mini-info">
                                <div className="assistant-mini-name">{p.name}</div>
                                <div className="assistant-mini-sub">
                                  <span className="assistant-mini-brand">{p.brand}</span>
                                  <span>•</span>
                                  <span>{p.category}</span>
                                </div>
                              </div>
                              <div className="assistant-mini-price">
                                ₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                              <ExternalLink size={13} style={{ color: 'var(--accent-primary)', opacity: 0.8 }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metadata / Token Transparency */}
                      <div className="assistant-msg-meta">
                        <span>{msg.timestamp}</span>
                        {msg.source === 'cache' ? (
                          <span className="assistant-token-badge">
                            <Zap size={10} />
                            Cached (&lt;5ms · 0 tokens)
                          </span>
                        ) : msg.tokens && msg.tokens.total_tokens > 0 ? (
                          <span className="assistant-token-badge">
                            <Zap size={10} />
                            {msg.tokens.total_tokens.toLocaleString()} tokens
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="assistant-msg-row assistant">
              <div className="assistant-loading-row">
                <div className="assistant-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Analyzing catalog metrics via Django ORM...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <div className="assistant-footer">
          <form
            className="assistant-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="assistant-input-field"
              placeholder="Ask anything about catalog metrics, prices, brands..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="assistant-send-btn"
              disabled={!inputQuery.trim() || isLoading}
              aria-label="Send query to Assistant"
            >
              <Send size={15} />
            </button>
          </form>
          <div className="assistant-disclaimer">
            Calculations verified directly against live database using safe Django ORM aggregations.
          </div>
        </div>
      </aside>
    </>
  );
}
