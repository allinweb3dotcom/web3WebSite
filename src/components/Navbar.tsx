import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { ConnectWallet } from "@thirdweb-dev/react";

const Navbar = () => {
  const { address, disconnect, isConnecting, error } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAIMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsAIMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/news', label: 'News' },
    { path: '/analysis', label: 'Analysis' },
    { path: '/tools', label: 'Tools' },
    { path: '/education', label: 'Education' },
    { path: '/tutorials', label: 'Tutorials' },
    { path: '/products', label: 'Products' },
  ];

  const aiTools = [
    { path: '/aichat', label: 'AI Chat' },
    { path: '/rugcheck', label: 'Sol RugCheck' },
    { path: '/bnbrugcheck', label: 'BNB RugCheck' },
    { path: '/ethrugcheck', label: 'ETH RugCheck' },
  ];

  const handleAIToolClick = (path: string) => {
    navigate(path);
    setIsAIMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-transparent backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Wallet className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold text-white">
                AllInWeb3
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path) ? 'text-primary-400' : 'text-gray-300'
                } hover:text-primary-400 transition-colors`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAIMenuOpen(!isAIMenuOpen)}
                className={`flex items-center space-x-1 ${
                  aiTools.some((tool) => isActive(tool.path))
                    ? 'text-primary-400'
                    : 'text-gray-300'
                } hover:text-primary-400 transition-colors focus:outline-none`}
              >
                <span>AI</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isAIMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isAIMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-1 z-50">
                  {aiTools.map((tool) => (
                    <button
                      key={tool.path}
                      onClick={() => handleAIToolClick(tool.path)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isActive(tool.path)
                          ? 'text-primary-400 bg-gray-700'
                          : 'text-gray-300'
                      } hover:bg-gray-700 hover:text-primary-400 transition-colors`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {address ? (
              <div className="relative group">
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  {shortenAddress(address)}
                </button>
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={disconnect}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <ConnectWallet
                theme="dark"
                btnTitle="Connect Wallet"
                modalTitle="Connect Your Wallet"
                modalTitleIconUrl="/icon.svg"
                modalSize="compact"
                welcomeScreen={{
                  title: "Welcome to AllInWeb3",
                  subtitle: "Connect your wallet to get started",
                }}
                style={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-b border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="px-3 py-2">
            <div className="text-sm font-medium text-gray-400 mb-2">AI</div>
            {aiTools.map((tool) => (
              <button
                key={tool.path}
                onClick={() => handleAIToolClick(tool.path)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActive(tool.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>

          <div className="px-3 py-2">
            {address ? (
              <div className="space-y-2">
                <div className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg text-center">
                  {shortenAddress(address)}
                </div>
                <button
                  onClick={disconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <ConnectWallet
                theme="dark"
                btnTitle="Connect Wallet"
                modalTitle="Connect Your Wallet"
                modalTitleIconUrl="/icon.svg"
                modalSize="compact"
                welcomeScreen={{
                  title: "Welcome to AllInWeb3",
                  subtitle: "Connect your wallet to get started",
                }}
                style={{
                  width: "100%",
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;