import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Download,
  Printer,
  CheckCircle2,
  X,
  Sparkles,
  Ticket as TicketIcon
} from 'lucide-react';
import { formatEventDate, formatPrice } from '../utils/booking';

export const TicketCard = ({ booking, onClose }) => {
  const ticketRef = useRef(null);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-8">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg border border-slate-700"
          title="Close Ticket"
        >
          <X className="w-4 h-4" />
        </button>

        {/* The Printable Boarding Pass Card */}
        <div
          ref={ticketRef}
          id="printable-ticket"
          className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-800 dark:text-slate-100"
        >
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 p-6 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-lg tracking-tight">CampusVibe Digital Ticket</h4>
                  <p className="text-[11px] text-white/80 uppercase tracking-widest font-semibold">
                    Official Student E-Pass
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                    isCancelled
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-emerald-500/90 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-white/70 block text-[10px] uppercase font-bold">Booking Reference</span>
                <span className="font-mono font-bold text-sm tracking-wider">{booking.id}</span>
              </div>
              <div className="text-right">
                <span className="text-white/70 block text-[10px] uppercase font-bold">Pass Admission</span>
                <span className="font-bold text-sm">{formatPrice(booking.ticketPrice)}</span>
              </div>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-6 space-y-5">
            {/* Event Name */}
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 mb-1">
                {booking.eventCategory || 'Campus Event'}
              </span>
              <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white leading-tight">
                {booking.eventTitle}
              </h2>
            </div>

            {/* Date, Time & Venue Grid */}
            <div className="grid grid-cols-2 gap-4 py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-500" /> Date
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {formatEventDate(booking.eventDate)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-500" /> Time
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {booking.eventDate ? new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}
                </p>
              </div>

              <div className="col-span-2 space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-500" /> Venue
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {booking.eventVenue}
                </p>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Attendee Information</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                    {booking.studentName ? booking.studentName.charAt(0) : 'S'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{booking.studentName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{booking.studentEmail}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                    {booking.studentDepartment || 'Student'}
                  </span>
                  <span className="text-[10px] text-slate-400">{booking.studentCollege}</span>
                </div>
              </div>
            </div>

            {/* QR Code Section & Perforated Divider */}
            <div className="relative pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
              {/* Notches for boarding pass look */}
              <div className="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm" />
              <div className="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm" />

              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/80 inline-block mb-2">
                <QRCodeSVG
                  value={
                    booking.qrPayload ||
                    JSON.stringify({
                      id: booking.id,
                      event: booking.eventTitle,
                      student: booking.studentName
                    })
                  }
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Scan this QR code at campus venue gate for fast check-in
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50 dark:bg-slate-900/90 p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save Ticket
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

