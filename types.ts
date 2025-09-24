export enum Page {
  SPLASH,
  LOGIN,
  REGISTER,
  HOME,
  ITEM_DETAIL,
  PROFILE,
  BOOKING_CONFIRMATION,
  CHAT,
  REVIEW,
  LISTING_PAYMENT,
  ADD_ITEM,
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  pin: string;
  address: string;
  aadhar: string;
  role: 'owner' | 'renter';
  profileImageUrl?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  available: boolean;
  description: string;
  owner: User;
  reviews: Review[];
  location?: Location;
}

export interface Booking {
  id: string;
  item: Item;
  user: User;
  dateFrom: string;
  dateTo: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface Review {
    id: string;
    user: Pick<User, 'name'>;
    rating: number; // 1-5
    text: string;
}