
import { Product } from '../components/ProductCard';
import { importProductsFromCSV } from './csvParser';

// This will be populated once the CSV is loaded
let products: Product[] = [];

// Flag to track if the data has been loaded
let isDataLoaded = false;
let isLoading = false;

/**
 * Loads the product data from CSV
 */
export const loadProductData = async (): Promise<void> => {
  if (isLoading || isDataLoaded) return;
  
  try {
    isLoading = true;
    products = await importProductsFromCSV('/data/products.csv');
    isDataLoaded = true;
    isLoading = false;
    console.log(`Loaded ${products.length} products from CSV`);
  } catch (error) {
    console.error('Failed to load product data:', error);
    isLoading = false;
  }
};

// Call loadProductData immediately to start loading the CSV data
loadProductData();

/**
 * Ensures the product data is loaded before returning it
 */
const ensureDataLoaded = async (): Promise<Product[]> => {
  if (!isDataLoaded && !isLoading) {
    await loadProductData();
  }
  
  // If we're still loading, wait a bit and check again
  if (!isDataLoaded) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return ensureDataLoaded();
  }
  
  return products;
};

/**
 * Gets all products (waiting for CSV data to load if needed)
 */
export const getAllProducts = async (): Promise<Product[]> => {
  return await ensureDataLoaded();
};

/**
 * Gets a product by ID
 */
export const getProductById = async (id: number): Promise<Product | undefined> => {
  const allProducts = await ensureDataLoaded();
  return allProducts.find(product => product.id === id);
};

/**
 * Gets related products for a given product
 */
export const getRelatedProducts = async (product: Product, allCategory: boolean = false): Promise<Product[]> => {
  const allProducts = await ensureDataLoaded();
  
  if (allCategory) {
    return allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }
  
  return allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
};

/**
 * Gets featured products
 */
export const getFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  const allProducts = await ensureDataLoaded();
  
  return allProducts
    .filter(p => p.isSustainable || p.isNew)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};

/**
 * Gets new arrivals
 */
export const getNewArrivals = async (limit: number = 4): Promise<Product[]> => {
  const allProducts = await ensureDataLoaded();
  
  return allProducts
    .filter(p => p.isNew)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};

/**
 * Gets products by category
 */
export const getProductsByCategory = async (category: string, limit?: number): Promise<Product[]> => {
  const allProducts = await ensureDataLoaded();
  
  const normalizedCategory = category.toLowerCase();
  const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === normalizedCategory);
  
  if (filteredProducts.length === 0) {
    console.warn(`No products found for category: ${category}`);
  }
  
  return limit ? filteredProducts.slice(0, limit) : filteredProducts;
};

/**
 * Gets low carbon products
 */
export const getLowCarbonProducts = async (limit: number = 4): Promise<Product[]> => {
  const allProducts = await ensureDataLoaded();
  
  return [...allProducts]
    .sort((a, b) => a.carbonFootprint - b.carbonFootprint)
    .slice(0, limit);
};

/**
 * Gets sustainable products
 */
export const getSustainableProducts = async (limit: number = 4): Promise<Product[]> => {
  const allProducts = await ensureDataLoaded();
  
  return allProducts
    .filter(p => p.isSustainable)
    .sort((a, b) => a.carbonFootprint - b.carbonFootprint)
    .slice(0, limit);
};
