import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  features: Feature[];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ features }) => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl gradient-text">
            Everything You Need for Web3
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Comprehensive tools and resources to help you navigate the Web3 ecosystem
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="pt-6 h-full">
                <div className="flow-root bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg px-6 pb-8 h-full border border-gray-700">
                  <div className="-mt-6 h-full flex flex-col">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md shadow-lg">
                        {React.cloneElement(feature.icon as React.ReactElement, {
                          className: 'h-6 w-6 text-white'
                        })}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-300 flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;