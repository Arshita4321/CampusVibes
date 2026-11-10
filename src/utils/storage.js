// CampusVibe LocalStorage Keys & Data Management Utilities

const KEYS = {
  USERS: 'cv_users',
  CURRENT_USER: 'cv_current_user',
  EVENTS: 'cv_events',
  BOOKINGS: 'cv_bookings',
  FAVORITES: 'cv_favorites',
  WAITLISTS: 'cv_waitlists',
  THEME: 'cv_theme',
  INITIALIZED: 'cv_initialized_v1'
};

// Default Demo Users
const DEFAULT_USERS = [
  {
    id: 'user_student_1',
    name: 'Alex Rivera',
    email: 'alex@campus.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    college: 'Apex Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    phone: '+1 (555) 382-9014',
    joinedDate: '2024-09-01'
  },
  {
    id: 'user_organizer_1',
    name: 'Dr. Elena Vance',
    email: 'organizer@campus.edu',
    password: 'password123',
    role: 'organizer',
    department: 'Student Affairs & Campus Events Board',
    college: 'Apex Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    phone: '+1 (555) 912-4029',
    joinedDate: '2023-01-15'
  }
];

// Helper to get formatted relative dates
const getDateAhead = (daysAhead, hour = 18, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

// Default Realistic Campus Events
const DEFAULT_EVENTS = [
  {
    id: 'evt_techfest_2025',
    title: 'HackVibe 2025: 36-Hour Campus Hackathon',
    category: 'Technical',
    description: 'The flagship annual 36-hour code sprint! Team up with fellow developers, UI/UX designers, and innovators to build transformative AI, Web3, and Mobile solutions. Mentorship from top tech leaders, unlimited coffee, swag bags, and $5,000 in cash prizes!',
    date: getDateAhead(3, 10, 0),
    endDate: getDateAhead(4, 22, 0),
    time: '10:00 AM - 10:00 PM',
    venue: 'Innovation & Robotics Complex, Hall A',
    price: 0,
    capacity: 150,
    bookedSeats: 124,
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Tech Council & ACM Chapter',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: true,
    tags: ['Coding', 'Hackathon', 'AI', 'Teams', 'Free Food']
  },
  {
    id: 'evt_pulse_music',
    title: 'Pulse 2025: Spring Music Fest & Battle of Bands',
    category: 'Cultural',
    description: 'Experience an electrifying campus evening featuring Indie bands, hip-hop cyphers, EDM drops, and the legendary inter-college Battle of the Bands. Food stalls, strobe light shows, and unforgettable campus vibes!',
    date: getDateAhead(7, 18, 30),
    endDate: getDateAhead(7, 23, 0),
    time: '06:30 PM - 11:00 PM',
    venue: 'Grand Open Air Amphitheatre',
    price: 15,
    capacity: 400,
    bookedSeats: 368,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Campus Cultural Society',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: true,
    tags: ['Music', 'Concert', 'Live Band', 'Festival']
  },
  {
    id: 'evt_ai_summit',
    title: 'NextGen AI & Autonomous Systems Summit',
    category: 'Technical',
    description: 'Explore the future of generative intelligence, humanoid robotics, and edge computing. Includes hands-on demo stations, autonomous drone races, and fireside talks with Silicon Valley researchers.',
    date: getDateAhead(10, 14, 0),
    endDate: getDateAhead(10, 18, 0),
    time: '02:00 PM - 06:00 PM',
    venue: 'Main University Auditorium',
    price: 10,
    capacity: 250,
    bookedSeats: 215,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'AI & Robotics Lab',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: false,
    tags: ['AI', 'Robotics', 'Tech Summit', 'Keynotes']
  },
  {
    id: 'evt_esports_championship',
    title: 'Inter-College Esports Championship 2025',
    category: 'Gaming',
    description: '5v5 Valorant showdown, Rocket League tourney, and EA FC 25 bracket. Broadcasted live on campus mega-screens with pro shoutcasters, high refresh rate rigs, and gaming hardware giveaways.',
    date: getDateAhead(5, 12, 0),
    endDate: getDateAhead(5, 20, 0),
    time: '12:00 PM - 08:00 PM',
    venue: 'Student Activity Arena, Gaming Pods',
    price: 5,
    capacity: 80,
    bookedSeats: 80, // Full event to test waitlist!
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Campus Gaming Guild',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: false,
    tags: ['Esports', 'Gaming', 'Valorant', 'Tourney']
  },
  {
    id: 'evt_film_gala',
    title: 'Student Short Film Festival & Red Carpet Gala',
    category: 'Arts',
    description: 'Celebrating student filmmakers and visual storytellers. Watch 10 shortlisted student indie films followed by an awards jury ceremony, director Q&A, and red carpet mocktail social.',
    date: getDateAhead(14, 17, 0),
    endDate: getDateAhead(14, 21, 30),
    time: '05:00 PM - 09:30 PM',
    venue: 'Media Arts Screening Theatre (Block C)',
    price: 0,
    capacity: 120,
    bookedSeats: 74,
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Department of Media & Fine Arts',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: true,
    tags: ['Cinema', 'Film', 'Arts', 'Red Carpet']
  },
  {
    id: 'evt_startup_pitch',
    title: 'VentureVibe: Student Startup Pitch & Angel Den',
    category: 'Business',
    description: 'Pitch your entrepreneurial venture to real angel investors and venture capitalists! 12 student founder teams compete for $25,000 in non-dilutive seed funding, incubator space, and cloud credits.',
    date: getDateAhead(18, 13, 0),
    endDate: getDateAhead(18, 17, 30),
    time: '01:00 PM - 05:30 PM',
    venue: 'Executive MBA Conference Suite',
    price: 0,
    capacity: 110,
    bookedSeats: 88,
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Center for Entrepreneurship',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: false,
    tags: ['Startup', 'Pitch', 'Business', 'Funding']
  },
  {
    id: 'evt_sports_track',
    title: 'Annual Varsity Track & Field Invitational',
    category: 'Sports',
    description: 'Cheer on collegiate athletes or register to compete in sprints, hurdles, 4x100m relay, long jump, and tug of war. Medals, trophies, refreshments, and athletic recruiter scouts present.',
    date: getDateAhead(21, 9, 0),
    endDate: getDateAhead(21, 16, 0),
    time: '09:00 AM - 04:00 PM',
    venue: 'University Olympic Athletics Track & Stadium',
    price: 0,
    capacity: 350,
    bookedSeats: 160,
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Varsity Athletics Department',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: false,
    tags: ['Sports', 'Track & Field', 'Varsity', 'Athletics']
  },
  {
    id: 'evt_mindfulness',
    title: 'Mindful Horizons: Wellness & Sound Bath Workshop',
    category: 'Workshop',
    description: 'Take a break from midterm stress. Guided breathwork, mindfulness meditation, Tibetan singing bowl sound bath, and practical cognitive balance strategies led by licensed wellness facilitators.',
    date: getDateAhead(8, 16, 0),
    endDate: getDateAhead(8, 18, 0),
    time: '04:00 PM - 06:00 PM',
    venue: 'Campus Botanical Garden Gazebo',
    price: 0,
    capacity: 45,
    bookedSeats: 32,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
    organizerId: 'user_organizer_1',
    organizerName: 'Student Mental Wellness Coalition',
    organizerEmail: 'organizer@campus.edu',
    status: 'published',
    featured: false,
    tags: ['Wellness', 'Mental Health', 'Meditation', 'Relaxation']
  }
];

// Initial bookings (Alex Rivera already has a ticket to HackVibe!)
const DEFAULT_BOOKINGS = [
  {
    id: 'CV-BK-882194',
    eventId: 'evt_techfest_2025',
    eventTitle: 'HackVibe 2025: 36-Hour Campus Hackathon',
    eventDate: DEFAULT_EVENTS[0].date,
    eventVenue: 'Innovation & Robotics Complex, Hall A',
    eventCategory: 'Technical',
    studentId: 'user_student_1',
    studentName: 'Alex Rivera',
    studentEmail: 'alex@campus.edu',
    studentDepartment: 'Computer Science & Engineering',
    studentCollege: 'Apex Institute of Technology',
    studentPhone: '+1 (555) 382-9014',
    bookingDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'confirmed',
    ticketPrice: 0,
    seatsCount: 1,
    paymentMethod: 'Free Registration',
    paymentStatus: 'Completed',
    qrPayload: JSON.stringify({
      ticketId: 'CV-BK-882194',
      event: 'HackVibe 2025: 36-Hour Campus Hackathon',
      name: 'Alex Rivera',
      dept: 'CSE',
      valid: true
    })
  },
  {
    id: 'CV-BK-731902',
    eventId: 'evt_pulse_music',
    eventTitle: 'Pulse 2025: Spring Music Fest & Battle of Bands',
    eventDate: DEFAULT_EVENTS[1].date,
    eventVenue: 'Grand Open Air Amphitheatre',
    eventCategory: 'Cultural',
    studentId: 'user_student_demo_2',
    studentName: 'Sarah Jenkins',
    studentEmail: 'sarah.j@campus.edu',
    studentDepartment: 'Business Administration',
    studentCollege: 'Apex Institute of Technology',
    studentPhone: '+1 (555) 762-1190',
    bookingDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'confirmed',
    ticketPrice: 15,
    seatsCount: 1,
    paymentMethod: 'Simulated Card (Visa ending in 4242)',
    paymentStatus: 'Completed',
    qrPayload: JSON.stringify({
      ticketId: 'CV-BK-731902',
      event: 'Pulse 2025: Spring Music Fest',
      name: 'Sarah Jenkins',
      dept: 'Business',
      valid: true
    })
  },
  {
    id: 'CV-BK-642199',
    eventId: 'evt_ai_summit',
    eventTitle: 'NextGen AI & Autonomous Systems Summit',
    eventDate: DEFAULT_EVENTS[2].date,
    eventVenue: 'Main University Auditorium',
    eventCategory: 'Technical',
    studentId: 'user_student_demo_3',
    studentName: 'Liam Chen',
    studentEmail: 'liam.chen@campus.edu',
    studentDepartment: 'Electrical & Computer Engineering',
    studentCollege: 'Apex Institute of Technology',
    studentPhone: '+1 (555) 489-3220',
    bookingDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'confirmed',
    ticketPrice: 10,
    seatsCount: 1,
    paymentMethod: 'Simulated Card (Mastercard ending in 8890)',
    paymentStatus: 'Completed',
    qrPayload: JSON.stringify({
      ticketId: 'CV-BK-642199',
      event: 'NextGen AI & Autonomous Systems Summit',
      name: 'Liam Chen',
      dept: 'ECE',
      valid: true
    })
  }
];

// Initialize Storage with Sample Data on First Run
export const initStorage = () => {
  if (typeof window === 'undefined') return;

  const initialized = localStorage.getItem(KEYS.INITIALIZED);
  if (!initialized) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(['evt_techfest_2025', 'evt_pulse_music']));
    localStorage.setItem(KEYS.WAITLISTS, JSON.stringify([]));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0])); // Default logged in as student for seamless demo
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
};

// Generic safe JSON getter & setter
export const getFromStorage = (key, fallback = null) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

export { KEYS, DEFAULT_USERS, DEFAULT_EVENTS, DEFAULT_BOOKINGS };

