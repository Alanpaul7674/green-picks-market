
import React, { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { Leaf, Truck, RotateCcw, ChevronDown, ChevronUp, Sparkles, ShoppingCart } from 'lucide-react';
import RecommendedProducts from './RecommendedProducts';
import { useToast } from '@/components/ui/use-toast';
import CarbonScoreCircle from './CarbonScoreCircle';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, relatedProducts }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>("sustainability");
  const [productImage, setProductImage] = useState<string>(product.image);
  const { toast } = useToast();

  // Convert price to Indian Rupees (adjusted to keep prices under 2000)
  const priceInRupees = Math.min(1999, Math.round(product.price * 20)).toFixed(0);

  useEffect(() => {
    // Retrieve saved image URL if available
    const savedImage = localStorage.getItem(`product_image_${product.id}`);
    if (savedImage) {
      setProductImage(savedImage);
    }
  }, [product.id]);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Set of reliable fallback images by category
  const getFallbackImage = (category: string) => {
    const fallbacks: Record<string, string> = {
      'Women': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=60',
      'Men': 'https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=800&q=60',
      'Accessories': 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=800&q=60'
    };
    
    return fallbacks[category] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60';
  };

  const sizes = ["XS", "S", "M", "L", "XL"];

  const getCarbonLevel = (carbonFootprint: number) => {
    if (carbonFootprint < 5) return { level: 'Low Impact', color: 'text-green-600' };
    if (carbonFootprint < 10) return { level: 'Medium Impact', color: 'text-amber-600' };
    return { level: 'High Impact', color: 'text-red-600' };
  };

  const carbonInfo = getCarbonLevel(product.carbonFootprint);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive"
      });
      return;
    }

    // Calculate sustainability points (1 point for each ₹100 spent on sustainable products)
    const sustainabilityPoints = product.isSustainable ? Math.floor(parseInt(priceInRupees) / 100) : 0;

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if the same product with the same size is already in cart
    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.product.id === product.id && item.size === selectedSize
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item - ensuring we use the correct image
      const productToAdd = {
        ...product,
        image: productImage // Use the consistent image
      };
      
      cartItems.push({
        product: productToAdd,
        quantity,
        size: selectedSize,
        sustainabilityPoints
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Add sustainability points to user's total if the product is sustainable
    if (sustainabilityPoints > 0) {
      const currentPoints = localStorage.getItem('sustainabilityPoints');
      const newPoints = currentPoints ? parseInt(currentPoints, 10) + sustainabilityPoints : sustainabilityPoints;
      localStorage.setItem('sustainabilityPoints', newPoints.toString());
    }

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} (${selectedSize}) added to your cart`,
      action: (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
          <ShoppingCart className="h-3 w-3 text-primary" />
        </div>
      )
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-secondary relative">
            <img 
              src={productImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const fallbackImg = getFallbackImage(product.category);
                e.currentTarget.src = fallbackImg;
                setProductImage(fallbackImg);
                localStorage.setItem(`product_image_${product.id}`, fallbackImg);
                e.currentTarget.onerror = null; // Prevent infinite loop
              }}
            />
            {/* Add Carbon Score Circle to corner of image */}
            <div className="absolute top-4 right-4">
              <CarbonScoreCircle score={product.carbonFootprint} />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="pt-8 md:pt-12">
          <div className="slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium text-primary">{product.brand}</span>
              {product.isSustainable && (
                <div className="ml-3 inline-flex items-center px-2 py-1 rounded-full bg-primary/10">
                  <Leaf className="w-3 h-3 text-primary mr-1" />
                  <span className="text-xs font-medium text-primary">Eco-Friendly</span>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">{product.name}</h1>
            
            <div className="text-2xl font-bold mb-6">₹{priceInRupees}</div>
            
            {/* Carbon Footprint */}
            <div className="bg-accent rounded-lg p-5 mb-8">
              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Carbon Footprint</h3>
                  <div className="flex items-baseline mb-2">
                    <span className={`text-3xl font-bold ${carbonInfo.color}`}>
                      {product.carbonFootprint}
                    </span>
                    <span className="ml-1 text-gray-600">kg CO2e</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This product has a <span className={`font-medium ${carbonInfo.color}`}>{carbonInfo.level}</span> on the environment
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Calculated using the <b>Eco-Index LCA Model</b> - measuring materials, manufacturing, transport, and end-of-life impact.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Size</span>
                <button className="text-sm text-primary hover:underline">Size Guide</button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`min-w-[3rem] h-10 px-3 rounded-md font-medium transition-all ${
                      selectedSize === size 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-secondary text-gray-800 hover:bg-accent'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-8">
              <span className="font-medium block mb-3">Quantity</span>
              <div className="flex items-center border border-border rounded-md w-32">
                <button 
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <button 
              className="w-full py-3 px-6 bg-primary text-white font-medium rounded-lg hover:shadow-md transition-all mb-6 flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            
            {/* Show Sustainability Points */}
            {product.isSustainable && (
              <div className="mb-6 p-3 bg-primary/10 rounded-lg flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Earn {Math.floor(parseInt(priceInRupees) / 100)} sustainability points with this purchase
                </span>
              </div>
            )}
            
            {/* Product Info Accordions */}
            <div className="space-y-4 border-t border-border pt-6">
              {/* Sustainability Info */}
              <div className="border-b border-border pb-4">
                <button 
                  className="flex items-center justify-between w-full text-left py-2"
                  onClick={() => toggleSection("sustainability")}
                >
                  <span className="font-medium">Sustainability</span>
                  {expandedSection === "sustainability" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                
                {expandedSection === "sustainability" && (
                  <div className="pt-2 text-gray-600 text-sm space-y-3">
                    <p>This product is made with sustainable materials to reduce its environmental impact.</p>
                    
                    <div className="flex items-start">
                      <Leaf className="w-4 h-4 text-primary mr-2 mt-0.5" />
                      <span>Made with organic cotton and recycled polyester</span>
                    </div>
                    
                    <div className="flex items-start">
                      <RotateCcw className="w-4 h-4 text-primary mr-2 mt-0.5" />
                      <span>Recyclable packaging reduces waste</span>
                    </div>
                    
                    <div className="flex items-start">
                      <Truck className="w-4 h-4 text-primary mr-2 mt-0.5" />
                      <span>Carbon-neutral shipping available</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Delivery & Returns */}
              <div className="border-b border-border pb-4">
                <button 
                  className="flex items-center justify-between w-full text-left py-2"
                  onClick={() => toggleSection("delivery")}
                >
                  <span className="font-medium">Delivery & Returns</span>
                  {expandedSection === "delivery" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                
                {expandedSection === "delivery" && (
                  <div className="pt-2 text-gray-600 text-sm space-y-2">
                    <p>Free delivery on all orders over ₹1,000.</p>
                    <p>Express shipping available for ₹199.</p>
                    <p>Free returns within 30 days of delivery.</p>
                  </div>
                )}
              </div>
              
              {/* Materials */}
              <div className="border-b border-border pb-4">
                <button 
                  className="flex items-center justify-between w-full text-left py-2"
                  onClick={() => toggleSection("materials")}
                >
                  <span className="font-medium">Materials & Care</span>
                  {expandedSection === "materials" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                
                {expandedSection === "materials" && (
                  <div className="pt-2 text-gray-600 text-sm space-y-2">
                    <p>70% Organic Cotton, 30% Recycled Polyester</p>
                    <p>Machine wash cold with similar colors.</p>
                    <p>Tumble dry low.</p>
                    <p>Do not bleach.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Products with lower carbon footprint */}
      <RecommendedProducts 
        products={relatedProducts} 
        currentProduct={product} 
      />
    </div>
  );
};

export default ProductDetail;
