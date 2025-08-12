'use client';

import React, { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { manageGroupBuy, GroupBuy } from '@/ai/flows/group-buy-flow';

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="flex flex-col">
                <CardHeader className="p-0">
                    <Skeleton className="w-full aspect-video rounded-t-lg" />
                </CardHeader>
                <CardContent className="flex-grow p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                </CardContent>
                <CardFooter className="p-4 space-y-2 flex-col items-start">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full mt-2" />
                </CardFooter>
            </Card>
        ))}
    </div>
);

export default function GroupBuyingPage() {
    const [activeGroups, setActiveGroups] = useState<GroupBuy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveGroups = async () => {
            setLoading(true);
            try {
                const groups = await manageGroupBuy({ action: 'listActive' });
                setActiveGroups(groups);
            } catch (error) {
                console.error("Failed to fetch active group buys:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveGroups();
    }, []);

    const calculateTimeLeft = (expiresAt: any) => {
        if (!expiresAt?.seconds) return { total: -1, days: 0, hours: 0 };
        const difference = expiresAt.seconds * 1000 - new Date().getTime();
        if (difference <= 0) return { total: 0, days: 0, hours: 0 };
        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        };
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-headline font-bold">Group Buying Deals</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        Team up with others to unlock amazing discounts!
                    </p>
                </div>

                {loading ? (
                    <LoadingSkeleton />
                ) : activeGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeGroups.map((group) => {
                             const timeLeft = calculateTimeLeft(group.expiresAt);
                            return (
                                <Card key={group.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-0 relative">
                                        <Link href={`/product/${group.productId}`}>
                                            <Image
                                                src={group.productImage || 'https://placehold.co/400x300.png'}
                                                alt={group.productName}
                                                width={400}
                                                height={300}
                                                className="w-full h-auto object-cover"
                                                data-ai-hint="product image"
                                            />
                                        </Link>
                                        <Badge variant="destructive" className="absolute top-2 left-2">
                                            {(((group.productOriginalPrice - group.groupPrice) / group.productOriginalPrice) * 100).toFixed(0)}% OFF
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 flex-grow">
                                        <CardTitle className="text-lg hover:text-primary">
                                            <Link href={`/product/${group.productId}`}>{group.productName}</Link>
                                        </CardTitle>
                                        <CardDescription className="text-sm mt-1">{group.productBrand}</CardDescription>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <p className="text-2xl font-bold text-primary">৳{group.groupPrice}</p>
                                            <p className="text-md line-through text-muted-foreground">৳{group.productOriginalPrice}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 bg-secondary/50 flex-col items-start space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center w-full text-sm">
                                                <p className="flex items-center gap-1"><Users className="w-4 h-4" /> <span>{group.currentCount} / {group.targetCount} Joined</span></p>
                                                <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> 
                                                    {timeLeft.total > 0 ? `${timeLeft.days}d ${timeLeft.hours}h left` : 'Expired'}
                                                </p>
                                            </div>
                                            <Progress value={(group.currentCount / group.targetCount) * 100} className="w-full mt-1 h-2" />
                                        </div>
                                        <Button className="w-full" asChild>
                                            <Link href={`/product/${group.productId}`}>Join Group <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                         <h2 className="text-2xl font-bold mb-2">No Active Group Buys</h2>
                         <p className="text-muted-foreground mb-4">Check back later or start a new group buy on a product page!</p>
                    </div>
                )}
            </main>
            <SiteFooter />
        </div>
    );
}
