import { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext(null);

const PRODUCTS = [
  { id: 1, name: '7 Chakra Healing Bracelet', price: 1299, original: 2499, icon: '📿', badge: 'Bestseller', image: 'https://www.mahakaalprasad.com/cdn/shop/files/healing-7-chakras-volcanic-stone-energy-bracelet.jpg?v=1723446189' },
  { id: 2, name: 'Red Coral Bracelet',         price: 1999, original: 3999, icon: '🔴', badge: 'New', image: 'https://i.etsystatic.com/15894370/r/il/d6d62b/2058658327/il_fullxfull.2058658327_k99i.jpg' },
  { id: 3, name: 'Tiger Eye Protection',        price: 999,  original: 1999, icon: '💛', badge: null, image: 'http://inditrend.in/cdn/shop/files/free-free-na-1-b00104-jupiter-speaks-original-imagbzunbphvkpzt_73b6a68b-46c4-4764-bf1f-59fc951b4604.png?v=1752920531' },
  { id: 4, name: 'Amethyst Spiritual Mala',     price: 2499, original: 4999, icon: '🟣', badge: 'Exclusive', image: 'https://m.media-amazon.com/images/I/71GbJVrC0FL.jpg' },
  { id: 5, name: 'Nazar Kavach Evil Eye',        price: 799,  original: 1499, icon: '🧿', badge: null, image: 'https://www.ompoojashop.com/image/cache/bracelets/nazar-protection-kavach-bracelet-2-1-1000x1000.jpg' },
  { id: 6, name: 'Prosperity Combo Kit',         price: 3499, original: 6999, icon: '⭐', badge: 'Combo', image: 'https://shubhanjalistore.com/wp-content/uploads/2025/09/prosperity-power-pack-set-1.jpg.webp' },
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
