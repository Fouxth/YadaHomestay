
import { Home, Wifi, Waves, Utensils, Sparkles, Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-[#1a2f2a] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#2F5D50] rounded-xl flex items-center justify-center border border-[#C2A97E]/30">
                                <Home className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">YadaHomestay</h3>
                                <p className="text-xs text-[#C2A97E]">รีสอร์ทสุดหรู</p>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            สัมผัสธรรมชาติในบรรยากาศสุดพิเศษ พร้อมบริการระดับพรีเมียม
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-[#C2A97E]">ลิงก์ด่วน</h4>
                        <ul className="space-y-3 text-white/70 text-sm">
                            <li>
                                <Link to="/#about" className="hover:text-[#C2A97E] transition-colors duration-300">
                                    เกี่ยวกับเรา
                                </Link>
                            </li>
                            <li>
                                <Link to="/#rooms" className="hover:text-[#C2A97E] transition-colors duration-300">
                                    ห้องพัก
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking" className="hover:text-[#C2A97E] transition-colors duration-300">
                                    จองห้อง
                                </Link>
                            </li>
                            <li>
                                <Link to="/#gallery" className="hover:text-[#C2A97E] transition-colors duration-300">
                                    แกลเลอรี่
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold mb-4 text-[#C2A97E]">บริการ</h4>
                        <ul className="space-y-3 text-white/70 text-sm">
                            <li className="flex items-center gap-2">
                                <Wifi className="w-4 h-4 text-[#C2A97E]" />
                                Wi-Fi ฟรี
                            </li>
                            <li className="flex items-center gap-2">
                                <Waves className="w-4 h-4 text-[#C2A97E]" />
                                สระว่ายน้ำ
                            </li>
                            <li className="flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-[#C2A97E]" />
                                ร้านอาหาร
                            </li>
                            <li className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#C2A97E]" />
                                สปา
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="font-bold mb-4 text-[#C2A97E]">ติดต่อเรา</h4>
                        <ul className="space-y-3 text-white/70 text-sm mb-6">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#C2A97E]" />
                                80 ธงชัย ต.ธงชัย อ.เมือง จ.เพชรบุรี
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#C2A97E]" />
                                081-234-5678
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#C2A97E]" />
                                yadahomestay@gmail.com
                            </li>
                        </ul>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#C2A97E] transition-all duration-300"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#C2A97E] transition-all duration-300"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-white/50 text-sm">
                        &copy; 2024 YadaHomestay. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
