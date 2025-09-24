
import React, { useState } from 'react';
import { Item } from '../../types';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface ReviewPageProps {
  item: Item;
  onSubmitReview: (reviewData: { rating: number; text: string }) => void;
  onBack: () => void;
}

const StarIcon: React.FC<{ filled: boolean; onHover: () => void; onClick: () => void; }> = ({ filled, onHover, onClick }) => (
  <svg 
    className={`w-8 h-8 cursor-pointer transition-colors ${filled ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
    onMouseEnter={onHover}
    onClick={onClick}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.446a1 1 0 00-1.175 0l-3.365-2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

const ReviewPage: React.FC<ReviewPageProps> = ({ item, onSubmitReview, onBack }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert(t('alert.selectRating'));
      return;
    }
    onSubmitReview({ rating, text });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full mx-auto">
        <button onClick={onBack} className="mb-4 text-red-500 hover:underline font-semibold">&larr; {t('review.backToProfile')}</button>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 text-center">{t('review.title')}</h1>
          <p className="text-center text-gray-500 mb-6">{t('review.prompt', { itemName: t(item.name) })}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  filled={(hoverRating || rating) > i}
                  onHover={() => setHoverRating(i + 1)}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>

            <div>
              <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">{t('review.reviewLabel')}</label>
              <textarea
                id="review-text"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('review.reviewPlaceholder')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
              />
            </div>
            
            <div className="pt-2">
                <Button type="submit" onClick={()=>{}} disabled={rating === 0}>
                    {t('button.submitReview')}
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
