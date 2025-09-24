
import React, { useState, useMemo } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Logo from '../icons/Logo';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';

interface RegisterPageProps {
  onRegister: (userData: Omit<User, 'id' | 'profileImageUrl'>) => void;
  onNavigateLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateLogin }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pin: '',
    aadhar: '',
    role: 'renter' as 'renter' | 'owner',
  });

  const aadharError = useMemo(() => {
    const aadhar = formData.aadhar.replace(/\s/g, '');
    if (formData.aadhar.length > 0 && !/^\d{12}$/.test(aadhar)) {
        return t('validation.invalidAadhar');
    }
    return '';
  }, [formData.aadhar, t]);

  const isFormValid = useMemo(() => {
    return (
        formData.name &&
        formData.mobile &&
        formData.email &&
        formData.address &&
        formData.pin.length === 4 &&
        formData.aadhar &&
        !aadharError
    );
  }, [formData, aadharError]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setFormData({...formData, pin: value});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onRegister(formData);
    }
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
            <p className="text-xs mt-1">
                {t(`register.roleDescription_${role}`)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto space-y-6 py-8">
        <div className="text-center">
            <Logo className="w-64 h-auto mx-auto" />
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">{t('register.title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <RoleSelector />
            <Input id="name" type="text" label={t('register.nameLabel')} value={formData.name} onChange={handleChange} placeholder={t('register.namePlaceholder')} required />
            <Input id="email" type="email" label={t('register.emailLabel')} value={formData.email} onChange={handleChange} placeholder="arjun.sharma@example.com" required />
            <Input id="mobile" type="tel" label={t('register.mobileLabel')} value={formData.mobile} onChange={handleChange} placeholder="+91 98765 43210" required />
            <Input id="pin" type="password" label={t('register.pinLabel')} value={formData.pin} onChange={handlePinChange} placeholder="••••" required maxLength={4} pattern="\d{4}" />
            <Input id="address" type="text" label={t('register.addressLabel')} value={formData.address} onChange={handleChange} placeholder={t('register.addressPlaceholder')} required />
            <Input id="aadhar" type="text" label={t('register.aadharLabel')} value={formData.aadhar} onChange={handleChange} placeholder={t('register.aadharPlaceholder')} required error={aadharError}/>

            <Button type="submit" onClick={() => {}} disabled={!isFormValid}>
              {t('button.register')}
            </Button>
          </form>
        </div>
        <p className="text-center text-gray-500">
          {t('register.haveAccount')}{' '}
          <button onClick={onNavigateLogin} className="font-semibold text-red-500 hover:underline">
            {t('register.loginLink')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
