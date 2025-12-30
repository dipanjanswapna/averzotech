
'use server';
import path from 'path';
import fs from 'fs/promises';

interface DeliveryData {
    pincode: string;
    area: string;
    time: string;
}

let deliveryDataCache: DeliveryData[] | null = null;

async function loadDeliveryData(): Promise<DeliveryData[]> {
    if (deliveryDataCache) {
        return deliveryDataCache;
    }

    try {
        const filePath = path.join(process.cwd(), 'public', 'delivary.csv');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        const lines = fileContent.split('\n').slice(1); // Skip header row
        const data = lines.map(line => {
            const [pincode, area, time] = line.split(',');
            return {
                pincode: pincode?.trim(),
                area: area?.trim(),
                time: time?.trim().replace(/\r$/, '')
            };
        }).filter(item => item.pincode && item.area && item.time);
        
        deliveryDataCache = data;
        return data;
    } catch (error) {
        console.error("Failed to read or parse delivary.csv:", error);
        // In case of error, return an empty array to prevent crashes
        return [];
    }
}

export async function getDeliveryInfoByPincode(pincode: string): Promise<DeliveryData | null> {
    const deliveryData = await loadDeliveryData();
    const info = deliveryData.find(item => item.pincode === pincode);
    return info || null;
}
