# 🌍 TourGaze

![TourGaze Banner](https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80)

**TourGaze** is a modern, full-featured international travel platform and interactive route planner. Built with React and Vite, it offers an elegant UI allowing users to discover destinations, plan multi-city trips, and track bookings—all from a single, seamless application.

---

## 🔗 Live Demo
*Link to your deployed application here, e.g., [https://tourgaze-demo.vercel.app](https://tourgaze-demo.vercel.app)*

---

## ✨ Features

- **Intelligent Route Planning:** Search for flights, optimize multi-city routes, and estimate total travel costs instantly.
- **Interactive Travel Map:** Visualizes your flight paths and itineraries using **MapLibre GL JS** and the **OpenRouteService** API.
- **Dynamic Package Discovery:** Explore curated travel packages and global hotspots with a modern, responsive card interface.
- **Booking Dashboard:** A unified hub to manage your reservations, wishlist, and profile settings with state isolated by user accounts.
- **Stunning UI/UX:** Built using Tailwind CSS, featuring glassmorphism overlays, custom typography, and fluid `framer-motion` animations.

---

## 📸 Screenshots

### 1. Interactive Homepage & Search
![Homepage Screenshot](./screenshots/home.png) *(Add your screenshot path here)*

### 2. Live Route Visualization
![Map Planner Screenshot](./screenshots/map.png) *(Add your screenshot path here)*

### 3. Booking Dashboard
![Dashboard Screenshot](./screenshots/dashboard.png) *(Add your screenshot path here)*

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Maps & Geocoding:** MapLibre GL JS, OpenRouteService API, Nominatim (OpenStreetMap)
- **State Management:** React Context API + LocalStorage
- **Animations:** Framer Motion

---

## 🚀 Setup Instructions

Another developer can get this project running locally by following these steps.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TourGaze.git
cd TourGaze
```

### 2. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 3. Environment Variables (Optional/Recommended)
The interactive map relies on OpenRouteService for drawing paths. If you run into API limits, create a `.env` file in the root directory and add your own free API key:
```env
VITE_OPENROUTESERVICE_API_KEY=your_free_api_key_here
```
*(You can get a free key at [openrouteservice.org](https://openrouteservice.org/dev/#/signup))*

### 4. Run the Development Server
```bash
npm run dev
```

Navigate to `http://localhost:5173` (or the port provided in your terminal) to view the application in your browser.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
