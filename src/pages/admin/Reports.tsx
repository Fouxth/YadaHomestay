import { useState } from 'react';
import { Download, TrendingUp, Bed, Wine, Calendar } from 'lucide-react';

export const Reports = () => {
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');

    // Mock data for demonstration
    const dailyData = [
        { day: 'จ.', room: 8500, bar: 1200, total: 9700 },
        { day: 'อ.', room: 6200, bar: 800, total: 7000 },
        { day: 'พ.', room: 9800, bar: 1500, total: 11300 },
        { day: 'พฤ.', room: 7500, bar: 900, total: 8400 },
        { day: 'ศ.', room: 11200, bar: 2100, total: 13300 },
        { day: 'ส.', room: 14500, bar: 3500, total: 18000 },
        { day: 'อา.', room: 13000, bar: 2800, total: 15800 },
    ];

    const topSellers = [
        { rank: 1, name: 'เบียร์สิงห์', qty: 45, revenue: 3150 },
        { rank: 2, name: 'โค้ก', qty: 38, revenue: 950 },
        { rank: 3, name: 'น้ำส้ม', qty: 32, revenue: 640 },
        { rank: 4, name: 'กาแฟ', qty: 28, revenue: 1120 },
        { rank: 5, name: 'ช็อกโกแลต', qty: 22, revenue: 770 },
    ];

    const maxTotal = Math.max(...dailyData.map(d => d.total));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">รายงานและสถิติ</h1>
                    <p className="text-gray-500">สรุปผลประกอบการและสถิติต่างๆ</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    ดาวน์โหลดรายงาน
                </button>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-2">
                {[
                    { key: 'day', label: 'วันนี้' },
                    { key: 'week', label: 'สัปดาห์นี้' },
                    { key: 'month', label: 'เดือนนี้' },
                    { key: 'year', label: 'ปีนี้' },
                ].map(p => (
                    <button
                        key={p.key}
                        onClick={() => setPeriod(p.key as typeof period)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p.key ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary to-green-700 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">รายได้รวมวันนี้</p>
                            <p className="text-3xl font-bold mt-1">฿0</p>
                        </div>
                        <TrendingUp className="w-10 h-10 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">รายได้ห้องพัก</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">฿0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Bed className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">รายได้บาร์</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">฿0</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Wine className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">จำนวนการจอง</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">รายได้รายวัน (สัปดาห์นี้)</h3>
                    <div className="space-y-4">
                        {dailyData.map((d, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="w-8 text-sm text-gray-500">{d.day}</span>
                                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${(d.room / maxTotal) * 100}%` }}
                                    />
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{ width: `${(d.bar / maxTotal) * 100}%` }}
                                    />
                                </div>
                                <span className="w-20 text-right text-sm font-medium">฿{d.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-gray-500">ห้อง</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full" />
                            <span className="text-gray-500">บาร์</span>
                        </div>
                    </div>
                </div>

                {/* Top Sellers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">สินค้าขายดี (บาร์)</h3>
                    <div className="space-y-4">
                        {topSellers.map(item => (
                            <div key={item.rank} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.rank <= 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.rank}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-400">ขาย {item.qty} ชิ้น</p>
                                </div>
                                <span className="font-bold text-primary">฿{item.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 text-center">สรุปรายเดือน</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-3xl font-bold text-gray-800">0</p>
                        <p className="text-sm text-gray-500">การจองทั้งหมด</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">฿0</p>
                        <p className="text-sm text-gray-500">รายได้ห้องพัก</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">0</p>
                        <p className="text-sm text-gray-500">ดินเฉลี่ย/การจอง</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">4.8</p>
                        <p className="text-sm text-gray-500">คะแนนความพึงพอใจ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
