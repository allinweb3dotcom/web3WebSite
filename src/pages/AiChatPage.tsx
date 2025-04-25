import React, { useState, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { qaData } from '../data/aiChatData';
import axios from 'axios';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AiChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your Web3 AI assistant. I can help you with questions about blockchain, cryptocurrency, DeFi, NFTs, and other Web3 topics. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useDeepSeek, setUseDeepSeek] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const generateDeepSeekResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a Web3 expert assistant. Only answer questions related to blockchain, cryptocurrency, DeFi, NFTs, and Web3 technology. For non-Web3 questions, kindly redirect users to ask about Web3 topics.'
            },
            { role: 'user', content: userInput }
          ],
          stream: false
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-**********************************'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      return generateLocalAIResponse(userInput);
    }
  };

  const generateLocalAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    const matchingPair = qaData.find(pair =>
      pair.keywords.some(keyword => input.includes(keyword.toLowerCase()))
    );

    if (matchingPair) {
      return matchingPair.response;
    }

    const topics = qaData.filter(pair =>
      pair.keywords.some(keyword => input.includes(keyword.toLowerCase()))
    );

    if (topics.length > 1) {
      return topics.map(topic => topic.response).join('\n\n');
    }

    return 'I understand you\'re asking about Web3. Could you please be more specific about what you\'d like to know? I can help with topics like:\n\n' +
           '• Blockchain Technology\n' +
           '• Cryptocurrencies\n' +
           '• NFTs (Non-Fungible Tokens)\n' +
           '• DeFi (Decentralized Finance)\n' +
           '• Smart Contracts\n' +
           '• DAOs\n' +
           '• Web3 Wallets\n' +
           '• Mining and Staking\n' +
           '• Layer 2 Solutions\n' +
           '• Tokenomics';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = useDeepSeek 
        ? await generateDeepSeekResponse(input.trim())
        : generateLocalAIResponse(input.trim());

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Web3 AI Assistant</h1>
          <p className="mt-2 text-base text-gray-400">
            Ask me anything about Web3, blockchain, and cryptocurrency
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setUseDeepSeek(false)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                !useDeepSeek
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Use Local AI
            </button>
            <button
              onClick={() => setUseDeepSeek(true)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                useDeepSeek
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Use DeepSeek AI
            </button>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg border border-gray-700 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-primary-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex flex-col space-y-1 max-w-[80%] ${
                    message.type === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-700 rounded-lg px-4 py-2 text-gray-100">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-700 p-4 bg-gray-800 bg-opacity-50 rounded-b-lg"
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Web3, blockchain, crypto..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary-500 text-white rounded-lg px-4 py-2 hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;
