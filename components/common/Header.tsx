
import React, { useState, useRef, useEffect } from 'react';
import Logo from '../icons/Logo';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { User } from '../../types';

interface HeaderProps {
    onNavigateProfile: () => void;
    user: User | null;
}

const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const languages: { code: Language; name: string; nativeChar: string }[] = [
    { code: 'en', name: 'English', nativeChar: 'E' },
    { code: 'ta', name: 'தமிழ்', nativeChar: 'த' },
    { code: 'ml', name: 'മലയാളം', nativeChar: 'മ' },
    { code: 'hi', name: 'हिन्दी', nativeChar: 'ह' },
    { code: 'te', name: 'తెలుగు', nativeChar: 'త' },
    { code: 'kn', name: 'ಕನ್ನಡ', nativeChar: 'ಕ' },
];

const Header: React.FC<HeaderProps> = ({ onNavigateProfile, user }) => {
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleLanguageChange = (langCode: Language) => {
        setLanguage(langCode);
        alert(t('alert.languageChanged', { langName: languages.find(l => l.code === langCode)?.name || '' }));
        setLangMenuOpen(false);
    }
    
    const currentLang = languages.find(l => l.code === language);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Logo className="w-36 h-auto" />
                <div className="flex items-center gap-2">
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setLangMenuOpen(!langMenuOpen)} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            aria-haspopup="true"
                            aria-expanded={langMenuOpen}
                        >
                            {currentLang?.nativeChar || 'E'}
                        </button>
                        {langMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in-zoom">
                                <ul>
                                    {languages.map(lang => (
                                        <li key={lang.code}>
                                            <button onClick={() => handleLanguageChange(lang.code)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                {lang.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={onNavigateProfile} 
                        className="w-9 h-9 rounded-full text-gray-600 hover:ring-2 hover:ring-red-500 hover:ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="User Profile"
                    >
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <UserIcon className="w-6 h-6 m-auto" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
