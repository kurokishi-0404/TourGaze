const fs = require('fs');

const filePath = '/Users/sumitshingole/TourGaze/src/pages/TripPlanner.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace citiesList definition
content = content.replace(
  /const citiesList = \["Mumbai", "Dubai".*?\];/,
  'import { CITY_COORDS } from "../services/mapService";\n  const citiesList = Object.keys(CITY_COORDS);'
);

const newHotels = `
    "Delhi": [{ name: "The Leela Palace Delhi", price: 150 }, { name: "Taj Palace New Delhi", price: 130 }],
    "Agra": [{ name: "Oberoi Amarvilas Agra", price: 210 }, { name: "ITC Mughal", price: 140 }],
    "Jaipur": [{ name: "Rambagh Palace Jaipur", price: 240 }, { name: "Fairmont Jaipur", price: 180 }],
    "Kochi": [{ name: "Brunton Boatyard Kochi", price: 120 }, { name: "Taj Malabar Resort", price: 130 }],
    "Munnar": [{ name: "Munnar Tea Valley Resort", price: 80 }, { name: "Windermere Estate", price: 110 }],
    "Alleppey": [{ name: "Spice Coast Houseboats Alleppey", price: 140 }, { name: "Lake Palace Resort", price: 160 }],
    "Abu Dhabi": [{ name: "Emirates Palace Abu Dhabi", price: 300 }, { name: "The St. Regis Abu Dhabi", price: 250 }],
    "Kyoto": [{ name: "Kyoto Ryokan Traditional", price: 160 }, { name: "The Ritz-Carlton Kyoto", price: 350 }],
    "Boston": [{ name: "Boston Copley Square Hotel", price: 160 }, { name: "The Liberty Hotel", price: 210 }],
    "Zurich": [{ name: "Schweizerhof Hotel Zurich", price: 220 }, { name: "Baur au Lac", price: 310 }],
    "Interlaken": [{ name: "Victoria Jungfrau Interlaken", price: 270 }, { name: "Lindner Grand Hotel", price: 180 }],
    "Zermatt": [{ name: "Grand Hotel Zermatterhof", price: 290 }, { name: "Omnia", price: 320 }],
    "Singapore": [{ name: "Marina Bay Sands", price: 400 }, { name: "Raffles Hotel", price: 500 }],
    "Bangkok": [{ name: "Mandarin Oriental Bangkok", price: 250 }, { name: "The Peninsula Bangkok", price: 210 }],
    "Istanbul": [{ name: "Ciragan Palace Kempinski", price: 350 }, { name: "Four Seasons Bosphorus", price: 400 }],
    "Cairo": [{ name: "Marriott Mena House", price: 180 }, { name: "The St. Regis Cairo", price: 220 }],
    "Sydney": [{ name: "Park Hyatt Sydney", price: 380 }, { name: "Shangri-La Sydney", price: 250 }],
    "Barcelona": [{ name: "W Barcelona", price: 320 }, { name: "Hotel Arts Barcelona", price: 300 }],
    "Amsterdam": [{ name: "Conservatorium Hotel", price: 450 }, { name: "Waldorf Astoria Amsterdam", price: 550 }],
    "Goa": [{ name: "Taj Exotica Resort", price: 200 }, { name: "The Leela Goa", price: 220 }],
    "Varanasi": [{ name: "Taj Ganges", price: 110 }, { name: "BrijRama Palace", price: 180 }],
    "Udaipur": [{ name: "Taj Lake Palace", price: 400 }, { name: "The Oberoi Udaivilas", price: 450 }]`;

const newActivities = `
    "Delhi": [{ name: "Qutub Minar & Red Fort Walk", price: 10 }, { name: "Chandni Chowk Food Tour", price: 20 }],
    "Agra": [{ name: "Taj Mahal Sunrise Tour", price: 25 }, { name: "Agra Fort Guided Tour", price: 15 }],
    "Jaipur": [{ name: "Amber Fort Jeep Ride", price: 15 }, { name: "City Palace Tour", price: 10 }],
    "Kochi": [{ name: "Kathakali Dance Show Ticket", price: 8 }, { name: "Fort Kochi Heritage Walk", price: 12 }],
    "Munnar": [{ name: "Tea Garden Trekking Munnar", price: 10 }, { name: "Eravikulam National Park Entry", price: 15 }],
    "Alleppey": [{ name: "Houseboat Backwater Cruise", price: 30 }, { name: "Village Canoe Tour", price: 15 }],
    "Abu Dhabi": [{ name: "Yas Marina Formula 1 Track Tour", price: 45 }, { name: "Sheikh Zayed Mosque Tour", price: 20 }],
    "Kyoto": [{ name: "Kyoto Tea Ceremony Experience", price: 25 }, { name: "Arashiyama Bamboo Grove Walk", price: 15 }],
    "Boston": [{ name: "Freedom Trail Private Walk", price: 20 }, { name: "Harvard University Walking Tour", price: 15 }],
    "Zurich": [{ name: "Lake Zurich Sightseeing Cruise", price: 35 }, { name: "Swiss National Museum", price: 20 }],
    "Interlaken": [{ name: "Jungfraujoch Train Ride", price: 150 }, { name: "Lake Brienz Jet Boat", price: 55 }],
    "Zermatt": [{ name: "Matterhorn Glacier Paradise", price: 85 }, { name: "Gornergrat Railway Ticket", price: 70 }],
    "Singapore": [{ name: "Gardens by the Bay Entry", price: 25 }, { name: "Night Safari Admission", price: 40 }],
    "Bangkok": [{ name: "Grand Palace Tour", price: 20 }, { name: "Chao Phraya Dinner Cruise", price: 50 }],
    "Istanbul": [{ name: "Hagia Sophia & Blue Mosque Tour", price: 30 }, { name: "Bosphorus Sunset Cruise", price: 40 }],
    "Cairo": [{ name: "Pyramids of Giza Camel Ride", price: 25 }, { name: "Egyptian Museum Entry", price: 15 }],
    "Sydney": [{ name: "Sydney Opera House Tour", price: 35 }, { name: "BridgeClimb Sydney", price: 200 }],
    "Barcelona": [{ name: "Sagrada Familia Fast-Track", price: 35 }, { name: "Park Guell Guided Tour", price: 25 }],
    "Amsterdam": [{ name: "Van Gogh Museum Ticket", price: 25 }, { name: "Canal Ring Boat Tour", price: 20 }],
    "Goa": [{ name: "Dudhsagar Waterfall Trip", price: 30 }, { name: "Scuba Diving at Grande Island", price: 45 }],
    "Varanasi": [{ name: "Ganges Sunrise Boat Ride", price: 15 }, { name: "Sarnath Guided Tour", price: 20 }],
    "Udaipur": [{ name: "Lake Pichola Sunset Cruise", price: 25 }, { name: "City Palace Museum Tour", price: 15 }]`;

content = content.replace(
  /"New York City": \[\{ name: "The Plaza Hotel NYC", price: 320 \}, \{ name: "Pod 39 NYC", price: 90 \}\]/,
  '"New York City": [{ name: "The Plaza Hotel NYC", price: 320 }, { name: "Pod 39 NYC", price: 90 }],' + newHotels
);

content = content.replace(
  /"New York City": \[\n\s+\{ name: "Statue of Liberty", price: 25 \},\n\s+\{ name: "Broadway Musical Show Ticket", price: 95 \}\n\s+\]/,
  '"New York City": [\n      { name: "Statue of Liberty", price: 25 },\n      { name: "Broadway Musical Show Ticket", price: 95 }\n    ],' + newActivities
);

fs.writeFileSync(filePath, content);
console.log("TripPlanner.jsx updated successfully.");
