// Booking utilities, formatting, ticket generation & CSV exporter

/**
 * Generate a unique booking ID with prefix CV-BK-
 */
export const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CV-BK-${result}`;
};

/**
 * Formats ISO date string to a human-readable campus format
 */
export const formatEventDate = (dateString, options = {}) => {
  if (!dateString) return 'Date TBA';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    if (options.short) {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    if (options.includeTime) {
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Formats price
 */
export const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num === 0) {
    return 'Free';
  }
  return `$${num.toFixed(2)}`;
};

/**
 * Converts a list of registrations to CSV and downloads it
 */
export const exportRegistrationsToCSV = (registrations, eventTitle = 'All_Events') => {
  if (!registrations || registrations.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const headers = [
    'Booking ID',
    'Student Name',
    'Student Email',
    'Department',
    'College',
    'Phone',
    'Event Title',
    'Event Date',
    'Venue',
    'Ticket Price',
    'Seats',
    'Status',
    'Payment Method',
    'Booked On'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = registrations.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.studentName),
    escapeCSV(r.studentEmail),
    escapeCSV(r.studentDepartment || 'N/A'),
    escapeCSV(r.studentCollege || 'N/A'),
    escapeCSV(r.studentPhone || 'N/A'),
    escapeCSV(r.eventTitle),
    escapeCSV(r.eventDate ? formatEventDate(r.eventDate, { includeTime: true }) : 'N/A'),
    escapeCSV(r.eventVenue || 'N/A'),
    escapeCSV(formatPrice(r.ticketPrice)),
    escapeCSV(r.seatsCount || 1),
    escapeCSV(r.status),
    escapeCSV(r.paymentMethod || 'Free'),
    escapeCSV(r.bookingDate ? new Date(r.bookingDate).toLocaleString() : 'N/A')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedTitle = eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `CampusVibe_Registrations_${sanitizedTitle}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

