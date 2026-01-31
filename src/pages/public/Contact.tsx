import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock, MessageCircle, Facebook, Instagram } from 'lucide-react';

export const Contact = () => {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSending(false);
        setSuccess(true);
        (e.target as HTMLFormElement).reset();

        setTimeout(() => setSuccess(false), 5000);
    };

    // Google Maps embed URL for Phetchaburi
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d288.06327731890286!2d99.92220940496846!3d13.128675584188482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30fd272d77c7a4e7%3A0x10c8085764cd1183!2z4LiN4Liy4LiU4Liy4LmC4Liu4Lih4Liq4LmA4LiV4Lii4LmMIHlhZGEgaG9tZSBzdGF5!5e1!3m2!1sth!2sth!4v1769802005809!5m2!1sth!2sth";

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            {/* Hero Header */}
            <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-[#2F5D50] to-[#4A7C6D]">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">ติดต่อเรา</h1>
                    <p className="text-xl text-white/80">ยินดีให้บริการและตอบทุกคำถามของคุณ</p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="px-4 -mt-8 mb-12">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC] text-center">
                        <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <MapPin className="text-[#2F5D50] w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-[#1F2933] mb-1">ที่อยู่</h3>
                        <p className="text-sm text-[#6B7280]">80 ธงชัย ต.ธงชัย อ.เมือง จ.เพชรบุรี 76000</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC] text-center">
                        <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Phone className="text-[#2F5D50] w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-[#1F2933] mb-1">โทรศัพท์</h3>
                        <p className="text-sm text-[#6B7280]">081-234-5678</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC] text-center">
                        <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-[#2F5D50] w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-[#1F2933] mb-1">อีเมล</h3>
                        <p className="text-sm text-[#6B7280]">yadahomestay@gmail.com</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC] text-center">
                        <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-[#2F5D50] w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-[#1F2933] mb-1">เวลาทำการ</h3>
                        <p className="text-sm text-[#6B7280]">08:00 - 20:00 น. ทุกวัน</p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl shadow-[#2F5D50]/5 p-8 border border-[#E5E2DC]">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageCircle className="w-6 h-6 text-[#2F5D50]" />
                                <h2 className="text-2xl font-bold text-[#1F2933]">ส่งข้อความถึงเรา</h2>
                            </div>

                            {success && (
                                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                                    ✅ ส่งข้อความสำเร็จ! เราจะติดต่อกลับเร็วๆ นี้
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2933] mb-2">ชื่อ</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                            placeholder="ชื่อของคุณ"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2933] mb-2">เบอร์โทร</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                            placeholder="081-234-5678"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">หัวข้อ</label>
                                    <select className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]">
                                        <option value="">เลือกหัวข้อ</option>
                                        <option value="booking">สอบถามการจอง</option>
                                        <option value="price">สอบถามราคา</option>
                                        <option value="group">จองกรุ๊ปใหญ่</option>
                                        <option value="other">อื่นๆ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">ข้อความ</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        rows={4}
                                        placeholder="เขียนข้อความของคุณ..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#2F5D50]/30 disabled:opacity-50"
                                >
                                    {sending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            ส่งข้อความ
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Social Links */}
                        <div className="mt-8 flex gap-4 justify-center">
                            <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#06C755] hover:bg-[#05a847] text-white rounded-xl flex items-center justify-center transition-colors">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.04 2 10.93c0 3.52 2.33 6.58 5.75 8.05l-.49 2.74c-.05.28.07.57.31.73.14.09.3.14.46.14.13 0 .27-.03.39-.1l3.23-2.1c.08 0 .15.01.23.01C17.52 20.4 22 16.36 22 10.93 22 6.04 17.52 2 12 2zm-2.5 12.5h-2v-6h2v6zm4 0h-2v-4l-1 4h-1l-1-4v4h-2v-6h2.5l.75 3 .75-3H13.5v6zm4 0h-2v-6h2v6z" /></svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl flex items-center justify-center transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-xl flex items-center justify-center transition-opacity">
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Google Maps */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl shadow-[#2F5D50]/5 p-2 border border-[#E5E2DC] overflow-hidden h-full min-h-[500px]">
                            <iframe
                                src={mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '14px', minHeight: '480px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Yada Homestay Location"
                            />
                        </div>

                        {/* Directions */}
                        <div className="mt-6 bg-gradient-to-r from-[#2F5D50] to-[#4A7C6D] rounded-2xl p-6 text-white">
                            <h3 className="font-bold text-lg mb-3">🚗 การเดินทาง</h3>
                            <ul className="space-y-2 text-white/90 text-sm">
                                <li>• จากกรุงเทพฯ ใช้เวลาประมาณ 2 ชั่วโมง ตามเส้นทางหลวงหมายเลข 4</li>
                                <li>• จากสนามบินสุวรรณภูมิ ประมาณ 3 ชั่วโมง</li>
                                <li>• มีที่จอดรถฟรีสำหรับแขกผู้เข้าพัก</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
