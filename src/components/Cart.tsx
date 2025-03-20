
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, MapPin, Clock, Trophy, Leaf, CreditCard, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CarbonScoreCircle from './CarbonScoreCircle';
import { Product } from './ProductCard';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentMethods from './PaymentMethods';

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
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Address, 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
    if (!isLoggedIn) {
      // Redirect to login page if user is not logged in
      navigate('/login');
      toast({
        title: "Login required",
        description: "Please log in to view your cart",
        variant: "destructive"
      });
      return;
    }
    
    setIsOpen(!isOpen);
    // Reset to the first step when opening cart
    setCheckoutStep(1);
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

  // Convert price to rupees - similar to ProductCard.tsx
  const convertToRupees = (price: number) => {
    return Math.min(1999, Math.round(price * 20)).toFixed(0);
  };

  const getTotalCarbonFootprint = () => {
    return items.reduce((total, item) => 
      total + (item.product.carbonFootprint * item.quantity), 0);
  };

  const getIndustryCarbonAverage = () => {
    // A higher number for industry average - assuming typical products have higher footprint
    return items.reduce((total, item) => total + (item.quantity * 12), 0);
  };

  const getCarbonSavings = () => {
    return getIndustryCarbonAverage() - getTotalCarbonFootprint();
  };

  const nextStep = () => {
    if (checkoutStep === 1) {
      if (items.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart to proceed",
          variant: "destructive"
        });
        return;
      }
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (shippingAddress.trim() === '') {
        toast({
          title: "Shipping address required",
          description: "Please enter your shipping address to continue",
          variant: "destructive"
        });
        return;
      }
      setCheckoutStep(3);
    }
  };

  const previousStep = () => {
    if (checkoutStep > 1) {
      setCheckoutStep(checkoutStep - 1);
    }
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
    
    // Update total sustainability points and carbon savings in localStorage
    const currentPoints = parseInt(localStorage.getItem('sustainabilityPoints') || '0', 10);
    const newTotalPoints = currentPoints + sustainabilityPoints;
    localStorage.setItem('sustainabilityPoints', newTotalPoints.toString());
    
    // Store carbon savings
    const currentSavings = parseFloat(localStorage.getItem('carbonSavings') || '0');
    const newTotalSavings = currentSavings + getCarbonSavings();
    localStorage.setItem('carbonSavings', newTotalSavings.toString());
    
    toast({
      title: "Order placed successfully!",
      description: `Payment completed via ${paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'bank' ? 'Net Banking' : 'UPI'}. You've saved ${getCarbonSavings().toFixed(1)} kg CO2e with this purchase!`,
      action: (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
          <Leaf className="h-3 w-3 text-primary" />
        </div>
      )
    });
    
    // Clear cart after successful checkout
    setItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setIsOpen(false);
    setCheckoutStep(1);
  };

  const getStepTitle = () => {
    switch (checkoutStep) {
      case 1: return "Shopping Cart";
      case 2: return "Shipping Information";
      case 3: return "Payment Method";
      default: return "Shopping Cart";
    }
  };

  return (
    <>
      <button 
        className="p-2 rounded-full hover:bg-accent transition-colors relative"
        onClick={toggleCart}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute top-0 right-0 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {isLoggedIn ? items.reduce((total, item) => total + item.quantity, 0) : 0}
        </span>
      </button>

      {isOpen && isLoggedIn && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="bg-white w-full max-w-md h-full overflow-auto shadow-xl animate-in slide-in-from-right">
            <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                {checkoutStep > 1 && (
                  <button 
                    className="mr-2 p-1 rounded-full hover:bg-accent transition-colors"
                    onClick={previousStep}
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                )}
                <h2 className="font-semibold text-lg">{getStepTitle()}</h2>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-accent transition-colors"
                onClick={toggleCart}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {checkoutStep === 1 && (
                <>
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
                                  <span className="font-semibold text-sm">₹{convertToRupees(item.product.price * item.quantity)}</span>
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
                          <Leaf className="w-4 h-4 text-primary mr-2" />
                          <h3 className="font-medium">Carbon Impact Summary</h3>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Total Carbon Footprint:</span>
                          <span className="font-semibold">{getTotalCarbonFootprint().toFixed(1)} kg CO2e</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Industry Average:</span>
                          <span className="font-semibold text-gray-500">{getIndustryCarbonAverage().toFixed(1)} kg CO2e</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Your Carbon Savings:</span>
                          <span className="font-semibold text-green-600">{getCarbonSavings().toFixed(1)} kg CO2e</span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">₹{convertToRupees(getTotalPrice())}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">₹99</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-4">
                          <span>Total</span>
                          <span>₹{(parseInt(convertToRupees(getTotalPrice())) + 99).toString()}</span>
                        </div>
                      </div>

                      <button 
                        className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-center"
                        onClick={nextStep}
                      >
                        Continue to Shipping
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              )}

              {checkoutStep === 2 && (
                <>
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-2" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-2">Shipping Address</h3>
                        <textarea 
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your full shipping address"
                          className="w-full p-2 border border-border rounded-md text-sm h-24"
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

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold">₹{(parseInt(convertToRupees(getTotalPrice())) + 99).toString()}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-center"
                    onClick={nextStep}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </>
              )}

              {checkoutStep === 3 && (
                <>
                  <div className="mb-6">
                    <h3 className="font-medium mb-4 flex items-center">
                      <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                      Select Payment Method
                    </h3>
                    
                    <PaymentMethods
                      selectedMethod={paymentMethod}
                      onChange={setPaymentMethod}
                    />
                    
                    {paymentMethod === 'card' && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <div>
                          <label className="text-sm mb-1 block">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-2 border border-border rounded-md text-sm"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <label className="text-sm mb-1 block">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              className="w-full p-2 border border-border rounded-md text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-sm mb-1 block">CVV</label>
                            <input 
                              type="text" 
                              placeholder="123"
                              className="w-full p-2 border border-border rounded-md text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm mb-1 block">Name on Card</label>
                          <input 
                            type="text" 
                            placeholder="John Doe"
                            className="w-full p-2 border border-border rounded-md text-sm"
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'upi' && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <div>
                          <label className="text-sm mb-1 block">UPI ID</label>
                          <input 
                            type="text" 
                            placeholder="username@upi"
                            className="w-full p-2 border border-border rounded-md text-sm"
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'bank' && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <div>
                          <label className="text-sm mb-1 block">Select Bank</label>
                          <select className="w-full p-2 border border-border rounded-md text-sm">
                            <option>State Bank of India</option>
                            <option>HDFC Bank</option>
                            <option>ICICI Bank</option>
                            <option>Axis Bank</option>
                            <option>Punjab National Bank</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold">₹{(parseInt(convertToRupees(getTotalPrice())) + 99).toString()}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:shadow-md transition-all"
                    onClick={handleCheckout}
                  >
                    Complete Payment
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
