import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Loading from './components/Loading';

// Pages
import Welcome from './welcome/pages/Welcome/Welcome';
import Login from './welcome/pages/Login/Login';
import User from './user/pages/User/User';
import Admin from './admin/pages/Admin/Admin';
import Checkout from './welcome/pages/Checkout/Checkout';
import Verify from './welcome/pages/Verify/Verify';

import { useLocation } from 'react-router-dom';

const AppLayout = () => {
  const location = useLocation();
  const isAdminOrUser = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

  return (
    <div className={isAdminOrUser ? "" : "app-frame"}>
      {!isAdminOrUser && <Navbar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: isAdminOrUser ? '100vh' : 'auto' }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/*" element={<User />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time to show off the new loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
