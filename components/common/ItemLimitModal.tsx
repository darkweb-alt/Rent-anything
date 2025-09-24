
import React from 'react';
import { Item } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from './Button';

interface ItemLimitModalProps {
  ownerItems: Item[];
  onDeleteItem: (itemId: string) => void;
  onClose: () => void;
}

const ItemLimitModal: React.FC<ItemLimitModalProps> = ({ ownerItems, onDeleteItem, onClose }) => {
    const { t } = useLanguage();

    const handleDelete = (item: Item) => {
        if (window.confirm(t('alert.confirmDeleteItemModal', { itemName: t(item.name) }))) {
            onDeleteItem(item.id);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg m-4 relative animate-fade-in-zoom flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('itemLimitModal.title')}</h2>
                    <p className="text-gray-600 mb-6">{t('itemLimitModal.message')}</p>
                </div>
                
                <div className="overflow-y-auto max-h-[60vh] space-y-3 pr-2 -mr-2">
                    {ownerItems.map(item => (
                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex items-center gap-4 border border-gray-200">
                            <img src={item.imageUrl} alt={t(item.name)} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800 text-sm">{t(item.name)}</h3>
                                <p className="text-xs text-gray-500">{t(item.category)}</p>
                            </div>
                            <Button 
                                onClick={() => handleDelete(item)} 
                                className="!w-auto !py-1.5 !px-3 !text-sm !bg-gray-200 !text-gray-800 !border-gray-200 hover:!bg-red-100 hover:!text-red-700 hover:!border-red-200"
                            >
                                {t('itemLimitModal.deleteItem')}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                     <Button onClick={onClose} type="button" className="bg-gray-200 text-gray-800 border-gray-200 hover:bg-gray-300 hover:border-gray-300">
                        {t('button.cancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ItemLimitModal;
