import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { formatEventDate, formatPrice } from '../utils/booking';

export const EventCard = ({ event, onBookClick }) => {
  const { isFavorite, toggleFavorite, hasStudentBooked } = useEvents();
  const { user } = useAuth();

  const isFav = isFavorite(event.id);
  const isBooked = hasStudentBooked(event.id);
  const seatsLeft = Math.max(0, event.capacity - (event.bookedSeats || 0));
  const occupancyRate = event.capacity > 0 ? ((event.bookedSeats || 0) / event.capacity) * 100 : 0;
  const isSoldOut = seatsLeft === 0;
  const isSellingFast = !isSoldOut && seatsLeft <= Math.max(5, Math.floor(event.capacity * 0.15));

  // Category color map
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Cultural':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Sports':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Arts':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'Gaming':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Business':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700/60 transition-all duration-300">
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md shadow-sm ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
            {event.featured && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/90 text-white shadow-sm flex items-center gap-1 backdrop-blur-md">
                <Flame className="w-3 h-3 fill-white" />
                Featured
              </span>
            )}
            {isSellingFast && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/90 text-white shadow-sm backdrop-blur-md animate-pulse">
                Filling Fast!
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(event.id);
            }}
            aria-label="Add to favorites"
            className="pointer-events-auto p-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md transition-transform active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay Details (Price & Booked status) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-bold tracking-wide border border-white/10">
            {formatPrice(event.price)}
          </span>

          {isBooked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/90 backdrop-blur-md text-xs font-semibold text-white shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Booked
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-xs font-medium text-brand-600 dark:text-brand-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatEventDate(event.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {event.time || 'TBA'}
            </span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.id}`}>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {event.title}
            </h3>
          </Link>

          {/* Venue */}
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{event.venue}</span>
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer / Seat status & Action button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Seats left progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Users className="w-3.5 h-3.5" />
                {isSoldOut ? (
                  <span className="font-semibold text-rose-500">Sold Out</span>
                ) : (
                  <span>
                    <strong className="text-slate-800 dark:text-slate-200">{seatsLeft}</strong> seats left
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400">
                {event.bookedSeats || 0} / {event.capacity}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSoldOut
                    ? 'bg-rose-500'
                    : occupancyRate > 80
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-brand-500 to-accent-500'
                }`}
                style={{ width: `${Math.min(100, occupancyRate)}%` }}
              />
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex items-center gap-2">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Details
            </Link>

            {isSoldOut ? (
              <button
                onClick={() => onBookClick && onBookClick(event)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
              >
                Join Waitlist
              </button>
            ) : isBooked ? (
              <Link
                to="/my-bookings"
                className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                View Ticket
              </Link>
            ) : (
              <button
                onClick={() => onBookClick && onBookClick(event)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-sm shadow-brand-500/20 active:scale-98 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

