export interface QAPair {
  keywords: string[];
  response: string;
}

export const qaData: QAPair[] = [
  {
    keywords: ['blockchain', 'what is blockchain', 'explain blockchain'],
    response: 'A blockchain is a distributed, decentralized ledger that records transactions across a network of computers. Each block contains transaction data and is linked to previous blocks, forming a chain. Key features include:\n\n• Immutability: Once recorded, data cannot be changed\n• Transparency: All transactions are publicly visible\n• Decentralization: No single entity controls the network\n• Security: Uses cryptography to protect data\n• Consensus: Network participants must agree on the state of the ledger'
  },
  {
    keywords: ['nft', 'what are nfts', 'non fungible token'],
    response: 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items or content on the blockchain. Key aspects include:\n\n• Uniqueness: Each NFT is one-of-a-kind\n• Digital Ownership: Verifiable ownership of digital assets\n• Use Cases: Digital art, collectibles, gaming items, virtual real estate\n• Standards: Most NFTs use ERC-721 or ERC-1155 standards\n• Marketplaces: Can be bought and sold on platforms like OpenSea'
  },
  {
    keywords: ['defi', 'decentralized finance', 'what is defi'],
    response: 'DeFi (Decentralized Finance) is a financial system built on blockchain technology that operates without traditional intermediaries. Key components include:\n\n• Lending/Borrowing: Platforms like Aave and Compound\n• DEXs: Decentralized exchanges like Uniswap\n• Yield Farming: Earning rewards by providing liquidity\n• Stablecoins: Cryptocurrencies pegged to fiat currencies\n• Smart Contracts: Automated financial operations'
  },
  {
    keywords: ['wallet', 'crypto wallet', 'web3 wallet'],
    response: 'A Web3 wallet is your digital identity and gateway to blockchain applications. Features include:\n\n• Private Key Management: Secure storage of your crypto assets\n• DApp Interaction: Connect to decentralized applications\n• Transaction Signing: Authorize blockchain transactions\n• Token Management: Store and manage various cryptocurrencies\n• Popular Options: MetaMask, Trust Wallet, Phantom'
  },
  {
    keywords: ['smart contract', 'what are smart contracts'],
    response: 'Smart contracts are self-executing programs stored on a blockchain that automatically execute when predetermined conditions are met. Key features:\n\n• Automation: No intermediaries needed\n• Transparency: Code is visible on the blockchain\n• Immutability: Cannot be changed once deployed\n• Use Cases: DeFi, NFTs, DAOs\n• Popular Platforms: Ethereum, Solana, BSC'
  },
  {
    keywords: ['dao', 'decentralized autonomous organization'],
    response: 'A DAO (Decentralized Autonomous Organization) is an organization represented by rules encoded as computer programs, transparent and controlled by network participants. Characteristics include:\n\n• Governance: Token holders vote on proposals\n• Transparency: All rules and transactions are public\n• Automation: Smart contracts execute decisions\n• Community-Driven: Members control the organization\n• Use Cases: Investment, protocol governance, social communities'
  },
  {
    keywords: ['gas', 'gas fees', 'transaction fees'],
    response: 'Gas fees are transaction costs paid to network validators for processing operations on a blockchain. Important aspects:\n\n• Purpose: Compensate validators and prevent spam\n• Variability: Fees change based on network congestion\n• Calculation: Gas price × Gas limit\n• Optimization: Various strategies to reduce fees\n• Different Networks: Each blockchain has its own fee structure'
  },
  {
    keywords: ['mining', 'crypto mining', 'how mining works'],
    response: 'Cryptocurrency mining is the process of validating transactions and adding new blocks to a blockchain using computational power. Key concepts:\n\n• Proof of Work: Common consensus mechanism\n• Hardware: Specialized equipment (ASICs, GPUs)\n• Energy Consumption: Significant power usage\n• Mining Pools: Groups of miners working together\n• Block Rewards: Miners receive cryptocurrency rewards'
  },
  {
    keywords: ['staking', 'what is staking', 'proof of stake'],
    response: 'Staking is the process of locking up cryptocurrency to support a blockchain network and earn rewards. Important aspects:\n\n• Proof of Stake: Alternative to mining\n• Validator Role: Stake holders validate transactions\n• Rewards: Earn passive income through staking\n• Requirements: Minimum stake amounts vary\n• Risks: Slashing for malicious behavior'
  },
  {
    keywords: ['layer 2', 'l2', 'scaling solutions'],
    response: 'Layer 2 solutions are protocols built on top of existing blockchains to improve scalability and efficiency. Features include:\n\n• Increased Transaction Speed\n• Lower Gas Fees\n• Types: Rollups, State Channels, Sidechains\n• Popular Solutions: Optimism, Arbitrum, Polygon\n• Maintains Base Layer Security'
  },
  {
    keywords: ['web3', 'what is web3'],
    response: 'Web3 represents the next evolution of the internet, built on decentralized networks. Key characteristics:\n\n• Decentralization: No central authority\n• User Ownership: Control over data and assets\n• Permissionless: Open access for everyone\n• Token-Based: Native digital payments\n• Trustless: No need for intermediaries'
  },
  {
    keywords: ['defi yield', 'yield farming', 'liquidity mining'],
    response: 'Yield farming is a method of earning rewards by providing liquidity to DeFi protocols. Key concepts:\n\n• Liquidity Pools: Provide assets to trading pairs\n• APY/APR: Return on investment metrics\n• Impermanent Loss: Risk of providing liquidity\n• Protocol Rewards: Earn native tokens\n• Strategies: Single-sided, LP tokens, leverage'
  },
  {
    keywords: ['tokenomics', 'token economics'],
    response: 'Tokenomics refers to the economic model of a cryptocurrency or token. Important aspects:\n\n• Supply: Total, circulating, and maximum supply\n• Distribution: How tokens are allocated\n• Utility: Token use cases and value drivers\n• Incentives: Rewards and staking mechanisms\n• Vesting: Token unlock schedules'
  }
];