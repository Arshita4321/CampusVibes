import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Heart,
  Calendar,
  Ticket,
  Edit3,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/EventCard';
import { BookingModal } from '../components/BookingModal';
import { formatEventDate } from '../utils/booking';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { events, bookings, favorites } = useEvents();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    department: user?.department || 'Computer Science & Engineering',
    college: user?.college || 'Apex Institute of Technology',
    phone: user?.phone || '+1 (555) 382-9014'
  });

  const [bookingModalEvent, setBookingModalEvent] = useState(null);

  // Student bookings
  const studentBookings = bookings.filter(
    (b) => b.studentId === user?.id || b.studentEmail === user?.email
  );
  const activeBookings = studentBookings.filter((b) => b.status === 'confirmed');

  // Favorite events
  const favoriteEvents = events.filter((e) => favorites.includes(e.id));

  // Next upcoming event for reminder
  const now = new Date();
  const nextEventBooking = activeBookings
    .filter((b) => b.eventDate && new Date(b.eventDate) >= now)
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))[0];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header & Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name || 'Student Profile'}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-600 text-white shadow">
                {user?.role || 'Student'}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                {user?.name || 'Campus Student'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
                {user?.department || 'Computer Science & Engineering'} • {user?.college || 'Apex Institute of Technology'}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email || 'alex@campus.edu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Registrations
            </span>
            <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 font-heading">
              {studentBookings.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Active Passes
            </span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">
              {activeBookings.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Saved Favorites
            </span>
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-heading">
              {favoriteEvents.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Campus Status
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-heading flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Scholar
            </span>
          </div>
        </div>

        {/* Edit Profile Form Modal/Drawer if open */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Update Student Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  College / Campus
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-500 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* EVENT REMINDER ALERT */}
      {nextEventBooking && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-200 block">
                Upcoming Event Reminder
              </span>
              <h3 className="text-lg font-bold font-heading">{nextEventBooking.eventTitle}</h3>
              <p className="text-xs text-white/80">
                Scheduled for {formatEventDate(nextEventBooking.eventDate, { includeTime: true })} at {nextEventBooking.eventVenue}
              </p>
            </div>
          </div>

          <Link
            to="/my-bookings"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-brand-700 hover:bg-brand-50 shadow shrink-0"
          >
            Open Ticket Pass
          </Link>
        </div>
      )}

      {/* WISHLIST / FAVORITE SAVED EVENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Saved Wishlist ({favoriteEvents.length})
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Explore More Events
          </Link>
        </div>

        {favoriteEvents.length === 0 ? (
          <div className="py-12 text-center space-y-3 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <Heart className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No saved events in your wishlist yet
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tap the heart icon on any event card to save it here for fast booking later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onBookClick={(e) => setBookingModalEvent(e)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Participation History */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-500" />
          Campus Participation History
        </h2>

        {studentBookings.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
            No past participation records. Book an event to start building your campus activities record!
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {studentBookings.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{b.eventTitle}</h4>
                  <p className="text-slate-400 mt-0.5">
                    {formatEventDate(b.eventDate)} • {b.eventVenue}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">{b.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingModalEvent && (
        <BookingModal
          event={bookingModalEvent}
          onClose={() => setBookingModalEvent(null)}
        />
      )}
    </div>
  );
};

