import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Ticket,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { formatEventDate, formatPrice } from '../utils/booking';

export const BookingModal = ({ event, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const { bookEvent, hasStudentBooked } = useEvents();

  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'confirmed'
  const [createdBooking, setCreatedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Student details form
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || 'Computer Science & Engineering',
    college: user?.college || 'Apex Institute of Technology',
    phone: user?.phone || '+1 (555) 382-9014'
  });

  // Simulated Payment Form
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'Alex Rivera',
    expiry: '12/28',
    cvv: '888',
    method: 'Simulated Visa Card'
  });

  const [errors, setErrors] = useState({});

  if (!event) return null;

  const isFree = !event.price || Number(event.price) === 0;
  const alreadyBooked = hasStudentBooked(event.id);
  const availableSeats = Math.max(0, event.capacity - (event.bookedSeats || 0));

  const validateDetails = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid college email is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!validateDetails()) return;

    if (isFree) {
      executeBooking('Free Registration');
    } else {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    executeBooking(paymentData.method);
  };

  const executeBooking = (method) => {
    setLoading(true);

    setTimeout(() => {
      const res = bookEvent({
        eventId: event.id,
        studentDetails: {
          id: user?.id,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          college: formData.college,
          phone: formData.phone
        },
        paymentDetails: {
          method: method
        }
      });

      setLoading(false);

      if (res.success) {
        setCreatedBooking(res.booking);
        setStep('confirmed');

        // Confetti burst
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        if (onBookingSuccess) {
          onBookingSuccess(res.booking);
        }
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-brand-600 to-indigo-600 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-200">
              Campus Event Registration
            </span>
            <h3 className="text-xl font-heading font-extrabold truncate max-w-md">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {alreadyBooked ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                You Already Have a Ticket!
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You have already registered for this event. You can view or download your digital ticket from your bookings page.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white hover:bg-brand-500 shadow-md"
                >
                  Close & View My Bookings
                </button>
              </div>
            </div>
          ) : step === 'confirmed' ? (
            /* Success Step */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-500/30 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  Registration Confirmed!
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your seat has been reserved and your digital e-ticket is ready.
                </p>
              </div>

              {createdBooking && (
                <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-left max-w-md mx-auto text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Booking Reference:</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                      {createdBooking.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Attendee:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {createdBooking.studentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Event Date:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 shadow-md flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  View Ticket in My Bookings
                </button>
              </div>
            </div>
          ) : step === 'payment' ? (
            /* Simulated Payment Step */
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Event Admission:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(event.price)}</span>
              </div>

              {/* Simulation Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Simulated Campus Checkout</p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                    This is a simulated transaction for testing. Pre-filled test payment values are provided. No real card will be charged.
                  </p>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardHolder}
                    onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                      required
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiry}
                      onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white text-center font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      value={paymentData.cvv}
                      maxLength={4}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white text-center font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : `Complete Simulated Payment (${formatPrice(event.price)})`}
                </button>
              </div>
            </form>
          ) : (
            /* Student Details Step */
            <form onSubmit={handleProceed} className="space-y-4">
              {/* Event quick info pill */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  <span>{formatEventDate(event.date, { short: true })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    placeholder="e.g. Alex Rivera"
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Campus Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      placeholder="alex@campus.edu"
                    />
                    {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      placeholder="Computer Science"
                    />
                    {errors.department && <p className="text-[11px] text-rose-500 mt-1">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      College / Institution
                    </label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      placeholder="Apex Institute of Technology"
                    />
                  </div>
                </div>
              </div>

              {/* Seats availability & Price Bar */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Available Seats: <strong className="text-emerald-600 dark:text-emerald-400">{availableSeats}</strong>
                </span>
                <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                  Total: {formatPrice(event.price)}
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || availableSeats <= 0}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isFree ? (
                    loading ? 'Confirming Booking...' : 'Confirm Free Registration'
                  ) : (
                    <>
                      <span>Proceed to Simulated Checkout ({formatPrice(event.price)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

