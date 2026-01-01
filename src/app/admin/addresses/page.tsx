
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Papa from 'papaparse';


const ENTITY_CONFIG = {
    divisions: { collectionName: 'divisions', parent: null, fields: ['name_en', 'name_bn', 'code'] },
    districts: { collectionName: 'districts', parent: 'divisions', fields: ['name_en', 'name_bn', 'code'] },
    upazilas: { collectionName: 'upazilas', parent: 'districts', fields: ['name_en', 'name_bn', 'code'] },
    unions: { collectionName: 'unions', parent: 'upazilas', fields: ['name_en', 'name_bn', 'code'] },
    areas: { collectionName: 'areas', parent: 'unions', fields: ['name_en', 'name_bn', 'postal_code'] },
} as const;

type EntityKey = keyof typeof ENTITY_CONFIG;
type EntityData = { id: string, [key: string]: any };


export default function AddressManagementPage() {
    const { db } = useFirebase();
    const [activeTab, setActiveTab] = useState<EntityKey>('divisions');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<EntityData | null>(null);
    const { toast } = useToast();
    
    const [data, setData] = useState<Record<EntityKey, any[]>>({
        divisions: [], districts: [], upazilas: [], unions: [], areas: [],
    });
    const [loading, setLoading] = useState<Record<EntityKey, boolean>>({
        divisions: true, districts: true, upazilas: true, unions: true, areas: true,
    });


    // States for bulk import
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

     const fetchData = async (entity: EntityKey) => {
        if (!db) return;
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


    useEffect(() => {
        (Object.keys(ENTITY_CONFIG) as EntityKey[]).forEach(fetchData);
    }, [db, toast]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data[activeTab];
        return data[activeTab].filter((item: any) => 
            (item.name_en && item.name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.name_bn && item.name_bn.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeTab, searchTerm, data]);

    const handleSaveEntity = async (entityData: any) => {
         if (!entityData.name_en || !entityData.name_bn || !db) {
            toast({ title: "Error", description: "English and Bengali names are required.", variant: "destructive" });
            return;
        }

        const currentDataSet = data[activeTab];
        const isDuplicate = currentDataSet.some(item => 
            item.id !== entityData.id && // Exclude self in edit mode
            item.name_en.toLowerCase() === entityData.name_en.toLowerCase() &&
            (!ENTITY_CONFIG[activeTab].parent || item[`${ENTITY_CONFIG[activeTab].parent!.slice(0, -1)}_id`] === entityData[`${ENTITY_CONFIG[activeTab].parent!.slice(0, -1)}_id`])
        );

        if(isDuplicate){
            toast({ title: "Duplicate Entry", description: `A ${activeTab.slice(0, -1)} with this name already exists.`, variant: "destructive" });
            return;
        }
        
        try {
            if (editingEntity) { // Update
                const docRef = doc(db, ENTITY_CONFIG[activeTab].collectionName, editingEntity.id);
                await updateDoc(docRef, entityData);
                toast({ title: "Success", description: `${activeTab.slice(0, -1)} updated.` });
            } else { // Create
                await addDoc(collection(db, ENTITY_CONFIG[activeTab].collectionName), entityData);
                toast({ title: "Success", description: `New ${activeTab.slice(0, -1)} added.` });
            }
            fetchData(activeTab);
            setIsAddDialogOpen(false);
            setEditingEntity(null);
        } catch (error) {
            toast({ title: "Error", description: `Failed to save ${activeTab.slice(0, -1)}.`, variant: "destructive" });
        }
    };

    const handleDeleteEntity = async (entityId: string) => {
        if(!db) return;
         try {
            await deleteDoc(doc(db, ENTITY_CONFIG[activeTab].collectionName, entityId));
            toast({ title: "Deleted", description: `${activeTab.slice(0, -1)} has been deleted.` });
            fetchData(activeTab);
         } catch(error) {
            toast({ title: "Error", description: `Failed to delete ${activeTab.slice(0, -1)}.`, variant: "destructive" });
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
            complete: async (results) => {
                try {
                     const response = await fetch('/api/addresses/bulk-import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(results.data),
                    });

                    if (!response.ok) {
                        // Check if the response is JSON before trying to parse it
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to import data.');
                        } else {
                            // If not JSON, it's likely an HTML error page.
                            throw new Error(`Server error: ${response.statusText}`);
                        }
                    }

                     const data = await response.json();
                     toast({
                        title: "Import Successful",
                        description: `${data.count} address entities were processed and saved.`,
                    });
                     // Refresh data for all tabs
                    (Object.keys(ENTITY_CONFIG) as EntityKey[]).forEach(fetchData);

                } catch (error: any) {
                    toast({ title: "Import Error", description: error.message, variant: "destructive" });
                } finally {
                    setIsImporting(false);
                    setIsImportDialogOpen(false);
                    setImportFile(null);
                    setImportProgress(0);
                }
            },
            error: (error) => {
                console.error("CSV Parsing Error:", error);
                toast({ title: "Parsing Error", description: "Could not parse the CSV file.", variant: "destructive" });
                setIsImporting(false);
            }
        });
    };

    const openEditDialog = (entity: EntityData) => {
        setEditingEntity(entity);
        setIsAddDialogOpen(true);
    }
    const openAddDialog = () => {
        setEditingEntity(null);
        setIsAddDialogOpen(true);
    }

    const renderAddDialogContent = () => {
        const parentKey = ENTITY_CONFIG[activeTab].parent;
        const parentName = parentKey?.slice(0, -1);
        const parentData = parentKey ? data[parentKey] : [];
        const currentData = editingEntity || {};

        const fields = ENTITY_CONFIG[activeTab].fields;

        const [formData, setFormData] = useState(currentData);

        useEffect(() => {
            setFormData(editingEntity || {});
        }, [editingEntity]);

        const handleChange = (field: string, value: string) => {
            setFormData(prev => ({...prev, [field]: value}));
        }

        return (
            <div className="space-y-4">
                {parentKey && (
                     <div className="space-y-2">
                        <Label htmlFor={`${parentName}_id`} className="capitalize">{parentName}</Label>
                        <Select
                            value={formData[`${parentName}_id`]} 
                            onValueChange={value => handleChange(`${parentName}_id`, value)}
                        >
                            <SelectTrigger><SelectValue placeholder={`Select ${parentName}`} /></SelectTrigger>
                            <SelectContent>
                                {parentData.map(d => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {fields.map(field => (
                    <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</Label>
                        <Input id={field} value={formData[field] || ''} onChange={e => handleChange(field, e.target.value)} />
                    </div>
                ))}
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => setEditingEntity(null)}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => handleSaveEntity(formData)}>Save</Button>
                </DialogFooter>
            </div>
        );
    }

    const renderTable = (entityName: EntityKey, tableData: any[]) => {
        if (loading[entityName]) return <p className="text-muted-foreground p-4">Loading data...</p>;
        if (tableData.length === 0) return <p className="text-muted-foreground p-4">No data found.</p>;
        
        const headers = Object.keys(tableData[0]).filter(h => h !== 'id' && !h.endsWith('_id'));

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map(header => <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((row) => (
                        <TableRow key={row.id}>
                            {headers.map(header => <TableCell key={header}>{row[header]}</TableCell>)}
                            <TableCell>
                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => openEditDialog(row)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the selected {activeTab.slice(0, -1)}.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteEntity(row.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                        <DialogHeader><DialogTitle>Bulk Import Address Data</DialogTitle></DialogHeader>
                                        <div className="space-y-4">
                                            <Label htmlFor="import-file">Upload CSV file</Label>
                                            <p className="text-sm text-muted-foreground">Note: The backend will process this file and populate all address levels (Divisions, Districts, etc.).</p>
                                            <Input id="import-file" type="file" onChange={handleFileChange} disabled={isImporting} accept=".csv" />
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
                                        <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
                                    </DialogTrigger>
                                     <DialogContent>
                                        <DialogHeader><DialogTitle>{editingEntity ? 'Edit' : 'Add New'} {activeTab.slice(0,-1)}</DialogTitle></DialogHeader>
                                         {renderAddDialogContent()}
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
