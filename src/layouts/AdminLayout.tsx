import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Bed, Calendar, CreditCard, LogOut, Menu, X, Wine, BarChart3, Users, Settings, ChevronLeft } from 'lucide-react';

export const AdminLayout = () => {
    const { currentUser, logout } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        { path: '/admin/pos', icon: CreditCard, label: 'POS / หน้าร้าน' },
        { path: '/admin/bar', icon: Wine, label: 'บาร์ / มินิบาร์' },
        { path: '/admin/reports', icon: BarChart3, label: 'รายงาน' },
        { path: '/admin/employees', icon: Users, label: 'พนักงาน' },
        { path: '/admin/settings', icon: Settings, label: 'ตั้งค่า' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-4 border-b flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <Home className="text-white w-5 h-5" />
                        </div>
                        {!isSidebarCollapsed && (
                            <div>
                                <h1 className="font-bold text-gray-800">YadaAdmin</h1>
                                <p className="text-xs text-gray-500">ระบบหลังบ้าน</p>
                            </div>
                        )}
                    </div>
                    <button
                        className="hidden lg:flex text-gray-400 hover:text-gray-600 p-1"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                    <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === item.path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                            title={isSidebarCollapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {currentUser.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-800">{currentUser.name}</p>
                            <p className="text-xs text-gray-500">{currentUser.role === 'admin' ? 'เจ้าของ' : 'พนักงาน'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white shadow-sm p-4 lg:hidden flex items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-gray-100 text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};
