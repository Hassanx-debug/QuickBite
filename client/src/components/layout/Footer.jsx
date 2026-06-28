import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="logo text-gradient" style={{ marginBottom: '1rem' }}>QuickBite</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '300px' }}>
              Premium food delivery serving the best local restaurants straight to your door. Fast, fresh, and delicious.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Facebook size={20} /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Instagram size={20} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/menu">Our Menu</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Legal</h4>
            <div className="footer-links">
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-links">
              <span style={{ color: 'var(--text-secondary)' }}>support@quickbite.com</span>
              <span style={{ color: 'var(--text-secondary)' }}>1-800-QUICK-BITE</span>
              <span style={{ color: 'var(--text-secondary)' }}>123 Food Street, NY 10001</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} QuickBite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
