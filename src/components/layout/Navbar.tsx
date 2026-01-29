import { useState, useEffect } from 'react';
import { Home, Lock, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes or hash changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-white/10">
                            <Home className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">YadaHomestay</h1>
                            <p className="text-xs text-white/70">รีสอร์ทสุดหรู</p>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/#about" className="text-white/90 hover:text-white transition-colors">เกี่ยวกับเรา</Link>
                        <Link to="/#rooms" className="text-white/90 hover:text-white transition-colors">ห้องพัก</Link>
                        <Link to="/booking" className="text-white/90 hover:text-white transition-colors">จองห้อง</Link>
                        <Link to="/#gallery" className="text-white/90 hover:text-white transition-colors">แกลเลอรี่</Link>
                        <Link to="/contact" className="text-white/90 hover:text-white transition-colors">ติดต่อ</Link>
                        <Link to="/admin" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-primary/95 backdrop-blur-lg border-t border-white/10">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/#about" className="block text-white py-2">เกี่ยวกับเรา</Link>
                        <Link to="/#rooms" className="block text-white py-2">ห้องพัก</Link>
                        <Link to="/booking" className="block text-white py-2">จองห้อง</Link>
                        <Link to="/#gallery" className="block text-white py-2">แกลเลอรี่</Link>
                        <Link to="/contact" className="block text-white py-2">ติดต่อ</Link>
                        <Link to="/admin" className="block text-white py-2 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
