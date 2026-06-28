import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount, toggleCart } = useCart();

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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo text-gradient">QuickBite</Link>
      
      {/* Desktop Nav */}
      <div className="nav-links hidden-mobile">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
        <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
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
        <Link to="/login" className="btn btn-primary hidden-mobile">Sign In</Link>
      </div>
    </nav>
  );
};

export default Navbar;
