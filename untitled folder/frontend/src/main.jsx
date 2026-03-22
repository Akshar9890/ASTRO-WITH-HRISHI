import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { CartProvider } from './context/CartContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A0535',
              color: '#F5EDD6',
              border: '1px solid rgba(212,175,55,0.4)',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.8rem',
              letterSpacing: '1px',
            },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
