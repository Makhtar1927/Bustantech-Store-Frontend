import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useProductStore } from '../store/useProductStore';

const ProductGrid = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div className="text-center py-20 dark:text-white">Chargement du catalogue de luxe...</div>;

  return (
    <section id="products" className="py-16 px-4 md:px-20 bg-gray-50 dark:bg-bustantech-black scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-luxury font-bold dark:text-white mb-4">Nouveautés & Best-Sellers</h2>
          <div className="w-20 h-1 bg-bustantech-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;