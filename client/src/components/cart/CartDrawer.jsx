import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { 
    items, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    subtotal, 
    deliveryFee, 
    tax, 
    total 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1050
        }}
        onClick={toggleCart}
      />
      <div 
        className="glass-card"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: '400px',
          zIndex: 1100, borderRight: 'none', borderTop: 'none', borderBottom: 'none',
          borderRadius: '0', display: 'flex', flexDirection: 'column',
          background: 'var(--bg-secondary)',
          animation: 'slideInRight 0.3s ease forwards'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Your Cart</h2>
          <button onClick={toggleCart} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
              <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>Your cart is empty.</p>
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={toggleCart}>Browse Menu</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                    <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', padding: '0.25rem' }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ padding: '0.25rem' }}><Minus size={14} /></button>
                    <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ padding: '0.25rem' }}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeItem(item._id)} style={{ color: 'var(--error)', padding: '0.5rem' }}><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              <span>Delivery Fee</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%' }} onClick={toggleCart}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </>
  );
};

export default CartDrawer;
