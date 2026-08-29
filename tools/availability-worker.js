/**
 * D4Driving availability proxy  —  Cloudflare Worker
 *
 * Why this exists
 * ---------------
 * Cal.com's public getSchedule endpoint returns Robert's REAL bookable slots.
 * It already applies his buffers, minimum notice and Cal.com availability
 * schedule, so it is more accurate than deriving free gaps from the raw Google
 * Calendar — that approach advertised slots (28 Sep, 6 Oct 2026) that Cal.com
 * would not actually accept a booking for.
 *
 * Cal.com sends no CORS headers, so the browser cannot call it from
 * d4driving.co.uk. This Worker fetches it server-side and re-serves it with
 * CORS, in the SAME shape the page already reads from availability.json — so
 * index.html needs only a URL change, and can fall back to the static file.
 *
 * Because the page calls this on every load, the section is always live. It
 * replaces the GitHub Actions schedule, which GitHub was dropping ~85% of
 * (3 runs/day against an hourly cron — see CLAUDE.md).
 *
 * Deploy:  Cloudflare dashboard -> Workers -> Create -> paste this -> Deploy.
 */

const CAL_USER   = 'd4driving';
const EVENT_SLUG = '1hr-driving';   /* the 1-hour lesson is the teaser's unit */
const LESSON_MIN = 60;
const DAYS_AHEAD = 45;
const MAX_SLOTS  = 30;
const TZ         = 'Europe/London';

const ALLOWED_ORIGINS = new Set([
  'https://d4driving.co.uk',
  'https://www.d4driving.co.uk',
]);

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://d4driving.co.uk',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: {
        ...cors,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      }});
    }
    if (request.method !== 'GET') return json({ error: 'method not allowed' }, 405, cors);

    try {
      const slots = await getSlots();
      return json({ generated: new Date().toISOString(), source: 'cal.com', slots }, 200, {
        ...cors,
        /* A minute of edge caching keeps us clear of Cal.com's rate limits
           without the page ever showing anything meaningfully stale. */
        'Cache-Control': 'public, max-age=60',
      });
    } catch (err) {
      /* The page falls back to availability.json when this is not 200, so a
         Cal.com outage degrades to slightly-stale rather than to nothing. */
      return json({ error: String((err && err.message) || err) }, 502, cors);
    }
  },
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

export async function getSlots(fetchImpl = fetch) {
  const start = new Date();
  const end   = new Date(Date.now() + DAYS_AHEAD * 864e5);

  /* Shape copied from what the real booking page sends; the nulls and the
     `meta.values` block are required or tRPC rejects the input. */
  const input = {
    json: {
      isTeamEvent: false,
      usernameList: [CAL_USER],
      eventTypeSlug: EVENT_SLUG,
      startTime: start.toISOString(),
      endTime:   end.toISOString(),
      timeZone:  TZ,
      duration: null, rescheduleUid: null, orgSlug: null, teamMemberEmail: null,
      routedTeamMemberIds: null, crmRecordOwnerFallbackTeamMemberIds: null,
      crmRecordOwnerFallbackMode: null, skipContactOwner: false,
      routingFormResponseId: null, email: null, embedConnectVersion: '0',
      _isDryRun: false,
    },
    meta: { values: {
      duration: ['undefined'], orgSlug: ['undefined'], teamMemberEmail: ['undefined'],
      crmRecordOwnerFallbackMode: ['undefined'], routingFormResponseId: ['undefined'],
    }},
  };

  const url = 'https://cal.com/api/trpc/slots/getSchedule?input='
            + encodeURIComponent(JSON.stringify(input));
  const res = await fetchImpl(url, { headers: { 'User-Agent': 'D4DrivingSite/1.0' } });
  if (!res.ok) throw new Error(`cal.com returned HTTP ${res.status}`);

  const body  = await res.json();
  const byDay = body && body.result && body.result.data && body.result.data.json
              ? body.result.data.json.slots : null;
  if (!byDay) throw new Error('unexpected cal.com response shape');

  const out = [];
  for (const day of Object.keys(byDay).sort()) {
    /* Cal.com returns bookable START times. Consecutive ones describe a single
       free window, so merge them: 08:00, 09:00, 10:00 becomes one 08:00-11:00
       block — every hour of which is genuinely bookable. The date key is
       already London-local, which is what the page's grouping expects. */
    const times = byDay[day].map(s => new Date(s.time)).sort((a, b) => a - b);
    let i = 0;
    while (i < times.length) {
      let j = i;
      while (j + 1 < times.length && (times[j + 1] - times[j]) === LESSON_MIN * 60000) j++;
      out.push({
        date:  day,
        start: times[i].toISOString(),
        end:   new Date(times[j].getTime() + LESSON_MIN * 60000).toISOString(),
      });
      i = j + 1;
    }
  }
  return out.slice(0, MAX_SLOTS);
}
