export type CategoryId =
  | 'all'
  | 'tech'
  | 'fashion'
  | 'home'
  | 'study'
  | 'food'
  | 'services'
  | 'other';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

export type MarketplaceProduct = {
  id: string;
  brand: string;
  title: string;
  description: string;
  sellerName: string;
  sellerVerified: boolean;
  monthlyLabel: string;
  priceAmount: string;
  priceNumber: number;
  totalLabel: string;
  imageUrl: string;
  imageAlt: string;
  showAprBadge: boolean;
  isNew: boolean;
  isPopular: boolean;
  rating: number;
  reviews: number;
  categories: CategoryId[];
};

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'tech', label: 'Tech & Electronics', icon: 'devices' },
  { id: 'fashion', label: 'Fashion & Beauty', icon: 'checkroom' },
  { id: 'home', label: 'Home & Hostel', icon: 'bed' },
  { id: 'study', label: 'Books & Study', icon: 'menu-book' },
  { id: 'food', label: 'Food & Groceries', icon: 'restaurant' },
  { id: 'services', label: 'Services & Events', icon: 'local-activity' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'price_asc', label: 'Lowest Price' },
  { id: 'price_desc', label: 'Highest Price' },
];

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: '1',
    brand: 'Acoustics Pro',
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Studio-quality sound with 40hr battery. Perfect for lectures and late-night study sessions.',
    sellerName: 'Tech Hub Campus',
    sellerVerified: true,
    monthlyLabel: 'As low as K29/mo',
    priceAmount: 'K349',
    priceNumber: 349,
    totalLabel: 'K349.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QysCFKAU60dlTMSYbFWYUx293iuycmFz4l06QWdbj-FbFkcRoiSUyXS0YGQsVWZp5Y6Efd4O4w5GWxQ8-zNn8uQwCG2GgGkXEqSoKNFdanI7_J_GbY8_dgO9L_1Ldp60rWaZ_LDkRwlr6PXxvN018TqKirFShhbWK9TfTApK968QZ7OhV9iwVMw8j-_eI0NwJzKrVhThahD2KdDZXTs3o9KOUMPg4I6s6M2o-Z__UzhLgtzF5pOPjyMQAn3w6lsxdFBNUu3EyObe',
    imageAlt: 'Wireless noise-canceling headphones in matte black.',
    showAprBadge: true,
    isNew: false,
    isPopular: true,
    rating: 4.8,
    reviews: 124,
    categories: ['tech'],
  },
  {
    id: '2',
    brand: 'Horizon Time',
    title: 'Chronograph Elite V2 Watch',
    description: 'Minimalist luxury timepiece. Make an impression at every campus event.',
    sellerName: 'Campus Styles',
    sellerVerified: true,
    monthlyLabel: 'As low as K45/mo',
    priceAmount: 'K540',
    priceNumber: 540,
    totalLabel: 'K540.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDP-HCw7aEQLGu3Yk_gtt6lG4NADoP19CdW9JGmUK5AmHsIV7AWYD8Hhe6nAj1gBopUGS4PVsUQwZRDbucEu72BWwEjnr8Hm-mnH--J9wpsTHQc1LVktOeBXEnvXlhfkfu_iolRsqvKokgr41SVlax3a315XEDjs5aP987CiDEqCZ2bjkyphYwwiR3YCiy3JKIql52v3nm_XagLDQxK45xek64VOQm8sWVZoSN90WG-DtoKu0hLmHMi_VMWGTZpn4IxJrZkYgZRdpoU',
    imageAlt: 'Luxury minimalist wristwatch with charcoal leather strap.',
    showAprBadge: false,
    isNew: true,
    isPopular: false,
    rating: 4.6,
    reviews: 47,
    categories: ['fashion'],
  },
  {
    id: '3',
    brand: 'Capture One',
    title: '4K Mirrorless Camera Kit',
    description: 'Professional-grade mirrorless camera with 18-55mm lens. Ideal for content creators.',
    sellerName: 'Gadget Zone',
    sellerVerified: true,
    monthlyLabel: 'As low as K110/mo',
    priceAmount: 'K1,299',
    priceNumber: 1299,
    totalLabel: 'K1,299.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPl61ov43GPD08K5hTaqsyNFHqXtqTTcU0KVSArXgBUqrOZlLsw5RV8GIC5jscwgfD-BYDEzFrlnt60jYi1DzvhMEvRCg-EYOK4gGJby2pCnjurAesz3umaGplOFS-dxNw6nnIacLwMicJvI6jaXTzy8ny9qU2ClH7x9334PyFFBb_G8evVsG9JOY8015gGqP1J-iBr-APfM_wVURCms7esLfd-i-dQ2gNVVUMxbUQGmri-ib0y0UC1vwEZlua7Tjt5ojka3PXDU6t',
    imageAlt: 'Modern digital camera on a minimalist white desk.',
    showAprBadge: true,
    isNew: false,
    isPopular: true,
    rating: 4.9,
    reviews: 89,
    categories: ['tech'],
  },
  {
    id: '4',
    brand: 'NexTab',
    title: 'Ultra-Thin 12" Productivity Tablet',
    description: 'Lightweight tablet built for students. Perfect for notes, PDFs, and online classes.',
    sellerName: 'Tech Hub Campus',
    sellerVerified: true,
    monthlyLabel: 'As low as K62/mo',
    priceAmount: 'K749',
    priceNumber: 749,
    totalLabel: 'K749.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDONYydV3_Qyu9g4R857EljrB-kDVuzIMmn6y4QhwzOoGjfM-lTxT-53Dh7ZwAruAVA0hhORWh0708SfA3bDHu80T3MlE2nfrZT3LbDr1g0kDcRhChXtXbY3EtiK0uLH0WT3iet4HMVT8ba0OZ4DCuvfbnCggHKhHs24OrZS9Y49OOMhMZKWKH4YaWixUvmMDdzFRSyyiWZOmKAWAI3JiTG5TcGbmuzgAdlkqpJ8TWEU8Js2eyZTy5ai-pYdmpJGIdtNKwDli2OE5bx',
    imageAlt: 'Slim tablet in a blurred office backdrop.',
    showAprBadge: false,
    isNew: true,
    isPopular: false,
    rating: 4.5,
    reviews: 62,
    categories: ['tech'],
  },
  {
    id: '5',
    brand: 'StudyStack',
    title: 'Computer Science Textbook Bundle',
    description: '5-book bundle covering algorithms, databases, networks, OS, and software engineering.',
    sellerName: 'CampusBooks Co.',
    sellerVerified: false,
    monthlyLabel: 'As low as K12/mo',
    priceAmount: 'K140',
    priceNumber: 140,
    totalLabel: 'K140.00 total',
    imageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
    imageAlt: 'Stack of computer science textbooks.',
    showAprBadge: false,
    isNew: false,
    isPopular: true,
    rating: 4.3,
    reviews: 211,
    categories: ['study'],
  },
  {
    id: '6',
    brand: 'HostelKit',
    title: 'Student Room Starter Pack',
    description: 'Everything for your new room: bedding, hangers, desk organiser, and storage boxes.',
    sellerName: 'Dorm Supply Co.',
    sellerVerified: true,
    monthlyLabel: 'As low as K8/mo',
    priceAmount: 'K89',
    priceNumber: 89,
    totalLabel: 'K89.00 total',
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    imageAlt: 'Dorm room starter essentials laid out neatly.',
    showAprBadge: true,
    isNew: true,
    isPopular: false,
    rating: 4.4,
    reviews: 76,
    categories: ['home'],
  },
];
