
'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { useFirebase } from '@/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Papa from 'papaparse';


const ENTITY_CONFIG = {
    divisions: { collectionName: 'divisions', parent: null },
    districts: { collectionName: 'districts', parent: 'divisions' },
    upazilas: { collectionName: 'upazilas', parent: 'districts' },
    unions: { collectionName: 'unions', parent: 'upazilas' },
    areas: { collectionName: 'areas', parent: 'unions' },
} as const;

type EntityKey = keyof typeof ENTITY_CONFIG;


export default function AddressManagementPage() {
    const { db } = useFirebase();
    const [activeTab, setActiveTab] = useState<EntityKey>('divisions');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [newEntityData, setNewEntityData] = useState<any>({});
    const { toast } = useToast();
    
    const [data, setData] = useState<Record<EntityKey, any[]>>({
        divisions: [], districts: [], upazilas: [], unions: [], areas: [],
    });
    const [loading, setLoading] = useState<Record<EntityKey, boolean>>({
        divisions: true, districts: true, upazilas: true, unions: true, areas: true,
    });


    // States for bulk import simulation
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    useEffect(() => {
        if (!db) return;

        const fetchData = async (entity: EntityKey) => {
            setLoading(prev => ({...prev, [entity]: true}));
            try {
                const querySnapshot = await getDocs(collection(db, ENTITY_CONFIG[entity].collectionName));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(prev => ({ ...prev, [entity]: items }));
            } catch (error) {
                console.error(`Error fetching ${entity}:`, error);
                toast({ title: "Error", description: `Failed to fetch ${entity}.`, variant: "destructive" });
            } finally {
                 setLoading(prev => ({...prev, [entity]: false}));
            }
        };
        
        (Object.keys(ENTITY_CONFIG) as EntityKey[]).forEach(fetchData);

    }, [db, toast]);


    const filteredData = useMemo(() => {
        if (!searchTerm) return data[activeTab];
        return data[activeTab].filter((item: any) => 
            (item.name_en && item.name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.name_bn && item.name_bn.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeTab, searchTerm, data]);

    const handleAddNew = async () => {
        if (!newEntityData.name_en || !newEntityData.name_bn) {
            toast({ title: "Error", description: "English and Bengali names are required.", variant: "destructive" });
            return;
        }

        const currentDataSet = data[activeTab];
        const isDuplicate = currentDataSet.some(item => 
            item.name_en.toLowerCase() === newEntityData.name_en.toLowerCase() &&
            (!ENTITY_CONFIG[activeTab].parent || item[`${ENTITY_CONFIG[activeTab].parent!.slice(0, -1)}_id`] === newEntityData[`${ENTITY_CONFIG[activeTab].parent!.slice(0, -1)}_id`])
        );

        if(isDuplicate){
            toast({ title: "Duplicate Entry", description: `A ${activeTab.slice(0, -1)} with this name already exists.`, variant: "destructive" });
            return;
        }

        try {
            const docRef = await addDoc(collection(db, ENTITY_CONFIG[activeTab].collectionName), newEntityData);
            setData(prev => ({...prev, [activeTab]: [...prev[activeTab], {id: docRef.id, ...newEntityData}]}));
            toast({ title: "Success", description: `New ${activeTab.slice(0, -1)} added.`});
            setNewEntityData({});
            setIsAddDialogOpen(false);
        } catch (error) {
             toast({ title: "Error", description: `Failed to add ${activeTab.slice(0, -1)}.`, variant: "destructive" });
        }
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

        Papa.parse(importFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                console.log("Parsed CSV Data for bulk import:", results.data);
                // In a real application, you would send this data to a serverless function
                // to handle the batch write to Firestore to avoid browser limitations.
                
                // Simulate backend processing
                const totalRows = results.data.length;
                let processedRows = 0;
                const interval = setInterval(() => {
                    processedRows += Math.ceil(totalRows / 10); // Process 10% at a time
                    const progress = (processedRows / totalRows) * 100;
                    setImportProgress(Math.min(100, progress));
                    if (progress >= 100) {
                        clearInterval(interval);
                        setIsImporting(false);
                        setIsImportDialogOpen(false);
                        toast({
                            title: "Import Complete (Simulated)",
                            description: `${totalRows} rows were processed. Check the console for parsed data.`,
                        });
                        setImportFile(null);
                    }
                }, 300);
            },
            error: (error) => {
                console.error("CSV Parsing Error:", error);
                toast({ title: "Parsing Error", description: "Could not parse the CSV file.", variant: "destructive" });
                setIsImporting(false);
            }
        });
    };

    const renderAddDialogContent = () => {
        const parentKey = ENTITY_CONFIG[activeTab].parent;
        const parentName = parentKey?.slice(0, -1);
        const parentData = parentKey ? data[parentKey] : [];

        return (
            <div className="space-y-4">
                {parentKey && (
                     <div className="space-y-2">
                        <Label htmlFor={`${parentName}_id`} className="capitalize">{parentName}</Label>
                        <Select onValueChange={value => setNewEntityData({...newEntityData, [`${parentName}_id`]: value})}>
                            <SelectTrigger><SelectValue placeholder={`Select ${parentName}`} /></SelectTrigger>
                            <SelectContent>
                                {parentData.map(d => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="name_en">Name (English)</Label>
                    <Input id="name_en" value={newEntityData.name_en || ''} onChange={e => setNewEntityData({...newEntityData, name_en: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="name_bn">Name (Bengali)</Label>
                    <Input id="name_bn" value={newEntityData.name_bn || ''} onChange={e => setNewEntityData({...newEntityData, name_bn: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="code">Code (Optional)</Label>
                    <Input id="code" value={newEntityData.code || ''} onChange={e => setNewEntityData({...newEntityData, code: e.target.value})} />
                </div>
                {activeTab === 'areas' && (
                     <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input id="postal_code" value={newEntityData.postal_code || ''} onChange={e => setNewEntityData({...newEntityData, postal_code: e.target.value})} />
                    </div>
                )}
            </div>
        );
    }


    const renderTable = (entityName: EntityKey, data: any[]) => {
        if (loading[entityName]) return <p className="text-muted-foreground p-4">Loading data...</p>;
        if (data.length === 0) return <p className="text-muted-foreground p-4">No data found.</p>;
        
        const headers = Object.keys(data[0]).filter(h => h !== 'id' && !h.endsWith('_id'));

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map(header => <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
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
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EntityKey)}>
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
                                            <p className="text-sm text-muted-foreground">Note: This will parse the file in your browser. For very large files, a server-based import is recommended.</p>
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
                                         {renderAddDialogContent()}
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
                       <TabsContent value={activeTab}>
                          {renderTable(activeTab, filteredData)}
                       </TabsContent>
                    </CardContent>
                </Card>

            </Tabs>
        </div>
    );
}
