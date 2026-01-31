
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

import { PublicLayout } from './layouts/PublicLayout';
import { Home } from './pages/public/Home';
import { Booking } from './pages/public/Booking';
import { Contact } from './pages/public/Contact';
import { BookingStatus } from './pages/public/BookingStatus';
import { Gallery } from './pages/public/Gallery';
import { About } from './pages/public/About';

import { AdminLayout } from './layouts/AdminLayout';
import { AdminLogin } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { RoomManagement } from './pages/admin/RoomManagement';
import { BookingManagement } from './pages/admin/BookingManagement';
import { POS } from './pages/admin/POS';
import { Bar } from './pages/admin/Bar';
import { Reports } from './pages/admin/Reports';
import { Employees } from './pages/admin/Employees';
import { Settings } from './pages/admin/Settings';

// New Pages
import Cleaning from './pages/admin/Cleaning';
import Maintenance from './pages/admin/Maintenance';
import Customers from './pages/admin/Customers';
import CheckInOut from './pages/admin/CheckInOut';
import Inventory from './pages/admin/Inventory';
import Finance from './pages/admin/Finance';
import PaymentVerification from './pages/admin/PaymentVerification';

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-status" element={<BookingStatus />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="pos" element={<POS />} /> {/* Optional, keeping it */}

            <Route path="cleaning" element={<Cleaning />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="customers" element={<Customers />} />
            <Route path="checkinout" element={<CheckInOut />} />
            <Route path="bar" element={<Bar />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="finance" element={<Finance />} />
            <Route path="payments" element={<PaymentVerification />} />

            <Route path="reports" element={<Reports />} />
            <Route path="employees" element={<Employees />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;
