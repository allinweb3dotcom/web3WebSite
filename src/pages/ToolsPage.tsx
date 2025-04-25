import React, { useRef, useState } from 'react';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { toolsData } from '../data/toolsData';

const ToolsPage = () => {
  const [activeCategory, setActiveCategory] = useState(toolsData[0].id);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(categoryId);
    }
  };

  // Handle scroll events to update active category
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100; // Offset for header

    for (const category of toolsData) {
      const element = categoryRefs.current[category.id];
      if (element) {
        const { top, bottom } = element.getBoundingClientRect();
        if (top <= 100 && bottom >= 100) {
          setActiveCategory(category.id);
          break;
        }
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen py-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex">
        {/* Tools Grid */}
        <div className="flex-1 pr-4">
          {toolsData.map((category) => (
            <div
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="mb-12"
              id={category.id}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 border border-gray-700 hover:border-primary-500 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={tool.logo}
                        alt={tool.name}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white truncate group-hover:text-primary-400">
                            {tool.name}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-400" />
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation */}
        <div className="w-48 flex-shrink-0">
          <div className="sticky top-24 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-2 border border-gray-700">
            <nav className="space-y-0.5">
              {toolsData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md flex items-center justify-between text-sm transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${
                    activeCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;