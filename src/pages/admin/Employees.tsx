import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search, Pencil, Trash2, Check, X } from 'lucide-react';

export const Employees = () => {
    const { users } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">เจ้าของ</span>;
            case 'staff':
                return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">พนักงาน</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{role}</span>;
        }
    };

    const getStatusBadge = (status: string) => {
        return status === 'active'
            ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">ใช้งาน</span>
            : <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">ปิดใช้งาน</span>;
    };

    const getAvatarColor = (name: string) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">จัดการพนักงาน</h1>
                    <p className="text-gray-500">เพิ่ม แก้ไข และจัดการสิทธิ์พนักงาน</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-green-800">
                    <Plus className="w-4 h-4" />
                    เพิ่มพนักงาน
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">👥</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                            <p className="text-sm text-gray-500">พนักงานทั้งหมด</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.status === 'active').length}</p>
                            <p className="text-sm text-gray-500">กำลังใช้งาน</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">👑</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.role === 'admin').length}</p>
                            <p className="text-sm text-gray-500">ผู้ดูแลระบบ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาด้วยชื่อ, ชื่อผู้ใช้ หรือเบอร์โทร..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">พนักงาน</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ตำแหน่ง</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ติดต่อ</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">สถานะ</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${getAvatarColor(user.name)} rounded-full flex items-center justify-center text-white font-bold`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-500">@{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                <td className="px-6 py-4">
                                    <p className="text-gray-800">{user.phone || '-'}</p>
                                    <p className="text-sm text-gray-500">{user.email || '-'}</p>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
