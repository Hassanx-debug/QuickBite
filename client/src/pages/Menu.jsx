import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import MenuCard from '../components/menu/MenuCard';

// Fallback data in case backend isn't running yet
const fallbackData = [
  { _id: '1', name: 'Truffle Mushroom Burger', description: 'Juicy beef patty topped with sautéed wild mushrooms, Swiss cheese, and truffle aioli on a brioche bun.', price: 14.99, category: 'burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', rating: 4.8, reviewCount: 124, prepTime: 15, isVeg: false, tags: ['bestseller', 'popular'] },
  { _id: '2', name: 'Margherita Classica Pizza', description: 'Traditional Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil.', price: 16.99, category: 'pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 89, prepTime: 20, isVeg: true, tags: ['bestseller'] },
  { _id: '3', name: 'Spicy Tuna Roll', description: 'Fresh yellowfin tuna mixed with spicy mayo, wrapped in sushi rice and nori.', price: 12.99, category: 'sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', rating: 4.9, reviewCount: 215, prepTime: 10, isVeg: false, tags: ['spicy', 'popular'] },
  { _id: '4', name: 'Caesar Salad', description: 'Crisp romaine lettuce, parmesan cheese, croutons, and classic Caesar dressing.', price: 9.99, category: 'salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 65, prepTime: 5, isVeg: true, tags: ['healthy'] },
  { _id: '5', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten chocolate center, served with vanilla bean ice cream.', price: 8.99, category: 'desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop', rating: 4.9, reviewCount: 310, prepTime: 12, isVeg: true, tags: ['bestseller', 'new'] },
  { _id: '6', name: 'Iced Matcha Latte', description: 'Premium ceremonial grade matcha blended with milk and served over ice.', price: 5.49, category: 'drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 45, prepTime: 3, isVeg: true, tags: ['popular'] }
];

const categories = ['All', 'Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts', 'Drinks'];

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/menu');
        if(res.data.data && res.data.data.length > 0) {
           setItems(res.data.data);
        } else {
           setItems(fallbackData);
        }
      } catch (error) {
        console.log("Using fallback data since API isn't running");
        setItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      
      {/* Header & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Our Menu</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find your next favorite meal.</p>
        </div>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', 
              borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)',
              background: 'var(--bg-elevated)', color: 'white', outline: 'none'
            }} 
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="menu-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card" style={{ height: '400px', animation: 'pulse 1.5s infinite' }}></div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="menu-grid">
          {filteredItems.map(item => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No items found</h3>
          <p>Try adjusting your search or filters.</p>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => {setSearchQuery(''); setActiveCategory('All');}}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
