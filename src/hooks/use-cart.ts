
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  images: string[];
  name: string;
  pricing: { price: number };
  brand: string,
  selectedSize: string,
  selectedColor: string,
  quantity: number
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string, color: string) => void;
  removeAll: () => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Omit<CartItem, 'quantity'>) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id && item.selectedSize === data.selectedSize && item.selectedColor === data.selectedColor);

        if (existingItem) {
          set({ items: currentItems.map((item) => item.id === existingItem.id && item.selectedSize === data.selectedSize && item.selectedColor === data.selectedColor ? { ...item, quantity: item.quantity + 1 } : item) });
        } else {
          set({ items: [...get().items, { ...data, quantity: 1 }] });
        }
      },
      removeItem: (id: string, size: string, color: string) => {
        set({ items: [...get().items.filter((item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color))] });
      },
      removeAll: () => set({ items: [] }),
      updateQuantity: (id: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
          set({ items: [...get().items.filter((item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color))] });
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id && item.selectedSize === size && item.selectedColor === color
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
