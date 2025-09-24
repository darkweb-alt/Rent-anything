
import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Item } from './types';
import { MOCK_ITEMS, MOCK_USERS } from './data/mockData';
import SplashScreen from './components/pages/SplashScreen';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import HomePage from './components/pages/HomePage';
import ItemDetailPage from './components/pages/ItemDetailPage';
import ProfilePage from './components/pages/ProfilePage';
import BookingConfirmationPage from './components/pages/BookingConfirmationPage';
import ReviewPage from './components/pages/ReviewPage';
import ChatPage from './components/pages/ChatPage';
import ListingPaymentPage from './components/pages/SubscriptionPaymentPage';
import AddItemPage from './components/pages/AddItemPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import ItemLimitModal from './components/common/ItemLimitModal';
import { MapsApiProvider } from './contexts/MapsApiContext';
import { db } from './firebase';
import { collection, getDocs, addDoc, query, where, doc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';

type RegistrationData = Omit<User, 'id' | 'profileImageUrl'>;

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SPLASH);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemForReview, setItemForReview] = useState<Item | null>(null);
  const [pendingItem, setPendingItem] = useState<Omit<Item, 'id' | 'owner' | 'reviews' | 'available'> | null>(null);
  const [isItemLimitModalOpen, setItemLimitModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  // Data Seeding and Initial Load
  useEffect(() => {
    const initializeAppState = async () => {
      try {
        const itemsCollection = collection(db, 'items');
        const itemsSnapshot = await getDocs(itemsCollection);

        // One-time data seed if database is empty
        if (itemsSnapshot.empty) {
          console.log("Database is empty. Seeding with mock data...");
          // Add users
          const usersCollection = collection(db, 'users');
          await Promise.all(MOCK_USERS.map(user => addDoc(usersCollection, user)));
          // Add items
          await Promise.all(MOCK_ITEMS.map(item => addDoc(itemsCollection, item)));
        }

        // Fetch all items
        const allItemsSnapshot = await getDocs(itemsCollection);
        const itemsList = allItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
        setItems(itemsList);

      } catch (error) {
        console.error("Error initializing app state:", error);
        alert("Could not connect to the database. Please check your connection and Firebase setup.");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAppState();

    const timer = setTimeout(() => {
      if (currentPage === Page.SPLASH) {
        setCurrentPage(Page.LOGIN);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  const handleRemoveItem = useCallback(async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'items', itemId));
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item: ", error);
      alert("Failed to remove item.");
    }
  }, []);

  useEffect(() => {
    if (isItemLimitModalOpen && currentUser && pendingItem) {
      const ownerItemsCount = items.filter(item => item.owner.id === currentUser.id).length;
      if (ownerItemsCount < 10) {
        setItemLimitModalOpen(false);
        setCurrentPage(Page.LISTING_PAYMENT);
      }
    }
  }, [items, isItemLimitModalOpen, currentUser, pendingItem]);
  
  const handleLogin = async (email: string, pin: string) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()), where('pin', '==', pin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() } as User;
        setIsAuthenticated(true);
        setCurrentUser(user);
        setCurrentPage(Page.HOME);
      } else {
        alert(t('alert.invalidCredentials'));
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("An error occurred during login.");
    }
  };

  const handleRegister = async (newUserData: RegistrationData) => {
    try {
      const userData = {
        ...newUserData,
        profileImageUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
      };
      const docRef = await addDoc(collection(db, 'users'), userData);
      const newUser: User = { id: docRef.id, ...userData };

      setIsAuthenticated(true);
      setCurrentUser(newUser);
      setCurrentPage(Page.HOME);
    } catch (error) {
      console.error("Error registering user: ", error);
      alert("An error occurred during registration.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage(Page.LOGIN);
  };
  
  const handlePinReset = async (mobile: string, newPin: string): Promise<boolean> => {
    try {
      const q = query(collection(db, 'users'), where('mobile', '==', mobile));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), { pin: newPin });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error resetting PIN: ", error);
      alert("Failed to reset PIN.");
      return false;
    }
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setCurrentPage(Page.ITEM_DETAIL);
  };

  const handleInitiateChat = (item: Item) => {
      setSelectedItem(item);
      setCurrentPage(Page.CHAT);
  };

  const handleNavigateToReview = (item: Item) => {
    setItemForReview(item);
    setCurrentPage(Page.REVIEW);
  };

  const handleSubmitReview = async (reviewData: { rating: number; text: string }) => {
    if (itemForReview && currentUser) {
      try {
        const review = {
          id: `rev-${Date.now()}`,
          user: { name: currentUser.name },
          ...reviewData
        };
        const itemRef = doc(db, 'items', itemForReview.id);
        await updateDoc(itemRef, {
          reviews: arrayUnion(review)
        });
        
        // Update local state
        setItems(prevItems => prevItems.map(item => 
          item.id === itemForReview.id 
            ? { ...item, reviews: [...item.reviews, review] } 
            : item
        ));

        alert(t('alert.reviewThanks'));
        setItemForReview(null);
        setCurrentPage(Page.PROFILE);
      } catch (error) {
        console.error("Error submitting review: ", error);
        alert("Failed to submit review.");
      }
    }
  };
  
  const handleNavigateToAddItem = () => {
    setCurrentPage(Page.ADD_ITEM);
  };

  const processAddItem = useCallback(async (newItemData: Omit<Item, 'id' | 'owner' | 'reviews' | 'available'>) => {
    if (currentUser) {
      try {
        const ownerItemsCount = items.filter(item => item.owner.id === currentUser.id).length;

        if (ownerItemsCount < 1) {
          const itemPayload = {
            ...newItemData,
            available: true,
            owner: currentUser,
            reviews: [],
          };
          const docRef = await addDoc(collection(db, 'items'), itemPayload);
          const newItem: Item = { id: docRef.id, ...itemPayload };
          setItems(prevItems => [newItem, ...prevItems]);
          alert(t('alert.itemListedFree', { itemName: newItemData.name }));
          setCurrentPage(Page.PROFILE);
        } else {
          setPendingItem(newItemData);
          setCurrentPage(Page.LISTING_PAYMENT);
        }
      } catch (error) {
        console.error("Error processing add item: ", error);
        alert("Failed to list item.");
      }
    }
  }, [currentUser, items, t]);

  const handleAddItem = (newItemData: Omit<Item, 'id' | 'owner' | 'reviews' | 'available'>) => {
      if (currentUser) {
          const ownerItemsCount = items.filter(item => item.owner.id === currentUser.id).length;
          
          if (ownerItemsCount >= 10) {
              setPendingItem(newItemData);
              setItemLimitModalOpen(true);
              return;
          }

          processAddItem(newItemData);
      }
  };

  const handleConfirmListingPayment = async () => {
    if (currentUser && pendingItem) {
      try {
        const itemPayload = {
          ...pendingItem,
          available: true,
          owner: currentUser,
          reviews: [],
        };
        const docRef = await addDoc(collection(db, 'items'), itemPayload);
        const newItem: Item = { id: docRef.id, ...itemPayload };
        setItems(prevItems => [newItem, ...prevItems]);
        alert(t('alert.itemListed', { itemName: newItem.name }));
        setPendingItem(null);
        setCurrentPage(Page.PROFILE);
      } catch (error) {
        console.error("Error confirming payment and adding item: ", error);
        alert("Failed to list item after payment.");
      }
    }
  };

  const handleUpdateProfileImage = async (imageUrl: string) => {
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.id);
        await updateDoc(userRef, { profileImageUrl: imageUrl });
        setCurrentUser({ ...currentUser, profileImageUrl: imageUrl });
      } catch (error) {
        console.error("Error updating profile image: ", error);
        alert("Failed to update profile image.");
      }
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<Omit<User, 'id'>>) => {
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.id);
        await updateDoc(userRef, updatedData);
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
      } catch (error) {
        console.error("Error updating profile: ", error);
        alert("Failed to update profile.");
      }
    }
  };

  const handleToggleItemAvailability = async (itemId: string) => {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const itemToUpdate = items[itemIndex];
    const newAvailability = !itemToUpdate.available;
    
    try {
      const itemRef = doc(db, 'items', itemId);
      await updateDoc(itemRef, { available: newAvailability });
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, available: newAvailability } : item
        )
      );
    } catch (error) {
      console.error("Error toggling item availability: ", error);
      alert("Failed to update item status.");
    }
  };

  const handleCancelAddItem = () => {
      setItemLimitModalOpen(false);
      setPendingItem(null);
  };

  const renderPage = () => {
    if (currentPage === Page.SPLASH || (isLoading && currentPage === Page.LOGIN)) {
      return <SplashScreen />;
    }

    if (!isAuthenticated) {
      switch (currentPage) {
        case Page.LOGIN:
          return <LoginPage onLogin={handleLogin} onNavigateRegister={() => setCurrentPage(Page.REGISTER)} onPinReset={handlePinReset} />;
        case Page.REGISTER:
          return <RegisterPage onRegister={handleRegister} onNavigateLogin={() => setCurrentPage(Page.LOGIN)} />;
        default:
          return <LoginPage onLogin={handleLogin} onNavigateRegister={() => setCurrentPage(Page.REGISTER)} onPinReset={handlePinReset} />;
      }
    }

    const ownerItems = currentUser ? items.filter(item => item.owner.id === currentUser.id) : [];
    
    switch (currentPage) {
        case Page.HOME:
            return <HomePage items={items} onSelectItem={handleSelectItem} onNavigateProfile={() => setCurrentPage(Page.PROFILE)} currentUser={currentUser} />;
        case Page.ITEM_DETAIL:
            return selectedItem && currentUser ? <ItemDetailPage item={selectedItem} currentUser={currentUser} onInitiateChat={handleInitiateChat} onBack={() => setCurrentPage(Page.HOME)} /> : <HomePage items={items} onSelectItem={handleSelectItem} onNavigateProfile={() => setCurrentPage(Page.PROFILE)} currentUser={currentUser} />;
        case Page.CHAT:
            return selectedItem && currentUser ? <ChatPage item={selectedItem} currentUser={currentUser} onBack={() => setCurrentPage(Page.ITEM_DETAIL)} /> : <HomePage items={items} onSelectItem={handleSelectItem} onNavigateProfile={() => setCurrentPage(Page.PROFILE)} currentUser={currentUser} />;
        case Page.PROFILE:
            return currentUser ? <ProfilePage user={currentUser} ownerItems={ownerItems} onLogout={handleLogout} onNavigateHome={() => setCurrentPage(Page.HOME)} onNavigateReview={handleNavigateToReview} onNavigateAddItem={handleNavigateToAddItem} onUpdateProfileImage={handleUpdateProfileImage} onRemoveItem={handleRemoveItem} onUpdateProfile={handleUpdateProfile} onToggleItemAvailability={handleToggleItemAvailability} /> : <LoginPage onLogin={handleLogin} onNavigateRegister={() => setCurrentPage(Page.REGISTER)} onPinReset={handlePinReset} />;
        case Page.BOOKING_CONFIRMATION:
            return <BookingConfirmationPage onContinue={() => setCurrentPage(Page.HOME)} />;
        case Page.REVIEW:
            return itemForReview && currentUser ? <ReviewPage item={itemForReview} onSubmitReview={handleSubmitReview} onBack={() => setCurrentPage(Page.PROFILE)} /> : <ProfilePage user={currentUser!} ownerItems={ownerItems} onLogout={handleLogout} onNavigateHome={() => setCurrentPage(Page.HOME)} onNavigateReview={handleNavigateToReview} onNavigateAddItem={handleNavigateToAddItem} onUpdateProfileImage={handleUpdateProfileImage} onRemoveItem={handleRemoveItem} onUpdateProfile={handleUpdateProfile} onToggleItemAvailability={handleToggleItemAvailability}/>;
        case Page.LISTING_PAYMENT:
            return <ListingPaymentPage onConfirmPayment={handleConfirmListingPayment} onBack={() => setCurrentPage(Page.ADD_ITEM)} />;
        case Page.ADD_ITEM:
            return <AddItemPage onAddItem={handleAddItem} onBack={() => setCurrentPage(Page.PROFILE)} />;
        default:
            return <HomePage items={items} onSelectItem={handleSelectItem} onNavigateProfile={() => setCurrentPage(Page.PROFILE)} currentUser={currentUser} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
        {renderPage()}
        {isItemLimitModalOpen && currentUser && (
            <ItemLimitModal
                ownerItems={items.filter(item => item.owner.id === currentUser.id)}
                onDeleteItem={handleRemoveItem}
                onClose={handleCancelAddItem}
            />
        )}
    </div>
  );
}

const App: React.FC = () => (
  <LanguageProvider>
    <MapsApiProvider>
      <AppContent />
    </MapsApiProvider>
  </LanguageProvider>
);

export default App;