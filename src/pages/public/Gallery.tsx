import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GalleryImage {
    id: string;
    src: string;
    title: string;
    category: 'room' | 'facility' | 'nature' | 'dining';
}

export const Gallery = () => {
    const { rooms } = useData();
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [filter, setFilter] = useState<string>('all');

    // Generate gallery from room images + static images
    const galleryImages: GalleryImage[] = [
        // Room images from database
        ...rooms.filter(r => r.image).map(room => ({
            id: `room-${room.id}`,
            src: room.image!,
            title: room.name,
            category: 'room' as const
        })),
        // Static facility/nature images
        { id: 'fac-1', src: '/images/gallery/pool.jpg', title: 'สระว่ายน้ำ', category: 'facility' },
        { id: 'fac-2', src: '/images/gallery/lobby.jpg', title: 'ล็อบบี้', category: 'facility' },
        { id: 'fac-3', src: '/images/gallery/garden.jpg', title: 'สวนหย่อม', category: 'nature' },
        { id: 'fac-4', src: '/images/gallery/view.jpg', title: 'วิวธรรมชาติ', category: 'nature' },
        { id: 'din-1', src: '/images/gallery/restaurant.jpg', title: 'ร้านอาหาร', category: 'dining' },
        { id: 'din-2', src: '/images/gallery/breakfast.jpg', title: 'อาหารเช้า', category: 'dining' },
    ];

    const filteredImages = filter === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === filter);

    const categories = [
        { key: 'all', label: 'ทั้งหมด' },
        { key: 'room', label: 'ห้องพัก' },
        { key: 'facility', label: 'สิ่งอำนวยความสะดวก' },
        { key: 'nature', label: 'ธรรมชาติ' },
        { key: 'dining', label: 'อาหาร' },
    ];

    const handlePrev = () => {
        if (!selectedImage) return;
        const currentIdx = filteredImages.findIndex(img => img.id === selectedImage.id);
        const prevIdx = currentIdx > 0 ? currentIdx - 1 : filteredImages.length - 1;
        setSelectedImage(filteredImages[prevIdx]);
    };

    const handleNext = () => {
        if (!selectedImage) return;
        const currentIdx = filteredImages.findIndex(img => img.id === selectedImage.id);
        const nextIdx = currentIdx < filteredImages.length - 1 ? currentIdx + 1 : 0;
        setSelectedImage(filteredImages[nextIdx]);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1F2933] mb-4">แกลเลอรี่</h1>
                    <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                        ชมภาพบรรยากาศของ Yada Homestay รีสอร์ทในฝันที่รอคุณอยู่
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setFilter(cat.key)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat.key
                                    ? 'bg-[#2F5D50] text-white shadow-lg shadow-[#2F5D50]/30'
                                    : 'bg-white text-[#6B7280] hover:bg-[#2F5D50]/10 border border-[#E5E2DC]'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {filteredImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
                        <Image className="w-16 h-16 mb-4 opacity-30" />
                        <p>ไม่มีรูปภาพในหมวดหมู่นี้</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map((image, idx) => (
                            <div
                                key={image.id}
                                onClick={() => setSelectedImage(image)}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl ${idx % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                    }`}
                            >
                                <div className={`${idx % 5 === 0 ? 'aspect-square' : 'aspect-[4/3]'} bg-[#E5E2DC]`}>
                                    <img
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-medium">{image.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 bg-white/10 rounded-full backdrop-blur-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 text-white/80 hover:text-white p-3 bg-white/10 rounded-full backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 text-white/80 hover:text-white p-3 bg-white/10 rounded-full backdrop-blur-sm"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="max-w-5xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
