
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Product } from './ProductCard';
import { Link } from 'react-router-dom';
import { getChatCompletion, getRecommendedProducts } from '../utils/openaiService';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  products?: Product[];
}

const ProductChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initial chatbot greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "👋 Hi there! I'm your ECOSwap assistant. I can help you find sustainable fashion items. What are you looking for today?",
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

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Add user message to chat history
    const updatedHistory = [...chatHistory, { role: 'user', content: inputText }];
    setChatHistory(updatedHistory);

    try {
      // Show typing indicator
      const typingId = Date.now().toString() + '-typing';
      setMessages(prev => [...prev, { id: typingId, text: '...', sender: 'bot' }]);

      // Get response from OpenAI
      const aiResponse = await getChatCompletion(updatedHistory);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));
      
      // Extract recommended products
      const recommendedProducts = getRecommendedProducts(aiResponse);
      
      // Add bot response to chat history
      setChatHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);
      
      // Add bot message with response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'bot',
        products: recommendedProducts.length > 0 ? recommendedProducts : undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Connection error",
        description: "Could not connect to the assistant. Please try again.",
        variant: "destructive"
      });
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== Date.now().toString() + '-typing'));
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className={`ml-2 bg-primary text-white rounded-md p-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              disabled={isLoading}
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
