
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Product } from './ProductCard';
import { getProductsByCategory } from '../utils/productData';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  products?: Product[];
}

enum ChatStage {
  Initial,
  CategorySelected,
  PreferenceSelected,
  SizeSelected,
  Recommendations
}

const ProductChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatStage, setChatStage] = useState<ChatStage>(ChatStage.Initial);
  const [category, setCategory] = useState<string | null>(null);
  const [preference, setPreference] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initial chatbot greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "👋 Hi there! I'm your ECOSwap assistant. I can help you find sustainable fashion items. What are you looking for today? (Women's clothing, Men's clothing, or Accessories)",
          sender: 'bot'
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Process user input based on current chat stage
    setTimeout(() => {
      processUserInput(inputText);
    }, 500);
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    switch (chatStage) {
      case ChatStage.Initial:
        if (lowerInput.includes('women') || lowerInput.includes('woman') || lowerInput.includes('female')) {
          setCategory('women');
          setChatStage(ChatStage.CategorySelected);
          askForPreference('women');
        } else if (lowerInput.includes('men') || lowerInput.includes('man') || lowerInput.includes('male')) {
          setCategory('men');
          setChatStage(ChatStage.CategorySelected);
          askForPreference('men');
        } else if (lowerInput.includes('accessory') || lowerInput.includes('accessories')) {
          setCategory('accessories');
          setChatStage(ChatStage.CategorySelected);
          askForPreference('accessories');
        } else {
          // If category not recognized, ask again
          addBotMessage("I'm not sure I understand. Are you looking for Women's clothing, Men's clothing, or Accessories?");
        }
        break;

      case ChatStage.CategorySelected:
        // Process preferences (sustainable, low carbon, price)
        setPreference(lowerInput);
        setChatStage(ChatStage.PreferenceSelected);
        askForSize();
        break;

      case ChatStage.PreferenceSelected:
        // Process size preference
        setSize(lowerInput);
        setChatStage(ChatStage.Recommendations);
        provideRecommendations();
        break;

      case ChatStage.Recommendations:
        // Handle follow-up questions or start over
        if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
          addBotMessage("You're welcome! Happy sustainable shopping! Is there anything else I can help you with?");
        } else if (lowerInput.includes('yes') || lowerInput.includes('start over') || lowerInput.includes('new')) {
          setChatStage(ChatStage.Initial);
          setCategory(null);
          setPreference(null);
          setSize(null);
          addBotMessage("Let's start over! What are you looking for today? (Women's clothing, Men's clothing, or Accessories)");
        } else if (lowerInput.includes('no') || lowerInput.includes('bye')) {
          addBotMessage("Alright! Feel free to ask if you need anything else. Happy sustainable shopping!");
        } else {
          addBotMessage("I'd be happy to help you find something else or refine these recommendations. Would you like to start a new search?");
        }
        break;
    }
  };

  const askForPreference = (category: string) => {
    const categoryText = category === 'accessories' ? category : `${category}'s clothing`;
    addBotMessage(`Great! What kind of ${categoryText} are you looking for? Please describe your preferences (sustainable materials, low carbon footprint, price range, etc.)`);
  };

  const askForSize = () => {
    addBotMessage("What size are you looking for? (XS, S, M, L, XL)");
  };

  const provideRecommendations = () => {
    // Filter products based on category
    let products = getProductsByCategory(category || 'women');
    
    // Further filter based on preference (simple keyword matching)
    if (preference) {
      const lowerPreference = preference.toLowerCase();
      
      // Filter by sustainability if mentioned
      if (lowerPreference.includes('sustainable') || lowerPreference.includes('eco')) {
        products = products.filter(p => p.isSustainable);
      }
      
      // Filter by carbon footprint if mentioned
      if (lowerPreference.includes('carbon') || lowerPreference.includes('footprint') || lowerPreference.includes('green')) {
        products = products.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
      }
      
      // Filter by price mentions
      if (lowerPreference.includes('cheap') || lowerPreference.includes('inexpensive') || lowerPreference.includes('low price')) {
        products = products.sort((a, b) => a.price - b.price);
      } else if (lowerPreference.includes('expensive') || lowerPreference.includes('high end') || lowerPreference.includes('premium')) {
        products = products.sort((a, b) => b.price - a.price);
      }
    }
    
    // Take top 3 products
    const topProducts = products.slice(0, 3);
    setSuggestedProducts(topProducts);
    
    // Add bot message with recommendations
    addBotMessage(
      `Based on your preferences, I recommend these items. These have been selected with sustainability in mind:`,
      topProducts
    );
    
    // Add follow-up question
    setTimeout(() => {
      addBotMessage("Would you like to see more options or refine your search?");
    }, 1000);
  };

  const addBotMessage = (text: string, products?: Product[]) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'bot',
      products
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg z-40 hover:bg-primary/90 transition-all"
        onClick={toggleChat}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full sm:w-96 h-[500px] bg-white rounded-lg shadow-xl z-40 flex flex-col overflow-hidden border border-border">
          {/* Chat header */}
          <div className="bg-primary px-4 py-3 text-white flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h3 className="font-medium">ECOSwap Assistant</h3>
            </div>
            <button onClick={toggleChat}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  
                  {/* Product recommendations */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.products.map((product) => (
                        <Link 
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-start bg-white rounded-md p-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-12 h-12 rounded overflow-hidden mr-2">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-medium text-gray-900">{product.name}</h4>
                            <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-600 mr-1">Carbon Score:</span>
                              <span className={`text-xs font-medium ${
                                product.carbonFootprint < 5 ? 'text-green-600' : 
                                product.carbonFootprint < 10 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {product.carbonFootprint.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="border-t border-border p-3 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-primary text-white rounded-md p-2"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductChatbot;
