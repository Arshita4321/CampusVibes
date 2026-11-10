import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { formatEventDate, formatPrice } from '../utils/booking';
import { TicketCard } from '../components/TicketCard';
import { ConfirmModal } from '../components/ConfirmModal';

export const MyBookings = () => {
  const { bookings, cancelBooking } = useEvents();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled'
  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Student bookings for the logged in student
  const studentBookings = bookings.filter((b) => {
    if (!user) return true; // Show demo bookings if not logged in
    return b.studentId === user.id || b.studentEmail === user.email;
  });

  const now = new Date();

  // Tab Filtering
  const filteredBookings = studentBookings.filter((b) => {
    const evtDate = b.eventDate ? new Date(b.eventDate) : now;
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    if (activeTab === 'completed') {
      return b.status === 'confirmed' && evtDate < now;
    }
    // upcoming
    return b.status === 'confirmed' && evtDate >= now;
  });

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel.id);
      setBookingToCancel(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Student Passes
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
            My Registered Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View your event passes, download tickets with QR codes, or manage seat reservations.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20"
        >
          <span>Find More Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Upcoming Active Passes ({studentBookings.filter((b) => b.status === 'confirmed' && (!b.eventDate || new Date(b.eventDate) >= now)).length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Past Events ({studentBookings.filter((b) => b.status === 'confirmed' && b.eventDate && new Date(b.eventDate) < now).length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Cancelled ({studentBookings.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            No {activeTab} bookings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? "You haven't booked any upcoming campus events yet. Explore events and reserve your seat!"
              : `No ${activeTab} event registrations found in your account.`}
          </p>
          {activeTab === 'upcoming' && (
            <div className="pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md"
              >
                <span>Browse Campus Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top strip */}
                <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Ticket ID: {booking.id}
                    </span>
                    <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {booking.eventTitle}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isCancelled ? (
                      <>
                        <XCircle className="w-3 h-3" />
                        Cancelled
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </>
                    )}
                  </span>
                </div>

                {/* Middle info with mini QR code preview */}
                <div className="p-5 flex items-center gap-4">
                  <div
                    onClick={() => !isCancelled && setSelectedBookingForTicket(booking)}
                    className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shrink-0 cursor-pointer hover:border-brand-500 transition-colors"
                    title="Click to view full ticket"
                  >
                    <QRCodeSVG
                      value={booking.qrPayload || booking.id}
                      size={68}
                      level="M"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 flex-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span className="font-medium">{formatEventDate(booking.eventDate)}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span className="truncate">{booking.eventVenue}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Attendee: <strong className="text-slate-700 dark:text-slate-200">{booking.studentName}</strong> ({booking.studentDepartment || 'Student'})
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 px-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {formatPrice(booking.ticketPrice)}
                  </span>

                  <div className="flex items-center gap-2">
                    {!isCancelled && (
                      <>
                        <button
                          onClick={() => setBookingToCancel(booking)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          Cancel Booking
                        </button>
                        <button
                          onClick={() => setSelectedBookingForTicket(booking)}
                          className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-500 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Ticket</span>
                        </button>
                      </>
                    )}
                    {isCancelled && (
                      <span className="text-[11px] text-slate-400">Seat released back to campus pool</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBookingForTicket && (
        <TicketCard
          booking={selectedBookingForTicket}
          onClose={() => setSelectedBookingForTicket(null)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <ConfirmModal
          isOpen={true}
          title="Cancel Ticket Reservation?"
          message={`Are you sure you want to cancel your booking for "${bookingToCancel.eventTitle}"? Your seat will be immediately released for other students or waitlisted peers.`}
          confirmLabel="Yes, Cancel Booking"
          confirmVariant="danger"
          onConfirm={handleConfirmCancel}
          onCancel={() => setBookingToCancel(null)}
        />
      )}
    </div>
  );
};

