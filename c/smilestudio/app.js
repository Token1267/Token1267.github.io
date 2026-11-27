(() => {
  const KK = {
  "demo": "Smile Studio үшін сайт концепті. <a href=\"https://token1267.github.io/\">Tolybay Uakhit</a> идеяны көрсету үшін тапсырыссыз жасады. Бағалар шамамен алынған.",
  "navPrices": "Бағалар",
  "navServices": "Қызметтер",
  "navContacts": "Байланыс",
  "navBook": "Жазылу",
  "h1": "Тісті қорқынышсыз және сметадағы тосынсыйсыз емдейміз.",
  "lead": "Қарағанды қаласындағы стоматология, Камали Дүйсенбеков көшесі, 44/2. 2ГИС-те орташа баға 5,0, 202 пікір.",
  "ctaBook": "Онлайн жазылу",
  "ctaPrices": "Бағаларды көру",
  "implantName": "Имплантация",
  "implantPrice": "сіздің бағаңыз",
  "toothHint": "Тісті басып көріңіз",
  "pricesTitle": "Бағалар",
  "pricesSub": "Сайттағы баға сметадағы бағамен бірдей — пациенттер мұны бәрінен жоғары бағалайды.",
  "pricesNote": "Әзірге бағалар шамамен алынған: прайсты жіберсеңіз, бір күнде қоямыз.",
  "p1": "Кеңес және емдеу жоспары",
  "p2": "Тісжегіні емдеу",
  "p2v": "18 000 ₸ бастап",
  "p3": "Кәсіби тазалау",
  "p4": "Тіс жұлу",
  "p4v": "12 000 ₸ бастап",
  "p5": "Цирконий қаптама",
  "p6": "Имплант толық орнатумен",
  "p6v": "180 000 ₸ бастап",
  "svcTitle": "Қызметтер",
  "bookTitle": "Онлайн жазылу",
  "bookSub": "Пациент қызметті, күнді және уақытты таңдайды — өтінім бірден сіздің WhatsApp-қа келеді.",
  "fService": "Қызмет",
  "s1": "Кеңес",
  "s2": "Емдеу",
  "s3": "Тазалау",
  "s4": "Имплантация",
  "s5": "Балалар қабылдауы",
  "fDay": "Күн",
  "fTime": "Уақыт",
  "fName": "Атыңыз",
  "fPhone": "Телефон",
  "fSubmit": "Жазылу",
  "revTitle": "Пікірлер",
  "revText": "2ГИС-тегі орташа баға, 202 пікір. Сайтта пікірлер 2ГИС-тен алынады, пациентке іздеудің қажеті жоқ.",
  "revBtn": "2ГИС-те пікірлерді оқу",
  "ctTitle": "Байланыс",
  "ctWhere": "Мекенжай",
  "ctAddr": "Камали Дүйсенбеков көшесі, 44/2, Қарағанды",
  "ctWhen": "Жұмыс уақыты",
  "ctHours": "9:00–19:00",
  "ct2gis": "2ГИС-те ашу",
  "ctWa": "WhatsApp-қа жазу",
  "foot": "Бұл Smile Studio үшін сайт концепті: оны <a href=\"https://token1267.github.io/\">Tolybay Uakhit</a> сіздің сайтыңыз қалай көрінетінін көрсету үшін тапсырыссыз жасады. Атауы, мекенжайы мен рейтингі 2ГИС-тен алынды, бағалар шамамен.",
  "toothAria": "Тістің 3D-моделі. Имплантты көру үшін басыңыз",
  "fact1": "2ГИС-те, 202 пікір",
  "fact2": "жұмыс уақыты",
  "fact3": "WhatsApp арқылы жазылу",
  "sv1t": "Тіс емдеу",
  "sv1d": "Кариес, пульпит және тіс арналары, анестезиямен.",
  "sv2t": "Имплантация",
  "sv2d": "Қаптамасы бар имплант толық орнатумен. Жоспар мен баға — алғашқы қабылдауда.",
  "sv3t": "Ортодонтия",
  "sv3d": "Ересектер мен балаларға брекеттер және элайнерлер.",
  "sv4t": "Ортопедия",
  "sv4d": "Қаптамалар, винирлер және протездер.",
  "sv5t": "Хирургия",
  "sv5d": "Тіс жұлу, оның ішінде ақыл тістерін.",
  "sv6t": "Пародонтология",
  "sv6d": "Қызыл иекті емдеу және кәсіби тазалау."
};
  const DAYS = { ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], kk: ['Жс', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб'] };
  const MONTHS = {
    ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    kk: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  };
  const DONE = {
    ru: (n, s, d, t) => `Спасибо, ${n}! На готовом сайте эта запись сразу придёт вам в WhatsApp: ${s}, ${d}, ${t}.`,
    kk: (n, s, d, t) => `Рақмет, ${n}! Дайын сайтта бұл жазылу бірден сіздің WhatsApp-қа келеді: ${s}, ${d}, ${t}.`,
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
    try { localStorage.setItem('smilestudio-lang', l); } catch (e) { /* ignore */ }
    renderChips();
    document.getElementById('bookDone').textContent = '';
  };
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  let saved = null;
  try { saved = localStorage.getItem('smilestudio-lang'); } catch (e) { /* ignore */ }
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
