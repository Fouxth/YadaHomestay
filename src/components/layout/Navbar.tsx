import { useState, useEffect } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    // Handle hash scroll after navigation
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    // Smooth scroll to section
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        // If on homepage, scroll directly
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Navigate to homepage with hash
            navigate('/#' + sectionId);
        }
    };

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
                            <p className="text-xs text-white/70">ญาดาโฮมสเตย์</p>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-white/90 hover:text-white transition-colors cursor-pointer">เกี่ยวกับเรา</a>
                        <a href="#rooms" onClick={(e) => scrollToSection(e, 'rooms')} className="text-white/90 hover:text-white transition-colors cursor-pointer">ห้องพัก</a>
                        <Link to="#rooms" className="text-white/90 hover:text-white transition-colors">จองห้อง</Link>
                        <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="text-white/90 hover:text-white transition-colors cursor-pointer">แกลเลอรี่</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-white/90 hover:text-white transition-colors cursor-pointer">ติดต่อ</a>
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
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="block text-white py-2 cursor-pointer">เกี่ยวกับเรา</a>
                        <a href="#rooms" onClick={(e) => scrollToSection(e, 'rooms')} className="block text-white py-2 cursor-pointer">ห้องพัก</a>
                        <Link to="#rooms" className="block text-white py-2">จองห้อง</Link>
                        <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="block text-white py-2 cursor-pointer">แกลเลอรี่</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="block text-white py-2 cursor-pointer">ติดต่อ</a>
                    </div>
                </div>
            )}
        </nav>
    );
};
