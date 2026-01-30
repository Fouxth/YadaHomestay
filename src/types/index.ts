export interface Room {
    id: string;
    number: string;
    name: string;
    type: 'standard' | 'deluxe' | 'family';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
    pricePerNight: number;
    capacity: number;
    amenities: string[];
    floor: number;
    image: string;
    description?: string;
}

export interface Booking {
    id: string;
    bookingCode: string;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    guestNote?: string;
    roomId: string;
    roomNumber: string;
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    adults: number;
    children: number;
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    paymentStatus: 'pending' | 'partial' | 'paid';
    roomPrice: number;
    totalAmount: number;
    paidAmount: number;
    createdAt: string;
}

export interface Product {
    id: string;
    code: string;
    name: string;
    category: 'beverage' | 'alcohol' | 'snack' | 'other';
    price: number;
    stock: number;
    unit: string;
    isActive: boolean;
}

export interface User {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'staff';
    phone: string;
    email?: string;
    isActive: boolean;
    status: 'active' | 'inactive';
}

export interface Order {
    id: string;
    orderCode: string; // Added
    roomId?: string; // Added
    roomNumber?: string; // Added
    guestName?: string; // Added
    createdAt: string;
    subtotal: number; // Added
    discount: number; // Added
    total: number;
    items: OrderItem[];
    paymentMethod: string; // Added
    status: 'completed' | 'cancelled';
}

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}
