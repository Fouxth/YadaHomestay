import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserPlus, LogIn, LogOut, Calendar, Bed } from 'lucide-react';
import type { Booking } from '../../types';

export const POS = () => {
    const { bookings, updateBookingStatus, updateRoomStatus, orders } = useData();
    const [activeTab, setActiveTab] = useState<'checkin' | 'checkout' | 'active'>('checkin');

    const today = new Date().toDateString();

    const todayCheckIns = bookings.filter(b => new Date(b.checkInDate).toDateString() === today && (b.status === 'confirmed'));
    const todayCheckOuts = bookings.filter(b => new Date(b.checkOutDate).toDateString() === today && (b.status === 'checked_in'));
    const activeBookings = bookings.filter(b => b.status === 'checked_in');
    const todayRevenue = orders.filter(o => new Date(o.createdAt).toDateString() === today).reduce((sum, o) => sum + o.total, 0) +
        bookings.filter(b => new Date(b.checkInDate).toDateString() === today).reduce((sum, b) => sum + b.paidAmount, 0);

    const handleCheckIn = (booking: Booking) => {
        updateBookingStatus(booking.id, 'checked_in');
        updateRoomStatus(booking.roomId, 'occupied');
        alert(`Check-in คุณ ${booking.guestName} สำเร็จ`);
    };

    const handleCheckOut = (booking: Booking) => {
        if (booking.paidAmount < booking.totalAmount) {
            alert('มียอดค้างชำระ กรุณาชำระเงินก่อน');
            return;
        }
        updateBookingStatus(booking.id, 'checked_out');
        updateRoomStatus(booking.roomId, 'cleaning');
        alert(`Check-out คุณ ${booking.guestName} สำเร็จ`);
    };

    const getListData = () => {
        if (activeTab === 'checkin') return todayCheckIns.filter(b => b.status === 'confirmed');
        if (activeTab === 'checkout') return todayCheckOuts;
        return activeBookings;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">POS / หน้าร้าน</h1>
                    <p className="text-gray-500">จัดการ Check-in, Check-out และการจอง</p>
                </div>
                <button className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 self-start">
                    <UserPlus className="w-5 h-5" /> Walk-in / จองใหม่
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{todayCheckIns.length}</p>
                            <p className="text-sm text-gray-500">Check-in วันนี้</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <LogOut className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{todayCheckOuts.length}</p>
                            <p className="text-sm text-gray-500">Check-out วันนี้</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Bed className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{activeBookings.length}</p>
                            <p className="text-sm text-gray-500">กำลังเข้าพัก</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">฿</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">฿{todayRevenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">รายได้วันนี้</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('checkin')}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'checkin' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Check-in วันนี้
                    </button>
                    <button
                        onClick={() => setActiveTab('checkout')}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'checkout' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Check-out วันนี้
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'active' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        กำลังเข้าพัก
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {getListData().length === 0 ? (
                        <div className="text-center py-16">
                            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">
                                {activeTab === 'checkin' && 'ไม่มีรายการ Check-in วันนี้'}
                                {activeTab === 'checkout' && 'ไม่มีรายการ Check-out วันนี้'}
                                {activeTab === 'active' && 'ไม่มีผู้เข้าพักในขณะนี้'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Check-in List */}
                            {activeTab === 'checkin' && todayCheckIns.filter(b => b.status === 'confirmed').map(b => (
                                <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <span className="text-primary font-bold">{b.roomNumber}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{b.guestName}</p>
                                            <p className="text-sm text-gray-500">{b.roomName} • {b.nights} คืน</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleCheckIn(b)} className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                                        <LogIn className="w-4 h-4" /> Check-in
                                    </button>
                                </div>
                            ))}

                            {/* Check-out List */}
                            {activeTab === 'checkout' && todayCheckOuts.map(b => (
                                <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <span className="text-orange-600 font-bold">{b.roomNumber}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{b.guestName}</p>
                                            <p className="text-sm text-gray-500">{b.roomName} • {b.nights} คืน</p>
                                            {b.paidAmount < b.totalAmount && (
                                                <p className="text-xs text-red-500">ค้างชำระ ฿{(b.totalAmount - b.paidAmount).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleCheckOut(b)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                                        <LogOut className="w-4 h-4" /> Check-out
                                    </button>
                                </div>
                            ))}

                            {/* Active Bookings */}
                            {activeTab === 'active' && activeBookings.map(b => (
                                <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-600 font-bold">{b.roomNumber}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{b.guestName}</p>
                                            <p className="text-sm text-gray-500">{b.roomName}</p>
                                            <p className="text-xs text-gray-400">Check-out: {new Date(b.checkOutDate).toLocaleDateString('th-TH')}</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">พักอยู่</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
