import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import roomRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import housekeepingRoutes from './routes/housekeeping.routes'; // Keeping for legacy/compatibility
import auditRoutes from './routes/audit.routes';

// New routes
import customerRoutes from './routes/customer.routes';
import checkInOutRoutes from './routes/checkinout.routes';
import cleaningRoutes from './routes/cleaning.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import inventoryRoutes from './routes/inventory.routes';
import financeRoutes from './routes/finance.routes';
import settingRoutes from './routes/setting.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/audit', auditRoutes);

// Register New Routes
app.use('/api/customers', customerRoutes);
app.use('/api/checkins', checkInOutRoutes);
app.use('/api/cleaning', cleaningRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/settings', settingRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

export default app;
