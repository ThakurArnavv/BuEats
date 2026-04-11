import React, { useState, useRef, useEffect } from 'react';

// --- Chat bubble icon ---
const ChatBubbleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Typing dots animation ---
const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
      <span className="text-[10px] font-black text-white">BU</span>
    </div>
    <div className="bg-[#1A2235] rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5 items-center">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

// --- Simple markdown-lite renderer ---
function renderBotText(text) {
  return text.split('\n').map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return <strong key={j} className="text-white font-bold">{seg.slice(2, -2)}</strong>;
      }
      // Italic: _text_
      const italicParts = seg.split(/(_[^_]+_)/g).map((s, k) => {
        if (s.startsWith('_') && s.endsWith('_')) {
          return <em key={k} className="text-gray-400">{s.slice(1, -1)}</em>;
        }
        // Code: `text`
        const codeParts = s.split(/(`[^`]+`)/g).map((c, l) => {
          if (c.startsWith('`') && c.endsWith('`')) {
            return <code key={l} className="bg-white/10 px-1.5 py-0.5 rounded text-green-400 text-[11px] font-mono">{c.slice(1, -1)}</code>;
          }
          return c;
        });
        return codeParts;
      });
      return italicParts;
    });
    return (
      <span key={i}>
        {parts}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function Chatbot({ user, selectedShopId, cart, orders }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hey ${user?.name || 'there'}! 👋 I'm your BuEats Assistant. Ask me about menus, prices, order status, or anything food-related!`,
      suggestions: ['Show me the menu', 'Order status', 'Recommend something', 'How to order?']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: trimmed,
          shopId: selectedShopId || null
        })
      });

      const data = await res.json();

      // Small delay to feel natural
      await new Promise(r => setTimeout(r, 400 + Math.random() * 600));

      if (res.ok) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.reply,
          suggestions: data.suggestions || []
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.error || 'Something went wrong. Please try again!',
          suggestions: ['Help', 'Show menu']
        }]);
      }

      if (!isOpen) setHasUnread(true);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Oops! I couldn\'t connect to the server. Make sure the backend is running.',
        suggestions: ['Try again']
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* ===== Floating Action Button ===== */}
      <button
        id="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen
            ? 'bg-[#1A2235] border border-white/10 rotate-0'
            : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/40 hover:shadow-orange-500/60'
          }`}
        style={{ marginLeft: '264px' }}
      >
        {isOpen ? (
          <CloseIcon />
        ) : (
          <>
            <ChatBubbleIcon />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#090E17] animate-pulse" />
            )}
          </>
        )}
      </button>

      {/* ===== Chat Window ===== */}
      <div
        className={`fixed bottom-24 right-6 z-[200] w-[380px] max-h-[560px] flex flex-col bg-[#0B1221] border border-white/10 rounded-[1.5rem] shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
          }`}
        style={{ marginLeft: '264px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111727] to-[#0B1221] px-5 py-4 border-b border-white/5 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-xs font-black text-white">BU</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-white tracking-tight">BuEats Assistant</h3>
            <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
              Online
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin" style={{ maxHeight: '380px' }}>
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'bot' ? (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-orange-500/20">
                    <span className="text-[10px] font-black text-white">BU</span>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    <div className="bg-[#1A2235] text-gray-300 text-[13px] leading-relaxed rounded-2xl rounded-tl-md px-4 py-3 border border-white/5">
                      {renderBotText(msg.text)}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s, j) => (
                          <button
                            key={j}
                            onClick={() => handleSuggestionClick(s)}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-400/40 transition-all duration-200 whitespace-nowrap"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] leading-relaxed rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%] shadow-lg shadow-orange-500/10 font-medium">
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-white/5 p-3 bg-[#111727]">
          <div className="flex items-center gap-2 bg-[#090E17] rounded-xl border border-white/5 px-3 py-1 focus-within:border-orange-500/30 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about menus, orders, prices..."
              className="flex-1 bg-transparent text-white text-sm py-2.5 outline-none placeholder-gray-600 font-medium"
              disabled={isTyping}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 ${input.trim() && !isTyping
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-gray-600'
                }`}
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-center text-[9px] text-gray-700 mt-2 font-bold tracking-wider">BUEATS AI ASSISTANT</p>
        </div>
      </div>
    </>
  );
}
