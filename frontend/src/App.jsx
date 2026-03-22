import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CartDrawer from './components/CartDrawer';
import StarCanvas from './components/StarCanvas';

export default function App() {
  return (
    <>
      <StarCanvas />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <CartDrawer />
    </>
  );
}
