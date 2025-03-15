
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Leaf, TrendingDown, ShoppingBag } from 'lucide-react';
import { getFeaturedProducts, getNewArrivals } from '../utils/productData';

const Index = () => {
  const featuredProducts = getFeaturedProducts(4);
  const newArrivals = getNewArrivals(4);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">Why Choose ECOSwap</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-subtle hover:shadow-hover transition-all duration-300 text-center slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Materials</h3>
              <p className="text-gray-600">
                All products are made with eco-friendly materials that reduce environmental impact.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-subtle hover:shadow-hover transition-all duration-300 text-center slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Carbon Footprint Tracking</h3>
              <p className="text-gray-600">
                Compare the carbon impact of products to make more environmentally-conscious choices.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-subtle hover:shadow-hover transition-all duration-300 text-center slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ethical Production</h3>
              <p className="text-gray-600">
                Support brands that ensure fair wages and safe working conditions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 px-4 md:px-6 bg-accent">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 mb-3">
                <Leaf className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Eco-Friendly</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            </div>
            
            <a href="/shop" className="mt-4 md:mt-0 px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
              View All
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="slide-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent mb-3">
                <span className="text-sm font-medium">Just Arrived</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            </div>
            
            <a href="/shop" className="mt-4 md:mt-0 px-5 py-2 rounded-lg bg-primary text-white hover:shadow-md transition-all">
              View All
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, index) => (
              <div key={product.id} className="slide-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sustainable Fashion Mission */}
      <section className="py-20 px-4 md:px-6 bg-primary/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center slide-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Sustainable Fashion Mission</h2>
            <p className="text-lg mb-8 text-gray-700">
              At ECOSwap, we believe that fashion can be both beautiful and sustainable. 
              Our mission is to help you find stylish alternatives with a lower environmental impact, 
              making it easier to reduce your carbon footprint without compromising on style.
            </p>
            <a href="/about" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:shadow-md transition-all">
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
