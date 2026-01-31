import { useState, useEffect } from 'react';
import { Wine, ShoppingCart, Plus, Minus, Trash, Receipt, Search, XCircle, Printer, CreditCard, Banknote, Smartphone, CheckCircle, Clock, QrCode, Building } from 'lucide-react';
import { productsAPI, ordersAPI, settingsAPI } from '../../services/api';
import { generateOrderReceipt } from '../../utils/exportUtils';
import { QRCodeCanvas } from 'qrcode.react';
// @ts-ignore
import generatePayload from 'promptpay-qr';
import type { OrderReceiptData } from '../../utils/exportUtils';
import { useData } from '../../context/DataContext';

interface Product {
    id: string;
    code: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    unit: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export const Bar = () => {
    const { currentUser } = useData();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isPromptPayModalOpen, setIsPromptPayModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [currentOrder, setCurrentOrder] = useState<OrderReceiptData | null>(null);
    const [promptPayNumber, setPromptPayNumber] = useState('');
    const [promptPayName, setPromptPayName] = useState('');
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [qrTimer, setQrTimer] = useState(300); // 5 minutes

    const categories = ['ทั้งหมด', 'เครื่องดื่ม', 'แอลกอฮอล์', 'ของว่าง', 'อื่นๆ'];

    useEffect(() => {
        loadProducts();
        loadSettings();
    }, []);

    // Timer logic for PromptPay Modal
    useEffect(() => {
        let interval: any;
        if (isPromptPayModalOpen && qrTimer > 0) {
            interval = setInterval(() => {
                setQrTimer((prev) => prev - 1);
            }, 1000);
        } else if (!isPromptPayModalOpen) {
            setQrTimer(300); // Reset
        }
        return () => clearInterval(interval);
    }, [isPromptPayModalOpen, qrTimer]);

    const loadSettings = async () => {
        try {
            const data = await settingsAPI.getAll();
            if (Array.isArray(data)) {
                const ppNumber = data.find((s: any) => s.key === 'promptPayNumber');
                if (ppNumber) setPromptPayNumber(ppNumber.value);

                const ppName = data.find((s: any) => s.key === 'promptPayName');
                if (ppName) setPromptPayName(ppName.value);

                const banks = data.find((s: any) => s.key === 'bankAccounts');
                if (banks) {
                    try {
                        setBankAccounts(JSON.parse(banks.value));
                    } catch (e) {
                        console.error('Failed to parse bank accounts', e);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const getBankDetails = (code: string) => {
        switch (code) {
            case 'kbank': return { name: 'ธนาคารกสิกรไทย', color: 'bg-[#00A950]', text: 'text-[#00A950]' };
            case 'scb': return { name: 'ธนาคารไทยพาณิชย์', color: 'bg-[#4E2A84]', text: 'text-[#4E2A84]' };
            case 'ktb': return { name: 'ธนาคารกรุงไทย', color: 'bg-[#00A5E3]', text: 'text-[#00A5E3]' };
            case 'bbl': return { name: 'ธนาคารกรุงเทพ', color: 'bg-[#1E4598]', text: 'text-[#1E4598]' };
            case 'ttb': return { name: 'ธนาคารทีทีบี', color: 'bg-[#0056FF]', text: 'text-[#0056FF]' };
            case 'gsb': return { name: 'ธนาคารออมสิน', color: 'bg-[#EB198D]', text: 'text-[#EB198D]' };
            default: return { name: code, color: 'bg-gray-500', text: 'text-gray-500' };
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getAll();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = activeCategory === 'ทั้งหมด' || p.category === activeCategory;
        return matchSearch && matchCategory;
    });

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            alert('สินค้าหมด');
            return;
        }
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert('สินค้าไม่เพียงพอ');
                    return prev;
                }
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.product.id === productId) {
                const newQty = i.quantity + delta;
                if (newQty > i.product.stock) {
                    alert('สินค้าไม่เพียงพอ');
                    return i;
                }
                return newQty > 0 ? { ...i, quantity: newQty } : i;
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(i => i.product.id !== productId));
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const vatRate = 0.07;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (paymentMethod === 'promptpay') {
            if (!promptPayNumber) {
                alert('กรุณาตั้งค่าหมายเลข PromptPay ในหน้าตั้งค่า');
                return;
            }
            setIsCheckoutModalOpen(false);
            setIsPromptPayModalOpen(true);
            setQrTimer(300);
            return;
        }

        if (paymentMethod === 'transfer') {
            setIsCheckoutModalOpen(false);
            setIsTransferModalOpen(true);
            return;
        }

        await processOrder();
    };

    const processOrder = async () => {
        try {
            setProcessing(true);

            // Create order via API
            const orderData = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                subtotal: subtotal,
                total: total,
                paymentMethod: paymentMethod,
                status: 'completed'
            };

            const createdOrder = await ordersAPI.create(orderData);

            // Prepare Receipt Data
            const receiptData: OrderReceiptData = {
                orderId: createdOrder.orderCode || createdOrder.id,
                items: cart.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                subtotal: subtotal,
                tax: vatAmount,
                total: total,
                paymentMethod: getPaymentMethodLabel(paymentMethod),
                date: new Date().toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }),
                cashier: currentUser?.name || 'พนักงาน'
            };

            setCurrentOrder(receiptData);
            setCart([]);
            setIsCheckoutModalOpen(false);
            setIsReceiptModalOpen(true);
            loadProducts(); // Refresh stock

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'เกิดข้อผิดพลาดในการชำระเงิน');
        } finally {
            setProcessing(false);
        }
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'cash': return 'เงินสด';
            case 'card': return 'บัตรเครดิต';
            case 'transfer': return 'โอนเงิน';
            case 'promptpay': return 'PromptPay';
            default: return method;
        }
    };

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">บาร์ / มินิบาร์</h1>
                    <p className="text-gray-500">ขายเครื่องดื่มและของว่าง</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-green-800">
                        <ShoppingCart className="w-4 h-4" />
                        {cart.length} รายการ
                    </button>
                    <button
                        onClick={() => setIsCheckoutModalOpen(true)}
                        disabled={cart.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50"
                    >
                        <Receipt className="w-4 h-4" />
                        คิดเงิน ฿{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Products Section */}
                <div className="flex-1 space-y-4">
                    {/* Search & Categories */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้า..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => {
                            const inCart = cart.find(i => i.product.id === product.id);
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className={`bg-white rounded-2xl p-4 shadow-sm border-2 border-transparent hover:border-primary cursor-pointer transition-all relative ${product.stock <= 0 ? 'opacity-50' : ''}`}
                                >
                                    {inCart && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {inCart.quantity}
                                        </div>
                                    )}
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                                        <Wine className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-xs text-gray-400">{product.code}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-primary">฿{product.price}</span>
                                        <span className={`text-xs ${product.stock <= product.minStock ? 'text-red-500' : 'text-gray-400'}`}>
                                            เหลือ {product.stock}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="lg:w-80 bg-white rounded-2xl shadow-sm p-6 flex flex-col h-[calc(100vh-120px)] sticky top-24">
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-bold text-gray-800">ตะกร้า ({cart.length})</h2>
                    </div>

                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <ShoppingCart className="w-12 h-12 mb-3 opacity-50" />
                            <p>ตะกร้าว่างเปล่า</p>
                            <p className="text-sm">เลือกสินค้าเพื่อเพิ่มลงตะกร้า</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">฿{item.product.price} x {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => removeFromCart(item.product.id)} className="p-1 rounded text-red-500 hover:bg-red-50">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 mt-4 space-y-2">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>รวมเป็นเงิน</span>
                                    <span>฿{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>ภาษี (7%)</span>
                                    <span>฿{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-bold">ยอดสุทธิ</span>
                                    <span className="text-2xl font-bold text-primary">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <button
                                    onClick={() => setIsCheckoutModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-800"
                                >
                                    <Receipt className="w-5 h-5" />
                                    ชำระเงิน
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Checkout Modal */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">ชำระเงิน</h3>
                            <button onClick={() => setIsCheckoutModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Breakdown */}
                            <div className="flex justify-between items-end mb-6 border-b pb-6">
                                <div className="space-y-1">
                                    <p className="text-gray-500">ยอดรวม</p>
                                    <p className="text-gray-500">ภาษี (7%)</p>
                                    <h2 className="text-2xl font-bold text-gray-800 mt-2">รวมทั้งสิ้น</h2>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="font-medium">฿{subtotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                                    <p className="font-medium">฿{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    <h2 className="text-3xl font-bold text-primary text-[#C2A97E]">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                                </div>
                            </div>

                            {/* Payment Methods Grid */}
                            <h4 className="text-sm font-medium text-gray-500 mb-4">วิธีการชำระเงิน</h4>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { id: 'cash', label: 'เงินสด', icon: Banknote },
                                    { id: 'card', label: 'บัตรเครดิต/เดบิต', icon: CreditCard },
                                    { id: 'transfer', label: 'โอนเงิน', icon: Smartphone },
                                    { id: 'promptpay', label: 'PromptPay', icon: QrCode }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3 ${paymentMethod === method.id
                                            ? 'border-[#C2A97E] bg-[#C2A97E]/10 text-[#C2A97E]'
                                            : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <method.icon className={`w-8 h-8 ${paymentMethod === method.id ? 'stroke-[2.5px]' : ''}`} />
                                        <span className="font-medium">{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setIsCheckoutModalOpen(false)} className="py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50">
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={processing}
                                    className="py-3 bg-[#1E293B] text-white rounded-xl font-bold hover:bg-[#0F172A] flex items-center justify-center gap-2"
                                >
                                    {processing ? 'กำลังบันทึก...' : 'ชำระเงิน'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PromptPay Modal */}
            {isPromptPayModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <QrCode className="w-5 h-5 text-blue-600" />
                                ชำระผ่าน PromptPay
                            </h3>
                        </div>

                        <div className="p-6 text-center">
                            <p className="text-gray-500 mb-2">ยอดที่ต้องชำระ</p>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>

                            <div className="flex items-center justify-center gap-2 text-orange-500 font-medium mb-4">
                                <Clock className="w-4 h-4" />
                                <span>QR หมดอายุใน {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')} นาที</span>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 inline-block mb-6 relative bg-white">
                                <QRCodeCanvas
                                    value={generatePayload(promptPayNumber, { amount: total })}
                                    size={200}
                                    className="mx-auto"
                                />
                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-400">
                                    สแกน QR Code เพื่อชำระเงิน
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 text-sm mb-6 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">หมายเลข PromptPay</span>
                                    <span className="font-medium text-gray-900">{promptPayNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ชื่อบัญชี</span>
                                    <span className="font-medium text-gray-900">{promptPayName || 'ญาดาโฮมสเตย์'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">จำนวนเงิน</span>
                                    <span className="font-bold text-primary">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIsPromptPayModalOpen(false)}
                                    className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={processOrder}
                                    disabled={processing}
                                    className="px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-800 disabled:opacity-50"
                                >
                                    {processing ? 'กำลังบันทึก...' : 'ยืนยันการชำระเงิน'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 text-center relative">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
                                <Building className="w-5 h-5 text-gray-600" />
                                โอนเงินผ่านธนาคาร
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="text-center mb-6 bg-gray-50 py-4 rounded-xl">
                                <p className="text-gray-500 text-sm mb-1">ยอดที่ต้องชำระ</p>
                                <h2 className="text-3xl font-bold text-[#C2A97E]">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start">
                                <QrCode className="w-4 h-4 mt-0.5" />
                                <span>แนะนำ: ใช้ PromptPay จะสะดวกกว่า เพราะสามารถสแกน QR Code พร้อมยอดเงินได้เลย</span>
                            </div>

                            <p className="text-sm font-medium text-gray-500 mb-3">ข้อมูลบัญชีสำหรับโอนเงิน:</p>
                            <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto">
                                {bankAccounts.length > 0 ? bankAccounts.map((bank, index) => {
                                    const details = getBankDetails(bank.bank);
                                    return (
                                        <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl shadow-sm bg-white">
                                            <div className={`w-10 h-10 ${details.color} rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                                                {details.name.substring(0, 3)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-800 text-sm">{details.name}</p>
                                                <p className="text-xs text-gray-500">{bank.name}</p>
                                                <p className="font-mono font-medium text-gray-900">{bank.number}</p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center p-4 text-gray-400 border border-dashed rounded-xl">
                                        ไม่ได้ตั้งค่าบัญชีธนาคาร
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-6 p-4 border rounded-xl bg-orange-50 border-orange-100">
                                    <span className="text-gray-600 font-medium">ยอดที่ต้องโอน</span>
                                    <span className="text-xl font-bold text-orange-600">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setIsTransferModalOpen(false)}
                                        className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={processOrder}
                                        disabled={processing}
                                        className="px-4 py-3 bg-[#1E293B] text-white rounded-xl font-bold hover:bg-[#0F172A] disabled:opacity-50"
                                    >
                                        {processing ? 'กำลังบันทึก...' : 'ยืนยันการชำระเงิน'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {isReceiptModalOpen && currentOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                ชำระเงินสำเร็จ
                            </h3>
                            <button
                                onClick={() => setIsReceiptModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 bg-white relative">
                            {/* Receipt Preview UI */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Receipt className="w-8 h-8 text-green-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800">฿{currentOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                                <p className="text-sm text-gray-500 mt-1">ชำระโดย {currentOrder.paymentMethod}</p>
                            </div>

                            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">เลขที่ใบเสร็จ</span>
                                    <span className="font-medium">{currentOrder.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">วันที่</span>
                                    <span className="font-medium">{currentOrder.date}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                    <span className="text-gray-500">ยอดรวม</span>
                                    <span className="font-medium">฿{currentOrder.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ภาษี (7%)</span>
                                    <span className="font-medium">฿{currentOrder.tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => generateOrderReceipt(currentOrder)}
                                className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 flex items-center justify-center gap-2 mb-3"
                            >
                                <Printer className="w-5 h-5" />
                                พิมพ์ใบเสร็จ
                            </button>
                            <button
                                onClick={() => setIsReceiptModalOpen(false)}
                                className="w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
