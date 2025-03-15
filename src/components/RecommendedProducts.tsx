
import React, { useRef, useEffect } from 'react';
import ProductCard, { Product } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RecommendedProductsProps {
  products: Product[];
  currentProduct: Product;
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ 
  products, 
  currentProduct,
  title = "More Sustainable Alternatives"
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.clientWidth * 0.6;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Filter recommendations to include only products with a lower carbon footprint
  const recommendations = products.filter(p => 
    p.id !== currentProduct.id && p.carbonFootprint < currentProduct.carbonFootprint
  );

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="relative py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 scroll-smooth"
      >
        {recommendations.map(product => (
          <div key={product.id} className="min-w-[280px] max-w-[280px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
