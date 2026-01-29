import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, X, User, Search } from 'lucide-react';
import type { Room } from '../../types';

export const RoomManagement = () => {
    const { rooms, updateRoomStatus, refreshData } = useData();
    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = { available: 'ว่าง', occupied: 'มีผู้เข้าพัก', cleaning: 'ทำความสะอาด', maintenance: 'ซ่อมบำรุง', reserved: 'จองแล้ว' };
        return texts[status] || status;
    };
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = { available: 'bg-green-500', occupied: 'bg-blue-500', cleaning: 'bg-yellow-500', maintenance: 'bg-red-500', reserved: 'bg-purple-500' };
        return colors[status] || 'bg-gray-500';
    };
    const getTypeText = (type: string) => {
        const texts: Record<string, string> = { standard: 'มาตรฐาน', deluxe: 'ดีลักซ์', family: 'แฟมิลี่' };
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

    const handleAddRoom = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newRoom: Room = {
            id: Date.now().toString(),
            number: (form.elements.namedItem('number') as HTMLInputElement).value,
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            type: (form.elements.namedItem('type') as HTMLSelectElement).value as Room['type'],
            status: 'available',
            pricePerNight: parseInt((form.elements.namedItem('price') as HTMLInputElement).value),
            capacity: parseInt((form.elements.namedItem('capacity') as HTMLInputElement).value),
            amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'],
            floor: 1,
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'
        };
        const updatedRooms = [...rooms, newRoom];
        localStorage.setItem('yada_rooms', JSON.stringify(updatedRooms));
        refreshData();
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">จัดการห้องพัก</h1>
                    <p className="text-gray-500">ดูและจัดการสถานะห้องพักทุกห้อง</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 self-start">
                    <Plus className="w-5 h-5" /> เพิ่มห้องพัก
                </button>
            </div>

            {/* Status Filter Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { key: 'all', label: 'ทั้งหมด', color: 'bg-gray-500' },
                    { key: 'available', label: 'ว่าง', color: 'bg-green-500' },
                    { key: 'occupied', label: 'มีผู้เข้าพัก', color: 'bg-blue-500' },
                    { key: 'cleaning', label: 'ทำความสะอาด', color: 'bg-yellow-500' },
                    { key: 'maintenance', label: 'ซ่อมบำรุง', color: 'bg-red-500' },
                    { key: 'reserved', label: 'จองแล้ว', color: 'bg-purple-500' },
                ].map(s => (
                    <div
                        key={s.key}
                        onClick={() => setFilter(s.key)}
                        className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all border-2 ${filter === s.key ? 'border-primary' : 'border-transparent'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                            <div>
                                <p className="text-2xl font-bold">{statusCounts[s.key as keyof typeof statusCounts]}</p>
                                <p className="text-xs text-gray-500">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & View Toggle */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาห้องพักด้วยหมายเลขห้อง..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-lg text-sm ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        มุมมองการ์ด
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg text-sm ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        มุมมองตาราง
                    </button>
                </div>
            </div>

            {/* Rooms Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredRooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className="p-4 rounded-xl border hover:shadow-lg transition-all cursor-pointer hover:border-primary text-center"
                            >
                                <div className={`w-4 h-4 rounded-full ${getStatusColor(room.status)} mx-auto mb-3`}></div>
                                <p className="text-xs text-gray-400 mb-1">{getTypeText(room.type)}</p>
                                <p className="text-xl font-bold text-gray-800">{room.number}</p>
                                <p className="text-xs text-gray-500 truncate">{room.name}</p>
                                <div className="mt-3 pt-3 border-t">
                                    <p className="text-lg font-bold text-primary">฿{room.pricePerNight.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">ต่อคืน</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ห้อง</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ประเภท</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">สถานะ</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ราคา</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredRooms.map(room => (
                                <tr key={room.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{room.number}</td>
                                    <td className="px-4 py-3 text-gray-500">{getTypeText(room.type)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(room.status)}`}>
                                            {getStatusText(room.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-primary">฿{room.pricePerNight.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setSelectedRoom(room)} className="text-primary hover:underline text-sm">จัดการ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Room Detail Modal */}
            {selectedRoom && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">ห้อง {selectedRoom.number}</h3>
                            <button onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">สถานะ</span>
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(selectedRoom.status)}`}>{getStatusText(selectedRoom.status)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ประเภท</span>
                                <span>{getTypeText(selectedRoom.type)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ราคา</span>
                                <span className="font-bold text-primary">฿{selectedRoom.pricePerNight.toLocaleString()} / คืน</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ความจุ</span>
                                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedRoom.capacity} คน</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-3">เปลี่ยนสถานะห้อง</p>
                            <div className="grid grid-cols-3 gap-2">
                                {['available', 'occupied', 'cleaning', 'maintenance', 'reserved'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { updateRoomStatus(selectedRoom.id, s as Room['status']); setSelectedRoom({ ...selectedRoom, status: s as Room['status'] }); }}
                                        className={`px-2 py-2 rounded-lg text-xs border hover:bg-gray-50 ${selectedRoom.status === s ? 'bg-primary text-white border-primary' : ''}`}
                                    >
                                        {getStatusText(s)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">เพิ่มห้องพักใหม่</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">หมายเลขห้อง *</label>
                                <input name="number" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อห้อง *</label>
                                <input name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท *</label>
                                <select name="type" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                                    <option value="standard">มาตรฐาน</option>
                                    <option value="deluxe">ดีลักซ์</option>
                                    <option value="family">แฟมิลี่</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ราคาต่อคืน *</label>
                                    <input name="price" type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ความจุ (คน) *</label>
                                    <input name="capacity" type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-green-800 text-white font-semibold py-3 rounded-xl">
                                เพิ่มห้องพัก
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
