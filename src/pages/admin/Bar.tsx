import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Wine, ShoppingCart, Plus, Minus, Trash, Receipt, Search } from 'lucide-react';
import type { Product } from '../../types';

interface CartItem {
    product: Product;
    quantity: number;
}

export const Bar = () => {
    const { products } = useData();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

    const categories = ['ทั้งหมด', 'เครื่องดื่ม', 'แอลกอฮอล์', 'ของว่าง', 'อื่นๆ'];

    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = activeCategory === 'ทั้งหมด' || p.category === activeCategory;
        return matchSearch && matchCategory;
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.product.id === productId) {
                const newQty = i.quantity + delta;
                return newQty > 0 ? { ...i, quantity: newQty } : i;
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(i => i.product.id !== productId));
    };

    const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        alert(`สั่งซื้อสำเร็จ! ยอดรวม ฿${total.toLocaleString()}`);
        setCart([]);
    };

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
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50"
                    >
                        <Receipt className="w-4 h-4" />
                        คิดเงิน ฿{total.toLocaleString()}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Products */}
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
                                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-transparent hover:border-primary cursor-pointer transition-all relative"
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
                                        <span className="text-xs text-gray-400">เหลือ {product.stock}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="lg:w-80 bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-bold text-gray-800">ตะกร้า ({cart.length})</h2>
                    </div>

                    {cart.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>ตะกร้าว่างเปล่า</p>
                            <p className="text-sm">เลือกสินค้าเพื่อเพิ่มลงตะกร้า</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
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

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">รวมทั้งสิ้น</span>
                                    <span className="text-2xl font-bold text-primary">฿{total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-800"
                                >
                                    <Receipt className="w-5 h-5" />
                                    คิดเงิน
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
