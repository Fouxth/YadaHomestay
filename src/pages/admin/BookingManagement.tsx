import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search, Calendar, X, ChevronDown, Filter, MoreHorizontal, CheckCircle, XCircle, User, Phone, Mail } from 'lucide-react';
import type { Booking } from '../../types';

export const BookingManagement = () => {
    const { bookings, updateBookingStatus } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
            await updateBookingStatus(bookingId, newStatus);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Failed to update booking status:', error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">การจองทั้งหมด</h1>
                    <p className="page-subtitle">จัดการและดูรายละเอียดการจอง</p>
                </div>
                <button className="btn-primary">
                    <Plus className="w-4 h-4" />
                    รับจอง Walk-in
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { key: 'all', label: 'ทั้งหมด', count: statusCounts.all },
                    { key: 'pending', label: 'รอยืนยัน', count: statusCounts.pending },
                    { key: 'confirmed', label: 'ยืนยันแล้ว', count: statusCounts.confirmed },
                    { key: 'checked_in', label: 'Check-in', count: statusCounts.checked_in },
                    { key: 'checked_out', label: 'Check-out', count: statusCounts.checked_out },
                    { key: 'cancelled', label: 'ยกเลิก', count: statusCounts.cancelled },
                ].map(s => (
                    <div
                        key={s.key}
                        onClick={() => setStatusFilter(s.key)}
                        className={`card p-4 cursor-pointer transition-all ${statusFilter === s.key ? 'ring-2 ring-accent border-accent' : ''
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
                                            className="btn-primary flex-1"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            ยืนยันการจอง
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                                            className="btn-danger flex-1"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            ยกเลิก
                                        </button>
                                    </>
                                )}
                                {selectedBooking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking.id, 'checked_in')}
                                        className="btn-primary w-full"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Check-in
                                    </button>
                                )}
                                {selectedBooking.status === 'checked_in' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking.id, 'checked_out')}
                                        className="btn-primary w-full"
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
        </div>
    );
};
