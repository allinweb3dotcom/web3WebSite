import React, { useState } from 'react';
import { Book, ChevronRight, ExternalLink } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  content: string;
  resources: {
    title: string;
    url: string;
    description: string;
  }[];
}

interface Category {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

const educationData: Category[] = [
  {
    id: 'basics',
    title: 'Web3 Basics',
    description: 'Fundamental concepts of Web3 and blockchain technology',
    topics: [
      {
        id: 'blockchain-intro',
        title: 'Introduction to Blockchain',
        content: `Blockchain is a distributed, decentralized ledger that records transactions across a network of computers. Unlike traditional databases, blockchain is:

• Decentralized: No single entity controls the network
• Immutable: Once recorded, data cannot be changed
• Transparent: All transactions are publicly visible
• Secure: Uses cryptography to protect data

Key Components of Blockchain:
• Blocks: Containers for transaction data
• Hash Functions: Cryptographic tools for data integrity
• Consensus Mechanisms: Rules for network agreement
• Nodes: Network participants maintaining the blockchain
• Mining/Validation: Process of creating new blocks

Applications of Blockchain:
• Cryptocurrencies
• Smart Contracts
• Decentralized Applications (dApps)
• Supply Chain Management
• Digital Identity`,
        resources: [
          {
            title: 'Bitcoin Whitepaper',
            url: 'https://bitcoin.org/bitcoin.pdf',
            description: 'The original document that introduced blockchain technology'
          },
          {
            title: 'Blockchain Demo',
            url: 'https://andersbrownworth.com/blockchain/',
            description: 'Interactive visualization of blockchain concepts'
          },
          {
            title: 'Web3 Foundation',
            url: 'https://web3.foundation/',
            description: 'Research and development of Web3 technologies'
          }
        ]
      },
      {
        id: 'crypto-wallets',
        title: 'Cryptocurrency Wallets',
        content: `A cryptocurrency wallet is your gateway to the blockchain world. It allows you to:

• Store and manage your digital assets
• Send and receive cryptocurrencies
• Interact with decentralized applications (dApps)
• Sign transactions and messages

Types of Wallets:
• Hot Wallets: Connected to the internet (MetaMask, Trust Wallet)
• Cold Wallets: Offline storage devices (Ledger, Trezor)
• Paper Wallets: Physical documents containing keys
• Smart Contract Wallets: Enhanced security and features

Security Best Practices:
• Never share your private keys or seed phrase
• Use hardware wallets for large amounts
• Enable two-factor authentication
• Regular backup of wallet information
• Verify all transaction details before signing`,
        resources: [
          {
            title: 'MetaMask Setup Guide',
            url: 'https://metamask.io/getting-started',
            description: 'Learn how to set up your first Web3 wallet'
          },
          {
            title: 'Wallet Security Best Practices',
            url: 'https://ethereum.org/en/security',
            description: 'Essential security tips for protecting your assets'
          },
          {
            title: 'Hardware Wallet Guide',
            url: 'https://www.ledger.com/academy',
            description: 'Understanding hardware wallet security'
          }
        ]
      },
      {
        id: 'web3-concepts',
        title: 'Core Web3 Concepts',
        content: `Web3 represents the next evolution of the internet, built on decentralized networks. Key concepts include:

Fundamental Principles:
• Decentralization: Distributed control and decision-making
• Trustlessness: No need for intermediaries
• Permissionless: Open access for all
• Native Payments: Built-in economic layer
• Self-Sovereign Identity: User-controlled identity

Technical Components:
• Smart Contracts: Self-executing code
• Tokens: Digital assets and rights
• Oracles: External data providers
• Layer 1 & Layer 2: Scaling solutions
• Interoperability: Cross-chain communication

Impact Areas:
• Digital Economy
• Creator Economy
• Gaming and Entertainment
• Social Networks
• Governance Systems`,
        resources: [
          {
            title: 'Web3 Foundation',
            url: 'https://web3.foundation/about/',
            description: 'Understanding Web3 vision and technology'
          },
          {
            title: 'Ethereum.org',
            url: 'https://ethereum.org/en/web3/',
            description: 'Comprehensive Web3 learning resources'
          },
          {
            title: 'Web3 University',
            url: 'https://www.web3.university/',
            description: 'Educational platform for Web3 development'
          }
        ]
      }
    ]
  },
  {
    id: 'defi',
    title: 'Decentralized Finance (DeFi)',
    description: 'Understanding the new financial system built on blockchain',
    topics: [
      {
        id: 'defi-intro',
        title: 'Introduction to DeFi',
        content: `Decentralized Finance (DeFi) represents a new financial system built on blockchain technology. Key concepts include:

Core Components:
• Smart Contracts: Automated financial operations
• Liquidity Pools: Decentralized trading
• Yield Generation: Earning passive income
• Governance: Community-driven decision making
• Risk Management: Understanding and mitigating risks

Popular DeFi Categories:
• Decentralized Exchanges (DEX)
• Lending and Borrowing Platforms
• Yield Aggregators
• Derivatives
• Insurance Protocols

DeFi Advantages:
• Permissionless Access
• Transparency
• Composability
• 24/7 Operation
• Global Accessibility`,
        resources: [
          {
            title: 'DeFi Pulse',
            url: 'https://defipulse.com',
            description: 'Track DeFi statistics and trends'
          },
          {
            title: 'Uniswap Documentation',
            url: 'https://docs.uniswap.org',
            description: 'Learn about decentralized exchanges'
          },
          {
            title: 'DeFi Safety',
            url: 'https://docs.defisafety.com/',
            description: 'Security considerations in DeFi'
          }
        ]
      },
      {
        id: 'yield-farming',
        title: 'Yield Farming and Liquidity',
        content: `Yield farming is a method of earning rewards by providing liquidity to DeFi protocols. Understanding key concepts:

Yield Farming Mechanics:
• Liquidity Provision
• Token Rewards
• Protocol Incentives
• Yield Optimization
• Risk Assessment

Important Metrics:
• Annual Percentage Rate (APR)
• Annual Percentage Yield (APY)
• Total Value Locked (TVL)
• Impermanent Loss
• Protocol Revenue

Advanced Strategies:
• Multi-Pool Farming
• Leverage Farming
• Flash Loans
• Auto-Compounding
• Risk Hedging`,
        resources: [
          {
            title: 'Compound Guide',
            url: 'https://compound.finance/docs',
            description: 'Learn about lending and borrowing in DeFi'
          },
          {
            title: 'Aave Documentation',
            url: 'https://docs.aave.com',
            description: 'Understanding liquidity protocols'
          },
          {
            title: 'DeFi Rate',
            url: 'https://defirate.com/',
            description: 'Compare yields across DeFi protocols'
          }
        ]
      },
      {
        id: 'defi-security',
        title: 'DeFi Security and Risks',
        content: `Understanding and managing risks in DeFi is crucial for successful participation. Key areas include:

Common Risks:
• Smart Contract Vulnerabilities
• Oracle Failures
• Economic Attacks
• Governance Attacks
• Regulatory Risks

Security Best Practices:
• Due Diligence on Protocols
• Risk Diversification
• Regular Monitoring
• Understanding Smart Contracts
• Using Security Tools

Protection Measures:
• DeFi Insurance
• Security Audits
• Multi-Signature Wallets
• Transaction Simulation
• Emergency Procedures`,
        resources: [
          {
            title: 'DeFi Safety',
            url: 'https://defisafety.com/',
            description: 'Protocol security assessments'
          },
          {
            title: 'Rekt News',
            url: 'https://rekt.news/',
            description: 'DeFi security incidents and analysis'
          },
          {
            title: 'Immunefi',
            url: 'https://immunefi.com/learn/',
            description: 'Web3 security education'
          }
        ]
      }
    ]
  },
  {
    id: 'nft',
    title: 'NFTs and Digital Assets',
    description: 'Exploring non-fungible tokens and digital ownership',
    topics: [
      {
        id: 'nft-basics',
        title: 'Understanding NFTs',
        content: `Non-Fungible Tokens (NFTs) represent unique digital assets on the blockchain. Key aspects include:

Fundamental Concepts:
• Non-Fungibility
• Digital Scarcity
• Proof of Ownership
• Metadata Standards
• Token Standards (ERC-721, ERC-1155)

Use Cases:
• Digital Art
• Gaming Assets
• Virtual Real Estate
• Music and Entertainment
• Collectibles
• Identity and Credentials

Technical Components:
• Smart Contracts
• IPFS Storage
• Metadata Standards
• Marketplace Integration
• Royalty Systems`,
        resources: [
          {
            title: 'OpenSea Guide',
            url: 'https://opensea.io/learn',
            description: 'Learn about NFT trading and collection'
          },
          {
            title: 'NFT Standards',
            url: 'https://ethereum.org/en/nft',
            description: 'Technical overview of NFT standards'
          },
          {
            title: 'NFT School',
            url: 'https://nftschool.dev',
            description: 'Comprehensive NFT development guide'
          }
        ]
      },
      {
        id: 'nft-creation',
        title: 'Creating and Selling NFTs',
        content: `Learn the process of creating, minting, and selling NFTs in the digital marketplace:

Creation Process:
• Asset Design and Creation
• Choosing the Right Platform
• Metadata Preparation
• Minting Options
• Marketing Strategy

Technical Considerations:
• File Formats and Sizes
• Storage Solutions
• Gas Optimization
• Royalty Settings
• Platform Fees

Best Practices:
• Quality Assurance
• Community Building
• Pricing Strategy
• Collection Planning
• Legal Compliance`,
        resources: [
          {
            title: 'NFT Artist Guide',
            url: 'https://foundation.app/blog/nft-creator-guide',
            description: 'Complete guide for NFT creators'
          },
          {
            title: 'IPFS Documentation',
            url: 'https://docs.ipfs.io/',
            description: 'Understanding decentralized storage'
          },
          {
            title: 'NFT Marketing Guide',
            url: 'https://nftevening.com/guides/',
            description: 'Marketing strategies for NFT projects'
          }
        ]
      }
    ]
  },
  {
    id: 'dao',
    title: 'DAOs and Governance',
    description: 'Learning about decentralized organizations and governance',
    topics: [
      {
        id: 'dao-intro',
        title: 'Introduction to DAOs',
        content: `Decentralized Autonomous Organizations (DAOs) represent a new way of organizing communities and resources. Key concepts:

Core Components:
• Smart Contract Framework
• Governance Mechanisms
• Token Economics
• Treasury Management
• Proposal Systems

Types of DAOs:
• Protocol DAOs
• Investment DAOs
• Social DAOs
• Service DAOs
• Collector DAOs

Operational Aspects:
• Member Roles
• Voting Systems
• Resource Allocation
• Decision Making
• Risk Management`,
        resources: [
          {
            title: 'DAO Handbook',
            url: 'https://aragon.org/dao',
            description: 'Comprehensive guide to DAO operations'
          },
          {
            title: 'Snapshot',
            url: 'https://docs.snapshot.org',
            description: 'Learn about decentralized voting'
          },
          {
            title: 'DAO Research',
            url: 'https://www.daoresearch.xyz',
            description: 'Academic research on DAOs'
          }
        ]
      },
      {
        id: 'dao-governance',
        title: 'DAO Governance Models',
        content: `Understanding different approaches to DAO governance and decision-making:

Governance Models:
• Token-Based Voting
• Quadratic Voting
• Reputation-Based Systems
• Delegated Voting
• Holographic Consensus

Key Considerations:
• Voter Participation
• Proposal Quality
• Security Measures
• Incentive Alignment
• Scalability

Implementation Strategies:
• Governance Frameworks
• Voting Mechanisms
• Proposal Templates
• Discussion Forums
• Emergency Procedures`,
        resources: [
          {
            title: 'Governance Portal',
            url: 'https://compound.finance/governance',
            description: 'Example of DAO governance in action'
          },
          {
            title: 'Tally Guide',
            url: 'https://docs.tally.xyz',
            description: 'DAO governance toolkit'
          },
          {
            title: 'Commonwealth',
            url: 'https://commonwealth.im',
            description: 'DAO discussion and governance platform'
          }
        ]
      }
    ]
  },
  {
    id: 'development',
    title: 'Web3 Development',
    description: 'Getting started with blockchain development',
    topics: [
      {
        id: 'smart-contracts',
        title: 'Smart Contract Development',
        content: `Smart contracts are self-executing contracts with terms directly written in code. Essential concepts:

Programming Fundamentals:
• Solidity Basics
• Contract Structure
• State Variables
• Functions and Modifiers
• Events and Errors

Security Considerations:
• Common Vulnerabilities
• Best Practices
• Testing Strategies
• Audit Preparation
• Gas Optimization

Development Tools:
• Development Frameworks
• Testing Libraries
• Security Tools
• Deployment Tools
• Monitoring Solutions`,
        resources: [
          {
            title: 'CryptoZombies',
            url: 'https://cryptozombies.io',
            description: 'Interactive Solidity learning platform'
          },
          {
            title: 'Hardhat Documentation',
            url: 'https://hardhat.org/getting-started',
            description: 'Development environment for Ethereum'
          },
          {
            title: 'OpenZeppelin Docs',
            url: 'https://docs.openzeppelin.com',
            description: 'Smart contract security standards'
          }
        ]
      },
      {
        id: 'web3-integration',
        title: 'Web3 Frontend Integration',
        content: `Building user interfaces for blockchain applications requires understanding:

Core Technologies:
• Web3.js/Ethers.js
• React/Next.js Integration
• Wallet Connections
• Transaction Management
• State Management

User Experience:
• Wallet Integration
• Transaction Feedback
• Error Handling
• Gas Estimation
• Network Management

Best Practices:
• Performance Optimization
• Security Measures
• Testing Strategies
• Documentation
• Deployment Process`,
        resources: [
          {
            title: 'Web3.js Documentation',
            url: 'https://web3js.readthedocs.io',
            description: 'JavaScript library for Ethereum'
          },
          {
            title: 'Ethers.js Guide',
            url: 'https://docs.ethers.io',
            description: 'Complete Ethers.js documentation'
          },
          {
            title: 'Wagmi Hooks',
            url: 'https://wagmi.sh',
            description: 'React Hooks for Ethereum'
          }
        ]
      },
      {
        id: 'testing-deployment',
        title: 'Testing and Deployment',
        content: `Comprehensive testing and secure deployment are crucial for Web3 applications:

Testing Approaches:
• Unit Testing
• Integration Testing
• Security Testing
• Performance Testing
• User Testing

Deployment Considerations:
• Network Selection
• Gas Optimization
• Contract Verification
• Upgrade Strategies
• Monitoring Setup

Maintenance:
• Contract Upgrades
• Bug Fixes
• Performance Monitoring
• Security Updates
• Documentation Updates`,
        resources: [
          {
            title: 'Foundry Book',
            url: 'https://book.getfoundry.sh',
            description: 'Modern smart contract testing framework'
          },
          {
            title: 'Tenderly Platform',
            url: 'https://tenderly.co/documentation',
            description: 'Smart contract monitoring and alerting'
          },
          {
            title: 'Alchemy Docs',
            url: 'https://docs.alchemy.com',
            description: 'Web3 development platform'
          }
        ]
      }
    ]
  }
];

const EducationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(educationData[0].id);
  const [selectedTopic, setSelectedTopic] = useState(educationData[0].topics[0].id);

  const currentCategory = educationData.find(cat => cat.id === selectedCategory);
  const currentTopic = currentCategory?.topics.find(topic => topic.id === selectedTopic);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Web3 Education Hub</h1>
          <p className="mt-2 text-base text-gray-400">
            Your comprehensive guide to understanding Web3 technology
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Learning Paths</h2>
              <nav className="space-y-1">
                {educationData.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedTopic(category.topics[0].id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-sm transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <Book className="w-4 h-4 mr-2" />
                      <span className="truncate">{category.title}</span>
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {currentCategory && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg border border-gray-700">
                {/* Topics Navigation */}
                <div className="border-b border-gray-700 p-4">
                  <div className="flex gap-2 flex-wrap">
                    {currentCategory.topics.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedTopic === topic.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Content */}
                {currentTopic && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {currentTopic.title}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      {currentTopic.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-300">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Resources */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Additional Resources
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentTopic.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600 hover:border-primary-500 transition-all duration-300 group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white group-hover:text-primary-400">
                                {resource.title}
                              </h4>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-400" />
                            </div>
                            <p className="text-sm text-gray-400">
                              {resource.description}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;