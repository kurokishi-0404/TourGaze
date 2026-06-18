import React, { createContext, useContext, useState, useEffect } from "react";
import { packagesData, reviewsData, destinationsList } from "../data/packagesData";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // 1. Currency State
  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("tourgaze_currency") || "INR";
  });

  const exchangeRates = {
    USD: 1.0,
    INR: 83.0,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67
  };

  const currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    AED: "AED "
  };

  useEffect(() => {
    localStorage.setItem("tourgaze_currency", activeCurrency);
  }, [activeCurrency]);

  const formatPrice = (priceInUSD) => {
    const rate = exchangeRates[activeCurrency] || 1;
    const symbol = currencySymbols[activeCurrency] || "$";
    const converted = Math.round(priceInUSD * rate);
    
    // Formatting with commas
    if (activeCurrency === "INR") {
      return `${symbol}${converted.toLocaleString("en-IN")}`;
    }
    return `${symbol}${converted.toLocaleString("en-US")}`;
  };

  // 2. Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tourgaze_user");
    if (saved) return JSON.parse(saved);
    // Initial mock logged-in user profile
    return {
      name: "Sumit Shingole",
      email: "sumit@tourgaze.com",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      membership: "Gold Explorer",
      countriesVisited: 14,
      tripsCompleted: 23,
      reviewsGiven: 12
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("tourgaze_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tourgaze_user");
    }
  }, [user]);

  const getStorageKey = (key, email) => email ? `${key}_${email}` : key;

  const loadUserData = (email, key, defaultVal) => {
    const saved = localStorage.getItem(getStorageKey(key, email));
    return saved ? JSON.parse(saved) : defaultVal;
  };

  const defaultBookings = [
    {
      id: "bk-101",
      packageId: "pkg-1",
      packageName: "European Grand Tour",
      stops: ["Paris", "Rome", "London"],
      hotel: "Hotel Le Bristol Paris",
      travelDate: "2026-07-20",
      duration: "10 Days",
      price: 2499,
      travelers: 2,
      status: "Tickets Generated",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bk-102",
      packageId: "pkg-3",
      packageName: "Arabian Desert Luxuries",
      stops: ["Dubai", "Abu Dhabi"],
      hotel: "Atlantis The Palm",
      travelDate: "2026-08-15",
      duration: "6 Days",
      price: 1199,
      travelers: 4,
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const syncUserData = (email) => {
    setWishlist(loadUserData(email, "tourgaze_wishlist", ["pkg-1", "pkg-4"]));
    setBookings(loadUserData(email, "tourgaze_bookings", defaultBookings));
    setBookingHistory(loadUserData(email, "tourgaze_bookings_history", {}));
    setCustomTrips(loadUserData(email, "tourgaze_custom_trips", []));
  };

  const login = (email, password) => {
    // Basic mock authentication
    const mockUser = {
      name: email.split("@")[0].replace(/^\w/, c => c.toUpperCase()),
      email: email,
      phone: "+1 555-0199",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      membership: "Silver Explorer",
      countriesVisited: 2,
      tripsCompleted: 1,
      reviewsGiven: 0
    };
    setUser(mockUser);
    syncUserData(mockUser.email);
    return true;
  };

  const signup = (fullName, email, phone, password) => {
    const mockUser = {
      name: fullName,
      email: email,
      phone: phone,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      membership: "New Adventurer",
      countriesVisited: 0,
      tripsCompleted: 0,
      reviewsGiven: 0
    };
    setUser(mockUser);
    syncUserData(mockUser.email);
    return true;
  };

  const logout = () => {
    setUser(null);
    syncUserData(null);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  // 3. Wishlist State
  const [wishlist, setWishlist] = useState(() => loadUserData(user?.email, "tourgaze_wishlist", ["pkg-1", "pkg-4"]));

  useEffect(() => {
    localStorage.setItem(getStorageKey("tourgaze_wishlist", user?.email), JSON.stringify(wishlist));
  }, [wishlist, user?.email]);

  const toggleWishlist = (packageId) => {
    setWishlist(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  // 4. Bookings and Undo History State
  const [bookings, setBookings] = useState(() => loadUserData(user?.email, "tourgaze_bookings", defaultBookings));

  // Keep a map/list of booking updates history for undo operations
  const [bookingHistory, setBookingHistory] = useState(() => loadUserData(user?.email, "tourgaze_bookings_history", {}));

  useEffect(() => {
    localStorage.setItem(getStorageKey("tourgaze_bookings", user?.email), JSON.stringify(bookings));
  }, [bookings, user?.email]);

  useEffect(() => {
    localStorage.setItem(getStorageKey("tourgaze_bookings_history", user?.email), JSON.stringify(bookingHistory));
  }, [bookingHistory, user?.email]);

  const addBooking = (newBooking) => {
    const bookingWithId = {
      id: `bk-${Math.floor(100 + Math.random() * 900)}`,
      status: "Pending",
      ...newBooking
    };
    setBookings(prev => [bookingWithId, ...prev]);
    // Initialize history empty for this booking
    setBookingHistory(prev => ({
      ...prev,
      [bookingWithId.id]: []
    }));
    return bookingWithId;
  };

  const updateBooking = (bookingId, updatedFields) => {
    // 1. Find the current state of this booking
    const currentBooking = bookings.find(b => b.id === bookingId);
    if (!currentBooking) return;

    // 2. Save current state to history array before modifying
    const historyList = bookingHistory[bookingId] || [];
    const updatedHistory = [...historyList, { ...currentBooking }];

    setBookingHistory(prev => ({
      ...prev,
      [bookingId]: updatedHistory
    }));

    // 3. Apply changes to active bookings
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updatedFields } : b));
  };

  const undoBookingChange = (bookingId) => {
    const historyList = bookingHistory[bookingId] || [];
    if (historyList.length === 0) return false;

    // Pop the last history state
    const previousState = historyList[historyList.length - 1];
    const updatedHistory = historyList.slice(0, historyList.length - 1);

    // Revert booking to previous state
    setBookings(prev => prev.map(b => b.id === bookingId ? previousState : b));

    // Update history storage
    setBookingHistory(prev => ({
      ...prev,
      [bookingId]: updatedHistory
    }));

    return true;
  };

  const cancelBooking = (bookingId) => {
    // Optionally remove history when cancelling to save space
    setBookingHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[bookingId];
      return newHistory;
    });
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // 5. Booking Queue Admin Simulation
  const [bookingQueue, setBookingQueue] = useState([
    { queueId: "Q-802", user: "Vikram Sen", package: "Tokyo & Kyoto Wonders", status: "Processing" },
    { queueId: "Q-803", user: "Zoe Chen", package: "European Grand Tour", status: "Verifying Visa" },
    { queueId: "Q-804", user: "Liam Peterson", package: "Swiss Alps & Lakes", status: "Allocating Flights" },
    { queueId: "Q-805", user: "Priyantha Kumara", package: "Bali Island Getaway", status: "Awaiting Payment" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live booking additions or updates
      setBookingQueue(prev => {
        const statuses = ["Processing", "Verifying Visa", "Allocating Flights", "Awaiting Payment", "Generating Tickets"];
        const randomNames = ["Sophia Rossi", "Rahul Nair", "Nils Lindqvist", "Elena Petrova", "Omar Al-Mansoori"];
        const randomPackages = ["European Grand Tour", "Tokyo & Kyoto Wonders", "Arabian Desert Luxuries", "Swiss Alps & Lakes Scenic"];

        // Randomly update status of an existing item OR append a new one
        if (Math.random() > 0.5 && prev.length > 0) {
          const indexToChange = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => {
            if (idx === indexToChange) {
              const currentIdx = statuses.indexOf(item.status);
              const nextStatus = statuses[(currentIdx + 1) % statuses.length];
              return { ...item, status: nextStatus };
            }
            return item;
          });
        } else {
          const newQueueId = `Q-${Math.floor(806 + Math.random() * 200)}`;
          const newRequest = {
            queueId: newQueueId,
            user: randomNames[Math.floor(Math.random() * randomNames.length)],
            package: randomPackages[Math.floor(Math.random() * randomPackages.length)],
            status: "Processing"
          };
          return [...prev.slice(-6), newRequest]; // Keep max 6 items
        }
      });
    }, 15000); // Trigger every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // 6. User Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("tourgaze_reviews");
    return saved ? JSON.parse(saved) : reviewsData;
  });

  useEffect(() => {
    localStorage.setItem("tourgaze_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (newReview) => {
    const fullReview = {
      id: `rev-${Math.floor(100 + Math.random() * 900)}`,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      likes: 0,
      date: new Date().toISOString().split("T")[0],
      ...newReview
    };
    setReviews(prev => [fullReview, ...prev]);
    // increment profile count
    if (user) {
      setUser(prev => ({ ...prev, reviewsGiven: prev.reviewsGiven + 1 }));
    }
  };

  // 7. Custom planned trips by user
  const [customTrips, setCustomTrips] = useState(() => loadUserData(user?.email, "tourgaze_custom_trips", []));

  useEffect(() => {
    localStorage.setItem(getStorageKey("tourgaze_custom_trips", user?.email), JSON.stringify(customTrips));
  }, [customTrips, user?.email]);

  const saveCustomTrip = (trip) => {
    const tripWithId = {
      id: `trip-${Math.floor(1000 + Math.random() * 9000)}`,
      dateCreated: new Date().toISOString().split("T")[0],
      ...trip
    };
    setCustomTrips(prev => [tripWithId, ...prev]);
    return tripWithId;
  };

  const deleteCustomTrip = (tripId) => {
    setCustomTrips(prev => prev.filter(t => t.id !== tripId));
  };

  // 8. Search query cache for landing and planning redirect
  const [searchParams, setSearchParams] = useState({
    from: "Mumbai",
    to: "Paris",
    date: "",
    budget: 3000,
    travelers: 1,
    tripType: "Solo"
  });

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        login,
        signup,
        logout,
        updateProfile,

        // Data lists
        packages: packagesData,
        destinations: destinationsList,
        reviews,
        addReview,

        // Currency conversions
        activeCurrency,
        setActiveCurrency,
        exchangeRates,
        currencySymbols,
        formatPrice,

        // Wishlist
        wishlist,
        toggleWishlist,

        // Bookings Management
        bookings,
        bookingHistory,
        addBooking,
        updateBooking,
        undoBookingChange,
        cancelBooking,
        bookingQueue,

        // Custom Multi-City Trips
        customTrips,
        saveCustomTrip,
        deleteCustomTrip,

        // Search cache
        searchParams,
        setSearchParams
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
