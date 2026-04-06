import React, { Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Navbar from './components/Navbar';
import { useCartStore } from './store/useCartStore';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

// Le "Lazy loading" des pages améliore les performances.
const Admin = React.lazy(() => import('./pages/Admin'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));

function App() {
  const { isCartOpen, closeCart } = useCartStore();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-white dark:bg-bustantech-black transition-colors duration-300 overflow-x-hidden w-full">
      {!isAdminPage && <Navbar />}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        <Suspense fallback={<div>Chargement en cours...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </Suspense>
        {!isAdminPage && <Footer />}
      </div>
  );
}

export default App;