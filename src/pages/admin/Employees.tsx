import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Shield, User as UserIcon, Phone, Mail, CheckCircle, XCircle, Edit, Trash2, Key } from 'lucide-react';
import { usersAPI } from '../../services/api';

interface Employee {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'staff';
    phone?: string;
    email?: string;
    isActive: boolean;
}

export const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        role: 'staff' as 'admin' | 'staff'
    });

    // Load employees
    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.getAll();
            setEmployees(data);
        } catch (error) {
            console.error('Failed to load employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleText = (role: string) => {
        return role === 'admin' ? 'เจ้าของ' : 'พนักงาน';
    };

    const getRoleBadge = (role: string) => {
        return role === 'admin'
            ? 'bg-primary/10 text-primary'
            : 'bg-accent/10 text-accent';
    };

    const filteredUsers = employees.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    const openAddModal = () => {
        setFormData({
            username: '',
            password: '',
            name: '',
            phone: '',
            email: '',
            role: 'staff'
        });
        setIsEditMode(false);
        setIsAddModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setFormData({
            username: employee.username,
            password: '',
            name: employee.name,
            phone: employee.phone || '',
            email: employee.email || '',
            role: employee.role
        });
        setIsEditMode(true);
        setSelectedUser(employee);
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && selectedUser) {
                // Update existing
                const updateData: any = {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    role: formData.role
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await usersAPI.update(selectedUser.id, updateData);
                alert('อัปเดตข้อมูลพนักงานสำเร็จ');
            } else {
                // Create new
                await usersAPI.create({
                    ...formData,
                    isActive: true
                });
                alert('เพิ่มพนักงานสำเร็จ');
            }
            setIsAddModalOpen(false);
            setSelectedUser(null);
            loadEmployees();
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบพนักงานนี้?')) return;
        try {
            await usersAPI.delete(id);
            alert('ลบพนักงานสำเร็จ');
            setSelectedUser(null);
            loadEmployees();
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        }
    };

    const handleToggleStatus = async (employee: Employee) => {
        try {
            await usersAPI.update(employee.id, { isActive: !employee.isActive });
            loadEmployees();
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        }
    };

    const handleResetPassword = async (id: string) => {
        const newPassword = prompt('กรุณาใส่รหัสผ่านใหม่:');
        if (!newPassword) return;
        try {
            await usersAPI.update(id, { password: newPassword });
            alert('รีเซ็ตรหัสผ่านสำเร็จ');
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาด');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">จัดการพนักงาน</h1>
                    <p className="page-subtitle">ดูและจัดการข้อมูลพนักงานทั้งหมด</p>
                </div>
                <button onClick={openAddModal} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    เพิ่มพนักงาน
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <p className="text-2xl font-bold">{employees.length}</p>
                    <p className="text-xs text-text-muted">พนักงานทั้งหมด</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold">{employees.filter(u => u.role === 'admin').length}</p>
                    <p className="text-xs text-text-muted">เจ้าของ</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold">{employees.filter(u => u.role === 'staff').length}</p>
                    <p className="text-xs text-text-muted">พนักงาน</p>
                </div>
                <div className="card p-4">
                    <p className="text-2xl font-bold">{employees.filter(u => u.isActive).length}</p>
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
            {selectedUser && !isAddModalOpen && (
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

                            <div className="flex gap-2 pt-4 border-t border-border">
                                <button onClick={() => openEditModal(selectedUser)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    แก้ไขข้อมูล
                                </button>
                                <button onClick={() => handleResetPassword(selectedUser.id)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                                    <Key className="w-4 h-4" />
                                    รีเซ็ตรหัสผ่าน
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleStatus(selectedUser)}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${selectedUser.isActive ? 'bg-warning/10 text-warning hover:bg-warning/20' : 'bg-success/10 text-success hover:bg-success/20'}`}
                                >
                                    {selectedUser.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                                </button>
                                <button onClick={() => handleDelete(selectedUser.id)} className="flex-1 py-2 px-4 rounded-lg font-medium bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    ลบพนักงาน
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{isEditMode ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงานใหม่'}</h3>
                            <button
                                onClick={() => { setIsAddModalOpen(false); setSelectedUser(null); }}
                                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อผู้ใช้ *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="input w-full"
                                    required
                                    disabled={isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {isEditMode ? 'รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)' : 'รหัสผ่าน *'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="input w-full"
                                    required={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อ-นามสกุล *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="input w-full"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">เบอร์โทร</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="input w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">อีเมล</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="input w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">ตำแหน่ง *</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                                    className="input w-full"
                                >
                                    <option value="staff">พนักงาน</option>
                                    <option value="admin">เจ้าของ</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setSelectedUser(null); }} className="btn-secondary flex-1">
                                    ยกเลิก
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มพนักงาน'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
