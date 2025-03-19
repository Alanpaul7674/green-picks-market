
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChevronRight } from 'lucide-react';
import CarbonScoreCircle from './CarbonScoreCircle';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  carbonFootprint: number; // in kg CO2e
  isNew?: boolean;
  isSustainable?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const getCarbonLevel = (carbonFootprint: number) => {
    if (carbonFootprint < 5) return 'Low';
    if (carbonFootprint < 10) return 'Medium';
    return 'High';
  };
  
  const carbonLevel = getCarbonLevel(product.carbonFootprint);
  const carbonColor = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-amber-100 text-amber-800',
    High: 'bg-red-100 text-red-800',
  }[carbonLevel];

  // Convert price to Indian Rupees (adjusted to ensure prices stay reasonable)
  // Using a conversion factor that keeps prices under ₹2000
  const priceInRupees = Math.min(1999, Math.round(product.price * 20)).toFixed(0);

  // Set of reliable fallback images by category
  const getFallbackImage = (category: string) => {
    const fallbacks: Record<string, string> = {
      'Women': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=60',
      'Men': 'https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=800&q=60',
      'Accessories': 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=800&q=60'
    };
    
    return fallbacks[category] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60';
  };

  // Store image URL in localStorage for consistent display across pages
  const saveImageUrl = () => {
    const imageToStore = imageError ? getFallbackImage(product.category) : product.image;
    localStorage.setItem(`product_image_${product.id}`, imageToStore);
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden transition-all duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} onClick={saveImageUrl}>
        <div className="aspect-[3/4] overflow-hidden relative">
          <img 
            src={imageError ? getFallbackImage(product.category) : product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 ease-out transform group-hover:scale-105"
            onError={(e) => {
              setImageError(true);
              e.currentTarget.src = getFallbackImage(product.category);
              e.currentTarget.onerror = null; // Prevent infinite loop
            }}
          />
          
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 text-xs font-medium bg-black/80 text-white rounded-full backdrop-blur-sm">
                New Arrival
              </span>
            )}
            {product.isSustainable && (
              <span className="px-2 py-1 text-xs font-medium bg-primary/90 text-white rounded-full backdrop-blur-sm flex items-center">
                <Leaf className="w-3 h-3 mr-1" />
                Eco-Friendly
              </span>
            )}
          </div>
          
          {/* Carbon Score Circle */}
          <div className="absolute top-3 right-3">
            <CarbonScoreCircle 
              score={product.carbonFootprint} 
              size="sm" 
              showLabel={false} 
            />
          </div>
          
          {/* Quick View Button */}
          <div 
            className={`absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm p-3 flex justify-center items-center transform transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <span className="text-sm font-medium flex items-center">
              Quick View <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-1 text-sm text-gray-500">{product.brand}</div>
        <h3 className="font-medium mb-1 truncate">{product.name}</h3>
        <div className="font-semibold">₹{priceInRupees}</div>
      </div>
    </div>
  );
};

export default ProductCard;
