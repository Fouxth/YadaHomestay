import { useState, useEffect } from 'react';
import { Save, Home, Bell, CreditCard, Clock, Upload, CheckCircle, Plus, Trash, QrCode, Building, X } from 'lucide-react';
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
    // Payment Config
    promptPayNumber: string;
    promptPayName: string;
    promptPayQrImage: string;
    bankAccounts: BankAccount[];
}

interface BankAccount {
    id: string;
    bank: string;
    name: string;
    number: string;
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
        depositAmount: '500',
        promptPayNumber: '081-234-5678',
        promptPayName: 'ญาดาโฮมสเตย์',
        promptPayQrImage: '',
        bankAccounts: []
    });

    const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
    const [newBank, setNewBank] = useState<Partial<BankAccount>>({ bank: 'kbank', name: '', number: '' });

    const bankOptions = [
        { code: 'kbank', name: 'ธนาคารกสิกรไทย', color: 'bg-green-600' },
        { code: 'scb', name: 'ธนาคารไทยพาณิชย์', color: 'bg-purple-600' },
        { code: 'ktb', name: 'ธนาคารกรุงไทย', color: 'bg-blue-400' },
        { code: 'bbl', name: 'ธนาคารกรุงเทพ', color: 'bg-blue-800' },
        { code: 'ttb', name: 'ธนาคารทหารไทยธนชาต', color: 'bg-blue-600' },
        { code: 'gsb', name: 'ธนาคารออมสิน', color: 'bg-pink-500' },
    ];

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

                // Ensure bankAccounts is an array if it comes as string or undefined
                if (typeof settingsObj.bankAccounts === 'string') {
                    try {
                        settingsObj.bankAccounts = JSON.parse(settingsObj.bankAccounts);
                    } catch (e) {
                        settingsObj.bankAccounts = [];
                    }
                }

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

    const addBankAccount = () => {
        if (!newBank.name || !newBank.number) {
            alert('กรุณากรอกชื่อบัญชีและเลขบัญชี');
            return;
        }
        const account: BankAccount = {
            id: Date.now().toString(),
            bank: newBank.bank || 'kbank',
            name: newBank.name,
            number: newBank.number
        };
        setSettings(prev => ({ ...prev, bankAccounts: [...prev.bankAccounts, account] }));
        setNewBank({ bank: 'kbank', name: '', number: '' });
        setIsAddBankModalOpen(false);
    };

    const removeBankAccount = (id: string) => {
        setSettings(prev => ({ ...prev, bankAccounts: prev.bankAccounts.filter(acc => acc.id !== id) }));
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
                    <div className="space-y-6">
                        {/* 1. Payment Methods */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5 text-gray-600" />
                                <h2 className="font-bold text-gray-800">วิธีการชำระเงิน</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { key: 'acceptCash', label: 'เงินสด' },
                                    { key: 'acceptCard', label: 'บัตรเครดิต/เดบิต' },
                                    { key: 'acceptTransfer', label: 'โอนเงิน' },
                                    { key: 'acceptPromptPay', label: 'PromptPay' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-2">
                                        <p className="font-medium text-gray-700">{item.label}</p>
                                        <Toggle
                                            enabled={(settings as any)[item.key] !== false} // Default true
                                            onChange={(v) => updateSetting(item.key as keyof SettingsData, v)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. PromptPay Config */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <QrCode className="w-5 h-5 text-gray-600" />
                                <h2 className="font-bold text-gray-800">PromptPay / QR Code</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">หมายเลข PromptPay</label>
                                    <input
                                        type="text"
                                        value={settings.promptPayNumber || ''}
                                        onChange={e => updateSetting('promptPayNumber', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="08X-XXX-XXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อบัญชี PromptPay</label>
                                    <input
                                        type="text"
                                        value={settings.promptPayName || ''}
                                        onChange={e => updateSetting('promptPayName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="ชื่อ-นามสกุล"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">URL รูป QR Code (ถ้ามี)</label>
                                    <input
                                        type="text"
                                        value={settings.promptPayQrImage || ''}
                                        onChange={e => updateSetting('promptPayQrImage', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="https://example.com/qr-code.png"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Bank Accounts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Building className="w-5 h-5 text-gray-600" />
                                    <h2 className="font-bold text-gray-800">บัญชีธนาคาร</h2>
                                </div>
                                <button
                                    onClick={() => setIsAddBankModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
                                >
                                    <Plus className="w-4 h-4" /> เพิ่มบัญชี
                                </button>
                            </div>

                            <div className="space-y-3">
                                {settings.bankAccounts && settings.bankAccounts.length > 0 ? (
                                    settings.bankAccounts.map((acc, index) => {
                                        const bank = bankOptions.find(b => b.code === acc.bank);
                                        return (
                                            <div key={acc.id || index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-gray-50">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs ${bank?.color || 'bg-gray-400'}`}>
                                                        {acc.bank.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{acc.bank === 'scb' ? 'ธนาคารไทยพาณิชย์' : (bank?.name || acc.bank)}</p>
                                                        <p className="text-sm text-gray-500">{acc.number} - {acc.name}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeBankAccount(acc.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                        <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>ยังไม่มีบัญชีธนาคาร</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Receipt Preview */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <p className="font-bold text-gray-800">ตัวอย่างใบเสร็จ</p>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-8 max-w-sm mx-auto bg-white shadow-sm">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{settings.homestayName}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{settings.promptPayName || 'Yada Hospitality'}</p>
                                    <p className="text-xs text-gray-400 mb-1">{settings.address}</p>
                                    <p className="text-xs text-gray-400">โทร: {settings.phone}</p>
                                    <p className="text-xs text-gray-400">เลขประจำตัวผู้เสียภาษี: 1234567890123</p>
                                    <div className="my-4 border-t border-dashed border-gray-300"></div>
                                    <p className="text-xs text-gray-400 mb-2">--- ข้อมูลจะปรากฏในใบเสร็จ ---</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Bank Modal */}
                {isAddBankModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="font-bold text-gray-800">เพิ่มบัญชีธนาคาร</h3>
                                <button
                                    onClick={() => setIsAddBankModalOpen(false)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ธนาคาร</label>
                                    <select
                                        value={newBank.bank}
                                        onChange={e => setNewBank({ ...newBank, bank: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                                    >
                                        {bankOptions.map(option => (
                                            <option key={option.code} value={option.code}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อบัญชี</label>
                                    <input
                                        type="text"
                                        value={newBank.name}
                                        onChange={e => setNewBank({ ...newBank, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="เช่น นายใจดี มีตังค์"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">เลขบัญชี</label>
                                    <input
                                        type="text"
                                        value={newBank.number}
                                        onChange={e => setNewBank({ ...newBank, number: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="XXX-X-XXXXX-X"
                                    />
                                </div>
                                <button
                                    onClick={addBankAccount}
                                    className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700"
                                >
                                    + เพิ่มบัญชี
                                </button>
                            </div>
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
