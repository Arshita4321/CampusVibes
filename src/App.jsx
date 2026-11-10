import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ExploreEvents } from './pages/ExploreEvents';
import { EventDetails } from './pages/EventDetails';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { StudentDashboard } from './pages/StudentDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { ManageEvents } from './pages/ManageEvents';
import { ManageRegistrations } from './pages/ManageRegistrations';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { useAuth } from './context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Organizer Route Component
const OrganizerRoute = ({ children }) => {
  const { isOrganizer, switchDemoAccount } = useAuth();

  if (!isOrganizer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            Organizer Access Required
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            This management portal is restricted to university organizers and campus faculties. You can switch to the demo organizer account with 1 click below to explore the dashboard.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => switchDemoAccount('organizer')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 shadow-md"
          >
            Switch to Demo Organizer (Dr. Elena Vance)
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          >
            Return to Campus Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<StudentDashboard />} />

          {/* Organizer Protected Routes */}
          <Route
            path="/organizer"
            element={
              <OrganizerRoute>
                <OrganizerDashboard />
              </OrganizerRoute>
            }
          />
          <Route
            path="/organizer/events"
            element={
              <OrganizerRoute>
                <ManageEvents />
              </OrganizerRoute>
            }
          />
          <Route
            path="/organizer/registrations"
            element={
              <OrganizerRoute>
                <ManageRegistrations />
              </OrganizerRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
                <h1 className="text-6xl font-extrabold text-brand-600 dark:text-brand-400 font-heading">404</h1>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  Page Not Found
                </h2>
                <p className="text-sm text-slate-500">
                  The campus page or resource you requested cannot be found.
                </p>
                <div className="pt-2">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to CampusVibe Home</span>
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

