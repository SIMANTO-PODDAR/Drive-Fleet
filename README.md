# 🚗 DriveFleet — Modern Car Rental & Fleet Management

DriveFleet is a premium, full-stack car rental platform built on Next.js 16 and MongoDB. It allows users to effortlessly list, explore, and book vehicles. Designed with a sleek user interface, secure authentication, and a dynamic booking flow, DriveFleet connects car owners and renters in a seamless marketplace.

### 🌐 Live Application URL [https://drivefleet-by-sp.vercel.app](https://drivefleet-by-sp.vercel.app)
### 🌐 Server URL [https://drivefleet-server](https://server-a9.vercel.app)

---

## ✨ Key Features

DriveFleet comes packed with features designed to provide an optimal car rental and hosting experience:

- **🚗 Interactive Car Exploration**
  Explore a wide range of cars with details such as rental pricing, availability, specifications, and images. The dynamic interface updates instantly as listings change.

- **🔍 Advanced Search & Filtering**
  Instantly find the perfect vehicle by searching across names or types, keeping the fleet highly discoverable.

- **📅 End-to-End Booking Management**
  Seamless booking process where users can reserve cars for specific dates. An interactive, centralized **Booking Dashboard** allows users to monitor booking statuses, modify dates, or cancel reservations with real-time updates.

- **🔑 Secure Authentication (Better-Auth)**
  Robust credentials-based login and registration, complemented by **Google Social Authentication**, powered by the lightweight and secure `better-auth` engine with MongoDB session persistence.

- **🔧 User Vehicle Listings (CRUD Dashboard)**
  Empower users to list their own vehicles for rent. Registered car owners can easily add new cars, view their listings on a dedicated **My Added Cars** dashboard, update vehicle details, or delete listings.

- **⚡ Modern Responsive UI & Micro-interactions**
  A gorgeous layout crafted with Tailwind CSS v4, HeroUI components, smooth infinite marquee loops (`react-fast-marquee`) for fleet partners, and immediate toast feedback (`react-hot-toast`) for key user actions.

---

## 🛠️ Technology Stack

DriveFleet is built using a modern, performant, and scalable stack:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & React 19)
- **Styling & Components:** [Tailwind CSS v4](https://tailwindcss.com/) & [HeroUI](https://heroui.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (using native client integration)
- **Authentication:** [Better-Auth](https://better-auth.com/) (with MongoDB adapter)
- **Icons & Animation:** [React Icons](https://react-icons.github.io/react-icons/), [Gravity UI Icons](https://github.com/gravity-ui/icons), and [React Fast Marquee](https://www.npmjs.com/package/react-fast-marquee)
- **Feedback Alerts:** [React Hot Toast](https://react-hot-toast.com/)

---

## 🚀 Getting Started (Local Setup)

To run DriveFleet locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/SIMANTO-PODDAR/Drive-Fleet.git
cd Drive-Fleet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# MongoDB Connection URI
MONGODB_URI=your_mongodb_connection_string

# Better Auth Configuration
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Next.js Public Server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000/api
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---
