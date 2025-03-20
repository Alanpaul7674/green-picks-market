
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { parseProductsCSV } from '@/utils/csvParser';
import { Product } from './ProductCard';
import { useToast } from '@/hooks/use-toast';

interface CSVUploaderProps {
  onUploadComplete?: (products: Product[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a CSV file
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const products = parseProductsCSV(content);
        
        if (products.length === 0) {
          throw new Error('No products found in the CSV file');
        }
        
        // Save to localStorage so it persists
        localStorage.setItem('custom-products-csv', content);
        
        setUploadSuccess(true);
        setIsUploading(false);
        
        toast({
          title: 'CSV Uploaded Successfully',
          description: `Loaded ${products.length} products from your CSV`,
          variant: 'default',
        });
        
        if (onUploadComplete) {
          onUploadComplete(products);
        }
        
        // Force reload to apply the new product data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setError(error instanceof Error ? error.message : 'Failed to parse CSV');
        setIsUploading(false);
        
        toast({
          title: 'Error Loading Products',
          description: error instanceof Error ? error.message : 'Failed to parse CSV',
          variant: 'destructive',
        });
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setIsUploading(false);
      
      toast({
        title: 'Upload Failed',
        description: 'There was an error reading the file',
        variant: 'destructive',
      });
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="p-5 border border-dashed border-gray-300 rounded-lg bg-accent/50">
      <div className="text-center">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Upload Your Product CSV</h3>
          <p className="text-sm text-gray-500">
            Upload a CSV file with product data to replace the default products
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            
            <Button 
              variant={uploadSuccess ? "default" : "outline"}
              className={`w-full ${uploadSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Uploading...
                </span>
              ) : uploadSuccess ? (
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Upload Complete
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Select CSV File
                </span>
              )}
            </Button>
          </label>
        </div>
        
        {error && (
          <div className="mt-3 text-red-500 text-sm flex items-center justify-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Required columns: id, name, brand, price, image, category, carbonFootprint</p>
          <p>Optional columns: isNew, isSustainable</p>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
