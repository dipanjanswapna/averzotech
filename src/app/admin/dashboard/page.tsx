
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, CreditCard, DollarSign } from "lucide-react";

export default function AdminDashboard() {

  const stats = [
    { title: "Total Revenue", value: "৳45,231.89", icon: DollarSign, change: "+20.1% from last month" },
    { title: "Subscriptions", value: "+2350", icon: Users, change: "+180.1% from last month" },
    { title: "Sales", value: "+12,234", icon: CreditCard, change: "+19% from last month" },
    { title: "Active Now", value: "+573", icon: Activity, change: "+201 since last hour" },
  ];

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for a graph */}
                    <div className="h-[350px] bg-secondary rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Graph will be here</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                     {/* Placeholder for recent sales */}
                    <div className="h-[350px] bg-secondary rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Recent sales list will be here</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
