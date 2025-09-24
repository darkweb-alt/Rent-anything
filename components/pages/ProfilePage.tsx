
import React, { useState, useRef } from 'react';
import { User, Booking, Item } from '../../types';
import Header from '../common/Header';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import EditProfileModal from '../common/EditProfileModal';


interface ProfilePageProps {
  user: User;
  ownerItems: Item[];
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateReview: (item: Item) => void;
  onNavigateAddItem: () => void;
  onUpdateProfileImage: (imageUrl: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateProfile: (updatedData: Partial<Omit<User, 'id'>>) => void;
  onToggleItemAvailability: (itemId: string) => void;
}

const statusStyles: { [key: string]: string } = {
  active: 'bg-green-100 text-green-800',
  upcoming: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EditIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);


const BookingCard: React.FC<{ booking: Omit<Booking, 'user'>, onNavigateReview: (item: Item) => void; }> = ({ booking, onNavigateReview }) => {
    const dateFrom = new Date(booking.dateFrom);
    const dateTo = new Date(booking.dateTo);
    const { t } = useLanguage();

    return (
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-start gap-4 border border-gray-200 transition-shadow hover:shadow-md">
            <img src={booking.item.imageUrl} alt={t(booking.item.name)} className="w-full sm:w-24 h-24 object-cover rounded-md flex-shrink-0"/>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{t(booking.item.name)}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[booking.status] || statusStyles.completed}`}>
                        {t(`bookingStatus.${booking.status}`).toUpperCase()}
                    </span>
                </div>
                <p className="text-sm text-gray-500">{t(booking.item.category)}</p>
                <p className="text-sm text-gray-600 mt-1">
                    {dateFrom.toLocaleDateString()} {t('profile.toDate')} {dateTo.toLocaleDateString()}
                </p>
                {booking.status === 'completed' && (
                    <button onClick={() => onNavigateReview(booking.item)} className="mt-2 text-sm text-red-500 font-semibold hover:underline">
                        {t('profile.leaveReview')}
                    </button>
                )}
            </div>
            <div className="text-right mt-2 sm:mt-0 flex-shrink-0">
                <p className={`text-sm font-semibold capitalize ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {t(`paymentStatus.${booking.paymentStatus}`)}
                </p>
            </div>
        </div>
    );
};

const BookingsSection: React.FC<{onNavigateReview: (item: Item) => void;}> = ({onNavigateReview}) => {
    const [activeTab, setActiveTab] = useState('current');
    const { t } = useLanguage();
    // NOTE: Bookings are not yet migrated to Firestore. This is a placeholder.
    const MOCK_USER_BOOKINGS: Omit<Booking, 'user'>[] = []; 

    const currentBookings = MOCK_USER_BOOKINGS.filter(b => b.status === 'active' || b.status === 'upcoming');
    const pastBookings = MOCK_USER_BOOKINGS.filter(b => b.status === 'completed' || b.status === 'cancelled');
    const displayedBookings = activeTab === 'current' ? currentBookings : pastBookings;

    const TabButton: React.FC<{tab: string, label: string, count: number}> = ({tab, label, count}) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${activeTab === tab ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-red-500'}`}>
            {label} ({count})
        </button>
    );
    
    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4">
                    <TabButton tab="current" label={t('profile.currentUpcomingBookings')} count={currentBookings.length} />
                    <TabButton tab="past" label={t('profile.pastBookings')} count={pastBookings.length} />
                </nav>
            </div>
            <div className="mt-6 space-y-4">
                {displayedBookings.length > 0 ? (
                    displayedBookings.map(booking => <BookingCard key={booking.id} booking={booking} onNavigateReview={onNavigateReview}/>)
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>{t('profile.noBookings')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MyItemsSection: React.FC<{ items: Item[]; onNavigateAddItem: () => void; onRemoveItem: (itemId: string) => void; onToggleItemAvailability: (itemId: string) => void; }> = ({ items, onNavigateAddItem, onRemoveItem, onToggleItemAvailability }) => {
    const { t } = useLanguage();
    // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to use the correct timer type for the environment.
    const longPressTimer = useRef<ReturnType<typeof setTimeout>>();

    const handleMouseDown = (item: Item) => {
        longPressTimer.current = setTimeout(() => {
            if (window.confirm(t('alert.confirmDeleteItem', {itemName: t(item.name)}))) {
                onRemoveItem(item.id);
            }
        }, 700);
    };

    const handleMouseUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };
    
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t('profile.yourListedItems', { count: items.length })}</h2>
                <Button onClick={onNavigateAddItem} className="w-full md:w-auto">
                    {t('profile.addNewItem')}
                </Button>
            </div>
            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map(item => (
                        <div 
                            key={item.id} 
                            className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-200 cursor-pointer"
                            onMouseDown={() => handleMouseDown(item)}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={() => handleMouseDown(item)}
                            onTouchEnd={handleMouseUp}
                            title="Long press to delete"
                        >
                            <img src={item.imageUrl} alt={t(item.name)} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-900">{t(item.name)}</h3>
                                <p className="text-sm text-gray-500">{t(item.category)}</p>
                                <p className="text-lg font-bold text-red-500 mt-1">₹{item.price}/{t('item.perDay')}</p>
                            </div>
                            <div className="flex items-center gap-4 self-center" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                                <span className={`text-sm font-bold capitalize px-2 ${item.available ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {item.available ? t('item.available') : t('item.rentedOut')}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={item.available} 
                                        onChange={() => onToggleItemAvailability(item.id)} 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>{t('profile.noItemsListed')}</p>
                        <Button onClick={onNavigateAddItem} className="mt-4 max-w-xs mx-auto">{t('profile.listFirstItem')}</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, ownerItems, onLogout, onNavigateHome, onNavigateReview, onNavigateAddItem, onUpdateProfileImage, onRemoveItem, onUpdateProfile, onToggleItemAvailability }) => {
  const [activeMainTab, setActiveMainTab] = useState(user.role === 'owner' ? 'items' : 'bookings');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MainTabButton: React.FC<{tab: string, label: string}> = ({tab, label}) => (
       <button onClick={() => setActiveMainTab(tab)} className={`px-1 py-3 text-md font-semibold transition-colors ${activeMainTab === tab ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-red-500'}`}>
          {label}
      </button>
  );

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (updatedData: Partial<Omit<User, 'id'>>) => {
      onUpdateProfile(updatedData);
      setIsEditModalOpen(false);
      alert(t('alert.profileUpdated'));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header onNavigateProfile={() => {}} user={user} />
         <main className="container mx-auto p-4 md:p-8">
          <button onClick={onNavigateHome} className="mb-6 text-red-500 hover:underline font-semibold">&larr; {t('profile.backToHome')}</button>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="relative flex-shrink-0">
                      <img 
                          src={user.profileImageUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                          alt={user.name} 
                          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-md border-2 border-white"
                          aria-label="Change profile picture"
                      >
                          <CameraIcon className="w-4 h-4"/>
                      </button>
                      <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleProfileImageChange}
                          className="hidden"
                          accept="image/png, image/jpeg"
                      />
                  </div>
                  <div className="flex-grow">
                      <h1 className="text-4xl font-bold text-gray-900 mb-1">{user.name}</h1>
                      <p className="text-red-500">{user.email}</p>
                  </div>
                  <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <EditIcon className="w-4 h-4" />
                      {t('button.editProfile')}
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-8">
                  <p><strong>{t('profile.mobile')}:</strong> {user.mobile}</p>
                  <p><strong>{t('profile.address')}:</strong> {user.address}</p>
                  <p><strong>{t('profile.aadhar')}:</strong> {user.aadhar}</p>
                  <p><strong>{t('profile.role')}:</strong> <span className="capitalize">{t(`role.${user.role}`)}</span></p>
              </div>
              
              <Button onClick={onLogout} className="max-w-xs">{t('button.logout')}</Button>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
               <div className="border-b border-gray-200">
                  <nav className="flex space-x-6">
                      <MainTabButton tab="bookings" label={t('profile.myBookings')}/>
                      {user.role === 'owner' && <MainTabButton tab="items" label={t('profile.myItems')} />}
                  </nav>
              </div>
              
              <div className="mt-6">
                  {activeMainTab === 'bookings' && <BookingsSection onNavigateReview={onNavigateReview} />}
                  {activeMainTab === 'items' && user.role === 'owner' && (
                      <MyItemsSection 
                          items={ownerItems} 
                          onNavigateAddItem={onNavigateAddItem} 
                          onRemoveItem={onRemoveItem}
                          onToggleItemAvailability={onToggleItemAvailability}
                      />
                  )}
              </div>
          </div>
         </main>
      </div>
      {isEditModalOpen && (
          <EditProfileModal
              user={user}
              onSave={handleSaveProfile}
              onClose={() => setIsEditModalOpen(false)}
          />
      )}
    </>
  );
};

export default ProfilePage;