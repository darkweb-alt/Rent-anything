
import React, { useState, useRef, useEffect } from 'react';
import { Item, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ChatPageProps {
  item: Item;
  currentUser: User;
  onBack: () => void;
}

interface Message {
    text: string;
    sender: 'user' | 'owner';
}

const ChatPage: React.FC<ChatPageProps> = ({ item, currentUser, onBack }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { text: t('chat.mockMessage1', { itemName: t(item.name) }), sender: 'user' },
    { text: t('chat.mockMessage2', { userName: currentUser.name }), sender: 'owner' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: Message = { text: newMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Mock owner reply after a short delay
    setTimeout(() => {
      const ownerReply: Message = { text: t('chat.mockReply'), sender: 'owner' };
      setMessages(prev => [...prev, ownerReply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={onBack} className="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <img 
            src={item.owner.profileImageUrl || 'https://picsum.photos/seed/avatar/100'} 
            alt={item.owner.name} 
            className="w-10 h-10 object-cover rounded-full"
          />
          <div>
            <h1 className="font-bold text-lg text-gray-800">{item.owner.name}</h1>
            <p className="text-sm text-gray-500">{t('chat.ownerOf', { itemName: t(item.name) })}</p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-lg' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-lg'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-2">
        <form onSubmit={handleSend} className="container mx-auto flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-grow w-full px-4 py-3 bg-gray-100 border-2 border-transparent text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            autoComplete="off"
          />
          <button type="submit" className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
