
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Upload, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock Data - In a real application, this would come from your database
const mockData = {
    divisions: [
        { id: 1, name_en: 'Dhaka', name_bn: 'ঢাকা', code: 'DHA' },
        { id: 2, name_en: 'Chittagong', name_bn: 'চট্টগ্রাম', code: 'CTG' },
    ],
    districts: [
        { id: 1, division_id: 1, name_en: 'Dhaka', name_bn: 'ঢাকা', code: 'DHK' },
        { id: 2, division_id: 1, name_en: 'Gazipur', name_bn: 'গাজীপুর', code: 'GAZ' },
        { id: 3, division_id: 2, name_en: 'Comilla', name_bn: 'কুমিল্লা', code: 'COM' },
    ],
    upazilas: [
        { id: 1, district_id: 1, name_en: 'Gulshan', name_bn: 'গুলশান', code: 'GUL' },
        { id: 2, district_id: 2, name_en: 'Sreepur', name_bn: 'শ্রীপুর', code: 'SRE' },
    ],
    unions: [
        { id: 1, upazila_id: 1, name_en: 'Gulshan Model Town', name_bn: 'গুলশান মডেল টাউন', code: 'GMT' },
    ],
    areas: [
        { id: 1, union_id: 1, name_en: 'Gulshan 1', name_bn: 'গুলশান ১', postal_code: '1212' },
    ]
};


export default function AddressManagementPage() {
    const [activeTab, setActiveTab] = useState('divisions');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchTerm) return mockData[activeTab as keyof typeof mockData];
        return mockData[activeTab as keyof typeof mockData].filter((item: any) => 
            item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name_bn.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeTab, searchTerm]);

    const renderTable = (entityName: string, data: any[]) => {
        if (data.length === 0) return <p className="text-muted-foreground p-4">No data found.</p>;
        const headers = Object.keys(data[0]);

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map(header => <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {headers.map(header => <TableCell key={header}>{row[header]}</TableCell>)}
                            <TableCell>
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Address Management</h1>
                <p className="text-muted-foreground">
                    Manage all administrative address entities for Bangladesh.
                </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="divisions">Divisions</TabsTrigger>
                    <TabsTrigger value="districts">Districts</TabsTrigger>
                    <TabsTrigger value="upazilas">Upazilas</TabsTrigger>
                    <TabsTrigger value="unions">Unions</TabsTrigger>
                    <TabsTrigger value="areas">Areas/Post Offices</TabsTrigger>
                </TabsList>

                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="capitalize">{activeTab}</CardTitle>
                                <CardDescription>Search, add, edit, or delete {activeTab}.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Bulk Import</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Bulk Import {activeTab}</DialogTitle></DialogHeader>
                                        <div className="space-y-4">
                                            <Label htmlFor="import-file">Upload CSV or JSON file</Label>
                                            <Input id="import-file" type="file" />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="secondary" onClick={() => setIsImportDialogOpen(false)}>Cancel</Button>
                                            <Button>Import</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Add New {activeTab.slice(0,-1)}</DialogTitle></DialogHeader>
                                        <div className="space-y-4">
                                             <p>Form fields for creating a new entity would go here.</p>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="secondary" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                            <Button>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="relative mt-4">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <Input 
                                placeholder={`Search ${activeTab}...`} 
                                className="pl-9"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                             />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {renderTable(activeTab, filteredData)}
                    </CardContent>
                </Card>

            </Tabs>
        </div>
    );
}

