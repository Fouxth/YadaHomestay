
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
