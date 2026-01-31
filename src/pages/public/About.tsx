import { MapPin, Heart, Leaf, Users, Award, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
    const values = [
        { icon: Heart, title: 'ความใส่ใจ', desc: 'เราดูแลแขกทุกท่านเหมือนคนในครอบครัว' },
        { icon: Leaf, title: 'ธรรมชาติ', desc: 'อยู่ท่ามกลางธรรมชาติที่สงบและร่มรื่น' },
        { icon: Coffee, title: 'ความสะดวกสบาย', desc: 'สิ่งอำนวยความสะดวกครบครัน ตอบโจทย์ทุกความต้องการ' },
        { icon: Users, title: 'ชุมชน', desc: 'สนับสนุนชุมชนท้องถิ่นและวัฒนธรรมไทย' },
    ];

    const milestones = [
        { year: '2561', event: 'ก่อตั้ง Yada Homestay ด้วยห้องพัก 4 ห้องแรก' },
        { year: '2563', event: 'ขยายเป็น 8 ห้องพัก พร้อมบาร์และร้านอาหาร' },
        { year: '2565', event: 'ได้รับรางวัล Eco-Friendly Resort' },
        { year: '2567', event: 'พัฒนาระบบจองออนไลน์และบริการใหม่' },
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2F5D50] to-[#4A7C6D]" />
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'url("/images/rooms/deluxe.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">เกี่ยวกับเรา</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                        บ้านพักที่สร้างด้วยหัวใจ เพื่อการพักผ่อนที่แท้จริง
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-[#C2A97E]/20 text-[#C2A97E] rounded-full text-sm font-medium mb-4">
                            เรื่องราวของเรา
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933]">จุดเริ่มต้นของ Yada Homestay</h2>
                    </div>

                    <div className="prose prose-lg max-w-none text-[#4B5563] leading-relaxed">
                        <p className="text-lg">
                            <strong className="text-[#2F5D50]">Yada Homestay</strong> ถือกำเนิดขึ้นจากความรักในธรรมชาติและความปรารถนาที่จะแบ่งปันความสงบสุขให้กับผู้คน
                            จากความหลงใหลในการต้อนรับแขก และความมุ่งมั่นที่จะสร้างสถานที่พักผ่อนที่แท้จริง
                        </p>
                        <p>
                            เราเริ่มต้นจากบ้านไม้หลังเล็กๆ ที่รายล้อมด้วยต้นไม้ใหญ่ ค่อยๆ พัฒนาขึ้นมาเป็นรีสอร์ทบูติกที่ยังคงรักษาความเรียบง่าย อบอุ่น และใกล้ชิดธรรมชาติ
                            ทุกห้องพักถูกออกแบบด้วยความใส่ใจในทุกรายละเอียด เพื่อให้แขกทุกท่านรู้สึกเหมือนกลับบ้าน
                        </p>
                        <p>
                            วันนี้ Yada Homestay ยินดีต้อนรับแขกจากทั่วทุกมุมโลก ด้วยบริการที่อบอุ่น ห้องพักที่สะอาดสะอ้าน
                            และประสบการณ์ที่คุณจะจดจำไปอีกนาน
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-[#2F5D50]/10 text-[#2F5D50] rounded-full text-sm font-medium mb-4">
                            คุณค่าของเรา
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933]">สิ่งที่เราให้ความสำคัญ</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="w-20 h-20 bg-[#2F5D50]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2F5D50] transition-colors duration-300">
                                    <value.icon className="w-10 h-10 text-[#2F5D50] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F2933] mb-3">{value.title}</h3>
                                <p className="text-[#6B7280]">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-[#C2A97E]/20 text-[#C2A97E] rounded-full text-sm font-medium mb-4">
                            เส้นทางของเรา
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933]">เหตุการณ์สำคัญ</h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#E5E2DC]" />
                        {milestones.map((item, idx) => (
                            <div key={idx} className={`relative flex items-center mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#2F5D50]/5 border border-[#E5E2DC]">
                                        <span className="text-3xl font-bold text-[#C2A97E]">{item.year}</span>
                                        <p className="text-[#1F2933] mt-2">{item.event}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2F5D50] rounded-full border-4 border-white shadow" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-[#2F5D50] to-[#4A7C6D]">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <Award className="w-16 h-16 mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">พร้อมที่จะสัมผัสประสบการณ์?</h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        มาเป็นส่วนหนึ่งของครอบครัว Yada Homestay และสร้างความทรงจำดีๆ ร่วมกัน
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/booking"
                            className="inline-flex items-center justify-center gap-2 bg-white text-[#2F5D50] px-8 py-4 rounded-xl font-semibold hover:bg-[#C2A97E] hover:text-white transition-colors duration-300"
                        >
                            จองห้องพัก
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-300"
                        >
                            <MapPin className="w-5 h-5" />
                            ติดต่อเรา
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
