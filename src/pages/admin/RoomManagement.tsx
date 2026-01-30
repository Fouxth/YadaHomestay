import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, X, Search, Grid3X3, List, MoreHorizontal, Sparkles, Wrench, Bed, CheckCircle } from 'lucide-react';
import type { Room } from '../../types';

export const RoomManagement = () => {
    const { rooms, updateRoomStatus, refreshRooms } = useData();
    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            available: 'ว่าง',
            occupied: 'มีผู้เข้าพัก',
            cleaning: 'ทำความสะอาด',
            maintenance: 'ซ่อมบำรุง',
            reserved: 'จองแล้ว'
        };
        return texts[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: 'bg-success',
            occupied: 'bg-occupied',
            cleaning: 'bg-cleaning',
            maintenance: 'bg-maintenance',
            reserved: 'bg-reserved'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            available: 'badge-success',
            occupied: 'badge-info',
            cleaning: 'badge-warning',
            maintenance: 'badge-danger',
            reserved: 'badge-secondary'
        };
        return styles[status] || 'badge-secondary';
    };

    const getTypeText = (type: string) => {
        const texts: Record<string, string> = {
            standard: 'มาตรฐาน',
            deluxe: 'ดีลักซ์',
            family: 'แฟมิลี่'
        };
        return texts[type] || type;
    };

    const filteredRooms = rooms.filter(r => {
        const matchFilter = filter === 'all' || r.status === filter;
        const matchSearch = r.number.includes(searchTerm) || r.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchFilter && matchSearch;
    });

    const statusCounts = {
        all: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        cleaning: rooms.filter(r => r.status === 'cleaning').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
        reserved: rooms.filter(r => r.status === 'reserved').length,
    };

    const handleStatusUpdate = async (roomId: string, newStatus: Room['status']) => {
        try {
            await updateRoomStatus(roomId, newStatus);
            setSelectedRoom(null);
            await refreshRooms();
        } catch (error) {
            console.error('Failed to update room status:', error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">จัดการห้องพัก</h1>
                    <p className="page-subtitle">ดูและจัดการสถานะห้องพักทุกห้อง</p>
                </div>
                <button className="btn-primary">
                    <Plus className="w-4 h-4" />
                    เพิ่มห้องพัก
                </button>
            </div>

            {/* Status Filter */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { key: 'all', label: 'ทั้งหมด', color: 'bg-gray-500' },
                    { key: 'available', label: 'ว่าง', color: 'bg-success' },
                    { key: 'occupied', label: 'มีผู้เข้าพัก', color: 'bg-occupied' },
                    { key: 'cleaning', label: 'ทำความสะอาด', color: 'bg-cleaning' },
                    { key: 'maintenance', label: 'ซ่อมบำรุง', color: 'bg-maintenance' },
                    { key: 'reserved', label: 'จองแล้ว', color: 'bg-reserved' },
                ].map(s => (
                    <div
                        key={s.key}
                        onClick={() => setFilter(s.key)}
                        className={`card p-4 cursor-pointer transition-all ${filter === s.key ? 'ring-2 ring-accent border-accent' : ''
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                            <div>
                                <p className="text-xl font-bold">{statusCounts[s.key as keyof typeof statusCounts]}</p>
                                <p className="text-xs text-text-muted">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & View Toggle */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="input-group flex-1">
                        <Search className="input-group-icon" />
                        <input
                            type="text"
                            placeholder="ค้นหาหมายเลขห้องหรือชื่อห้อง..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-surface-hover'}`}
                        >
                            <Grid3X3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-surface-hover'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Rooms Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredRooms.map(room => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className="card p-4 cursor-pointer hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`}></div>
                                <span className="text-xs text-text-muted">{getTypeText(room.type)}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-1">{room.number}</h3>
                            <p className="text-sm text-text-muted truncate">{room.name}</p>
                            <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted">{room.capacity} ท่าน</span>
                                    <span className="text-sm font-medium">฿{room.pricePerNight.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ห้อง</th>
                                    <th>ประเภท</th>
                                    <th>ชั้น</th>
                                    <th>ราคา/คืน</th>
                                    <th>สถานะ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms.map(room => (
                                    <tr key={room.id} className="cursor-pointer" onClick={() => setSelectedRoom(room)}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${getStatusColor(room.status)}`}></div>
                                                <div>
                                                    <p className="font-medium">{room.number}</p>
                                                    <p className="text-xs text-text-muted">{room.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{getTypeText(room.type)}</td>
                                        <td>ชั้น {room.floor}</td>
                                        <td>฿{room.pricePerNight.toLocaleString()}</td>
                                        <td>
                                            <span className={getStatusBadge(room.status)}>
                                                {getStatusText(room.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-text-muted" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Room Detail Modal */}
            {selectedRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedRoom.status)}`}></div>
                                <div>
                                    <h3 className="text-lg font-semibold">ห้อง {selectedRoom.number}</h3>
                                    <p className="text-sm text-text-muted">{selectedRoom.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">ประเภท</p>
                                    <p className="font-medium">{getTypeText(selectedRoom.type)}</p>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">ความจุ</p>
                                    <p className="font-medium">{selectedRoom.capacity} ท่าน</p>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">ชั้น</p>
                                    <p className="font-medium">ชั้น {selectedRoom.floor}</p>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">ราคา/คืน</p>
                                    <p className="font-medium">฿{selectedRoom.pricePerNight.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="pt-4 border-t border-border">
                                <p className="text-sm font-medium mb-3">เปลี่ยนสถานะ</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedRoom.status !== 'available' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'available')}
                                            className="btn-secondary text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            ว่าง
                                        </button>
                                    )}
                                    {selectedRoom.status !== 'cleaning' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'cleaning')}
                                            className="btn-secondary text-sm"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            ทำความสะอาด
                                        </button>
                                    )}
                                    {selectedRoom.status !== 'maintenance' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'maintenance')}
                                            className="btn-secondary text-sm"
                                        >
                                            <Wrench className="w-4 h-4" />
                                            ซ่อมบำรุง
                                        </button>
                                    )}
                                    {selectedRoom.status !== 'occupied' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'occupied')}
                                            className="btn-secondary text-sm"
                                        >
                                            <Bed className="w-4 h-4" />
                                            มีผู้เข้าพัก
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
