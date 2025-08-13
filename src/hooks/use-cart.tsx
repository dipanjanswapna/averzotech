

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// Define the structure of an applied coupon
export interface AppliedCoupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discountAmount: number;
    applicability?: {
        type: 'all' | 'products';
        ids: string[];
    };
    minPurchase?: number;
}

export interface AppliedGiftCard {
    code: string;
    balance: number;
}

export interface ShippingInfo {
    name: string;
    email: string;
    phone: string;
    fullAddress: string;
    method: string;
}

export interface ShippingMethod {
    name: string;
    estimatedDelivery: string;
    fee: number;
}


// Define the structure of a product in the cart
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
    };
    shipping: {
        estimatedDelivery: string;
    };
    inventory: {
        sku: string;
        availability: 'in-stock' | 'out-of-stock' | 'pre-order';
    };
    variants: {
        sizes: string[];
        colors: { name: string, hex: string }[];
    }
    // Variant info
    selectedColor: string;
    selectedSize: string;
    // Quantity in cart
    quantity: number;
}

// Define the context type
interface CartContextType {
  cart: Product[];
  addToCart: (product: Omit<Product, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  appliedGiftCard: AppliedGiftCard | null;
  applyGiftCard: (giftCard: AppliedGiftCard) => void;
  removeGiftCard: () => void;
  subTotal: number;
  total: number;
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo | null) => void;
  shippingFee: number;
  taxes: number;
  availableShippingMethods: ShippingMethod[];
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<AppliedGiftCard | null>(null);
  const [shippingInfo, setShippingInfoState] = useState<ShippingInfo | null>(null);
  const [shippingSettings, setShippingSettings] = useState({ standardFee: 60, expressFee: 120 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));

      const savedGiftCard = localStorage.getItem('appliedGiftCard');
      if (savedGiftCard) setAppliedGiftCard(JSON.parse(savedGiftCard));

      const savedShippingInfo = localStorage.getItem('shippingInfo');
      if (savedShippingInfo) setShippingInfoState(JSON.parse(savedShippingInfo));
    } catch (error) {
        console.error("Failed to parse data from localStorage, clearing corrupted data.", error);
        // Clear corrupted data
        localStorage.removeItem('shoppingCart');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('appliedGiftCard');
        localStorage.removeItem('shippingInfo');
    }

    const fetchShippingSettings = async () => {
        const db = getFirestore(app);
        const docRef = doc(db, 'site_settings', 'shipping');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setShippingSettings({
                standardFee: data.standardFee || 60,
                expressFee: data.expressFee || 120
            });
        }
    };
    fetchShippingSettings();
    setIsLoaded(true);
  }, []);

  // Save cart and coupon to localStorage whenever they change
  useEffect(() => {
    if(isLoaded) {
       localStorage.setItem('shoppingCart', JSON.stringify(cart));
       if (appliedCoupon) {
           localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
       } else {
           localStorage.removeItem('appliedCoupon');
       }
       if (appliedGiftCard) {
           localStorage.setItem('appliedGiftCard', JSON.stringify(appliedGiftCard));
       } else {
           localStorage.removeItem('appliedGiftCard');
       }
       if (shippingInfo) {
           localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
       } else {
            localStorage.removeItem('shippingInfo');
       }
    }
  }, [cart, appliedCoupon, appliedGiftCard, shippingInfo, isLoaded]);

  const addToCart = (product: Omit<Product, 'quantity'>, quantity = 1) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
      );

      if (existingProductIndex > -1) {
        // Update quantity if product with same variant already exists
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          (item.id === productId && item.selectedSize === size && item.selectedColor === color) ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setAppliedGiftCard(null);
    setShippingInfoState(null);
  };
  
  const applyCoupon = (coupon: AppliedCoupon) => {
      setAppliedCoupon(coupon);
  }
  
  const removeCoupon = () => {
      setAppliedCoupon(null);
  }

  const applyGiftCard = (giftCard: AppliedGiftCard) => {
    setAppliedGiftCard(giftCard);
  }

  const removeGiftCard = () => {
      setAppliedGiftCard(null);
  }

   const setShippingInfo = (info: ShippingInfo | null) => {
    setShippingInfoState(info);
  };
  
  const availableShippingMethods: ShippingMethod[] = useMemo(() => {
    if (cart.length === 0) return [];
    
    return [
      { name: 'Standard Courier', estimatedDelivery: '3-5 business days', fee: shippingSettings.standardFee },
      { name: 'Express Delivery', estimatedDelivery: '1-2 business days', fee: shippingSettings.expressFee }
    ];

  }, [cart.length, shippingSettings]);


  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subTotal = cart.reduce((acc, item) => acc + (item.pricing.price * item.quantity), 0);
  
  const discountAmount = useMemo(() => {
    if (!appliedCoupon || cart.length === 0) return 0;

    const applicableItems = appliedCoupon.applicability?.type === 'products'
        ? cart.filter(item => appliedCoupon.applicability.ids.includes(item.id))
        : cart;
    
    if (applicableItems.length === 0) return 0; // No applicable items

    const applicableSubtotal = applicableItems.reduce((acc, item) => acc + item.pricing.price * item.quantity, 0);
    
    // Ensure minPurchase is met on the applicable subtotal
    if (appliedCoupon.minPurchase && applicableSubtotal < appliedCoupon.minPurchase) {
      return 0;
    }

    if(appliedCoupon.type === 'fixed') {
        return Math.min(appliedCoupon.value, applicableSubtotal);
    }
    if(appliedCoupon.type === 'percentage') {
        return applicableSubtotal * (appliedCoupon.value / 100);
    }
    return 0;
  }, [appliedCoupon, cart]);
  
  const subTotalAfterCoupon = subTotal - discountAmount;
  const giftCardAmount = appliedGiftCard ? Math.min(appliedGiftCard.balance, subTotalAfterCoupon) : 0;
  
  const shippingFee = useMemo(() => {
    if (!shippingInfo?.method) return 0;
    const selectedMethod = availableShippingMethods.find(m => m.name === shippingInfo.method);
    return selectedMethod?.fee || 0;
  }, [shippingInfo?.method, availableShippingMethods]);

  const taxes = subTotal * 0.05; // 5% tax on subtotal
  const total = Math.max(0, subTotalAfterCoupon - giftCardAmount + shippingFee + taxes);

  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        cartCount,
        appliedCoupon: appliedCoupon ? {...appliedCoupon, discountAmount} : null,
        applyCoupon,
        removeCoupon,
        appliedGiftCard,
        applyGiftCard,
        removeGiftCard,
        subTotal,
        total,
        shippingFee,
        taxes,
        shippingInfo,
        setShippingInfo,
        availableShippingMethods
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

    