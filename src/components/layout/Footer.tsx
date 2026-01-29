
import { Home, Wifi, Waves, Utensils, Sparkles, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <Home className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">YadaHomestay</h3>
                                <p className="text-xs text-gray-400">รีสอร์ทสุดหรู</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">สัมผัสธรรมชาติในบรรยากาศสุดพิเศษ พร้อมบริการระดับพรีเมียม</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">ลิงก์ด่วน</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link to="/#about" className="hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
                            <li><Link to="/#rooms" className="hover:text-white transition-colors">ห้องพัก</Link></li>
                            <li><Link to="/booking" className="hover:text-white transition-colors">จองห้อง</Link></li>
                            <li><Link to="/#gallery" className="hover:text-white transition-colors">แกลเลอรี่</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">บริการ</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-center gap-2"><Wifi className="w-4 h-4" />Wi-Fi ฟรี</li>
                            <li className="flex items-center gap-2"><Waves className="w-4 h-4" />สระว่ายน้ำ</li>
                            <li className="flex items-center gap-2"><Utensils className="w-4 h-4" />ร้านอาหาร</li>
                            <li className="flex items-center gap-2"><Sparkles className="w-4 h-4" />สปา</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">ติดตามเรา</h4>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2024 YadaHomestay. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
