
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Leaf, Filter, ChevronDown } from 'lucide-react';
import { getProductsByCategory } from '../utils/productData';
import { Product } from '../components/ProductCard';

const WomenPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState('featured');
  const [carbonFilter, setCarbonFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchedProducts = getProductsByCategory('women');
    setProducts(fetchedProducts);
    setFilteredProducts(fetchedProducts);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Apply price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Apply carbon filter
    if (carbonFilter !== 'all') {
      switch (carbonFilter) {
        case 'low':
          result = result.filter(p => p.carbonFootprint < 5);
          break;
        case 'medium':
          result = result.filter(p => p.carbonFootprint >= 5 && p.carbonFootprint < 10);
          break;
        case 'high':
          result = result.filter(p => p.carbonFootprint >= 10);
          break;
      }
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'carbon-asc':
        result.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
        break;
      case 'newest':
        result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
        break;
      // 'featured' is default, no sorting needed
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, sortOption, carbonFilter]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative pt-24 bg-accent">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 mb-4">
              <Leaf className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Eco-Friendly Collection</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Women's Collection</h1>
            <p className="text-gray-600 mb-6">
              Discover stylish and sustainable fashion for women with a lower carbon footprint
            </p>
          </div>
        </div>
      </div>
      
      {/* Products with Filters */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <button 
            className="md:hidden flex items-center justify-between w-full p-4 border border-border rounded-lg mb-4"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6`}>
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={priceRange[0]} 
                  min={0}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full p-2 border border-border rounded-md"
                />
                <span>-</span>
                <input 
                  type="number"
                  value={priceRange[1]}
                  min={priceRange[0]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Carbon Footprint</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    checked={carbonFilter === 'all'} 
                    onChange={() => setCarbonFilter('all')}
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    checked={carbonFilter === 'low'} 
                    onChange={() => setCarbonFilter('low')}
                  />
                  <span className="text-green-600">Low Impact (below 5)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    checked={carbonFilter === 'medium'} 
                    onChange={() => setCarbonFilter('medium')}
                  />
                  <span className="text-amber-600">Medium Impact (5-10)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    checked={carbonFilter === 'high'} 
                    onChange={() => setCarbonFilter('high')}
                  />
                  <span className="text-red-600">High Impact (above 10)</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600"><span className="font-medium">{filteredProducts.length}</span> products</p>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border border-border rounded-md bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="carbon-asc">Lowest Carbon Footprint</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products match your filters.</p>
                <button 
                  onClick={() => {
                    setPriceRange([0, 200]);
                    setCarbonFilter('all');
                    setSortOption('featured');
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WomenPage;
