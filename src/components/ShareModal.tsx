import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { formatDate } from '../utils/dateFormatter';
import type { NewsItem } from '../services/api';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface ShareModalProps {
  news: NewsItem;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ news, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { quality: 1.0 });
        const link = document.createElement('a');
        link.download = `news-${news.id}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const shareUrl = `https://allinweb3.com/news/${news.id}`;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Dialog.Root open={true} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-lg w-full relative">
            <VisuallyHidden.Root>
              <Dialog.Title>Share News Article: {news.title}</Dialog.Title>
            </VisuallyHidden.Root>
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div ref={cardRef} className="p-6">
              <div className="w-full h-48 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg flex items-center justify-center mb-6">
                <span className="text-4xl font-bold text-white">AllInWeb3</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <time className="text-sm text-gray-400" dateTime={news.create_time}>
                    {formatDate(news.create_time)}
                  </time>
                  <span className="text-sm text-primary-400">AllinWeb3</span>
                </div>
                
                <h3 className="text-xl font-bold text-white leading-tight">
                  {news.title}
                </h3>
                
                <div className="text-gray-300 text-sm leading-relaxed max-h-32 overflow-y-auto">
                  {truncateText(news.content, 280)}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-400">
                  Scan to read more
                </div>
                <QRCodeSVG
                  value={shareUrl}
                  size={80}
                  level="H"
                  includeMargin={false}
                  className="bg-white p-1 rounded"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-800 p-4 flex justify-end">
              <button
                onClick={handleDownload}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Download Image
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareModal;