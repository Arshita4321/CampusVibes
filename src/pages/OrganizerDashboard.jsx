import React from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  TrendingUp,
  PlusCircle,
  Download,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { exportRegistrationsToCSV, formatPrice, formatEventDate } from '../utils/booking';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];

export const OrganizerDashboard = () => {
  const { events, bookings, getAnalytics } = useEvents();
  const { user } = useAuth();

  const analytics = getAnalytics();
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  const handleExportAll = () => {
    exportRegistrationsToCSV(confirmedBookings, 'All_Campus_Events');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Organizer Operations Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Campus Event Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time registration metrics, seat occupancy rates, and attendee tracking for {user?.department || 'Student Affairs'}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-brand-500" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/organizer/registrations"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Users className="w-4 h-4 text-brand-500" />
            <span>Registrations</span>
          </Link>

          <Link
            to="/organizer/events"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage & Create Events</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {analytics.totalEvents}
          </div>
          <p className="text-xs text-slate-400">
            {analytics.publishedEvents} live published • {analytics.totalEvents - analytics.publishedEvents} drafts
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {analytics.totalBookings}
          </div>
          <p className="text-xs text-slate-400">
            Confirmed e-ticket passes issued
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Registered</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {analytics.uniqueStudents}
          </div>
          <p className="text-xs text-slate-400">
            Unique verified collegiate attendees
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {analytics.upcomingCount}
          </div>
          <p className="text-xs text-slate-400">
            Scheduled on semester calendar
          </p>
        </div>
      </div>

      {/* ANALYTICS CHARTS (RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event-wise Registration Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Event-Wise Registration Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Number of confirmed student bookings per event
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-lg">
              Live Data
            </span>
          </div>

          <div className="w-full h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.eventRegistrationData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} height={40} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f8fafc',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(val, name, item) => [`${val} Bookings`, item.payload.fullTitle]}
                />
                <Bar dataKey="bookings" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Event Categories Chart (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Event Categories Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Campus offerings by genre
            </p>
          </div>

          <div className="w-full h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f8fafc',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SEAT OCCUPANCY RATES TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Campus Venue & Seat Occupancy
            </h3>
            <p className="text-xs text-slate-400">
              Tracking venue capacity vs booked seats across active campus facilities
            </p>
          </div>
          <Link
            to="/organizer/events"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All ({events.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.slice(0, 4).map((evt) => {
            const seatsLeft = Math.max(0, evt.capacity - (evt.bookedSeats || 0));
            const occupancy = evt.capacity > 0 ? Math.round(((evt.bookedSeats || 0) / evt.capacity) * 100) : 0;

            return (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block">
                    {evt.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                    {evt.title}
                  </h4>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Occupancy</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{occupancy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancy >= 100
                          ? 'bg-rose-500'
                          : occupancy > 80
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancy)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>{evt.bookedSeats || 0} Booked</span>
                    <span>{seatsLeft} Remaining</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT REGISTRATIONS ROSTER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Recent Student Registrations
            </h3>
            <p className="text-xs text-slate-400">
              Latest tickets claimed by students across campus
            </p>
          </div>
          <Link
            to="/organizer/registrations"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View Full List ({bookings.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Booking Ref</th>
                <th className="p-4">Student</th>
                <th className="p-4">Department</th>
                <th className="p-4">Event</th>
                <th className="p-4">Date Registered</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 pl-6 font-mono font-bold text-brand-600 dark:text-brand-400">{b.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{b.studentName}</p>
                    <p className="text-[10px] text-slate-400">{b.studentEmail}</p>
                  </td>
                  <td className="p-4">{b.studentDepartment || 'General'}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">{b.eventTitle}</td>
                  <td className="p-4 text-slate-400">
                    {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="p-4 pr-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

