
import React, { useState, useMemo } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Logo from '../icons/Logo';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (email: string, pin: string) => void;
  onNavigateRegister: () => void;
  onPinReset: (mobile: string, newPin: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateRegister, onPinReset }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const { t } = useLanguage();
  
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'closed' | 'mobile' | 'otp' | 'success'>('closed');
  const [resetMobile, setResetMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [mockOtp, setMockOtp] = useState('');

  const emailError = useMemo(() => {
    if (email.length > 0 && !/^\S+@\S+\.\S+$/.test(email)) {
      return t('validation.invalidEmail');
    }
    return '';
  }, [email, t]);

  const pinError = useMemo(() => {
    if (pin.length > 0 && pin.length < 4) {
      return t('validation.invalidPin');
    }
    return '';
  }, [pin, t]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };
  
  const handleModalPinChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4 && !emailError) {
      onLogin(email, pin);
    }
  };
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setMockOtp(generatedOtp);
    alert(t('alert.otpSent', { mobile: resetMobile, otp: generatedOtp }));
    setForgotPasswordStep('otp');
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === mockOtp) {
      const success = onPinReset(resetMobile, newPin);
      if (success) {
        setForgotPasswordStep('success');
      } else {
        alert(t('alert.userNotFound'));
      }
    } else {
      alert(t('alert.invalidOtp'));
    }
  };
  
  const closeResetModal = () => {
    setForgotPasswordStep('closed');
    setResetMobile('');
    setOtp('');
    setNewPin('');
    setMockOtp('');
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center">
             <Logo className="w-64 h-auto mx-auto" />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">{t('login.welcome')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="email"
                type="email"
                label={t('login.emailLabel')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                error={emailError}
              />
              <Input
                id="pin"
                type="password"
                label={t('login.pinLabel')}
                value={pin}
                onChange={handlePinChange}
                placeholder="••••"
                required
                maxLength={4}
                pattern="\d{4}"
                error={pinError}
              />
              <Button type="submit" onClick={() => {}} disabled={pin.length !== 4 || !!emailError || !!pinError}>
                {t('button.login')}
              </Button>
            </form>
            <div className="text-center mt-6">
              <button onClick={() => setForgotPasswordStep('mobile')} className="text-sm text-red-500 hover:underline">
                {t('login.forgotPin')}
              </button>
            </div>
          </div>
          <p className="text-center text-gray-500">
            {t('login.noAccount')}{' '}
            <button onClick={onNavigateRegister} className="font-semibold text-red-500 hover:underline">
              {t('login.registerLink')}
            </button>
          </p>
        </div>
      </div>
      
      {forgotPasswordStep !== 'closed' && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 relative animate-fade-in-zoom">
                <button onClick={closeResetModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                {forgotPasswordStep === 'mobile' && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('forgotPin.title')}</h2>
                    <p className="text-gray-500 mb-6">{t('forgotPin.mobilePrompt')}</p>
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <Input id="reset-mobile" type="tel" label={t('forgotPin.mobileLabel')} value={resetMobile} onChange={(e) => setResetMobile(e.target.value)} placeholder="+91 98765 43210" required />
                      <Button type="submit" onClick={()=>{}}>{t('button.sendOtp')}</Button>
                    </form>
                  </div>
                )}

                {forgotPasswordStep === 'otp' && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('forgotPin.otpTitle')}</h2>
                    <p className="text-gray-500 mb-6">{t('forgotPin.otpPrompt')}</p>
                    <form onSubmit={handleResetPin} className="space-y-4">
                      <Input id="otp" type="text" label={t('forgotPin.otpLabel')} value={otp} onChange={(e) => handleModalPinChange(e, setOtp)} placeholder="••••" required maxLength={4} />
                      <Input id="newPin" type="password" label={t('forgotPin.newPinLabel')} value={newPin} onChange={(e) => handleModalPinChange(e, setNewPin)} placeholder="••••" required maxLength={4} />
                      <Button type="submit" onClick={()=>{}} disabled={otp.length !== 4 || newPin.length !== 4}>{t('button.resetPin')}</Button>
                    </form>
                  </div>
                )}

                {forgotPasswordStep === 'success' && (
                    <div className="text-center space-y-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h2 className="text-2xl font-bold text-gray-900">{t('forgotPin.successTitle')}</h2>
                        <p className="text-gray-600">{t('forgotPin.successMessage')}</p>
                        <Button onClick={closeResetModal}>{t('button.done')}</Button>
                    </div>
                )}
            </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
