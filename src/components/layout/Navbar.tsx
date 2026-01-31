import { useState, useEffect } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
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

    // Handle hash scroll after navigation OR scroll to top for new pages
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            // Scroll to top when navigating to a new page without hash
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [location.pathname, location.hash]);

    // Smooth scroll to section
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        setActiveSection(sectionId);

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

    const navLinks = [
        { id: 'about', label: 'เกี่ยวกับเรา', path: '/about' },
        { id: 'rooms', label: 'ห้องพัก', hash: 'rooms' }, // Homepage section
        { id: 'gallery', label: 'แกลเลอรี่', path: '/gallery' },
        { id: 'contact', label: 'ติดต่อ', path: '/contact' },
    ];

    // Check if not on homepage - always show colored navbar
    const isNotHomepage = location.pathname !== '/';

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${(isScrolled || isNotHomepage)
                ? 'bg-[#2F5D50]/95 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-[#2F5D50] rounded-xl flex items-center justify-center border border-white/20 group-hover:border-[#C2A97E]/50 transition-all duration-300">
                            <Home className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">YadaHomestay</h1>
                            <p className="text-xs text-white/70">| ญาดาโฮมสเตย์</p>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.path ? (
                                <Link
                                    key={link.id}
                                    to={link.path}
                                    className={`relative text-white/90 hover:text-white transition-all duration-300 cursor-pointer py-2 ${location.pathname === link.path ? 'text-white' : ''}`}
                                >
                                    {link.label}
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2A97E] rounded-full transition-all duration-300 ${location.pathname === link.path ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
                                </Link>
                            ) : (
                                <a
                                    key={link.id}
                                    href={`#${link.hash}`}
                                    onClick={(e) => scrollToSection(e, link.hash!)}
                                    className={`relative text-white/90 hover:text-white transition-all duration-300 cursor-pointer py-2 ${activeSection === link.hash ? 'text-white' : ''}`}
                                >
                                    {link.label}
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2A97E] rounded-full transition-all duration-300 ${activeSection === link.hash ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
                                </a>
                            )
                        ))}
                        <Link
                            to="/#rooms"
                            className="bg-[#C2A97E] hover:bg-[#A88B5A] text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#C2A97E]/30"
                        >
                            จองห้อง
                        </Link>
                    </div>
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#2F5D50]/98 backdrop-blur-lg border-t border-white/10">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            link.path ? (
                                <Link
                                    key={link.id}
                                    to={link.path}
                                    className="block text-white/90 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg cursor-pointer transition-all duration-300"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.id}
                                    href={`#${link.hash}`}
                                    onClick={(e) => scrollToSection(e, link.hash!)}
                                    className="block text-white/90 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg cursor-pointer transition-all duration-300"
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                        <Link
                            to="/booking"
                            className="block bg-[#C2A97E] hover:bg-[#A88B5A] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 mt-4 text-center"
                        >
                            จองห้อง
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
