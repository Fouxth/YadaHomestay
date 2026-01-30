import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Room, Booking, Product, User, Order } from '../types';
import { authAPI, roomsAPI, bookingsAPI, productsAPI, ordersAPI, usersAPI } from '../services/api';

interface DataContextType {
    rooms: Room[];
    bookings: Booking[];
    products: Product[];
    users: User[];
    orders: Order[];
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
    refreshRooms: () => Promise<void>;
    refreshBookings: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    refreshUsers: () => Promise<void>;
    refreshOrders: () => Promise<void>;
    updateRoomStatus: (roomId: string, status: Room['status']) => Promise<void>;
    addBooking: (booking: Partial<Booking>) => Promise<Booking>;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
    isRoomAvailable: (roomId: string, checkIn: string, checkOut: string) => boolean;
    getAvailableRooms: (checkIn: string, checkOut: string, guests: number) => Promise<Room[]>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Fetch public data (rooms, products) on initial mount
    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const [roomsData, productsData] = await Promise.all([
                    roomsAPI.getAll(),
                    productsAPI.getAll()
                ]);
                setRooms(roomsData);
                setProducts(productsData);
            } catch (err: any) {
                console.error('Error fetching public data:', err);
            }
        };
        fetchPublicData();
    }, []);

    const refreshRooms = useCallback(async () => {
        try {
            const data = await roomsAPI.getAll();
            setRooms(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch rooms');
        }
    }, []);

    const refreshBookings = useCallback(async () => {
        try {
            const data = await bookingsAPI.getAll();
            setBookings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings');
        }
    }, []);

    const refreshProducts = useCallback(async () => {
        try {
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products');
        }
    }, []);

    const refreshUsers = useCallback(async () => {
        try {
            const data = await usersAPI.getAll();
            // Transform isActive to status for frontend compatibility
            const transformedUsers = data.map((user: any) => ({
                ...user,
                status: user.isActive ? 'active' : 'inactive'
            }));
            setUsers(transformedUsers);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to fetch users');
        }
    }, []);

    const refreshOrders = useCallback(async () => {
        try {
            const data = await ordersAPI.getAll();
            setOrders(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch orders');
        }
    }, []);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await Promise.all([
                refreshRooms(),
                refreshBookings(),
                refreshProducts(),
                refreshUsers(),
                refreshOrders()
            ]);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh data');
        } finally {
            setIsLoading(false);
        }
    }, [refreshRooms, refreshBookings, refreshProducts, refreshUsers, refreshOrders]);

    // Load data when user is logged in
    useEffect(() => {
        if (currentUser) {
            console.log('[DataContext] User logged in, fetching all data...', currentUser);
            refreshRooms();
            refreshBookings();
            refreshProducts();
            refreshUsers();
            refreshOrders();
        }
    }, [currentUser, refreshRooms, refreshBookings, refreshProducts, refreshUsers, refreshOrders]);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.login(username, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                setCurrentUser(response.user);
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || 'Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setRooms([]);
        setBookings([]);
        setProducts([]);
        setUsers([]);
        setOrders([]);
    };

    const updateRoomStatus = async (roomId: string, status: Room['status']) => {
        try {
            await roomsAPI.update(roomId, { status });
            await refreshRooms();
        } catch (err: any) {
            setError(err.message || 'Failed to update room status');
            throw err;
        }
    };

    const addBooking = async (booking: Partial<Booking>): Promise<Booking> => {
        try {
            const newBooking = await bookingsAPI.create(booking);
            await refreshBookings();
            await refreshRooms();
            return newBooking;
        } catch (err: any) {
            setError(err.message || 'Failed to create booking');
            throw err;
        }
    };

    const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
        try {
            await bookingsAPI.update(bookingId, { status });
            await refreshBookings();
            await refreshRooms();
        } catch (err: any) {
            setError(err.message || 'Failed to update booking status');
            throw err;
        }
    };

    const isRoomAvailable = (roomId: string, checkIn: string, checkOut: string): boolean => {
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

    const getAvailableRooms = async (checkIn: string, checkOut: string, guests: number): Promise<Room[]> => {
        try {
            const availableRooms = await roomsAPI.getAvailable(checkIn, checkOut, guests);
            return availableRooms;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch available rooms');
            return [];
        }
    };

    const clearError = () => setError(null);

    return (
        <DataContext.Provider value={{
            rooms,
            bookings,
            products,
            users,
            orders,
            currentUser,
            isLoading,
            error,
            refreshData,
            refreshRooms,
            refreshBookings,
            refreshProducts,
            refreshUsers,
            refreshOrders,
            updateRoomStatus,
            addBooking,
            updateBookingStatus,
            isRoomAvailable,
            getAvailableRooms,
            login,
            logout,
            clearError
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
