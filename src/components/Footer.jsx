import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Heart,
  Globe,
  Calendar,
  Compass,
  ShieldCheck,
  Server
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-400 dark:to-accent-400 bg-clip-text text-transparent font-heading">
                CampusVibe
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              The premier campus event discovery, ticket booking, and seat management portal for college universities. Discover hackathons, cultural festivals, sports tourneys, and student workshops in real-time.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Campus Hub Live
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Server className="w-3 h-3 text-brand-500" />
                AWS EC2 Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  My Booked Tickets
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Student Profile
                </Link>
              </li>
              <li>
                <Link to="/organizer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore?category=Technical" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Technical & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Cultural" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Cultural & Music
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Sports" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Sports & Esports
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Arts" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Arts & Cinema
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Business" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Business & Startups
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
              Campus Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Student Affairs Center, North Campus, Apex University</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>events@campusvibe.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+1 (800) CAMPUS-VB</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Official University Portal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CampusVibe Inc. All campus rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400">
              About Project
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-500">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Collegiate Communities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

