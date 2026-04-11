import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Menu from '../models/Menu.js';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Shop metadata (mirrors frontend shopDetails)
const shopInfo = {
  snapeats: { name: 'Snapeats', tagline: 'Snack it, Snap it.', rating: '4.5', time: '10-15 min' },
  houseofchow: { name: 'House of Chow', tagline: 'Authentic Asian bowls.', rating: '4.8', time: '20 min' },
  kaathi: { name: 'Kaathi', tagline: 'Roll into happiness.', rating: '4.2', time: '15 min' },
  tuckshop: { name: 'Tuck Shop', tagline: 'Your daily cravings.', rating: '4.0', time: '5-10 min' }
};

// Store conversation history per user (in-memory)
const conversationHistory = new Map();
const MAX_HISTORY = 10;

// =====================================================
// SECTION 1: MongoDB Data Fetchers (shared by both engines)
// =====================================================

async function getMenuData(shopId) {
  const query = shopId ? { shopId, isAvailable: true } : { isAvailable: true };
  return Menu.find(query).sort({ price: 1 });
}

async function getMenuContext(shopId) {
  try {
    const items = await getMenuData(shopId);
    if (items.length === 0) return 'No menu items currently available.';
    const grouped = {};
    items.forEach(item => {
      const shop = shopInfo[item.shopId]?.name || item.shopId;
      if (!grouped[shop]) grouped[shop] = [];
      grouped[shop].push(`${item.name} - ₹${item.price}${item.description ? ` (${item.description})` : ''}`);
    });
    return Object.entries(grouped)
      .map(([shop, items]) => `${shop}:\n${items.map(i => `  • ${i}`).join('\n')}`)
      .join('\n\n');
  } catch { return 'Menu data temporarily unavailable.'; }
}

async function getOrderContext(username) {
  try {
    const orders = await Order.find({ studentId: username }).sort({ createdAt: -1 }).limit(5);
    if (orders.length === 0) return 'No orders found for this student.';
    return orders.map(o => {
      const shop = shopInfo[o.shopId]?.name || o.shopId;
      const items = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
      const time = new Date(o.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
      return `Order #${o._id.toString().slice(-4)} | ${shop} | ${items} | ₹${o.total} | Status: ${o.status} | Payment: ${o.paymentStatus} (${o.paymentMethod}) | ${time}`;
    }).join('\n');
  } catch { return 'Order data temporarily unavailable.'; }
}

// =====================================================
// SECTION 2: Gemini AI Engine
// =====================================================

function buildSystemPrompt(menuData, orderData, username, currentShop) {
  return `You are BuEats Assistant, the friendly AI chatbot for BuEats — a campus food ordering app.

ABOUT BUEATS:
- Students order food from 4 campus outlets: Snapeats, House of Chow, Kaathi, Tuck Shop
- Payment: UPI (GPay, PhonePe, Paytm) or Pay at Counter (cash)
- Students add items to cart, checkout, and track order status in real-time

CAMPUS OUTLETS:
- Snapeats: "${shopInfo.snapeats.tagline}" | ⭐ ${shopInfo.snapeats.rating} | ⏱️ ${shopInfo.snapeats.time}
- House of Chow: "${shopInfo.houseofchow.tagline}" | ⭐ ${shopInfo.houseofchow.rating} | ⏱️ ${shopInfo.houseofchow.time}
- Kaathi: "${shopInfo.kaathi.tagline}" | ⭐ ${shopInfo.kaathi.rating} | ⏱️ ${shopInfo.kaathi.time}
- Tuck Shop: "${shopInfo.tuckshop.tagline}" | ⭐ ${shopInfo.tuckshop.rating} | ⏱️ ${shopInfo.tuckshop.time}

CURRENT MENU (live from database):
${menuData}

STUDENT'S RECENT ORDERS:
${orderData}

CONTEXT: Student "${username}" | Browsing: ${currentShop ? (shopInfo[currentShop]?.name || currentShop) : 'Dashboard'}

RULES:
1. Keep responses concise (2-4 short paragraphs max)
2. Use emojis sparingly 🍔
3. Use **bold** for item names and prices
4. Format menu items as bullet points
5. Only reference items from the CURRENT MENU data — never make up items
6. Be warm and casual — you're talking to college students
7. If unrelated to food, politely redirect

End every response with:
SUGGESTIONS: suggestion1 | suggestion2 | suggestion3`;
}

function parseSuggestions(text) {
  const lines = text.trim().split('\n');
  const lastLine = lines[lines.length - 1];
  if (lastLine.startsWith('SUGGESTIONS:')) {
    const suggestions = lastLine.replace('SUGGESTIONS:', '').split('|').map(s => s.trim()).filter(s => s.length > 0 && s.length < 40);
    return { reply: lines.slice(0, -1).join('\n').trim(), suggestions };
  }
  return { reply: text.trim(), suggestions: ['Show menu', 'Order status', 'Help'] };
}

async function tryGemini(message, username, contextShopId) {
  const [menuData, orderData] = await Promise.all([
    getMenuContext(contextShopId),
    getOrderContext(username)
  ]);

  const systemPrompt = buildSystemPrompt(menuData, orderData, username, contextShopId);

  if (!conversationHistory.has(username)) conversationHistory.set(username, []);
  const history = conversationHistory.get(username);

  const contents = [...history, { role: 'user', parts: [{ text: message }] }];

  // Retry up to 2 times
  let result;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      result = await model.generateContent({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
      });
      break;
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('RetryInfo')) {
        if (attempt === 0) {
          console.log('Gemini rate limited, retrying in 5s...');
          await new Promise(r => setTimeout(r, 5000));
        }
      } else {
        throw err;
      }
    }
  }

  if (!result) return null; // Signal to use fallback engine

  const responseText = result.response.text();
  const { reply, suggestions } = parseSuggestions(responseText);

  // Save history
  history.push({ role: 'user', parts: [{ text: message }] });
  history.push({ role: 'model', parts: [{ text: reply }] });
  if (history.length > MAX_HISTORY * 2) history.splice(0, history.length - MAX_HISTORY * 2);

  return { reply, suggestions, source: 'gemini' };
}

// =====================================================
// SECTION 3: Regex Fallback Engine (works offline)
// =====================================================

function detectIntent(message) {
  const msg = message.toLowerCase().trim();
  if (/^(hi|hello|hey|sup|yo|hola|howdy|greetings|good\s?(morning|afternoon|evening))/.test(msg)) return 'greeting';
  if (/order\s*(status|track|where|update)|where.*(my|the)\s*order|track/i.test(msg)) return 'order_status';
  if (/menu|what.*(available|have|serve|offer)|show.*(items|menu)|food\s*(list|items)/i.test(msg)) return 'menu_browse';
  if (/price|cost|how\s*much|cheapest|expensive|affordable|budget|under\s*\d+/i.test(msg)) return 'price_query';
  if (/recommend|suggest|what\s*should|best|popular|top|favorite|must\s*try/i.test(msg)) return 'recommend';
  if (/pay|payment|upi|cash|counter|gpay|phonepe|paytm|how\s*to\s*(pay|checkout)/i.test(msg)) return 'payment_help';
  if (/shop|outlet|store|restaurant|which\s*shop|about\s*(snapeats|house|kaathi|tuck)/i.test(msg)) return 'shop_info';
  if (/hour|timing|open|close|when|schedule/i.test(msg)) return 'hours';
  if (/how\s*(to|do\s*i)\s*(order|place|book|get)/i.test(msg)) return 'how_to_order';
  if (/help|support|what\s*can\s*you|commands|features/i.test(msg)) return 'help';
  if (/thank|thanks|bye|goodbye|see\s*you|later/i.test(msg)) return 'farewell';
  return 'fallback';
}

function extractShopId(message) {
  const msg = message.toLowerCase();
  if (/snap\s*eat/i.test(msg)) return 'snapeats';
  if (/house\s*(of\s*)?chow/i.test(msg)) return 'houseofchow';
  if (/kaathi/i.test(msg)) return 'kaathi';
  if (/tuck\s*shop/i.test(msg)) return 'tuckshop';
  return null;
}

async function regexFallback(message, username, contextShopId) {
  const intent = detectIntent(message);
  const shopId = extractShopId(message) || contextShopId;

  switch (intent) {
    case 'greeting':
      return { reply: `Hey ${username}! 👋 I'm your BuEats Assistant. Ask me about menus, prices, order status, or anything food-related!`, suggestions: ['Show me the menu', 'Order status', 'Which shops?', 'How do I pay?'] };

    case 'menu_browse': {
      if (!shopId) {
        const list = Object.values(shopInfo).map(s => `🏪 **${s.name}** — ${s.tagline}`).join('\n');
        return { reply: `Which shop's menu? We have:\n\n${list}`, suggestions: ['Snapeats menu', 'House of Chow menu', 'Kaathi menu', 'Tuck Shop menu'] };
      }
      const items = await getMenuData(shopId);
      const shop = shopInfo[shopId];
      if (items.length === 0) return { reply: `${shop?.name || shopId} has no items available right now.`, suggestions: ['Show other shops'] };
      const itemList = items.map(i => `• **${i.name}** — ₹${i.price}${i.description ? ` _(${i.description})_` : ''}`).join('\n');
      return { reply: `🍽️ **${shop?.name} Menu** (${items.length} items)\n\n${itemList}\n\n⏱️ ${shop?.time}`, suggestions: ['Cheapest items', 'Recommend something', 'Other shops'] };
    }

    case 'price_query': {
      const underMatch = message.match(/under\s*(\d+)/i);
      const query = { isAvailable: true };
      if (shopId) query.shopId = shopId;
      if (underMatch) query.price = { $lte: parseInt(underMatch[1]) };
      const items = await Menu.find(query).sort({ price: 1 }).limit(5);
      if (items.length === 0) return { reply: 'No items found matching that criteria.', suggestions: ['Show full menu'] };
      const label = underMatch ? `under ₹${underMatch[1]}` : 'Budget-friendly';
      const results = items.map(i => `• **${i.name}** (${shopInfo[i.shopId]?.name || i.shopId}) — ₹${i.price}`).join('\n');
      return { reply: `💰 **${label}** items:\n\n${results}`, suggestions: ['Items under ₹50', 'Items under ₹100', 'Show menu'] };
    }

    case 'recommend': {
      const all = await getMenuData(shopId);
      if (all.length === 0) return { reply: 'Nothing to recommend right now!', suggestions: ['Show shops'] };
      const picks = all.sort(() => 0.5 - Math.random()).slice(0, 3);
      const results = picks.map(i => `⭐ **${i.name}** (${shopInfo[i.shopId]?.name}) — ₹${i.price}`).join('\n');
      return { reply: `🔥 **Today's Picks:**\n\n${results}`, suggestions: ['Show full menu', 'Cheapest items', 'How to order?'] };
    }

    case 'order_status': {
      const orders = await Order.find({ studentId: username }).sort({ createdAt: -1 }).limit(3);
      if (orders.length === 0) return { reply: `No orders yet! Browse a shop to place your first order. 🍽️`, suggestions: ['Show menu', 'Which shops?'] };
      const emoji = { pending: '🟡', placed: '🟠', accepted: '🔵', preparing: '🟠', ready: '🟢', completed: '✅', cancelled: '❌' };
      const lines = orders.map(o => {
        const shop = shopInfo[o.shopId]?.name || o.shopId;
        const items = o.items.map(i => i.name).join(', ');
        return `${emoji[o.status] || '⚪'} **${o.status.toUpperCase()}** — ${shop}\n   ${items} • ₹${o.total}`;
      }).join('\n\n');
      return { reply: `📦 **Your Recent Orders:**\n\n${lines}`, suggestions: ['Show menu', 'How to pay?'] };
    }

    case 'payment_help':
      return { reply: `💳 **Payment Methods:**\n\n**1. UPI** 📱 — GPay, PhonePe, Paytm, or any UPI app. Scan QR or use ID: \`bueats@upi\`\n\n**2. Counter** 🏪 — Pay cash when you pick up.\n\nBoth available at checkout!`, suggestions: ['How to order?', 'Show menu'] };

    case 'shop_info': {
      const sid = extractShopId(message);
      if (sid && shopInfo[sid]) {
        const s = shopInfo[sid];
        return { reply: `🏪 **${s.name}**\n_"${s.tagline}"_\n\n⭐ ${s.rating}/5 | ⏱️ ${s.time}`, suggestions: [`${s.name} menu`, 'All shops'] };
      }
      const list = Object.values(shopInfo).map(s => `🏪 **${s.name}** — ${s.tagline} (⭐${s.rating})`).join('\n');
      return { reply: `📍 **Campus Outlets:**\n\n${list}`, suggestions: ['Snapeats menu', 'Kaathi menu'] };
    }

    case 'hours':
      return { reply: `⏰ All outlets operate during campus hours. Check each shop for availability.`, suggestions: ['Which shops?', 'Show menu'] };

    case 'how_to_order':
      return { reply: `📝 **How to Order:**\n\n1️⃣ Pick a shop from the sidebar\n2️⃣ Browse menu & tap "+" to add items\n3️⃣ Review cart → "Pay & Checkout"\n4️⃣ Choose UPI or Counter payment\n5️⃣ Track your order in real-time! 🎉`, suggestions: ['Show menu', 'How to pay?'] };

    case 'help':
      return { reply: `🤖 **I can help with:**\n\n🍽️ "Show Snapeats menu"\n💰 "Items under ₹50"\n⭐ "Suggest something"\n📦 "Order status"\n💳 "How to pay?"\n🏪 "About Kaathi"`, suggestions: ['Show menu', 'Order status', 'Recommend'] };

    case 'farewell':
      return { reply: `See you around, ${username}! 👋 Enjoy your meal! 🍔`, suggestions: ['Show menu', 'Order status'] };

    default:
      return { reply: "I didn't quite get that — try asking about menus, orders, or payments! 😊", suggestions: ['Show menu', 'Order status', 'Help'] };
  }
}

// =====================================================
// SECTION 4: Main Endpoint (Gemini → Regex fallback)
// =====================================================

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message, shopId: contextShopId } = req.body;
    const username = req.user.username;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Chatbot is only available for students' });
    }

    // Try Gemini first
    let response;
    try {
      response = await tryGemini(message, username, contextShopId);
    } catch (err) {
      console.log('Gemini failed, using fallback:', err.message?.substring(0, 100));
    }

    // If Gemini didn't work, use regex fallback
    if (!response) {
      console.log('Using regex fallback engine');
      const fallbackResult = await regexFallback(message, username, contextShopId);
      response = { ...fallbackResult, source: 'fallback' };
    }

    res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      reply: "Something went wrong 😅 Please try again!",
      suggestions: ['Show menu', 'Order status', 'Help'],
      source: 'error'
    });
  }
});

export default router;
