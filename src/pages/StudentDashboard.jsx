import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Ticket,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Heart,
  QrCode,
  Compass,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { formatEventDate, formatPrice } from '../utils/booking';
import { EventCard } from '../components/EventCard';
import { TicketCard } from '../components/TicketCard';
import { BookingModal } from '../components/BookingModal';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { events, bookings, favorites, waitlists } = useEvents();

  const [activeTicket, setActiveTicket] = useState(null);
  const [bookingModalEvent, setBookingModalEvent] = useState(null);

  const studentBookings = bookings.filter(
    (b) => b.studentId === user?.id || b.studentEmail === user?.email
  );
  const confirmedBookings = studentBookings.filter((b) => b.status === 'confirmed');

  const now = new Date();
  const upcomingBookings = confirmedBookings.filter(
    (b) => !b.eventDate || new Date(b.eventDate) >= now
  );

  const nextBooking = upcomingBookings.sort(
    (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
  )[0];

  const studentWaitlists = waitlists.filter(
    (w) => w.studentId === user?.id || w.studentEmail === user?.email
  );

  // Recommendations: Events not yet booked
  const recommendedEvents = events
    .filter((e) => e.status === 'published' && !confirmedBookings.some((b) => b.eventId === e.id))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Welcome back, {user?.name || 'Campus Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            You have <strong className="text-white font-bold">{upcomingBookings.length}</strong> upcoming campus events on your schedule. Keep your QR passes ready for check-in!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my-bookings"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-brand-700 hover:bg-brand-50 shadow-md flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>My Tickets</span>
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/20"
          >
            Discover Events
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Passes</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              {upcomingBookings.length}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Wishlist Saved</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              {favorites.length}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Waitlisted</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              {studentWaitlists.length}
            </p>
          </div>
        </div>
      </div>

      {/* NEXT UPCOMING EVENT HIGHLIGHT */}
      {nextBooking ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-brand-900/60 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              Your Next Event
            </span>
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
              Ref: {nextBooking.id}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                {nextBooking.eventTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1.5 font-medium text-brand-600 dark:text-brand-400">
                  <Calendar className="w-4 h-4" />
                  {formatEventDate(nextBooking.eventDate, { includeTime: true })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {nextBooking.eventVenue}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTicket(nextBooking)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 flex items-center gap-2 shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR E-Ticket</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No upcoming events booked
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to explore? Discover hackathons, sports tournaments, and culture meets across campus.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm"
          >
            <span>Explore Campus Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* RECOMMENDED FOR YOU */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Recommended for You
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBookClick={(e) => setBookingModalEvent(e)}
            />
          ))}
        </div>
      </div>

      {/* Ticket Modal */}
      {activeTicket && (
        <TicketCard
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}

      {/* Booking Modal */}
      {bookingModalEvent && (
        <BookingModal
          event={bookingModalEvent}
          onClose={() => setBookingModalEvent(null)}
          onBookingSuccess={(booking) => {
            setActiveTicket(booking);
          }}
        />
      )}
    </div>
  );
};

