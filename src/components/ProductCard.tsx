
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChevronRight } from 'lucide-react';

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

  return (
    <div 
      className="group relative rounded-xl overflow-hidden transition-all duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 ease-out transform group-hover:scale-105"
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
          
          {/* Carbon Footprint Indicator */}
          <div className="absolute bottom-3 left-3">
            <div className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${carbonColor}`}>
              <span>Carbon: {carbonLevel}</span>
            </div>
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
        <div className="font-semibold">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
