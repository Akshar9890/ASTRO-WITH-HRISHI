import { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext(null);

const PRODUCTS = [
  { id: 1, name: '7 Chakra Healing Bracelet', price: 1299, original: 2499, icon: '📿', badge: 'Bestseller' },
  { id: 2, name: 'Red Coral Bracelet',         price: 1999, original: 3999, icon: '🔴', badge: 'New' },
  { id: 3, name: 'Tiger Eye Protection',        price: 999,  original: 1999, icon: '💛', badge: null },
  { id: 4, name: 'Amethyst Spiritual Mala',     price: 2499, original: 4999, icon: '🟣', badge: 'Exclusive' },
  { id: 5, name: 'Nazar Kavach Evil Eye',        price: 799,  original: 1499, icon: '🧿', badge: null },
  { id: 6, name: 'Prosperity Combo Kit',         price: 3499, original: 6999, icon: '⭐', badge: 'Combo' },
];

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [open, setOpen]   = useState(false);

  const add    = (product) => { dispatch({ type: 'ADD', product }); setOpen(true); };
  const remove = (id)      => dispatch({ type: 'REMOVE', id });
  const update = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clear  = ()        => dispatch({ type: 'CLEAR' });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total, count, open, setOpen, PRODUCTS }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
