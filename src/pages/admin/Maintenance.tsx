import { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle, Clock, MapPin, User } from 'lucide-react';
import { maintenanceAPI, roomsAPI } from '../../services/api';

const Maintenance = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [filter, setFilter] = useState('all');

    const [newTask, setNewTask] = useState({
        roomId: '', location: '', title: '', description: '',
        category: 'general', priority: 'normal', assignedToId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksRes, roomsRes] = await Promise.all([
                maintenanceAPI.getAll(),
                roomsAPI.getAll()
            ]);
            setTasks(tasksRes);
            setRooms(roomsRes);
        } catch (error) {
            console.error('Error loading maintenance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...newTask,
                roomId: newTask.roomId === 'other' ? null : newTask.roomId,
                location: newTask.roomId === 'other' ? newTask.location : null
            };
            await maintenanceAPI.create(payload);
            setShowModal(false);
            setNewTask({ roomId: '', location: '', title: '', description: '', category: 'general', priority: 'normal', assignedToId: '' });
            loadData();
        } catch (error) {
            alert('Error creating task');
        }
    };

    const updateStatus = async (id: string, status: string, actualCost?: number) => {
        try {
            await maintenanceAPI.update(id, { status, actualCost });
            loadData();
            setEditingTask(null);
        } catch (error) {
            alert('Error updating status');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="badge badge-warning flex items-center gap-1"><Clock className="w-3 h-3" /> รอดำเนินการ</span>;
            case 'in-progress': return <span className="badge badge-accent flex items-center gap-1"><Wrench className="w-3 h-3" /> กำลังซ่อม</span>;
            case 'completed': return <span className="badge badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> เสร็จสิ้น</span>;
            case 'cancelled': return <span className="badge badge-secondary">ยกเลิก</span>;
            default: return status;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'badge-danger';
            case 'high': return 'badge-warning';
            default: return 'badge-secondary';
        }
    };

    const getCategoryLabel = (cat: string) => {
        const labels: Record<string, string> = {
            general: 'ทั่วไป',
            electrical: 'ไฟฟ้า',
            plumbing: 'ประปา',
            ac: 'แอร์',
            furniture: 'เฟอร์นิเจอร์'
        };
        return labels[cat] || cat;
    };

    const filteredTasks = tasks.filter((t: any) => filter === 'all' || t.status === filter);

    const pendingCount = tasks.filter((t: any) => t.status === 'pending').length;
    const inProgressCount = tasks.filter((t: any) => t.status === 'in-progress').length;
    const completedCount = tasks.filter((t: any) => t.status === 'completed').length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-accent" />
                        </div>
                        ซ่อมบำรุง
                    </h1>
                    <p className="page-subtitle">แจ้งซ่อมและติดตามสถานะงานซ่อม</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    แจ้งซ่อม
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="card p-5 border-l-4 border-l-warning">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">รอดำเนินการ</p>
                            <p className="text-2xl font-bold text-text-primary">{pendingCount}</p>
                            <div className="flex items-center gap-1 mt-2 text-warning text-sm">
                                <Clock className="w-4 h-4" />
                                <span>งานที่รอ</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-warning" />
                        </div>
                    </div>
                </div>

                <div className="card p-5 border-l-4 border-l-accent">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">กำลังซ่อม</p>
                            <p className="text-2xl font-bold text-text-primary">{inProgressCount}</p>
                            <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                                <Wrench className="w-4 h-4" />
                                <span>งานที่กำลังซ่อม</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-accent" />
                        </div>
                    </div>
                </div>

                <div className="card p-5 border-l-4 border-l-success">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">เสร็จสิ้น</p>
                            <p className="text-2xl font-bold text-text-primary">{completedCount}</p>
                            <div className="flex items-center gap-1 mt-2 text-success text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>งานที่เสร็จแล้ว</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'ทั้งหมด' },
                    { key: 'pending', label: 'รอดำเนินการ' },
                    { key: 'in-progress', label: 'กำลังซ่อม' },
                    { key: 'completed', label: 'เสร็จสิ้น' },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key
                            ? 'bg-accent text-white'
                            : 'bg-surface text-text-secondary hover:bg-surface-hover border border-border'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-surface-hover flex items-center justify-center mx-auto mb-4">
                            <Wrench className="w-10 h-10 text-text-muted" />
                        </div>
                        <p className="text-text-muted text-lg">ไม่มีงานซ่อม</p>
                        <p className="text-text-secondary text-sm mt-1">คลิก "แจ้งซ่อม" เพื่อสร้างงานใหม่</p>
                    </div>
                ) : (
                    filteredTasks.map((task: any) => (
                        <div key={task.id} className="card p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {getStatusBadge(task.status)}
                                        <span className="text-xs text-text-muted font-mono">#{task.id.slice(0, 6)}</span>
                                        <span className={`badge ${getPriorityBadge(task.priority)}`}>
                                            {task.priority === 'urgent' ? 'เร่งด่วน' : task.priority === 'high' ? 'สูง' : 'ปกติ'}
                                        </span>
                                        <span className="badge badge-secondary">{getCategoryLabel(task.category)}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-text-primary mb-2">{task.title}</h3>
                                    <p className="text-text-secondary text-sm mb-4">{task.description}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-text-secondary">
                                            <MapPin className="w-4 h-4 text-accent" />
                                            {task.room ? `ห้อง ${task.room.number}` : task.location || 'ไม่ระบุ'}
                                        </div>
                                        {task.assignedTo && (
                                            <div className="flex items-center gap-1.5 text-text-secondary">
                                                <User className="w-4 h-4 text-accent" />
                                                {task.assignedTo.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    {task.status === 'pending' && (
                                        <button
                                            onClick={() => updateStatus(task.id, 'in-progress')}
                                            className="btn-primary bg-accent hover:bg-accent/90 text-sm"
                                        >
                                            <Wrench className="w-4 h-4" />
                                            เริ่มงานซ่อม
                                        </button>
                                    )}
                                    {task.status === 'in-progress' && (
                                        <button
                                            onClick={() => setEditingTask(task)}
                                            className="btn-primary bg-success hover:bg-success/90 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            ปิดงานซ่อม
                                        </button>
                                    )}
                                    {task.status === 'completed' && (
                                        <div className="text-right">
                                            <div className="text-sm text-text-secondary">ค่าซ่อมจริง</div>
                                            <div className="text-xl font-bold text-text-primary">
                                                ฿{task.actualCost?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-border shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-text-primary mb-6">แจ้งซ่อมใหม่</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">สถานที่</label>
                                <select
                                    className="input mb-2"
                                    value={newTask.roomId === '' ? '' : newTask.roomId || 'other'}
                                    onChange={(e) => setNewTask({ ...newTask, roomId: e.target.value })}
                                >
                                    <option value="">เลือกสถานที่...</option>
                                    {rooms.map((r: any) => (
                                        <option key={r.id} value={r.id}>ห้อง {r.number}</option>
                                    ))}
                                    <option value="other">อื่นๆ (ระบุ)</option>
                                </select>
                                {newTask.roomId === 'other' && (
                                    <input
                                        placeholder="ระบุสถานที่ (เช่น ล็อบบี้, สระว่ายน้ำ)"
                                        className="input"
                                        value={newTask.location}
                                        onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">หัวข้อ/อาการ</label>
                                <input
                                    required
                                    className="input"
                                    placeholder="เช่น แอร์ไม่เย็น, หลอดไฟเสีย"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">รายละเอียด</label>
                                <textarea
                                    className="input min-h-[80px] resize-none"
                                    placeholder="รายละเอียดเพิ่มเติม..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">หมวดหมู่</label>
                                    <select
                                        className="input"
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                    >
                                        <option value="general">ทั่วไป</option>
                                        <option value="electrical">ไฟฟ้า</option>
                                        <option value="plumbing">ประปา</option>
                                        <option value="ac">แอร์</option>
                                        <option value="furniture">เฟอร์นิเจอร์</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ความเร่งด่วน</label>
                                    <select
                                        className="input"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="normal">ปกติ</option>
                                        <option value="high">สูง</option>
                                        <option value="urgent">เร่งด่วน</option>
                                    </select>
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
                                    แจ้งซ่อม
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Complete Task Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-surface rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl">
                        <h2 className="text-xl font-bold text-text-primary mb-6">ปิดงานซ่อม</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateStatus(editingTask.id, 'completed', Number(e.currentTarget.cost.value));
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm text-text-secondary mb-1.5">ค่าใช้จ่ายจริง (บาท)</label>
                                <input
                                    name="cost"
                                    type="number"
                                    defaultValue={0}
                                    className="input"
                                    placeholder="0"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setEditingTask(null)}
                                    className="btn-secondary"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary bg-success hover:bg-success/90"
                                >
                                    ตกลง
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
