export const packagesData = [
  {
    id: "pkg-1",
    name: "European Grand Tour",
    country: "Europe Multi-City",
    stops: ["Paris", "Rome", "London"],
    duration: "10 Days",
    durationDays: 10,
    price: 2499,
    rating: 4.8,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80", // Paris
    visaFree: false,
    visaCost: 99,
    visaDifficulty: "Medium",
    familyFriendly: true,
    bestSeason: "Spring (Apr - Jun)",
    budgetRange: "Luxury",
    description: "Experience the romance of Paris, the history of Rome, and the majesty of London in one unforgettable itinerary.",
    tags: ["Culture", "History", "Multi-City"],
    hotels: [
      { name: "Hotel Le Bristol Paris", price: 250, rating: 4.9 },
      { name: "Rome Luxury Suite", price: 180, rating: 4.7 },
      { name: "The Ritz London", price: 280, rating: 4.8 }
    ],
    activities: [
      { name: "Eiffel Tower Summit Access", price: 45 },
      { name: "Colosseum & Roman Forum Tour", price: 35 },
      { name: "London Eye Private Capsule", price: 50 },
      { name: "Louvre Museum Guided Tour", price: 40 }
    ],
    flightsCost: 650,
    travelRules: "COVID-19 vaccination certificate or negative PCR test within 48 hours required for transit in some countries. Valid passport with 6 months validity.",
    visaRequirements: "Schengen Visa required for Indian/non-EU passport holders. UK Tourist Visa required separately for London."
  },
  {
    id: "pkg-2",
    name: "Tokyo & Kyoto Wonders",
    country: "Japan",
    stops: ["Tokyo", "Mount Fuji", "Kyoto"],
    duration: "8 Days",
    durationDays: 8,
    price: 1899,
    rating: 4.9,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", // Kyoto
    visaFree: true,
    visaCost: 0,
    visaDifficulty: "Easy",
    familyFriendly: true,
    bestSeason: "Autumn (Oct - Nov)",
    budgetRange: "Luxury",
    description: "Immerse yourself in Japan's technological future in Tokyo, travel past Mt. Fuji, and witness traditional temples in Kyoto.",
    tags: ["Tech", "Nature", "Temples"],
    hotels: [
      { name: "Park Hyatt Tokyo", price: 220, rating: 4.9 },
      { name: "Fuji View Onsen Resort", price: 190, rating: 4.8 },
      { name: "Kyoto Ryokan Traditional", price: 160, rating: 4.7 }
    ],
    activities: [
      { name: "Shibuya Sky & TeamLab Planets", price: 30 },
      { name: "Mt. Fuji Guided Hiking Tour", price: 60 },
      { name: "Kyoto Tea Ceremony Experience", price: 25 },
      { name: "Bullet Train (Shinkansen) Ticket", price: 90 }
    ],
    flightsCost: 550,
    travelRules: "Customs declaration must be completed online via Visit Japan Web prior to boarding.",
    visaRequirements: "E-Visa available for tourists of eligible countries. Simple 3-day online processing."
  },
  {
    id: "pkg-3",
    name: "Arabian Desert Luxuries",
    country: "United Arab Emirates",
    stops: ["Dubai", "Abu Dhabi"],
    duration: "6 Days",
    durationDays: 6,
    price: 1199,
    rating: 4.7,
    reviewsCount: 204,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", // Dubai
    visaFree: false,
    visaCost: 80,
    visaDifficulty: "Easy",
    familyFriendly: true,
    bestSeason: "Winter (Nov - Mar)",
    budgetRange: "Medium",
    description: "Witness scaling architectural marvels, golden sand dunes, and modern high-end shopping hubs in Dubai and Abu Dhabi.",
    tags: ["Luxury", "Shopping", "Adventure"],
    hotels: [
      { name: "Atlantis The Palm", price: 240, rating: 4.8 },
      { name: "Emirates Palace Abu Dhabi", price: 300, rating: 4.9 }
    ],
    activities: [
      { name: "Burj Khalifa 148th Floor Access", price: 75 },
      { name: "Desert Safari with BBQ Dinner", price: 40 },
      { name: "Louvre Abu Dhabi Admission", price: 18 },
      { name: "Yas Marina Formula 1 Track Tour", price: 45 }
    ],
    flightsCost: 300,
    travelRules: "Ensure smart dress code at high-end venues. Alcohol restricted to licensed hotels and bars.",
    visaRequirements: "Tourist Visa issues online in 48 hours. Require flight ticket and passport copy."
  },
  {
    id: "pkg-4",
    name: "Bali Island Getaway",
    country: "Indonesia",
    stops: ["Ubud", "Seminyak", "Nusa Penida"],
    duration: "7 Days",
    durationDays: 7,
    price: 899,
    rating: 4.6,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", // Bali
    visaFree: true,
    visaCost: 35,
    visaDifficulty: "Easy",
    familyFriendly: false,
    bestSeason: "Dry Season (May - Sep)",
    budgetRange: "Budget",
    description: "Relax amidst pristine rice fields, spiritual temples, sandy beaches, and explore dramatic seaside cliffs.",
    tags: ["Beach", "Tropical", "Relaxation"],
    hotels: [
      { name: "Maya Ubud Resort & Spa", price: 110, rating: 4.8 },
      { name: "W Bali Seminyak", price: 180, rating: 4.9 },
      { name: "Nusa Penida Eco Lodge", price: 60, rating: 4.5 }
    ],
    activities: [
      { name: "Sacred Monkey Forest Sanctuary Tour", price: 10 },
      { name: "Nusa Penida Snorkeling with Mantas", price: 35 },
      { name: "Mount Batur Sunrise Trekking", price: 40 },
      { name: "Balinese Cooking Masterclass", price: 25 }
    ],
    flightsCost: 350,
    travelRules: "Tourist levy of IDR 150,000 paid online before arrival. Respect religious sites and wear temple sashes.",
    visaRequirements: "Visa on Arrival (VoA) valid for 30 days. Renewable once. Price approx USD 35."
  },
  {
    id: "pkg-5",
    name: "Swiss Alps & Lakes Scenic",
    country: "Switzerland",
    stops: ["Zurich", "Interlaken", "Zermatt"],
    duration: "7 Days",
    durationDays: 7,
    price: 2799,
    rating: 4.85,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80", // Switzerland
    visaFree: false,
    visaCost: 90,
    visaDifficulty: "Hard",
    familyFriendly: true,
    bestSeason: "Summer (Jun - Aug) / Winter (Dec - Feb)",
    budgetRange: "Luxury",
    description: "Hop on alpine trains through the Matterhorn valleys, sail on crystal clear lakes, and explore modern Swiss towns.",
    tags: ["Nature", "Snow", "Train Journey"],
    hotels: [
      { name: "Schweizerhof Hotel Zurich", price: 220, rating: 4.7 },
      { name: "Victoria Jungfrau Interlaken", price: 270, rating: 4.9 },
      { name: "Grand Hotel Zermatterhof", price: 290, rating: 4.8 }
    ],
    activities: [
      { name: "Jungfraujoch - Top of Europe Train", price: 150 },
      { name: "Lake Brienz Jet Boat Adventure", price: 55 },
      { name: "Zermatt Matterhorn Glacier Paradise", price: 85 },
      { name: "Swiss Chocolate Workshop", price: 30 }
    ],
    flightsCost: 600,
    travelRules: "Swiss Travel Pass covers most public transit. Travel light on trains as luggage space can be limited.",
    visaRequirements: "Schengen Visa required. Highly detailed financial proof and travel insurance mandatory."
  },
  {
    id: "pkg-6",
    name: "New York & Boston Heritage",
    country: "United States",
    stops: ["New York City", "Boston"],
    duration: "5 Days",
    durationDays: 5,
    price: 1499,
    rating: 4.5,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", // NYC
    visaFree: false,
    visaCost: 185,
    visaDifficulty: "Hard",
    familyFriendly: true,
    bestSeason: "Autumn (Sep - Nov)",
    budgetRange: "Medium",
    description: "Explore the pulsing streets of Manhattan, see Broadway, and walk the historic Freedom Trail in Boston.",
    tags: ["Metropolitan", "History", "Nightlife"],
    hotels: [
      { name: "The Plaza Hotel NYC", price: 320, rating: 4.9 },
      { name: "Boston Copley Square Hotel", price: 160, rating: 4.5 }
    ],
    activities: [
      { name: "Empire State Observatory Desk", price: 42 },
      { name: "Broadway Musical Show Ticket", price: 95 },
      { name: "Harvard University Walking Tour", price: 15 },
      { name: "Freedom Trail Private Walk", price: 20 }
    ],
    flightsCost: 750,
    travelRules: "ESTA or Visa required. Biometrics registered at border control. Standard tipping of 18-20% is customary.",
    visaRequirements: "B1/B2 tourist visa required with in-person interview at Embassy/Consulate."
  },
  {
    id: "pkg-7",
    name: "Golden Triangle Highlights",
    country: "India",
    stops: ["Delhi", "Agra", "Jaipur"],
    duration: "6 Days",
    durationDays: 6,
    price: 699,
    rating: 4.8,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    visaFree: true,
    visaCost: 0,
    visaDifficulty: "Easy",
    familyFriendly: true,
    bestSeason: "Winter (Oct - Mar)",
    budgetRange: "Budget",
    description: "Explore India's historic Golden Triangle: see Delhi's monuments, marvel at Agra's iconic Taj Mahal, and wander through Jaipur's Pink City palace gardens.",
    tags: ["Heritage", "Culture", "Taj Mahal"],
    hotels: [
      { name: "The Leela Palace Delhi", price: 150, rating: 4.9 },
      { name: "Oberoi Amarvilas Agra", price: 210, rating: 4.9 },
      { name: "Rambagh Palace Jaipur", price: 240, rating: 4.9 }
    ],
    activities: [
      { name: "Taj Mahal Sunrise Tour", price: 25 },
      { name: "Amber Fort Jeep Ride", price: 15 },
      { name: "Qutub Minar & Red Fort Walk", price: 10 }
    ],
    flightsCost: 100,
    travelRules: "Standard national security guidelines. Shoe covers required at the Taj Mahal. Respect historical monuments.",
    visaRequirements: "Visa free for Indian citizens. E-visa processed online in 24 hours for international tourists."
  },
  {
    id: "pkg-8",
    name: "Kerala Backwaters & Hills",
    country: "India",
    stops: ["Kochi", "Munnar", "Alleppey"],
    duration: "7 Days",
    durationDays: 7,
    price: 599,
    rating: 4.7,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    visaFree: true,
    visaCost: 0,
    visaDifficulty: "Easy",
    familyFriendly: true,
    bestSeason: "Winter (Sep - Mar)",
    budgetRange: "Budget",
    description: "Glide through the peaceful palm-fringed backwaters of Alleppey on a private houseboat and stroll around Munnar's vast tea fields.",
    tags: ["Nature", "Hill Station", "Relaxation"],
    hotels: [
      { name: "Brunton Boatyard Kochi", price: 120, rating: 4.8 },
      { name: "Munnar Tea Valley Resort", price: 80, rating: 4.6 },
      { name: "Spice Coast Houseboats Alleppey", price: 140, rating: 4.8 }
    ],
    activities: [
      { name: "Houseboat Backwater Cruise", price: 30 },
      { name: "Tea Garden Trekking Munnar", price: 10 },
      { name: "Kathakali Dance Show Ticket", price: 8 }
    ],
    flightsCost: 120,
    travelRules: "Respect local temples and traditions. Monsoon season carries heavy rains from June to August.",
    visaRequirements: "Visa free for domestic travelers. Online E-Visa for international tourists."
  }
];

export const reviewsData = [
  {
    id: "rev-1",
    user: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    packageId: "pkg-1",
    packageName: "European Grand Tour",
    comment: "This was the trip of a lifetime! The transition from Paris to Rome was smooth, and the TourGaze booking system let us restore our hotel reservations easily when we had to change the dates.",
    date: "2026-05-12",
    likes: 24,
    destination: "Paris, France"
  },
  {
    id: "rev-2",
    user: "David Miller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    packageId: "pkg-2",
    packageName: "Tokyo & Kyoto Wonders",
    comment: "Japan is unbelievable, and TourGaze made planning it so much fun. The route maps worked flawlessly in Tokyo and the cost calculator was spot on, taking flights and hotel options into account.",
    date: "2026-06-02",
    likes: 18,
    destination: "Tokyo, Japan"
  },
  {
    id: "rev-3",
    user: "Rajesh Patel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 4,
    packageId: "pkg-3",
    packageName: "Arabian Desert Luxuries",
    comment: "Loved the desert safari and the Burj Khalifa. We used the floating currency converter widget throughout the trip to monitor our AED spending in INR.",
    date: "2026-04-18",
    likes: 31,
    destination: "Dubai, UAE"
  },
  {
    id: "rev-4",
    user: "Emma Watson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    packageId: "pkg-4",
    packageName: "Bali Island Getaway",
    comment: "Incredibly relaxing! Saved the trip to our wishlist first and booked it in one click. Highly recommend the Nusa Penida snorkeling tour.",
    date: "2026-05-29",
    likes: 42,
    destination: "Bali, Indonesia"
  }
];

export const destinationsList = [
  { name: "Paris", country: "France", rating: 4.8, type: "European", desc: "City of lights, fashion, and culinary excellence." },
  { name: "Rome", country: "Italy", rating: 4.7, type: "European", desc: "Ancient history, breathtaking structures, and pasta." },
  { name: "London", country: "United Kingdom", rating: 4.8, type: "European", desc: "Royalty, museums, and scenic river bridges." },
  { name: "Tokyo", country: "Japan", rating: 4.9, type: "Asian", desc: "Neon signs, high-tech, and amazing traditional sushi." },
  { name: "Kyoto", country: "Japan", rating: 4.8, type: "Asian", desc: "Beautiful cherry blossoms and historic temples." },
  { name: "Dubai", country: "United Arab Emirates", rating: 4.7, type: "Middle Eastern", desc: "Futuristic skyscrapers and vast sandy deserts." },
  { name: "Abu Dhabi", country: "United Arab Emirates", rating: 4.6, type: "Middle Eastern", desc: "Grand mosques and cultural marvels." },
  { name: "Mumbai", country: "India", rating: 4.5, type: "Asian", desc: "Vibrant capital of dreams, cinema, and local heritage." },
  { name: "Delhi", country: "India", rating: 4.6, type: "Asian", desc: "Capital city filled with ancient Mughal history, food stalls, and monuments." },
  { name: "Agra", country: "India", rating: 4.9, type: "Asian", desc: "Home to the world-renowned Taj Mahal, Agra Fort, and Mughal gardens." },
  { name: "Jaipur", country: "India", rating: 4.8, type: "Asian", desc: "The Pink City famous for heritage forts, royal palaces, and vibrant bazaars." },
  { name: "Kochi", country: "India", rating: 4.6, type: "Asian", desc: "Coastal port with historic Chinese fishing nets and spice markets." },
  { name: "Munnar", country: "India", rating: 4.8, type: "Asian", desc: "Serene hill station decorated with sprawling tea estates and misty peaks." },
  { name: "Alleppey", country: "India", rating: 4.7, type: "Asian", desc: "Venice of the East, famous for tranquil houseboat backwater cruises." }
];

