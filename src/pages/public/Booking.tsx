import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarCheck, User, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Room } from '../../types';

export const Booking = () => {
    const { getAvailableRooms, addBooking } = useData();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get pre-selected room ID from URL query parameter
    const preselectedRoomId = searchParams.get('room');

    const [step, setStep] = useState(1);
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [guests, setGuests] = useState({ adults: 2, children: 0 });
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', email: '', note: '' });
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingCode, setBookingCode] = useState('');

    // Helper to parse amenities (can be string or array)
    const parseAmenities = (amenities: string | string[]): string[] => {
        if (Array.isArray(amenities)) return amenities;
        if (typeof amenities === 'string') return amenities.split(',').map(a => a.trim());
        return [];
    };

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // When dates change, update available rooms if we are on step 2
        if (dates.checkIn && dates.checkOut && step === 2) {
            getAvailableRooms(dates.checkIn, dates.checkOut, guests.adults + guests.children)
                .then(available => {
                    setAvailableRooms(available);

                    // Auto-select preselected room if it exists and is available
                    if (preselectedRoomId && !selectedRoom) {
                        const preselected = available.find(r => r.id === preselectedRoomId);
                        if (preselected) {
                            setSelectedRoom(preselected);
                        }
                    }
                });
        }
    }, [dates, guests, step, getAvailableRooms, preselectedRoomId, selectedRoom]);

    const handleNextStep = () => {
        if (step === 1) {
            if (!dates.checkIn || !dates.checkOut) {
                alert('กรุณาเลือกวันที่เข้าพักและวันที่ออก');
                return;
            }
            if (new Date(dates.checkIn) >= new Date(dates.checkOut)) {
                alert('วันที่ออกต้องมากกว่าวันที่เข้าพัก');
                return;
            }
            getAvailableRooms(dates.checkIn, dates.checkOut, guests.adults + guests.children)
                .then(available => {
                    setAvailableRooms(available);

                    // Auto-select preselected room if available
                    if (preselectedRoomId) {
                        const preselected = available.find(r => r.id === preselectedRoomId);
                        if (preselected) {
                            setSelectedRoom(preselected);
                        }
                    }

                    setStep(2);
                });
        } else if (step === 2) {
            if (!selectedRoom) {
                alert('กรุณาเลือกห้องพัก');
                return;
            }
            setStep(3);
        }
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom) return;

        const code = 'BK' + String(Date.now()).slice(-6);
        const nights = Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24));

        const newBooking = {
            id: Date.now().toString(),
            bookingCode: code,
            guestName: guestInfo.name,
            guestPhone: guestInfo.phone,
            guestEmail: guestInfo.email,
            guestNote: guestInfo.note,
            roomId: selectedRoom.id,
            roomNumber: selectedRoom.number,
            roomName: selectedRoom.name,
            checkInDate: dates.checkIn,
            checkOutDate: dates.checkOut,
            nights,
            adults: guests.adults,
            children: guests.children,
            status: 'pending' as const,
            paymentStatus: 'pending' as const,
            roomPrice: selectedRoom.pricePerNight,
            totalAmount: selectedRoom.pricePerNight * nights,
            paidAmount: 0,
            createdAt: new Date().toISOString()
        };

        addBooking(newBooking);
        setBookingCode(code);
        setShowSuccess(true);
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        navigate('/');
    };

    const calculateTotal = () => {
        if (!selectedRoom || !dates.checkIn || !dates.checkOut) return 0;
        const nights = Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24));
        return selectedRoom.pricePerNight * nights;
    };

    return (
        <div className="pt-24 pb-20 px-4 min-h-screen bg-[#FAF9F6]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[#2F5D50] font-semibold text-sm uppercase tracking-wider">จองห้องพัก</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-2">
                        เริ่มต้นการจอง
                        <span className="text-[#C2A97E]">ของคุณ</span>
                    </h2>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-[#2F5D50]/5 p-6 md:p-10 border border-[#E5E2DC]">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="flex items-center">
                            {[1, 2, 3].map((s) => (
                                <React.Fragment key={s}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-all duration-300 ${step >= s
                                        ? 'bg-[#2F5D50] text-white shadow-lg shadow-[#2F5D50]/30'
                                        : 'bg-[#E5E2DC] text-[#6B7280]'
                                        }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-16 md:w-24 h-1 mx-2 transition-all duration-300 ${step > s ? 'bg-[#2F5D50]' : 'bg-[#E5E2DC]'
                                            }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center text-sm text-[#6B7280] mb-8 gap-16 md:gap-24">
                        <span className={step >= 1 ? 'text-[#2F5D50] font-medium' : ''}>เลือกวันที่</span>
                        <span className={step >= 2 ? 'text-[#2F5D50] font-medium' : ''}>เลือกห้อง</span>
                        <span className={step >= 3 ? 'text-[#2F5D50] font-medium' : ''}>ยืนยัน</span>
                    </div>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">วันที่เข้าพัก *</label>
                                    <input
                                        type="date"
                                        min={today}
                                        value={dates.checkIn}
                                        onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">วันที่ออก *</label>
                                    <input
                                        type="date"
                                        min={dates.checkIn ? new Date(new Date(dates.checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                                        value={dates.checkOut}
                                        onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">จำนวนผู้ใหญ่ *</label>
                                    <select
                                        value={guests.adults}
                                        onChange={(e) => setGuests({ ...guests, adults: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} ท่าน</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">จำนวนเด็ก</label>
                                    <select
                                        value={guests.children}
                                        onChange={(e) => setGuests({ ...guests, children: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                    >
                                        {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} ท่าน</option>)}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleNextStep}
                                className="w-full mt-8 bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#2F5D50]/30"
                            >
                                ถัดไป <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {availableRooms.length === 0 ? (
                                    <div className="text-center py-12 text-[#6B7280]">
                                        <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-[#E5E2DC]" />
                                        <p>ไม่มีห้องว่างในช่วงวันที่เลือก</p>
                                        <p className="text-sm">กรุณาเลือกวันอื่นหรือติดต่อเรา</p>
                                    </div>
                                ) : (
                                    availableRooms.map(room => {
                                        const nights = Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24));
                                        const totalPrice = room.pricePerNight * nights;
                                        const isSelected = selectedRoom?.id === room.id;

                                        return (
                                            <div
                                                key={room.id}
                                                onClick={() => setSelectedRoom(room)}
                                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${isSelected
                                                    ? 'border-[#2F5D50] bg-[#2F5D50]/5 shadow-md'
                                                    : 'border-[#E5E2DC] hover:border-[#2F5D50]/50 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <img src={room.image} alt={room.name} className="w-24 h-24 object-cover rounded-lg" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-lg text-[#1F2933]">{room.name}</h4>
                                                            <span className="px-2 py-1 bg-[#FAF9F6] rounded text-xs text-[#6B7280] border border-[#E5E2DC]">
                                                                {room.type === 'standard' ? 'มาตรฐาน' : room.type === 'deluxe' ? 'ดีลักซ์' : 'แฟมิลี่'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-2">
                                                            <User className="w-4 h-4" />{room.capacity} ท่าน | {parseAmenities(room.amenities).slice(0, 3).join(', ')}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-[#6B7280]">{nights} คืน</span>
                                                            <span className="text-xl font-bold text-[#C2A97E]">฿{totalPrice.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-[#2F5D50] bg-[#2F5D50]' : 'border-[#E5E2DC]'
                                                        }`}>
                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handlePrevStep}
                                    className="flex-1 border-2 border-[#E5E2DC] text-[#6B7280] py-4 rounded-xl font-semibold hover:border-[#2F5D50] hover:text-[#2F5D50] transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" /> ย้อนกลับ
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    disabled={!selectedRoom}
                                    className="flex-1 bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#2F5D50]/30"
                                >
                                    ถัดไป <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && selectedRoom && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-[#FAF9F6] rounded-xl p-6 mb-6 border border-[#E5E2DC]">
                                <h3 className="font-bold text-lg mb-4 text-[#1F2933]">สรุปการจอง</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">ห้องพัก:</span>
                                        <span className="font-medium text-[#1F2933]">{selectedRoom.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">เข้าพัก:</span>
                                        <span className="text-[#1F2933]">{new Date(dates.checkIn).toLocaleDateString('th-TH')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">ออก:</span>
                                        <span className="text-[#1F2933]">{new Date(dates.checkOut).toLocaleDateString('th-TH')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">จำนวนคืน:</span>
                                        <span className="text-[#1F2933]">{Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24))} คืน</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">จำนวนผู้เข้าพัก:</span>
                                        <span className="text-[#1F2933]">{guests.adults} ผู้ใหญ่, {guests.children} เด็ก</span>
                                    </div>
                                    <div className="border-t border-[#E5E2DC] pt-2 mt-2 flex justify-between text-lg font-bold">
                                        <span className="text-[#1F2933]">ยอดรวม:</span>
                                        <span className="text-[#C2A97E]">฿{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">ชื่อ-นามสกุล *</label>
                                    <input
                                        required
                                        type="text"
                                        value={guestInfo.name}
                                        onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        placeholder="ชื่อ-นามสกุลของคุณ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">เบอร์โทรศัพท์ *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={guestInfo.phone}
                                        onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        placeholder="0xx-xxx-xxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        value={guestInfo.email}
                                        onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2933] mb-2">หมายเหตุ</label>
                                    <textarea
                                        value={guestInfo.note}
                                        onChange={e => setGuestInfo({ ...guestInfo, note: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E5E2DC] rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all bg-[#FAF9F6]"
                                        rows={2}
                                        placeholder="คำขอพิเศษ (ถ้ามี)"
                                    />
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="flex-1 border-2 border-[#E5E2DC] text-[#6B7280] py-4 rounded-xl font-semibold hover:border-[#2F5D50] hover:text-[#2F5D50] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" /> ย้อนกลับ
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#2F5D50]/30"
                                    >
                                        <Check className="w-5 h-5" /> ยืนยันการจอง
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-[#E5E2DC]">
                        <div className="w-20 h-20 bg-[#2F5D50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="text-[#2F5D50] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1F2933] mb-2">จองสำเร็จ!</h3>
                        <p className="text-[#6B7280] mb-6">เราได้รับการจองของคุณแล้ว ทีมงานจะติดต่อกลับเพื่อยืนยันการจอง</p>
                        <div className="bg-[#FAF9F6] rounded-xl p-4 mb-6 text-left border border-[#E5E2DC]">
                            <p className="text-sm text-[#6B7280] mb-1">รหัสการจอง:</p>
                            <p className="text-xl font-bold text-[#C2A97E]">{bookingCode}</p>
                        </div>
                        <button
                            onClick={closeSuccess}
                            className="w-full bg-[#2F5D50] hover:bg-[#4A7C6D] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#2F5D50]/30"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
