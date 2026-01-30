import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, User, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Room } from '../../types';

export const Booking = () => {
    const { getAvailableRooms, addBooking } = useData();
    const navigate = useNavigate();

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

    // Handle query param for room pre-selection (if migrated from Home page link)
    // Logic: If room is in query, we still need dates first, but we can remember the preference?
    // Current app logic: "Scroll to booking section with room pre-selected".
    // Only works if dates are selected. So ignore query for now, or use it to highlight later.

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // When dates change, update available rooms if we are on step 2
        if (dates.checkIn && dates.checkOut && step === 2) {
            const available = getAvailableRooms(dates.checkIn, dates.checkOut, guests.adults + guests.children);
            setAvailableRooms(available);
        }
    }, [dates, guests, step, getAvailableRooms]);

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
            const available = getAvailableRooms(dates.checkIn, dates.checkOut, guests.adults + guests.children);
            setAvailableRooms(available);
            setStep(2);
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

        const code = 'BK' + String(Date.now()).slice(-6); // Simple random code for now, or match logic
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
        <div className="pt-24 pb-20 px-4 min-h-screen bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">จองห้องพัก</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">เริ่มต้นการจอง<span className="text-secondary">ของคุณ</span></h2>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="flex items-center">
                            {[1, 2, 3].map((s) => (
                                <React.Fragment key={s}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-16 md:w-24 h-1 mx-2 transition-colors ${step > s ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center text-sm text-gray-500 mb-8 gap-16 md:gap-24">
                        <span className={step >= 1 ? 'text-primary font-medium' : ''}>เลือกวันที่</span>
                        <span className={step >= 2 ? 'text-primary font-medium' : ''}>เลือกห้อง</span>
                        <span className={step >= 3 ? 'text-primary font-medium' : ''}>ยืนยัน</span>
                    </div>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">วันที่เข้าพัก *</label>
                                    <input
                                        type="date"
                                        min={today}
                                        value={dates.checkIn}
                                        onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">วันที่ออก *</label>
                                    <input
                                        type="date"
                                        min={dates.checkIn ? new Date(new Date(dates.checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                                        value={dates.checkOut}
                                        onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนผู้ใหญ่ *</label>
                                    <select
                                        value={guests.adults}
                                        onChange={(e) => setGuests({ ...guests, adults: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} ท่าน</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนเด็ก</label>
                                    <select
                                        value={guests.children}
                                        onChange={(e) => setGuests({ ...guests, children: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} ท่าน</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleNextStep} className="w-full mt-8 bg-primary hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                                ถัดไป <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {availableRooms.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
                                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <img src={room.image} alt={room.name} className="w-24 h-24 object-cover rounded-lg" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-lg">{room.name}</h4>
                                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                                {room.type === 'standard' ? 'มาตรฐาน' : room.type === 'deluxe' ? 'ดีลักซ์' : 'แฟมิลี่'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                                            <User className="w-4 h-4" />{room.capacity} ท่าน | {parseAmenities(room.amenities).slice(0, 3).join(', ')}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">{nights} คืน</span>
                                                            <span className="text-xl font-bold text-primary">฿{totalPrice.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={handlePrevStep} className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <ArrowLeft className="w-5 h-5" /> ย้อนกลับ
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    disabled={!selectedRoom}
                                    className="flex-1 bg-primary hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    ถัดไป <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && selectedRoom && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <h3 className="font-bold text-lg mb-4">สรุปการจอง</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">ห้องพัก:</span><span className="font-medium">{selectedRoom.name}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">เข้าพัก:</span><span>{new Date(dates.checkIn).toLocaleDateString('th-TH')}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">ออก:</span><span>{new Date(dates.checkOut).toLocaleDateString('th-TH')}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">จำนวนคืน:</span><span>{Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24))} คืน</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">จำนวนผู้เข้าพัก:</span><span>{guests.adults} ผู้ใหญ่, {guests.children} เด็ก</span></div>
                                    <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                                        <span>ยอดรวม:</span><span className="text-primary">฿{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล *</label>
                                    <input
                                        required
                                        type="text"
                                        value={guestInfo.name}
                                        onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="ชื่อ-นามสกุลของคุณ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์ *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={guestInfo.phone}
                                        onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="0xx-xxx-xxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        value={guestInfo.email}
                                        onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
                                    <textarea
                                        value={guestInfo.note}
                                        onChange={e => setGuestInfo({ ...guestInfo, note: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        rows={2}
                                        placeholder="คำขอพิเศษ (ถ้ามี)"
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button type="button" onClick={handlePrevStep} className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-5 h-5" /> ย้อนกลับ
                                    </button>
                                    <button type="submit" className="flex-1 bg-primary hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
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
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="text-green-600 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">จองสำเร็จ!</h3>
                        <p className="text-gray-500 mb-6">เราได้รับการจองของคุณแล้ว ทีมงานจะติดต่อกลับเพื่อยืนยันการจอง</p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-gray-500 mb-1">รหัสการจอง:</p>
                            <p className="text-xl font-bold text-primary">{bookingCode}</p>
                        </div>
                        <button onClick={closeSuccess} className="w-full bg-primary hover:bg-green-800 text-white py-3 rounded-xl font-semibold">
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
