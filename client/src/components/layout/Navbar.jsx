import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, toggleCart } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo text-gradient">QuickBite</Link>
      
      {/* Desktop Nav */}
      <div className="nav-links hidden-mobile">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
        {user && <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>}
        {user?.role === 'admin' && <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link>}
      </div>

      <div className="nav-actions">
        <button className="btn btn-ghost" style={{ position: 'relative' }} onClick={toggleCart}>
          <ShoppingCart size={24} color="var(--text-primary)" />
          {itemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>{itemCount}</span>
          )}
        </button>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="hidden-mobile">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--error)' }} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary hidden-mobile">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
