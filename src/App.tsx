
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

import { PublicLayout } from './layouts/PublicLayout';
import { Home } from './pages/public/Home';
import { Booking } from './pages/public/Booking';
import { Contact } from './pages/public/Contact';

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

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="pos" element={<POS />} />
            <Route path="bar" element={<Bar />} />
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
