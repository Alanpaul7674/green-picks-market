
import { Product } from '../components/ProductCard';

/**
 * Parses a CSV string into an array of product objects
 */
export const parseProductsCSV = (csvContent: string): Product[] => {
  const lines = csvContent.split('\n');
  
  // Extract headers (first line)
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse data rows
  const products: Product[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(',').map(value => value.trim());
    
    // Create product object
    const product: Product = {
      id: parseInt(values[headers.indexOf('id')] || '0'),
      name: values[headers.indexOf('name')] || '',
      brand: values[headers.indexOf('brand')] || '',
      price: parseFloat(values[headers.indexOf('price')] || '0'),
      image: values[headers.indexOf('image')] || '',
      category: values[headers.indexOf('category')] || '',
      carbonFootprint: parseFloat(values[headers.indexOf('carbonFootprint')] || '0'),
    };
    
    // Handle optional boolean fields
    const isNewValue = values[headers.indexOf('isNew')];
    if (isNewValue && (isNewValue.toLowerCase() === 'true' || isNewValue === '1')) {
      product.isNew = true;
    }
    
    const isSustainableValue = values[headers.indexOf('isSustainable')];
    if (isSustainableValue && (isSustainableValue.toLowerCase() === 'true' || isSustainableValue === '1')) {
      product.isSustainable = true;
    }
    
    products.push(product);
  }
  
  return products;
};

/**
 * Imports a CSV file and returns the parsed products
 */
export const importProductsFromCSV = async (filePath: string): Promise<Product[]> => {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.status} ${response.statusText}`);
    }
    
    const csvContent = await response.text();
    return parseProductsCSV(csvContent);
  } catch (error) {
    console.error('Error importing products from CSV:', error);
    return [];
  }
};
