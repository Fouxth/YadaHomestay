import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Bed,
    Calendar,
    CreditCard,
    LogOut,
    Menu,
    X,
    Wine,
    BarChart3,
    Users,
    Settings,
    ChevronRight,
    Bell,
    Search
} from 'lucide-react';

export const AdminLayout = () => {
    const { currentUser, logout } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/admin/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'แดชบอร์ด' },
        { path: '/admin/rooms', icon: Bed, label: 'ห้องพัก' },
        { path: '/admin/bookings', icon: Calendar, label: 'การจอง' },
        { path: '/admin/pos', icon: CreditCard, label: 'POS' },
        { path: '/admin/bar', icon: Wine, label: 'มินิบาร์' },
        { path: '/admin/reports', icon: BarChart3, label: 'รายงาน' },
        { path: '/admin/employees', icon: Users, label: 'พนักงาน' },
        { path: '/admin/settings', icon: Settings, label: 'ตั้งค่า' },
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-surface border-r border-border w-64 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center border-b border-border px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Y</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-text-primary text-sm">YadaHomestay</h1>
                            <p className="text-xs text-text-muted">ระบบจัดการ</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-accent' : ''}`} />
                            <span className="flex-1">{item.label}</span>
                            {isActive(item.path) && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    ))}
                </nav>

                {/* User & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-surface">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5 text-text-secondary" />
                        </button>

                        {/* Search */}
                        <div className="hidden md:flex items-center gap-2 bg-background rounded-lg px-3 py-2 border border-border">
                            <Search className="w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                className="bg-transparent text-sm focus:outline-none w-48"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors relative">
                            <Bell className="w-5 h-5 text-text-secondary" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
                        </button>

                        {/* User */}
                        <div className="flex items-center gap-3 pl-3 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-text-primary">{currentUser.name}</p>
                                <p className="text-xs text-text-muted">{currentUser.role === 'admin' ? 'เจ้าของ' : 'พนักงาน'}</p>
                            </div>
                            <div className="w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center">
                                <span className="text-accent font-semibold text-sm">
                                    {currentUser.name.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
