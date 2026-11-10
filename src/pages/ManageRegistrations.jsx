import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Download,
  Calendar,
  Ticket,
  CheckCircle2,
  XCircle,
  Eye,
  Building,
  GraduationCap
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { exportRegistrationsToCSV, formatEventDate, formatPrice } from '../utils/booking';
import { TicketCard } from '../components/TicketCard';

export const ManageRegistrations = () => {
  const { events, bookings } = useEvents();

  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ticketToView, setTicketToView] = useState(null);

  // Filtered registrations
  const filteredRegistrations = bookings.filter((b) => {
    // Event filter
    if (selectedEventId !== 'all' && b.eventId !== selectedEventId) return false;

    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = b.studentName?.toLowerCase().includes(q);
      const matchEmail = b.studentEmail?.toLowerCase().includes(q);
      const matchId = b.id?.toLowerCase().includes(q);
      const matchEvent = b.eventTitle?.toLowerCase().includes(q);
      const matchDept = b.studentDepartment?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchEvent && !matchDept) return false;
    }

    return true;
  });

  // Selected event details for occupancy banner
  const activeEvent = selectedEventId !== 'all' ? events.find((e) => e.id === selectedEventId) : null;
  const activeEventBookingsCount = activeEvent
    ? bookings.filter((b) => b.eventId === activeEvent.id && b.status === 'confirmed').length
    : 0;
  const activeOccupancy = activeEvent && activeEvent.capacity > 0
    ? Math.round((activeEventBookingsCount / activeEvent.capacity) * 100)
    : 0;

  const handleExportCSV = () => {
    const title = activeEvent ? activeEvent.title : 'All_Campus_Events';
    exportRegistrationsToCSV(filteredRegistrations, title);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Registration Management
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
            Attendee Registrations & Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View student reservations, verify ticket IDs, check live occupancy, and export rosters to CSV.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 active:scale-98 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export {filteredRegistrations.length} Records as CSV</span>
        </button>
      </div>

      {/* Selected Event Occupancy Card (if specific event is selected) */}
      {activeEvent && (
        <div className="p-6 rounded-3xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Selected Event Focus
            </span>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              {activeEvent.title}
            </h3>
            <p className="text-xs text-slate-500">
              {formatEventDate(activeEvent.date)} • {activeEvent.venue}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Occupancy Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 font-heading">
                {activeOccupancy}%
              </span>
              <span className="text-xs text-slate-400">
                ({activeEventBookingsCount} / {activeEvent.capacity} seats)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full"
                style={{ width: `${Math.min(100, activeOccupancy)}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={() => setSelectedEventId('all')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Clear Event Filter
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or booking ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Event Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 max-w-xs truncate"
            >
              <option value="all">All Events ({events.length})</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Booking Ref</th>
                <th className="p-4">Student Details</th>
                <th className="p-4">Department & College</th>
                <th className="p-4">Event</th>
                <th className="p-4">Price</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Booked On</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">E-Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No student registrations match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {b.id}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{b.studentName}</p>
                      <p className="text-[10px] text-slate-400">{b.studentEmail}</p>
                      {b.studentPhone && <p className="text-[10px] text-slate-400">{b.studentPhone}</p>}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{b.studentDepartment || 'General'}</p>
                      <p className="text-[10px] text-slate-400">{b.studentCollege || 'Apex University'}</p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{b.eventTitle}</p>
                      <p className="text-[10px] text-slate-400">{formatEventDate(b.eventDate, { short: true })}</p>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatPrice(b.ticketPrice)}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {b.paymentMethod || 'Free'}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {b.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {b.status}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setTicketToView(b)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Digital Ticket with QR"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Ticket Modal */}
      {ticketToView && (
        <TicketCard
          booking={ticketToView}
          onClose={() => setTicketToView(null)}
        />
      )}
    </div>
  );
};

