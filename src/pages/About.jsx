import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Server,
  ShieldCheck,
  QrCode,
  BarChart3,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Collegiate Life Reimagined</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-heading">
          About CampusVibe Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          CampusVibe is the premier collegiate event discovery, seat reservation, and digital ticketing ecosystem designed to unify students, clubs, academic councils, and campus organizers.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Digital E-Tickets & QR Codes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every booking produces a verifiable digital boarding pass complete with high-resolution QR codes encoding the student's booking reference and event details.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Organizer Visual Analytics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Powered by Recharts, campus hosts can visualize attendee breakdowns, category popularities, seat occupancy rates, and download CSV rosters in one click.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            AWS EC2 & DevOps Ready
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Engineered as a clean client-side SPA with Vite production build, LocalStorage synchronization, and optimized Nginx configuration for Ubuntu AWS EC2 hosting.
          </p>
        </div>
      </div>

      {/* Demo Credentials Guide */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            Pre-Configured Demo Accounts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For rapid evaluation, you can switch roles anytime using the top navigation pill or sign in with:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Student Account</span>
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
              Email: <strong>alex@campus.edu</strong><br />
              Password: <strong>password123</strong><br />
              Role: Student (Alex Rivera, CSE)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Organizer Account</span>
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
              Email: <strong>organizer@campus.edu</strong><br />
              Password: <strong>password123</strong><br />
              Role: Organizer (Dr. Elena Vance, Campus Board)
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-4">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25"
        >
          <span>Start Exploring Campus Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

