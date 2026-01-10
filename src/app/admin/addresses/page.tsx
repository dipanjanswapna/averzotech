

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
import { PlusCircle, Search, Upload, MoreHorizontal, Edit, Trash2, Database } from 'lucide-react';
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
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import Papa from 'papaparse';


const ENTITY_CONFIG = {
    divisions: { collectionName: 'divisions', parent: null, fields: ['name_en', 'name_bn', 'code'] },
    districts: { collectionName: 'districts', parent: 'divisions', fields: ['name_en', 'name_bn', 'code', 'division_id'] },
    upazilas: { collectionName: 'upazilas', parent: 'districts', fields: ['name_en', 'name_bn', 'code', 'district_id'] },
    unions: { collectionName: 'unions', parent: 'upazilas', fields: ['name_en', 'name_bn', 'code', 'upazila_id'] },
} as const;

type EntityKey = keyof typeof ENTITY_CONFIG;
type EntityData = { id: string, [key: string]: any };

const initialDivisions = [
    { name_en: 'Barisal', name_bn: 'বরিশাল' },
    { name_en: 'Chittagong', name_bn: 'চট্টগ্রাম' },
    { name_en: 'Dhaka', name_bn: 'ঢাকা' },
    { name_en: 'Khulna', name_bn: 'খুলনা' },
    { name_en: 'Mymensingh', name_bn: 'ময়মনসিংহ' },
    { name_en: 'Rajshahi', name_bn: 'রাজশাহী' },
    { name_en: 'Rangpur', name_bn: 'রংপুর' },
    { name_en: 'Sylhet', name_bn: 'সিলেট' },
];

function AddEditDialogContent({
    entityKey,
    editingEntity,
    parentData,
    onSave,
}: {
    entityKey: EntityKey;
    editingEntity: EntityData | null;
    parentData: any[];
    onSave: (entityKey: EntityKey, entityData: any) => void;
}) {
    const parentKey = ENTITY_CONFIG[entityKey].parent;
    const parentName = parentKey?.slice(0, -1);
    const fields = ENTITY_CONFIG[entityKey].fields;
    
    const [formData, setFormData] = useState(editingEntity || {});

    useEffect(() => {
        setFormData(editingEntity || {});
    }, [editingEntity]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{editingEntity ? 'Edit' : 'Add New'} {entityKey.slice(0,-1)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                {parentKey && (
                     <div className="space-y-2">
                        <Label htmlFor={`${parentName}_id`} className="capitalize">{parentName}</Label>
                        <Select
                            value={formData[`${parentName}_id`] || ''} 
                            onValueChange={value => handleChange(`${parentName}_id`, value)}
                        >
                            <SelectTrigger><SelectValue placeholder={`Select ${parentName}`} /></SelectTrigger>
                            <SelectContent>
                                {parentData.map(d => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {fields.filter(f => !f.endsWith('_id')).map(field => (
                    <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</Label>
                        <Input id={field} value={formData[field] || ''} onChange={e => handleChange(field, e.target.value)} />
                    </div>
                ))}
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={() => onSave(entityKey, formData)}>Save</Button>
            </DialogFooter>
        </>
    );
}

export default function AddressManagementPage() {
    const { db } = useFirebase();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<EntityData | null>(null);
    const [activeTab, setActiveTab] = useState<EntityKey>('divisions');
    const { toast } = useToast();
    
    const [data, setData] = useState<Record<EntityKey, any[]>>({
        divisions: [], districts: [], upazilas: [], unions: [],
    });
    const [loading, setLoading] = useState<Record<EntityKey, boolean>>({
        divisions: true, districts: true, upazilas: true, unions: true,
    });
    
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');


    // States for bulk import
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
    }, [db]);

    const handleSeedDivisions = async () => {
        if (!db) return;
        setIsImporting(true);
        try {
            const batch = writeBatch(db);
            const divisionsCollection = collection(db, 'divisions');
            initialDivisions.forEach(division => {
                const docRef = doc(divisionsCollection, division.name_en.toLowerCase().replace(' ', '-'));
                batch.set(docRef, division);
            });
            await batch.commit();
            toast({ title: "Success", description: "Initial divisions have been seeded." });
            fetchData('divisions');
        } catch(error) {
            toast({ title: "Error", description: "Failed to seed divisions.", variant: "destructive"});
        } finally {
            setIsImporting(false);
        }
    };


    const handleSaveEntity = async (entityKey: EntityKey, entityData: any) => {
        const parentConfig = ENTITY_CONFIG[entityKey].parent;
        const parentIdField = parentConfig ? `${parentConfig.slice(0, -1)}_id` : null;

        if (!entityData.name_en || (parentIdField && !entityData[parentIdField])) {
            toast({ title: "Error", description: "Name and parent selection are required.", variant: "destructive" });
            return;
        }

        if (!db) return;

        try {
            if (editingEntity) { // Update
                const docRef = doc(db, ENTITY_CONFIG[entityKey].collectionName, editingEntity.id);
                await updateDoc(docRef, entityData);
                toast({ title: "Success", description: `${entityKey.slice(0, -1)} updated.` });
            } else { // Create
                await addDoc(collection(db, ENTITY_CONFIG[entityKey].collectionName), {...entityData});
                toast({ title: "Success", description: `New ${entityKey.slice(0, -1)} added.` });
            }
            fetchData(entityKey);
            setIsAddEditDialogOpen(false);
            setEditingEntity(null);
        } catch (error) {
            toast({ title: "Error", description: `Failed to save ${entityKey.slice(0, -1)}.`, variant: "destructive" });
        }
    };

    const handleDeleteEntity = async (entityKey: EntityKey, entityId: string) => {
        if(!db) return;
         try {
            await deleteDoc(doc(db, ENTITY_CONFIG[entityKey].collectionName, entityId));
            toast({ title: "Deleted", description: `${entityKey.slice(0, -1)} has been deleted.` });
            fetchData(entityKey);
         } catch(error) {
            toast({ title: "Error", description: `Failed to delete ${entityKey.slice(0, -1)}.`, variant: "destructive" });
         }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImportFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            toast({ title: "No file selected", description: "Please select a CSV file to import.", variant: "destructive" });
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
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to import data.');
                        } else {
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
        setIsAddEditDialogOpen(true);
    }
    const openAddDialog = () => {
        setEditingEntity(null);
        setIsAddEditDialogOpen(true);
    }
    
    const renderTable = (entityName: EntityKey, tableData: any[], title: string, parentId?: string, parentField?: string) => {
        if (loading[entityName]) return <p className="text-muted-foreground p-4 text-center">Loading data...</p>;
        
        let filteredData = tableData;
        if(parentId && parentField) {
            filteredData = tableData.filter(d => d[parentField] === parentId);
        }

        if (searchTerm) {
            filteredData = filteredData.filter((item: any) => 
                (item.name_en && item.name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.name_bn && item.name_bn.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filteredData.length === 0) {
            if(entityName === 'divisions' && tableData.length === 0) {
                return (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <p className="mb-4 text-muted-foreground">No divisions found. You can seed the initial 8 divisions of Bangladesh.</p>
                        <Button onClick={handleSeedDivisions} disabled={isImporting}>
                            <Database className="mr-2 h-4 w-4" /> Seed Initial Divisions
                        </Button>
                    </div>
                )
            }
            return <p className="text-muted-foreground p-4 text-center">No data found.</p>;
        };
        
        const headers = ENTITY_CONFIG[entityName].fields.filter(h => h !== 'id' && !h.endsWith('_id'));

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                     <div className="flex justify-between items-center">
                        <div className="relative w-full max-w-sm">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <Input 
                                placeholder={`Search ${entityName}...`} 
                                className="pl-9"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                             />
                        </div>
                        <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {headers.map(header => <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((row) => (
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
                                                        This action cannot be undone. This will permanently delete the selected {entityName.slice(0, -1)}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteEntity(entityName, row.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    const parentKey = ENTITY_CONFIG[activeTab].parent;
    const parentData = parentKey ? data[parentKey] : [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Address Management</h1>
                <p className="text-muted-foreground">
                    Manage all administrative address entities for Bangladesh.
                </p>
            </div>
            
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                     <CardTitle>Global Actions</CardTitle>
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
                         <Button onClick={handleSeedDivisions} disabled={isImporting || data.divisions.length > 0}>
                            <Database className="mr-2 h-4 w-4" /> Seed Divisions
                        </Button>
                    </div>
                </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Select value={selectedDivision} onValueChange={v => {setSelectedDivision(v); setSelectedDistrict(''); setSelectedUpazila('')}}>
                    <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
                    <SelectContent>
                         {data.divisions.map(d => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={selectedDistrict} onValueChange={v => {setSelectedDistrict(v); setSelectedUpazila('')}} disabled={!selectedDivision}>
                    <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                    <SelectContent>
                        {data.districts.filter(d => d.division_id === selectedDivision).map(d => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={selectedUpazila} onValueChange={setSelectedUpazila} disabled={!selectedDistrict}>
                    <SelectTrigger><SelectValue placeholder="Select Upazila/Thana" /></SelectTrigger>
                    <SelectContent>
                       {data.upazilas.filter(u => u.district_id === selectedDistrict).map(u => <SelectItem key={u.id} value={u.id}>{u.name_en}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button onClick={() => {setSelectedDivision(''); setSelectedDistrict(''); setSelectedUpazila(''); setSearchTerm('')}}>Reset Filters</Button>
            </div>
            
             <Tabs defaultValue="divisions" className="w-full" onValueChange={value => setActiveTab(value as EntityKey)}>
                <TabsList>
                    <TabsTrigger value="divisions">Divisions</TabsTrigger>
                    <TabsTrigger value="districts" disabled={!selectedDivision}>Districts</TabsTrigger>
                    <TabsTrigger value="upazilas" disabled={!selectedDistrict}>Upazilas/Thanas</TabsTrigger>
                    <TabsTrigger value="unions" disabled={!selectedUpazila}>Unions</TabsTrigger>
                </TabsList>
                <TabsContent value="divisions">
                    {renderTable('divisions', data.divisions, 'All Divisions')}
                </TabsContent>
                <TabsContent value="districts">
                     {renderTable('districts', data.districts, 'Districts', selectedDivision, 'division_id')}
                </TabsContent>
                <TabsContent value="upazilas">
                     {renderTable('upazilas', data.upazilas, 'Upazilas/Thanas', selectedDistrict, 'district_id')}
                </TabsContent>
                 <TabsContent value="unions">
                     {renderTable('unions', data.unions, 'Unions', selectedUpazila, 'upazila_id')}
                </TabsContent>
            </Tabs>
             <Dialog open={isAddEditDialogOpen} onOpenChange={(open) => {setIsAddEditDialogOpen(open); if(!open) setEditingEntity(null)}}>
                <DialogContent>
                    <AddEditDialogContent 
                        entityKey={activeTab}
                        editingEntity={editingEntity}
                        parentData={parentData}
                        onSave={handleSaveEntity}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
    

    
