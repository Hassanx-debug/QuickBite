import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              Delicious Food,<br />
              <span className="text-gradient">Delivered Fast</span>
            </h1>
            <p className="hero-subtitle">
              Get your favorite meals from the best local restaurants delivered right to your door in under 30 minutes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Link to="/menu" className="btn btn-primary">
                Order Now <ArrowRight size={20} />
              </Link>
              <Link to="/menu" className="btn btn-outline">
                View Menu
              </Link>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>30+</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Restaurants</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>500+</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Dishes</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>30min</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Delivery</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, rgba(10,10,10,0) 70%)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
      </section>

      {/* Featured Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Popular Right Now</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Our most ordered dishes this week</p>
            </div>
            <Link to="/menu" className="btn btn-outline">See All</Link>
          </div>
          
          <div className="menu-grid">
            {/* Mock Card 1 */}
            <div className="glass-card glass-card-hover animate-fade-in stagger-1">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" alt="Burger" className="menu-card-img" />
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-card-title">Truffle Burger</h3>
                  <span className="menu-card-price">$14.99</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Juicy beef patty with wild mushrooms and truffle aioli.
                </p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} color="var(--warning)" fill="var(--warning)" /> 4.8</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 15 min</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Add to Cart</button>
              </div>
            </div>

            {/* Mock Card 2 */}
            <div className="glass-card glass-card-hover animate-fade-in stagger-2">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" alt="Pizza" className="menu-card-img" />
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-card-title">Margherita Pizza</h3>
                  <span className="menu-card-price">$16.99</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Classic Neapolitan with fresh mozzarella and basil.
                </p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} color="var(--warning)" fill="var(--warning)" /> 4.7</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 20 min</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Add to Cart</button>
              </div>
            </div>
            
            {/* Mock Card 3 */}
            <div className="glass-card glass-card-hover animate-fade-in stagger-3">
              <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" alt="Sushi" className="menu-card-img" />
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-card-title">Spicy Tuna Roll</h3>
                  <span className="menu-card-price">$12.99</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Fresh yellowfin tuna with spicy mayo and nori.
                </p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} color="var(--warning)" fill="var(--warning)" /> 4.9</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 10 min</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
