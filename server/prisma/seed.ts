import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password: hashedPassword,
            role: 'admin',  // Ensure role is always admin
            isActive: true
        },
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
        { username: 'staff3', name: 'วิชัย ช่างซ่อม', phone: '084-567-8901' },
    ];

    for (const s of staffUsers) {
        const staffPassword = await bcrypt.hash('123456', 10);
        await prisma.user.upsert({
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
        console.log('Staff created:', s.username);
    }

    // Get staff for referencing
    const staff1 = await prisma.user.findUnique({ where: { username: 'staff1' } });
    const staff2 = await prisma.user.findUnique({ where: { username: 'staff2' } });

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

    const createdRooms = [];
    for (const r of rooms) {
        const room = await prisma.room.upsert({
            where: { number: r.number },
            update: {},
            create: r,
        });
        createdRooms.push(room);
        console.log('Room created:', room.number);
    }

    // Create Customers
    const customers = [
        { code: 'CUS-001', firstName: 'John', lastName: 'Doe', phone: '099-111-2222', nationality: 'USA', email: 'john@example.com' },
        { code: 'CUS-002', firstName: 'สมศักดิ์', lastName: 'รักสงบ', phone: '088-777-6666', nationality: 'Thai', idCard: '1100223344556' },
        { code: 'CUS-003', firstName: 'Maria', lastName: 'Smith', phone: '066-555-4444', nationality: 'UK' },
    ];

    for (const c of customers) {
        await prisma.customer.upsert({
            where: { code: c.code },
            update: {},
            create: c,
        });
        console.log('Customer created:', c.firstName);
    }

    // Create Products
    const products = [
        { code: 'P001', name: 'น้ำดื่ม', category: 'beverage', price: 20, stock: 100, unit: 'ขวด' },
        { code: 'P002', name: 'โค้ก', category: 'beverage', price: 25, stock: 50, unit: 'กระป๋อง' },
        { code: 'P003', name: 'เบียร์สิงห์', category: 'alcohol', price: 70, stock: 30, unit: 'กระป๋อง' },
        { code: 'P004', name: 'เบียร์ช้าง', category: 'alcohol', price: 75, stock: 25, unit: 'กระป๋อง' },
        { code: 'P005', name: 'มาม่า', category: 'snack', price: 15, stock: 80, unit: 'ซอง' },
        { code: 'P006', name: 'ขนมปัง', category: 'snack', price: 25, stock: 20, unit: 'ชิ้น' },
        { code: 'P007', name: 'แปรงสีฟัน', category: 'amenity', price: 10, stock: 200, unit: 'อัน' },
        { code: 'P008', name: 'ยาสีฟัน', category: 'amenity', price: 15, stock: 150, unit: 'หลอด' },
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { code: p.code },
            update: {},
            create: p,
        });
        console.log('Product created:', p.name);
    }

    // Create some Tasks
    if (staff1 && createdRooms.length > 0) {
        await prisma.cleaningTask.create({
            data: {
                roomId: createdRooms[0].id,
                type: 'routine',
                status: 'pending',
                assignedToId: staff1.id,
                priority: 'normal',
                notes: 'ทำความสะอาดทั่วไป เปลี่ยนผ้าปู'
            }
        });
        console.log('Cleaning task created');
    }

    // Create Settings
    const settings = [
        { key: 'homestay_name', value: 'Yada Homestay', type: 'string', category: 'general' },
        { key: 'check_in_time', value: '14:00', type: 'string', category: 'booking' },
        { key: 'check_out_time', value: '12:00', type: 'string', category: 'booking' },
        { key: 'wifi_password', value: 'yada1234', type: 'string', category: 'general' },
    ];

    for (const s of settings) {
        await prisma.setting.upsert({
            where: { key: s.key },
            update: {},
            create: s,
        });
    }
    console.log('Settings created');

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
