
'use server';
import { Order } from '@/types';

const redxConfig = {
    baseURL: process.env.REDX_IS_LIVE === 'true' ? 'https://openapi.redx.com.bd/v1.0.0-beta' : 'https://sandbox.redx.com.bd/v1.0.0-beta',
    token: process.env.REDX_IS_LIVE === 'true' 
        ? process.env.REDX_PROD_TOKEN 
        : process.env.REDX_SANDBOX_TOKEN,
};

export interface RedXArea {
    id: number;
    name: string;
    post_code: number;
    division_name: string;
    zone_id: number;
}

export async function redxApiRequest(method: 'GET' | 'POST' | 'PATCH', endpoint: string, body?: object) {
    if (!redxConfig.token) {
        throw new Error('RedX API token is not configured.');
    }

    const headers: HeadersInit = {
        'API-ACCESS-TOKEN': `Bearer ${redxConfig.token}`,
    };

    const options: RequestInit = {
        method: method,
        headers: headers,
        cache: 'no-store'
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    
    const url = `${redxConfig.baseURL}${endpoint}`;

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
            console.error(`RedX API Error (${response.status}) on ${endpoint}:`, errorData);
            throw new Error(`RedX API request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error during RedX API request to ${endpoint}:`, error);
        throw error;
    }
}

export async function trackParcel(trackingId: string) {
    if (!trackingId) {
        throw new Error('Tracking ID is required.');
    }
    return redxApiRequest('GET', `/parcel/track/${trackingId}`);
}

export async function getParcelDetails(trackingId: string) {
     if (!trackingId) {
        throw new Error('Tracking ID is required.');
    }
    return redxApiRequest('GET', `/parcel/info/${trackingId}`);
}

export async function getAreasByDistrict(district: string): Promise<RedXArea[]> {
    const response = await redxApiRequest('GET', `/areas?district_name=${district}`);
    return response.areas || [];
}

export async function createParcel(order: Order, orderId: string) {
    const { shippingAddress, payment } = order;
    
    const parcelData = {
        customer_name: shippingAddress.name,
        customer_phone: shippingAddress.phone,
        delivery_area: (shippingAddress as any).delivery_area,
        delivery_area_id: (shippingAddress as any).delivery_area_id,
        customer_address: shippingAddress.fullAddress,
        merchant_invoice_id: orderId,
        cash_collection_amount: payment.method === 'cod' ? payment.total : 0,
        parcel_weight: 500, // Default weight in grams, adjust as needed
        value: payment.subtotal,
    };

    return redxApiRequest('POST', '/parcel', parcelData);
}
