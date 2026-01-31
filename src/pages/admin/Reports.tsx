import { useState, useEffect } from 'react';
import { Download, TrendingUp, Bed, Wine, Calendar, Loader2 } from 'lucide-react';
import { dashboardAPI, ordersAPI } from '../../services/api';
import { exportRevenueToExcel } from '../../utils/exportUtils';

interface DailyRevenue {
    date: string;
    bookings: number;
    orders: number;
    total: number;
}

interface RevenueData {
    summary: {
        totalBookingsRevenue: number;
        totalOrdersRevenue: number;
        grandTotal: number;
    };
    dailyRevenue: DailyRevenue[];
}

export const Reports = () => {
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [period]);

    const getDateRange = () => {
        const end = new Date();
        const start = new Date();

        switch (period) {
            case 'day':
                start.setHours(0, 0, 0, 0);
                break;
            case 'week':
                start.setDate(start.getDate() - 7);
                break;
            case 'month':
                start.setMonth(start.getMonth() - 1);
                break;
            case 'year':
                start.setFullYear(start.getFullYear() - 1);
                break;
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const { startDate, endDate } = getDateRange();

            const [statsData, revenueRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getRevenueReport(startDate, endDate)
            ]);

            setStats(statsData);
            setRevenueData(revenueRes);

            // Get top selling products from orders
            try {
                const orders = await ordersAPI.getAll();
                const productCounts: Record<string, { name: string; qty: number; revenue: number }> = {};

                orders.forEach((order: any) => {
                    order.items?.forEach((item: any) => {
                        if (!productCounts[item.productId]) {
                            productCounts[item.productId] = {
                                name: item.product?.name || item.name || 'Unknown',
                                qty: 0,
                                revenue: 0
                            };
                        }
                        productCounts[item.productId].qty += item.quantity;
                        productCounts[item.productId].revenue += item.subtotal || (item.price * item.quantity);
                    });
                });

                const sorted = Object.values(productCounts)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((item, idx) => ({ rank: idx + 1, ...item }));

                setTopProducts(sorted);
            } catch (err) {
                console.log('No orders data available');
                setTopProducts([]);
            }
        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => '฿' + (amount || 0).toLocaleString('th-TH');

    // Transform daily revenue for chart display
    const getDailyChartData = () => {
        if (!revenueData?.dailyRevenue) return [];

        const data = revenueData.dailyRevenue.slice(-7); // Last 7 days
        const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

        return data.map(d => ({
            day: days[new Date(d.date).getDay()],
            room: d.bookings,
            bar: d.orders,
            total: d.total
        }));
    };

    const chartData = getDailyChartData();
    const maxTotal = chartData.length > 0 ? Math.max(...chartData.map(d => d.total), 1) : 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">รายงานและสถิติ</h1>
                    <p className="page-subtitle">สรุปผลประกอบการและสถิติต่างๆ</p>
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        if (revenueData) {
                            exportRevenueToExcel(revenueData.dailyRevenue, revenueData.summary, 'yada_revenue_report');
                        }
                    }}
                >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด Excel
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p.key ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stat-card bg-gradient-to-r from-accent to-green-700 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-80">รายได้รวม</p>
                            <p className="text-3xl font-bold mt-1">{formatCurrency(revenueData?.summary.grandTotal || 0)}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 opacity-50" />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="stat-card-label">รายได้ห้องพัก</p>
                            <p className="stat-card-value">{formatCurrency(revenueData?.summary.totalBookingsRevenue || 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Bed className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="stat-card-label">รายได้บาร์</p>
                            <p className="stat-card-value">{formatCurrency(revenueData?.summary.totalOrdersRevenue || 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Wine className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="stat-card-label">จำนวนการจอง</p>
                            <p className="stat-card-value">{stats?.counts?.totalBookings || 0}</p>
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">รายได้รายวัน</h3>
                    {chartData.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-gray-400">
                            ไม่มีข้อมูลในช่วงเวลานี้
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {chartData.map((d, i) => (
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
                                    <span className="w-24 text-right text-sm font-medium">{formatCurrency(d.total)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-gray-500">ห้องพัก</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full" />
                            <span className="text-gray-500">บาร์</span>
                        </div>
                    </div>
                </div>

                {/* Top Sellers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">สินค้าขายดี (บาร์)</h3>
                    {topProducts.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-gray-400">
                            ยังไม่มีข้อมูลการขาย
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topProducts.map(item => (
                                <div key={item.rank} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.rank <= 3 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {item.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-400">ขาย {item.qty} ชิ้น</p>
                                    </div>
                                    <span className="font-bold text-accent">{formatCurrency(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6 text-center">สรุปรายเดือน</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{stats?.counts?.totalBookings || 0}</p>
                        <p className="text-sm text-gray-500">การจองทั้งหมด</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{formatCurrency(revenueData?.summary.totalBookingsRevenue || 0)}</p>
                        <p className="text-sm text-gray-500">รายได้ห้องพัก</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{stats?.counts?.totalBookings ? Math.round((revenueData?.summary.totalBookingsRevenue || 0) / stats.counts.totalBookings) : 0}</p>
                        <p className="text-sm text-gray-500">เฉลี่ย/การจอง</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{stats?.counts?.occupiedRooms || 0}/{stats?.counts?.totalRooms || 0}</p>
                        <p className="text-sm text-gray-500">ห้องที่มีคนพัก</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
