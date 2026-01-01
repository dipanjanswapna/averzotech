
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase-server';
import { writeBatch } from 'firebase-admin/firestore';

// Helper to generate a consistent ID
const generateId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
}

export async function POST(req: NextRequest) {
    try {
        const rows: any[] = await req.json();

        if (!rows || rows.length === 0) {
            return NextResponse.json({ message: 'No data provided.' }, { status: 400 });
        }

        const batch = db.batch();
        let writeCount = 0;

        const divisions = new Map<string, string>();
        const districts = new Map<string, string>();
        const upazilas = new Map<string, string>();

        for (const row of rows) {
            const divisionName = row.division_name_en;
            const districtName = row.district_name_en;
            const upazilaName = row.upazila_name_en;
            const unionName = row.union_name_en;
            
            if (!divisionName || !districtName || !upazilaName || !unionName) continue;

            // Process Division
            if (!divisions.has(divisionName)) {
                const divisionId = generateId(divisionName);
                const divisionRef = db.collection('divisions').doc(divisionId);
                batch.set(divisionRef, {
                    name_en: divisionName,
                    name_bn: row.division_name_bn,
                });
                divisions.set(divisionName, divisionId);
                writeCount++;
            }
            const divisionId = divisions.get(divisionName)!;

            // Process District
            const districtKey = `${divisionName}-${districtName}`;
            if (!districts.has(districtKey)) {
                const districtId = generateId(districtName);
                const districtRef = db.collection('districts').doc(districtId);
                 batch.set(districtRef, {
                    name_en: districtName,
                    name_bn: row.district_name_bn,
                    division_id: divisionId,
                });
                districts.set(districtKey, districtId);
                writeCount++;
            }
            const districtId = districts.get(districtKey)!;

            // Process Upazila
            const upazilaKey = `${districtKey}-${upazilaName}`;
            if (!upazilas.has(upazilaKey)) {
                const upazilaId = generateId(upazilaName);
                const upazilaRef = db.collection('upazilas').doc(upazilaId);
                batch.set(upazilaRef, {
                    name_en: upazilaName,
                    name_bn: row.upazila_name_bn,
                    district_id: districtId,
                });
                upazilas.set(upazilaKey, upazilaId);
                writeCount++;
            }
             const upazilaId = upazilas.get(upazilaKey)!;

            // Process Union
            const unionId = generateId(unionName);
            const unionRef = db.collection('unions').doc(unionId);
            batch.set(unionRef, {
                name_en: unionName,
                name_bn: row.union_name_bn,
                upazila_id: upazilaId,
            });
            writeCount++;

            if (writeCount >= 450) {
                 await batch.commit();
                 batch = db.batch();
                 writeCount = 0;
            }
        }
        
        if (writeCount > 0) {
            await batch.commit();
        }

        return NextResponse.json({ message: 'Address data imported successfully.', count: rows.length }, { status: 200 });

    } catch (error: any) {
        console.error('Bulk import error:', error);
        return NextResponse.json({ message: 'Error importing data.', error: error.message }, { status: 500 });
    }
}

    