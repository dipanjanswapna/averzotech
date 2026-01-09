

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
    status: 'Pending' | 'Processing' | 'In-house Delivery' | 'In-Transit' | 'Shipped' | 'Fulfilled' | 'Cancelled' | 'Returning to Warehouse' | 'Received & Closed';
}

// Vendor Invoice
export interface VendorInvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface VendorInvoice {
  id: string;
  vendorId: string;
  vendorName: string;
  items: VendorInvoiceItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Processing' | 'Paid' | 'Cancelled';
  createdAt: any;
}


// Vendor Application
export interface VendorApplication {
    id: string;
    userId: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Update Requested';
    shopInfo: {
        shopName: string;
        address: string;
        category: string;
    };
    contactInfo: {
        name: string;
        phone: string;
        email: string;
    };
    documents: {
        tradeLicenseUrl: string;
        nidUrl: string;
        tinUrl: string;
    };
    paymentInfo: {
        method: 'bank' | 'mobile';
        bankName?: string;
        accountName?: string;
        accountNumber?: string;
        branchName?: string;
        mobileNumber?: string;
    };
    rejectionReason?: string;
    createdAt: any;
}

export interface VendorApplicationData {
    shopInfo: {
        shopName: string;
        address: string;
        category: string;
    };
    contactInfo: {
        name: string;
        phone: string;
        email: string;
    };
    documents: {
        tradeLicenseUrl: string;
        nidUrl: string;
        tinUrl: string;
    };
    paymentInfo: {
        method: 'bank' | 'mobile';
        bankName?: string;
        accountName?: string;
        accountNumber?: string;
        branchName?: string;
        mobileNumber?: string;
    };
    division: string;
    district: string;
    thana: string;
    postOffice: string;
    postCode: string;
}


export interface Vendor {
    id: string;
    userId: string;
    shopName: string;
    category: string;
    contact: {
        name: string;
        phone: string;
        email: string;
    };
    documents?: {
        tradeLicenseUrl: string;
        nidUrl: string;
        tinUrl: string;
    };
    payment: any;
    performance: {
      trustScore: number;
      deliveryScore: number;
      qualityScore: number;
      returnRate: number;
    };
    sla: {
        deliveryCommitment: number; // in hours
    };
    status: 'Active' | 'Suspended';
    isSuperVendor?: boolean;
    minimumOrderValue?: number;
    createdAt: any;
}

// Purchase Order
export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'In-Transit' | 'Received & Closed' | 'Cancelled';
  inboundMethod?: 'self-dropoff' | 'averzo-pickup';
  createdAt: any;
  confirmedAt?: any;
  estimatedDelivery?: string;
  notes?: string;
}

// Represents a pricing tier for wholesale
export interface Tier {
  minQuantity: number;
  pricePerUnit: number;
}

// Represents a product batch
export interface Batch {
  batchNumber: string;
  expiryDate: string;
  stock: number;
}

// Represents a single variant of a product
export interface Variant {
  sku: string;
  wholesalePrice: number;
  stock: number;
  color: string;
  size: string;
  tiers?: Tier[];
  batches?: Batch[];
}

export interface WithdrawalRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  requestedAt: any;
  processedAt?: any;
  transactionId?: string;
}

export interface SupportTicket {
  id: string;
  vendorId: string;
  vendorName: string;
  subject: string;
  department: 'Accounts' | 'Logistics' | 'General';
  message: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: any;
  updatedAt: any;
}

export interface TicketReply {
    id: string;
    authorId: string;
    authorName: string;
    message: string;
    createdAt: any;
}

// Product type for the app
export interface Product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  giftWithPurchase?: {
      enabled: boolean;
      description: string;
  };
  pricing: {
    price: number;
    comparePrice?: number;
    discount?: number;
    tax?: number;
  };
  shipping: {
      estimatedDelivery: string;
      weight?: number; // in kg
  };
  inventory: {
      sku: string;
      availability: 'in-stock' | 'out-of-stock' | 'pre-order';
      stock: number;
      initialStock?: number;
  };
  variants: {
      sizes: string[];
      colors: { name: string, hex: string }[];
  }
}

    