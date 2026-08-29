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

const DAYS_AHEAD = 45;
const MAX_SLOTS  = 30;
const TZ         = 'Europe/London';

/* Durations are per-instructor because the two Cal.com accounts use different
   slugs — Rakesh renamed his, and his 1.5-hour one contains a literal dot.
   Cal.com slots each duration against its OWN interval, so the times genuinely
   differ: on 16 Sep 2026 Robert's 1-hour slot is 11:00 but his 1.5-hour is
   10:30. They cannot share a card; the page shows a duration toggle and swaps
   the whole list.

   Note both accounts also have a 90-minute ASSESSMENT event, deliberately not
   listed here — it is a different product, linked separately under the grid. */
const INSTRUCTORS = {
  robert: {
    user: 'd4driving',
    durations: [
      { minutes: 60,  label: '1 hour',   slug: '1hr-driving' },
      { minutes: 90,  label: '1½ hours', slug: '1.5-hr-driving-lesson' },
      { minutes: 120, label: '2 hours',  slug: '2-hrs-driving-lesson' },
    ],
  },
  rakesh: {
    user: 'rakesh-d4driving',
    durations: [
      { minutes: 60,  label: '1 hour',   slug: '1-hour-driving-tuition-manual-car' },
      { minutes: 90,  label: '1½ hours', slug: '1.5-hrs.-driving-lesson-manual' },
      { minutes: 120, label: '2 hours',  slug: '2-hours-driving-lesson' },
    ],
  },
};
const DEFAULT_INSTRUCTOR = 'robert';   /* the existing page calls with no param */

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
      const key = new URL(request.url).searchParams.get('instructor') || DEFAULT_INSTRUCTOR;
      const who = INSTRUCTORS[key];
      if (!who) return json({ error: `unknown instructor '${key}'` }, 400, cors);

      /* One request per duration, in parallel — Cal.com is the slow part. */
      const results = await Promise.all(who.durations.map(async d => {
        const { slots, daysAvailable } = await getSlots(who.user, d.slug, d.minutes);
        return { minutes: d.minutes, label: d.label, slug: d.slug, slots, daysAvailable };
      }));
      const options = results.filter(o => o.slots.length);
      /* `slots` stays the 1-hour list so the older page code and the
         availability.json fallback keep working unchanged. */
      const primary = results.find(o => o.minutes === 60);
      return json({
        generated: new Date().toISOString(),
        source: 'cal.com',
        instructor: key,
        user: who.user,          /* the page builds cal.com/<user>/<slug> */
        slots: primary ? primary.slots : [],
        options,
      }, 200, {
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

export async function getSlots(calUser, eventSlug, lessonMin, fetchImpl = fetch) {
  const start = new Date();
  const end   = new Date(Date.now() + DAYS_AHEAD * 864e5);

  /* Shape copied from what the real booking page sends; the nulls and the
     `meta.values` block are required or tRPC rejects the input. */
  const input = {
    json: {
      isTeamEvent: false,
      usernameList: [calUser],
      eventTypeSlug: eventSlug,
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
    /* Cal.com returns bookable START times. Consecutive ones (one lesson-length
       apart) describe a single free window, so merge them: for 60-min lessons
       08:00, 09:00, 10:00 becomes one 08:00-11:00 block, every hour of which is
       genuinely bookable. The date key is already London-local, which is what
       the page's grouping expects. */
    const step  = lessonMin * 60000;
    const times = byDay[day].map(s => new Date(s.time)).sort((a, b) => a - b);
    let i = 0;
    while (i < times.length) {
      let j = i;
      while (j + 1 < times.length && (times[j + 1] - times[j]) === step) j++;
      out.push({
        date:  day,
        start: times[i].toISOString(),
        end:   new Date(times[j].getTime() + step).toISOString(),
      });
      i = j + 1;
    }
  }
  /* Counted BEFORE the cap, so a page can honestly say "openings on N of the
     next 45 days" even when it only renders the first MAX_SLOTS blocks. */
  const daysAvailable = new Set(out.map(b => b.date)).size;
  return { slots: out.slice(0, MAX_SLOTS), daysAvailable };
}
