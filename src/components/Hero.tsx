
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const opacity = Math.max(1 - scrollY / 700, 0);
        const scale = Math.max(1 + scrollY * 0.0003, 1);
        const translateY = scrollY * 0.3;
        
        heroRef.current.style.opacity = opacity.toString();
        heroRef.current.style.transform = `scale(${scale}) translateY(-${translateY}px)`;
      }
      
      if (textRef.current) {
        const scrollY = window.scrollY;
        const translateY = scrollY * 0.2;
        
        textRef.current.style.transform = `translateY(-${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-accent">
      <div 
        ref={heroRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div 
        ref={textRef}
        className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 md:px-6"
        style={{ transition: 'transform 0.2s ease-out' }}
      >
        <div className="max-w-3xl slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm mb-6">
            <Leaf className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Fashion with a lower footprint</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Style that doesn't cost the Earth
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Discover fashion that looks good and does good. ECOSwap helps you find stylish alternatives with a lower carbon footprint.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/women" 
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:translate-y-[-2px]"
            >
              Shop Women
            </Link>
            <Link 
              to="/men" 
              className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium transition-all hover:bg-white/20 hover:shadow-lg hover:translate-y-[-2px] flex items-center"
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
