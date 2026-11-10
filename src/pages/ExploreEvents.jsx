import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Filter, SlidersHorizontal, X, AlertCircle } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { EventFilters } from '../components/EventFilters';
import { BookingModal } from '../components/BookingModal';
import { WaitlistModal } from '../components/WaitlistModal';
import { TicketCard } from '../components/TicketCard';

export const ExploreEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events } = useEvents();

  // URL query params
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'upcoming';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [dateFilter, setDateFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState(initialSort);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [waitlistEvent, setWaitlistEvent] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const s = searchParams.get('search');
    if (s) setSearchQuery(s);
  }, [searchParams]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set);
  }, [events]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setDateFilter('all');
    setPriceFilter('all');
    setSortBy('upcoming');
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date();
    monthEnd.setDate(monthEnd.getDate() + 30);

    return events
      .filter((e) => e.status === 'published')
      .filter((e) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = e.title.toLowerCase().includes(q);
          const matchesDesc = e.description?.toLowerCase().includes(q);
          const matchesVenue = e.venue?.toLowerCase().includes(q);
          const matchesCategory = e.category?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && e.category !== selectedCategory) {
          return false;
        }

        // Price filter
        if (priceFilter === 'free' && Number(e.price) > 0) return false;
        if (priceFilter === 'paid' && (!e.price || Number(e.price) === 0)) return false;

        // Date filter
        if (dateFilter !== 'all') {
          const evtDate = new Date(e.date);
          if (dateFilter === 'today') {
            if (evtDate > todayEnd || evtDate < now) return false;
          } else if (dateFilter === 'week') {
            if (evtDate > weekEnd) return false;
          } else if (dateFilter === 'month') {
            if (evtDate > monthEnd) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.bookedSeats || 0) - (a.bookedSeats || 0);
        }
        if (sortBy === 'price-asc') {
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        }
        if (sortBy === 'price-desc') {
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // Default: upcoming date
        return new Date(a.date) - new Date(b.date);
      });
  }, [events, searchQuery, selectedCategory, dateFilter, priceFilter, sortBy]);

  const handleCardBooking = (event) => {
    const seatsLeft = Math.max(0, event.capacity - (event.bookedSeats || 0));
    if (seatsLeft === 0) {
      setWaitlistEvent(event);
    } else {
      setSelectedEventForBooking(event);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Campus Catalog
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
          Explore Campus Events
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover college festivals, hackathons, guest lectures, sports showdowns, and society gatherings.
        </p>
      </div>

      {/* Search Bar & Category Pills */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      {/* Main Grid: Sidebar + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <EventFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={handleResetFilters}
            totalResults={filteredEvents.length}
          />
        </div>

        {/* Events Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active summary bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredEvents.length}</strong> available campus events
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Active category:</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {selectedCategory}
              </span>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                No matching events found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                We couldn't find any events matching your selected search or filter criteria. Try clearing some filters.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBookClick={handleCardBooking}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                Filter & Sort Events
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <EventFilters
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFiltersOpen(false);
              }}
              totalResults={filteredEvents.length}
            />

            <div className="pt-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
              >
                Apply Filters ({filteredEvents.length} Events)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onBookingSuccess={(booking) => {
            setActiveTicket(booking);
          }}
        />
      )}

      {/* Waitlist Modal */}
      {waitlistEvent && (
        <WaitlistModal
          event={waitlistEvent}
          onClose={() => setWaitlistEvent(null)}
        />
      )}

      {/* Ticket Modal */}
      {activeTicket && (
        <TicketCard
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
};

