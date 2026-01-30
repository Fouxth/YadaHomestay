const fetch = require('node-fetch'); // You might need to install node-fetch if using older node, or use global fetch in Node 18+

async function testAPI() {
    const BASE_URL = 'http://localhost:3000/api';
    console.log('Starting API Test...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for server to start

    try {
        // 1. Health Check
        console.log('\n[1] Testing Health Check...');
        const health = await fetch('http://localhost:3000/health').then(r => r.json());
        console.log('Health:', health);

        // 2. Login (Admin)
        console.log('\n[2] Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        if (!loginData.token) throw new Error('Login failed: ' + JSON.stringify(loginData));
        const token = loginData.token;
        console.log('Token received.');

        // 3. Get Rooms
        console.log('\n[3] Testing Get Rooms...');
        const rooms = await fetch(`${BASE_URL}/rooms`, {
            headers: { 'Authorization': `Bearer ${token}` } // Assuming we might add auth middleware later, currently public
        }).then(r => r.json());
        console.log('Rooms found:', rooms.length);
        if (rooms.length > 0) console.log('First Room:', rooms[0].name);

        // 4. Get Products
        console.log('\n[4] Testing Get Products...');
        const products = await fetch(`${BASE_URL}/products`).then(r => r.json());
        console.log('Products found:', products.length);

        // 5. Create Booking
        console.log('\n[5] Testing Create Booking...');
        const room = rooms[0];
        const bookingRes = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guestName: "Test User",
                guestPhone: "0812345678",
                roomId: room.id,
                roomNumber: room.number,
                roomName: room.name,
                checkInDate: "2026-02-01",
                checkOutDate: "2026-02-02",
                nights: 1,
                adults: 2,
                children: 0,
                roomPrice: room.pricePerNight,
                totalAmount: room.pricePerNight,
                paidAmount: 0
            })
        });
        console.log('Create Booking Status:', bookingRes.status);
        const booking = await bookingRes.json();
        console.log('Booking Created:', booking.bookingCode);

        // 6. Create Order
        console.log('\n[6] Testing Create Order...');
        const product = products[0];
        const orderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: room.id,
                roomNumber: room.number,
                guestName: "Test User",
                subtotal: product.price,
                total: product.price,
                paymentMethod: 'cash',
                items: [{
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    quantity: 1
                }]
            })
        });
        console.log('Create Order Status:', orderRes.status);
        const order = await orderRes.json();
        console.log('Order Created:', order.orderCode);

        console.log('\nAPI Test Completed Successfully!');

    } catch (error) {
        console.error('\nAPI Test Failed:', error);
    }
}

testAPI();
