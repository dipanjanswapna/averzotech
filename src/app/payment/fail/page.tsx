"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

function FailContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    return (
         <div className="flex items-center justify-center min-h-screen bg-secondary">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <XCircle className="w-16 h-16 mx-auto text-destructive" />
                    <CardTitle className="mt-4">Payment Failed</CardTitle>
                    <CardDescription>
                         Unfortunately, we were unable to process your payment.
                         {reason && <span className="block mt-2 font-semibold">Reason: {reason.replace(/_/g, ' ')}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Button className="w-full" asChild>
                           <Link href="/shipping">Try Again</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function PaymentFailPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <FailContent />
        </React.Suspense>
    )
}
