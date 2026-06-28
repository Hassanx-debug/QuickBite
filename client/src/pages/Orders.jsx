import { Package, MapPin, Clock } from 'lucide-react';

const mockOrders = [
  {
    _id: 'QB-123456',
    date: new Date().toISOString(),
    status: 'preparing',
    total: 35.98,
    items: [
      { name: 'Truffle Mushroom Burger', quantity: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' }
    ]
  }
];

const Orders = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Your Orders</h1>
      
      {mockOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          <Package size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No orders yet</h3>
          <p>When you place an order, it will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mockOrders.map(order => (
            <div key={order._id} className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Order #{order._id}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.25rem' }}>${order.total.toFixed(2)}</div>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' 
                  }}>
                    <Clock size={12} /> {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
