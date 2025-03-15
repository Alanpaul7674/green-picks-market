
import { Product } from '../components/ProductCard';
import { products } from './productData';

// This is a publishable project key provided by the user
const OPENAI_API_KEY = "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";

// System prompt with product information
const generateSystemPrompt = () => {
  const productInfo = products.map(p => (
    `Product ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand}, Category: ${p.category}, ` +
    `Price: $${p.price}, Carbon Footprint: ${p.carbonFootprint}, ` +
    `Sustainable: ${p.isSustainable ? 'Yes' : 'No'}, New: ${p.isNew ? 'Yes' : 'No'}`
  )).join('\n');

  return `You are a helpful fashion assistant for ECOSwap, a sustainable fashion marketplace.
Your goal is to help users find products that match their needs while emphasizing sustainability.
Respond conversationally and suggest specific products from our catalog.

Available products:
${productInfo}

You should:
1. Ask clarifying questions about preferences (style, size, price range, sustainability importance)
2. Recommend specific products by ID from our catalog that match their needs
3. Explain why your recommendations are sustainable choices
4. Answer questions about sustainability, materials, and fashion in general
5. Be friendly and helpful
6. Never mention that you're an AI or that you're using an API`;
};

// Chat completion function
export const getChatCompletion = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: generateSystemPrompt() },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "I'm having trouble connecting right now. Could you please try again in a moment?";
  }
};

// Function to extract product IDs from AI response
export const extractProductIds = (text: string): number[] => {
  // Match patterns like "Product ID: 1", "product id 3", "product #5", etc.
  const idRegex = /product(?:\s+id)?(?:\s*[:=#]\s*)(\d+)/gi;
  const matches = [...text.matchAll(idRegex)];
  
  // Extract the IDs and convert to numbers
  return matches
    .map(match => parseInt(match[1], 10))
    .filter(id => !isNaN(id) && products.some(p => p.id === id));
};

// Function to get recommended products from AI response
export const getRecommendedProducts = (text: string): Product[] => {
  const ids = extractProductIds(text);
  return ids.map(id => products.find(p => p.id === id)!).filter(Boolean);
};
