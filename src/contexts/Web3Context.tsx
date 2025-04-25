import React, { createContext, useContext, useState } from 'react';
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  trustWallet,
  useAddress,
  useDisconnect,
  useConnectionStatus,
  Chain,
} from "@thirdweb-dev/react";

interface Web3ContextType {
  address: string | undefined;
  isConnecting: boolean;
  error: string | null;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  address: undefined,
  isConnecting: false,
  error: null,
  disconnect: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

const supportedChains: Chain[] = [
  {
    chainId: 1,
    chain: "ETH",
    name: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpc: ["https://ethereum.rpc.thirdweb.com"],
    shortName: "eth",
    slug: "ethereum",
    testnet: false,
    block_explorer_url: "https://etherscan.io",
  },
  {
    chainId: 56,
    chain: "BSC",
    name: "BNB Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpc: ["https://binance.rpc.thirdweb.com"],
    shortName: "bsc",
    slug: "binance",
    testnet: false,
    block_explorer_url: "https://bscscan.com",
  },
  {
    chainId: 137,
    chain: "MATIC",
    name: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpc: ["https://polygon.rpc.thirdweb.com"],
    shortName: "matic",
    slug: "polygon",
    testnet: false,
    block_explorer_url: "https://polygonscan.com",
  },
];

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId="d7d9d4490f4ad653f0e3d7d9c8f1e2c4"
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect({
          projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
          qrModalOptions: {
            themeMode: "dark",
            themeVariables: {
              "--w3m-z-index": "9999",
              "--w3m-background-color": "#1a1b1f",
              "--w3m-accent-color": "#FF6B6B",
              "--w3m-text-color": "#ffffff",
            },
          },
        }),
        trustWallet(),
      ]}
      dAppMeta={{
        name: "AllInWeb3",
        description: "Your Gateway to Web3 World",
        logoUrl: "/icon.svg",
        url: "https://allinweb3.com",
      }}
    >
      <Web3ContextInner>{children}</Web3ContextInner>
    </ThirdwebProvider>
  );
};

const Web3ContextInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value = {
    address,
    isConnecting: connectionStatus === "connecting",
    error,
    disconnect,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};