
import React, { useState, useEffect } from 'react';
import { X, Leaf, TreePine, Car, TrendingDown, CloudRain } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { products } from '../utils/productData';

const CarbonFootprintDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [carbonSavings, setCarbonSavings] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCarbonFootprint = localStorage.getItem('carbonSavings');
    if (savedCarbonFootprint) {
      setCarbonSavings(parseFloat(savedCarbonFootprint));
    }
    
    // Get eco-friendly products with low carbon footprint
    const productsWithLowFootprint = products
      .filter(p => p.carbonFootprint < 5)
      .sort((a, b) => a.carbonFootprint - b.carbonFootprint)
      .slice(0, 3);
      
    setSuggestedProducts(productsWithLowFootprint);
  }, []);

  const getEnvironmentalEquivalent = (kgCO2: number) => {
    return {
      trees: Math.round(kgCO2 / 20), // Trees planted (1 tree absorbs ~20kg CO2 annually)
      carKm: Math.round(kgCO2 * 4), // Car kilometers not driven (avg car emits ~0.25kg CO2 per km)
      deviceHours: Math.round(kgCO2 * 40) // Hours of device charging (avg phone charger ~0.025kg CO2 per hour)
    };
  };

  const equivalents = getEnvironmentalEquivalent(carbonSavings);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {carbonSavings > 0 && (
        <div className="fixed right-5 top-1/2 transform -translate-y-1/2 z-30">
          <div className="relative flex flex-col items-center">
            {/* Circle showing carbon savings - now clickable */}
            <button 
              onClick={toggleDetails}
              className="w-20 h-20 rounded-full bg-primary/90 text-white shadow-lg flex flex-col items-center justify-center backdrop-blur-sm border-2 border-white hover:bg-primary transition-colors"
              aria-label="View carbon savings details"
            >
              <span className="text-sm font-medium">You Saved</span>
              <span className="text-lg font-bold">{carbonSavings.toFixed(1)}</span>
              <span className="text-xs">kg CO2e</span>
            </button>
            
            {/* Leaf icon */}
            <div className="absolute -top-3 -right-2 bg-white rounded-full p-2 shadow-md">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Leaf className="w-5 h-5 text-primary mr-2" />
              Your Carbon Footprint Impact
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-primary/90 text-white shadow-lg flex flex-col items-center justify-center">
                <span className="text-lg font-medium">You Saved</span>
                <span className="text-3xl font-bold">{carbonSavings.toFixed(1)}</span>
                <span className="text-sm">kg CO2e</span>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-4">Environmental Impact Equivalent To:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-accent p-4 rounded-lg flex flex-col items-center text-center">
                <TreePine className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-2xl font-bold">{equivalents.trees}</span>
                <span className="text-sm">Trees planted for one year</span>
              </div>
              
              <div className="bg-accent p-4 rounded-lg flex flex-col items-center text-center">
                <Car className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-2xl font-bold">{equivalents.carKm}</span>
                <span className="text-sm">Kilometers not driven</span>
              </div>
              
              <div className="bg-accent p-4 rounded-lg flex flex-col items-center text-center">
                <CloudRain className="w-8 h-8 text-cyan-600 mb-2" />
                <span className="text-2xl font-bold">{equivalents.deviceHours}</span>
                <span className="text-sm">Hours of device usage</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-3">How we calculate carbon footprint:</h3>
              <p className="text-gray-600 text-sm">
                Our carbon footprint calculations use the Eco-Index LCA Model which accounts for materials, 
                manufacturing processes, transportation, and end-of-life disposal. Lower scores indicate 
                more eco-friendly products.
              </p>
            </div>
            
            {suggestedProducts.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <TrendingDown className="w-5 h-5 text-primary mr-2" />
                  Recommended Low-Carbon Products
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {suggestedProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="border border-border rounded-lg p-2 hover:bg-accent/50 cursor-pointer"
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setIsOpen(false);
                      }}
                    >
                      <div className="aspect-square rounded-md overflow-hidden mb-2">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs">₹{Math.min(1999, Math.round(product.price * 20)).toFixed(0)}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center">
                            <Leaf className="w-3 h-3 mr-0.5" />
                            {product.carbonFootprint.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarbonFootprintDetails;
