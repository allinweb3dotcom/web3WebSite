import React, { useEffect, useState } from 'react';
import { Clock, Share2 } from 'lucide-react';
import { getAllNews, NewsItem } from '../services/api';
import { formatDate } from '../utils/dateFormatter';
import ShareModal from '../components/ShareModal';

interface GroupedNews {
  [key: string]: NewsItem[];
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getAllNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const groupNewsByDate = (newsItems: NewsItem[]): GroupedNews => {
    return newsItems.reduce((groups: GroupedNews, item) => {
      const date = new Date(item.create_time);
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
      return groups;
    }, {});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const groupedNews = groupNewsByDate(news);

  return (
    <>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          {/* <h1 className="text-3xl font-bold gradient-text">Latest News</h1> */}
          <p className="mt-2 text-base text-gray-400">
            Stay updated with the latest blockchain and crypto news
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedNews).map(([date, items]) => (
            <div key={date} className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">
                {date}
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-primary-500 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <time
                          className="text-xs text-gray-400 flex items-center"
                          dateTime={item.create_time}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(item.create_time)}
                        </time>
                        <span className="text-xs text-primary-400">
                          AllinWeb3
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-300 mb-4">
                        {item.content}
                      </p>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedNews(item)}
                          className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNews && (
        <ShareModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
};

export default NewsPage;
