
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import Cart from './Cart';
import NavbarAccountSection from './NavbarAccountSection';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-subtle py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-semibold tracking-tight"
          >
            <span className="text-primary">ECO</span>Swap
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/women" className="text-sm font-medium hover:text-primary transition-colors">
              Women
            </Link>
            <Link to="/men" className="text-sm font-medium hover:text-primary transition-colors">
              Men
            </Link>
            <Link to="/accessories" className="text-sm font-medium hover:text-primary transition-colors">
              Accessories
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <NavbarAccountSection />
            <Cart />
            <button 
              className="md:hidden p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md scale-in">
          <nav className="flex flex-col py-4 px-4">
            <Link 
              to="/" 
              className="py-3 px-4 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/women" 
              className="py-3 px-4 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link 
              to="/men" 
              className="py-3 px-4 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link 
              to="/accessories" 
              className="py-3 px-4 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link 
              to="/about" 
              className="py-3 px-4 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
