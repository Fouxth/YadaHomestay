import { useState, useEffect } from 'react';
import { Plus, X, Search, Grid3X3, List, MoreHorizontal, Sparkles, Wrench, Bed, CheckCircle, Edit } from 'lucide-react';
import { roomsAPI } from '../../services/api';
import type { Room } from '../../types';

export const RoomManagement = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        number: '',
        name: '',
        type: 'standard',
        capacity: 2,
        pricePerNight: 1000,
        floor: 1,
        description: '',
        amenities: [] as string[]
    });

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await roomsAPI.getAll();
            setRooms(data);
        } catch (error) {
            console.error('Error loading rooms:', error);
        }
    };

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
            setLoading(true);
            await roomsAPI.update(roomId, { status: newStatus });
            setSelectedRoom(null);
            await loadRooms();
        } catch (error) {
            console.error('Failed to update room status:', error);
            alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await roomsAPI.create(formData);
            setShowAddModal(false);
            setFormData({
                number: '',
                name: '',
                type: 'standard',
                capacity: 2,
                pricePerNight: 1000,
                floor: 1,
                description: '',
                amenities: []
            });
            await loadRooms();
        } catch (error) {
            console.error('Failed to create room:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มห้อง');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom) return;
        try {
            setLoading(true);
            await roomsAPI.update(selectedRoom.id, formData);
            setShowEditModal(false);
            setSelectedRoom(null);
            await loadRooms();
        } catch (error) {
            console.error('Failed to update room:', error);
            alert('เกิดข้อผิดพลาดในการแก้ไขห้อง');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (room: Room) => {
        setFormData({
            number: room.number,
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            pricePerNight: room.pricePerNight,
            floor: room.floor,
            description: room.description || '',
            amenities: room.amenities || []
        });
        setSelectedRoom(room);
        setShowEditModal(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">จัดการห้องพัก</h1>
                    <p className="page-subtitle">ดูและจัดการสถานะห้องพักทุกห้อง</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({
                            number: '',
                            name: '',
                            type: 'standard',
                            capacity: 2,
                            pricePerNight: 1000,
                            floor: 1,
                            description: '',
                            amenities: []
                        });
                        setShowAddModal(true);
                    }}
                    className="btn-primary"
                >
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
            {selectedRoom && !showEditModal && (
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
                                            disabled={loading}
                                            className="btn-primary bg-success hover:bg-success/90 text-sm disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            ว่าง
                                        </button>
                                    )}
                                    {selectedRoom.status !== 'cleaning' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'cleaning')}
                                            disabled={loading}
                                            className="btn-primary bg-warning hover:bg-warning/90 text-sm disabled:opacity-50"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            ทำความสะอาด
                                        </button>
                                    )}
                                    {selectedRoom.status !== 'maintenance' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'maintenance')}
                                            disabled={loading}
                                            className="btn-primary bg-danger hover:bg-danger/90 text-sm disabled:opacity-50"
                                        >
                                            <Wrench className="w-4 h-4" />
                                            ซ่อมบำรุง
                                        </button>
                                    )}
                                    {selectedRoom.status !== 'occupied' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedRoom.id, 'occupied')}
                                            disabled={loading}
                                            className="btn-primary bg-occupied hover:bg-occupied/90 text-sm disabled:opacity-50"
                                        >
                                            <Bed className="w-4 h-4" />
                                            มีผู้เข้าพัก
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => openEditModal(selectedRoom)}
                                className="btn-secondary w-full"
                            >
                                <Edit className="w-4 h-4" />
                                แก้ไขห้องพัก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-semibold">เพิ่มห้องพักใหม่</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddRoom} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">หมายเลขห้อง *</label>
                                    <input
                                        required
                                        className="input"
                                        placeholder="เช่น 101"
                                        value={formData.number}
                                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ชื่อห้อง *</label>
                                    <input
                                        required
                                        className="input"
                                        placeholder="เช่น ห้องมาตรฐาน 101"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ประเภท</label>
                                    <select
                                        className="input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="standard">มาตรฐาน</option>
                                        <option value="deluxe">ดีลักซ์</option>
                                        <option value="family">แฟมิลี่</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ความจุ (ท่าน)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ราคา/คืน (บาท)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="0"
                                        value={formData.pricePerNight}
                                        onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ชั้น</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="1"
                                        value={formData.floor}
                                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">รายละเอียด</label>
                                <textarea
                                    className="input min-h-[80px] resize-none"
                                    placeholder="รายละเอียดเพิ่มเติม..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-secondary"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'เพิ่มห้อง'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Room Modal */}
            {showEditModal && selectedRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-semibold">แก้ไขห้อง {selectedRoom.number}</h3>
                            <button
                                onClick={() => { setShowEditModal(false); setSelectedRoom(null); }}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditRoom} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">หมายเลขห้อง *</label>
                                    <input
                                        required
                                        className="input"
                                        value={formData.number}
                                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ชื่อห้อง *</label>
                                    <input
                                        required
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ประเภท</label>
                                    <select
                                        className="input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="standard">มาตรฐาน</option>
                                        <option value="deluxe">ดีลักซ์</option>
                                        <option value="family">แฟมิลี่</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ความจุ (ท่าน)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ราคา/คืน (บาท)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="0"
                                        value={formData.pricePerNight}
                                        onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ชั้น</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="1"
                                        value={formData.floor}
                                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">รายละเอียด</label>
                                <textarea
                                    className="input min-h-[80px] resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setSelectedRoom(null); }}
                                    className="btn-secondary"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
