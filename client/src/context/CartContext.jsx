import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      const existingItem = state.items.find(i => i._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(i => 
            i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i => {
          if (i._id === action.payload.id) {
            return { ...i, quantity: Math.max(1, action.payload.quantity) };
          }
          return i;
        })
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('quickbite_cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Derived state
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 30 ? 0 : 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{
      items: state.items,
      itemCount,
      subtotal,
      deliveryFee,
      tax,
      total,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
