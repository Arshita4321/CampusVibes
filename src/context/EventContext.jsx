import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  KEYS,
  getFromStorage,
  saveToStorage,
  DEFAULT_EVENTS,
  DEFAULT_BOOKINGS,
  initStorage
} from '../utils/storage';
import { generateBookingId } from '../utils/booking';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  // Ensure default storage initialized
  useEffect(() => {
    initStorage();
  }, []);

  const { user } = useAuth();
  const { success, error, info, warning } = useToast();

  const [events, setEvents] = useState(() => getFromStorage(KEYS.EVENTS, DEFAULT_EVENTS));
  const [bookings, setBookings] = useState(() => getFromStorage(KEYS.BOOKINGS, DEFAULT_BOOKINGS));
  const [favorites, setFavorites] = useState(() => getFromStorage(KEYS.FAVORITES, []));
  const [waitlists, setWaitlists] = useState(() => getFromStorage(KEYS.WAITLISTS, []));

  // Sync to local storage on changes
  useEffect(() => {
    saveToStorage(KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveToStorage(KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    saveToStorage(KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    saveToStorage(KEYS.WAITLISTS, waitlists);
  }, [waitlists]);

  // Toggle favorite event
  const toggleFavorite = (eventId) => {
    setFavorites((prev) => {
      const isFav = prev.includes(eventId);
      let next;
      if (isFav) {
        next = prev.filter((id) => id !== eventId);
        info('Removed from your saved events');
      } else {
        next = [...prev, eventId];
        success('Added to your saved events! ❤️');
      }
      return next;
    });
  };

  const isFavorite = (eventId) => favorites.includes(eventId);

  // Check if current student has an active booking for this event
  const hasStudentBooked = (eventId, studentId = user?.id) => {
    if (!studentId) return false;
    return bookings.some(
      (b) => b.eventId === eventId && b.studentId === studentId && b.status === 'confirmed'
    );
  };

  // Check if current student is on waitlist
  const isStudentOnWaitlist = (eventId, studentId = user?.id) => {
    if (!studentId) return false;
    return waitlists.some((w) => w.eventId === eventId && w.studentId === studentId);
  };

  // Book an event
  const bookEvent = ({ eventId, studentDetails, paymentDetails = {} }) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      error('Event not found.');
      return { success: false, message: 'Event not found.' };
    }

    if (event.status !== 'published') {
      error('This event is currently not open for registration.');
      return { success: false, message: 'Event not published.' };
    }

    // Check capacity
    const availableSeats = event.capacity - (event.bookedSeats || 0);
    if (availableSeats <= 0) {
      warning('This event is sold out! You can join the waitlist instead.');
      return { success: false, message: 'Event is full.', isFull: true };
    }

    const studentId = studentDetails.id || user?.id || `guest_${Date.now()}`;

    // Prevent duplicate booking
    const duplicate = bookings.find(
      (b) => b.eventId === eventId && b.studentId === studentId && b.status === 'confirmed'
    );
    if (duplicate) {
      warning('You already have a confirmed ticket for this event!');
      return { success: false, message: 'Already booked.', booking: duplicate };
    }

    const bookingId = generateBookingId();
    const qrPayload = JSON.stringify({
      ticketId: bookingId,
      eventId: event.id,
      eventTitle: event.title,
      studentName: studentDetails.name,
      studentEmail: studentDetails.email,
      date: event.date,
      venue: event.venue,
      timestamp: Date.now()
    });

    const newBooking = {
      id: bookingId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      eventCategory: event.category,
      studentId: studentId,
      studentName: studentDetails.name,
      studentEmail: studentDetails.email,
      studentDepartment: studentDetails.department || 'General',
      studentCollege: studentDetails.college || 'Tech University',
      studentPhone: studentDetails.phone || 'N/A',
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      ticketPrice: event.price,
      seatsCount: 1,
      paymentMethod: event.price > 0 ? (paymentDetails.method || 'Simulated Card') : 'Free Registration',
      paymentStatus: 'Completed',
      qrPayload
    };

    // Update event seat count
    const updatedEvents = events.map((e) =>
      e.id === eventId ? { ...e, bookedSeats: (e.bookedSeats || 0) + 1 } : e
    );

    // If student was on waitlist, remove them
    setWaitlists((prev) => prev.filter((w) => !(w.eventId === eventId && w.studentId === studentId)));

    setEvents(updatedEvents);
    setBookings((prev) => [newBooking, ...prev]);

    success(`🎉 Registration confirmed! Booking ID: ${bookingId}`);
    return { success: true, booking: newBooking };
  };

  // Cancel a booking and release seat
  const cancelBooking = (bookingId) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) {
      error('Booking not found.');
      return false;
    }

    if (targetBooking.status === 'cancelled') {
      info('This booking is already cancelled.');
      return false;
    }

    // Mark booking cancelled
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } : b
    );

    // Release seat on the event
    const updatedEvents = events.map((e) => {
      if (e.id === targetBooking.eventId) {
        return {
          ...e,
          bookedSeats: Math.max(0, (e.bookedSeats || 1) - 1)
        };
      }
      return e;
    });

    setBookings(updatedBookings);
    setEvents(updatedEvents);

    success(`Booking ${bookingId} cancelled. Your seat has been released.`);
    return true;
  };

  // Join waitlist
  const joinWaitlist = (eventId, studentDetails) => {
    const studentId = studentDetails.id || user?.id;
    if (!studentId) {
      error('Please log in to join the waitlist.');
      return false;
    }

    const alreadyWaiting = waitlists.some(
      (w) => w.eventId === eventId && w.studentId === studentId
    );
    if (alreadyWaiting) {
      info('You are already on the waitlist for this event.');
      return false;
    }

    const event = events.find((e) => e.id === eventId);
    const newEntry = {
      id: `wl_${Date.now()}`,
      eventId,
      eventTitle: event ? event.title : 'Campus Event',
      studentId,
      studentName: studentDetails.name,
      studentEmail: studentDetails.email,
      studentDepartment: studentDetails.department,
      createdAt: new Date().toISOString()
    };

    setWaitlists((prev) => [...prev, newEntry]);
    success("You've been added to the waitlist! We'll notify you if a seat opens up.");
    return true;
  };

  // Organizer: Create new event
  const createEvent = (eventData) => {
    const newEvent = {
      id: `evt_${Date.now()}`,
      title: eventData.title.trim(),
      category: eventData.category,
      description: eventData.description.trim(),
      date: eventData.date,
      endDate: eventData.endDate || eventData.date,
      time: eventData.time || '10:00 AM - 04:00 PM',
      venue: eventData.venue.trim(),
      price: Number(eventData.price) || 0,
      capacity: Number(eventData.capacity) || 50,
      bookedSeats: 0,
      coverImage: eventData.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
      organizerId: user?.id || 'user_organizer_1',
      organizerName: user?.name || 'Campus Events Board',
      organizerEmail: user?.email || 'organizer@campus.edu',
      status: eventData.status || 'published',
      featured: !!eventData.featured,
      tags: eventData.tags || [eventData.category]
    };

    setEvents((prev) => [newEvent, ...prev]);
    success(`Event "${newEvent.title}" created successfully!`);
    return newEvent;
  };

  // Organizer: Update existing event
  const updateEvent = (eventId, updatedData) => {
    const existing = events.find((e) => e.id === eventId);
    if (!existing) {
      error('Event not found.');
      return false;
    }

    if (updatedData.capacity && updatedData.capacity < (existing.bookedSeats || 0)) {
      error(`Capacity cannot be lower than existing bookings (${existing.bookedSeats}).`);
      return false;
    }

    const updated = events.map((e) => (e.id === eventId ? { ...e, ...updatedData } : e));
    setEvents(updated);
    success('Event updated successfully!');
    return true;
  };

  // Organizer: Delete event
  const deleteEvent = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    const activeBookings = bookings.filter((b) => b.eventId === eventId && b.status === 'confirmed');

    if (activeBookings.length > 0) {
      warning(`Event deleted. Note: ${activeBookings.length} existing student registrations were archived.`);
    } else {
      success('Event deleted successfully.');
    }

    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    return true;
  };

  // Organizer: Toggle publish status
  const togglePublish = (eventId) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextStatus = e.status === 'published' ? 'draft' : 'published';
          info(`Event is now ${nextStatus === 'published' ? 'Public' : 'Draft (Hidden)'}`);
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  // Organizer Analytics calculation helper
  const getAnalytics = () => {
    const totalEvents = events.length;
    const publishedEvents = events.filter((e) => e.status === 'published').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
    const totalBookings = confirmedBookings.length;
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.ticketPrice) || 0), 0);

    const now = new Date();
    const upcomingEvents = events.filter((e) => new Date(e.date) >= now);

    // Unique students registered
    const uniqueStudents = new Set(confirmedBookings.map((b) => b.studentEmail)).size;

    // Registrations per event (for bar chart)
    const eventRegistrationData = events.slice(0, 8).map((evt) => {
      const count = bookings.filter((b) => b.eventId === evt.id && b.status === 'confirmed').length;
      return {
        name: evt.title.length > 18 ? evt.title.substring(0, 16) + '...' : evt.title,
        fullTitle: evt.title,
        bookings: count,
        capacity: evt.capacity,
        occupancy: evt.capacity > 0 ? Math.round((count / evt.capacity) * 100) : 0
      };
    });

    // Categories breakdown (for pie chart)
    const categoryCounts = {};
    events.forEach((evt) => {
      categoryCounts[evt.category] = (categoryCounts[evt.category] || 0) + 1;
    });
    const categoryData = Object.keys(categoryCounts).map((cat) => ({
      name: cat,
      value: categoryCounts[cat]
    }));

    return {
      totalEvents,
      publishedEvents,
      totalBookings,
      totalRevenue,
      upcomingCount: upcomingEvents.length,
      uniqueStudents,
      eventRegistrationData,
      categoryData
    };
  };

  return (
    <EventContext.Provider
      value={{
        events,
        bookings,
        favorites,
        waitlists,
        toggleFavorite,
        isFavorite,
        hasStudentBooked,
        isStudentOnWaitlist,
        bookEvent,
        cancelBooking,
        joinWaitlist,
        createEvent,
        updateEvent,
        deleteEvent,
        togglePublish,
        getAnalytics
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

