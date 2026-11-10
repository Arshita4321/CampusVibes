import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Tag,
  Mail,
  Flame,
  Ticket
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatEventDate, formatPrice } from '../utils/booking';
import { BookingModal } from '../components/BookingModal';
import { WaitlistModal } from '../components/WaitlistModal';
import { TicketCard } from '../components/TicketCard';
import { EventCard } from '../components/EventCard';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, bookings, isFavorite, toggleFavorite, hasStudentBooked } = useEvents();
  const { user } = useAuth();
  const { success } = useToast();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
          Event Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(event.id);
  const isBooked = hasStudentBooked(event.id);
  const userBooking = bookings.find((b) => b.eventId === event.id && b.studentId === user?.id && b.status === 'confirmed');

  const seatsLeft = Math.max(0, event.capacity - (event.bookedSeats || 0));
  const occupancyRate = event.capacity > 0 ? ((event.bookedSeats || 0) / event.capacity) * 100 : 0;
  const isSoldOut = seatsLeft === 0;

  // Related events
  const relatedEvents = events
    .filter((e) => e.id !== event.id && e.category === event.category && e.status === 'published')
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Event link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(event.id)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Banner with Cover Photo */}
      <div className="relative aspect-[21/9] min-h-[300px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-slate-900">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-600 text-white shadow">
              {event.category}
            </span>
            {event.featured && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Featured
              </span>
            )}
            <span className="px-3 py-1 rounded-lg text-xs font-bold tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
              {formatPrice(event.price)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-400" />
              {formatEventDate(event.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" />
              {event.time}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-400" />
              {event.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Registration Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Agenda, Rules */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              About This Event
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {event.description}
            </p>

            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Schedule Highlights */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              Event Timeline & Agenda
            </h2>
            <div className="space-y-4 border-l-2 border-brand-200 dark:border-brand-900 ml-3 pl-4">
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-brand-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Attendee Check-in & Welcome Kit</h4>
                <p className="text-xs text-slate-500 mt-0.5">Please present your digital pass QR code at the entrance.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-brand-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Keynote / Competition Kickoff</h4>
                <p className="text-xs text-slate-500 mt-0.5">Opening remarks from organizers and rules review.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-brand-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Networking Social & Showcase</h4>
                <p className="text-xs text-slate-500 mt-0.5">Refreshments served and project demonstrations.</p>
              </div>
            </div>
          </section>

          {/* Campus Policies & Guidelines */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Campus Guidelines & Entry Requirements
            </h2>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Entry is strictly restricted to valid CampusVibe ticket holders and college students.</li>
              <li>Please bring your physical or digital College Student ID card along with your QR ticket.</li>
              <li>Seats are filled on a first-come, first-seated basis inside the hall.</li>
              <li>Cancellations are permitted up to 2 hours prior to event start so waitlisted students can attend.</li>
            </ul>
          </section>
        </div>

        {/* Right 1 Col: Booking Card & Organizer Card */}
        <div className="space-y-6">
          {/* Live Registration Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Admission</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {formatPrice(event.price)}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                1 Pass Per Student
              </span>
            </div>

            {/* Live Seat Capacity Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Users className="w-4 h-4 text-brand-500" />
                  {isSoldOut ? (
                    <span className="text-rose-500 font-bold">Sold Out</span>
                  ) : (
                    <span>
                      <strong className="text-slate-900 dark:text-white">{seatsLeft}</strong> seats remaining
                    </span>
                  )}
                </span>
                <span className="text-slate-400">
                  {event.bookedSeats || 0} / {event.capacity}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSoldOut
                      ? 'bg-rose-500'
                      : occupancyRate > 80
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, occupancyRate)}%` }}
                />
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              {isBooked ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>View My Digital Ticket</span>
                  </button>
                  <p className="text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ You have registered for this event
                  </p>
                </div>
              ) : isSoldOut ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setWaitlistModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-500/20"
                  >
                    Join Priority Waitlist
                  </button>
                  <p className="text-center text-[11px] text-amber-600 dark:text-amber-400">
                    Full capacity reached. Join the waitlist to be notified if a seat frees up.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-4 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Seat Now</span>
                </button>
              )}
            </div>

            {/* Quick venue & date review */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span>{formatEventDate(event.date, { includeTime: true })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Organized By
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow">
                {event.organizerName ? event.organizerName.charAt(0) : 'O'}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  {event.organizerName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Verified Campus Host</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>{event.organizerEmail || 'organizer@campus.edu'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      {relatedEvents.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            More in {event.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((rel) => (
              <EventCard key={rel.id} event={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          event={event}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={() => {
            setBookingModalOpen(false);
            setTicketModalOpen(true);
          }}
        />
      )}

      {/* Waitlist Modal */}
      {waitlistModalOpen && (
        <WaitlistModal
          event={event}
          onClose={() => setWaitlistModalOpen(false)}
        />
      )}

      {/* Ticket Modal */}
      {ticketModalOpen && userBooking && (
        <TicketCard
          booking={userBooking}
          onClose={() => setTicketModalOpen(false)}
        />
      )}
    </div>
  );
};

