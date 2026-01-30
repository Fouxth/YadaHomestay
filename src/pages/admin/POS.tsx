import { useState, useEffect } from 'react';
import { UserPlus, LogIn, LogOut, Calendar, Bed, XCircle } from 'lucide-react';
import { bookingsAPI, roomsAPI } from '../../services/api';

interface Booking {
    id: string;
    roomId: string;
    roomNumber: string;
    roomName: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    totalAmount: number;
    paidAmount: number;
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
}

interface Room {
    id: string;
    number: string;
    name: string;
    type: string;
    price: number;
    status: string;
}

export const POS = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'checkin' | 'checkout' | 'active'>('checkin');
    const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    // Walk-in form
    const [walkInData, setWalkInData] = useState({
        roomId: '',
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        nights: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [bookingsData, roomsData] = await Promise.all([
                bookingsAPI.getAll(),
                roomsAPI.getAll()
            ]);
            setBookings(bookingsData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toDateString();

    const todayCheckIns = bookings.filter(b => new Date(b.checkInDate).toDateString() === today && b.status === 'confirmed');
    const todayCheckOuts = bookings.filter(b => new Date(b.checkOutDate).toDateString() === today && b.status === 'checked_in');
    const activeBookings = bookings.filter(b => b.status === 'checked_in');
    const todayRevenue = bookings.filter(b => new Date(b.checkInDate).toDateString() === today).reduce((sum, b) => sum + b.paidAmount, 0);

    const handleCheckIn = async (booking: Booking) => {
        try {
            setProcessing(booking.id);
            await bookingsAPI.checkIn(booking.id);
            await loadData();
            alert(`Check-in คุณ ${booking.guestName} สำเร็จ`);
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        } finally {
            setProcessing(null);
        }
    };

    const handleCheckOut = async (booking: Booking) => {
        if (booking.paidAmount < booking.totalAmount) {
            if (!confirm(`มียอดค้างชำระ ฿${(booking.totalAmount - booking.paidAmount).toLocaleString()} ต้องการ Check-out หรือไม่?`)) {
                return;
            }
        }
        try {
            setProcessing(booking.id);
            await bookingsAPI.checkOut(booking.id);
            await loadData();
            alert(`Check-out คุณ ${booking.guestName} สำเร็จ`);
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        } finally {
            setProcessing(null);
        }
    };

    const handleWalkIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setProcessing('walkin');
            const selectedRoom = rooms.find(r => r.id === walkInData.roomId);
            if (!selectedRoom) return;

            const checkInDate = new Date();
            const checkOutDate = new Date();
            checkOutDate.setDate(checkOutDate.getDate() + walkInData.nights);

            const bookingData = {
                roomId: walkInData.roomId,
                guestName: walkInData.guestName,
                guestPhone: walkInData.guestPhone,
                guestEmail: walkInData.guestEmail,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                nights: walkInData.nights,
                totalAmount: selectedRoom.price * walkInData.nights,
                paidAmount: selectedRoom.price * walkInData.nights,
                status: 'checked_in'
            };

            await bookingsAPI.create(bookingData);
            await loadData();
            setIsWalkInModalOpen(false);
            setWalkInData({ roomId: '', guestName: '', guestPhone: '', guestEmail: '', nights: 1 });
            alert('Walk-in สำเร็จ!');
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        } finally {
            setProcessing(null);
        }
    };

    const getListData = () => {
        if (activeTab === 'checkin') return todayCheckIns;
        if (activeTab === 'checkout') return todayCheckOuts;
        return activeBookings;
    };

    const availableRooms = rooms.filter(r => r.status === 'available');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">POS / หน้าร้าน</h1>
                    <p className="text-gray-500">จัดการ Check-in, Check-out และการจอง</p>
                </div>
                <button
                    onClick={() => setIsWalkInModalOpen(true)}
                    className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 self-start"
                >
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
                        Check-in วันนี้ ({todayCheckIns.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('checkout')}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'checkout' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Check-out วันนี้ ({todayCheckOuts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'active' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        กำลังเข้าพัก ({activeBookings.length})
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
                            {activeTab === 'checkin' && todayCheckIns.map(b => (
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
                                    <button
                                        onClick={() => handleCheckIn(b)}
                                        disabled={processing === b.id}
                                        className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium disabled:opacity-50"
                                    >
                                        {processing === b.id ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <LogIn className="w-4 h-4" />
                                        )}
                                        Check-in
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
                                    <button
                                        onClick={() => handleCheckOut(b)}
                                        disabled={processing === b.id}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium disabled:opacity-50"
                                    >
                                        {processing === b.id ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <LogOut className="w-4 h-4" />
                                        )}
                                        Check-out
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

            {/* Walk-in Modal */}
            {isWalkInModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Walk-in / จองใหม่</h3>
                            <button
                                onClick={() => setIsWalkInModalOpen(false)}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleWalkIn} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">เลือกห้อง *</label>
                                <select
                                    value={walkInData.roomId}
                                    onChange={e => setWalkInData({ ...walkInData, roomId: e.target.value })}
                                    className="input w-full"
                                    required
                                >
                                    <option value="">-- เลือกห้องว่าง --</option>
                                    {availableRooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.number} - {room.name} (฿{room.price}/คืน)
                                        </option>
                                    ))}
                                </select>
                                {availableRooms.length === 0 && (
                                    <p className="text-sm text-red-500 mt-1">ไม่มีห้องว่าง</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อผู้เข้าพัก *</label>
                                <input
                                    type="text"
                                    value={walkInData.guestName}
                                    onChange={e => setWalkInData({ ...walkInData, guestName: e.target.value })}
                                    className="input w-full"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">เบอร์โทร *</label>
                                    <input
                                        type="tel"
                                        value={walkInData.guestPhone}
                                        onChange={e => setWalkInData({ ...walkInData, guestPhone: e.target.value })}
                                        className="input w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">จำนวนคืน *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={walkInData.nights}
                                        onChange={e => setWalkInData({ ...walkInData, nights: parseInt(e.target.value) || 1 })}
                                        className="input w-full"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">อีเมล</label>
                                <input
                                    type="email"
                                    value={walkInData.guestEmail}
                                    onChange={e => setWalkInData({ ...walkInData, guestEmail: e.target.value })}
                                    className="input w-full"
                                />
                            </div>

                            {walkInData.roomId && (
                                <div className="p-4 bg-primary/5 rounded-lg">
                                    <p className="text-sm text-gray-600">ยอดรวม:</p>
                                    <p className="text-2xl font-bold text-primary">
                                        ฿{((rooms.find(r => r.id === walkInData.roomId)?.price || 0) * walkInData.nights).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsWalkInModalOpen(false)} className="btn-secondary flex-1">
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing === 'walkin' || availableRooms.length === 0}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    {processing === 'walkin' ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <UserPlus className="w-5 h-5" />
                                    )}
                                    {processing === 'walkin' ? 'กำลังบันทึก...' : 'ยืนยัน Walk-in'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
