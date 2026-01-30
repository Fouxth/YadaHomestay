import { useState, useEffect } from 'react';
import { Package, ArrowUpRight, ArrowDownRight, AlertTriangle, History, Search, Filter } from 'lucide-react';
import { inventoryAPI, productsAPI } from '../../services/api';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [movements, setMovements] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [transaction, setTransaction] = useState({
        productId: '', type: 'in', quantity: 1, reason: 'purchase', notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, movementsRes, lowStockRes] = await Promise.all([
                productsAPI.getAll(),
                inventoryAPI.getMovements(),
                inventoryAPI.getLowStock()
            ]);
            setProducts(productsRes);
            setMovements(movementsRes);
            setLowStock(lowStockRes);
        } catch (error) {
            console.error('Error loading inventory:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inventoryAPI.addMovement(transaction);
            setShowModal(false);
            setTransaction({ productId: '', type: 'in', quantity: 1, reason: 'purchase', notes: '' });
            loadData();
        } catch (error) {
            alert('Error adding stock movement');
        }
    };

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalStock = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-accent" />
                        </div>
                        คลังสินค้า
                    </h1>
                    <p className="page-subtitle">จัดการสต็อกและประวัติเบิก-จ่ายสินค้า</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setTransaction({ ...transaction, type: 'in', reason: 'purchase' });
                            setShowModal(true);
                        }}
                        className="btn-primary bg-success hover:bg-success/90"
                    >
                        <ArrowDownRight className="w-4 h-4" />
                        รับเข้า
                    </button>
                    <button
                        onClick={() => {
                            setTransaction({ ...transaction, type: 'out', reason: 'sale' });
                            setShowModal(true);
                        }}
                        className="btn-primary bg-danger hover:bg-danger/90"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        จ่ายออก
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Low Stock Alert */}
                <div className={`card p-5 border-l-4 ${lowStock.length > 0 ? 'border-l-danger' : 'border-l-success'}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">สินค้าใกล้หมด</p>
                            <p className={`text-2xl font-bold ${lowStock.length > 0 ? 'text-danger' : 'text-success'}`}>
                                {lowStock.length} รายการ
                            </p>
                            <div className={`flex items-center gap-1 mt-2 text-sm ${lowStock.length > 0 ? 'text-danger' : 'text-success'}`}>
                                <AlertTriangle className="w-4 h-4" />
                                <span>{lowStock.length > 0 ? 'ต้องเติมสต็อก' : 'สต็อกปกติ'}</span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStock.length > 0 ? 'bg-danger/10' : 'bg-success/10'}`}>
                            <AlertTriangle className={`w-6 h-6 ${lowStock.length > 0 ? 'text-danger' : 'text-success'}`} />
                        </div>
                    </div>
                </div>

                {/* Total Products */}
                <div className="card p-5 border-l-4 border-l-accent">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">รายการสินค้า</p>
                            <p className="text-2xl font-bold text-text-primary">{products.length}</p>
                            <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                                <Package className="w-4 h-4" />
                                <span>ทั้งหมดในระบบ</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-accent" />
                        </div>
                    </div>
                </div>

                {/* Total Stock */}
                <div className="card p-5 border-l-4 border-l-info">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">จำนวนสต็อกรวม</p>
                            <p className="text-2xl font-bold text-text-primary">{totalStock}</p>
                            <div className="flex items-center gap-1 mt-2 text-info text-sm">
                                <History className="w-4 h-4" />
                                <span>ชิ้นในคลัง</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                            <History className="w-6 h-6 text-info" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Details */}
            {lowStock.length > 0 && (
                <div className="card border-danger/30 bg-danger/5">
                    <div className="card-header">
                        <h3 className="font-semibold text-danger flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            สินค้าที่ต้องเติมสต็อก
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {lowStock.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-danger/20">
                                    <div>
                                        <p className="font-medium text-text-primary">{p.name}</p>
                                        <p className="text-xs text-text-muted">{p.code}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-danger">{p.stock} {p.unit}</p>
                                        <p className="text-xs text-text-muted">เหลือน้อย</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="card">
                <div className="card-header flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-text-secondary" />
                        <h3 className="font-semibold text-text-primary">รายการสินค้า</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="input-group">
                            <Search className="input-group-icon" />
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้า..."
                                className="input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="btn-ghost">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัส</th>
                                <th>สินค้า</th>
                                <th>หมวดหมู่</th>
                                <th className="text-center">สต็อก</th>
                                <th className="text-center">ขั้นต่ำ</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-text-muted">
                                        ไม่พบสินค้า
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p: any) => (
                                    <tr key={p.id}>
                                        <td className="font-mono text-xs text-text-muted">{p.code}</td>
                                        <td>
                                            <div className="font-medium text-text-primary">{p.name}</div>
                                            <div className="text-xs text-text-muted">{p.description || '-'}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-secondary">{p.category}</span>
                                        </td>
                                        <td className="text-center font-semibold">{p.stock} {p.unit}</td>
                                        <td className="text-center text-text-muted">{p.minStock} {p.unit}</td>
                                        <td>
                                            {p.stock <= p.minStock ? (
                                                <span className="badge badge-danger">ใกล้หมด</span>
                                            ) : p.stock <= p.minStock * 1.5 ? (
                                                <span className="badge badge-warning">ต่ำ</span>
                                            ) : (
                                                <span className="badge badge-success">ปกติ</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Movement History */}
            <div className="card">
                <div className="card-header flex items-center gap-3">
                    <History className="w-5 h-5 text-text-secondary" />
                    <h3 className="font-semibold text-text-primary">ประวัติการเคลื่อนไหวล่าสุด</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>เวลา</th>
                                <th>สินค้า</th>
                                <th>ประเภท</th>
                                <th className="text-center">จำนวน</th>
                                <th>เหตุผล</th>
                                <th>ผู้ทำรายการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-text-muted">
                                        ไม่มีประวัติ
                                    </td>
                                </tr>
                            ) : (
                                movements.map((m: any) => (
                                    <tr key={m.id}>
                                        <td className="text-text-secondary text-sm">
                                            {new Date(m.createdAt).toLocaleString('th-TH', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="font-medium text-text-primary">{m.product?.name}</td>
                                        <td>
                                            {m.type === 'in' ? (
                                                <span className="badge badge-success flex items-center gap-1 w-fit">
                                                    <ArrowDownRight className="w-3 h-3" />
                                                    รับเข้า
                                                </span>
                                            ) : (
                                                <span className="badge badge-danger flex items-center gap-1 w-fit">
                                                    <ArrowUpRight className="w-3 h-3" />
                                                    จ่ายออก
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center font-semibold">{m.quantity}</td>
                                        <td className="text-text-secondary text-sm">{m.reason}</td>
                                        <td className="text-text-secondary text-sm">{m.staff?.name || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-border shadow-xl">
                        <h2 className="text-xl font-bold text-text-primary mb-6">
                            {transaction.type === 'in' ? 'รับสินค้าเข้า' : 'เบิกสินค้าออก'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">สินค้า</label>
                                <select
                                    required
                                    className="input"
                                    value={transaction.productId}
                                    onChange={(e) => setTransaction({ ...transaction, productId: e.target.value })}
                                >
                                    <option value="">เลือกสินค้า...</option>
                                    {products.map((p: any) => (
                                        <option key={p.id} value={p.id}>
                                            {p.code} - {p.name} (คงเหลือ: {p.stock} {p.unit})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">จำนวน</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="input"
                                        value={transaction.quantity}
                                        onChange={(e) => setTransaction({ ...transaction, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">เหตุผล</label>
                                    <select
                                        className="input"
                                        value={transaction.reason}
                                        onChange={(e) => setTransaction({ ...transaction, reason: e.target.value })}
                                    >
                                        {transaction.type === 'in' ? (
                                            <>
                                                <option value="purchase">ซื้อเพิ่ม</option>
                                                <option value="return">รับคืน</option>
                                                <option value="adjustment">ปรับยอด</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="sale">ขาย</option>
                                                <option value="damaged">ชำรุด/เสียหาย</option>
                                                <option value="expired">หมดอายุ</option>
                                                <option value="use">เบิกใช้ภายใน</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">หมายเหตุ</label>
                                <input
                                    className="input"
                                    placeholder="เพิ่มหมายเหตุ..."
                                    value={transaction.notes}
                                    onChange={(e) => setTransaction({ ...transaction, notes: e.target.value })}
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
                                    className={`btn-primary ${transaction.type === 'in' ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90'}`}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
