
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of a product in the cart
interface Product {
    id: string;
    name: string;
    brand: string;
    images: string[];
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
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if(isLoaded) {
       localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

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
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
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
