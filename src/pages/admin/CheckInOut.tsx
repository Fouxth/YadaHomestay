import { useState, useEffect } from 'react';
import { LogIn, LogOut, CheckCircle, Clock, User, Calendar, Home, Moon, Phone } from 'lucide-react';
import { checkInOutAPI } from '../../services/api';

const CheckInOut = () => {
    const [data, setData] = useState<{ checkIns: any[]; checkOuts: any[] }>({ checkIns: [], checkOuts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await checkInOutAPI.getDaily();
            setData(res);
        } catch (error) {
            console.error('Error loading daily check-ins/outs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (bookingId: string) => {
        if (!confirm('ยืนยันการ Check-in?')) return;
        try {
            await checkInOutAPI.checkIn(bookingId);
            loadData();
        } catch (error) {
            alert('Error performing check-in');
        }
    };

    const handleCheckOut = async (bookingId: string) => {
        if (!confirm('ยืนยันการ Check-out?')) return;
        try {
            await checkInOutAPI.checkOut(bookingId);
            loadData();
        } catch (error) {
            alert('Error performing check-out');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('th-TH', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const today = new Date().toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-accent" />
                        </div>
                        Check-in / Check-out
                    </h1>
                    <p className="page-subtitle">จัดการรายการเข้าพักและแจ้งออกประจำวัน</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-border">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-text-primary">{today}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Check-in Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                    <LogIn className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">Check-in วันนี้</h2>
                                    <p className="text-sm text-text-secondary">{data.checkIns.length} รายการ</p>
                                </div>
                            </div>
                            <span className="badge badge-success">
                                {data.checkIns.filter((b: any) => b.status === 'checked-in').length} เสร็จสิ้น
                            </span>
                        </div>

                        <div className="space-y-3">
                            {data.checkIns.length === 0 ? (
                                <div className="card p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mx-auto mb-4">
                                        <LogIn className="w-8 h-8 text-text-muted" />
                                    </div>
                                    <p className="text-text-muted">ไม่มีรายการ Check-in วันนี้</p>
                                </div>
                            ) : (
                                data.checkIns.map((booking: any) => (
                                    <div key={booking.id} className="card p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                {/* Room Info */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                                        <Home className="w-5 h-5 text-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-text-primary">
                                                            ห้อง {booking.room?.number} - {booking.room?.name}
                                                        </p>
                                                        <p className="text-xs text-text-muted">{booking.room?.type}</p>
                                                    </div>
                                                </div>

                                                {/* Guest Info */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
                                                        <User className="w-4 h-4 text-text-secondary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text-primary">{booking.guestName}</p>
                                                        {booking.guestPhone && (
                                                            <p className="text-xs text-text-muted flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                {booking.guestPhone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stay Info */}
                                                <div className="flex items-center gap-4 text-sm text-text-secondary">
                                                    <span className="flex items-center gap-1">
                                                        <Moon className="w-4 h-4" />
                                                        {booking.nights} คืน
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                {booking.status === 'checked-in' ? (
                                                    <span className="badge badge-success flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        เข้าพักแล้ว
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCheckIn(booking.id)}
                                                        className="btn-primary bg-success hover:bg-success/90 text-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Check-in
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Check-out Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                                    <LogOut className="w-5 h-5 text-danger" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">Check-out วันนี้</h2>
                                    <p className="text-sm text-text-secondary">{data.checkOuts.length} รายการ</p>
                                </div>
                            </div>
                            <span className="badge badge-secondary">
                                {data.checkOuts.filter((b: any) => b.status === 'checked-out').length} เสร็จสิ้น
                            </span>
                        </div>

                        <div className="space-y-3">
                            {data.checkOuts.length === 0 ? (
                                <div className="card p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mx-auto mb-4">
                                        <LogOut className="w-8 h-8 text-text-muted" />
                                    </div>
                                    <p className="text-text-muted">ไม่มีรายการ Check-out วันนี้</p>
                                </div>
                            ) : (
                                data.checkOuts.map((booking: any) => (
                                    <div key={booking.id} className="card p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                {/* Room Info */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                                        <Home className="w-5 h-5 text-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-text-primary">
                                                            ห้อง {booking.room?.number} - {booking.room?.name}
                                                        </p>
                                                        <p className="text-xs text-text-muted">{booking.room?.type}</p>
                                                    </div>
                                                </div>

                                                {/* Guest Info */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
                                                        <User className="w-4 h-4 text-text-secondary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text-primary">{booking.guestName}</p>
                                                        {booking.guestPhone && (
                                                            <p className="text-xs text-text-muted flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                {booking.guestPhone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stay Info */}
                                                <div className="flex items-center gap-4 text-sm text-text-secondary">
                                                    <span className="flex items-center gap-1">
                                                        <Moon className="w-4 h-4" />
                                                        {booking.nights} คืน
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Check-out: {formatDate(booking.checkOutDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                {booking.status === 'checked-out' ? (
                                                    <span className="badge badge-secondary flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        ออกแล้ว
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCheckOut(booking.id)}
                                                        className="btn-primary bg-danger hover:bg-danger/90 text-sm"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Check-out
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckInOut;
