
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase-server';
import { WriteBatch } from 'firebase-admin/firestore';

// Helper to generate a consistent ID
const generateId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function POST(req: NextRequest) {
    try {
        const rows: any[] = await req.json();

        if (!rows || rows.length === 0) {
            return NextResponse.json({ message: 'No data provided.' }, { status: 400 });
        }

        let batch: WriteBatch = db.batch();
        let writeCount = 0;
        let totalProcessed = 0;

        const divisions = new Map<string, string>();
        const districts = new Map<string, string>();
        const upazilas = new Map<string, string>();
        const unions = new Map<string, string>();

        for (const row of rows) {
            const divisionName = row.division_name_en?.trim();
            const districtName = row.district_name_en?.trim();
            const upazilaName = row.upazila_name_en?.trim();
            const unionName = row.union_name_en?.trim();
            
            if (!divisionName || !districtName || !upazilaName || !unionName) continue;

            // Process Division
            let divisionId: string;
            if (!divisions.has(divisionName)) {
                divisionId = generateId(divisionName);
                const divisionRef = db.collection('divisions').doc(divisionId);
                batch.set(divisionRef, {
                    name_en: divisionName,
                    name_bn: row.division_name_bn?.trim(),
                    code: row.division_bbs_code?.trim(),
                });
                divisions.set(divisionName, divisionId);
                writeCount++;
            } else {
                divisionId = divisions.get(divisionName)!;
            }
            
            // Process District
            let districtId: string;
            const districtKey = `${divisionId}-${districtName}`;
            if (!districts.has(districtKey)) {
                districtId = generateId(districtName);
                const districtRef = db.collection('districts').doc(districtId);
                 batch.set(districtRef, {
                    name_en: districtName,
                    name_bn: row.district_name_bn?.trim(),
                    code: row.district_bbs_code?.trim(),
                    division_id: divisionId,
                });
                districts.set(districtKey, districtId);
                writeCount++;
            } else {
                districtId = districts.get(districtKey)!;
            }

            // Process Upazila
            let upazilaId: string;
            const upazilaKey = `${districtId}-${upazilaName}`;
            if (!upazilas.has(upazilaKey)) {
                upazilaId = generateId(upazilaName);
                const upazilaRef = db.collection('upazilas').doc(upazilaId);
                batch.set(upazilaRef, {
                    name_en: upazilaName,
                    name_bn: row.upazila_name_bn?.trim(),
                    code: row.upazila_bbs_code?.trim(),
                    district_id: districtId,
                });
                upazilas.set(upazilaKey, upazilaId);
                writeCount++;
            } else {
                upazilaId = upazilas.get(upazilaKey)!;
            }

            // Process Union
            let unionId: string;
            const unionKey = `${upazilaId}-${unionName}`;
             if (!unions.has(unionKey)) {
                unionId = generateId(unionName);
                const unionRef = db.collection('unions').doc(unionId);
                batch.set(unionRef, {
                    name_en: unionName,
                    name_bn: row.union_name_bn?.trim(),
                    code: row.union_bbs_code?.trim(),
                    upazila_id: upazilaId,
                });
                unions.set(unionKey, unionId);
                writeCount++;
            }
            
            totalProcessed++;

            if (writeCount >= 450) {
                 await batch.commit();
                 batch = db.batch();
                 writeCount = 0;
            }
        }
        
        if (writeCount > 0) {
            await batch.commit();
        }

        return NextResponse.json({ message: 'Address data imported successfully.', count: totalProcessed }, { status: 200 });

    } catch (error: any) {
        console.error('Bulk import error:', error);
        return NextResponse.json({ message: 'Error importing data.', error: error.message }, { status: 500 });
    }
}
