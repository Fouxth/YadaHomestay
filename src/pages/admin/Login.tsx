import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const AdminLogin = () => {
    const { login } = useData();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(username, password)) {
            navigate('/admin/dashboard');
        } else {
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-green-900 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Home className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">YadaHomestay</h1>
                    <p className="text-gray-500">ระบบจัดการหลังบ้าน</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="admin หรือ staff1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="123456"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors">
                        เข้าสู่ระบบ
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <p className="font-medium mb-2">ข้อมูลทดลอง:</p>
                    <p><span className="font-medium">เจ้าของ:</span> admin / 123456</p>
                    <p><span className="font-medium">พนักงาน:</span> staff1 / 123456</p>
                </div>

                <div className="mt-4 text-center">
                    <button onClick={() => navigate('/')} className="text-primary hover:underline text-sm flex items-center justify-center gap-1 mx-auto">
                        <ArrowLeft className="w-4 h-4" /> กลับไปหน้าเว็บ
                    </button>
                </div>
            </div>
        </div>
    );
};
