
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
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Upload, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';


// Mock Data - In a real application, this would come from your database
const mockData = {
    divisions: [
        { id: 1, name_en: 'Dhaka', name_bn: 'ঢাকা', code: 'DHA' },
        { id: 2, name_en: 'Chattagram', name_bn: 'চট্টগ্রাম', code: 'CTG' },
    ],
    districts: [
        { id: 1, division_id: 1, name_en: 'Dhaka', name_bn: 'ঢাকা', code: 'DHK' },
        { id: 2, division_id: 1, name_en: 'Gazipur', name_bn: 'গাজীপুর', code: 'GAZ' },
        { id: 3, division_id: 2, name_en: 'Cumilla', name_bn: 'কুমিল্লা', code: 'COM' },
    ],
    upazilas: [
        { id: 1, district_id: 1, name_en: 'Gulshan', name_bn: 'গুলশান', code: 'GUL' },
        { id: 2, district_id: 2, name_en: 'Sreepur', name_bn: 'শ্রীপুর', code: 'SRE' },
        { id: 3, district_id: 3, name_en: 'Debidwar', name_bn: 'দেবিদ্বার', code: 'DBD' },
        { id: 4, district_id: 3, name_en: 'Barura', name_bn: 'বরুড়া', code: 'BRR' },
    ],
    unions: [
        { id: 1, upazila_id: 1, name_en: 'Gulshan Model Town', name_bn: 'গুলশান মডেল টাউন', code: 'GMT' },
        { id: 2, upazila_id: 3, name_en: 'Subil', name_bn: 'সুবিল', code: 'SBL' },
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
    const [newEntityData, setNewEntityData] = useState<any>({});
    const { toast } = useToast();

    // States for bulk import simulation
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    const filteredData = useMemo(() => {
        if (!searchTerm) return mockData[activeTab as keyof typeof mockData];
        return mockData[activeTab as keyof typeof mockData].filter((item: any) => 
            item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.name_bn && item.name_bn.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeTab, searchTerm]);

    const handleAddNew = () => {
        // Basic validation
        if (!newEntityData.name_en || !newEntityData.name_bn) {
            toast({ title: "Error", description: "English and Bengali names are required.", variant: "destructive" });
            return;
        }

        // Check for duplicates
        const dataSet = mockData[activeTab as keyof typeof mockData] as any[];
        const isDuplicate = dataSet.some(item => item.name_en.toLowerCase() === newEntityData.name_en.toLowerCase());
        if(isDuplicate){
            toast({ title: "Duplicate Entry", description: `A ${activeTab.slice(0, -1)} with this name already exists.`, variant: "destructive" });
            return;
        }

        console.log("Adding new entity:", newEntityData); // Replace with actual API call
        toast({ title: "Success", description: `New ${activeTab.slice(0, -1)} added (simulated).`});
        setNewEntityData({});
        setIsAddDialogOpen(false);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImportFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            toast({ title: "No file selected", description: "Please select a CSV or JSON file to import.", variant: "destructive" });
            return;
        }
        setIsImporting(true);
        setImportProgress(0);

        // Simulate a file upload/processing progress
        const progressInterval = setInterval(() => {
            setImportProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 10;
            });
        }, 300);

        // Simulate backend processing delay
        setTimeout(() => {
            clearInterval(progressInterval);
            setImportProgress(100);
            toast({
                title: "Import Complete (Simulated)",
                description: `File "${importFile.name}" has been processed. In a real application, this would update the database.`,
            });
            setIsImporting(false);
            setImportFile(null);
            setIsImportDialogOpen(false);
        }, 3500);
    };

    const renderAddDialogContent = () => {
        const commonFields = (
            <>
                <div className="space-y-2">
                    <Label htmlFor="name_en">Name (English)</Label>
                    <Input id="name_en" value={newEntityData.name_en || ''} onChange={e => setNewEntityData({...newEntityData, name_en: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="name_bn">Name (Bengali)</Label>
                    <Input id="name_bn" value={newEntityData.name_bn || ''} onChange={e => setNewEntityData({...newEntityData, name_bn: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" value={newEntityData.code || ''} onChange={e => setNewEntityData({...newEntityData, code: e.target.value})} />
                </div>
            </>
        );

        switch (activeTab) {
            case 'districts':
                return <>
                    <div className="space-y-2">
                        <Label htmlFor="division_id">Division</Label>
                        <Select onValueChange={value => setNewEntityData({...newEntityData, division_id: value})}>
                            <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
                            <SelectContent>
                                {mockData.divisions.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {commonFields}
                </>;
             case 'upazilas':
                return <>
                     <div className="space-y-2">
                        <Label htmlFor="district_id">District</Label>
                        <Select onValueChange={value => setNewEntityData({...newEntityData, district_id: value})}>
                            <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                            <SelectContent>
                                {mockData.districts.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {commonFields}
                </>;
             case 'unions':
                return <>
                     <div className="space-y-2">
                        <Label htmlFor="upazila_id">Upazila</Label>
                        <Select onValueChange={value => setNewEntityData({...newEntityData, upazila_id: value})}>
                            <SelectTrigger><SelectValue placeholder="Select Upazila" /></SelectTrigger>
                            <SelectContent>
                                {mockData.upazilas.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {commonFields}
                </>;
             case 'areas':
                return <>
                    <div className="space-y-2">
                        <Label htmlFor="union_id">Union</Label>
                        <Select onValueChange={value => setNewEntityData({...newEntityData, union_id: value})}>
                            <SelectTrigger><SelectValue placeholder="Select Union" /></SelectTrigger>
                            <SelectContent>
                                {mockData.unions.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input id="postal_code" value={newEntityData.postal_code || ''} onChange={e => setNewEntityData({...newEntityData, postal_code: e.target.value})} />
                    </div>
                    {commonFields}
                </>;
            default: // Divisions
                return commonFields;
        }
    }


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
                                            <p className="text-sm text-muted-foreground">Note: This is a UI simulation. The backend for file processing is not yet implemented. Clicking "Import" will simulate the upload process.</p>
                                            <Input id="import-file" type="file" onChange={handleFileChange} disabled={isImporting} accept=".csv,.json" />
                                            {isImporting && (
                                                <div className="space-y-2">
                                                    <Progress value={importProgress} />
                                                    <p className="text-xs text-muted-foreground text-center">{importProgress}%</p>
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="secondary" onClick={() => setIsImportDialogOpen(false)} disabled={isImporting}>Cancel</Button>
                                            <Button onClick={handleImport} disabled={isImporting || !importFile}>
                                                {isImporting ? 'Importing...' : 'Import'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => setNewEntityData({})}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
                                    </DialogTrigger>
                                     <DialogContent>
                                        <DialogHeader><DialogTitle>Add New {activeTab.slice(0,-1)}</DialogTitle></DialogHeader>
                                        <div className="space-y-4">
                                             {renderAddDialogContent()}
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="secondary">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleAddNew}>Save</Button>
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

    