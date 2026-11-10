import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Compass,
  Cpu,
  Music,
  Trophy,
  Palette,
  Briefcase,
  Gamepad2,
  BookOpen,
  CheckCircle2,
  Users,
  QrCode,
  Flame
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';
import { BookingModal } from '../components/BookingModal';
import { WaitlistModal } from '../components/WaitlistModal';
import { TicketCard } from '../components/TicketCard';

export const Home = () => {
  const { events } = useEvents();
  const { switchDemoAccount } = useAuth();
  const navigate = useNavigate();

  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [waitlistEvent, setWaitlistEvent] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');

  // Categories with custom styling & icons
  const categories = [
    { name: 'Technical', icon: Cpu, color: 'from-blue-500 to-indigo-600', count: events.filter(e => e.category === 'Technical').length },
    { name: 'Cultural', icon: Music, color: 'from-purple-500 to-pink-600', count: events.filter(e => e.category === 'Cultural').length },
    { name: 'Sports', icon: Trophy, color: 'from-emerald-500 to-teal-600', count: events.filter(e => e.category === 'Sports').length },
    { name: 'Arts', icon: Palette, color: 'from-pink-500 to-rose-600', count: events.filter(e => e.category === 'Arts').length },
    { name: 'Business', icon: Briefcase, color: 'from-indigo-500 to-blue-600', count: events.filter(e => e.category === 'Business').length },
    { name: 'Gaming', icon: Gamepad2, color: 'from-amber-500 to-orange-600', count: events.filter(e => e.category === 'Gaming').length },
    { name: 'Workshop', icon: BookOpen, color: 'from-teal-500 to-cyan-600', count: events.filter(e => e.category === 'Workshop').length }
  ];

  // Featured events
  const featuredEvents = events.filter((e) => e.featured && e.status === 'published').slice(0, 3);
  
  // Trending events (highest bookedSeats or ratio)
  const trendingEvents = [...events]
    .filter((e) => e.status === 'published')
    .sort((a, b) => (b.bookedSeats || 0) - (a.bookedSeats || 0))
    .slice(0, 4);

  // Upcoming events
  const upcomingEvents = [...events]
    .filter((e) => e.status === 'published')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleCardBooking = (event) => {
    const seatsLeft = Math.max(0, event.capacity - (event.bookedSeats || 0));
    if (seatsLeft === 0) {
      setWaitlistEvent(event);
    } else {
      setSelectedEventForBooking(event);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 lg:pt-16 pb-12 lg:pb-20">
        {/* Modern decorative blurred background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>The Premier Student Experience Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-slate-500 dark:text-slate-400">Semester 2025 Live</span>
          </div>

          {/* Heading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
              Discover What's Happening on <span className="text-gradient">Campus</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore upcoming hackathons, college concerts, sports meets, and student societies. Book instant digital passes with QR codes and never miss the vibe.
            </p>
          </div>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-2"
          >
            <div className="flex-1 flex items-center pl-3">
              <Compass className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search hackathons, music fest, sports..."
                className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Stats Badges */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 font-heading">
                {events.length}+
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Active Campus Events</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">
                10,000+
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Collegiate Attendees</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                100%
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Verified QR Tickets</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-amber-500 font-heading">
                4.9★
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR EVENT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Browse by Interest
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Popular Event Categories
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/explore?category=${cat.name}`}
                className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-3"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {cat.count} Events
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Campus Spotlights
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                Featured Flagship Events
              </h2>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
            >
              <span>See All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBookClick={handleCardBooking}
              />
            ))}
          </div>
        </section>
      )}

      {/* TRENDING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                High Demand
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Trending on Campus Right Now
            </h2>
          </div>
          <Link
            to="/explore?sort=popular"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>View Most Popular</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBookClick={handleCardBooking}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / 3 SIMPLE STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
              Simple & Seamless
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              How CampusVibe Works
            </h2>
            <p className="text-sm text-slate-300">
              Three fast steps from discovering an event to walking through the auditorium doors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/30 flex items-center justify-center text-brand-300 font-extrabold text-lg">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Discover & Filter</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse through real-time university hackathons, concerts, workshops, and sports by department, date, or price.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent-500/30 flex items-center justify-center text-accent-300 font-extrabold text-lg">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Instant Seat Booking</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Confirm your student details with one click. Automatic seat decrement ensures accurate live occupancy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 font-extrabold text-lg">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Digital Pass & QR Scan</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get an e-pass ticket with a scannable QR code. Download, print, or show it directly on your mobile device at the venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Campus Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Upcoming Events This Semester
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>Explore All ({events.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBookClick={handleCardBooking}
            />
          ))}
        </div>
      </section>

      {/* ORGANIZER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-50 via-brand-50 to-purple-50 dark:from-slate-900 dark:via-brand-950/40 dark:to-slate-900 border border-brand-200 dark:border-brand-900/60 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 inline-block">
              For Campus Leaders & Faculty
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Hosting a College Event? Manage Registrations Like a Pro
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Publish events in seconds, monitor live capacity, review registrations, visualize attendee analytics with Recharts, and export attendee rosters as CSV files.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => {
                switchDemoAccount('organizer');
                navigate('/organizer');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Organizer Portal</span>
            </button>
            <Link
              to="/about"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onBookingSuccess={(booking) => {
            setActiveTicket(booking);
          }}
        />
      )}

      {waitlistEvent && (
        <WaitlistModal
          event={waitlistEvent}
          onClose={() => setWaitlistEvent(null)}
        />
      )}

      {activeTicket && (
        <TicketCard
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
};

