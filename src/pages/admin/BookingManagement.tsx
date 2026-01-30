import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, X, ChevronDown, Filter, MoreHorizontal, CheckCircle, XCircle, User, Phone, Mail, Home, Moon } from 'lucide-react';
import { bookingsAPI, roomsAPI } from '../../services/api';
import type { Booking, Room } from '../../types';

export const BookingManagement = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [walkInData, setWalkInData] = useState({
        roomId: '',
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: 1,
        children: 0,
        paymentMethod: 'cash',
        paidAmount: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [bookingsData, roomsData] = await Promise.all([
                bookingsAPI.getAll(),
                roomsAPI.getAll()
            ]);
            setBookings(bookingsData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            pending: 'รอยืนยัน',
            confirmed: 'ยืนยันแล้ว',
            checked_in: 'Check-in',
            checked_out: 'Check-out',
            cancelled: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'badge-warning',
            confirmed: 'badge-info',
            checked_in: 'badge-success',
            checked_out: 'badge-secondary',
            cancelled: 'badge-danger'
        };
        return styles[status] || 'badge-secondary';
    };

    const filteredBookings = bookings.filter(b => {
        const matchSearch = b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.roomNumber.includes(searchTerm);
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusCounts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        checked_in: bookings.filter(b => b.status === 'checked_in').length,
        checked_out: bookings.filter(b => b.status === 'checked_out').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
        try {
            setLoading(true);
            await bookingsAPI.update(bookingId, { status: newStatus });
            setSelectedBooking(null);
            await loadData();
        } catch (error) {
            console.error('Failed to update booking status:', error);
            alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
        } finally {
            setLoading(false);
        }
    };

    const handleWalkIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walkInData.roomId) {
            alert('กรุณาเลือกห้อง');
            return;
        }
        try {
            setLoading(true);
            const room = rooms.find(r => r.id === walkInData.roomId);
            const checkIn = new Date(walkInData.checkInDate);
            const checkOut = new Date(walkInData.checkOutDate);
            const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
            const totalAmount = room ? room.pricePerNight * nights : 0;

            await bookingsAPI.create({
                ...walkInData,
                nights,
                totalAmount,
                roomNumber: room?.number || '',
                status: 'checked_in' // Walk-in = instant check-in
            });

            setShowWalkInModal(false);
            setWalkInData({
                roomId: '',
                guestName: '',
                guestPhone: '',
                guestEmail: '',
                checkInDate: new Date().toISOString().split('T')[0],
                checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                adults: 1,
                children: 0,
                paymentMethod: 'cash',
                paidAmount: 0
            });
            await loadData();
        } catch (error) {
            console.error('Failed to create walk-in booking:', error);
            alert('เกิดข้อผิดพลาดในการสร้างการจอง');
        } finally {
            setLoading(false);
        }
    };

    const availableRooms = rooms.filter(r => r.status === 'available');

    const calculateNights = () => {
        const checkIn = new Date(walkInData.checkInDate);
        const checkOut = new Date(walkInData.checkOutDate);
        return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const calculateTotal = () => {
        const room = rooms.find(r => r.id === walkInData.roomId);
        return room ? room.pricePerNight * calculateNights() : 0;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">การจองทั้งหมด</h1>
                    <p className="page-subtitle">จัดการและดูรายละเอียดการจอง</p>
                </div>
                <button
                    onClick={() => setShowWalkInModal(true)}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    รับจอง Walk-in
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { key: 'all', label: 'ทั้งหมด', count: statusCounts.all, color: 'border-gray-400' },
                    { key: 'pending', label: 'รอยืนยัน', count: statusCounts.pending, color: 'border-warning' },
                    { key: 'confirmed', label: 'ยืนยันแล้ว', count: statusCounts.confirmed, color: 'border-info' },
                    { key: 'checked_in', label: 'Check-in', count: statusCounts.checked_in, color: 'border-success' },
                    { key: 'checked_out', label: 'Check-out', count: statusCounts.checked_out, color: 'border-secondary' },
                    { key: 'cancelled', label: 'ยกเลิก', count: statusCounts.cancelled, color: 'border-danger' },
                ].map(s => (
                    <div
                        key={s.key}
                        onClick={() => setStatusFilter(s.key)}
                        className={`card p-4 cursor-pointer transition-all border-l-4 ${s.color} ${statusFilter === s.key ? 'ring-2 ring-accent border-accent' : ''
                            }`}
                    >
                        <p className="text-2xl font-bold text-text-primary">{s.count}</p>
                        <p className="text-xs text-text-muted">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="input-group flex-1">
                        <Search className="input-group-icon" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อลูกค้า, รหัสจอง, หมายเลขห้อง..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="input pl-10 pr-10 appearance-none cursor-pointer"
                        >
                            <option value="all">ทุกสถานะ</option>
                            <option value="pending">รอยืนยัน</option>
                            <option value="confirmed">ยืนยันแล้ว</option>
                            <option value="checked_in">Check-in แล้ว</option>
                            <option value="checked_out">Check-out แล้ว</option>
                            <option value="cancelled">ยกเลิก</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัสจอง</th>
                                <th>ลูกค้า</th>
                                <th>ห้อง</th>
                                <th>วันที่เข้าพัก</th>
                                <th>จำนวนคืน</th>
                                <th>ยอดรวม</th>
                                <th>สถานะ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map(booking => (
                                    <tr key={booking.id} className="cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                                        <td className="font-medium">{booking.bookingCode}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{booking.guestName}</p>
                                                    <p className="text-xs text-text-muted">{booking.guestPhone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-medium">{booking.roomNumber}</span>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <p>{new Date(booking.checkInDate).toLocaleDateString('th-TH')}</p>
                                                <p className="text-text-muted text-xs">ถึง {new Date(booking.checkOutDate).toLocaleDateString('th-TH')}</p>
                                            </div>
                                        </td>
                                        <td>{booking.nights} คืน</td>
                                        <td className="font-medium">฿{booking.totalAmount.toLocaleString()}</td>
                                        <td>
                                            <span className={getStatusBadge(booking.status)}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-text-muted" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-12">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-30" />
                                        <p className="text-text-muted">ไม่พบการจอง</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">รายละเอียดการจอง</h3>
                                <p className="text-sm text-text-muted">{selectedBooking.bookingCode}</p>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Guest Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                                    <User className="w-7 h-7 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{selectedBooking.guestName}</h4>
                                    <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {selectedBooking.guestPhone}
                                        </span>
                                        {selectedBooking.guestEmail && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {selectedBooking.guestEmail}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">ห้องพัก</p>
                                    <p className="font-semibold">{selectedBooking.roomNumber}</p>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">จำนวนคืน</p>
                                    <p className="font-semibold">{selectedBooking.nights} คืน</p>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">Check-in</p>
                                    <p className="font-semibold">{new Date(selectedBooking.checkInDate).toLocaleDateString('th-TH')}</p>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">Check-out</p>
                                    <p className="font-semibold">{new Date(selectedBooking.checkOutDate).toLocaleDateString('th-TH')}</p>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="p-4 bg-surface-hover rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-text-muted">ยอดรวม</span>
                                    <span className="font-semibold text-lg">฿{selectedBooking.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted">ชำระแล้ว</span>
                                    <span className="font-medium text-success">฿{selectedBooking.paidAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-text-muted">สถานะ</span>
                                <span className={getStatusBadge(selectedBooking.status)}>
                                    {getStatusText(selectedBooking.status)}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                                {selectedBooking.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                                            disabled={loading}
                                            className="btn-primary bg-info hover:bg-info/90 flex-1 disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            ยืนยันการจอง
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                                            disabled={loading}
                                            className="btn-primary bg-danger hover:bg-danger/90 flex-1 disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            ยกเลิก
                                        </button>
                                    </>
                                )}
                                {selectedBooking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking.id, 'checked_in')}
                                        disabled={loading}
                                        className="btn-primary bg-success hover:bg-success/90 w-full disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Check-in
                                    </button>
                                )}
                                {selectedBooking.status === 'checked_in' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking.id, 'checked_out')}
                                        disabled={loading}
                                        className="btn-primary bg-accent hover:bg-accent/90 w-full disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Check-out
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Walk-in Modal */}
            {showWalkInModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-semibold">รับจอง Walk-in</h3>
                            <button
                                onClick={() => setShowWalkInModal(false)}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleWalkIn} className="p-6 space-y-4">
                            {/* Room Selection */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">เลือกห้อง *</label>
                                <select
                                    required
                                    className="input"
                                    value={walkInData.roomId}
                                    onChange={(e) => setWalkInData({ ...walkInData, roomId: e.target.value })}
                                >
                                    <option value="">เลือกห้องว่าง...</option>
                                    {availableRooms.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.number} - {r.name} (฿{r.pricePerNight.toLocaleString()}/คืน)
                                        </option>
                                    ))}
                                </select>
                                {availableRooms.length === 0 && (
                                    <p className="text-sm text-danger mt-1">ไม่มีห้องว่าง</p>
                                )}
                            </div>

                            {/* Guest Info */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">ชื่อผู้เข้าพัก *</label>
                                <input
                                    required
                                    className="input"
                                    placeholder="ชื่อ-นามสกุล"
                                    value={walkInData.guestName}
                                    onChange={(e) => setWalkInData({ ...walkInData, guestName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">เบอร์โทร *</label>
                                    <input
                                        required
                                        className="input"
                                        placeholder="0xx-xxx-xxxx"
                                        value={walkInData.guestPhone}
                                        onChange={(e) => setWalkInData({ ...walkInData, guestPhone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">อีเมล</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="email@example.com"
                                        value={walkInData.guestEmail}
                                        onChange={(e) => setWalkInData({ ...walkInData, guestEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">วัน Check-in</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={walkInData.checkInDate}
                                        onChange={(e) => setWalkInData({ ...walkInData, checkInDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">วัน Check-out</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={walkInData.checkOutDate}
                                        min={walkInData.checkInDate}
                                        onChange={(e) => setWalkInData({ ...walkInData, checkOutDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ผู้ใหญ่</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input"
                                        value={walkInData.adults}
                                        onChange={(e) => setWalkInData({ ...walkInData, adults: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">เด็ก</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input"
                                        value={walkInData.children}
                                        onChange={(e) => setWalkInData({ ...walkInData, children: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Payment */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">วิธีชำระเงิน</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['cash', 'transfer', 'credit'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setWalkInData({ ...walkInData, paymentMethod: method })}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${walkInData.paymentMethod === method
                                                ? 'border-accent bg-accent/10 text-accent'
                                                : 'border-border text-text-secondary hover:border-accent/50'
                                                }`}
                                        >
                                            {method === 'cash' ? 'เงินสด' :
                                                method === 'transfer' ? 'โอนเงิน' : 'บัตรเครดิต'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            {walkInData.roomId && (
                                <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Home className="w-5 h-5 text-accent" />
                                        <span className="font-medium">
                                            {rooms.find(r => r.id === walkInData.roomId)?.number} - {rooms.find(r => r.id === walkInData.roomId)?.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="flex items-center gap-2 text-text-secondary">
                                            <Moon className="w-4 h-4" />
                                            {calculateNights()} คืน
                                        </span>
                                        <span>฿{rooms.find(r => r.id === walkInData.roomId)?.pricePerNight.toLocaleString()}/คืน</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-accent/20">
                                        <span className="font-medium">ยอดรวม</span>
                                        <span className="text-xl font-bold text-accent">฿{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowWalkInModal(false)}
                                    className="btn-secondary"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || availableRooms.length === 0}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'Check-in ทันที'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
