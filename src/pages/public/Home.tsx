import { useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { CalendarCheck, Bed, Star, Award, ChevronDown, MapPin, Phone, Mail, Send } from 'lucide-react';

export const Home = () => {
    const { rooms } = useData();
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Helper to parse amenities (can be string or array)
    const parseAmenities = (amenities: string | string[]): string[] => {
        if (Array.isArray(amenities)) return amenities;
        if (typeof amenities === 'string') return amenities.split(',').map(a => a.trim());
        return [];
    };

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal').forEach(el => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, [rooms]); // Re-run when rooms load

    return (
        <div className="bg-[#FAF9F6]">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 ken-burns bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')" }}
                />
                {/* Gradient Overlay - Natural Green */}
                <div
                    className="absolute inset-0 z-[1]"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(47, 93, 80, 0.75) 0%, rgba(47, 93, 80, 0.45) 50%, rgba(47, 93, 80, 0.70) 100%)'
                    }}
                />

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <div className="mb-6 animate-fade-in">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/20">
                            ยินดีต้อนรับสู่ YadaHomestay
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
                        สัมผัสธรรมชาติ
                        <br />
                        <span className="text-[#C2A97E]">ในบรรยากาศสุดพิเศษ</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        พักผ่อนในห้องพักสุดหรูที่รายล้อมไปด้วยธรรมชาติ บริการระดับพรีเมียม พร้อมสิ่งอำนวยความสะดวกครบครัน
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            to="/booking"
                            className="bg-[#2F5D50] hover:bg-[#4A7C6D] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#2F5D50]/30 flex items-center justify-center gap-2 border border-white/20"
                        >
                            <CalendarCheck className="w-5 h-5" />
                            จองห้องพักเลย
                        </Link>
                        <a
                            href="#rooms"
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-white/30"
                        >
                            <Bed className="w-5 h-5" />
                            ดูห้องพัก
                        </a>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal">
                            <span className="text-[#2F5D50] font-semibold text-sm uppercase tracking-wider">เกี่ยวกับเรา</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-2 mb-6">
                                YadaHomestay
                                <br />
                                <span className="text-[#C2A97E]">ที่พักในฝันของคุณ</span>
                            </h2>
                            <p className="text-[#6B7280] mb-6 leading-relaxed">
                                YadaHomestay เป็นรีสอร์ทที่ตั้งอยู่ท่ามกลางธรรมชาติอันแสนสงบ เรามุ่งมั่นที่จะมอบประสบการณ์การพักผ่อนที่ดีที่สุดให้กับแขกทุกท่าน ด้วยห้องพักที่ออกแบบอย่างประณีต พร้อมสิ่งอำนวยความสะดวกครบครัน
                            </p>
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-4 bg-white rounded-2xl shadow-lg shadow-[#2F5D50]/5">
                                    <div className="w-16 h-16 bg-[#2F5D50]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Bed className="text-[#2F5D50] w-8 h-8" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#1F2933]">8</p>
                                    <p className="text-sm text-[#6B7280]">ห้องพัก</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-2xl shadow-lg shadow-[#2F5D50]/5">
                                    <div className="w-16 h-16 bg-[#C2A97E]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Award className="text-[#C2A97E] w-8 h-8" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#1F2933]">500+</p>
                                    <p className="text-sm text-[#6B7280]">ลูกค้า</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-2xl shadow-lg shadow-[#2F5D50]/5">
                                    <div className="w-16 h-16 bg-[#C2A97E]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Star className="text-[#C2A97E] w-8 h-8" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#1F2933]">4.9</p>
                                    <p className="text-sm text-[#6B7280]">คะแนน</p>
                                </div>
                            </div>
                        </div>
                        <div className="scroll-reveal relative">
                            <img
                                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
                                alt="Resort"
                                className="rounded-3xl shadow-2xl w-full"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#2F5D50] rounded-full flex items-center justify-center">
                                        <Award className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1F2933]">รางวัลคุณภาพ</p>
                                        <p className="text-sm text-[#6B7280]">มาตรฐาน 5 ดาว</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section id="rooms" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 scroll-reveal">
                        <span className="text-[#2F5D50] font-semibold text-sm uppercase tracking-wider">ห้องพักของเรา</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-2">
                            เลือกห้องพักที่ใช่
                            <span className="text-[#C2A97E]">สำหรับคุณ</span>
                        </h2>
                        <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto">
                            ห้องพักหลากหลายสไตล์ให้เลือกสรร ตั้งแต่ห้องมาตรฐานไปจนถึงห้องแฟมิลี่สุดหรู
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.length > 0 ? rooms.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-2xl shadow-lg shadow-[#2F5D50]/5 overflow-hidden card-hover scroll-reveal group border border-[#E5E2DC]"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-[#1F2933]">
                                            {room.type === 'standard' ? 'มาตรฐาน' : room.type === 'deluxe' ? 'ดีลักซ์' : 'แฟมิลี่'}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Link
                                            to={`/booking?room=${room.id}`}
                                            className="bg-[#2F5D50] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#4A7C6D] transition-all duration-300"
                                        >
                                            จองเลย
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-[#1F2933] mb-2">{room.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {parseAmenities(room.amenities).slice(0, 4).map((a, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-[#FAF9F6] rounded-lg text-xs text-[#6B7280] border border-[#E5E2DC]"
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-[#C2A97E]">
                                                ฿{room.pricePerNight.toLocaleString()}
                                            </span>
                                            <span className="text-[#6B7280] text-sm">/คืน</span>
                                        </div>
                                        <div className="text-sm text-[#6B7280] flex items-center gap-1">
                                            <Bed className="w-4 h-4" />{room.capacity} ท่าน
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="text-center col-span-full text-[#6B7280]">Loading rooms...</p>}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-20 px-4 bg-[#FAF9F6]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 scroll-reveal">
                        <span className="text-[#2F5D50] font-semibold text-sm uppercase tracking-wider">แกลเลอรี่</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-2">
                            บรรยากาศ
                            <span className="text-[#C2A97E]"> YadaHomestay</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-2xl overflow-hidden aspect-square scroll-reveal group">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                                alt="Gallery 1"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden aspect-square scroll-reveal row-span-2 group">
                            <img
                                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
                                alt="Gallery 2"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden aspect-square scroll-reveal group">
                            <img
                                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"
                                alt="Gallery 3"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden aspect-square scroll-reveal group">
                            <img
                                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600"
                                alt="Gallery 4"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden aspect-square scroll-reveal group">
                            <img
                                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
                                alt="Gallery 5"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden aspect-square scroll-reveal col-span-2 group">
                            <img
                                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
                                alt="Gallery 6"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 scroll-reveal">
                        <span className="text-[#2F5D50] font-semibold text-sm uppercase tracking-wider">รีวิวจากลูกค้า</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-2">
                            เสียงตอบรับ
                            <span className="text-[#C2A97E]">จากแขกของเรา</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#FAF9F6] rounded-2xl p-8 scroll-reveal border border-[#E5E2DC]">
                            <div className="flex items-center gap-1 text-[#C2A97E] mb-4">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-[#6B7280] mb-6 leading-relaxed">
                                "บรรยากาศดีมาก ห้องพักสะอาด พนักงานบริการดีเยี่ยม จะกลับมาพักอีกแน่นอน!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#2F5D50] rounded-full flex items-center justify-center text-white font-bold">
                                    ส
                                </div>
                                <div>
                                    <p className="font-medium text-[#1F2933]">สมชาย ใจดี</p>
                                    <p className="text-sm text-[#6B7280]">พักห้องดีลักซ์</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FAF9F6] rounded-2xl p-8 scroll-reveal border border-[#E5E2DC]">
                            <div className="flex items-center gap-1 text-[#C2A97E] mb-4">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-[#6B7280] mb-6 leading-relaxed">
                                "พาเด็กๆ มาพักครอบครัว ห้องแฟมิลี่กว้างขวางดีมาก มีกิจกรรมให้ทำเยอะ"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#C2A97E] rounded-full flex items-center justify-center text-white font-bold">
                                    น
                                </div>
                                <div>
                                    <p className="font-medium text-[#1F2933]">นภา สวยงาม</p>
                                    <p className="text-sm text-[#6B7280]">พักห้องแฟมิลี่</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FAF9F6] rounded-2xl p-8 scroll-reveal border border-[#E5E2DC]">
                            <div className="flex items-center gap-1 text-[#C2A97E] mb-4">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-[#6B7280] mb-6 leading-relaxed">
                                "วิวสวย อาหารอร่อย การจองผ่านเว็บก็สะดวกมาก แนะนำเลยค่ะ"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#C2A97E] rounded-full flex items-center justify-center text-white font-bold">
                                    ม
                                </div>
                                <div>
                                    <p className="font-medium text-[#1F2933]">มานี มีนา</p>
                                    <p className="text-sm text-[#6B7280]">พักห้องมาตรฐาน</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 bg-[#FAF9F6]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="scroll-reveal">
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
                        <div className="scroll-reveal">
                            <div className="bg-white rounded-2xl shadow-xl shadow-[#2F5D50]/5 p-8 border border-[#E5E2DC]">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); alert('ส่งข้อความสำเร็จ!'); }}
                                    className="space-y-4"
                                >
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
        </div>
    );
};
