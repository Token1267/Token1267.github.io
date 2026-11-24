(() => {
  const KK = {
    demo: '<a href="https://token1267.github.io/">Tolybay Uakhit</a> жасаған демо-сайт. Клиника, мекенжай, дәрігерлер мен бағалар ойдан алынған.',
    navPrices: 'Бағалар', navDoctors: 'Дәрігерлер', navContacts: 'Байланыс', navBook: 'Жазылу',
    h1: 'Тісті қорқынышсыз және сметадағы тосынсыйсыз емдейміз.',
    lead: 'Шымкенттегі стоматология: бағалар сайтта, емдеу жоспары мен сметасы алғашқы қабылдауда, сенбі күндері балалар дәрігері.',
    ctaBook: 'Онлайн жазылу', ctaPrices: 'Бағаларды көру',
    fact1: '2ГИС-те, 312 пікір', fact2: 'демалыссыз', fact3: 'Kaspi бөліп төлеу',
    toothAria: 'Тістің 3D-моделі. Имплантты көру үшін басыңыз',
    implantName: 'Имплант толық орнатумен', implantPrice: '180 000 ₸ бастап', toothHint: 'Тісті басып көріңіз',
    pricesTitle: 'Бағалар', pricesSub: 'Сайттағы баға сметадағы бағамен бірдей. Емдеу жоспары өзгерсе, алдымен сізге айтамыз.',
    p1: 'Кеңес, сурет және емдеу жоспары', p2: 'Тісжегіні емдеу', p2v: '18 000 ₸ бастап', p3: 'Кәсіби тазалау',
    p4: 'Тіс жұлу', p4v: '12 000 ₸ бастап', p5: 'Цирконий қаптама', p6: 'Osstem имплант толық орнатумен', p6v: '180 000 ₸ бастап',
    p7: 'ZOOM ағарту', p8: 'Балалар қабылдауы',
    docTitle: 'Дәрігерлер',
    d1r: 'Терапевт, 9 жыл тәжірибе', d1q: '«Арналарды микроскоппен емдеймін, әр қадамды бастамас бұрын түсіндіремін.»',
    d2n: 'Нұрлан Жұмабеков', d2r: 'Хирург-имплантолог, 12 жыл', d2q: '«2014 жылдан бері имплант орнатамын, бір жарым мыңнан астам.»',
    d3r: 'Балалар стоматологы', d3q: '«Алғашқы келу — танысу: қараймыз, ойнаймыз, ештеңе емдемейміз.»',
    bookTitle: 'Онлайн жазылу', bookSub: 'Қызметті, күнді және уақытты таңдаңыз. Әкімші WhatsApp арқылы 15 минутта растайды.',
    fService: 'Қызмет', s1: 'Кеңес', s2: 'Емдеу', s3: 'Тазалау', s4: 'Имплантация', s5: 'Балалар қабылдауы',
    fDay: 'Күн', fTime: 'Уақыт', fName: 'Атыңыз', fPhone: 'Телефон', fSubmit: 'Жазылу',
    revTitle: '2ГИС-тегі пікірлер',
    r1: '«Бұрынғы жаман тәжірибеден кейін баруға қорықтым. Айгерим бәрін суретте көрсетіп, бағасын басында айтты. Екі тісті бір келгенде емдеді.»',
    r1a: 'Гүлнара',
    r2: '«Имплант салдырдым. Бағасы сайттағымен теңгесіне дейін сәйкес келді, Kaspi бөліп төлеуі бес минутта рәсімделді.»',
    r3: '«Бес жасар ұлым тағы барғым келеді деп өзі айтты. Біз үшін бұл ғажап.»',
    ctTitle: 'Байланыс', ctWhere: 'Мекенжай', ctAddr: 'Байтұрсынұлы к-сі, 50, Шымкент (демо мекенжай)',
    ctWhen: 'Жұмыс уақыты', ctHours: 'Күн сайын, 9:00–21:00', ct2gis: '2ГИС-те ашу', ctWa: 'WhatsApp-қа жазу',
    foot: '«Күлкі» — <a href="https://token1267.github.io/">Tolybay Uakhit</a> жасаған демо-сайт. Клиника, мекенжай, дәрігерлер, пікірлер мен бағалар ойдан алынған.',
  };
  const DAYS = { ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], kk: ['Жс', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб'] };
  const MONTHS = {
    ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    kk: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  };
  const DONE = {
    ru: (n, s, d, t) => `Спасибо, ${n}! На настоящем сайте сейчас откроется WhatsApp клиники с вашей записью: ${s}, ${d}, ${t}.`,
    kk: (n, s, d, t) => `Рақмет, ${n}! Нағыз сайтта қазір клиниканың WhatsApp-ы сіздің жазылуыңызбен ашылады: ${s}, ${d}, ${t}.`,
  };

  let lang = 'ru';
  const originals = new Map();
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  nodes.forEach((n) => originals.set(n, n.innerHTML));
  const stage = document.getElementById('toothStage');
  const ariaRu = stage.getAttribute('aria-label');

  /* day and time chips */
  const daysBox = document.getElementById('days');
  const timesBox = document.getElementById('times');
  const today = new Date();
  const days = Array.from({ length: 6 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1));
  const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];
  let pickedDay = 0, pickedTime = 3;

  const chip = (label, sub, on, onClick) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.innerHTML = sub ? `<small>${sub}</small>${label}` : label;
    b.addEventListener('click', onClick);
    return b;
  };
  const renderChips = () => {
    daysBox.replaceChildren(...days.map((d, i) => chip(`${d.getDate()} ${MONTHS[lang][d.getMonth()]}`, DAYS[lang][d.getDay()], i === pickedDay, () => { pickedDay = i; renderChips(); })));
    timesBox.replaceChildren(...times.map((t, i) => chip(t, '', i === pickedTime, () => { pickedTime = i; renderChips(); })));
  };

  const setLang = (l) => {
    lang = l;
    document.documentElement.lang = l === 'kk' ? 'kk' : 'ru';
    nodes.forEach((n) => {
      const k = n.dataset.i18n;
      n.innerHTML = l === 'kk' && KK[k] ? KK[k] : originals.get(n);
    });
    stage.setAttribute('aria-label', l === 'kk' ? KK.toothAria : ariaRu);
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false'));
    try { localStorage.setItem('kulki-lang', l); } catch (e) { /* ignore */ }
    renderChips();
    document.getElementById('bookDone').textContent = '';
  };
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  let saved = null;
  try { saved = localStorage.getItem('kulki-lang'); } catch (e) { /* ignore */ }
  const fromUrl = new URLSearchParams(location.search).get('lang');
  setLang(fromUrl === 'kk' || (!fromUrl && saved === 'kk') ? 'kk' : 'ru');

  document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const sel = document.getElementById('service');
    const d = days[pickedDay];
    document.getElementById('bookDone').textContent = DONE[lang](
      f.get('name'), sel.options[sel.selectedIndex].text,
      `${DAYS[lang][d.getDay()]} ${d.getDate()} ${MONTHS[lang][d.getMonth()]}`, times[pickedTime]);
  });
})();
