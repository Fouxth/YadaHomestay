import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Room, Booking, Product, User, Order } from '../types';

interface DataContextType {
    rooms: Room[];
    bookings: Booking[];
    products: Product[];
    users: User[];
    orders: Order[];
    currentUser: User | null;
    refreshData: () => void;
    updateRoomStatus: (roomId: string, status: Room['status']) => void;
    addBooking: (booking: Booking) => void;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
    isRoomAvailable: (roomId: string, checkIn: string, checkOut: string) => boolean;
    getAvailableRooms: (checkIn: string, checkOut: string, guests: number) => Room[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const initData = () => {
        // Rooms
        if (!localStorage.getItem('yada_rooms')) {
            const defaultRooms: Room[] = [
                { id: '1', number: '101', name: 'ห้องมาตรฐาน 101', type: 'standard', status: 'available', pricePerNight: 1200, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'], floor: 1, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
                { id: '2', number: '102', name: 'ห้องมาตรฐาน 102', type: 'standard', status: 'available', pricePerNight: 1200, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'], floor: 1, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
                { id: '3', number: '103', name: 'ห้องมาตรฐาน 103', type: 'standard', status: 'available', pricePerNight: 1200, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'], floor: 1, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600' },
                { id: '4', number: '201', name: 'ห้องดีลักซ์ 201', type: 'deluxe', status: 'available', pricePerNight: 1800, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'อ่างอาบน้ำ', 'ระเบียง'], floor: 2, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
                { id: '5', number: '202', name: 'ห้องดีลักซ์ 202', type: 'deluxe', status: 'available', pricePerNight: 1800, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'อ่างอาบน้ำ', 'ระเบียง'], floor: 2, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
                { id: '6', number: '301', name: 'ห้องแฟมิลี่ 301', type: 'family', status: 'available', pricePerNight: 2800, capacity: 4, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'ห้องนั่งเล่น', 'ครัวเล็ก'], floor: 3, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600' },
                { id: '7', number: '302', name: 'ห้องแฟมิลี่ 302', type: 'family', status: 'available', pricePerNight: 2800, capacity: 4, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'ห้องนั่งเล่น', 'ครัวเล็ก'], floor: 3, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
                { id: '8', number: '303', name: 'ห้องแฟมิลี่ 303', type: 'family', status: 'available', pricePerNight: 2800, capacity: 4, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'ห้องนั่งเล่น', 'ครัวเล็ก'], floor: 3, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600' }
            ];
            localStorage.setItem('yada_rooms', JSON.stringify(defaultRooms));
        }

        // Products
        if (!localStorage.getItem('yada_products')) {
            const defaultProducts: Product[] = [
                { id: '1', code: 'P001', name: 'น้ำดื่ม', category: 'beverage', price: 20, stock: 100, unit: 'ขวด', isActive: true },
                { id: '2', code: 'P002', name: 'โค้ก', category: 'beverage', price: 25, stock: 50, unit: 'กระป๋อง', isActive: true },
                { id: '3', code: 'P003', name: 'เบียร์สิงห์', category: 'alcohol', price: 70, stock: 30, unit: 'กระป๋อง', isActive: true },
                { id: '4', code: 'P004', name: 'เบียร์ช้าง', category: 'alcohol', price: 75, stock: 25, unit: 'กระป๋อง', isActive: true },
                { id: '5', code: 'P005', name: 'มาม่า', category: 'snack', price: 15, stock: 80, unit: 'ซอง', isActive: true },
                { id: '6', code: 'P006', name: 'ขนมปัง', category: 'snack', price: 25, stock: 20, unit: 'ชิ้น', isActive: true }
            ];
            localStorage.setItem('yada_products', JSON.stringify(defaultProducts));
        }

        // Users
        if (!localStorage.getItem('yada_users')) {
            const defaultUsers: User[] = [
                { id: '1', username: 'admin', name: 'เจ้าของรีสอร์ท', role: 'admin', phone: '081-234-5678', email: 'admin@yadahomestay.com', isActive: true, status: 'active' },
                { id: '2', username: 'staff1', name: 'สมชาย ใจดี', role: 'staff', phone: '082-345-6789', isActive: true, status: 'active' },
                { id: '3', username: 'staff2', name: 'นภา สวยงาม', role: 'staff', phone: '083-456-7890', email: 'napa@yadahomestay.com', isActive: true, status: 'active' },
                { id: '4', username: 'staff3', name: 'ประเสริฐ รำรวย', role: 'staff', phone: '084-567-8901', isActive: false, status: 'inactive' }
            ];
            localStorage.setItem('yada_users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('yada_bookings')) localStorage.setItem('yada_bookings', JSON.stringify([]));
        if (!localStorage.getItem('yada_orders')) localStorage.setItem('yada_orders', JSON.stringify([]));

        refreshData();
    };

    const refreshData = () => {
        setRooms(JSON.parse(localStorage.getItem('yada_rooms') || '[]'));
        setBookings(JSON.parse(localStorage.getItem('yada_bookings') || '[]'));
        setProducts(JSON.parse(localStorage.getItem('yada_products') || '[]'));
        setUsers(JSON.parse(localStorage.getItem('yada_users') || '[]'));
        setOrders(JSON.parse(localStorage.getItem('yada_orders') || '[]'));
    };

    useEffect(() => {
        initData();
        window.addEventListener('storage', refreshData);

        // Auth check
        const storedUser = localStorage.getItem('yada_current_user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        return () => window.removeEventListener('storage', refreshData);
    }, []);

    const login = (username: string, pass: string) => {
        // Hardcoded password from legacy app
        if (pass !== '123456') return false;

        // We need to fetch users if not yet loaded in state (though strict mode might cause issues, let's read from LS directly just in case)
        const currentUsers: User[] = JSON.parse(localStorage.getItem('yada_users') || '[]');
        const user = currentUsers.find(u => u.username === username && u.isActive);

        if (user) {
            setCurrentUser(user);
            localStorage.setItem('yada_current_user', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('yada_current_user');
    };

    const updateRoomStatus = (roomId: string, status: Room['status']) => {
        const updatedRooms = rooms.map(r => r.id === roomId ? { ...r, status } : r);
        localStorage.setItem('yada_rooms', JSON.stringify(updatedRooms));
        setRooms(updatedRooms);
    };

    const addBooking = (booking: Booking) => {
        const updatedBookings = [...bookings, booking];
        localStorage.setItem('yada_bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);

        // Update room status
        updateRoomStatus(booking.roomId, 'reserved');
    };

    const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
        const updatedBookings = bookings.map(b => {
            if (b.id === bookingId) {
                if (status === 'cancelled' && b.status !== 'cancelled') {
                    const room = rooms.find(r => r.id === b.roomId);
                    if (room) updateRoomStatus(room.id, 'available');
                }
                return { ...b, status };
            }
            return b;
        });
        localStorage.setItem('yada_bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
    };

    const isRoomAvailable = (roomId: string, checkIn: string, checkOut: string) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room || room.status === 'maintenance') return false;

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const overlapping = bookings.filter(b => {
            if (b.roomId !== roomId) return false;
            if (b.status === 'cancelled' || b.status === 'checked_out') return false;

            const bCheckIn = new Date(b.checkInDate);
            const bCheckOut = new Date(b.checkOutDate);
            return (checkInDate < bCheckOut && checkOutDate > bCheckIn);
        });

        return overlapping.length === 0;
    };

    const getAvailableRooms = (checkIn: string, checkOut: string, guests: number) => {
        return rooms.filter(room => {
            if (room.capacity < guests) return false;
            return isRoomAvailable(room.id, checkIn, checkOut);
        });
    };

    return (
        <DataContext.Provider value={{
            rooms, bookings, products, users, orders, currentUser,
            refreshData, updateRoomStatus, addBooking, updateBookingStatus,
            isRoomAvailable, getAvailableRooms, login, logout
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};
