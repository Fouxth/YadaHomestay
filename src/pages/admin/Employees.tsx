import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search, MoreHorizontal, Shield, User as UserIcon, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '../../types';

export const Employees = () => {
    const { users } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const getRoleText = (role: string) => {
        return role === 'admin' ? 'เจ้าของ' : 'พนักงาน';
    };

    const getRoleBadge = (role: string) => {
        return role === 'admin'
            ? 'bg-primary/10 text-primary'
            : 'bg-accent/10 text-accent';
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">จัดการพนักงาน</h1>
                    <p className="page-subtitle">ดูและจัดการข้อมูลพนักงานทั้งหมด</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มพนักงาน
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-xs text-text-muted">พนักงานทั้งหมด</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                    <p className="text-xs text-text-muted">เจ้าของ</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold">{users.filter(u => u.role === 'staff').length}</p>
                    <p className="text-xs text-text-muted">พนักงาน</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
                    <p className="text-xs text-text-muted">ใช้งานได้</p>
                </div>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="input-group">
                    <Search className="input-group-icon" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, ชื่อผู้ใช้, เบอร์โทร..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>พนักงาน</th>
                                <th>ตำแหน่ง</th>
                                <th>เบอร์โทร</th>
                                <th>สถานะ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-text-muted">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getRoleBadge(user.role)}`}>
                                                {getRoleText(user.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Phone className="w-4 h-4 text-text-muted" />
                                                {user.phone || '-'}
                                            </div>
                                        </td>
                                        <td>
                                            {user.isActive ? (
                                                <span className="badge badge-success">ใช้งานได้</span>
                                            ) : (
                                                <span className="badge badge-secondary">ปิดใช้งาน</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-text-muted" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <UserIcon className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-30" />
                                        <p className="text-text-muted">ไม่พบพนักงาน</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-semibold">ข้อมูลพนักงาน</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{selectedUser.name}</h4>
                                    <p className="text-text-muted">@{selectedUser.username}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">ตำแหน่ง</p>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        <span className="font-medium">{getRoleText(selectedUser.role)}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-surface-hover rounded-lg">
                                    <p className="text-xs text-text-muted mb-1">สถานะ</p>
                                    <div className="flex items-center gap-2">
                                        {selectedUser.isActive ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-success" />
                                                <span className="font-medium text-success">ใช้งานได้</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 text-danger" />
                                                <span className="font-medium text-danger">ปิดใช้งาน</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg">
                                    <Phone className="w-5 h-5 text-text-muted" />
                                    <div>
                                        <p className="text-xs text-text-muted">เบอร์โทร</p>
                                        <p className="font-medium">{selectedUser.phone || '-'}</p>
                                    </div>
                                </div>
                                {selectedUser.email && (
                                    <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg">
                                        <Mail className="w-5 h-5 text-text-muted" />
                                        <div>
                                            <p className="text-xs text-text-muted">อีเมล</p>
                                            <p className="font-medium">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-border">
                                <button className="btn-primary flex-1">
                                    แก้ไขข้อมูล
                                </button>
                                <button className="btn-secondary flex-1">
                                    รีเซ็ตรหัสผ่าน
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
