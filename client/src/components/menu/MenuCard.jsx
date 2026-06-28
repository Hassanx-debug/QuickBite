import { Star, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MenuCard = ({ item }) => {
  const { addItem, items } = useCart();
  
  // Check if item is already in cart
  const cartItem = items.find(i => i._id === item._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="glass-card glass-card-hover animate-fade-in">
      <div style={{ position: 'relative' }}>
        <img 
          src={item.image} 
          alt={item.name} 
          className="menu-card-img" 
        />
        {item.isVeg && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'white', padding: '2px 6px', borderRadius: '4px',
            fontSize: '0.75rem', fontWeight: 'bold', color: '#16a34a',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', display: 'inline-block' }}></span>
            VEG
          </span>
        )}
      </div>
      
      <div className="menu-card-content">
        <div className="menu-card-header">
          <h3 className="menu-card-title">{item.name}</h3>
          <span className="menu-card-price">${item.price.toFixed(2)}</span>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={14} color="var(--warning)" fill="var(--warning)" /> {item.rating} ({item.reviewCount})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} /> {item.prepTime} min
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {item.tags?.map(tag => (
            <span key={tag} style={{ 
              background: 'var(--bg-elevated)', fontSize: '0.7rem', 
              padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase',
              color: 'var(--text-secondary)'
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          {quantityInCart > 0 ? (
            <button 
              className="btn btn-outline" 
              style={{ width: '100%', borderColor: 'var(--success)', color: 'var(--success)' }}
              onClick={() => addItem(item)}
            >
              Add Another ({quantityInCart} in cart)
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => addItem(item)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
