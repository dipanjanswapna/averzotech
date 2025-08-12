
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
    items: any[]
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({items}) => {
    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.pricing.price) * item.quantity;
      }, 0);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-medium">৳0</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Taxes</span>
                    <span className="font-medium">৳0</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
