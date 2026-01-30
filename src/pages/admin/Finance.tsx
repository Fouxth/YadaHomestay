import { useState, useEffect } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Filter, Download } from 'lucide-react';
import { financeAPI } from '../../services/api';

const Finance = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });
    const [showModal, setShowModal] = useState(false);
    const [newTxn, setNewTxn] = useState({
        type: 'income', category: 'other', amount: 0, paymentMethod: 'cash', description: '', date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [txnRes, sumRes] = await Promise.all([
                financeAPI.getTransactions(),
                financeAPI.getSummary()
            ]);
            setTransactions(txnRes);
            setSummary(sumRes);
        } catch (error) {
            console.error('Error loading finance data:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await financeAPI.create(newTxn);
            setShowModal(false);
            setNewTxn({ type: 'income', category: 'other', amount: 0, paymentMethod: 'cash', description: '', date: new Date().toISOString().split('T')[0] });
            loadData();
        } catch (error) {
            alert('Error creating transaction');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            room: 'ค่าห้องพัก',
            bar: 'บาร์/ร้านอาหาร',
            service: 'บริการเสริม',
            salary: 'เงินเดือน',
            utility: 'ค่าน้ำ/ไฟ',
            supplies: 'วัตถุดิบ',
            maintenance: 'ซ่อมบำรุง',
            other: 'อื่นๆ'
        };
        return labels[category] || category;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-accent" />
                        </div>
                        การเงิน
                    </h1>
                    <p className="page-subtitle">บันทึกรายรับ-รายจ่าย และติดตามสภาพคล่องทางการเงิน</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        ส่งออก
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        บันทึกรายการ
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Income Card */}
                <div className="card p-5 border-l-4 border-l-success">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">รายรับรวม</p>
                            <p className="text-2xl font-bold text-text-primary">{formatCurrency(summary.income)}</p>
                            <div className="flex items-center gap-1 mt-2 text-success text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span>รายรับทั้งหมด</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-success" />
                        </div>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="card p-5 border-l-4 border-l-danger">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">รายจ่ายรวม</p>
                            <p className="text-2xl font-bold text-text-primary">{formatCurrency(summary.expense)}</p>
                            <div className="flex items-center gap-1 mt-2 text-danger text-sm">
                                <TrendingDown className="w-4 h-4" />
                                <span>รายจ่ายทั้งหมด</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-danger" />
                        </div>
                    </div>
                </div>

                {/* Net Profit Card */}
                <div className={`card p-5 border-l-4 ${summary.net >= 0 ? 'border-l-accent' : 'border-l-warning'}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">กำไรสุทธิ</p>
                            <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-text-primary' : 'text-warning'}`}>
                                {formatCurrency(summary.net)}
                            </p>
                            <div className={`flex items-center gap-1 mt-2 text-sm ${summary.net >= 0 ? 'text-accent' : 'text-warning'}`}>
                                <Wallet className="w-4 h-4" />
                                <span>{summary.net >= 0 ? 'กำไร' : 'ขาดทุน'}</span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${summary.net >= 0 ? 'bg-accent/10' : 'bg-warning/10'}`}>
                            <Wallet className={`w-6 h-6 ${summary.net >= 0 ? 'text-accent' : 'text-warning'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-text-secondary" />
                        <h3 className="font-semibold text-text-primary">รายการล่าสุด</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-ghost text-sm">
                            <Filter className="w-4 h-4" />
                            กรอง
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>รหัส</th>
                                <th>หมวดหมู่</th>
                                <th>รายละเอียด</th>
                                <th>วิธีชำระ</th>
                                <th className="text-right">จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-text-muted">
                                        ไม่มีรายการ
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t: any) => (
                                    <tr key={t.id}>
                                        <td className="text-text-secondary">
                                            {new Date(t.date).toLocaleDateString('th-TH', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="font-mono text-xs text-text-muted">{t.code}</td>
                                        <td>
                                            <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                                                {getCategoryLabel(t.category)}
                                            </span>
                                        </td>
                                        <td className="text-text-primary">{t.description || '-'}</td>
                                        <td>
                                            <span className="badge badge-secondary">
                                                {t.paymentMethod === 'cash' ? 'เงินสด' :
                                                    t.paymentMethod === 'transfer' ? 'โอนเงิน' : 'บัตรเครดิต'}
                                            </span>
                                        </td>
                                        <td className={`text-right font-semibold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </td>
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
                        <h2 className="text-xl font-bold text-text-primary mb-6">บันทึกรายการ</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            {/* Type Toggle */}
                            <div className="flex bg-background rounded-xl p-1">
                                <button
                                    type="button"
                                    onClick={() => setNewTxn({ ...newTxn, type: 'income' })}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${newTxn.type === 'income'
                                            ? 'bg-success text-white shadow-sm'
                                            : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    รายรับ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewTxn({ ...newTxn, type: 'expense' })}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${newTxn.type === 'expense'
                                            ? 'bg-danger text-white shadow-sm'
                                            : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    รายจ่าย
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">วันที่</label>
                                    <input
                                        type="date"
                                        required
                                        className="input"
                                        value={newTxn.date}
                                        onChange={(e) => setNewTxn({ ...newTxn, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">จำนวนเงิน</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="input font-semibold"
                                        placeholder="0.00"
                                        value={newTxn.amount || ''}
                                        onChange={(e) => setNewTxn({ ...newTxn, amount: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">หมวดหมู่</label>
                                <select
                                    className="input"
                                    value={newTxn.category}
                                    onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value })}
                                >
                                    {newTxn.type === 'income' ? (
                                        <>
                                            <option value="room">ค่าห้องพัก</option>
                                            <option value="bar">บาร์/ร้านอาหาร</option>
                                            <option value="service">บริการเสริม</option>
                                            <option value="other">อื่นๆ</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="salary">เงินเดือนพนักงาน</option>
                                            <option value="utility">ค่าน้ำ/ไฟ/อินเทอร์เน็ต</option>
                                            <option value="supplies">ซื้อของใช้/วัตถุดิบ</option>
                                            <option value="maintenance">ค่าซ่อมบำรุง</option>
                                            <option value="other">อื่นๆ</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">รายละเอียด/หมายเหตุ</label>
                                <input
                                    className="input"
                                    placeholder="เพิ่มรายละเอียด..."
                                    value={newTxn.description}
                                    onChange={(e) => setNewTxn({ ...newTxn, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">วิธีชำระเงิน</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['cash', 'transfer', 'credit'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setNewTxn({ ...newTxn, paymentMethod: method })}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${newTxn.paymentMethod === method
                                                    ? 'border-accent bg-accent/10 text-accent'
                                                    : 'border-border text-text-secondary hover:border-accent/50'
                                                }`}
                                        >
                                            {method === 'cash' ? 'เงินสด' :
                                                method === 'transfer' ? 'โอนเงิน' : 'บัตรเครดิต'}
                                        </button>
                                    ))}
                                </div>
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
                                    บันทึกรายการ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
