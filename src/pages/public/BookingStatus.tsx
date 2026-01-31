import { useState } from 'react';
import { Search, Upload, CheckCircle, Clock, XCircle, CreditCard, Building, Calendar, User, Phone, Mail, FileImage } from 'lucide-react';
import { paymentAPI } from '../../services/api';

interface BookingData {
    id: string;
    bookingCode: string;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    adults: number;
    children: number;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    paidAmount: number;
    room?: { name: string; number: string };
    paymentSlips?: Array<{
        id: string;
        imageUrl: string;
        amount?: number;
        status: string;
        createdAt: string;
    }>;
}

export const BookingStatus = () => {
    const [bookingCode, setBookingCode] = useState('');
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingCode.trim()) return;

        setLoading(true);
        setError('');
        setBooking(null);

        try {
            const data = await paymentAPI.getBookingStatus(bookingCode.toUpperCase());
            if (data.message) {
                setError(data.message);
            } else {
                setBooking(data);
            }
        } catch (err: any) {
            setError(err.message || 'ไม่พบการจองนี้');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSlip = async () => {
        if (!slipFile || !booking) return;

        setUploading(true);
        try {
            await paymentAPI.uploadSlip(booking.bookingCode, slipFile);
            setUploadSuccess(true);
            setSlipFile(null);
            // Refresh booking data
            const data = await paymentAPI.getBookingStatus(booking.bookingCode);
            setBooking(data);
        } catch (err: any) {
            alert(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setUploading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: any }> = {
            pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
            confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
            'checked-in': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            'checked-out': { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            verified: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle }
        };
        const style = styles[status] || styles.pending;
        const Icon = style.icon;
        const labels: Record<string, string> = {
            pending: 'รอดำเนินการ', confirmed: 'ยืนยันแล้ว', 'checked-in': 'เช็คอินแล้ว',
            'checked-out': 'เช็คเอาท์แล้ว', cancelled: 'ยกเลิก', verified: 'ตรวจสอบแล้ว',
            rejected: 'ปฏิเสธ', paid: 'ชำระแล้ว'
        };
        return (
            <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit`}>
                <Icon className="w-4 h-4" />
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1F2933]">ตรวจสอบสถานะการจอง</h1>
                    <p className="text-[#6B7280] mt-2">กรอกรหัสการจองเพื่อดูสถานะและแนบสลิปโอนเงิน</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC] mb-6">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                            <input
                                type="text"
                                value={bookingCode}
                                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                                placeholder="รหัสการจอง เช่น BK123456"
                                className="w-full pl-12 pr-4 py-4 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6] text-lg font-medium tracking-wider"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 bg-[#2F5D50] hover:bg-[#4A7C6D] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    ค้นหา
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center mb-6">
                        {error}
                    </div>
                )}

                {/* Booking Details */}
                {booking && (
                    <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                        {/* Main Info Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-[#6B7280]">รหัสการจอง</p>
                                    <p className="text-2xl font-bold text-[#C2A97E]">{booking.bookingCode}</p>
                                </div>
                                {getStatusBadge(booking.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
                                        <Building className="w-5 h-5 text-[#2F5D50]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B7280]">ห้องพัก</p>
                                        <p className="font-medium text-[#1F2933]">{booking.room?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-[#2F5D50]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B7280]">วันเข้าพัก</p>
                                        <p className="font-medium text-[#1F2933]">
                                            {new Date(booking.checkInDate).toLocaleDateString('th-TH')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-[#2F5D50]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B7280]">ชื่อผู้จอง</p>
                                        <p className="font-medium text-[#1F2933]">{booking.guestName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-[#2F5D50]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B7280]">ยอดรวม</p>
                                        <p className="font-bold text-[#2F5D50]">฿{booking.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-[#FAF9F6] rounded-xl p-4 border border-[#E5E2DC]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#6B7280]">สถานะการชำระเงิน</span>
                                    {getStatusBadge(booking.paymentStatus)}
                                </div>
                            </div>
                        </div>

                        {/* Upload Slip Section */}
                        {booking.paymentStatus !== 'paid' && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC]">
                                <h3 className="font-bold text-[#1F2933] mb-4 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-[#2F5D50]" />
                                    แนบสลิปโอนเงิน
                                </h3>

                                {uploadSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        อัปโหลดสลิปสำเร็จ! รอการตรวจสอบจากทางรีสอร์ท
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-[#E5E2DC] rounded-xl p-8 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="slip-upload"
                                    />
                                    <label htmlFor="slip-upload" className="cursor-pointer">
                                        {slipFile ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <FileImage className="w-8 h-8 text-[#2F5D50]" />
                                                <span className="font-medium text-[#1F2933]">{slipFile.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
                                                <p className="text-[#6B7280]">คลิกเพื่อเลือกรูปสลิป</p>
                                                <p className="text-sm text-[#9CA3AF]">รองรับ JPG, PNG, WEBP (ไม่เกิน 5MB)</p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {slipFile && (
                                    <button
                                        onClick={handleUploadSlip}
                                        disabled={uploading}
                                        className="w-full mt-4 bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
                                                อัปโหลดสลิป
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Previous Slips */}
                        {booking.paymentSlips && booking.paymentSlips.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC]">
                                <h3 className="font-bold text-[#1F2933] mb-4">สลิปที่แนบแล้ว</h3>
                                <div className="space-y-3">
                                    {booking.paymentSlips.map((slip, i) => (
                                        <div key={slip.id} className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E2DC]">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`${API_BASE}${slip.imageUrl}`}
                                                    alt={`Slip ${i + 1}`}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2933]">
                                                        {new Date(slip.createdAt).toLocaleDateString('th-TH')}
                                                    </p>
                                                    {slip.amount && (
                                                        <p className="text-xs text-[#6B7280]">฿{slip.amount.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {getStatusBadge(slip.status)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bank Info */}
                        <div className="bg-gradient-to-r from-[#2F5D50] to-[#4A7C6D] rounded-2xl p-6 text-white">
                            <h3 className="font-bold mb-4">ข้อมูลบัญชีสำหรับโอนเงิน</h3>
                            <div className="space-y-2 text-white/90">
                                <p>ธนาคารกสิกรไทย</p>
                                <p className="text-2xl font-bold tracking-wider">123-4-56789-0</p>
                                <p>ชื่อบัญชี: บริษัท ยาดา โฮมสเตย์ จำกัด</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
