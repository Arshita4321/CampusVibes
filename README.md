# 🎟️ CampusVibe – Campus Event Discovery, Registration & Booking Platform

> A modern, responsive React.js web platform built for college students and organizers to discover events, book seats, generate digital QR-code passes, and track registrations with live analytics.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![AWS Ready](https://img.shields.io/badge/Deployment-AWS%20EC2%20%7C%20Nginx-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

---

## 🌟 Key Features

### 🎓 1. Student Features
- **Student Authentication & Role Control:**
  - Register with Student Name, Campus Email, Department, College, and Phone.
  - Role-based navigation with instant 1-click **Demo Switcher** (Student ↔ Organizer) in the header.
- **Explore Campus Catalog:**
  - Modern cards showing event cover photo, title, date, time, venue, price badge, and live seat counter.
  - Full-text search by title, venue, or keywords.
  - Multi-parameter filtering by **Category** (*Technical, Cultural, Sports, Arts, Business, Gaming, Workshop*), **Date Window** (*Today, This Week, This Month, Anytime*), and **Admission** (*Free Only, Paid Only*).
  - Sorting by **Upcoming Date**, **Popularity (Bookings)**, **Price: Low to High**, **Price: High to Low**, and **Alphabetical**.
- **Interactive Event Details:**
  - Venue map details, host organization badge, timeline agenda, and campus guidelines.
  - Dynamic seat capacity progress meter (e.g., *18 seats remaining / 88% filled*).
  - Prevents double-booking: detects if student already has a confirmed pass.
  - **Waitlist Functionality:** If an event is sold out, students can join the priority waitlist.
- **Instant Booking & Simulated Checkout:**
  - One-click free registration or simulated card checkout for paid events with live loading state and zero real charges.
  - Celebratory confetti explosion (`canvas-confetti`) on confirmed booking!
- **Digital Boarding Pass Tickets with Real QR Codes:**
  - High-resolution QR codes generated dynamically using `qrcode.react`.
  - Scannable payload containing ticket reference ID, student name, and event verification tokens.
  - Built-in **Print / Save PDF** action.
- **My Bookings Portal:**
  - Filter by **Upcoming Passes**, **Completed Events**, and **Cancelled**.
  - One-click cancellation with **automatic seat release** back to the campus pool.
- **Student Profile & Wishlist:**
  - Editable student personal info.
  - Saved favorites wishlist with 1-click booking.
  - Next upcoming event reminder notification banner.

---

### 🏛️ 2. Organizer Dashboard & Administration
- **Live Recharts Analytics:**
  - **KPI Metrics:** Total Events, Total Registrations, Upcoming Events, Total Students.
  - **Event-Wise Registrations (Bar Chart):** Visual comparison of student demand per event.
  - **Category Breakdown (Donut Chart):** Distribution of events across campus genres.
  - **Seat Occupancy Tracker:** Live percentage of filled seats across campus venues.
- **Full Event CRUD Management (`/organizer/events`):**
  - **Create New Event:** Modal with validation (Title, Category, Description, Date, Time, Venue, Capacity, Price, Cover Image, Spotlight Featured).
  - **Edit Event:** Update event details (validates that new capacity is not lower than already-booked seats).
  - **Delete Event:** Confirmation dialog before permanent removal.
  - **Publish / Unpublish Toggle:** Instantly toggle between Public and Draft states.
- **Registrations & Attendee Roster (`/organizer/registrations`):**
  - Full roster table displaying student name, email, department, college, ticket price, and payment method.
  - Filter registrations by specific event and status (*Confirmed / Cancelled*).
  - Search by student name or booking reference ID.
  - **Export to CSV:** One-click instant CSV roster download (`CampusVibe_Registrations_*.csv`).

---

### 🎨 3. Design & User Experience
- **Modern Color Palette:** Purple, indigo, electric blue, and crisp white/slate with glowing accents.
- **Dark Mode & Light Mode:** Seamless toggle with system preference detection.
- **Toast Notifications:** Automatic feedback toasts for booking, cancellation, profile updates, and favorites.
- **Fully Responsive:** Custom mobile drawer, touch-friendly filter sheets, and responsive grids.

---

## 🔑 Demo Accounts (Pre-Seeded)

The platform comes pre-seeded with sample users and realistic campus events in `LocalStorage`. You can switch between them in **1 click** using the header toggle or log in with:

| Role | Email | Password | Department & College |
| :--- | :--- | :--- | :--- |
| **Student** | `alex@campus.edu` | `password123` | Computer Science & Engineering, Apex Institute |
| **Organizer** | `organizer@campus.edu` | `password123` | Campus Events & Student Affairs Board |

---

## 🛠️ Technology Stack

- **Frontend:** React 18 (Vite SPA)
- **Language:** JavaScript (ESNext, JSX)
- **Styling:** Tailwind CSS 3.4 & PostCSS
- **Routing:** React Router DOM 6.28
- **Icons:** Lucide React
- **Charts & Analytics:** Recharts 2.13
- **QR Code Engine:** `qrcode.react` 4.2
- **Animation Effects:** `canvas-confetti`
- **Data Persistence:** Browser `LocalStorage`
- **Infrastructure / DevOps:**
  - Ubuntu 22.04 LTS (AWS EC2)
  - Nginx (Reverse Proxy & Static Web Server)
  - Terraform (Infrastructure as Code)
  - Ansible (Configuration Management & Deployment)

---

## 📂 Project Directory Structure

```
DevopsProject/
├── index.html                   # HTML entry point with modern fonts
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite build & chunk splitting configuration
├── tailwind.config.js           # Custom theme colors (brand & accent)
├── postcss.config.js            # PostCSS configuration
├── nginx.conf                   # Production Nginx virtual host with SPA routing
├── deploy-ec2.sh                # Direct EC2 setup and deployment script
├── README.md                    # Documentation
├── public/
│   └── logo.svg                 # CampusVibe SVG brand logo
└── src/
    ├── main.jsx                 # React root render
    ├── App.jsx                  # Route definitions & protection guards
    ├── index.css                # Tailwind directives & glassmorphic utilities
    ├── components/
    │   ├── Navbar.jsx           # Responsive navigation with demo role switcher
    │   ├── Footer.jsx           # Campus links & info
    │   ├── EventCard.jsx        # Reusable card with live seats & favorite
    │   ├── SearchBar.jsx        # Search input with quick category pills
    │   ├── EventFilters.jsx     # Filtering by category, date, price & sorting
    │   ├── BookingModal.jsx     # Checkout, student info, simulated payment & confetti
    │   ├── TicketCard.jsx       # Boarding-pass digital ticket with QR code & print
    │   ├── ConfirmModal.jsx     # Modal for cancellations & deletions
    │   └── WaitlistModal.jsx    # Modal for full event waitlists
    ├── pages/
    │   ├── Home.jsx             # Hero, categories, featured, trending, steps & CTA
    │   ├── ExploreEvents.jsx    # Complete catalog search & filter
    │   ├── EventDetails.jsx     # Full info, live seats, organizer card & booking
    │   ├── MyBookings.jsx       # Upcoming, completed & cancelled passes
    │   ├── Profile.jsx          # Editable student info, stats & wishlist
    │   ├── StudentDashboard.jsx # Next event countdown & recommendations
    │   ├── OrganizerDashboard.jsx# Recharts analytics, metrics & recent bookings
    │   ├── ManageEvents.jsx     # Organizer event CRUD modal & status toggles
    │   ├── ManageRegistrations.jsx# Attendee roster, search & CSV export
    │   ├── Login.jsx            # Sign in with 1-click demo buttons
    │   ├── Register.jsx         # Student / Organizer registration
    │   └── About.jsx            # Platform story, mission & guide
    ├── context/
    │   ├── AuthContext.jsx      # User state, demo switcher, login/register
    │   ├── EventContext.jsx     # Events, bookings, waitlists, favorites CRUD
    │   ├── ThemeContext.jsx     # Dark & light theme toggle
    │   └── ToastContext.jsx     # Lightweight notification system
    └── utils/
        ├── storage.js           # LocalStorage seed data & accessors
        └── booking.js           # ID generator, date formatter & CSV exporter
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js `v18.0.0` or later (`v20+` recommended)
- `npm` or `yarn`

### 2. Clone & Install
```bash
# Navigate to the project directory
cd DevopsProject

# Install project dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized, minified production assets will be generated in the `dist/` directory.

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## 🚀 AWS EC2 & Nginx Deployment Guide

### Direct Deployment on Ubuntu EC2

#### 1. Launch an Ubuntu 22.04 LTS EC2 Instance
- Ensure Security Group allows inbound rules for:
  - Port `22` (SSH)
  - Port `80` (HTTP)
  - Port `443` (HTTPS)

#### 2. Connect to your EC2 instance
```bash
ssh -i ~/.ssh/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

#### 3. Run the automated deployment script (or deploy manually)
```bash
# Transfer the repo / build files to your EC2 instance and run:
sudo bash deploy-ec2.sh
```

#### 4. Manual Deployment Alternative
```bash
# 1. Install Nginx
sudo apt update && sudo apt install -y nginx

# 2. Build and copy dist files
npm run build
sudo mkdir -p /var/www/campusvibe/dist
sudo cp -r dist/* /var/www/campusvibe/dist/
sudo chown -R www-data:www-data /var/www/campusvibe

# 3. Apply Nginx SPA configuration
sudo cp nginx.conf /etc/nginx/sites-available/campusvibe
sudo ln -sf /etc/nginx/sites-available/campusvibe /etc/nginx/sites-enabled/campusvibe
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Access the Application
Open `http://YOUR_EC2_PUBLIC_IP` in your browser. All React Router routes (`/explore`, `/my-bookings`, `/organizer`, `/profile`) will resolve seamlessly via Nginx's `try_files $uri $uri/ /index.html;`.

---

## 🧪 Verification & Acceptance Criteria

- [x] **No backend required:** All data operations are managed locally with persistent, synchronized `LocalStorage`.
- [x] **Zero broken buttons:** Every interactive element (filters, booking, modals, cancel, download ticket, export CSV) is functional.
- [x] **Role Access:** Separate student and organizer views with route guards preventing unauthorized navigation.
- [x] **Ticket QR Generator:** Generates valid QR codes encoding ticket ID and student details.
- [x] **Analytics:** Interactive Recharts Bar Chart and Pie Chart with live event counts.
- [x] **CSV Export:** One-click roster download formatted cleanly for campus administrators.
- [x] **AWS EC2 Ready:** Fully compatible with Nginx SPA configuration and tested production Vite builds.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

