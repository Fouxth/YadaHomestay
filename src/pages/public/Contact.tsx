import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export const Contact = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('ส่งข้อความสำเร็จ เราจะติดต่อกลับเร็วๆ นี้');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section className="py-20 px-4 min-h-screen pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="animate-in slide-in-from-left duration-500">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">ติดต่อเรา</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-6">มีคำถาม?<br /><span className="text-secondary">ติดต่อเราได้เลย</span></h2>
                        <p className="text-gray-600 mb-8">เรายินดีให้บริการและตอบคำถามของคุณทุกวัน ตั้งแต่เวลา 8:00 - 20:00 น.</p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">ที่อยู่</p>
                                    <p className="text-gray-500">123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Phone className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">โทรศัพท์</p>
                                    <p className="text-gray-500">081-234-5678</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Mail className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">อีเมล</p>
                                    <p className="text-gray-500">contact@yadahomestay.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-in slide-in-from-right duration-500">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อของคุณ</label>
                                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="ชื่อ-นามสกุล" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                                    <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="your@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
                                    <textarea className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" rows={4} placeholder="เขียนข้อความของคุณ..."></textarea>
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" /> ส่งข้อความ
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
