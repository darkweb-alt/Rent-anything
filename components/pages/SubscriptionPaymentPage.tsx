
import React, { useState } from 'react';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface ListingPaymentPageProps {
  onConfirmPayment: () => void;
  onBack: () => void;
}

const ListingPaymentPage: React.FC<ListingPaymentPageProps> = ({ onConfirmPayment, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const { t } = useLanguage();

  const convenienceFee = 25;
  const processingFee = 2;
  const totalCost = convenienceFee + processingFee;

  const paymentOptions = [
    { id: 'upi', name: t('paymentMethod.upi') },
    { id: 'card', name: t('paymentMethod.card') },
    { id: 'netbanking', name: t('paymentMethod.netbanking') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <button onClick={onBack} className="mb-6 text-red-500 hover:underline font-semibold">&larr; {t('listingPay.back')}</button>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('listingPay.title')}</h1>
        
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">{t('listingPay.feeDetails')}</h2>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-red-800">{t('listingPay.feeName')}</h3>
                    <p className="text-sm text-red-700">{t('listingPay.feeDescription')}</p>
                  </div>
                   <p className="text-2xl font-bold text-red-600">₹{convenienceFee}</p>
              </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">{t('listingPay.chooseMethod')}</h2>
                <div className="space-y-3">
                    {paymentOptions.map(option => (
                        <label key={option.id} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === option.id ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={option.id}
                                checked={paymentMethod === option.id}
                                onChange={() => setPaymentMethod(option.id)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-800">{option.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">{t('listingPay.priceSummary')}</h2>
                <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                        <p>{t('listingPay.convenienceFee')}</p>
                        <p>₹{convenienceFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>{t('listingPay.processingFee')}</p>
                        <p>₹{processingFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                        <p>{t('listingPay.total')}</p>
                        <p>₹{totalCost.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <Button onClick={onConfirmPayment}>
                        {t('button.payAndList', { amount: totalCost.toLocaleString('en-IN') })}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPaymentPage;
