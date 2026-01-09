

'use server';
import path from 'path';
import fs from 'fs/promises';

interface DeliveryData {
    id: number;
    name: string;
    bn_name: string;
    lat: string;
    lng: string;
    charge: string;
    district_id: number;
    post_code: string;
    area: string;
    time: string;
}

let deliveryDataCache: DeliveryData[] | null = null;

async function loadDeliveryData(): Promise<DeliveryData[]> {
    if (deliveryDataCache) {
        return deliveryDataCache;
    }

    try {
        const filePath = path.join(process.cwd(), 'public', 'redx_areas.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        deliveryDataCache = data;
        return data;
    } catch (error) {
        console.error("Failed to read or parse redx_areas.json:", error);
        return [];
    }
}

export async function getDeliveryInfoByPincode(pincode: string): Promise<DeliveryData | null> {
    const deliveryData = await loadDeliveryData();
    const info = deliveryData.find(item => item.post_code === pincode.trim());
    return info || null;
}
