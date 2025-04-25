import React, { useState } from 'react';
import { Play, Clock, Tag, ExternalLink } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  url: string;
  creator: string;
  platform: string;
}

interface Category {
  id: string;
  title: string;
  tutorials: Tutorial[];
}

const tutorialData: Category[] = [
  {
    id: 'blockchain-basics',
    title: 'Blockchain Fundamentals',
    tutorials: [
      {
        id: 'blockchain-tech-explained',
        title: 'Blockchain Technology Explained',
        description: 'A comprehensive introduction to blockchain technology, covering its core concepts, history, and real-world applications.',
        thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a',
        duration: '32:15',
        level: 'Beginner',
        tags: ['Blockchain', 'Cryptocurrency', 'Technology'],
        url: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
        creator: '3Blue1Brown',
        platform: 'YouTube'
      },
      {
        id: 'how-bitcoin-works',
        title: 'How Bitcoin Actually Works',
        description: 'Deep dive into the technical aspects of Bitcoin, including cryptography, mining, and consensus mechanisms.',
        thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
        duration: '45:30',
        level: 'Intermediate',
        tags: ['Bitcoin', 'Cryptography', 'Mining'],
        url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4',
        creator: '3Blue1Brown',
        platform: 'YouTube'
      }
    ]
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contract Development',
    tutorials: [
      {
        id: 'solidity-basics',
        title: 'Solidity Programming Basics',
        description: 'Learn the fundamentals of Solidity programming language for creating smart contracts on Ethereum.',
        thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
        duration: '1:15:00',
        level: 'Beginner',
        tags: ['Solidity', 'Ethereum', 'Smart Contracts'],
        url: 'https://www.youtube.com/watch?v=ipwxYa-F1uY',
        creator: 'Dapp University',
        platform: 'YouTube'
      },
      {
        id: 'defi-smart-contracts',
        title: 'Building DeFi Smart Contracts',
        description: 'Advanced tutorial on creating secure and efficient smart contracts for decentralized finance applications.',
        thumbnail: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28',
        duration: '2:30:00',
        level: 'Advanced',
        tags: ['DeFi', 'Smart Contracts', 'Security'],
        url: 'https://www.youtube.com/watch?v=M576WGiDBdQ',
        creator: 'Eat the Blocks',
        platform: 'YouTube'
      }
    ]
  },
  {
    id: 'web3-development',
    title: 'Web3 Development',
    tutorials: [
      {
        id: 'react-dapp',
        title: 'Building a React DApp',
        description: 'Step-by-step guide to creating a decentralized application using React and Web3.js.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        duration: '1:45:00',
        level: 'Intermediate',
        tags: ['React', 'Web3.js', 'DApp'],
        url: 'https://www.youtube.com/watch?v=a0osIaAOFSE',
        creator: 'Nader Dabit',
        platform: 'YouTube'
      },
      {
        id: 'nft-marketplace',
        title: 'Create an NFT Marketplace',
        description: 'Complete tutorial on building a full-featured NFT marketplace with smart contracts and frontend.',
        thumbnail: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d',
        duration: '3:00:00',
        level: 'Advanced',
        tags: ['NFT', 'Marketplace', 'Full Stack'],
        url: 'https://www.youtube.com/watch?v=GKJBEEXUha0',
        creator: 'Clever Programmer',
        platform: 'YouTube'
      }
    ]
  },
  {
    id: 'defi-tutorials',
    title: 'DeFi & Trading',
    tutorials: [
      {
        id: 'defi-explained',
        title: 'DeFi Fundamentals',
        description: 'Understanding decentralized finance, its components, and how to participate in the DeFi ecosystem.',
        thumbnail: 'https://images.unsplash.com/photo-1634704784915-aacf363b021f',
        duration: '55:20',
        level: 'Beginner',
        tags: ['DeFi', 'Finance', 'Yield Farming'],
        url: 'https://www.youtube.com/watch?v=17QRFlml4pA',
        creator: 'Finematics',
        platform: 'YouTube'
      },
      {
        id: 'trading-strategies',
        title: 'Crypto Trading Strategies',
        description: 'Learn essential trading strategies and risk management techniques for cryptocurrency markets.',
        thumbnail: 'https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80',
        duration: '1:25:00',
        level: 'Intermediate',
        tags: ['Trading', 'Analysis', 'Risk Management'],
        url: 'https://www.youtube.com/watch?v=xFkDnS2GSuE',
        creator: 'Benjamin Cowen',
        platform: 'YouTube'
      }
    ]
  }
];

const TutorialsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTutorials = (tutorials: Tutorial[]) => {
    return tutorials.filter(tutorial => {
      const matchesLevel = selectedLevel === 'all' || tutorial.level.toLowerCase() === selectedLevel;
      const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesLevel && matchesSearch;
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Web3 Video Tutorials</h1>
          <p className="mt-2 text-base text-gray-400">
            Learn Web3 development through curated video tutorials
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tutorials..."
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedLevel === level
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial Categories */}
        <div className="space-y-8">
          {tutorialData.map((category) => {
            const filteredTutorials = filterTutorials(category.tutorials);
            if (filteredTutorials.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-2xl font-bold text-white mb-4">{category.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTutorials.map((tutorial) => (
                    <a
                      key={tutorial.id}
                      href={tutorial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300 overflow-hidden group"
                    >
                      <div className="relative">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm px-2 py-1 rounded ${
                            tutorial.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                            tutorial.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tutorial.level}
                          </span>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {tutorial.duration}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400">
                          {tutorial.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          {tutorial.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tutorial.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            By {tutorial.creator}
                          </span>
                          <span className="flex items-center text-primary-400 group-hover:text-primary-300">
                            Watch on {tutorial.platform}
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;