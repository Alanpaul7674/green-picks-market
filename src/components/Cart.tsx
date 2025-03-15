
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, MapPin, Clock, Trophy, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CarbonScoreCircle from './CarbonScoreCircle';
import { Product } from './ProductCard';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [sustainabilityPoints, setSustainabilityPoints] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);
  
  useEffect(() => {
    // Calculate sustainability points based on carbon footprint
    if (items.length > 0) {
      const points = items.reduce((total, item) => {
        // Lower carbon footprint = more points
        const itemPoints = Math.round((15 - item.product.carbonFootprint) * 10) * item.quantity;
        return total + (itemPoints > 0 ? itemPoints : 0);
      }, 0);
      
      setSustainabilityPoints(points);
    }
  }, [items]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
      variant: "default"
    });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getAverageCarbonFootprint = () => {
    if (items.length === 0) return 0;
    const totalCarbonFootprint = items.reduce((total, item) => total + (item.product.carbonFootprint * item.quantity), 0);
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    return totalCarbonFootprint / totalQuantity;
  };

  const handleCheckout = () => {
    if (shippingAddress.trim() === '') {
      toast({
        title: "Shipping address required",
        description: "Please enter your shipping address to continue",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Order placed successfully!",
      description: `You've earned ${sustainabilityPoints} sustainability points with this purchase!`,
      action: (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
          <Trophy className="h-3 w-3 text-primary" />
        </div>
      )
    });
    
    // Clear cart after successful checkout
    setItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="p-2 rounded-full hover:bg-accent transition-colors relative"
        onClick={toggleCart}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute top-0 right-0 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {items.reduce((total, item) => total + item.quantity, 0)}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="bg-white w-full max-w-md h-full overflow-auto shadow-xl animate-in slide-in-from-right">
            <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Shopping Cart</h2>
              <button 
                className="p-2 rounded-full hover:bg-accent transition-colors"
                onClick={toggleCart}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item, index) => (
                      <div key={`${item.product.id}-${item.size}`} className="flex border border-border rounded-lg p-3">
                        <div className="w-20 h-20 overflow-hidden rounded-md mr-3">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-sm">{item.product.name}</h3>
                              <p className="text-sm text-gray-500">{item.product.brand}</p>
                              <p className="text-xs text-gray-500">Size: {item.size}</p>
                            </div>
                            <button 
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => removeItem(index)}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border border-border rounded-md">
                              <button 
                                className="w-6 h-6 flex items-center justify-center text-gray-500"
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <button 
                                className="w-6 h-6 flex items-center justify-center text-gray-500"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
                              <div className="ml-2">
                                <CarbonScoreCircle score={item.product.carbonFootprint} size="sm" showLabel={false} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-accent p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-3">
                      <Trophy className="w-4 h-4 text-primary mr-2" />
                      <h3 className="font-medium">Sustainability Rewards</h3>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Sustainability Points:</span>
                      <span className="font-semibold text-primary">{sustainabilityPoints} points</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Carbon Score:</span>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">{getAverageCarbonFootprint().toFixed(1)}</span>
                        <Leaf className={`w-4 h-4 ${getAverageCarbonFootprint() < 5 ? 'text-green-500' : getAverageCarbonFootprint() < 10 ? 'text-amber-500' : 'text-red-500'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">$4.99</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-4">
                      <span>Total</span>
                      <span>${(getTotalPrice() + 4.99).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-start mb-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-2" />
                      <div>
                        <h3 className="font-medium text-sm mb-2">Shipping Address</h3>
                        <input 
                          type="text" 
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your shipping address"
                          className="w-full p-2 border border-border rounded-md text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-start mt-4">
                      <Clock className="w-4 h-4 text-gray-500 mt-1 mr-2" />
                      <div>
                        <h3 className="font-medium text-sm mb-1">Estimated Delivery</h3>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:shadow-md transition-all"
                    onClick={handleCheckout}
                  >
                    Complete Purchase
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
