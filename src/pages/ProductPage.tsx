import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetail from '../components/ProductDetail';
import { getProductById, getRelatedProducts } from '../utils/productData';
import { Product } from '../components/ProductCard';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    // Simulate API fetch with a small delay
    setTimeout(() => {
      if (id) {
        const productData = getProductById(parseInt(id));
        
        if (productData) {
          // Check if we have a saved image for this product
          const savedImage = localStorage.getItem(`product_image_${productData.id}`);
          if (savedImage) {
            // Use the saved image to ensure consistency
            const productWithSavedImage = {
              ...productData,
              image: savedImage
            };
            setProduct(productWithSavedImage);
            
            // Get related products for the specific product type
            const related = getRelatedProducts(productWithSavedImage);
            
            // Ensure we have at least some related products
            if (related.length < 3) {
              // Get more products from the same category
              const moreProducts = getRelatedProducts(productWithSavedImage, true);
              const combinedProducts = [...related];
              
              // Add products not already in the list until we have at least 4
              moreProducts.forEach(p => {
                if (!combinedProducts.some(cp => cp.id === p.id) && combinedProducts.length < 8) {
                  combinedProducts.push(p);
                }
              });
              
              setRelatedProducts(combinedProducts);
            } else {
              setRelatedProducts(related);
            }
          } else {
            setProduct(productData);
            
            // Get related products (same as above)
            const related = getRelatedProducts(productData);
            
            if (related.length < 3) {
              const moreProducts = getRelatedProducts(productData, true);
              const combinedProducts = [...related];
              
              moreProducts.forEach(p => {
                if (!combinedProducts.some(cp => cp.id === p.id) && combinedProducts.length < 8) {
                  combinedProducts.push(p);
                }
              });
              
              setRelatedProducts(combinedProducts);
            } else {
              setRelatedProducts(related);
            }
          }
        } else {
          // Product not found
          navigate('/not-found');
        }
      }
      setLoading(false);
    }, 300);
  }, [id, navigate]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Image Skeleton */}
                <div className="relative overflow-hidden bg-gray-200 rounded-xl aspect-square">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="w-full h-full animate-pulse bg-gray-300"></div>
                  </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="pt-8 md:pt-12">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
                  
                  <div className="h-32 bg-gray-200 rounded mb-8 animate-pulse"></div>
                  
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                  <div className="flex space-x-3 mb-6">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  
                  <div className="h-10 bg-gray-200 rounded mb-8 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto">
          <ProductDetail product={product} relatedProducts={relatedProducts} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
