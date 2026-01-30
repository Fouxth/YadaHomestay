import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Star } from 'lucide-react';
import { customersAPI } from '../../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        idCard: '',
        nationality: 'Thai',
        address: '',
        notes: ''
    });

    useEffect(() => {
        loadCustomers();
    }, [search]);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const res = await customersAPI.getAll({ search });
            setCustomers(res.customers);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await customersAPI.update(editingCustomer.id, formData);
            } else {
                await customersAPI.create(formData);
            }
            setShowModal(false);
            setEditingCustomer(null);
            setFormData({ firstName: '', lastName: '', phone: '', email: '', idCard: '', nationality: 'Thai', address: '', notes: '' });
            loadCustomers();
        } catch (error) {
            alert('Error saving customer');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบลูกค้ารายนี้?')) return;
        try {
            await customersAPI.delete(id);
            loadCustomers();
        } catch (error) {
            alert('Error deleting customer');
        }
    };

    const getNationalityFlag = (nationality: string) => {
        const flags: Record<string, string> = {
            'Thai': '🇹🇭',
            'USA': '🇺🇸',
            'UK': '🇬🇧',
            'China': '🇨🇳',
            'Japan': '🇯🇵',
            'Korea': '🇰🇷',
            'France': '🇫🇷',
            'Germany': '🇩🇪',
            'Australia': '🇦🇺',
            'Singapore': '🇸🇬'
        };
        return flags[nationality] || '🌏';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-accent" />
                        </div>
                        ลูกค้า
                    </h1>
                    <p className="page-subtitle">จัดการข้อมูลลูกค้าและประวัติการเข้าพัก</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCustomer(null);
                        setFormData({ firstName: '', lastName: '', phone: '', email: '', idCard: '', nationality: 'Thai', address: '', notes: '' });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มลูกค้า
                </button>
            </div>

            {/* Search Bar */}
            <div className="card p-4">
                <div className="input-group max-w-md">
                    <Search className="input-group-icon" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input"
                    />
                </div>
            </div>

            {/* Customers Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {customers.length === 0 ? (
                        <div className="col-span-full card p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-surface-hover flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-text-muted" />
                            </div>
                            <p className="text-text-muted text-lg">ไม่พบลูกค้า</p>
                            <p className="text-text-secondary text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือเพิ่มลูกค้าใหม่</p>
                        </div>
                    ) : (
                        customers.map((c: any) => (
                            <div key={c.id} className="card p-5 hover:shadow-lg transition-all group">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                                            {c.firstName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">
                                                {c.firstName} {c.lastName}
                                            </h3>
                                            <p className="text-xs text-text-muted font-mono">{c.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingCustomer(c);
                                                setFormData(c);
                                                setShowModal(true);
                                            }}
                                            className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="p-2 hover:bg-danger/10 rounded-lg text-danger transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4">
                                    {c.phone && (
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Phone className="w-4 h-4" />
                                            <span>{c.phone}</span>
                                        </div>
                                    )}
                                    {c.email && (
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{c.email}</span>
                                        </div>
                                    )}
                                    {c.address && (
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{c.address}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{getNationalityFlag(c.nationality)}</span>
                                        <span className="text-sm text-text-secondary">{c.nationality}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-warning fill-warning" />
                                        <span className="text-sm font-medium text-text-primary">{c.totalVisits || 0}</span>
                                        <span className="text-xs text-text-muted">ครั้ง</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-surface rounded-2xl p-6 w-full max-w-lg border border-border shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-text-primary mb-6">
                            {editingCustomer ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ชื่อ</label>
                                    <input
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="input"
                                        placeholder="ชื่อ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">นามสกุล</label>
                                    <input
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="input"
                                        placeholder="นามสกุล"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">เบอร์โทร</label>
                                    <input
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input"
                                        placeholder="0xx-xxx-xxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">อีเมล</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">สัญชาติ</label>
                                    <select
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                        className="input"
                                    >
                                        <option value="Thai">ไทย</option>
                                        <option value="USA">อเมริกัน</option>
                                        <option value="UK">อังกฤษ</option>
                                        <option value="China">จีน</option>
                                        <option value="Japan">ญี่ปุ่น</option>
                                        <option value="Korea">เกาหลี</option>
                                        <option value="France">ฝรั่งเศส</option>
                                        <option value="Germany">เยอรมัน</option>
                                        <option value="Australia">ออสเตรเลีย</option>
                                        <option value="Singapore">สิงคโปร์</option>
                                        <option value="Other">อื่นๆ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">เลขบัตรประชาชน/พาสปอร์ต</label>
                                    <input
                                        value={formData.idCard}
                                        onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                                        className="input"
                                        placeholder="x-xxxx-xxxxx-xx-x"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">ที่อยู่</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input min-h-[80px] resize-none"
                                    placeholder="ที่อยู่..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">หมายเหตุ</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input min-h-[60px] resize-none"
                                    placeholder="หมายเหตุเพิ่มเติม..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    {editingCustomer ? 'บันทึกการแก้ไข' : 'เพิ่มลูกค้า'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
