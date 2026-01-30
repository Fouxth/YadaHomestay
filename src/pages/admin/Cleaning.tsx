import { useState, useEffect } from 'react';
import { Sparkles, Plus, CheckCircle, Clock, User, Home } from 'lucide-react';
import { cleaningAPI, usersAPI, roomsAPI } from '../../services/api';

const Cleaning = () => {
    const [tasks, setTasks] = useState([]);
    const [staff, setStaff] = useState([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ roomId: '', type: 'routine', priority: 'normal', notes: '', assignedToId: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksRes, staffRes, roomsRes] = await Promise.all([
                cleaningAPI.getAll(),
                usersAPI.getAll(),
                roomsAPI.getAll()
            ]);
            console.log('[Cleaning] Rooms loaded:', roomsRes);
            setTasks(tasksRes);
            setStaff(staffRes.filter((u: any) => u.role === 'staff'));
            setRooms(roomsRes);
        } catch (error) {
            console.error('Error loading cleaning data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await cleaningAPI.create(newTask);
            setShowModal(false);
            setNewTask({ roomId: '', type: 'routine', priority: 'normal', notes: '', assignedToId: '' });
            loadData();
        } catch (error) {
            alert('Error creating task');
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await cleaningAPI.updateStatus(id, status);
            loadData();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const handleAssign = async (id: string, staffId: string) => {
        try {
            await cleaningAPI.assign(id, staffId);
            loadData();
        } catch (error) {
            alert('Error assigning staff');
        }
    };

    const getPriorityBadge = (p: string) => {
        switch (p) {
            case 'urgent': return 'badge-danger';
            case 'high': return 'badge-warning';
            default: return 'badge-info';
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            routine: 'ทั่วไป',
            checkout: 'Check-out',
            deep: 'ทำความสะอาดใหญ่'
        };
        return labels[type] || type;
    };

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
                            <Sparkles className="w-5 h-5 text-accent" />
                        </div>
                        ทำความสะอาด
                    </h1>
                    <p className="page-subtitle">จัดการงานทำความสะอาดห้องพัก</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    สร้างงาน
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
                            <p className="text-sm text-text-secondary mb-1">กำลังทำ</p>
                            <p className="text-2xl font-bold text-text-primary">{inProgressCount}</p>
                            <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                                <User className="w-4 h-4" />
                                <span>งานที่กำลังทำ</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-accent" />
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

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Pending Column */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-warning" />
                            <h3 className="font-semibold text-text-primary">รอดำเนินการ</h3>
                        </div>
                        <span className="badge badge-warning">{pendingCount}</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                        {tasks.filter((t: any) => t.status === 'pending').length === 0 ? (
                            <div className="text-center py-8 text-text-muted">
                                <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">ไม่มีงานรอดำเนินการ</p>
                            </div>
                        ) : (
                            tasks.filter((t: any) => t.status === 'pending').map((task: any) => (
                                <div key={task.id} className="p-4 bg-surface-hover rounded-xl border border-border hover:border-accent/50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Home className="w-4 h-4 text-accent" />
                                            <span className="font-semibold text-text-primary">{task.room?.number}</span>
                                        </div>
                                        <span className={`badge ${getPriorityBadge(task.priority)}`}>
                                            {task.priority === 'urgent' ? 'เร่งด่วน' : task.priority === 'high' ? 'สูง' : 'ปกติ'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-text-secondary mb-2">{getTypeLabel(task.type)}</div>
                                    {task.notes && (
                                        <div className="text-xs text-text-muted mb-3 p-2 bg-background rounded">
                                            {task.notes}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <select
                                            className="text-xs bg-surface border border-border rounded px-2 py-1 text-text-secondary focus:border-accent outline-none"
                                            value={task.assignedToId || ''}
                                            onChange={(e) => handleAssign(task.id, e.target.value)}
                                        >
                                            <option value="">เลือกพนักงาน...</option>
                                            {staff.map((s: any) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => updateStatus(task.id, 'in-progress')}
                                            className="text-xs text-accent hover:text-accent/80 font-medium"
                                        >
                                            เริ่มงาน →
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-accent" />
                            <h3 className="font-semibold text-text-primary">กำลังทำ</h3>
                        </div>
                        <span className="badge badge-accent">{inProgressCount}</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                        {tasks.filter((t: any) => t.status === 'in-progress').length === 0 ? (
                            <div className="text-center py-8 text-text-muted">
                                <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">ไม่มีงานที่กำลังทำ</p>
                            </div>
                        ) : (
                            tasks.filter((t: any) => t.status === 'in-progress').map((task: any) => (
                                <div key={task.id} className="p-4 bg-accent/5 rounded-xl border border-accent/30">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Home className="w-4 h-4 text-accent" />
                                            <span className="font-semibold text-text-primary">{task.room?.number}</span>
                                        </div>
                                        <span className="badge badge-accent">กำลังทำ</span>
                                    </div>
                                    <div className="text-sm text-text-secondary mb-2">{getTypeLabel(task.type)}</div>
                                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                                        <User className="w-3 h-3" />
                                        {task.assignedTo?.name || 'ยังไม่มอบหมาย'}
                                    </div>
                                    {task.startedAt && (
                                        <div className="text-xs text-text-muted mb-3">
                                            เริ่ม: {new Date(task.startedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => updateStatus(task.id, 'completed')}
                                        className="w-full py-2 bg-success hover:bg-success/90 text-white text-sm rounded-lg font-medium transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4 inline mr-1" />
                                        เสร็จสิ้น
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Completed Column */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <h3 className="font-semibold text-text-primary">เสร็จสิ้น (ล่าสุด)</h3>
                        </div>
                    </div>
                    <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                        {tasks.filter((t: any) => t.status === 'completed').length === 0 ? (
                            <div className="text-center py-8 text-text-muted">
                                <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">ยังไม่มีงานที่เสร็จสิ้น</p>
                            </div>
                        ) : (
                            tasks.filter((t: any) => t.status === 'completed').slice(0, 10).map((task: any) => (
                                <div key={task.id} className="p-3 bg-surface-hover rounded-lg border border-border flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-text-primary">{task.room?.number}</span>
                                            <span className="text-xs text-text-muted">{getTypeLabel(task.type)}</span>
                                        </div>
                                        <div className="text-xs text-text-muted mt-1">
                                            โดย: {task.assignedTo?.name || '-'}
                                        </div>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-success" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-border shadow-xl">
                        <h2 className="text-xl font-bold text-text-primary mb-6">สร้างงานทำความสะอาด</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">ห้อง</label>
                                <select
                                    required
                                    disabled={loading}
                                    className="input"
                                    value={newTask.roomId}
                                    onChange={(e) => setNewTask({ ...newTask, roomId: e.target.value })}
                                >
                                    <option value="">{loading ? 'กำลังโหลด...' : 'เลือกห้อง...'}</option>
                                    {rooms.map((r: any) => (
                                        <option key={r.id} value={r.id}>{r.number} - {r.name}</option>
                                    ))}
                                </select>
                                {rooms.length === 0 && !loading && (
                                    <p className="text-xs text-danger mt-1">ไม่พบห้องพัก กรุณาเพิ่มห้องพักก่อน</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1.5">ประเภท</label>
                                    <select
                                        className="input"
                                        value={newTask.type}
                                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                    >
                                        <option value="routine">ทั่วไป</option>
                                        <option value="checkout">Check-out</option>
                                        <option value="deep">ทำความสะอาดใหญ่</option>
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
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">หมายเหตุ</label>
                                <textarea
                                    className="input min-h-[80px] resize-none"
                                    placeholder="เพิ่มหมายเหตุ..."
                                    value={newTask.notes}
                                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1.5">มอบหมาย (ไม่บังคับ)</label>
                                <select
                                    className="input"
                                    value={newTask.assignedToId}
                                    onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                                >
                                    <option value="">ไม่ระบุ</option>
                                    {staff.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
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
                                    สร้างงาน
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cleaning;
