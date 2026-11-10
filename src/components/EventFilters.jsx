import React from 'react';
import { Filter, RotateCcw, Calendar, DollarSign, ArrowUpDown, Tag } from 'lucide-react';

export const EventFilters = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  dateFilter,
  setDateFilter,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy,
  onResetFilters,
  totalResults = 0
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    dateFilter !== 'all' ||
    priceFilter !== 'all' ||
    sortBy !== 'upcoming';

  return (
    <aside className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
            Filter & Sort
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-500" />
          Sort Events
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          <option value="upcoming">Upcoming Date (Soonest first)</option>
          <option value="popular">Most Popular (Bookings)</option>
          <option value="price-asc">Price: Free & Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title">Alphabetical (A - Z)</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Tag className="w-3.5 h-3.5 text-brand-500" />
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-brand-500" />
          Date Window
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Anytime' },
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDateFilter(item.id)}
              className={`py-2 px-2 text-xs font-semibold rounded-lg text-center transition-all ${
                dateFilter === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <DollarSign className="w-3.5 h-3.5 text-brand-500" />
          Admission Price
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'free', label: 'Free' },
            { id: 'paid', label: 'Paid' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPriceFilter(item.id)}
              className={`py-2 px-1 text-xs font-semibold rounded-lg text-center transition-all ${
                priceFilter === item.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        Showing <span className="font-bold text-brand-600 dark:text-brand-400">{totalResults}</span> matches
      </div>
    </aside>
  );
};

