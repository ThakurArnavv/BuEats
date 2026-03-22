import React, { useState, useEffect } from 'react';

const shopDetails = {
  snapeats: { id: 'snapeats', name: 'Snapeats', tagline: 'Snack it, Snap it.', rating: '4.5', time: '10-15 min', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80' },
  houseofchow: { id: 'houseofchow', name: 'House of Chow', tagline: 'Authentic Asian bowls.', rating: '4.8', time: '20 min', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
  kaathi: { id: 'kaathi', name: 'Kaathi', tagline: 'Roll into happiness.', rating: '4.2', time: '15 min', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80' },
  tuckshop: { id: 'tuckshop', name: 'Tuck Shop', tagline: 'Your daily cravings.', rating: '4.0', time: '5-10 min', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' }
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
const Sidebar = ({ onSelectDashboard, onSelectShop, onSelectHistory, activeView, activeShopId, onLogout }) => (
  <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B1221] border-r border-white/5 flex flex-col z-50">
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

  // --- REAL-TIME ORDER POLLING ---
  useEffect(() => {
    let intervalId;
    if (view !== 'login' && user.id) {
      const fetchOrders = async () => {
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
            }
          }
        } catch (err) {
          console.error("Failed to poll orders", err);
        }
      };

      fetchOrders();
      intervalId = setInterval(fetchOrders, 3000);
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
    if (currentOrderProgressId) {
      updateOrderStatus(currentOrderProgressId, 'completed');
    }
    setCurrentOrderProgressId(null);
    setSelectedShopId(null);
    setView('student-dash');
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
      return 'Menu Management';
    }
    if (view === 'student-dash') return 'Food Outlets';
    if (view === 'history') return 'Order History';
    return shopDetails[selectedShopId]?.name || 'Menu';
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090E17] p-4 text-white">
        <div className="max-w-md w-full bg-[#111727] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
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
                  className="w-full px-6 py-4 bg-[#090E17] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
                  placeholder={user.role === 'shop' ? "snapeats" : "2110XXXX"} 
                  required 
               />
            </div>
            <input 
              type="password" 
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-6 py-4 bg-[#090E17] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
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
    <div className="min-h-screen bg-[#090E17] text-white flex">
      {/* Sidebar - Student */}
      {user.role === 'student' && (
        <Sidebar 
          activeView={view} 
          activeShopId={selectedShopId}
          onSelectDashboard={() => { setView('student-dash'); setSelectedShopId(null); }}
          onSelectShop={(id) => navigateToShop(id)}
          onSelectHistory={() => { setView('history'); setSelectedShopId(null); }}
          onLogout={handleLogout}
        />
      )}

      {/* Sidebar - Shop */}
      {user.role === 'shop' && (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B1221] border-r border-white/5 flex flex-col z-50">
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
          </nav>
          <div className="p-6 border-t border-white/5">
            <button onClick={handleLogout} className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest">Sign Out</button>
          </div>
        </aside>
      )}

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="px-10 py-6 flex justify-between items-center sticky top-0 bg-[#090E17]/80 backdrop-blur-xl z-40">
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
                  <div key={shop.id} onClick={() => navigateToShop(shop.id)} className="group relative bg-[#111727] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 transition-all hover:scale-[1.01]">
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
          {user.role === 'student' && view === 'menu' && (
            <div className="max-w-6xl grid grid-cols-3 gap-10">
              <div className="col-span-2 space-y-4">
                <button onClick={() => { setSelectedShopId(null); setView('student-dash'); }} className="text-xs font-black uppercase tracking-widest text-orange-500 mb-4 block">← Back to Outlets</button>
                {menus[selectedShopId]?.filter(item => item.isAvailable !== false).map(item => (
                  <div key={item._id} className="bg-[#111727] p-8 rounded-[2rem] border border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-black">{item.name}</h4>
                      {item.description && <p className="text-gray-400 text-sm mt-1">{item.description}</p>}
                      <p className="text-orange-500 font-black mt-1">₹{item.price}</p>
                    </div>
                    <button onClick={() => addToCart(item)} className="w-12 h-12 bg-orange-500 rounded-xl font-black text-2xl flex-shrink-0">+</button>
                  </div>
                ))}
                {menus[selectedShopId]?.filter(item => item.isAvailable !== false).length === 0 && (
                  <div className="py-20 text-center opacity-30">
                    <p className="text-xl font-black uppercase tracking-widest">No items available</p>
                  </div>
                )}
              </div>
              <div className="col-span-1 bg-[#111727] p-8 rounded-[2rem] h-fit sticky top-32">
                <h3 className="text-xl font-black mb-6">Your Tray</h3>
                {cart.length === 0 ? <p className="opacity-30 text-center py-10">Tray Empty</p> : (
                  <div className="space-y-4">
                    {cart.map(item => <div key={item._id} className="flex justify-between font-bold"><span>{item.quantity}x {item.name}</span><span>₹{item.price * item.quantity}</span></div>)}
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex justify-between text-2xl font-black mb-6"><span>Total</span><span>₹{cartTotal}</span></div>
                      <button onClick={handlePlaceOrder} className="w-full bg-orange-500 py-4 rounded-xl font-black uppercase text-xs">Checkout</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
                  <div key={order._id} className="bg-[#111727] p-8 rounded-[2rem] border border-white/5">
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
                      {order.expectedPreparationTime && (
                        <span className="text-xs text-gray-400 font-bold">
                          ⏱ Est. {order.expectedPreparationTime} min
                        </span>
                      )}
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
                  <div key={order._id} className={`bg-[#111727] p-8 rounded-[2rem] border border-white/5 ${['completed', 'cancelled'].includes(order.status) ? 'opacity-40' : ''}`}>
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
                              className="w-20 px-3 py-3 bg-[#090E17] border border-white/10 rounded-xl outline-none focus:border-green-500 transition-all font-bold text-sm text-center"
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
                  <div key={order._id} className="bg-[#111727] p-8 rounded-[2rem] border border-white/5">
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
                  <div key={item._id} className={`bg-[#111727] p-6 rounded-[1.5rem] border border-white/5 flex justify-between items-center group ${item.isAvailable === false ? 'opacity-50' : ''}`}>
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
        </div>
      </main>

      {/* ===== ITEM EDIT MODAL (with description + availability toggle) ===== */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <form onSubmit={handleUpdateMenuItem} className="bg-[#111727] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm space-y-6">
            <h3 className="text-2xl font-black tracking-tight">{editingItem.isNew ? 'New Item' : 'Edit Item'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Item Name</label>
                <input 
                  autoFocus required type="text" 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-6 py-4 bg-[#090E17] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows="2"
                  className="w-full px-6 py-4 bg-[#090E17] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold resize-none" 
                  placeholder="Optional description..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                <input 
                  required type="number" 
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                  className="w-full px-6 py-4 bg-[#090E17] border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all font-bold" 
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
        <div className="fixed bottom-6 right-6 bg-[#111727] p-8 rounded-[2.5rem] border border-white/10 w-80 shadow-2xl shadow-black/50 z-[100] transform transition-all hover:scale-105">
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
        <div className="fixed bottom-6 right-6 bg-[#111727] p-8 rounded-[2.5rem] border border-red-500/20 w-80 shadow-2xl shadow-black/50 z-[100]">
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
    </div>
  );
}