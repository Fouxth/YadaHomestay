import { useState } from 'react';
import { Save, Home, Bell, CreditCard, Clock, Upload } from 'lucide-react';

type Tab = 'general' | 'notifications' | 'payments';

export const Settings = () => {
    const [activeTab, setActiveTab] = useState<Tab>('general');

    // Form states
    const [homestayName, setHomestayName] = useState('YadaHomestay');
    const [address, setAddress] = useState('123 หมู่ 4 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000');
    const [phone, setPhone] = useState('081-234-5678');
    const [email, setEmail] = useState('contact@yadahomestay.com');
    const [checkInTime, setCheckInTime] = useState('14:00');
    const [checkOutTime, setCheckOutTime] = useState('12:00');

    // Notification toggles
    const [notifyNewBooking, setNotifyNewBooking] = useState(true);
    const [notifyCheckIn, setNotifyCheckIn] = useState(true);
    const [notifyCheckOut, setNotifyCheckOut] = useState(true);
    const [notifyLowStock, setNotifyLowStock] = useState(true);
    const [notifyDailyReport, setNotifyDailyReport] = useState(false);

    // Payment toggles
    const [acceptCash, setAcceptCash] = useState(true);
    const [acceptCard, setAcceptCard] = useState(true);
    const [acceptTransfer, setAcceptTransfer] = useState(true);
    const [depositAmount, setDepositAmount] = useState('500');

    const tabs = [
        { key: 'general', label: 'ทั่วไป', icon: Home },
        { key: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
        { key: 'payments', label: 'การชำระเงิน', icon: CreditCard },
    ];

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-300'}`}
        >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">ตั้งค่าระบบ</h1>
                <p className="text-gray-500">จัดการการตั้งค่าโฮมสเตย์และระบบ</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
                <div className="bg-gray-100 rounded-xl p-1 inline-flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as Tab)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto">
                {activeTab === 'general' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Home className="w-5 h-5 text-gray-600" />
                            <h2 className="font-bold text-gray-800">ข้อมูลโฮมสเตย์</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อโฮมสเตย์</label>
                            <input
                                type="text"
                                value={homestayName}
                                onChange={e => setHomestayName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">📍 ที่อยู่</label>
                            <input
                                type="text"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">📞 เบอร์โทร</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">✉️ อีเมล</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> เวลา Check-in
                                </label>
                                <input
                                    type="time"
                                    value={checkInTime}
                                    onChange={e => setCheckInTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> เวลา Check-out
                                </label>
                                <input
                                    type="time"
                                    value={checkOutTime}
                                    onChange={e => setCheckOutTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Logo Section */}
                        <div className="border-t pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">🖼️</span>
                                <h3 className="font-bold text-gray-800">โลโก้และรูปภาพ</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <Home className="w-8 h-8 text-gray-400" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">
                                    <Upload className="w-4 h-4" />
                                    อัปโหลดโลโก้ใหม่
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">แนะนำขนาด 200x200 pixels</p>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <h2 className="font-bold text-gray-800">การแจ้งเตือน</h2>
                        </div>

                        {[
                            { label: 'การจองใหม่', desc: 'แจ้งเตือนเมื่อมีการจองเข้ามา', value: notifyNewBooking, onChange: setNotifyNewBooking },
                            { label: 'เตือน Check-in', desc: 'แจ้งเตือนก่อนเวลา Check-in', value: notifyCheckIn, onChange: setNotifyCheckIn },
                            { label: 'เตือน Check-out', desc: 'แจ้งเตือนก่อนเวลา Check-out', value: notifyCheckOut, onChange: setNotifyCheckOut },
                            { label: 'สินค้าใกล้หมด', desc: 'แจ้งเตือนเมื่อสินค้าในบาร์ใกล้หมด', value: notifyLowStock, onChange: setNotifyLowStock },
                            { label: 'รายงานประจำวัน', desc: 'ส่งรายงานสรุปประจำวันทางอีเมล', value: notifyDailyReport, onChange: setNotifyDailyReport },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium text-gray-800">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <Toggle enabled={item.value} onChange={item.onChange} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            <h2 className="font-bold text-gray-800">การชำระเงิน</h2>
                        </div>

                        {[
                            { label: 'รับชำระเงินสด', desc: 'อนุญาตให้ชำระด้วยเงินสด', value: acceptCash, onChange: setAcceptCash },
                            { label: 'รับชำระบัตรเครดิต/เดบิต', desc: 'อนุญาตให้ชำระด้วยบัตร', value: acceptCard, onChange: setAcceptCard },
                            { label: 'รับชำระโอน/พร้อมเพย์', desc: 'อนุญาตให้ชำระด้วยการโอนเงิน', value: acceptTransfer, onChange: setAcceptTransfer },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b">
                                <div>
                                    <p className="font-medium text-gray-800">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <Toggle enabled={item.value} onChange={item.onChange} />
                            </div>
                        ))}

                        <div className="pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ค่ามัดจำ (บาท)</label>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-sm text-gray-400 mt-2">จำนวนเงินมัดจำที่ต้องการเก็บตอน Check-in</p>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-800">
                        <Save className="w-5 h-5" />
                        บันทึกการตั้งค่า
                    </button>
                </div>
            </div>
        </div>
    );
};
