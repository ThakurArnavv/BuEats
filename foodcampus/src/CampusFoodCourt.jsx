import React, { useState, useEffect } from 'react';

const shopDetails = {
  snapeats: { id: 'snapeats', name: 'Snapeats', tagline: 'Snack it, Snap it.', rating: '4.5', time: '10-15 min', img: '/images/snapeats_pizza.png' },
  houseofchow: { id: 'houseofchow', name: 'House of Chow', tagline: 'Authentic Asian bowls.', rating: '4.8', time: '20 min', img: '/images/houseofchow_bowl.png' },
  kaathi: { id: 'kaathi', name: 'Kaathi', tagline: 'Roll into happiness.', rating: '4.2', time: '15 min', img: '/images/kaathi_roll.png' },
  tuckshop: { id: 'tuckshop', name: 'Tuck Shop', tagline: 'Your daily cravings.', rating: '4.0', time: '5-10 min', img: '/images/tuckshop_burger.png' }
};

// --- ICONS ---
const FlameIcon = () => (
  <div className="bg-gradient-to-br from-orange-400 to-red-600 rounded-xl p-2 shadow-lg shadow-orange-600/40">
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  </div>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = ({ filled, half, onClick, onMouseEnter, onMouseLeave, size = 'w-8 h-8' }) => (
  <svg
    className={`${size} cursor-pointer transition-all duration-200 hover:scale-125 ${filled ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]' : 'text-gray-600'}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ReviewsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8 4v2m0-6h.01m-2.9-2a4 4 0 016.928 2.05" />
  </svg>
);

// --- STATUS BADGE ---
const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    accepted: 'bg-blue-500/10 text-blue-500',
    preparing: 'bg-orange-500/10 text-orange-500',
    ready: 'bg-green-500/10 text-green-500',
    completed: 'bg-gray-500/10 text-gray-400',
    cancelled: 'bg-red-500/10 text-red-500',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ onSelectDashboard, onSelectShop, onSelectHistory, onSelectSupport, activeView, activeShopId, onLogout }) => (
  <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col z-50">
    <div className="p-8 flex items-center gap-3">
      <FlameIcon />
      <span className="text-xl font-black tracking-tight text-white">BUEATS</span>
    </div>

    <nav className="flex-1 px-4 py-4 space-y-8">
      <div className="space-y-2">
        <button 
          onClick={onSelectDashboard}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeView === 'student-dash' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:text-white'}`}
        >
          <HomeIcon />
          Dashboard
        </button>
        <button 
          onClick={onSelectHistory}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeView === 'history' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:text-white'}`}
        >
          <HistoryIcon />
          Order History
        </button>
        <button 
          onClick={onSelectSupport}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeView === 'support' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:text-white'}`}
        >
          <SupportIcon />
          Support
        </button>
      </div>

      <div className="px-4">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Our Outlets</p>
        <div className="space-y-3">
          {Object.values(shopDetails).map(shop => (
            <button
              key={shop.id}
              onClick={() => onSelectShop(shop.id)}
              className={`w-full text-left flex items-center gap-3 group transition-all ${activeShopId === shop.id ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeShopId === shop.id ? 'bg-orange-500' : 'bg-gray-700 group-hover:bg-gray-400'}`}></span>
              <span className="text-sm font-bold">{shop.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>

    <div className="p-6 border-t border-white/5">
      <button onClick={onLogout} className="text-xs font-black text-gray-500 hover:text-white tracking-widest uppercase transition-colors">Sign Out</button>
    </div>
  </aside>
);

// --- MAIN APP WRAPPER ---
export default function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState({ role: 'student', id: '' });
  const [menus, setMenus] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [cart, setCart] = useState([]);
  const [currentOrderProgressId, setCurrentOrderProgressId] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Auth state
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState('');

  // Shop Owner State
  const [shopView, setShopView] = useState('orders'); 
  const [editingItem, setEditingItem] = useState(null);
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [prepTime, setPrepTime] = useState('');

  // Review System State
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewIssues, setReviewIssues] = useState([]);
  const [reviewStep, setReviewStep] = useState('rate'); // 'rate' | 'followup' | 'done'
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedOrderIds, setReviewedOrderIds] = useState(new Set());
  const [shopReviews, setShopReviews] = useState([]);
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [userReviews, setUserReviews] = useState({}); // orderId -> review object

  // Support System State
  const [showComplaintPopup, setShowComplaintPopup] = useState(false);
  const [complaintContext, setComplaintContext] = useState(null);
  const [complaintForm, setComplaintForm] = useState({ type: 'Late delivery', description: '' });
  const [supportComplaints, setSupportComplaints] = useState([]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
          role: user.role
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      if (isLoginMode) {
        localStorage.setItem('token', data.token);
        const userData = {
          id: data.user.username.toLowerCase(),
          role: data.user.role,
          name: data.user.username
        };
        setUser(userData);
        setView(userData.role === 'shop' ? 'shop-dash' : 'student-dash');
        setShopView('orders');
      } else {
        setIsLoginMode(true);
        setAuthError('Registration successful. Please log in.');
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // --- FETCH MENU FROM API ---
  const fetchMenu = async (shopId) => {
    try {
      const res = await fetch(`/api/menu/${shopId}`);
      const data = await res.json();
      setMenus(prev => ({ ...prev, [shopId]: data }));
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  // Fetch menu whenever a shop is selected or view changes to menu
  useEffect(() => {
    if (selectedShopId && view === 'menu') {
      fetchMenu(selectedShopId);
    }
  }, [selectedShopId, view]);

  // Fetch menu for shop owner's edit menu view
  useEffect(() => {
    if (user.role === 'shop' && shopView === 'menu' && user.id) {
      fetchMenu(user.id);
    }
  }, [shopView, user.role, user.id]);

  // Poll menu data every 5s for live updates
  useEffect(() => {
    let id;
    const shop = user.role === 'shop' && shopView === 'menu' ? user.id
      : (view === 'menu' && selectedShopId ? selectedShopId : null);
    if (shop) {
      id = setInterval(() => fetchMenu(shop), 5000);
    }
    return () => { if (id) clearInterval(id); };
  }, [selectedShopId, shopView, user.role, user.id, view]);

  // Helper to navigate to a shop menu (always forces a fresh fetch)
  const navigateToShop = (shopId) => {
    setSelectedShopId(null); // clear first to force useEffect re-fire
    setTimeout(() => {
      setSelectedShopId(shopId);
      setView('menu');
    }, 0);
  };

  const handleLogout = () => {
    setUser({ role: 'student', id: '' });
    setCart([]);
    setSelectedShopId(null);
    setCurrentOrderProgressId(null);
    setLoginForm({ username: '', password: '' });
    setView('login');
    localStorage.removeItem('token');
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decrementCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter(i => i._id !== itemId);
      return prev.map(i => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i._id !== itemId));
  };

  // --- REAL-TIME ORDER POLLING ---
  useEffect(() => {
    let intervalId;
    if (view !== 'login' && user.id) {
      const fetchOrdersAndReviews = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const endpoint = user.role === 'shop' ? '/api/orders/shop' : '/api/orders/student';
          const res = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
            
            // Auto-sync current student active order progress
            if (user.role === 'student' && data.length > 0) {
              const latestOrder = data[0];
              if (['pending', 'placed', 'accepted', 'preparing', 'ready'].includes(latestOrder.status)) {
                 setCurrentOrderProgressId(latestOrder._id);
              }

              // Fetch all reviews for this student in one go
              const rRes = await fetch('/api/reviews/student', {
                 headers: { 'Authorization': `Bearer ${token}` }
              });
              if (rRes.ok) {
                const rData = await rRes.json();
                const reviewsMap = {};
                rData.forEach(r => { reviewsMap[r.orderId] = r; });
                setUserReviews(reviewsMap);
              }
            }
          }
        } catch (err) {
          console.error("Failed to poll orders", err);
        }
      };

      fetchOrdersAndReviews();
      intervalId = setInterval(fetchOrdersAndReviews, 10000); // 10s sync
    }
    return () => clearInterval(intervalId);
  }, [view, user.id, user.role]);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          shopId: selectedShopId,
          items: cart,
          total: cart.reduce((s, i) => s + (i.price * i.quantity), 0)
        })
      });

      if (res.ok) {
        const newOrder = await res.json();
        setCart([]);
        setCurrentOrderProgressId(newOrder._id);
        setOrders(prev => [newOrder, ...prev]); 
      }
    } catch (err) {
      console.error("Failed to place order", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? {...o, status: newStatus} : o));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // --- ACCEPT ORDER WITH PREP TIME ---
  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/accept`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ expectedPreparationTime: parseInt(prepTime) })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map(o => o._id === orderId ? updated : o));
        setAcceptingOrderId(null);
        setPrepTime('');
      }
    } catch (err) {
      console.error("Failed to accept order", err);
    }
  };

  // --- REJECT ORDER ---
  const handleRejectOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? {...o, status: 'cancelled'} : o));
      }
    } catch (err) {
      console.error("Failed to reject order", err);
    }
  };

  const handleOrderDone = () => {
    const orderId = currentOrderProgressId;
    if (orderId) {
      updateOrderStatus(orderId, 'completed');
      // Trigger review popup after marking completed
      setTimeout(() => {
        if (!reviewedOrderIds.has(orderId)) {
          setReviewOrderId(orderId);
          setReviewRating(0);
          setReviewHoverRating(0);
          setReviewComment('');
          setReviewIssues([]);
          setReviewStep('rate');
          setShowReviewPopup(true);
        }
      }, 800);
    }
    setCurrentOrderProgressId(null);
    setSelectedShopId(null);
    setView('student-dash');
  };

  // --- REVIEW SYSTEM ---
  const handleSubmitReview = async () => {
    if (!reviewOrderId || reviewRating === 0) return;
    setReviewSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          orderId: reviewOrderId,
          rating: reviewRating,
          comment: reviewComment,
          issues: reviewIssues,
          addedToFavorites: false,
        })
      });
      if (res.ok) {
        const savedReview = await res.json();
        setUserReviews(prev => ({ ...prev, [reviewOrderId]: savedReview }));
        setReviewedOrderIds(prev => new Set([...prev, reviewOrderId]));
        if (reviewRating >= 4) {
          setReviewStep('followup-good');
        } else if (reviewRating <= 2) {
          setReviewStep('followup-bad');
        } else {
          setReviewStep('done');
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review submit error:', err);
    }
    setReviewSubmitting(false);
  };

  const handleSaveFavorite = async () => {
    if (!reviewOrderId) return;
    const existingReview = userReviews[reviewOrderId];
    if (!existingReview) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reviews/${existingReview._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ addedToFavorites: true })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserReviews(prev => ({ ...prev, [reviewOrderId]: updated }));
        setReviewStep('done');
      }
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const handleEditReview = (orderId) => {
    const review = userReviews[orderId];
    if (!review) return;

    setReviewOrderId(orderId);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setReviewIssues(review.issues || []);
    setReviewStep('rate');
    setShowReviewPopup(true);
  };

  const handleUpdateReview = async () => {
    if (!reviewOrderId || reviewRating === 0) return;
    const existingReview = userReviews[reviewOrderId];
    if (!existingReview) return;

    setReviewSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reviews/${existingReview._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          issues: reviewIssues,
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserReviews(prev => ({ ...prev, [reviewOrderId]: updated }));
        setReviewStep('done');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update review');
      }
    } catch (err) {
      console.error('Review update error:', err);
    }
    setReviewSubmitting(false);
  };

  const closeReviewPopup = () => {
    setShowReviewPopup(false);
    setReviewOrderId(null);
    setReviewStep('rate');
  };

  // Fetch reviews for shop owner
  const fetchShopReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reviews/shop/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShopReviews(data);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    }
  };

  useEffect(() => {
    if (user.role === 'shop' && shopView === 'reviews') {
      fetchShopReviews();
      const id = setInterval(fetchShopReviews, 10000);
      return () => clearInterval(id);
    }
  }, [user.role, shopView, user.id]);

  const handleShopReply = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        setReplyingReviewId(null);
        setReplyText('');
        fetchShopReviews();
      }
    } catch (err) {
      console.error('Reply error:', err);
    }
  };

  const toggleIssue = (issue) => {
    setReviewIssues(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  // --- SUPPORT COMPLAINTS SYSTEM ---
  const fetchComplaints = async () => {
    try {
      let url = '';
      if (user.role === 'student') url = `/api/complaints/user/${user.id}`;
      else if (user.role === 'shop') url = `/api/complaints/outlet/${user.id}`;
      else return;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSupportComplaints(data);
      }
    } catch (err) {
      console.error('Fetch complaints error:', err);
    }
  };

  useEffect(() => {
    if ((user.role === 'student' && view === 'support') || (user.role === 'shop' && shopView === 'support')) {
      fetchComplaints();
      const id = setInterval(fetchComplaints, 10000);
      return () => clearInterval(id);
    }
  }, [view, shopView, user.id, user.role]);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintContext) return;
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          order_id: complaintContext.orderId,
          outlet_id: complaintContext.outletId,
          complaint_type: complaintForm.type,
          description: complaintForm.description
        })
      });
      if (res.ok) {
        setShowComplaintPopup(false);
        setComplaintContext(null);
        setComplaintForm({ type: 'Late delivery', description: '' });
        fetchComplaints(); // refresh if we're on the page
      }
    } catch (err) {
      console.error('Submit complaint error:', err);
    }
  };

  // --- MENU MANAGEMENT WITH API ---
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    const shopId = user.id;
    const token = localStorage.getItem('token');

    try {
      if (editingItem.isNew) {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            shopId,
            name: editingItem.name,
            description: editingItem.description || '',
            price: parseInt(editingItem.price),
            isAvailable: editingItem.isAvailable !== false
          })
        });
      } else {
        await fetch(`/api/menu/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            name: editingItem.name,
            description: editingItem.description || '',
            price: parseInt(editingItem.price),
            isAvailable: editingItem.isAvailable !== false
          })
        });
      }

      await fetchMenu(shopId);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to save menu item:', err);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/menu/${itemId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      await fetchMenu(user.id);
    } catch (err) {
      console.error('Failed to delete menu item:', err);
    }
  };

  const activeOrder = orders.find(o => o._id === currentOrderProgressId);
  const cartTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  // --- Helper: header title ---
  const getHeaderTitle = () => {
    if (user.role === 'shop') {
      if (shopView === 'orders') return 'Active Orders';
      if (shopView === 'history') return 'Order History';
      if (shopView === 'reviews') return 'Customer Reviews';
      return 'Menu Management';
    }
    if (view === 'student-dash') return 'Food Outlets';
    if (view === 'history') return 'Order History';
    return shopDetails[selectedShopId]?.name || 'Menu';
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 text-white">
        <div className="max-w-md w-full bg-[#141414] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><FlameIcon /></div>
            <h1 className="text-3xl font-black tracking-tighter">BUEATS</h1>
          </div>
          <div className="flex bg-[#1A2235] p-1 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setUser({ ...user, role: 'student' })} 
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${user.role === 'student' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500'}`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => setUser({ ...user, role: 'shop' })} 
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${user.role === 'shop' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500'}`}
            >
              Shop Owner
            </button>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {authError && <div className={`p-3 rounded-xl text-sm font-bold text-center ${authError.includes('successful') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{authError}</div>}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{user.role === 'shop' ? 'Shop ID (e.g. snapeats)' : 'Student ID'}</label>
               <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
                  placeholder={user.role === 'shop' ? "snapeats" : "2110XXXX"} 
                  required 
               />
            </div>
            <input 
              type="password" 
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
              placeholder="Password" 
              required 
            />
            <button type="submit" className="w-full bg-orange-500 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20">{isLoginMode ? 'Sign In' : 'Register'}</button>
          </form>
          <div className="mt-6 text-center">
            <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }} className="text-xs text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors">
              {isLoginMode ? 'Need an account? Register' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar - Student */}
      {user.role === 'student' && (
        <Sidebar 
          activeView={view} 
          activeShopId={selectedShopId}
          onSelectDashboard={() => { setView('student-dash'); setSelectedShopId(null); }}
          onSelectShop={(id) => navigateToShop(id)}
          onSelectHistory={() => { setView('history'); setSelectedShopId(null); }}
          onSelectSupport={() => { setView('support'); setSelectedShopId(null); }}
          onLogout={handleLogout}
        />
      )}

      {/* Sidebar - Shop */}
      {user.role === 'shop' && (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col z-50">
          <div className="p-8 flex items-center gap-3 w-full overflow-hidden">
            <div className="flex-shrink-0"><FlameIcon /></div>
            <span className="text-xl font-black tracking-tight text-white uppercase truncate" title={user.id}>{user.id}</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-4">
            <button 
              onClick={() => setShopView('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${shopView === 'orders' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}
            >
              <HomeIcon />
              Active Orders
            </button>
            <button 
              onClick={() => setShopView('menu')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${shopView === 'menu' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}
            >
              <EditIcon />
              Edit Menu
            </button>
            <button 
              onClick={() => setShopView('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${shopView === 'history' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}
            >
              <HistoryIcon />
              Order History
            </button>
            <button 
              onClick={() => setShopView('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${shopView === 'reviews' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}
            >
              <ReviewsIcon />
              Reviews
            </button>
            <button 
              onClick={() => setShopView('support')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${shopView === 'support' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}
            >
              <SupportIcon />
              Complaints
            </button>
          </nav>
          <div className="p-6 border-t border-white/5">
            <button onClick={handleLogout} className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest">Sign Out</button>
          </div>
        </aside>
      )}

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="px-10 py-6 flex justify-between items-center sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-40">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Bennett University</span>
            <h2 className="text-xl font-black tracking-tight">{getHeaderTitle()}</h2>
          </div>
          <div className="flex items-center gap-4">
            {user.role === 'student' && (
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
              </div>
            )}
          </div>
        </header>

        <div className="p-10">
          {/* Student Dash */}
          {user.role === 'student' && view === 'student-dash' && (
            <div className="max-w-6xl">
              <div className="mb-14">
                <h1 className="text-7xl font-black tracking-tighter mb-4">Hungry for <span className="text-blue-500">Success?</span></h1>
                <p className="text-gray-400 text-lg">Order from top-rated kitchens on campus.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {Object.values(shopDetails).map(shop => (
                  <div key={shop.id} onClick={() => navigateToShop(shop.id)} className="group relative bg-[#141414] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 transition-all hover:scale-[1.01]">
                    <img src={shop.img} className="w-full aspect-video object-cover" />
                    <div className="p-8 absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-3xl font-black">{shop.name}</h3>
                      <p className="text-gray-400 font-bold">{shop.tagline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Menu View */}
          {user.role === 'student' && view === 'menu' && (() => {
            const shop = shopDetails[selectedShopId];
            const availableItems = menus[selectedShopId]?.filter(item => item.isAvailable !== false) || [];
            const foodEmojis = ['🍔', '🍕', '🌮', '🍜', '🍛', '🥗', '🍱', '🥘', '🧆', '🍲', '🌯', '🍗', '🥙', '🍝'];
            return (
            <div className="max-w-6xl">
              {/* Hero Banner */}
              {shop && (
                <div className="relative rounded-[2rem] overflow-hidden mb-10 group">
                  <img src={shop.img} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt={shop.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <button onClick={() => { setSelectedShopId(null); setView('student-dash'); }} className="text-xs font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors mb-4 inline-flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                      Back to Outlets
                    </button>
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-black tracking-tight mb-1">{shop.name}</h2>
                        <p className="text-gray-400 font-bold text-sm">{shop.tagline}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          <span className="font-black text-sm">{shop.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="font-black text-sm">{shop.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-8">
                {/* Menu Items */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">
                      Menu <span className="text-orange-500 ml-2">{availableItems.length} items</span>
                    </h3>
                  </div>

                  {availableItems.length === 0 ? (
                    <div className="py-32 text-center">
                      <div className="text-6xl mb-6 animate-float">🍽️</div>
                      <p className="text-xl font-black uppercase tracking-widest text-gray-600">No items available</p>
                      <p className="text-gray-600 text-sm mt-2">Check back later for new dishes!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableItems.map((item, idx) => {
                        const cartItem = cart.find(c => c._id === item._id);
                        const emoji = foodEmojis[idx % foodEmojis.length];
                        return (
                          <div
                            key={item._id}
                            className="animate-fadeSlideUp group relative bg-[#141414] rounded-[1.5rem] border border-white/5 overflow-hidden transition-all duration-300 hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5"
                            style={{ animationDelay: `${idx * 80}ms` }}
                          >
                            <div className="flex items-center gap-6 p-6">
                              {/* Food Emoji Badge */}
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                {emoji}
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-black leading-tight group-hover:text-orange-400 transition-colors duration-300">{item.name}</h4>
                                {item.description && (
                                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                                )}
                                <div className="mt-2 flex items-center gap-3">
                                  <span className="text-lg font-black bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                                    ₹{item.price}
                                  </span>
                                </div>
                              </div>

                              {/* Add-to-Cart / Quantity Controls */}
                              <div className="flex-shrink-0">
                                {cartItem ? (
                                  <div className="flex items-center gap-2 animate-cartPop">
                                    <button
                                      onClick={() => decrementCart(item._id)}
                                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center font-black text-lg text-gray-300 hover:text-white"
                                    >
                                      −
                                    </button>
                                    <span className="w-8 text-center font-black text-lg">{cartItem.quantity}</span>
                                    <button
                                      onClick={() => addToCart(item)}
                                      className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 transition-all flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/25"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 transition-all flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 animate-pulseGlow"
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Bottom accent line that fills on hover */}
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/50 transition-all duration-500" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Cart Sidebar */}
                <div className="col-span-1">
                  <div className="sticky top-28 bg-[#141414]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/30">
                    {/* Cart Header */}
                    <div className="p-6 pb-4 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          </div>
                          <h3 className="text-lg font-black">Your Tray</h3>
                        </div>
                        {cart.length > 0 && (
                          <span className="bg-orange-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                            {cart.reduce((s, i) => s + i.quantity, 0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cart Body */}
                    <div className="p-6">
                      {cart.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-4xl mb-4 animate-float">🛒</div>
                          <p className="text-gray-600 font-bold text-sm">Your tray is empty</p>
                          <p className="text-gray-700 text-xs mt-1">Add items to get started</p>
                        </div>
                      ) : (
                        <div>
                          <div className="space-y-3 max-h-[40vh] overflow-y-auto cart-scroll pr-1">
                            {cart.map(item => (
                              <div key={item._id} className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all animate-cartPop">
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{item.name}</p>
                                  <p className="text-orange-500 font-black text-xs">₹{item.price * item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => decrementCart(item._id)}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center text-xs font-black text-gray-400"
                                  >
                                    −
                                  </button>
                                  <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all flex items-center justify-center text-xs font-black text-gray-400"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="w-7 h-7 rounded-lg opacity-0 group-hover/item:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all flex items-center justify-center"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-gray-400 font-bold text-sm">Total</span>
                              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                                ₹{cartTotal}
                              </span>
                            </div>
                            <button
                              onClick={handlePlaceOrder}
                              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              🚀 Place Order
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })()}

          {/* ===== STUDENT ORDER HISTORY ===== */}
          {user.role === 'student' && view === 'history' && (
            <div className="max-w-4xl space-y-6">
              {orders.length === 0 ? (
                <div className="py-32 text-center opacity-20">
                  <p className="text-xl font-black uppercase tracking-widest">No orders yet</p>
                  <p className="text-sm text-gray-500 mt-2">Your order history will appear here.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block">
                          Order #{order._id.substring(order._id.length - 4)}
                        </span>
                        <span className="text-gray-500 text-xs font-bold">
                          {shopDetails[order.shopId]?.name || order.shopId} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <ul className="space-y-1 mb-4">
                      {order.items.map((i, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="font-bold">{i.quantity}x {i.name}</span>
                          <span className="text-gray-400">₹{i.price * i.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-lg font-black">₹{order.total}</span>
                      <div className="flex items-center gap-4">
                        {order.status === 'completed' && userReviews[order._id] && 
                          (Date.now() - new Date(userReviews[order._id].createdAt).getTime()) < 24 * 60 * 60 * 1000 && (
                            <button 
                              onClick={() => handleEditReview(order._id)}
                              className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors"
                            >
                              Edit Review
                            </button>
                          )
                        }
                        {order.status === 'completed' && (
                          <button 
                            onClick={() => {
                              setComplaintContext({ orderId: order._id, outletId: order.shopId });
                              setShowComplaintPopup(true);
                            }}
                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                          >
                            Support / Complaint
                          </button>
                        )}
                        {order.expectedPreparationTime && (
                          <span className="text-xs text-gray-400 font-bold">
                            ⏱ Est. {order.expectedPreparationTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== SHOP ORDERS VIEW (with Accept/Reject/Mark Ready) ===== */}
          {user.role === 'shop' && shopView === 'orders' && (
            <div className="max-w-6xl space-y-6">
              {orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length === 0 ? (
                <div className="py-32 text-center opacity-20"><p className="text-xl font-black uppercase tracking-widest">No active orders</p></div>
              ) : (
                orders.filter(o => !['completed', 'cancelled'].includes(o.status)).map(order => (
                  <div key={order._id} className={`bg-[#141414] p-8 rounded-[2rem] border border-white/5 ${['completed', 'cancelled'].includes(order.status) ? 'opacity-40' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 block">
                          Order #{order._id.substring(order._id.length - 4)} · {order.studentId}
                        </span>
                        <span className="text-gray-500 text-xs font-bold">
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <ul className="space-y-1 mb-4">
                      {order.items.map((i, idx) => <li key={idx} className="font-black text-xl">{i.quantity}x {i.name}</li>)}
                    </ul>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-lg font-black">₹{order.total}</span>

                      <div className="flex gap-3">
                        {/* PENDING → Accept or Reject */}
                        {order.status === 'pending' && acceptingOrderId !== order._id && (
                          <>
                            <button 
                              onClick={() => { setAcceptingOrderId(order._id); setPrepTime(''); }}
                              className="bg-green-500 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-green-400 transition-all"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleRejectOrder(order._id)}
                              className="bg-red-500/10 text-red-500 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* Accept form with prep time input */}
                        {order.status === 'pending' && acceptingOrderId === order._id && (
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" min="1" max="120" placeholder="Min"
                              value={prepTime}
                              onChange={(e) => setPrepTime(e.target.value)}
                              className="w-20 px-3 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-green-500 transition-all font-bold text-sm text-center"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleAcceptOrder(order._id)}
                              disabled={!prepTime || parseInt(prepTime) <= 0}
                              className="bg-green-500 px-5 py-3 rounded-xl font-black uppercase text-xs hover:bg-green-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setAcceptingOrderId(null)}
                              className="bg-white/5 px-4 py-3 rounded-xl font-black uppercase text-xs hover:bg-white/10 transition-all"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        {/* ACCEPTED / PREPARING → Mark Ready */}
                        {['accepted', 'preparing'].includes(order.status) && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'ready')}
                            className="bg-blue-500 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all"
                          >
                            Mark Ready
                          </button>
                        )}

                        {/* Show prep time if set */}
                        {order.expectedPreparationTime && !['completed', 'cancelled'].includes(order.status) && (
                          <span className="text-xs text-gray-400 font-bold self-center">⏱ {order.expectedPreparationTime} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== SHOP ORDER HISTORY (completed/cancelled from DB) ===== */}
          {user.role === 'shop' && shopView === 'history' && (
            <div className="max-w-4xl space-y-6">
              {orders.filter(o => ['completed', 'cancelled'].includes(o.status)).length === 0 ? (
                <div className="py-32 text-center opacity-20">
                  <p className="text-xl font-black uppercase tracking-widest">No order history yet</p>
                  <p className="text-sm text-gray-500 mt-2">Completed and cancelled orders will appear here.</p>
                </div>
              ) : (
                orders.filter(o => ['completed', 'cancelled'].includes(o.status)).map(order => (
                  <div key={order._id} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block">
                          Order #{order._id.substring(order._id.length - 4)} · {order.studentId}
                        </span>
                        <span className="text-gray-500 text-xs font-bold">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <ul className="space-y-1 mb-4">
                      {order.items.map((i, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="font-bold">{i.quantity}x {i.name}</span>
                          <span className="text-gray-400">₹{i.price * i.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-lg font-black">₹{order.total}</span>
                      {order.expectedPreparationTime && (
                        <span className="text-xs text-gray-400 font-bold">⏱ {order.expectedPreparationTime} min</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== SHOP MENU EDIT VIEW (with description + availability) ===== */}
          {user.role === 'shop' && shopView === 'menu' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black">Manage Menu</h3>
                <button 
                  onClick={() => setEditingItem({ name: '', price: '', description: '', isAvailable: true, isNew: true })}
                  className="bg-orange-500 px-6 py-3 rounded-xl font-black uppercase text-xs"
                >
                  + Add Item
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(menus[user.id] || []).map(item => (
                  <div key={item._id} className={`bg-[#141414] p-6 rounded-[1.5rem] border border-white/5 flex justify-between items-center group ${item.isAvailable === false ? 'opacity-50' : ''}`}>
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-3">
                        <p className="font-black text-lg">{item.name}</p>
                        {item.isAvailable === false && (
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-md">Unavailable</span>
                        )}
                      </div>
                      {item.description && <p className="text-gray-400 text-sm mt-0.5 truncate">{item.description}</p>}
                      <p className="text-orange-500 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditingItem({ ...item })} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><EditIcon /></button>
                      <button onClick={() => handleDeleteMenuItem(item._id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== SHOP REVIEWS VIEW ===== */}
          {user.role === 'shop' && shopView === 'reviews' && (
            <div className="max-w-4xl space-y-6">
              {shopReviews.length === 0 ? (
                <div className="py-32 text-center opacity-20">
                  <p className="text-xl font-black uppercase tracking-widest">No reviews yet</p>
                  <p className="text-sm text-gray-500 mt-2">Customer reviews will appear here after deliveries.</p>
                </div>
              ) : (
                <>
                  {/* Stats Summary */}
                  <div className="bg-[#141414] p-8 rounded-[2rem] border border-white/5 mb-2">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-5xl font-black text-yellow-400">
                          {(shopReviews.reduce((s, r) => s + r.rating, 0) / shopReviews.length).toFixed(1)}
                        </p>
                        <div className="flex justify-center mt-2">
                          {[1,2,3,4,5].map(s => (
                            <StarIcon key={s} filled={s <= Math.round(shopReviews.reduce((a, r) => a + r.rating, 0) / shopReviews.length)} size="w-5 h-5" />
                          ))}
                        </div>
                        <p className="text-gray-500 text-xs font-bold mt-2">{shopReviews.length} review{shopReviews.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        {[5,4,3,2,1].map(star => {
                          const count = shopReviews.filter(r => r.rating === star).length;
                          const pct = shopReviews.length > 0 ? (count / shopReviews.length * 100) : 0;
                          return (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-xs font-bold text-gray-400 w-3">{star}</span>
                              <StarIcon filled size="w-3.5 h-3.5" />
                              <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                                <div className="bg-yellow-400 h-full rounded-full transition-all duration-500" style={{width: `${pct}%`}} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 w-8 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Respond to customer feedback to improve trust</p>

                  {/* Individual Reviews */}
                  {shopReviews.map(review => (
                    <div key={review._id} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">{review.studentId}</span>
                          <div className="flex items-center gap-1 mt-1">
                            {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= review.rating} size="w-4 h-4" />)}
                          </div>
                        </div>
                        <span className="text-gray-500 text-xs font-bold">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {review.comment && <p className="text-gray-300 text-sm mb-3 leading-relaxed">{review.comment}</p>}

                      {review.issues && review.issues.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {review.issues.map(issue => (
                            <span key={issue} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{issue}</span>
                          ))}
                        </div>
                      )}

                      {/* Shop Reply */}
                      {review.shopReply ? (
                        <div className="mt-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Your Reply</p>
                          <p className="text-gray-300 text-sm">{review.shopReply}</p>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {replyingReviewId === review._id ? (
                            <div className="space-y-3">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                rows="2"
                                className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold text-sm resize-none"
                                autoFocus
                              />
                              <div className="flex gap-3">
                                <button onClick={() => handleShopReply(review._id)} className="bg-orange-500 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-400 transition-all">Send Reply</button>
                                <button onClick={() => { setReplyingReviewId(null); setReplyText(''); }} className="bg-white/5 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setReplyingReviewId(review._id); setReplyText(''); }}
                              className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors"
                            >
                              Reply to this review →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ===== COMPLAINTS & SUPPORT VIEW (Student & Shop) ===== */}
          {((user.role === 'student' && view === 'support') || (user.role === 'shop' && shopView === 'support')) && (
            <div className="max-w-4xl space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tighter">Support & Complaints</h2>
                <p className="text-gray-500 font-bold mt-1 text-sm">
                  {user.role === 'student' ? 'Track your active complaints and view resolutions.' : 'Manage customer issues and provide support.'}
                </p>
              </div>

              {supportComplaints.length === 0 ? (
                <div className="py-32 text-center opacity-20">
                  <div className="text-6xl mb-4 animate-float">🛡️</div>
                  <p className="text-xl font-black uppercase tracking-widest">No complaints</p>
                  <p className="text-sm text-gray-500 mt-2">Everything is running smoothly.</p>
                </div>
              ) : (
                supportComplaints.map(complaint => (
                  <div key={complaint._id} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-orange-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">
                          Issue type: {complaint.complaint_type}
                        </span>
                        <span className="text-gray-500 text-xs font-bold block mb-1">
                          Order: {typeof complaint.order_id === 'object' ? complaint.order_id?._id?.substring(complaint.order_id._id.length - 4) : complaint.order_id?.substring ? complaint.order_id.substring(complaint.order_id.length - 4) : complaint.order_id}
                        </span>
                        <span className="text-gray-500 text-[10px] font-bold">
                          {new Date(complaint.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {user.role === 'shop' && ` · By ${complaint.user_id}`}
                        </span>
                      </div>
                      <StatusBadge status={complaint.status.toLowerCase()} />
                    </div>

                    <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 mb-4 relative z-10">
                      <p className="text-gray-300 text-sm font-bold leading-relaxed">
                        "{complaint.description}"
                      </p>
                    </div>

                    {user.role === 'shop' && complaint.status === 'Pending' && (
                      <div className="flex gap-3 relative z-10">
                         <button 
                           onClick={async () => {
                             const token = localStorage.getItem('token');
                             await fetch(`/api/complaints/${complaint._id}/status`, {
                               method: 'PUT',
                               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                               body: JSON.stringify({ status: 'Resolved' })
                             });
                             fetchComplaints();
                           }}
                           className="bg-green-500/10 text-green-500 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                         >
                           Mark Resolved
                         </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* ===== ITEM EDIT MODAL (with description + availability toggle) ===== */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <form onSubmit={handleUpdateMenuItem} className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm space-y-6">
            <h3 className="text-2xl font-black tracking-tight">{editingItem.isNew ? 'New Item' : 'Edit Item'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Item Name</label>
                <input 
                  autoFocus required type="text" 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows="2"
                  className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold resize-none" 
                  placeholder="Optional description..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                <input 
                  required type="number" 
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                  className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available</label>
                <button 
                  type="button"
                  onClick={() => setEditingItem({...editingItem, isAvailable: !editingItem.isAvailable})}
                  className={`w-12 h-7 rounded-full transition-all duration-300 relative ${editingItem.isAvailable !== false ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${editingItem.isAvailable !== false ? 'left-6' : 'left-1'}`}></span>
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-black uppercase text-[10px]">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 py-4 rounded-xl font-black uppercase text-[10px] shadow-lg shadow-orange-500/20">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Order Progress Overlays (Students Only) */}
      {activeOrder && ['pending', 'placed', 'accepted', 'preparing'].includes(activeOrder.status) && (
        <div className="fixed bottom-6 right-6 bg-[#141414] p-8 rounded-[2.5rem] border border-white/10 w-80 shadow-2xl shadow-black/50 z-[100] transform transition-all hover:scale-105">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-orange-500/40 rounded-full flex items-center justify-center text-2xl">👨‍🍳</div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight mb-1">
              {activeOrder.status === 'pending' ? 'Waiting for Shop' : 'Preparing Order'}
            </h2>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-4">Order #{activeOrder._id.substring(activeOrder._id.length - 4)}</p>
            {activeOrder.expectedPreparationTime && (
              <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 mb-4">
                <p className="text-orange-500 font-black text-sm">⏱ Ready in ~{activeOrder.expectedPreparationTime} min</p>
              </div>
            )}
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                The kitchen is busy at <span className="text-white">{shopDetails[activeOrder.shopId]?.name}</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Cancelled Overlay */}
      {activeOrder && activeOrder.status === 'cancelled' && (
        <div className="fixed bottom-6 right-6 bg-[#141414] p-8 rounded-[2.5rem] border border-red-500/20 w-80 shadow-2xl shadow-black/50 z-[100]">
          <div className="text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-black tracking-tight mb-1">Order Cancelled</h2>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-6">Order #{activeOrder._id.substring(activeOrder._id.length - 4)}</p>
            <button onClick={() => { setCurrentOrderProgressId(null); setView('student-dash'); }} className="w-full bg-white/5 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {activeOrder && activeOrder.status === 'ready' && (
        <div className="fixed bottom-6 right-6 bg-white text-black p-8 rounded-[2.5rem] w-80 shadow-2xl shadow-green-500/20 z-[100] animate-bounce">
          <div className="text-center">
            <div className="text-5xl mb-4">🥡</div>
            <h2 className="text-3xl font-black tracking-tighter mb-1">Order Ready!</h2>
            <p className="text-gray-600 font-bold text-xs mb-8 leading-relaxed">
              Head to <span className="text-green-600">{shopDetails[activeOrder.shopId]?.name}</span> for pickup.
            </p>
            <button onClick={handleOrderDone} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-gray-900 transition-all">
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ===== REVIEW POPUP MODAL ===== */}
      {showReviewPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
            
            <div className="p-10">
              {/* Step: Rate */}
              {reviewStep === 'rate' && (
                <div className="text-center">
                  <div className="text-5xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">
                    How was your order{orders.find(o => o._id === reviewOrderId)?.shopId ? ` from ${shopDetails[orders.find(o => o._id === reviewOrderId)?.shopId]?.name || orders.find(o => o._id === reviewOrderId)?.shopId}` : ''}?
                  </h3>
                  <p className="text-gray-500 text-sm font-bold mb-8">Your feedback helps improve our service</p>
                  
                  {/* Star Selector */}
                  <div className="flex justify-center gap-2 mb-8">
                    {[1,2,3,4,5].map(star => (
                      <StarIcon
                        key={star}
                        filled={star <= (reviewHoverRating || reviewRating)}
                        size="w-12 h-12"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                      />
                    ))}
                  </div>
                  {reviewRating > 0 && (
                    <p className="text-yellow-400 font-black text-sm mb-6 animate-pulse">
                      {reviewRating === 5 ? '🤩 Outstanding!' : reviewRating === 4 ? '😊 Great!' : reviewRating === 3 ? '😐 Okay' : reviewRating === 2 ? '😕 Not great' : '😞 Poor'}
                    </p>
                  )}

                  {/* Comment */}
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us about your experience (optional)"
                    rows="3"
                    className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold text-sm resize-none mb-6"
                  />

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={closeReviewPopup}
                      className="flex-1 bg-white/5 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                      Skip
                    </button>
                    <button
                      onClick={userReviews[reviewOrderId] ? handleUpdateReview : handleSubmitReview}
                      disabled={reviewRating === 0 || reviewSubmitting}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:from-yellow-400 hover:to-orange-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                    >
                      {reviewSubmitting ? 'Saving...' : userReviews[reviewOrderId] ? 'Update Review' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Good follow-up (≥ 4 stars) */}
              {reviewStep === 'followup-good' && (
                <div className="text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Glad you liked it!</h3>
                  <p className="text-gray-400 font-bold text-sm mb-8">Want to add this to your favorites?</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setReviewStep('done')}
                      className="flex-1 bg-white/5 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                      Maybe Later
                    </button>
                    <button
                      onClick={handleSaveFavorite}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:from-pink-400 hover:to-red-400 transition-all shadow-lg shadow-red-500/20"
                    >
                      ❤️ Add to Favorites
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Bad follow-up (≤ 2 stars) */}
              {reviewStep === 'followup-bad' && (
                <div className="text-center">
                  <div className="text-5xl mb-4">😔</div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">We're sorry</h3>
                  <p className="text-gray-400 font-bold text-sm mb-6">What went wrong?</p>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {['Food quality', 'Late delivery', 'Wrong order', 'Packaging issue'].map(issue => (
                      <button
                        key={issue}
                        onClick={() => toggleIssue(issue)}
                        className={`py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                          reviewIssues.includes(issue)
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {issue}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={async () => {
                      // Update the review with selected issues
                      if (reviewIssues.length > 0) {
                        try {
                          const token = localStorage.getItem('token');
                          const reviewRes = await fetch(`/api/reviews/order/${reviewOrderId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (reviewRes.ok) {
                            const existingReview = await reviewRes.json();
                            if (existingReview) {
                              await fetch(`/api/reviews/${existingReview._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ issues: reviewIssues })
                              });
                            }
                          }
                        } catch (err) {
                          console.error('Issue update error:', err);
                        }
                      }
                      setReviewStep('done');
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}

              {/* Step: Done */}
              {reviewStep === 'done' && (
                <div className="text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Thanks for your feedback!</h3>
                  <p className="text-gray-500 font-bold text-sm mb-8">Your review helps us improve</p>
                  <button
                    onClick={closeReviewPopup}
                    className="w-full bg-orange-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== COMPLAINT SUBMISSION MODAL ===== */}
      {showComplaintPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden relative">
            <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
            <form onSubmit={handleComplaintSubmit} className="p-10 space-y-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4 animate-float">🚩</div>
                <h3 className="text-2xl font-black tracking-tight mb-2">Raise Support Ticket</h3>
                <p className="text-gray-500 text-sm font-bold">We're here to help resolve your issue.</p>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Issue Category</label>
                <div className="relative">
                  <select 
                    value={complaintForm.type}
                    onChange={(e) => setComplaintForm({...complaintForm, type: e.target.value})}
                    className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-red-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                  >
                    <option value="Late delivery">Late delivery</option>
                    <option value="Wrong order">Wrong order</option>
                    <option value="Poor food quality">Poor food quality</option>
                    <option value="Payment issue">Payment issue</option>
                    <option value="App/technical issue">App/technical issue</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Detailed Description</label>
                <textarea 
                  required
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl outline-none focus:border-red-500 transition-all font-bold text-sm resize-none" 
                  placeholder="Please describe exactly what went wrong..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowComplaintPopup(false)} 
                  className="flex-1 bg-white/5 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20 hover:from-red-500 hover:to-orange-400 transition-all"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}