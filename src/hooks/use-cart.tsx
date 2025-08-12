
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of an applied coupon
export interface AppliedCoupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discountAmount: number;
    applicability?: {
        type: 'all' | 'products';
        ids: string[];
    }
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

// Define the structure of a product in the cart
interface Product {
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
    }
    inventory: {
        sku: string;
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
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
  setShippingInfo: (info: ShippingInfo) => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<AppliedGiftCard | null>(null);
  const [shippingInfo, setShippingInfoState] = useState<ShippingInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
      const savedGiftCard = localStorage.getItem('appliedGiftCard');
       if (savedGiftCard) {
        setAppliedGiftCard(JSON.parse(savedGiftCard));
      }
      const savedShippingInfo = localStorage.getItem('shippingInfo');
      if (savedShippingInfo) {
          setShippingInfoState(JSON.parse(savedShippingInfo));
      }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
    }
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

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setAppliedGiftCard(null);
    setShippingInfoState(null);
    localStorage.removeItem('shoppingCart');
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('appliedGiftCard');
    localStorage.removeItem('shippingInfo');
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

   const setShippingInfo = (info: ShippingInfo) => {
    setShippingInfoState(info);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subTotal = cart.reduce((acc, item) => acc + (item.pricing.price * item.quantity), 0);
  
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    let applicableSubtotal = subTotal;
    if (appliedCoupon.applicability?.type === 'products') {
        const applicableProductIds = appliedCoupon.applicability.ids;
        const applicableItems = cart.filter(item => applicableProductIds.includes(item.id));
        applicableSubtotal = applicableItems.reduce((acc, item) => acc + item.pricing.price * item.quantity, 0);
    }

    if(appliedCoupon.type === 'fixed') {
        return Math.min(appliedCoupon.value, applicableSubtotal);
    }
    if(appliedCoupon.type === 'percentage') {
        return applicableSubtotal * (appliedCoupon.value / 100);
    }
    return 0;
  }
  
  const discountAmount = calculateDiscount();
  const subTotalAfterCoupon = subTotal - discountAmount;
  const giftCardAmount = appliedGiftCard ? Math.min(appliedGiftCard.balance, subTotalAfterCoupon) : 0;
  
  const shippingFee = subTotal > 2000 || subTotal === 0 ? 0 : 60;
  const total = subTotalAfterCoupon - giftCardAmount + shippingFee;

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
        shippingInfo,
        setShippingInfo
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
