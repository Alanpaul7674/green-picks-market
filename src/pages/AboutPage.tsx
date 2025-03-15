
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Leaf, Sparkles, Globe, Recycle, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative pt-24 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 mb-6">
              <Leaf className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Our Mission</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About ECOSwap</h1>
            <p className="text-xl text-gray-600 mb-6">
              We're on a mission to make sustainable fashion accessible, 
              beautiful, and transparent.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              ECOSwap was born from a simple question: "Why is it so hard to find fashion that's both 
              beautiful and sustainable?" Our founders, passionate about both style and environmental 
              conservation, realized that consumers often had to choose between aesthetics and ethics.
            </p>
            <p className="text-gray-600 mb-6">
              We believe that understanding the environmental impact of your purchases should be easy. 
              That's why we pioneered our transparent Carbon Score system, making it simple to compare 
              products and make informed choices that align with your values.
            </p>
            <p className="text-gray-600">
              Today, ECOSwap partners with brands that share our commitment to sustainability, 
              ethical production, and transparency. We're building a community of conscious consumers 
              who believe that looking good and doing good can go hand in hand.
            </p>
          </div>
        </div>
      </section>
      
      {/* Carbon Score Explanation */}
      <section className="py-16 px-4 md:px-6 bg-accent">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Understanding Our Metrics</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">The Carbon Score System</h2>
            <p className="text-gray-600">
              Our Carbon Score makes it easy to understand the environmental impact of your fashion choices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-lg">1-4</span>
              </div>
              <h3 className="font-semibold mb-2 text-green-600">Low Impact</h3>
              <p className="text-gray-600">
                These products have minimal environmental impact, using recycled materials, 
                organic fabrics, and low-emission production processes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <span className="text-amber-600 font-bold text-lg">5-9</span>
              </div>
              <h3 className="font-semibold mb-2 text-amber-600">Medium Impact</h3>
              <p className="text-gray-600">
                These products have a moderate environmental footprint, often combining sustainable 
                and conventional materials and production methods.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold text-lg">10+</span>
              </div>
              <h3 className="font-semibold mb-2 text-red-600">High Impact</h3>
              <p className="text-gray-600">
                These products have a higher environmental cost, but we include them to offer 
                honest comparisons and alternatives to conventional fashion.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600">
              The principles that guide everything we do at ECOSwap
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Environmental Responsibility</h3>
                <p className="text-gray-600">
                  We're committed to reducing fashion's impact on the planet by 
                  promoting low-carbon alternatives and sustainable practices.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Circularity</h3>
                <p className="text-gray-600">
                  We believe in a circular economy where products are designed 
                  to be reused, recycled, and kept out of landfills.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We provide clear, accurate information about each product's 
                  environmental impact so you can make informed decisions.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We're building a community of conscious consumers who want to 
                  look good while doing good for the planet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join the Movement */}
      <section className="py-16 px-4 md:px-6 bg-primary/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Join the Movement</h2>
            <p className="text-gray-600 mb-8">
              Be part of the solution by choosing fashion with a lower carbon footprint. 
              Every purchase you make is a vote for the kind of world you want to live in.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/women" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:shadow-md transition-all">
                Shop Women
              </a>
              <a href="/men" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:shadow-md transition-all">
                Shop Men
              </a>
              <a href="/accessories" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:shadow-md transition-all">
                Shop Accessories
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
