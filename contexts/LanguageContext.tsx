
import React, { createContext, useState, useContext, ReactNode } from 'react';
import translations, { Translations } from '../data/translations';

export type Language = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    const typedKey = key as keyof Translations;
    let text = translations[language]?.[typedKey] || translations['en'][typedKey] || key;
    if (options) {
      Object.keys(options).forEach(placeholder => {
        text = text.replace(`{{${placeholder}}}`, String(options[placeholder]));
      });
    }
    return text;
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
