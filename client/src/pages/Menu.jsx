const Menu = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Menu</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Explore our wide selection of delicious meals.
      </p>
      
      <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Menu Items Loading...</h2>
        <p style={{ color: 'var(--text-muted)' }}>The full menu component will fetch items from the backend API.</p>
      </div>
    </div>
  );
};

export default Menu;
