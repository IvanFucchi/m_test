/**
 * fetch_real_events.js
 *
 * Recupera eventi reali dall'API Eventbrite in modo flessibile:
 *   • Ricerca "globale" (nessun parametro di localizzazione)
 *   • Ricerca centrata su **coordinate GPS** (`--lat`, `--lon`, `--radius`)
 *   • Ricerca per **città/paese** (`--city`, `--country`, `--radius`)
 *
 * Precedenza:
 *   1) Se sono forniti `--lat` **e** `--lon`, usa le coordinate.
 *   2) Altrimenti, se è fornito `--city`, usa l'indirizzo città/paese.
 *   3) In mancanza di entrambi, la query è globale.
 *
 * ---------------------------- CLI di esempio ------------------------------
 *   export EVENTBRITE_TOKEN=YOUR_TOKEN
 *   node fetch_real_events.js "Morandi" --lat=41.89 --lon=12.49 --radius=20
 *   node fetch_real_events.js "Morandi" --city="Milano" --country="IT" --radius=10
 *   node fetch_real_events.js "" --category=105   # arte contemporanea globale
 * -------------------------------------------------------------------------
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.EVENTBRITE_TOKEN;
if (!TOKEN) {
  console.error('Imposta la variabile di ambiente EVENTBRITE_TOKEN');
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*                      Parsing argomenti da linea di comando                 */
/* -------------------------------------------------------------------------- */

const rawArgs = process.argv.slice(2);
const query = rawArgs[0] ?? '';

const extras = Object.fromEntries(
  rawArgs.slice(1).map(a => {
    const [k, ...rest] = a.replace(/^--/, '').split('=');
    return [k.toLowerCase(), rest.join('=')];
  })
);

const lat = extras.lat ? Number(extras.lat) : null;
const lon = extras.lon ? Number(extras.lon) : null;
const city = extras.city ?? null;
const country = extras.country ?? null;
const radiusKm = extras.radius ? Number(extras.radius) : 15;
const category = extras.category ?? '105'; // Arts & Culture
const page = extras.page ? Number(extras.page) : 1;
const pageSize = extras.page_size ? Number(extras.page_size) : 200; // massima dimensione supportata

/* -------------------------------------------------------------------------- */
/*                                Build URL                                   */
/* -------------------------------------------------------------------------- */

const url = new URL('https://www.eventbriteapi.com/v3/events/search/');
url.searchParams.set('q', query);
url.searchParams.set('expand', 'venue,category');
url.searchParams.set('page', String(page));
url.searchParams.set('page_size', String(pageSize));
url.searchParams.set('start_date.range_end', new Date().toISOString()); // esclude solo eventi passati
if (category) url.searchParams.set('categories', category);

// --- Localizzazione -------------------------------------------------------
if (lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon)) {
  url.searchParams.set('location.latitude', String(lat));
  url.searchParams.set('location.longitude', String(lon));
  url.searchParams.set('location.within', `${radiusKm}km`);
} else if (city) {
  url.searchParams.set('location.address', country ? `${city}, ${country}` : city);
  url.searchParams.set('location.within', `${radiusKm}km`);
}
// Se né coordinate né città sono fornite, la ricerca rimane globale.

/* -------------------------------------------------------------------------- */
/*                                Fetch & Map                                 */
/* -------------------------------------------------------------------------- */

export async function fetchEvents() {
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  if (!res.ok) {
    throw new Error(`Eventbrite API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();

  console.log('Eventbrite raw count:', data.events?.length, 'items');

  console.log('Mapped events sample:', JSON.stringify(data.events[0], null, 2));

  return data.events
    .filter(ev => ev.venue && ev.venue.latitude && ev.venue.longitude)
    .map(ev => ({
      name: ev.name.text,
      description: ev.description?.text ?? '',
      type: 'event',
      coordinates: [
        parseFloat(ev.venue.longitude),
        parseFloat(ev.venue.latitude)
      ],
      address: [
        ev.venue.address.address_1,
        ev.venue.address.postal_code,
        ev.venue.address.city,
        ev.venue.address.region,
        ev.venue.address.country
      ].filter(Boolean).join(', '),
      city: ev.venue.address.city,
      country: ev.venue.address.country,
      category: ev.category?.name ?? 'Evento',
      tags: ev.tags?.map(t => t.display_name) ?? [],
      source: 'eventbrite'
    }));
}

// Default export per compatibilità con importazioni "import fetchEvents from ..."
export default fetchEvents;

/* -------------------------------------------------------------------------- */
/*                                   Run                                      */
/* -------------------------------------------------------------------------- */

if (import.meta && import.meta.url && import.meta.url.endsWith(process.argv[1])) {
  // ESM eseguito direttamente con `node --experimental-modules`
  (async () => {
    try {
      const events = await fetchEvents();
      console.log(JSON.stringify(events, null, 2));
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
} 
