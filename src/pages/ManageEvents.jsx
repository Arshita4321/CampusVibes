import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Users,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { formatEventDate, formatPrice } from '../utils/booking';
import { ConfirmModal } from '../components/ConfirmModal';

const PRESET_IMAGES = [
  { name: 'Hackathon / Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Concert / Music', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Auditorium / Summit', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Gaming / Esports', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Sports / Track', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Business / Pitch', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Wellness / Workshop', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000' }
];

export const ManageEvents = () => {
  const { events, createEvent, updateEvent, deleteEvent, togglePublish } = useEvents();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Form state
  const initialFormState = {
    title: '',
    category: 'Technical',
    description: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    price: 0,
    capacity: 100,
    coverImage: PRESET_IMAGES[0].url,
    featured: false,
    status: 'published'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Open Create Modal
  const handleOpenCreate = () => {
    // Default date: 7 days ahead
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const dateStr = d.toISOString().split('T')[0];

    setFormData({
      ...initialFormState,
      date: dateStr
    });
    setFormErrors({});
    setModalMode('create');
  };

  // Open Edit Modal
  const handleOpenEdit = (event) => {
    setEventToEdit(event);
    setFormData({
      title: event.title,
      category: event.category,
      description: event.description,
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time || '10:00 AM - 04:00 PM',
      venue: event.venue,
      price: event.price || 0,
      capacity: event.capacity,
      coverImage: event.coverImage,
      featured: !!event.featured,
      status: event.status
    });
    setFormErrors({});
    setModalMode('edit');
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) {
      errors.date = 'Event date is required';
    } else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.date = 'Event date cannot be in the past';
      }
    }
    if (!formData.venue.trim()) errors.venue = 'Venue location is required';

    const capNum = Number(formData.capacity);
    if (isNaN(capNum) || capNum <= 0) {
      errors.capacity = 'Capacity must be a positive number greater than 0';
    } else if (modalMode === 'edit' && eventToEdit && capNum < (eventToEdit.bookedSeats || 0)) {
      errors.capacity = `Capacity cannot be lower than existing bookings (${eventToEdit.bookedSeats || 0})`;
    }

    if (Number(formData.price) < 0) {
      errors.price = 'Price cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === 'create') {
      createEvent({
        ...formData,
        date: new Date(formData.date).toISOString()
      });
    } else if (modalMode === 'edit' && eventToEdit) {
      updateEvent(eventToEdit.id, {
        ...formData,
        date: new Date(formData.date).toISOString()
      });
    }

    setModalMode(null);
    setEventToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  // Filtered events
  const displayedEvents = events.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Create Event Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Campus Administration
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
            Manage Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create, edit, schedule, publish, and track capacity for all university activities.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 active:scale-98 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or venue..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <div className="flex gap-1">
            {['all', 'published', 'draft'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Event Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Price</th>
                <th className="p-4">Occupancy / Capacity</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedEvents.map((evt) => {
                const booked = evt.bookedSeats || 0;
                const capacity = evt.capacity || 1;
                const occupancyRate = Math.round((booked / capacity) * 100);
                const isPublished = evt.status === 'published';

                return (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.coverImage}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <Link
                            to={`/events/${evt.id}`}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1"
                          >
                            {evt.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {evt.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {evt.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{formatEventDate(evt.date, { short: true })}</p>
                      <p className="text-[10px] text-slate-400">{evt.time}</p>
                    </td>

                    <td className="p-4 max-w-xs truncate">{evt.venue}</td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">{formatPrice(evt.price)}</td>

                    <td className="p-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold">{booked} / {capacity}</span>
                          <span className="text-slate-400">{occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancyRate >= 100 ? 'bg-rose-500' : 'bg-brand-600'
                            }`}
                            style={{ width: `${Math.min(100, occupancyRate)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(evt.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          isPublished
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{evt.status}</span>
                      </button>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEventToDelete(evt)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Event Management
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                  {modalMode === 'create' ? 'Create New Campus Event' : 'Edit Event Details'}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  placeholder="e.g. AI Innovation Summit 2025"
                />
                {formErrors.title && <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>}
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                    <option value="Business">Business</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="published">Published (Visible to Students)</option>
                    <option value="draft">Draft (Hidden from Catalog)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                  placeholder="Describe the activities, guest speakers, eligibility, refreshments, and perks..."
                />
                {formErrors.description && <p className="text-[11px] text-rose-500 mt-1">{formErrors.description}</p>}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  {formErrors.date && <p className="text-[11px] text-rose-500 mt-1">{formErrors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Venue Location *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  placeholder="e.g. Main Auditorium, Block A, Room 302"
                />
                {formErrors.venue && <p className="text-[11px] text-rose-500 mt-1">{formErrors.venue}</p>}
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  {formErrors.capacity && <p className="text-[11px] text-rose-500 mt-1">{formErrors.capacity}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Admission Price ($) — 0 for Free
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  {formErrors.price && <p className="text-[11px] text-rose-500 mt-1">{formErrors.price}</p>}
                </div>
              </div>

              {/* Cover Image URL & Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Quick Presets:</span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.name}
                      onClick={() => setFormData({ ...formData, coverImage: img.url })}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Feature this event on CampusVibe homepage spotlight
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20"
                >
                  {modalMode === 'create' ? 'Create & Publish Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {eventToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Campus Event?"
          message={`Are you sure you want to permanently delete "${eventToDelete.title}"? Note: Any existing attendee records for this event will be impacted.`}
          confirmLabel="Delete Event"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
};

