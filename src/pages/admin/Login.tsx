import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Hotel } from 'lucide-react';

export const AdminLogin = () => {
    const { login } = useData();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/admin/dashboard');
            } else {
                setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-slate-800"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-success rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                            <Hotel className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">YadaHomestay</h1>
                        <p className="text-white/70 text-lg max-w-md">
                            ระบบจัดการรีสอร์ทครบวงจร สำหรับพนักงานและเจ้าของ
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white/60">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <span className="text-sm">01</span>
                            </div>
                            <span>จัดการห้องพักและการจอง</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <span className="text-sm">02</span>
                            </div>
                            <span>ระบบ POS และมินิบาร์</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <span className="text-sm">03</span>
                            </div>
                            <span>รายงานและสถิติ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Hotel className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">YadaHomestay</h1>
                        <p className="text-text-muted">ระบบจัดการหลังบ้าน</p>
                    </div>

                    <div className="card p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-text-primary">เข้าสู่ระบบ</h2>
                            <p className="text-sm text-text-muted mt-1">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                                <p className="text-sm text-danger">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    ชื่อผู้ใช้
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input"
                                    placeholder="กรอกชื่อผู้ใช้"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    รหัสผ่าน
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input pr-10"
                                        placeholder="กรอกรหัสผ่าน"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'เข้าสู่ระบบ'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-border">
                            <p className="text-xs text-text-muted mb-3">ข้อมูลทดลอง:</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between p-2 bg-surface-hover rounded-lg">
                                    <span className="text-text-secondary">เจ้าของ</span>
                                    <span className="font-medium text-text-primary">admin / admin123</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-surface-hover rounded-lg">
                                    <span className="text-text-secondary">พนักงาน</span>
                                    <span className="font-medium text-text-primary">staff1 / 123456</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับไปหน้าเว็บ
                    </button>
                </div>
            </div>
        </div>
    );
};
