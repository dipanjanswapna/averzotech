

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Homepage data types
export interface HeroImage {
  url: string;
  alt: string;
  dataAiHint: string;
}

export interface Brand {
  url: string;
  alt: string;
  dataAiHint: string;
}

export interface Deal {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  dataAiHint?: string;
  inventory: {
    stock: number;
    initialStock?: number;
    availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  };
}

export interface CategoryCard {
  url: string;
  name: string;
  discount: string;
  link: string;
  dataAiHint: string;
}

export interface FlashSaleItem {
  id: string;
  brand: string;
  name: string;
  pricing: {
    price: number;
    comparePrice?: number;
    discount?: number;
  };
  images: string[];
  dataAiHint: string;
  inventory: {
    stock: number;
    initialStock?: number;
    availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  };
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Finished' | 'Scheduled';
  startDate: Date;
  endDate: Date;
  products: string[];
  bannerUrl?: string;
}

export interface CarouselSettings {
  autoplay: boolean;
  autoplaySpeed: number;
}

export interface HomepageContent {
  heroImages: HeroImage[];
  carouselSettings: CarouselSettings;
  brands: Brand[];
  deals: { id: string }[];
  categories: CategoryCard[];
}

// Order interface
export interface Order {
    id?: string;
    userId: string;
    customerName: string;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
        sku: string;
        dataAiHint: string;
        giftDescription?: string;
    }[];
    shippingAddress: {
        id: string;
        name: string;
        email: string;
        phone: string;
        fullAddress: string;
        district: string;
        division: string;
        upazila: string;
        delivery_area: string;
        delivery_area_id: number;
        method: string;
    };
    payment: {
        method: string;
        subtotal: number;
        shipping: number;
        tax: number;
        coupon?: {
            code: string;
            discountAmount: number;
        } | null;
        giftCard?: {
            code: string;
            usedAmount: number;
        } | null;
        total: number;
    };
}
