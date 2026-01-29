
import { useData } from '../../context/DataContext';
import { Bed, TrendingUp, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const { rooms, bookings, orders } = useData();
    const navigate = useNavigate();

    const today = new Date().toDateString();
    const todayCheckIns = bookings.filter(b => new Date(b.checkInDate).toDateString() === today && (b.status === 'confirmed' || b.status === 'checked_in'));
    const todayCheckOuts = bookings.filter(b => new Date(b.checkOutDate).toDateString() === today && (b.status === 'checked_in' || b.status === 'checked_out'));

    const todayRevenue = todayCheckIns.reduce((sum, b) => sum + b.paidAmount, 0);
    const todayBarRevenue = orders.filter(o => new Date(o.createdAt).toDateString() === today).reduce((sum, o) => sum + o.total, 0);

    const formatCurrency = (amount: number) => '฿' + amount.toLocaleString('th-TH');

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = { available: 'ว่าง', occupied: 'มีผู้เข้าพัก', cleaning: 'ทำความสะอาด', maintenance: 'ซ่อมบำรุง', reserved: 'จองแล้ว' };
        return texts[status] || status;
    };
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = { available: 'bg-green-500', occupied: 'bg-blue-500', cleaning: 'bg-yellow-500', maintenance: 'bg-red-500', reserved: 'bg-purple-500' };
        return colors[status] || 'bg-gray-500';
    };

    const statusCounts = {
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
                    <p className="text-gray-500">สรุปภาพรวมการทำงานวันนี้</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium flex items-center gap-2">
                        <LogIn className="w-4 h-4" /> รับจอง Walk-in ด่วน
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">ห้องว่าง</p>
                            <p className="text-3xl font-bold text-gray-800">{statusCounts.available}<span className="text-lg font-normal text-gray-400">ห้อง</span></p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Bed className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">ห้อง occupied</p>
                            <p className="text-3xl font-bold text-gray-800">{statusCounts.occupied}<span className="text-lg font-normal text-gray-400">ห้อง</span></p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Bed className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Check-in วันนี้</p>
                            <p className="text-3xl font-bold text-gray-800">{todayCheckIns.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Check-out วันนี้</p>
                            <p className="text-3xl font-bold text-gray-800">{todayCheckOuts.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <LogOut className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary to-green-700 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">รายได้วันนี้ (รวม)</p>
                            <p className="text-3xl font-bold mt-1">{formatCurrency(todayRevenue + todayBarRevenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">รายได้ห้องพัก</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(todayRevenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Bed className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">รายได้บาร์/มินิบาร์</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(todayBarRevenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🍷</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Room Status Grid */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">สถานะห้องพัก</h3>
                        <button onClick={() => navigate('/admin/rooms')} className="text-primary text-sm hover:underline">ดูทั้งหมด →</button>
                    </div>
                    <div className="flex gap-4 mb-4 text-sm">
                        {['available', 'occupied', 'cleaning', 'maintenance', 'reserved'].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(s)}`}></div>
                                <span className="text-gray-500">{rooms.filter(r => r.status === s).length} {getStatusText(s)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {rooms.slice(0, 8).map(room => (
                            <div key={room.id} className="p-3 rounded-xl border hover:shadow-md transition-shadow cursor-pointer text-center" onClick={() => navigate('/admin/rooms')}>
                                <div className={`w-4 h-4 rounded-full ${getStatusColor(room.status)} mx-auto mb-2`}></div>
                                <p className="font-bold">{room.number}</p>
                                <p className="text-xs text-gray-400">{room.type === 'standard' ? 'มาตรฐาน' : room.type === 'deluxe' ? 'ดีลักซ์' : 'แฟมิลี่'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activities */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">กิจกรรมวันนี้</h3>
                        <button onClick={() => navigate('/admin/pos')} className="text-primary text-sm hover:underline">ไปที่ POS →</button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <LogIn className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm">Check-in วันนี้ ({todayCheckIns.length})</p>
                                {todayCheckIns.length === 0 && <p className="text-xs text-gray-400">ไม่มี Check-in วันนี้</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <LogOut className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm">Check-out วันนี้ ({todayCheckOuts.length})</p>
                                {todayCheckOuts.length === 0 && <p className="text-xs text-gray-400">ไม่มี Check-out วันนี้</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">การจองรอดำเนินการ</h3>
                    </div>
                    <div className="text-center py-8 text-gray-400">
                        <Bed className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>ไม่มีการจองรอดำเนินการ</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">ออเดอร์บาร์วันนี้</h3>
                        <button onClick={() => navigate('/admin/bar')} className="text-primary text-sm hover:underline">ไปที่บาร์ →</button>
                    </div>
                    <div className="text-center py-8 text-gray-400">
                        <span className="text-4xl opacity-30">🍷</span>
                        <p className="mt-2">ไม่มีออเดอร์วันนี้</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
