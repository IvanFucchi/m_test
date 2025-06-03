import { Router } from 'express';
import { fetchEvents } from '../utils/fetchRealEvents.js';

const router = Router();

router.get('/', async (req, res) => {
  // ↳ query params provenienti dalla UI MUSA
  const {
    q = '',
    lat,
    lon,
    city,
    country,
    radius = 15,
    category,
    page = 1
  } = req.query;

  try {
    const events = await fetchEvents({
      query: q,
      lat: lat && Number(lat),
      lon: lon && Number(lon),
      city,
      country,
      radiusKm: Number(radius),
      category,
      page: Number(page)
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
