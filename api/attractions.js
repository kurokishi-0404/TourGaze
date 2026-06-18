export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const lat = req.query.lat || req.body?.lat;
    const lng = req.query.lng || req.body?.lng;
    const radiusMeters = req.query.radius || req.body?.radius || 5000;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Missing lat or lng parameters" });
    }

    const query = `
      [out:json][timeout:15];
      (
        node["tourism"="museum"](around:${radiusMeters},${lat},${lng});
        node["tourism"="attraction"](around:${radiusMeters},${lat},${lng});
        node["historic"="monument"](around:${radiusMeters},${lat},${lng});
        node["leisure"="park"](around:${radiusMeters},${lat},${lng});
        node["tourism"="viewpoint"](around:${radiusMeters},${lat},${lng});
        node["amenity"="place_of_worship"](around:${radiusMeters},${lat},${lng});
        node["shop"="mall"](around:${radiusMeters},${lat},${lng});
      );
      out body 40;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "TourGaze-Vercel-Serverless/1.0"
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Overpass API Error:", text);
      return res.status(response.status).json({ error: "Overpass API responded with an error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ error: "Failed to fetch attractions" });
  }
}
