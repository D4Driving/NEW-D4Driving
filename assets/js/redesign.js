/* Homepage redesign behaviour (Nov 2026), shared by index.html (English) and
   nauka-jazdy-peterborough.html (Polish). Language comes from <html lang>.
   No dependencies, no data stored beyond the visitor's own Comfort choices. */
(function () {
  'use strict';
  var root = document.documentElement;
  var PL = (root.lang || '').toLowerCase().indexOf('pl') === 0;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function calm() { return mqReduce.matches || root.classList.contains('c-calm'); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ── Text in both languages ── */
  var T = PL ? {
    tip: 'Rada Roberta:', qOf: function (a, b) { return 'Pytanie ' + a + ' z ' + b; },
    right: 'Dobrze. ', wrong: 'Niezupełnie. ', next: 'Następne pytanie', score: 'Zobacz wynik',
    book: 'Umów lekcję', again: 'Zacznij od nowa', playAgain: 'Zagraj jeszcze raz', notSaved: 'Twoje odpowiedzi nigdzie nie są zapisywane.',
    ready: [
      ['Wygląda na to, że jesteś prawie gotowy(-a) do egzaminu.', 'Lekcja z egzaminem próbnym to potwierdzi i dopracuje szczegóły.'],
      ['Jesteś na dobrej drodze.', 'Kilka lekcji skupionych na słabszych punktach zrobi dużą różnicę.'],
      ['Świetny moment, żeby zacząć porządnie.', 'Spokojne, uporządkowane lekcje najpierw budują podstawy, a reszta przychodzi łatwiej.']
    ],
    theoryScore: function (s, n) { return 'Twój wynik: ' + s + ' na ' + n; },
    theoryBest: function (b) { return 'Najlepszy wynik podczas tej wizyty: ' + b + '.'; },
    theoryMore: null,
    card: function (n) { return 'Karta ' + n + ', zakryta'; }, cardDown: 'Karta, zakryta', sign: 'Znak: ', meaning: 'Znaczenie: ',
    match: function (s) { return 'Para: ' + s + '.'; }, allDone: function (m) { return 'Wszystkie sześć par w ' + m + ' ruchach. Brawo!'; }, noPair: 'To nie para. Spróbuj jeszcze raz.'
  } : {
    tip: 'Robert\'s tip:', qOf: function (a, b) { return 'Question ' + a + ' of ' + b; },
    right: 'Correct. ', wrong: 'Not quite. ', next: 'Next question', score: 'See my score',
    book: 'Book a lesson', again: 'Start again', playAgain: 'Play again', notSaved: 'Your answers are not saved anywhere.',
    ready: [
      ['You sound nearly test-ready.', 'A mock test lesson will confirm it and polish the last details.'],
      ['You\'re on your way.', 'A few focused lessons on the areas you marked lower will make a real difference.'],
      ['A great time to start properly.', 'Calm, structured lessons build the basics first, so the rest comes easier.']
    ],
    theoryScore: function (s, n) { return 'You scored ' + s + ' out of ' + n; },
    theoryBest: function (b) { return 'Best this visit: ' + b + '. Want the full thing? Try the free mock theory test.'; },
    theoryMore: ['#theory-quiz-promo', 'Practise more theory'],
    card: function (n) { return 'Card ' + n + ', face down'; }, cardDown: 'Card, face down', sign: 'Sign: ', meaning: 'Meaning: ',
    match: function (s) { return 'Match: ' + s + '.'; }, allDone: function (m) { return 'All six matched in ' + m + ' moves. Nicely done.'; }, noPair: 'Not a pair. Try again.'
  };
  /* Where "book" links point: #booking on the homepage, #cta on the Polish page */
  var BOOK = document.getElementById('booking') ? '#booking' : '#cta';

  /* ── Comfort panel ── */
  var prefs = ['c-large', 'c-contrast', 'c-calm'];
  prefs.forEach(function (p) { if (store('d4-' + p) === '1') root.classList.add(p); });
  var cBtn = document.getElementById('comfort-btn');
  var cPanel = document.getElementById('comfort-panel');
  if (cBtn && cPanel) {
    cBtn.addEventListener('click', function () {
      var open = cPanel.hidden;
      cPanel.hidden = !open;
      cBtn.setAttribute('aria-expanded', String(open));
      if (open) cPanel.querySelector('input').focus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !cPanel.hidden) { cPanel.hidden = true; cBtn.setAttribute('aria-expanded', 'false'); cBtn.focus(); }
    });
    cPanel.querySelectorAll('input[data-pref]').forEach(function (inp) {
      var p = inp.getAttribute('data-pref');
      inp.checked = root.classList.contains(p);
      inp.addEventListener('change', function () {
        root.classList.toggle(p, inp.checked);
        store('d4-' + p, inp.checked ? '1' : '0');
        if (p === 'c-calm') syncVideos();
      });
    });
    var reset = cPanel.querySelector('.comfort-reset');
    if (reset) reset.addEventListener('click', function () {
      prefs.forEach(function (p) { root.classList.remove(p); store('d4-' + p, '0'); });
      cPanel.querySelectorAll('input[data-pref]').forEach(function (i) { i.checked = false; });
      syncVideos();
    });
  }

  /* ── Background videos: only on wider screens, never with reduced/calm motion or Save-Data ── */
  var saveData = navigator.connection && navigator.connection.saveData;
  function syncVideos() {
    document.querySelectorAll('video[data-src]').forEach(function (v) {
      var want = !calm() && !saveData && window.innerWidth >= 761;
      if (want && !v.src) {
        v.src = v.getAttribute('data-src');
        v.addEventListener('canplay', function () { v.classList.add('ready'); }, { once: true });
      }
      if (want) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else if (v.src) v.pause();
    });
  }
  syncVideos();
  mqReduce.addEventListener && mqReduce.addEventListener('change', syncVideos);

  /* ── Journey: light up stages and draw the line as it scrolls into view ── */
  var journey = document.getElementById('journey');
  if (journey) {
    var stages = journey.querySelectorAll('.j-stage');
    var fill = journey.querySelector('.journey-line span');
    var wide = window.matchMedia('(min-width: 900px)');
    var ticking = false;
    function update() {
      ticking = false;
      var r = journey.querySelector('.journey-track').getBoundingClientRect();
      var vh = window.innerHeight;
      var prog = Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
      if (calm()) prog = 1;
      var lit = Math.ceil(prog * stages.length);
      stages.forEach(function (s, i) { s.classList.toggle('on', i < lit); });
      if (fill) fill.style.transform = (wide.matches ? 'scaleX(' : 'scaleY(') + prog + ')';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ── Interactive car ── */
  var CAR = PL ? {
    mirrors: { t: 'Lusterka', p: 'Najpierw lusterko wsteczne, potem boczne po stronie, w którą jedziesz. Sprawdzaj je przed sygnalizowaniem, zmianą prędkości lub kierunku.', tip: 'Egzaminator patrzy na Twoje oczy. Liczy się szybkie, wyraźne spojrzenie, a nie wpatrywanie się.' },
    blindspot: { t: 'Martwe pole', p: 'Lusterka nie pokazują wszystkiego. Przed ruszeniem i przed zmianą pasa obejrzyj się przez ramię w miejsce, którego nie widać w lusterkach.', tip: 'Ruszanie bez sprawdzenia martwego pola to jeden z najczęstszych błędów na egzaminie.' },
    indicators: { t: 'Kierunkowskazy', p: 'Sygnalizuj wyraźnie i z wyprzedzeniem, zawsze po sprawdzeniu lusterek. Upewnij się, że kierunkowskaz wyłączył się po skręcie.', tip: 'Niewyłączony kierunkowskaz może wprowadzić innych w błąd.' },
    dashboard: { t: 'Kontrolki', p: 'Czerwona kontrolka oznacza: zatrzymaj się bezpiecznie i sprawdź, co się dzieje. Pomarańczowa: sprawdź to wkrótce. Przed egzaminem poznaj te najważniejsze.', tip: 'W elektrycznym C-HR+ nie słychać silnika, więc to kontrolka „Ready” mówi, że auto może ruszyć.' },
    showme: { t: 'Pytania „show me, tell me”', p: 'Na początku egzaminu dostajesz jedno pytanie „tell me”. W trakcie jazdy jedno pytanie „show me”, np. jak odparować przednią szybę.', tip: 'Każde z tych pytań ćwiczymy w aucie, więc w dniu egzaminu nic Cię nie zaskoczy.' },
    dual: { t: 'Podwójne pedały', p: 'Auto ma dodatkowy hamulec po stronie instruktora, więc lekcje są bezpieczne od pierwszego dnia. To zabezpieczenie, a nie sposób, żeby instruktor jechał za Ciebie.', tip: 'Świadomość, że on tam jest, pomaga nerwowym kursantom się rozluźnić i szybciej uczyć.' }
  } : {
    mirrors: { t: 'Mirrors', p: 'Interior mirror first, then the door mirror on the side you are moving to. Check them before you signal, change speed or change direction.', tip: 'Examiners watch your eyes. A quick, obvious glance counts; a stare does not.' },
    blindspot: { t: 'Blind spots', p: 'Mirrors cannot show everything. Before moving off, and before changing lanes, look over your shoulder into the area your mirrors miss.', tip: 'Moving off without a blind-spot check is one of the most common test faults.' },
    indicators: { t: 'Indicators', p: 'Signal clearly and in good time, only after checking your mirrors. Make sure it cancels once you have turned.', tip: 'A signal left flashing can mislead other road users.' },
    dashboard: { t: 'Warning lights', p: 'Red lights mean stop safely and investigate. Amber lights mean get it checked soon. Know where the ones that matter are before your test.', tip: 'In an electric car like the C-HR+ there is no engine noise, so the "Ready" light tells you the car can move.' },
    showme: { t: 'Show me, tell me', p: 'At the start of the test you are asked one "tell me" question. While driving you are asked one "show me" question, such as demisting the windscreen.', tip: 'We practise every question in the car, so none of them is a surprise on the day.' },
    dual: { t: 'Dual controls', p: 'The car has a second brake on the instructor\'s side, so lessons stay safe while you learn. It is there as a safety net, not to drive the car for you.', tip: 'Knowing it is there helps nervous learners relax and learn faster.' }
  };
  var carWrap = document.getElementById('car-explorer');
  if (carWrap) {
    var info = carWrap.querySelector('.car-info');
    var ctrls = carWrap.querySelectorAll('[data-car]');
    function show(key) {
      var d = CAR[key]; if (!d) return;
      info.innerHTML = '<h3>' + d.t + '</h3><p>' + d.p + '</p><p class="tip"><strong>' + T.tip + '</strong> ' + d.tip + '</p>';
      ctrls.forEach(function (c) {
        var on = c.getAttribute('data-car') === key;
        if (c.classList.contains('hotspot')) c.setAttribute('aria-pressed', String(on));
        else c.setAttribute('aria-selected', String(on));
      });
    }
    ctrls.forEach(function (c) { c.addEventListener('click', function () { show(c.getAttribute('data-car')); }); });
    show('mirrors');
  }

  /* ── Breathe intro before booking (3s, always skippable, once per visit) ── */
  var br = document.getElementById('breathe');
  if (br) {
    var timer = null;
    function go() {
      clearTimeout(timer);
      br.classList.remove('show'); br.hidden = true;
      var el = document.querySelector(BOOK);
      if (el) { el.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth' }); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
      try { history.replaceState(null, '', BOOK); } catch (e) {}
    }
    br.querySelector('.breathe-skip').addEventListener('click', go);
    br.addEventListener('keydown', function (e) { if (e.key === 'Escape') go(); });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="' + BOOK + '"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      var seen = false; try { seen = sessionStorage.getItem('d4-breathed') === '1'; } catch (x) {}
      if (seen) return;
      try { sessionStorage.setItem('d4-breathed', '1'); } catch (x) {}
      e.preventDefault();
      br.hidden = false;
      requestAnimationFrame(function () { br.classList.add('show'); });
      br.querySelector('.breathe-skip').focus();
      timer = setTimeout(go, calm() ? 1200 : 3000);
    });
  }

  /* ── Generic one-question-at-a-time quiz ── */
  function quiz(el, qs, finish) {
    if (!el) return;
    var i = 0, score = 0;
    function render() {
      if (i >= qs.length) { el.innerHTML = finish(score); bindRestart(); return; }
      var q = qs[i];
      var html = '<p class="quiz-progress">' + T.qOf(i + 1, qs.length) + '</p><p class="quiz-q" id="' + el.id + '-q">' + q.q + '</p><div class="quiz-opts" role="group" aria-labelledby="' + el.id + '-q">';
      q.a.forEach(function (opt, n) { html += '<button type="button" class="quiz-opt" data-n="' + n + '">' + opt + '</button>'; });
      html += '</div><p class="play-msg" aria-live="polite"></p>';
      el.innerHTML = html;
      el.querySelectorAll('.quiz-opt').forEach(function (b) { b.addEventListener('click', function () { pick(+b.getAttribute('data-n')); }); });
    }
    function pick(n) {
      var q = qs[i];
      if (typeof q.c === 'number') {
        var btns = el.querySelectorAll('.quiz-opt');
        btns.forEach(function (b) { b.disabled = true; });
        btns[q.c].classList.add('right');
        if (n === q.c) score++; else btns[n].classList.add('wrong');
        el.querySelector('.play-msg').textContent = (n === q.c ? T.right : T.wrong) + (q.why || '');
        var next = document.createElement('button');
        next.type = 'button'; next.className = 'btn btn-red'; next.style.marginTop = '12px';
        next.textContent = i + 1 < qs.length ? T.next : T.score;
        next.addEventListener('click', function () { i++; render(); el.querySelector('button').focus(); });
        el.appendChild(next); next.focus();
      } else { score += (q.pts ? q.pts[n] : 0); i++; render(); var f = el.querySelector('button'); if (f) f.focus(); }
    }
    function bindRestart() {
      var r = el.querySelector('[data-restart]');
      if (r) r.addEventListener('click', function () { i = 0; score = 0; render(); });
    }
    render();
  }

  /* Are you test-ready? Self-assessment, 0–2 points each */
  var READY = PL ? [
    { q: 'Jak czujesz się przy ruszaniu i bezpiecznym zatrzymywaniu?', a: ['Jeszcze niepewnie', 'Raczej dobrze', 'Całkowicie pewnie'] },
    { q: 'Czy radzisz sobie na ruchliwych rondach bez pomocy?', a: ['Jeszcze nie', 'Czasami', 'Tak, za każdym razem'] },
    { q: 'Jak idą Ci manewry (parkowanie, zatrzymanie po prawej stronie)?', a: ['Dopiero się uczę', 'Coraz lepiej', 'Dokładnie i pod kontrolą'] },
    { q: 'Czy dał(a)byś radę jechać sam(a) przez 20 minut według nawigacji lub znaków?', a: ['Nie', 'Z kilkoma podpowiedziami', 'Tak'] },
    { q: 'Czy masz za sobą pełny egzamin próbny?', a: ['Jeszcze nie', 'Tak, z kilkoma poważnymi błędami', 'Tak, i zdany'] },
    { q: 'Czy zdałeś(-aś) już egzamin teoretyczny?', a: ['Jeszcze nie', 'Mam wyznaczony termin', 'Tak'] }
  ] : [
    { q: 'How do you feel about moving off and stopping safely?', a: ['Not confident yet', 'Mostly fine', 'Completely comfortable'] },
    { q: 'Can you deal with busy roundabouts without help?', a: ['Not yet', 'Sometimes', 'Yes, every time'] },
    { q: 'How are your manoeuvres (parking, pulling up on the right)?', a: ['Still learning them', 'Getting there', 'Accurate and under control'] },
    { q: 'Could you follow sat nav or road signs for 20 minutes on your own?', a: ['No', 'With a few prompts', 'Yes'] },
    { q: 'Have you done a full mock test?', a: ['Not yet', 'Yes, with a few serious faults', 'Yes, and passed it'] },
    { q: 'Have you passed your theory test?', a: ['Not yet', 'Booked', 'Yes'] }
  ];
  READY.forEach(function (q) { q.pts = [0, 1, 2]; });
  quiz(document.getElementById('ready-quiz'), READY, function (s) {
    var r = T.ready[s >= 10 ? 0 : s >= 5 ? 1 : 2];
    return '<div class="quiz-result"><h3>' + r[0] + '</h3><p>' + r[1] + ' ' + T.notSaved + '</p><div class="quiz-actions"><a class="btn btn-red" href="' + BOOK + '">' + T.book + '</a><button type="button" class="btn btn-outline" data-restart>' + T.again + '</button></div></div>';
  });

  /* Theory questions game (facts from the Highway Code) */
  var THEORY = PL ? [
    { q: 'Jaka jest typowa całkowita droga zatrzymania przy 30 mph?', a: ['12 metrów', '23 metry', '36 metrów', '53 metry'], c: 1, why: 'Highway Code podaje 23 metry (75 stóp).' },
    { q: 'Jakie jest krajowe ograniczenie prędkości dla samochodu na drodze jednojezdniowej?', a: ['50 mph', '60 mph', '70 mph', '40 mph'], c: 1, why: 'Dla samochodów na drogach jednojezdniowych to 60 mph.' },
    { q: 'Jaki odstęp zostawić za pojazdem przed Tobą w dobrych, suchych warunkach?', a: ['Co najmniej sekundę', 'Co najmniej dwie sekundy', 'Co najmniej pięć sekund', 'Jedną długość auta'], c: 1, why: 'Co najmniej dwie sekundy, a na mokrej drodze co najmniej dwa razy więcej.' },
    { q: 'Co zwykle oznaczają niebieskie okrągłe znaki?', a: ['Ostrzeżenie', 'Nakaz', 'Kierunek jazdy', 'Zakaz'], c: 1, why: 'Niebieskie okrągłe znaki to znaki nakazu.' },
    { q: 'Jaka jest minimalna dopuszczalna głębokość bieżnika opon samochodu?', a: ['1 mm', '1,6 mm', '2 mm', '3 mm'], c: 1, why: '1,6 mm na środkowych trzech czwartych szerokości bieżnika, na całym obwodzie opony.' },
    { q: 'Kto odpowiada za to, by 12-letni pasażer miał zapięte pasy?', a: ['Dziecko', 'Rodzic dziecka', 'Kierowca', 'Nikt'], c: 2, why: 'Za pasażerów poniżej 14 lat odpowiada kierowca.' },
    { q: 'Na przejściu typu pelican miga pomarańczowe światło. Co robisz?', a: ['Ustępuję pieszym, którzy jeszcze przechodzą', 'Zatrzymuję się i czekam na zielone', 'Przyspieszam, żeby przejechać', 'Używam klaksonu'], c: 0, why: 'Możesz jechać dalej tylko wtedy, gdy przejście jest wolne.' },
    { q: 'Jaka jest typowa całkowita droga zatrzymania przy 70 mph?', a: ['53 metry', '73 metry', '96 metrów', '120 metrów'], c: 2, why: 'To 96 metrów, czyli około 24 długości samochodu.' }
  ] : [
    { q: 'What is the typical overall stopping distance at 30 mph?', a: ['12 metres', '23 metres', '36 metres', '53 metres'], c: 1, why: 'The Highway Code gives 23 metres (75 feet).' },
    { q: 'What is the national speed limit for a car on a single carriageway road?', a: ['50 mph', '60 mph', '70 mph', '40 mph'], c: 1, why: 'It is 60 mph for cars on single carriageways.' },
    { q: 'In good, dry conditions, what gap should you leave to the vehicle in front?', a: ['At least one second', 'At least two seconds', 'At least five seconds', 'One car length'], c: 1, why: 'At least a two-second gap, at least doubled on wet roads.' },
    { q: 'What do blue circular signs usually tell you?', a: ['A warning', 'A positive instruction', 'Directions', 'A prohibition'], c: 1, why: 'Blue circles give a mandatory, positive instruction.' },
    { q: 'What is the legal minimum tread depth for car tyres?', a: ['1 mm', '1.6 mm', '2 mm', '3 mm'], c: 1, why: '1.6 mm across the central three-quarters of the tread, all the way round.' },
    { q: 'Who is responsible for making sure a 12-year-old passenger wears a seat belt?', a: ['The child', 'The child\'s parent', 'The driver', 'Nobody'], c: 2, why: 'The driver is responsible for passengers under 14.' },
    { q: 'At a pelican crossing the amber light is flashing. What should you do?', a: ['Give way to pedestrians still crossing', 'Stop and wait for green', 'Speed up to get across', 'Sound your horn'], c: 0, why: 'You may go on only if the crossing is clear.' },
    { q: 'What is the typical overall stopping distance at 70 mph?', a: ['53 metres', '73 metres', '96 metres', '120 metres'], c: 2, why: 'It is 96 metres, about 24 car lengths.' }
  ];
  quiz(document.getElementById('theory-game'), THEORY, function (s) {
    var best = s; try { best = Math.max(+sessionStorage.getItem('d4-theory-best') || 0, s); sessionStorage.setItem('d4-theory-best', best); } catch (e) {}
    var more = T.theoryMore ? '<a class="btn btn-red" href="' + T.theoryMore[0] + '">' + T.theoryMore[1] + '</a>' : '';
    return '<div class="quiz-result"><h3>' + T.theoryScore(s, THEORY.length) + '</h3><p>' + T.theoryBest(best) + '</p><div class="quiz-actions">' + more + '<button type="button" class="btn btn-outline" data-restart>' + T.playAgain + '</button></div></div>';
  });

  /* Road signs memory game: match each sign to its meaning */
  var SIGN_SVG = {
    stop: '<svg viewBox="0 0 64 64" aria-hidden="true"><polygon points="20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20" fill="#BD2026"/><text x="32" y="38" font-size="15" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">STOP</text></svg>',
    giveway: '<svg viewBox="0 0 64 64" aria-hidden="true"><polygon points="4,6 60,6 32,58" fill="#BD2026"/><polygon points="14,12 50,12 32,45" fill="#fff"/></svg>',
    noentry: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#BD2026"/><rect x="12" y="27" width="40" height="10" fill="#fff"/></svg>',
    limit30: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#BD2026"/><circle cx="32" cy="32" r="23" fill="#fff"/><text x="32" y="40" font-size="22" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">30</text></svg>',
    roundabout: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#1d5fb4"/><g fill="none" stroke="#fff" stroke-width="5"><path d="M32 14a18 18 0 0 1 17 12"/><path d="M47 42a18 18 0 0 1-21 7"/><path d="M17 43a18 18 0 0 1 4-24"/></g></svg>',
    national: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#fff" stroke="#111" stroke-width="2"/><line x1="12" y1="48" x2="50" y2="12" stroke="#111" stroke-width="8"/></svg>'
  };
  var SIGN_NAME = PL
    ? { stop: 'Stop i ustąp pierwszeństwa', giveway: 'Ustąp pierwszeństwa', noentry: 'Zakaz wjazdu', limit30: 'Ograniczenie do 30 mph', roundabout: 'Mini rondo', national: 'Krajowe ograniczenie prędkości' }
    : { stop: 'Stop and give way', giveway: 'Give way', noentry: 'No entry', limit30: '30 mph limit', roundabout: 'Mini roundabout', national: 'National speed limit' };
  var mem = document.getElementById('memory-game');
  if (mem) {
    var grid = mem.querySelector('.mem-grid'), msg = mem.querySelector('.play-msg'), movesEl = mem.querySelector('[data-moves]');
    var first = null, lock = false, moves = 0, matched = 0;
    function deal() {
      var cards = [];
      Object.keys(SIGN_SVG).forEach(function (k) { cards.push({ k: k, sign: true }, { k: k, sign: false }); });
      for (var i = cards.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cards[i]; cards[i] = cards[j]; cards[j] = t; }
      grid.innerHTML = '';
      first = null; lock = false; moves = 0; matched = 0; movesEl.textContent = '0'; msg.textContent = '';
      cards.forEach(function (c, n) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'mem-card'; b.dataset.k = c.k;
        b.setAttribute('aria-label', T.card(n + 1));
        b.innerHTML = '<span class="back" aria-hidden="true">?</span><span class="face">' + (c.sign ? SIGN_SVG[c.k] : SIGN_NAME[c.k]) + '</span>';
        b.dataset.label = (c.sign ? T.sign : T.meaning) + SIGN_NAME[c.k];
        b.addEventListener('click', function () { flip(b); });
        grid.appendChild(b);
      });
    }
    function flip(b) {
      if (lock || b === first || b.classList.contains('done')) return;
      b.classList.add('up'); b.setAttribute('aria-label', b.dataset.label);
      if (!first) { first = b; return; }
      moves++; movesEl.textContent = String(moves);
      if (first.dataset.k === b.dataset.k) {
        first.classList.add('done'); b.classList.add('done'); matched++;
        msg.textContent = T.match(SIGN_NAME[b.dataset.k]);
        first = null;
        if (matched === 6) msg.textContent = T.allDone(moves);
      } else {
        lock = true; msg.textContent = T.noPair;
        var a = first; first = null;
        setTimeout(function () { [a, b].forEach(function (x) { x.classList.remove('up'); x.setAttribute('aria-label', T.cardDown); }); lock = false; }, calm() ? 600 : 1000);
      }
    }
    mem.querySelector('[data-shuffle]').addEventListener('click', deal);
    deal();
  }
})();
