import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Check, CreditCard, MapPin, Package } from 'lucide-react';

const CheckoutSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3); // Confirmation
      clearCart();
    }, 2000);
  };

  if (items.length === 0 && currentStep !== 3) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Package size={64} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add some items before checking out.</p>
        <button className="btn btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Progress Tracker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'var(--glass-border)', zIndex: 0 }}>
          <div style={{ 
            height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease',
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' 
          }}></div>
        </div>

        {[
          { step: 1, label: 'Address', icon: <MapPin size={16} /> },
          { step: 2, label: 'Payment', icon: <CreditCard size={16} /> },
          { step: 3, label: 'Confirm', icon: <Check size={16} /> }
        ].map(s => (
          <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: currentStep >= s.step ? 'var(--accent)' : 'var(--bg-elevated)',
              color: currentStep >= s.step ? 'white' : 'var(--text-secondary)',
              border: currentStep >= s.step ? 'none' : '2px solid var(--glass-border)',
              transition: 'all 0.3s ease'
            }}>
              {s.icon}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: currentStep >= s.step ? '600' : '400', color: currentStep >= s.step ? 'white' : 'var(--text-secondary)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: currentStep === 3 ? '1fr' : '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Forms */}
        {currentStep !== 3 && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            {currentStep === 1 && (
              <form onSubmit={handleAddressSubmit}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Delivery Address</h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Street Address</label>
                  <input required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} style={inputStyle} type="text" placeholder="123 Main St" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>City</label>
                    <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={inputStyle} type="text" placeholder="New York" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>State</label>
                    <input required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} style={inputStyle} type="text" placeholder="NY" />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>ZIP Code</label>
                  <input required value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} style={inputStyle} type="text" placeholder="10001" />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Continue to Payment</button>
              </form>
            )}

            {currentStep === 2 && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Payment Method</h2>
                
                <div 
                  onClick={() => setPaymentMethod('card')}
                  style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'card' ? 'var(--accent)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-md)', marginBottom: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <input type="radio" checked={paymentMethod === 'card'} readOnly />
                  <CreditCard size={20} />
                  <span>Credit / Debit Card</span>
                </div>

                {paymentMethod === 'card' && (
                  <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <input style={inputStyle} type="text" placeholder="Card Number (mock)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <input style={inputStyle} type="text" placeholder="MM/YY" />
                      <input style={inputStyle} type="text" placeholder="CVC" />
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => setPaymentMethod('cash')}
                  style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'cash' ? 'var(--accent)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-md)', marginBottom: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <input type="radio" checked={paymentMethod === 'cash'} readOnly />
                  <Package size={20} />
                  <span>Cash on Delivery</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCurrentStep(1)}>Back</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Order Summary */}
        {currentStep !== 3 && (
          <div className="glass-card" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Delivery Fee</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div className="glass-card animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', animation: 'scaleIn 0.5s ease' }}>
              <Check size={40} color="white" />
            </div>
            <h1 style={{ marginBottom: '1rem' }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Your delicious food is being prepared. It will be delivered to <br/>
              <strong>{address.street}, {address.city}</strong> in approximately 30 minutes.
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>ORDER NUMBER</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>#QB-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div>
              <button className="btn btn-primary" onClick={() => navigate('/orders')}>Track Order</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Reusable styling for inputs
const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'var(--bg-primary)',
  border: '1px solid var(--glass-border)',
  borderRadius: 'var(--radius-md)',
  color: 'white',
  outline: 'none',
  fontFamily: 'inherit'
};

export default CheckoutSteps;
