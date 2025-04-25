import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroAnimation from './HeroAnimation';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/education');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <HeroAnimation />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block text-white backdrop-blur-sm">Your Gateway to</span>
                <span className="block gradient-text backdrop-blur-sm">Web3 World</span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 backdrop-blur-sm">
                Start your Web3 journey with confidence. Get access to trusted resources, real-time analytics, and a supportive community.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={handleStartLearning}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Hero;