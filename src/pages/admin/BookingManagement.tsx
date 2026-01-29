import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search, Calendar, X as XIcon, ChevronDown } from 'lucide-react';
import type { Booking } from '../../types';

export const BookingManagement = () => {
    const { bookings, updateBookingStatus } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = { pending: 'รอยืนยัน', confirmed: 'ยืนยันแล้ว', checked_in: 'Check-in แล้ว', checked_out: 'Check-out แล้ว', cancelled: 'ยกเลิก' };
        return texts[status] || status;
    };
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', checked_in: 'bg-green-100 text-green-700', checked_out: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700' };
        return colors[status] || 'bg-gray-100 text-gray-700';
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
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">การจองทั้งหมด</h1>
                    <p className="text-gray-500">จัดการและดูรายละเอียดการจอง</p>
                </div>
                <button className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 self-start">
                    <Plus className="w-5 h-5" /> รับจอง Walk-in
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { key: 'all', label: 'ทั้งหมด', count: statusCounts.all },
                    { key: 'pending', label: 'รอยืนยัน', count: statusCounts.pending },
                    { key: 'confirmed', label: 'Check-in วันนี้', count: statusCounts.confirmed },
                    { key: 'checked_in', label: 'Check-out วันนี้', count: statusCounts.checked_in },
                    { key: 'checked_out', label: 'ยกเลิก', count: bookings.filter(b => b.status === 'cancelled').length },
                ].map(s => (
                    <div
                        key={s.key}
                        onClick={() => setStatusFilter(s.key)}
                        className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all border-2 ${statusFilter === s.key ? 'border-primary' : 'border-transparent'}`}
                    >
                        <p className="text-3xl font-bold text-gray-800">{s.count}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อลูกค้า, รหัสจอง, หมายเลขห้อง..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">ทุกสถานะ</option>
                        <option value="pending">รอยืนยัน</option>
                        <option value="confirmed">ยืนยันแล้ว</option>
                        <option value="checked_in">Check-in แล้ว</option>
                        <option value="checked_out">Check-out แล้ว</option>
                        <option value="cancelled">ยกเลิก</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {filteredBookings.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">รหัสจอง</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ลูกค้า</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ห้อง</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">วันที่</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">จองเวลา</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">สถานะ</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredBookings.map(booking => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm">{booking.bookingCode}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{booking.guestName}</p>
                                        <p className="text-sm text-gray-500">{booking.guestPhone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{booking.roomNumber}</p>
                                        <p className="text-sm text-gray-500">{booking.roomName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <p>{new Date(booking.checkInDate).toLocaleDateString('th-TH')}</p>
                                        <p className="text-gray-500">ถึง {new Date(booking.checkOutDate).toLocaleDateString('th-TH')}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{booking.nights} คืน</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setSelectedBooking(booking)} className="text-primary hover:underline text-sm">ดูรายละเอียด</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-16">
                        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">ไม่พบการจอง</p>
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">รายละเอียดการจอง</h3>
                            <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-gray-500 text-sm">รหัสจอง</p><p className="font-mono font-bold">{selectedBooking.bookingCode}</p></div>
                                <div><p className="text-gray-500 text-sm">สถานะ</p><span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>{getStatusText(selectedBooking.status)}</span></div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-gray-500 text-sm mb-2">ข้อมูลลูกค้า</p>
                                <p className="font-bold">{selectedBooking.guestName}</p>
                                <p className="text-gray-600">{selectedBooking.guestPhone}</p>
                                {selectedBooking.guestEmail && <p className="text-gray-600">{selectedBooking.guestEmail}</p>}
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-gray-500 text-sm mb-2">ข้อมูลการเข้าพัก</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-500">ห้อง</p><p className="font-bold">{selectedBooking.roomNumber}</p></div>
                                    <div><p className="text-sm text-gray-500">จำนวนคืน</p><p className="font-bold">{selectedBooking.nights} คืน</p></div>
                                    <div><p className="text-sm text-gray-500">Check-in</p><p>{new Date(selectedBooking.checkInDate).toLocaleDateString('th-TH')}</p></div>
                                    <div><p className="text-sm text-gray-500">Check-out</p><p>{new Date(selectedBooking.checkOutDate).toLocaleDateString('th-TH')}</p></div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-gray-500 text-sm mb-2">ข้อมูลชำระเงิน</p>
                                <div className="flex justify-between">
                                    <span>ยอดรวม</span>
                                    <span className="font-bold text-primary">฿{selectedBooking.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t flex gap-2">
                            {selectedBooking.status === 'confirmed' && (
                                <button onClick={() => { updateBookingStatus(selectedBooking.id, 'checked_in'); setSelectedBooking({ ...selectedBooking, status: 'checked_in' }); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium">Check-in</button>
                            )}
                            {selectedBooking.status === 'checked_in' && (
                                <button onClick={() => { updateBookingStatus(selectedBooking.id, 'checked_out'); setSelectedBooking({ ...selectedBooking, status: 'checked_out' }); }} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium">Check-out</button>
                            )}
                            {selectedBooking.status === 'pending' && (
                                <>
                                    <button onClick={() => { updateBookingStatus(selectedBooking.id, 'confirmed'); setSelectedBooking({ ...selectedBooking, status: 'confirmed' }); }} className="flex-1 bg-primary hover:bg-green-800 text-white py-3 rounded-xl font-medium">ยืนยันการจอง</button>
                                    <button onClick={() => { updateBookingStatus(selectedBooking.id, 'cancelled'); setSelectedBooking({ ...selectedBooking, status: 'cancelled' }); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium">ยกเลิก</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
