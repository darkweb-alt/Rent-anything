import React, { useState } from 'react';
import { Item, Location } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import { useLanguage } from '../../contexts/LanguageContext';
import LocationPicker from '../common/LocationPicker';

interface AddItemPageProps {
  onAddItem: (itemData: Omit<Item, 'id' | 'owner' | 'reviews' | 'available'>) => void;
  onBack: () => void;
}

const AddItemPage: React.FC<AddItemPageProps> = ({ onAddItem, onBack }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const { t } = useLanguage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !price || !description) {
        alert(t('alert.fillAllFields'));
        return;
    }
    if (!location) {
        alert(t('alert.selectLocation'));
        return;
    }
    if (!image) {
        alert(t('alert.uploadImage'));
        return;
    }
    onAddItem({
        name,
        category,
        price: Number(price),
        description,
        imageUrl: image,
        location,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        <button onClick={onBack} className="mb-4 text-red-500 hover:underline font-semibold">&larr; {t('addItem.backToProfile')}</button>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">{t('addItem.title')}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input id="name" type="text" label={t('addItem.itemNameLabel')} value={name} onChange={e => setName(e.target.value)} placeholder={t('addItem.itemNamePlaceholder')} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="category" type="text" label={t('addItem.categoryLabel')} value={category} onChange={e => setCategory(e.target.value)} placeholder={t('addItem.categoryPlaceholder')} required />
                <Input id="price" type="number" label={t('addItem.priceLabel')} value={price} onChange={e => setPrice(e.target.value)} placeholder={t('addItem.pricePlaceholder')} required />
            </div>
            
            <LocationPicker onLocationSelect={setLocation} />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">{t('addItem.descriptionLabel')}</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('addItem.descriptionPlaceholder')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                required
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('addItem.uploadImageLabel')}</label>
                <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-48">
                        {image ? (
                            <img src={image} alt="Item Preview" className="max-h-full max-w-full object-contain rounded-md" />
                        ) : (
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-gray-600">
                                    <p className="pl-1">{t('addItem.uploadImageText')}</p>
                                </div>
                                <p className="text-xs text-gray-500">{t('addItem.uploadImageHint')}</p>
                            </div>
                        )}
                    </div>
                </label>
                <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
            </div>
            
            <div className="pt-2">
                <Button type="submit" onClick={()=>{}}>
                    {t('addItem.button')}
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;