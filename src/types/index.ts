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