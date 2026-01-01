
'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Download, UploadCloud, FileText } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const csvTemplateHeaders = [
    "name", "brand", "description", "category", "group", "subcategory", 
    "color", "size", "sku", "wholesalePrice", "stock", "tags", "images"
];

const csvInstructions = [
    { column: "name", description: "Product Title (e.g., 'Cotton Polo T-Shirt')", required: true },
    { column: "brand", description: "Brand name of the product (e.g., 'Averzo')", required: true },
    { column: "description", description: "Detailed product description.", required: true },
    { column: "category", description: "Main category (e.g., 'Men', 'Women')", required: true },
    { column: "group", description: "Group under category (e.g., 'Topwear')", required: true },
    { column: "subcategory", description: "Specific subcategory (e.g., 'T-Shirts')", required: true },
    { column: "color", description: "Color of the variant (e.g., 'Red').", required: true },
    { column: "size", description: "Size of the variant (e.g., 'M', 'XL').", required: true },
    { column: "sku", description: "Unique SKU for the variant. If left blank, it will be auto-generated.", required: false },
    { column: "wholesalePrice", description: "Your wholesale price for the variant.", required: true },
    { column: "stock", description: "Available stock quantity for the variant.", required: true },
    { column: "tags", description: "Comma-separated tags (e.g., 'summer,casual,cotton').", required: false },
    { column: "images", description: "Comma-separated public URLs for product images.", required: true },
];


export default function BulkUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({ title: 'No file selected', description: 'Please select a CSV file to upload.', variant: 'destructive' });
            return;
        }
        
        toast({
            title: "Feature In Progress",
            description: "The backend for processing bulk uploads is currently under development. Please check back later!",
        });

        // Backend logic will be implemented here in a future step.
    };
    
    const downloadTemplate = () => {
        const csvContent = csvTemplateHeaders.join(',') + '\n';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = 'averzo_product_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/vendor/products">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Bulk Product Upload</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upload CSV File</CardTitle>
                        <CardDescription>Upload a CSV file with your product information to add multiple products at once.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Button onClick={downloadTemplate} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download CSV Template
                            </Button>
                        </div>
                        <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                            <input type="file" id="csv-upload" accept=".csv" onChange={handleFileChange} className="hidden" disabled={isUploading}/>
                            <Label htmlFor="csv-upload" className="cursor-pointer">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-sm text-muted-foreground">
                                Drag and drop your CSV file here, or{' '}
                                <span className="font-semibold text-primary">click to browse</span>
                                </p>
                                {file && <p className="mt-2 text-sm font-semibold">{file.name}</p>}
                            </Label>
                        </div>

                         <Button onClick={handleUpload} disabled={isUploading || !file} className="w-full" size="lg">
                            {isUploading ? 'Uploading...' : 'Upload and Process File'}
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> CSV Format Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                        <p>Your CSV file must have the following columns in this exact order:</p>
                        <ul className="space-y-2 text-xs">
                          {csvInstructions.map(instr => (
                            <li key={instr.column}>
                              <span className="font-mono bg-secondary px-1 py-0.5 rounded-sm">{instr.column}</span> {instr.required && <span className="text-destructive">*</span>}
                              : <span className="text-muted-foreground">{instr.description}</span>
                            </li>
                          ))}
                        </ul>
                         <p className="text-xs text-muted-foreground">* Required field</p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
