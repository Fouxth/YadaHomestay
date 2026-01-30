// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Helper for API requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
        }
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
};

// Auth API
export const authAPI = {
    login: (username: string, password: string) =>
        fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        }),

    register: (data: { username: string; password: string; name: string; phone: string; email?: string }) =>
        fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};

// Rooms API
export const roomsAPI = {
    getAll: () => fetchWithAuth('/rooms'),
    getById: (id: string) => fetchWithAuth(`/rooms/${id}`),
    getAvailable: (checkIn: string, checkOut: string, guests?: number) =>
        fetchWithAuth(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}${guests ? `&guests=${guests}` : ''}`),
    create: (data: any) =>
        fetchWithAuth('/rooms', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchWithAuth(`/rooms/${id}`, { method: 'DELETE' })
};

// Bookings API
export const bookingsAPI = {
    getAll: () => fetchWithAuth('/bookings'),
    getById: (id: string) => fetchWithAuth(`/bookings/${id}`),
    create: (data: any) =>
        fetchWithAuth('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchWithAuth(`/bookings/${id}`, { method: 'DELETE' }),
    checkIn: (id: string) =>
        fetchWithAuth(`/bookings/${id}/checkin`, { method: 'POST' }),
    checkOut: (id: string) =>
        fetchWithAuth(`/bookings/${id}/checkout`, { method: 'POST' })
};

// Products API
export const productsAPI = {
    getAll: () => fetchWithAuth('/products'),
    getById: (id: string) => fetchWithAuth(`/products/${id}`),
    create: (data: any) =>
        fetchWithAuth('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchWithAuth(`/products/${id}`, { method: 'DELETE' })
};

// Orders API
export const ordersAPI = {
    getAll: () => fetchWithAuth('/orders'),
    getById: (id: string) => fetchWithAuth(`/orders/${id}`),
    create: (data: any) =>
        fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchWithAuth(`/orders/${id}`, { method: 'DELETE' })
};

// Users API
export const usersAPI = {
    getAll: () => fetchWithAuth('/users'),
    getById: (id: string) => fetchWithAuth(`/users/${id}`),
    create: (data: any) =>
        fetchWithAuth('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchWithAuth(`/users/${id}`, { method: 'DELETE' }),
    updateProfile: (data: any) =>
        fetchWithAuth('/users/profile/update', { method: 'PUT', body: JSON.stringify(data) })
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => fetchWithAuth('/dashboard/stats'),
    getRevenueReport: (startDate?: string, endDate?: string) =>
        fetchWithAuth(`/dashboard/revenue?${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}` : ''}`),
    getOccupancyReport: (startDate?: string, endDate?: string) =>
        fetchWithAuth(`/dashboard/occupancy?${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}` : ''}`)
};

// Housekeeping API (Legacy/Basic)
export const housekeepingAPI = {
    getStatus: () => fetchWithAuth('/housekeeping'),
    updateRoomStatus: (roomId: string, status: string) =>
        fetchWithAuth(`/housekeeping/rooms/${roomId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    markCleaned: (roomId: string) =>
        fetchWithAuth(`/housekeeping/rooms/${roomId}/cleaned`, { method: 'POST' }),
    markMaintenance: (roomId: string, reason?: string) =>
        fetchWithAuth(`/housekeeping/rooms/${roomId}/maintenance`, { method: 'POST', body: JSON.stringify({ reason }) }),
    completeMaintenance: (roomId: string) =>
        fetchWithAuth(`/housekeeping/rooms/${roomId}/maintenance/complete`, { method: 'POST' })
};

// Audit API
export const auditAPI = {
    getLogs: (params?: any) => {
        const queryParams = new URLSearchParams();
        if (params?.userId) queryParams.append('userId', params.userId);
        if (params?.action) queryParams.append('action', params.action);
        if (params?.entityType) queryParams.append('entityType', params.entityType);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        return fetchWithAuth(`/audit?${queryParams.toString()}`);
    },
    getStats: (startDate?: string, endDate?: string) =>
        fetchWithAuth(`/audit/stats?${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}` : ''}`)
};

// ================== NEW APIs ==================

// Customers API
export const customersAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        return fetchWithAuth(`/customers?${queryParams.toString()}`);
    },
    getById: (id: string) => fetchWithAuth(`/customers/${id}`),
    create: (data: any) =>
        fetchWithAuth('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchWithAuth(`/customers/${id}`, { method: 'DELETE' })
};

// Check-in/out API
export const checkInOutAPI = {
    getDaily: () => fetchWithAuth('/checkins/daily'),
    checkIn: (bookingId: string) =>
        fetchWithAuth('/checkins/checkin', { method: 'POST', body: JSON.stringify({ bookingId }) }),
    checkOut: (bookingId: string) =>
        fetchWithAuth('/checkins/checkout', { method: 'POST', body: JSON.stringify({ bookingId }) })
};

// Cleaning API
export const cleaningAPI = {
    getAll: () => fetchWithAuth('/cleaning'),
    create: (data: any) =>
        fetchWithAuth('/cleaning', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
        fetchWithAuth(`/cleaning/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    assign: (id: string, assignedToId: string) =>
        fetchWithAuth(`/cleaning/${id}/assign`, { method: 'PUT', body: JSON.stringify({ assignedToId }) })
};

// Maintenance API
export const maintenanceAPI = {
    getAll: () => fetchWithAuth('/maintenance'),
    create: (data: any) =>
        fetchWithAuth('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        fetchWithAuth(`/maintenance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    assign: (id: string, assignedToId: string) =>
        fetchWithAuth(`/maintenance/${id}/assign`, { method: 'PUT', body: JSON.stringify({ assignedToId }) })
};

// Inventory API
export const inventoryAPI = {
    getMovements: (type?: string, limit: number = 50) =>
        fetchWithAuth(`/inventory/movements?limit=${limit}${type ? `&type=${type}` : ''}`),
    getLowStock: () => fetchWithAuth('/inventory/low-stock'),
    addMovement: (data: any) =>
        fetchWithAuth('/inventory/movements', { method: 'POST', body: JSON.stringify(data) })
};

// Finance API
export const financeAPI = {
    getTransactions: (startDate?: string, endDate?: string, type?: string) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (type) queryParams.append('type', type);
        return fetchWithAuth(`/finance?${queryParams.toString()}`);
    },
    create: (data: any) =>
        fetchWithAuth('/finance', { method: 'POST', body: JSON.stringify(data) }),
    getSummary: () => fetchWithAuth('/finance/summary')
};

// Settings API
export const settingsAPI = {
    getAll: () => fetchWithAuth('/settings'),
    update: (key: string, value: any) =>
        fetchWithAuth(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) })
};
