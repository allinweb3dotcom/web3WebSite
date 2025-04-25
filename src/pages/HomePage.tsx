import React from 'react';
import { BarChart3, Book, Compass, Layout, Users } from 'lucide-react';
import Hero from '../components/Hero';
import DataDashboard from '../components/DataDashboard';
import FeatureSection from '../components/FeatureSection';

const HomePage = () => {
  const features = [
    {
      icon: <Book className="w-6 h-6" />,
      title: "Educational Resources",
      description: "Comprehensive guides and tutorials to help you understand Web3 fundamentals"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Market Analytics",
      description: "Real-time blockchain data and market insights at your fingertips"
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Tool Navigator",
      description: "Curated collection of trusted Web3 tools and platforms"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Join a growing community of Web3 enthusiasts and experts"
    }
  ];

  return (
    <>
      <Hero />
      <FeatureSection features={features} />
      <DataDashboard />
    </>
  );
};

export default HomePage;