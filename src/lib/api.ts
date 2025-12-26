import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getProducts(params?: URLSearchParams): Promise<ApiResponse<any>> {
  const queryString = params ? `?${params.toString()}` : '';
  return fetchWithAuth(`/products${queryString}`);
}

export async function getProduct(id: string): Promise<ApiResponse<any>> {
  return fetchWithAuth(`/products/${id}`);
}

export async function createOrder(orderData: any): Promise<ApiResponse<any>> {
  return fetchWithAuth('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function getOrders(): Promise<ApiResponse<any>> {
  return fetchWithAuth('/orders');
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<any>> {
  return fetchWithAuth(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: any): Promise<ApiResponse<any>> {
  return fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}