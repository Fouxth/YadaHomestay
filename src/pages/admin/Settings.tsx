import { useState, useEffect } from 'react';
import { Save, Home, Bell, CreditCard, Clock, Upload, CheckCircle } from 'lucide-react';
import { settingsAPI } from '../../services/api';

type Tab = 'general' | 'notifications' | 'payments';

interface SettingsData {
    homestayName: string;
    address: string;
    phone: string;
    email: string;
    checkInTime: string;
    checkOutTime: string;
    notifyNewBooking: boolean;
    notifyCheckIn: boolean;
    notifyCheckOut: boolean;
    notifyLowStock: boolean;
    notifyDailyReport: boolean;
    acceptCash: boolean;
    acceptCard: boolean;
    acceptTransfer: boolean;
    depositAmount: string;
}

export const Settings = () => {
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form states
    const [settings, setSettings] = useState<SettingsData>({
        homestayName: 'YadaHomestay',
        address: '123 หมู่ 4 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000',
        phone: '081-234-5678',
        email: 'contact@yadahomestay.com',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        notifyNewBooking: true,
        notifyCheckIn: true,
        notifyCheckOut: true,
        notifyLowStock: true,
        notifyDailyReport: false,
        acceptCash: true,
        acceptCard: true,
        acceptTransfer: true,
        depositAmount: '500'
    });

    // Load settings from API
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsAPI.getAll();
            // Convert array of settings to object
            if (Array.isArray(data)) {
                const settingsObj: any = {};
                data.forEach((item: { key: string; value: any }) => {
                    settingsObj[item.key] = item.value;
                });
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Save each setting individually
            const settingsToSave = Object.entries(settings);
            for (const [key, value] of settingsToSave) {
                await settingsAPI.update(key, value);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: keyof SettingsData, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

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
                                value={settings.homestayName}
                                onChange={e => updateSetting('homestayName', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">📍 ที่อยู่</label>
                            <input
                                type="text"
                                value={settings.address}
                                onChange={e => updateSetting('address', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">📞 เบอร์โทร</label>
                                <input
                                    type="text"
                                    value={settings.phone}
                                    onChange={e => updateSetting('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">✉️ อีเมล</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={e => updateSetting('email', e.target.value)}
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
                                    value={settings.checkInTime}
                                    onChange={e => updateSetting('checkInTime', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> เวลา Check-out
                                </label>
                                <input
                                    type="time"
                                    value={settings.checkOutTime}
                                    onChange={e => updateSetting('checkOutTime', e.target.value)}
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
                            { key: 'notifyNewBooking', label: 'การจองใหม่', desc: 'แจ้งเตือนเมื่อมีการจองเข้ามา' },
                            { key: 'notifyCheckIn', label: 'เตือน Check-in', desc: 'แจ้งเตือนก่อนเวลา Check-in' },
                            { key: 'notifyCheckOut', label: 'เตือน Check-out', desc: 'แจ้งเตือนก่อนเวลา Check-out' },
                            { key: 'notifyLowStock', label: 'สินค้าใกล้หมด', desc: 'แจ้งเตือนเมื่อสินค้าในบาร์ใกล้หมด' },
                            { key: 'notifyDailyReport', label: 'รายงานประจำวัน', desc: 'ส่งรายงานสรุปประจำวันทางอีเมล' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium text-gray-800">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <Toggle
                                    enabled={settings[item.key as keyof SettingsData] as boolean}
                                    onChange={(v) => updateSetting(item.key as keyof SettingsData, v)}
                                />
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
                            { key: 'acceptCash', label: 'รับชำระเงินสด', desc: 'อนุญาตให้ชำระด้วยเงินสด' },
                            { key: 'acceptCard', label: 'รับชำระบัตรเครดิต/เดบิต', desc: 'อนุญาตให้ชำระด้วยบัตร' },
                            { key: 'acceptTransfer', label: 'รับชำระโอน/พร้อมเพย์', desc: 'อนุญาตให้ชำระด้วยการโอนเงิน' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between py-3 border-b">
                                <div>
                                    <p className="font-medium text-gray-800">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <Toggle
                                    enabled={settings[item.key as keyof SettingsData] as boolean}
                                    onChange={(v) => updateSetting(item.key as keyof SettingsData, v)}
                                />
                            </div>
                        ))}

                        <div className="pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ค่ามัดจำ (บาท)</label>
                            <input
                                type="number"
                                value={settings.depositAmount}
                                onChange={e => updateSetting('depositAmount', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-sm text-gray-400 mt-2">จำนวนเงินมัดจำที่ต้องการเก็บตอน Check-in</p>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50"
                    >
                        {saved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                บันทึกสำเร็จ!
                            </>
                        ) : saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                บันทึกการตั้งค่า
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
