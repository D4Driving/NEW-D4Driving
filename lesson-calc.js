/* Lesson cost calculator: the cheapest way to buy a number of hours.
   PRICES LIVE HERE AND IN THE PRICE CARDS IN index.html. Change one, change both. */
(function (root) {
  var SINGLE_RATE = 42; // £ per hour for a 1-hour lesson; savings are measured against it
  var MIN_HOURS = 1, MAX_HOURS = 40;
  // hours, price, kind. Blocks can be bought more than once.
  var ITEMS = [
    { hours: 20,  price: 740, kind: 'block' },
    { hours: 15,  price: 560, kind: 'block' },
    { hours: 10,  price: 390, kind: 'block' },
    { hours: 5,   price: 200, kind: 'block' },
    { hours: 2,   price: 80,  kind: 'lesson' },
    { hours: 1.5, price: 60,  kind: 'lesson' },
    { hours: 1,   price: 42,  kind: 'lesson' }
  ];

  function label(item, n) {
    var h = String(item.hours);
    return n + ' × ' + h + '-hour ' + item.kind + (n > 1 ? 's' : '');
  }

  function bestPrice(hours) {
    var h = Math.round(Number(hours) || 0);
    h = Math.min(MAX_HOURS, Math.max(MIN_HOURS, h));
    var units = h * 2; // work in half hours so 1.5-hour lessons fit
    // best[u] = { cost, count, blocks, pick }; ties go to fewer items, then more block hours
    var best = [{ cost: 0, count: 0, blocks: 0, pick: -1 }];
    for (var u = 1; u <= units; u++) {
      var top = null;
      for (var i = 0; i < ITEMS.length; i++) {
        var w = ITEMS[i].hours * 2, prev = best[u - w];
        if (w > u || !prev) continue;
        var cand = {
          cost: prev.cost + ITEMS[i].price,
          count: prev.count + 1,
          blocks: prev.blocks + (ITEMS[i].kind === 'block' ? ITEMS[i].hours : 0),
          pick: i
        };
        if (!top || cand.cost < top.cost ||
            (cand.cost === top.cost && (cand.count < top.count ||
              (cand.count === top.count && cand.blocks > top.blocks)))) top = cand;
      }
      best[u] = top;
    }
    var counts = ITEMS.map(function () { return 0; });
    for (var v = units; v > 0; v -= ITEMS[best[v].pick].hours * 2) counts[best[v].pick]++;
    var parts = [], blockKinds = 0, blockTotal = 0, lastBlock = null;
    for (var j = 0; j < ITEMS.length; j++) {
      if (!counts[j]) continue;
      parts.push(label(ITEMS[j], counts[j]));
      if (ITEMS[j].kind === 'block') { blockKinds++; blockTotal += counts[j]; lastBlock = ITEMS[j].hours; }
    }
    var total = best[units].cost;
    return {
      hours: h,
      total: total,
      perHour: total / h,
      saving: SINGLE_RATE * h - total,
      description: parts.join(' + '),
      // the hours of the block when the whole order is exactly one block, else null
      singleBlock: (blockTotal === 1 && parts.length === 1) ? lastBlock : null
    };
  }

  var api = { bestPrice: bestPrice, MIN_HOURS: MIN_HOURS, MAX_HOURS: MAX_HOURS, SINGLE_RATE: SINGLE_RATE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LessonCalc = api;
})(this);
