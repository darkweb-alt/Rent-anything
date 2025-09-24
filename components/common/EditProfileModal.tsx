
import React, { useState } from 'react';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import Input from './Input';
import Button from './Button';

interface EditProfileModalProps {
  user: User;
  onSave: (updatedData: Partial<Omit<User, 'id'>>) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: user.name,
    mobile: user.mobile,
    address: user.address,
    role: user.role,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const RoleSelector: React.FC = () => (
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{t('register.roleLabel')}</label>
      <div className="grid grid-cols-2 gap-3">
        {(['renter', 'owner'] as const).map(role => (
          <button
            key={role}
            type="button"
            onClick={() => setFormData({ ...formData, role })}
            className={`
              p-4 rounded-lg border-2 text-center transition-all duration-200
              ${formData.role === role
                ? 'bg-red-50 border-red-500 text-red-600 shadow-sm'
                : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
              }
            `}
          >
            <span className="font-semibold capitalize">{t(`role.${role}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 relative animate-fade-in-zoom">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('editProfile.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" type="text" label={t('register.nameLabel')} value={formData.name} onChange={handleChange} placeholder={t('register.namePlaceholder')} required />
          <Input id="mobile" type="tel" label={t('register.mobileLabel')} value={formData.mobile} onChange={handleChange} placeholder="+91 98765 43210" required />
          <Input id="address" type="text" label={t('register.addressLabel')} value={formData.address} onChange={handleChange} placeholder={t('register.addressPlaceholder')} required />
          <RoleSelector />
          
          <div className="flex gap-4 pt-4">
            <Button onClick={onClose} type="button" className="bg-gray-200 text-gray-800 border-gray-200 hover:bg-gray-300 hover:border-gray-300">
              {t('button.cancel')}
            </Button>
            <Button type="submit" onClick={() => {}}>
              {t('button.saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
