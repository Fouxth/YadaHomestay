import { useEffect, useState } from 'react';
import { Bed, TrendingUp, LogIn, LogOut, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { dashboardAPI } from '../../services/api';

interface DashboardStats {
  counts: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    totalBookings: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    pendingBookings: number;
  };
  revenue: number;
  recentBookings: any[];
  lowStockProducts: any[];
}

export const Dashboard = () => {
  const { rooms } = useData();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => '฿' + (amount || 0).toLocaleString('th-TH');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">แดชบอร์ด</h1>
          <p className="page-subtitle">ภาพรวมการทำงานวันนี้</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            {new Date().toLocaleDateString('th-TH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-card-label">ห้องว่าง</p>
              <p className="stat-card-value">{stats?.counts.availableRooms || 0}</p>
            </div>
            <div className="stat-card-icon bg-success/10">
              <Bed className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className="text-text-muted">จากทั้งหมด {stats?.counts.totalRooms || 0} ห้อง</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-card-label">Check-in วันนี้</p>
              <p className="stat-card-value">{stats?.counts.todayCheckIns || 0}</p>
            </div>
            <div className="stat-card-icon bg-accent/10">
              <LogIn className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <ArrowUpRight className="w-3 h-3 text-success" />
            <span className="text-success">พร้อมรับ</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-card-label">Check-out วันนี้</p>
              <p className="stat-card-value">{stats?.counts.todayCheckOuts || 0}</p>
            </div>
            <div className="stat-card-icon bg-warning/10">
              <LogOut className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <ArrowDownRight className="w-3 h-3 text-warning" />
            <span className="text-warning">ต้องทำความสะอาด</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-card-label">รายได้รวม</p>
              <p className="stat-card-value">{formatCurrency(stats?.revenue || 0)}</p>
            </div>
            <div className="stat-card-icon bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className="text-text-muted">ยอดชำระแล้ว</span>
          </div>
        </div>
      </div>

      {/* Room Status Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Status */}
        <div className="card lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold text-text-primary">สถานะห้องพัก</h3>
            <button className="btn-ghost text-xs">ดูทั้งหมด</button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[
                { key: 'available', label: 'ว่าง', color: 'bg-available' },
                { key: 'occupied', label: 'มีผู้เข้าพัก', color: 'bg-occupied' },
                { key: 'cleaning', label: 'ทำความสะอาด', color: 'bg-cleaning' },
                { key: 'maintenance', label: 'ซ่อมบำรุง', color: 'bg-maintenance' },
                { key: 'reserved', label: 'จองแล้ว', color: 'bg-reserved' },
              ].map(s => (
                <div key={s.key} className="text-center">
                  <div className={`w-3 h-3 rounded-full ${s.color} mx-auto mb-1`}></div>
                  <p className="text-xs text-text-muted">{s.label}</p>
                  <p className="text-lg font-semibold">{rooms.filter(r => r.status === s.key).length}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {rooms.slice(0, 16).map(room => (
                <div
                  key={room.id}
                  className="aspect-square rounded-lg border border-border flex flex-col items-center justify-center gap-1 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${room.status === 'available' ? 'bg-available' :
                    room.status === 'occupied' ? 'bg-occupied' :
                      room.status === 'cleaning' ? 'bg-cleaning' :
                        room.status === 'maintenance' ? 'bg-maintenance' : 'bg-reserved'
                    }`}></div>
                  <span className="text-xs font-medium">{room.number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-text-primary">กิจกรรมวันนี้</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-xs text-text-muted">{stats?.counts.todayCheckIns || 0} รายการ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Check-out</p>
                <p className="text-xs text-text-muted">{stats?.counts.todayCheckOuts || 0} รายการ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">การจองรอดำเนินการ</p>
                <p className="text-xs text-text-muted">{stats?.counts.pendingBookings || 0} รายการ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">การจองล่าสุด</h3>
          <button className="btn-ghost text-xs">ดูทั้งหมด</button>
        </div>
        <div className="card-body">
          {stats?.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัสจอง</th>
                    <th>ลูกค้า</th>
                    <th>ห้อง</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking.id}>
                      <td className="font-medium">{booking.bookingCode}</td>
                      <td>{booking.guestName}</td>
                      <td>{booking.room?.number || '-'}</td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString('th-TH')}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString('th-TH')}</td>
                      <td>
                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-info' :
                          booking.status === 'checked_in' ? 'badge-success' :
                            booking.status === 'checked_out' ? 'badge-secondary' :
                              booking.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                          }`}>
                          {booking.status === 'confirmed' ? 'ยืนยันแล้ว' :
                            booking.status === 'checked_in' ? 'Check-in' :
                              booking.status === 'checked_out' ? 'Check-out' :
                                booking.status === 'cancelled' ? 'ยกเลิก' : 'รอยืนยัน'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <Bed className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>ไม่มีการจองล่าสุด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
