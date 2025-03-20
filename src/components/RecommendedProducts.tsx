
import React, { useRef, useEffect, useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getProductById } from '../utils/productData';

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
  const [fallbackProducts, setFallbackProducts] = useState<Product[]>([]);
  
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
    if (currentProduct.name.toLowerCase().includes('shoe') || 
        currentProduct.name.toLowerCase().includes('boot') ||
        currentProduct.name.toLowerCase().includes('sneaker')) return 'footwear';
    return currentProduct.category;
  };

  const specificCategory = getSpecificCategory();

  // Filter recommendations based on specific product type and lower carbon footprint
  const exactTypeRecommendations = products.filter(p => {
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
          
    // If current product is footwear, suggest other footwear
    if (specificCategory === 'footwear' && 
        !(p.name.toLowerCase().includes('shoe') || 
          p.name.toLowerCase().includes('boot') ||
          p.name.toLowerCase().includes('sneaker'))) return false;
    
    // Must have lower carbon footprint
    return p.carbonFootprint < currentProduct.carbonFootprint;
  });

  // Fallback: related products of same category without carbon footprint restriction
  const sameTypeRecommendations = products.filter(p => {
    if (p.id === currentProduct.id) return false;
    if (p.category !== currentProduct.category) return false;
    
    if (specificCategory === 'shirt' && !isShirt(p)) return false;
    if (specificCategory === 'pant' && 
        !(p.name.toLowerCase().includes('pant') || 
          p.name.toLowerCase().includes('jean') || 
          p.name.toLowerCase().includes('trouser'))) return false;
    if (specificCategory === 'jacket' && 
        !(p.name.toLowerCase().includes('jacket') || 
          p.name.toLowerCase().includes('coat'))) return false;
    if (specificCategory === 'footwear' && 
        !(p.name.toLowerCase().includes('shoe') || 
          p.name.toLowerCase().includes('boot') ||
          p.name.toLowerCase().includes('sneaker'))) return false;
    
    return true;
  });
  
  // Final fallback: just related products of same category
  const categoryRecommendations = products.filter(p => {
    return p.id !== currentProduct.id && p.category === currentProduct.category;
  });

  // Use our recommendations or fallbacks
  const recommendations = exactTypeRecommendations.length > 0 
    ? exactTypeRecommendations 
    : (sameTypeRecommendations.length > 0 ? sameTypeRecommendations : categoryRecommendations);

  // Calculate potential carbon savings (or 0 if the product has higher footprint)
  const calculateSavings = (product: Product) => {
    const saving = currentProduct.carbonFootprint - product.carbonFootprint;
    return saving > 0 ? saving.toFixed(1) : "0.0";
  };

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
    if (exactTypeRecommendations.length > 0) {
      return `Similar ${specificCategory}s with lower carbon footprint`;
    } else if (sameTypeRecommendations.length > 0) {
      return `Related ${specificCategory}s you might like`;
    } else {
      return `Other items from ${currentProduct.category} collection`;
    }
  };

  // If we're using fallback recommendations, adjust the title
  const getTitle = () => {
    if (exactTypeRecommendations.length > 0) {
      return title;
    } else {
      return "You Might Also Like";
    }
  };

  return (
    <div className="relative py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
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
            {product.carbonFootprint < currentProduct.carbonFootprint && (
              <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Leaf className="w-3 h-3 mr-1" />
                Save {calculateSavings(product)} kg CO2e
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
