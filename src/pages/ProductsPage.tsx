import React from 'react';
import { 
  Briefcase, 
  Code, 
  LineChart, 
  Megaphone, 
  Palette, 
  Users,
  Mail,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: <Briefcase className="h-6 w-6 text-white" />,
    title: "Financing Services",
    description: "Comprehensive financing solutions including:",
    features: [
      "Project Valuation & Financial Planning",
      "Investor Relations & Pitch Preparation",
      "Due Diligence Support",
      "Financing Strategy Development",
      "Investment Term Negotiation"
    ]
  },
  {
    icon: <Code className="h-6 w-6 text-white" />,
    title: "Product Development",
    description: "Professional Web3 product development services covering:",
    features: [
      "Smart Contract Development & Audit",
      "DApp Frontend Development",
      "Blockchain Architecture Design",
      "Product Prototype Design",
      "Technical Consulting & Support"
    ]
  },
  {
    icon: <LineChart className="h-6 w-6 text-white" />,
    title: "Strategic Planning",
    description: "Help projects establish clear development strategies:",
    features: [
      "Market Analysis & Positioning",
      "Competitor Analysis",
      "Business Model Optimization",
      "Development Roadmap Planning",
      "Risk Management Strategy"
    ]
  },
  {
    icon: <Megaphone className="h-6 w-6 text-white" />,
    title: "Marketing",
    description: "Comprehensive marketing solutions:",
    features: [
      "Marketing Strategy Development",
      "Social Media Operations",
      "Content Marketing Planning",
      "KOL Resource Connection",
      "Event Planning & Execution"
    ]
  },
  {
    icon: <Palette className="h-6 w-6 text-white" />,
    title: "Brand Building",
    description: "Professional brand development services:",
    features: [
      "Brand Positioning & Design",
      "Visual Identity System",
      "Brand Story Creation",
      "User Experience Optimization",
      "Brand Asset Management"
    ]
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "Community Operations",
    description: "Professional community building and operations:",
    features: [
      "Community Strategy Planning",
      "Community Event Organization",
      "User Incentive Mechanisms",
      "Community Governance Solutions",
      "Crisis PR Management"
    ]
  }
];

const ProductsPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Comprehensive Web3 Service Solutions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From project incubation to brand building, we provide end-to-end Web3 project support to help your venture succeed in the Web3 space
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md shadow-lg mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <ArrowRight className="w-4 h-4 text-primary-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300">
              No matter what stage your project is at, we can provide professional solutions to help you succeed
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <span className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md shadow-lg">
              <Mail className="w-5 h-5 text-white" />
            </span>
            <a 
              href="mailto:support@allinweb3.com"
              className="text-lg text-primary-400 hover:text-primary-300 transition-colors"
            >
              support@allinweb3.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;