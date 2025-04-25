import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getAllNews, NewsItem } from '../services/api';
import { formatDate } from '../utils/dateFormatter';

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const newsData = await getAllNews();
      setNews(newsData);
    };

    fetchNews();
  }, []);

  return (
    <div className="py-12 bg-gray-900 bg-opacity-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold sm:text-4xl gradient-text">
            Latest News
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Stay updated with the latest blockchain and crypto news
          </p>
        </div>

        <div className="space-y-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <time dateTime={item.create_time}>
                    {formatDate(item.create_time)}
                  </time>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {item.content}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Source: AllinWeb3
                </span>
                <button className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium">
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;