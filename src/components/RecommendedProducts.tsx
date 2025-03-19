
import React, { useRef, useEffect, useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface RecommendedProductsProps {
  products: Product[];
  currentProduct: Product;
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ 
  products, 
  currentProduct,
  title = "Similar Products With Lower Carbon Footprint"
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showEmptyState, setShowEmptyState] = useState(false);
  
  // Helper function to check if products are actually shirts
  const isShirt = (product: Product) => {
    const name = product.name.toLowerCase();
    return name.includes('shirt') || name.includes('blouse') || name.includes('top');
  };

  // Get more specific category
  const getSpecificCategory = () => {
    if (isShirt(currentProduct)) return 'shirt';
    if (currentProduct.name.toLowerCase().includes('pant') || 
        currentProduct.name.toLowerCase().includes('jean') ||
        currentProduct.name.toLowerCase().includes('trouser')) return 'pant';
    if (currentProduct.name.toLowerCase().includes('jacket') || 
        currentProduct.name.toLowerCase().includes('coat')) return 'jacket';
    return currentProduct.category;
  };

  const specificCategory = getSpecificCategory();

  useEffect(() => {
    // If there are no recommendations, show empty state after a short delay
    if (recommendations.length === 0) {
      const timer = setTimeout(() => setShowEmptyState(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

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

  // Filter recommendations based on specific product type and lower carbon footprint
  const recommendations = products.filter(p => {
    // Don't include the current product
    if (p.id === currentProduct.id) return false;
    
    // Must be in the same high-level category (Men, Women, Accessories)
    if (p.category !== currentProduct.category) return false;
    
    // If current product is a shirt, suggest other shirts
    if (specificCategory === 'shirt' && !isShirt(p)) return false;
    
    // If current product is pants, suggest other pants
    if (specificCategory === 'pant' && 
        !(p.name.toLowerCase().includes('pant') || 
          p.name.toLowerCase().includes('jean') || 
          p.name.toLowerCase().includes('trouser'))) return false;
    
    // If current product is a jacket, suggest other jackets
    if (specificCategory === 'jacket' && 
        !(p.name.toLowerCase().includes('jacket') || 
          p.name.toLowerCase().includes('coat'))) return false;
    
    // Must have lower carbon footprint
    return p.carbonFootprint < currentProduct.carbonFootprint;
  });

  // Calculate potential carbon savings
  const calculateSavings = (product: Product) => {
    return (currentProduct.carbonFootprint - product.carbonFootprint).toFixed(1);
  };

  if (recommendations.length === 0) {
    if (!showEmptyState) return null;
    
    return (
      <div className="relative py-10">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="bg-accent p-6 rounded-lg text-center">
          <Leaf className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Lower Carbon Alternatives Found</h3>
          <p className="text-gray-600 mb-4">
            This {specificCategory === currentProduct.category ? 
              currentProduct.category.toLowerCase() : 
              specificCategory} already has one of the lowest carbon footprints!
          </p>
        </div>
      </div>
    );
  }

  // Show toast highlighting sustainability benefits
  const showSustainabilityToast = () => {
    if (recommendations.length > 0) {
      const lowestCarbonProduct = recommendations.reduce((prev, current) => 
        prev.carbonFootprint < current.carbonFootprint ? prev : current
      );
      
      const potentialSaving = calculateSavings(lowestCarbonProduct);
      
      toast({
        title: "Sustainability Tip",
        description: `Switching to ${lowestCarbonProduct.name} could reduce your carbon footprint by ${potentialSaving} kg CO2e!`,
        variant: "default",
        action: (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
            <Leaf className="h-3 w-3 text-primary" />
          </div>
        )
      });
    }
  };

  // Show sustainability toast when recommendations are loaded
  useEffect(() => {
    if (recommendations.length > 0) {
      const timer = setTimeout(() => showSustainabilityToast(), 2000);
      return () => clearTimeout(timer);
    }
  }, [recommendations]);

  // Determine the subtitle based on the specific category
  const getSubtitle = () => {
    if (specificCategory === currentProduct.category) {
      return `Similar ${currentProduct.category.toLowerCase()} with lower carbon footprint`;
    } else {
      return `Similar ${specificCategory}s with lower carbon footprint`;
    }
  };

  return (
    <div className="relative py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {getSubtitle()}
          </p>
        </div>
        
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
          <div key={product.id} className="min-w-[280px] max-w-[280px] relative">
            <ProductCard product={product} />
            <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Leaf className="w-3 h-3 mr-1" />
              Save {calculateSavings(product)} kg CO2e
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
