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

export default function Chatbot({ user, selectedShopId, cart, orders, onAddToCart, shopDetails }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hey ${user?.name || 'there'}! 👋 I'm your BuEats Assistant. How can I help you today?`,
      suggestions: ['AI Food Assistant 🤖', 'Order status', 'Surprise Me 🎲']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- New Sub-components ---
  const RecommendationOption = ({ option, onClick }) => (
    <button
      onClick={() => onClick(option.value)}
      className="group relative px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{option.label.split(' ').slice(-1)}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 group-hover:text-white transition-colors">
        {option.label.split(' ').slice(0, -1).join(' ')}
      </span>
    </button>
  );

  const FoodRecommendationCard = ({ item }) => {
    const shop = shopDetails?.[item.shopId];
    return (
      <div className="bg-[#1A2235]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group">
        <div className="relative h-32 overflow-hidden">
          {shop?.img ? (
            <img src={shop.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#242E45] to-[#1A2235]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2235] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl group-hover:rotate-12 transition-transform">
               🍱
             </div>
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-[10px] font-black text-orange-400">₹{item.price}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-black text-sm text-white truncate max-w-[150px] group-hover:text-orange-400 transition-colors">{item.name}</h4>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{shop?.name}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold mb-4 line-clamp-2 leading-relaxed h-8">
            {item.recommendationReason || item.description}
          </p>
          <button
            onClick={() => onAddToCart(item)}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 transition-all border border-white/10"
          >
            Add to Tray
          </button>
        </div>
      </div>
    );
  };

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

  const sendMessage = async (text, isSuggestion = false) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    // Detect mood triggers to update "Mood Special" banner
    const moods = ['happy', 'sad', 'stressed', 'tired', 'energetic', 'angry', 'chill'];
    const detectedMood = moods.find(m => trimmed.toLowerCase().includes(m));
    if (detectedMood) setActiveMood(detectedMood);

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

      await new Promise(r => setTimeout(r, 600));

      if (res.ok) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.reply,
          suggestions: data.suggestions || [],
          selectableOptions: data.selectableOptions || null,
          recommendedItems: data.recommendedItems || null
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
        text: 'Oops! I couldn\'t connect to the server.',
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
    sendMessage(suggestion, true);
  };

  return (
    <>
      <button
        id="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 group ${isOpen
          ? 'bg-[#111727] border border-white/10 rotate-90'
          : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/40 hover:shadow-orange-500/60'
          }`}
        style={{ marginLeft: '264px' }}
      >
        {isOpen ? <CloseIcon /> : (
          <>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl animate-pulse" />
            <ChatBubbleIcon />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#090E17] animate-pulse" />
            )}
          </>
        )}
      </button>

      <div
        className={`fixed bottom-24 right-6 z-[200] w-[400px] h-[600px] flex flex-col bg-[#0B1221]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
          }`}
        style={{ marginLeft: '264px' }}
      >
        {/* Banner: Mood Special */}
        {activeMood && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 flex items-center justify-between animate-fadeSlideDown">
            <p className="text-[10px] font-black uppercase tracking-widest text-white">🔥 Today's {activeMood} Mood Special</p>
            <button onClick={() => setActiveMood(null)} className="text-white/60 hover:text-white"><CloseIcon /></button>
          </div>
        )}

        <div className="bg-gradient-to-r from-[#111727] to-[#0B1221] px-6 py-5 border-b border-white/5 flex items-center gap-4 flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/20 ring-4 ring-orange-500/10">
            <span className="text-sm font-black text-white">BU</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-black text-white tracking-tight">AI Food Assistant</h3>
            <p className="text-[10px] text-green-400 font-black flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Empowered by Gemini
            </p>
          </div>
          <button onClick={() => sendMessage('Surprise Me 🎲')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-orange-500/20 text-orange-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg" title="Surprise Me!">
            <span>🎲</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} animate-fadeSlideUp`}>
              {msg.role === 'bot' ? (
                <div className="flex items-start gap-3 max-w-[90%]">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <span className="text-[10px] font-black text-orange-400">AI</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#1A2235]/80 backdrop-blur-md text-gray-200 text-[13px] leading-relaxed rounded-[1.5rem] rounded-tl-sm px-5 py-4 border border-white/10 shadow-lg">
                      {renderBotText(msg.text)}
                    </div>

                    {msg.selectableOptions && (
                      <div className="grid grid-cols-2 gap-3 animate-fadeSlideUp">
                        {msg.selectableOptions.map((opt, j) => (
                          <RecommendationOption key={j} option={opt} onClick={(val) => sendMessage(val)} />
                        ))}
                      </div>
                    )}

                    {msg.recommendedItems && (
                      <div className="grid grid-cols-1 gap-4 animate-cartPop">
                        {msg.recommendedItems.map((item, j) => (
                          <FoodRecommendationCard key={j} item={item} />
                        ))}
                      </div>
                    )}

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((s, j) => (
                          <button
                            key={j}
                            onClick={() => handleSuggestionClick(s)}
                            className="text-[10px] font-black px-4 py-2 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:bg-orange-500 hover:text-white hover:border-orange-400 transition-all duration-300"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[13px] leading-relaxed rounded-[1.5rem] rounded-tr-sm px-5 py-4 max-w-[80%] shadow-xl shadow-orange-500/10 font-bold border border-white/10 italic">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 border-t border-white/5 px-5 py-5 bg-[#0B1221]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 bg-[#050912] rounded-2xl border border-white/10 px-4 py-1.5 focus-within:border-orange-500/40 focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hungry? I can help choose..."
              className="flex-1 bg-transparent text-white text-sm py-3 outline-none placeholder-gray-600 font-bold"
              disabled={isTyping}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${input.trim() && !isTyping
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-90 ring-4 ring-orange-500/20'
                : 'bg-white/5 text-gray-700'
                }`}
            >
              <SendIcon />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
            <p className="text-center text-[8px] text-gray-600 font-black tracking-[0.3em] uppercase">Built for Bennett Students</p>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:200ms]" />
          </div>
        </div>
      </div>
    </>
  );
}
