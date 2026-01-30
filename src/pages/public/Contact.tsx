import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export const Contact = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('ส่งข้อความสำเร็จ เราจะติดต่อกลับเร็วๆ นี้');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section className="py-20 px-4 min-h-screen pt-24 bg-[#FAF9F6]">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="animate-in slide-in-from-left duration-500">
                        <span className="text-[#2F5D50] font-semibold text-sm uppercase tracking-wider">ติดต่อเรา</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-2 mb-6">
                            มีคำถาม?
                            <br />
                            <span className="text-[#C2A97E]">ติดต่อเราได้เลย</span>
                        </h2>
                        <p className="text-[#6B7280] mb-8">
                            เรายินดีให้บริการและตอบคำถามของคุณทุกวัน ตั้งแต่เวลา 8:00 - 20:00 น.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="text-[#2F5D50] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#1F2933]">ที่อยู่</p>
                                    <p className="text-[#6B7280]">80 ธงชัย ต.ธงชัย อ.เมือง จ.เพชรบุรี 76000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center">
                                    <Phone className="text-[#2F5D50] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#1F2933]">โทรศัพท์</p>
                                    <p className="text-[#6B7280]">081-234-5678</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center">
                                    <Mail className="text-[#2F5D50] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#1F2933]">อีเมล</p>
                                    <p className="text-[#6B7280]">yadahomestay@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-in slide-in-from-right duration-500">
                        <div className="bg-white rounded-2xl shadow-xl shadow-[#2F5D50]/5 p-8 border border-[#E5E2DC]">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">
                                        ชื่อของคุณ
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        placeholder="ชื่อ-นามสกุล"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">
                                        อีเมล
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">
                                        ข้อความ
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        rows={4}
                                        placeholder="เขียนข้อความของคุณ..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#2F5D50]/30"
                                >
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
