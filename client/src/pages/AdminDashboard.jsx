import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Users, DollarSign, Package, Settings, Plus, Trash2, Edit } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const mockMenu = [
  { _id: '1', name: 'Truffle Mushroom Burger', price: 14.99, category: 'burgers', isAvailable: true },
  { _id: '2', name: 'Margherita Classica Pizza', price: 16.99, category: 'pizza', isAvailable: true },
  { _id: '3', name: 'Spicy Tuna Roll', price: 12.99, category: 'sushi', isAvailable: false },
];

const mockOrders = [
  { _id: 'QB-123456', date: new Date().toISOString(), status: 'preparing', total: 35.98, user: 'John Doe' },
  { _id: 'QB-789012', date: new Date().toISOString(), status: 'delivered', total: 12.50, user: 'Jane Smith' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Basic role protection (real app would check via ProtectedRoute component)
  if (!user || user.role !== 'admin') {
    // If not admin, we would normally redirect, but for demo let's let them see the UI if they click it directly.
    // In a real app: return <Navigate to="/" />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name || 'Admin'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
        <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('menu')}>Menu Management</button>
        <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('orders')}>Orders</button>
      </div>

      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <StatCard icon={<DollarSign size={24} color="#16a34a" />} title="Total Revenue" value="$12,450" trend="+15%" />
            <StatCard icon={<Package size={24} color="var(--accent)" />} title="Total Orders" value="1,245" trend="+8%" />
            <StatCard icon={<Users size={24} color="#3b82f6" />} title="Active Users" value="842" trend="+12%" />
            <StatCard icon={<TrendingUp size={24} color="#a855f7" />} title="Avg Order Value" value="$28.50" trend="+2%" />
          </div>
          
          <h2 style={{ marginBottom: '1.5rem' }}>Recent Orders</h2>
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem' }}>{order._id}</td>
                    <td style={{ padding: '1rem' }}>{order.user}</td>
                    <td style={{ padding: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: order.status === 'delivered' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                        color: order.status === 'delivered' ? '#16a34a' : 'var(--warning)', 
                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' 
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>Menu Items</h2>
            <button className="btn btn-primary"><Plus size={18} /> Add New Item</button>
          </div>
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockMenu.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item.category}</td>
                    <td style={{ padding: '1rem' }}>${item.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      {item.isAvailable ? (
                        <span style={{ color: '#16a34a', fontSize: '0.85rem' }}>Available</span>
                      ) : (
                        <span style={{ color: 'var(--error)', fontSize: '0.85rem' }}>Sold Out</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit size={18} /></button>
                      <button style={{ color: 'var(--error)' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="animate-fade-in text-center" style={{ padding: '4rem 0' }}>
          <Settings size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
          <h3>Order Management Panel</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Full order management logic would go here.</p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, trend }) => (
  <div className="glass-card" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold', background: 'rgba(22, 163, 74, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
        {trend}
      </span>
    </div>
    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: 'normal' }}>{title}</h4>
    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

export default AdminDashboard;
