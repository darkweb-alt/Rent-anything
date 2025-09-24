
import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BookingConfirmationPageProps {
  onContinue: () => void;
}

const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ onContinue }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
        onContinue();
    }, 4000); // Redirect after 4 seconds
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <div className="space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold glowing-text">
          {t('bookingConfirmation.title')} ✅
        </h1>
        <div className="text-gray-600">
            <p>{t('bookingConfirmation.message')}</p>
            <p>{t('bookingConfirmation.redirect')}</p>
        </div>
        <div className="w-full max-w-xs mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-[progress_4s_linear_forwards]"></div>
        </div>
         <style>{`
          @keyframes progress {
            from { transform: translateX(-100%); }
            to { transform: translateX(0%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
