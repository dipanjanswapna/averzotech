
"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CartItemProps {
  data: any
};

const CartItem: React.FC<CartItemProps> = ({
  data
}) => {
  const cart = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();

  const onRemove = async () => {
    setIsRemoving(true);

    try {
      cart.removeFromCart(data.id, data.selectedSize, data.selectedColor);
      toast({title: "Item removed from cart!"});
    } catch (error: any) {
      toast({title: "Something went wrong.", variant: "destructive"});
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <li className="flex py-6 border-b">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={data.images[0]}
          alt={data.name}
          width={240}
          height={240}
          className="object-cover object-center"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              {data.name}
            </h3>
            <p className="ml-4">{formatPrice(data.pricing.price)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {data.brand}
          </p>
           <p className="mt-1 text-sm text-gray-500">
            Size: {data.selectedSize}
          </p>
           <p className="mt-1 text-sm text-gray-500">
            Color: {data.selectedColor}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">
            Qty {data.quantity}
          </p>

          <div className="flex">
            <button
              onClick={onRemove}
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
