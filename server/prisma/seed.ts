import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: hashedPassword }, // Update password if already exists
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'เจ้าของรีสอร์ท',
            role: 'admin',
            phone: '081-234-5678',
            email: 'admin@yadahomestay.com'
        },
    });
    console.log('Admin created:', admin.username);

    // Create Staff Users
    const staffUsers = [
        { username: 'staff1', name: 'สมชาย ใจดี', phone: '082-345-6789' },
        { username: 'staff2', name: 'นภา สวยงาม', phone: '083-456-7890', email: 'napa@yadahomestay.com' },
    ];

    for (const s of staffUsers) {
        const staffPassword = await bcrypt.hash('123456', 10);
        const staff = await prisma.user.upsert({
            where: { username: s.username },
            update: {},
            create: {
                username: s.username,
                password: staffPassword,
                name: s.name,
                role: 'staff',
                phone: s.phone,
                email: s.email
            },
        });
        console.log('Staff created:', staff.username);
    }

    // Create Rooms
    const rooms = [
        { number: '101', name: 'ห้องมาตรฐาน 101', type: 'standard', pricePerNight: 1200, capacity: 2, floor: 1, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ' },
        { number: '102', name: 'ห้องมาตรฐาน 102', type: 'standard', pricePerNight: 1200, capacity: 2, floor: 1, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ' },
        { number: '103', name: 'ห้องมาตรฐาน 103', type: 'standard', pricePerNight: 1200, capacity: 2, floor: 1, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ' },
        { number: '201', name: 'ห้องดีลักซ์ 201', type: 'deluxe', pricePerNight: 1800, capacity: 2, floor: 2, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ,อ่างอาบน้ำ,ระเบียง' },
        { number: '202', name: 'ห้องดีลักซ์ 202', type: 'deluxe', pricePerNight: 1800, capacity: 2, floor: 2, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ,อ่างอาบน้ำ,ระเบียง' },
        { number: '301', name: 'ห้องแฟมิลี่ 301', type: 'family', pricePerNight: 2800, capacity: 4, floor: 3, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ,ห้องนั่งเล่น,ครัวเล็ก' },
        { number: '302', name: 'ห้องแฟมิลี่ 302', type: 'family', pricePerNight: 2800, capacity: 4, floor: 3, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ,ห้องนั่งเล่น,ครัวเล็ก' },
        { number: '303', name: 'ห้องแฟมิลี่ 303', type: 'family', pricePerNight: 2800, capacity: 4, floor: 3, amenities: 'แอร์,ทีวี,ตู้เย็น,ไวไฟ,ห้องนั่งเล่น,ครัวเล็ก' },
    ];

    for (const r of rooms) {
        const room = await prisma.room.upsert({
            where: { number: r.number },
            update: {},
            create: r,
        });
        console.log('Room created:', room.number);
    }

    // Create Products
    const products = [
        { code: 'P001', name: 'น้ำดื่ม', category: 'beverage', price: 20, stock: 100, unit: 'ขวด' },
        { code: 'P002', name: 'โค้ก', category: 'beverage', price: 25, stock: 50, unit: 'กระป๋อง' },
        { code: 'P003', name: 'เบียร์สิงห์', category: 'alcohol', price: 70, stock: 30, unit: 'กระป๋อง' },
        { code: 'P004', name: 'เบียร์ช้าง', category: 'alcohol', price: 75, stock: 25, unit: 'กระป๋อง' },
        { code: 'P005', name: 'มาม่า', category: 'snack', price: 15, stock: 80, unit: 'ซอง' },
        { code: 'P006', name: 'ขนมปัง', category: 'snack', price: 25, stock: 20, unit: 'ชิ้น' },
    ];

    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { code: p.code },
            update: {},
            create: p,
        });
        console.log('Product created:', product.name);
    }

    console.log('Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
