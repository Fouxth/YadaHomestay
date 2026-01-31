import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Eye, Filter, Image } from 'lucide-react';
import { paymentAPI } from '../../services/api';

interface PaymentSlip {
    id: string;
    imageUrl: string;
    amount?: number;
    status: string;
    notes?: string;
    createdAt: string;
    verifiedAt?: string;
    booking: {
        bookingCode: string;
        guestName: string;
        guestPhone: string;
        totalAmount: number;
        paidAmount: number;
        paymentStatus: string;
        room: { name: string; number: string };
    };
    verifiedBy?: { name: string };
}

const PaymentVerification = () => {
    const [slips, setSlips] = useState<PaymentSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
    const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0, total: 0 });
    const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null);
    const [processing, setProcessing] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [slipsData, statsData] = await Promise.all([
                paymentAPI.getAll(filter === 'all' ? undefined : filter),
                paymentAPI.getStats()
            ]);
            setSlips(slipsData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load payment data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (status: 'verified' | 'rejected', notes?: string) => {
        if (!selectedSlip) return;

        try {
            setProcessing(true);
            await paymentAPI.verify(selectedSlip.id, status, notes);
            setSelectedSlip(null);
            loadData();
        } catch (error) {
            console.error('Failed to verify slip:', error);
            alert('เกิดข้อผิดพลาดในการดำเนินการ');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: any }> = {
            pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
            verified: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
        };
        const style = styles[status] || styles.pending;
        const Icon = style.icon;
        const labels: Record<string, string> = {
            pending: 'รอตรวจสอบ', verified: 'ยืนยันแล้ว', rejected: 'ปฏิเสธ'
        };
        return (
            <span className={`${style.bg} ${style.text} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
                <Icon className="w-3 h-3" />
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-accent" />
                        </div>
                        ตรวจสอบการชำระเงิน
                    </h1>
                    <p className="page-subtitle">ดูและยืนยันสลิปโอนเงินจากลูกค้า</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="stat-card">
                    <p className="stat-card-label">รอตรวจสอบ</p>
                    <p className="stat-card-value text-amber-600">{stats.pending}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-label">ยืนยันแล้ว</p>
                    <p className="stat-card-value text-green-600">{stats.verified}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-label">ปฏิเสธ</p>
                    <p className="stat-card-value text-red-600">{stats.rejected}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-card-label">ทั้งหมด</p>
                    <p className="stat-card-value">{stats.total}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(['all', 'pending', 'verified', 'rejected'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-accent text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {f === 'all' ? 'ทั้งหมด' : f === 'pending' ? 'รอตรวจสอบ' : f === 'verified' ? 'ยืนยันแล้ว' : 'ปฏิเสธ'}
                    </button>
                ))}
            </div>

            {/* Slips Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                ) : slips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Image className="w-12 h-12 mb-3 opacity-30" />
                        <p>ไม่มีสลิปในหมวดหมู่นี้</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สลิป</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">รหัสจอง</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ชื่อลูกค้า</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ยอดเงิน</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สถานะ</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">วันที่</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {slips.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={`${API_BASE}${slip.imageUrl}`}
                                                alt="Slip"
                                                className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedSlip(slip)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-accent">{slip.booking.bookingCode}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{slip.booking.guestName}</p>
                                            <p className="text-sm text-gray-500">{slip.booking.guestPhone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-accent">฿{slip.booking.totalAmount.toLocaleString()}</p>
                                            {slip.amount && (
                                                <p className="text-xs text-gray-500">สลิป: ฿{slip.amount.toLocaleString()}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(slip.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(slip.createdAt).toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedSlip(slip)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slip Detail Modal */}
            {selectedSlip && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">รายละเอียดสลิป</h3>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            {/* Slip Image */}
                            <div>
                                <img
                                    src={`${API_BASE}${selectedSlip.imageUrl}`}
                                    alt="Payment Slip"
                                    className="w-full rounded-xl shadow-lg"
                                />
                            </div>
                            {/* Booking Info */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">รหัสการจอง</p>
                                    <p className="text-xl font-bold text-accent">{selectedSlip.booking.bookingCode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ห้องพัก</p>
                                    <p className="font-medium">{selectedSlip.booking.room?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ชื่อลูกค้า</p>
                                    <p className="font-medium">{selectedSlip.booking.guestName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ยอดที่ต้องชำระ</p>
                                    <p className="text-2xl font-bold text-accent">฿{selectedSlip.booking.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">สถานะปัจจุบัน</p>
                                    {getStatusBadge(selectedSlip.status)}
                                </div>
                                {selectedSlip.verifiedBy && (
                                    <div>
                                        <p className="text-sm text-gray-500">ตรวจสอบโดย</p>
                                        <p className="font-medium">{selectedSlip.verifiedBy.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                            <button
                                onClick={() => setSelectedSlip(null)}
                                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                ปิด
                            </button>
                            {selectedSlip.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleVerify('rejected', 'สลิปไม่ถูกต้อง')}
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        ปฏิเสธ
                                    </button>
                                    <button
                                        onClick={() => handleVerify('verified')}
                                        disabled={processing}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        ยืนยันการชำระเงิน
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentVerification;
