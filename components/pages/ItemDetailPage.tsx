
import React from 'react';
import { Item, Review, User } from '../../types';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface ItemDetailPageProps {
  item: Item;
  currentUser: User;
  onInitiateChat: (item: Item) => void;
  onBack: () => void;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-red-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.446a1 1 0 00-1.175 0l-3.365-2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating} />)}
    </div>
);

const ReviewCard: React.FC<{review: Review}> = ({ review }) => (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
            <Rating rating={review.rating} />
        </div>
        <p className="text-gray-600 text-sm">{review.text}</p>
    </div>
)

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ item, currentUser, onInitiateChat, onBack }) => {
  const { t } = useLanguage();
  const averageRating = item.reviews.length > 0 ? Math.round(item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-4 md:p-8">
        <button onClick={onBack} className="mb-6 text-red-500 hover:underline font-semibold">&larr; {t('itemDetail.backToListings')}</button>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-3">
            <img src={item.imageUrl} alt={t(item.name)} className="w-full h-auto object-cover rounded-xl mb-6 shadow-lg border border-gray-200" />
            <h1 className="text-4xl font-bold mb-2">{t(item.name)}</h1>
            <p className="text-lg text-gray-500 mb-4">{t(item.category)}</p>
            <div className="flex items-center gap-2 mb-4">
               <Rating rating={averageRating}/>
               <span className="text-gray-500">({item.reviews.length} {t('itemDetail.reviews')})</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{t(item.description)}</p>
          </div>

          {/* Right Column: Booking & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
              <div className="flex justify-between items-baseline mb-4">
                <p className="text-3xl font-bold text-red-500">₹{item.price}</p>
                <p className="text-gray-500">/ {t('item.perDay')}</p>
              </div>

               <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4 space-y-2">
                  <h3 className="font-bold text-lg text-red-800">{t('itemDetail.contactDetails')}</h3>
                  <div className="text-sm text-red-700">
                      <p><strong>{t('itemDetail.owner', { ownerName: item.owner.name })}:</strong> {item.owner.mobile}</p>
                      <p><strong>{t('itemDetail.yourNumber')}:</strong> {currentUser.mobile}</p>
                  </div>
                   <p className="text-xs text-red-600 mt-2">{t('itemDetail.contactNote')}</p>
              </div>
              
              <Button onClick={() => onInitiateChat(item)} disabled={!item.available}>
                  {item.available ? t('itemDetail.chatButton') : t('itemDetail.unavailableButton')}
              </Button>
            </div>
            
            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('itemDetail.userReviews')}</h2>
              <div className="space-y-4">
                {item.reviews.map(review => <ReviewCard key={review.id} review={review} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
