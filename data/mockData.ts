import { User, Item, Booking, Review } from '../types';

export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Arjun Sharma',
  mobile: '+91 98765 43210',
  email: 'arjun.sharma@example.com',
  pin: '1234',
  address: '45 MG Road, Bangalore, 560001',
  aadhar: '1234 5678 9012',
  role: 'owner',
  profileImageUrl: 'https://picsum.photos/seed/arjun/200/200',
};

const MOCK_RENTER: User = {
  id: 'user-002',
  name: 'Priya Singh',
  mobile: '+91 91234 56789',
  email: 'priya.singh@example.com',
  pin: '4321',
  address: '12, Juhu Lane, Mumbai, 400049',
  aadhar: '9876 5432 1098',
  role: 'renter',
  profileImageUrl: 'https://picsum.photos/seed/priya/200/200',
};

export const MOCK_USERS: User[] = [MOCK_USER, MOCK_RENTER];

export const MOCK_REVIEWS: Review[] = [
    { id: 'rev-01', user: { name: 'Priya Singh' }, rating: 5, text: 'Excellent condition and great service. Highly recommended!' },
    { id: 'rev-02', user: { name: 'Rohan Mehta' }, rating: 4, text: 'The item was perfect for my event. The process was smooth.' },
];

export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-01',
    name: 'item.dslrCamera.name',
    category: 'item.category.photography',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/camera/400/300',
    available: true,
    description: 'item.dslrCamera.description',
    owner: { ...MOCK_USER, name: 'Photo Rentals Inc.', profileImageUrl: 'https://picsum.photos/seed/photoco/200/200', pin: '1234' },
    reviews: MOCK_REVIEWS,
    location: { lat: 12.9740, lng: 77.6146, address: 'MG Road, Bengaluru, Karnataka, India' },
  },
  {
    id: 'item-02',
    name: 'item.hdProjector.name',
    category: 'item.category.events',
    price: 2500,
    imageUrl: 'https://picsum.photos/seed/projector/400/300',
    available: true,
    description: 'item.hdProjector.description',
    owner: { ...MOCK_USER, name: 'AV Solutions', profileImageUrl: 'https://picsum.photos/seed/avco/200/200', pin: '1234' },
    reviews: MOCK_REVIEWS,
    location: { lat: 11.0168, lng: 76.9558, address: 'Coimbatore, Tamil Nadu, India' },
  },
  {
    id: 'item-03',
    name: 'item.reHimalayan.name',
    category: 'item.category.vehicles',
    price: 3000,
    imageUrl: 'https://picsum.photos/seed/bike/400/300',
    available: false,
    description: 'item.reHimalayan.description',
    owner: MOCK_USER,
    reviews: MOCK_REVIEWS,
    location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, Karnataka, India' },
  },
  {
    id: 'item-04',
    name: 'item.weddingSherwani.name',
    category: 'item.category.apparel',
    price: 5000,
    imageUrl: 'https://picsum.photos/seed/sherwani/400/300',
    available: true,
    description: 'item.weddingSherwani.description',
    owner: { ...MOCK_USER, name: 'Ethnic Wears', profileImageUrl: 'https://picsum.photos/seed/ethnicco/200/200', pin: '1234' },
    reviews: MOCK_REVIEWS,
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra, India' },
  },
   {
    id: 'item-05',
    name: 'item.campingTent.name',
    category: 'item.category.outdoor',
    price: 800,
    imageUrl: 'https://picsum.photos/seed/campingt/400/300',
    available: true,
    description: 'item.campingTent.description',
    owner: MOCK_USER,
    reviews: MOCK_REVIEWS,
    location: { lat: 11.0503, lng: 76.9906, address: 'Nallampalayam, Coimbatore, Tamil Nadu, India' },
  },
  {
    id: 'item-06',
    name: 'item.banarasiSaree.name',
    category: 'item.category.apparel',
    price: 2000,
    imageUrl: 'https://picsum.photos/seed/saree/400/300',
    available: true,
    description: 'item.banarasiSaree.description',
    owner: { ...MOCK_USER, name: 'Ethnic Wears', profileImageUrl: 'https://picsum.photos/seed/ethnicco/200/200', pin: '1234' },
    reviews: MOCK_REVIEWS,
    location: { lat: 19.1076, lng: 72.8259, address: 'Juhu, Mumbai, Maharashtra, India' },
  },
  {
    id: 'item-07',
    name: 'item.lgSmartTv.name',
    category: 'item.category.electronics',
    price: 2200,
    imageUrl: 'https://picsum.photos/seed/tv/400/300',
    available: true,
    description: 'item.lgSmartTv.description',
    owner: MOCK_USER,
    reviews: MOCK_REVIEWS,
    location: { lat: 12.9818, lng: 77.6083, address: 'Commercial Street, Bengaluru, Karnataka, India' },
  },
  {
    id: 'item-08',
    name: 'item.lShapedSofa.name',
    category: 'item.category.furniture',
    price: 1800,
    imageUrl: 'https://picsum.photos/seed/sofa/400/300',
    available: true,
    description: 'item.lShapedSofa.description',
    owner: { ...MOCK_USER, name: 'Home Comforts', profileImageUrl: 'https://picsum.photos/seed/homeco/200/200', pin: '1234' },
    reviews: MOCK_REVIEWS,
    location: { lat: 11.0503, lng: 76.9906, address: 'Nallampalayam, Coimbatore, Tamil Nadu, India' },
  },
  {
    id: 'item-09',
    name: 'item.swiftDzire.name',
    category: 'item.category.vehicles',
    price: 2500,
    imageUrl: 'https://picsum.photos/seed/car/400/300',
    available: true,
    description: 'item.swiftDzire.description',
    owner: MOCK_USER,
    reviews: MOCK_REVIEWS,
    location: { lat: 11.0168, lng: 76.9558, address: 'Gandhipuram, Coimbatore, Tamil Nadu, India' },
  },
  {
    id: 'item-10',
    name: 'item.washingMachine.name',
    category: 'item.category.homeAppliances',
    price: 700,
    imageUrl: 'https://picsum.photos/seed/washingmachine/400/300',
    available: false,
    description: 'item.washingMachine.description',
    owner: MOCK_USER,
    reviews: MOCK_REVIEWS,
    location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, Karnataka, India' },
  },
];

export const MOCK_OWNER_ITEMS: Item[] = MOCK_ITEMS.filter(item => item.owner.id === MOCK_USER.id);


const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const twoDaysLater = new Date(tomorrow);
twoDaysLater.setDate(twoDaysLater.getDate() + 2);

const lastMonth_start = new Date(today);
lastMonth_start.setMonth(lastMonth_start.getMonth() - 1);
const lastMonth_end = new Date(lastMonth_start);
lastMonth_end.setDate(lastMonth_end.getDate() + 3);

const twoMonthsAgo_start = new Date(today);
twoMonthsAgo_start.setMonth(twoMonthsAgo_start.getMonth() - 2);
const twoMonthsAgo_end = new Date(twoMonthsAgo_start);
twoMonthsAgo_end.setDate(twoMonthsAgo_end.getDate() + 5);

export const MOCK_USER_BOOKINGS: Omit<Booking, 'user'>[] = [
  {
    id: 'booking-01',
    item: MOCK_ITEMS[2], // Royal Enfield
    dateFrom: today.toISOString().split('T')[0],
    dateTo: twoDaysLater.toISOString().split('T')[0],
    paymentStatus: 'completed',
    status: 'active'
  },
  {
    id: 'booking-02',
    item: MOCK_ITEMS[6], // Smart TV
    dateFrom: nextWeek.toISOString().split('T')[0],
    dateTo: new Date(nextWeek.setDate(nextWeek.getDate() + 4)).toISOString().split('T')[0],
    paymentStatus: 'pending',
    status: 'upcoming'
  },
  {
    id: 'booking-03',
    item: MOCK_ITEMS[0], // DSLR
    dateFrom: lastMonth_start.toISOString().split('T')[0],
    dateTo: lastMonth_end.toISOString().split('T')[0],
    paymentStatus: 'completed',
    status: 'completed'
  },
    {
    id: 'booking-04',
    item: MOCK_ITEMS[3], // Sherwani
    dateFrom: twoMonthsAgo_start.toISOString().split('T')[0],
    dateTo: twoMonthsAgo_end.toISOString().split('T')[0],
    paymentStatus: 'completed',
    status: 'completed'
  },
];