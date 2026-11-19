/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — PURE FEST DATA, FILTERING, COUNTDOWN & VALIDATION LOGIC
   ═════════════════════════════════════════════════════════════════════ */

export const ANHAD_LINKS = {
  luma: 'https://lu.ma/anhad-gcet-2026',
  unstop: 'https://unstop.com/festivals/anhad-gcet-2026',
  instagram: 'https://instagram.com/studentcouncil.gcet',
  instagramApex: 'https://instagram.com/apex.gcet',
  instagramPromo: 'https://instagram.com/gcet.onlinepromotions',
  email: 'mailto:anhad.litfest@galgotiacollege.edu',
  maps: 'https://maps.google.com/?q=Galgotias+College+of+Engineering+and+Technology+Greater+Noida'
};

export const FEST_START_DATE = new Date('2026-11-26T10:00:00+05:30');

export const COMPETITIONS = [
  {
    id: 'parl-debate',
    title: 'Kurukshetra Parliamentary Debate',
    category: 'debate',
    categoryLabel: 'Debate & Oratory',
    day: 'Day 2 · Samvaad (27 Nov)',
    venue: 'GCET Main Auditorium',
    teamSize: 'Teams of 2–3',
    fee: '₹250 / team',
    prize: '₹18,000 Prize Pool + Rolling Trophy',
    deadline: '22 Nov 2026, 11:59 PM',
    summary: 'Three-round Asian Parliamentary debate tackling democracy, media ethics, and contemporary literature.',
    rules: [
      'Open to undergraduate and postgraduate students across Delhi NCR with valid college ID.',
      'Motions announced 30 minutes prior to each round; no internet access during prep.',
      'Speeches limited to 6 minutes (constructive) and 3 minutes (reply speech).',
      'Judged on matter, manner, method, and rebuttal sharpness.'
    ]
  },
  {
    id: 'turncoat-throwdown',
    title: 'Turncoat & Extempore Throwdown',
    category: 'debate',
    categoryLabel: 'Debate & Oratory',
    day: 'Day 1 · Aarambh (26 Nov)',
    venue: 'Block B Seminar Hall',
    teamSize: 'Individual',
    fee: '₹100 / participant',
    prize: '₹8,000 Prize Pool + Certificates',
    deadline: '23 Nov 2026, 11:59 PM',
    summary: 'Argue both for and against a surprise motion mid-speech when the bell rings—switching stance seamlessly.',
    rules: [
      'Topics drawn by chits 3 minutes before stage entry.',
      'Total speaking window: 3 minutes; bell signals mandatory stance switch every 45 seconds.',
      'Bilingual entries (English or Hindi) welcomed; clarity and wit carry highest weight.'
    ]
  },
  {
    id: 'mehfil-poetry',
    title: 'Mehfil-e-Sukhan Poetry Battle',
    category: 'poetry',
    categoryLabel: 'Poetry & Writing',
    day: 'Day 1 · Aarambh (26 Nov)',
    venue: 'Amphitheatre Lawn',
    teamSize: 'Individual',
    fee: '₹100 / poet',
    prize: '₹12,000 Prize Pool + Anthology Feature',
    deadline: '23 Nov 2026, 11:59 PM',
    summary: 'Original Hindi, Urdu, and English verse performed live in knock-out slam rounds before acclaimed poets.',
    rules: [
      'Strictly original compositions; plagiarism leads to immediate disqualification.',
      '3 minutes per piece in prelims; 4 minutes in the twilight finale.',
      'Props and background music are not permitted—voice, rhythm, and text take center stage.'
    ]
  },
  {
    id: 'open-mic',
    title: 'Unheard Voices Open Mic',
    category: 'poetry',
    categoryLabel: 'Poetry & Writing',
    day: 'Day 3 · Naad (28 Nov)',
    venue: 'Kitab Ghar Courtyard',
    teamSize: 'Individual / Duo',
    fee: 'Free with Fest Pass',
    prize: 'Featured Campus Spotlight & Gift Hampers',
    deadline: '25 Nov 2026 (Walk-in slots limited)',
    summary: 'Spoken word, short storytelling, ghazals, and acoustic folk ballads in an intimate courtyard circle.',
    rules: [
      '4-minute slot per performer; acoustic instruments allowed.',
      'Respectful campus guidelines apply; hate speech is strictly prohibited.',
      'Slots confirmed on a first-registered basis; 10 walk-in slots open daily at 10:30 AM.'
    ]
  },
  {
    id: 'kitab-fiction',
    title: 'Kitab Ghar Flash Fiction & Essay',
    category: 'poetry',
    categoryLabel: 'Poetry & Writing',
    day: 'Day 1 · Aarambh (26 Nov)',
    venue: 'Central Library Reading Room',
    teamSize: 'Individual',
    fee: '₹80 / writer',
    prize: '₹7,500 + Book Vouchers',
    deadline: '24 Nov 2026, 11:59 PM',
    summary: 'On-the-spot 750-word story or critical essay responding to a literary prompt unveiled at the desk.',
    rules: [
      '90-minute writing window on archival stationery provided by the organising desk.',
      'English and Hindi divisions judged separately by published editors.',
      'Top 10 entries published in the ANHAD ’26 Annual Zine.'
    ]
  },
  {
    id: 'lit-quiz-art',
    title: 'Inqilab Literary Quiz & Book-Cover Art',
    category: 'art',
    categoryLabel: 'Art & Quiz',
    day: 'Day 2 · Samvaad (27 Nov)',
    venue: 'Fine Arts Studio & Hall C',
    teamSize: 'Individual / Pairs',
    fee: '₹120 / entry',
    prize: '₹10,000 + Curated Hardbacks',
    deadline: '24 Nov 2026, 11:59 PM',
    summary: 'Two-track challenge pairing Indian & world literary trivia with hand-illustrated classic book-jacket design.',
    rules: [
      'Quiz: 25-question written prelims followed by a 6-team buzzer final.',
      'Cover Art: A3 cotton sheets provided; bring your own inks, watercolors, or pens.',
      'No AI-generated references or pre-printed transfers allowed.'
    ]
  }
];

export const SCHEDULE_ITEMS = [
  // Day 1 · Aarambh (26 Nov)
  {
    id: 's1',
    day: 'day1',
    dayLabel: 'Day 1 · 26 Nov',
    time: '10:00 AM',
    title: 'Inaugural Address & Lighting of the Lamp',
    category: 'panel',
    venue: 'Main Auditorium',
    note: 'Opening keynote with GCET Student Council & guest authors'
  },
  {
    id: 's2',
    day: 'day1',
    dayLabel: 'Day 1 · 26 Nov',
    time: '11:30 AM',
    title: 'Kitab Ghar Book Fair & Archival Reading Pavilion Opens',
    category: 'exhibit',
    venue: 'Central Courtyard',
    note: 'Independent publishers, rare Urdu/Hindi paperbacks & book swap'
  },
  {
    id: 's3',
    day: 'day1',
    dayLabel: 'Day 1 · 26 Nov',
    time: '12:30 PM',
    title: 'Turncoat & Extempore Throwdown (Prelims & Finals)',
    category: 'competition',
    venue: 'Block B Seminar Hall',
    note: 'Bilingual spontaneous oratory challenge'
  },
  {
    id: 's4',
    day: 'day1',
    dayLabel: 'Day 1 · 26 Nov',
    time: '02:30 PM',
    title: 'Kitab Ghar Flash Fiction & Essay Desk',
    category: 'competition',
    venue: 'Library Reading Room',
    note: '90-minute on-the-spot literary writing'
  },
  {
    id: 's5',
    day: 'day1',
    dayLabel: 'Day 1 · 26 Nov',
    time: '04:30 PM',
    title: 'Kavi Sammelan & Mehfil-e-Sukhan Poetry Battle',
    category: 'performance',
    venue: 'Amphitheatre Lawn',
    note: 'Fresh campus voices alongside invited Hindi & Urdu poets'
  },
  // Day 2 · Samvaad (27 Nov)
  {
    id: 's6',
    day: 'day2',
    dayLabel: 'Day 2 · 27 Nov',
    time: '10:30 AM',
    title: 'Bhagat Singh: The Revolutionary Pen — Archival Exhibit',
    category: 'exhibit',
    venue: 'Heritage Gallery (Block A)',
    note: 'Curated readings of essays, letters & Why I Am an Atheist'
  },
  {
    id: 's7',
    day: 'day2',
    dayLabel: 'Day 2 · 27 Nov',
    time: '11:15 AM',
    title: 'Fourth Pillar of Democracy — Journalism Panel',
    category: 'panel',
    venue: 'Main Auditorium',
    note: 'Long-form reporters & editors on independent storytelling'
  },
  {
    id: 's8',
    day: 'day2',
    dayLabel: 'Day 2 · 27 Nov',
    time: '01:30 PM',
    title: 'Kurukshetra Parliamentary Debate (Break Rounds)',
    category: 'competition',
    venue: 'Main Auditorium & Hall C',
    note: 'Quarter-finals and semi-finals'
  },
  {
    id: 's9',
    day: 'day2',
    dayLabel: 'Day 2 · 27 Nov',
    time: '03:45 PM',
    title: 'Dastangoi: The Lost Art of Urdu Storytelling',
    category: 'performance',
    venue: 'Amphitheatre Lawn',
    note: 'Traditional duo oral-performance recital'
  },
  {
    id: 's10',
    day: 'day2',
    dayLabel: 'Day 2 · 27 Nov',
    time: '05:30 PM',
    title: 'Sufi Night — Evening Mehfil',
    category: 'performance',
    venue: 'Main Lawn Stage',
    note: 'Live qawwali, harmonium & acoustic Sufi repertoire'
  },
  // Day 3 · Naad (28 Nov)
  {
    id: 's11',
    day: 'day3',
    dayLabel: 'Day 3 · 28 Nov',
    time: '10:30 AM',
    title: 'Conscious Living & Reading Circle',
    category: 'panel',
    venue: 'Kitab Ghar Courtyard',
    note: 'Slow reading, journaling & mindful creative habits'
  },
  {
    id: 's12',
    day: 'day3',
    dayLabel: 'Day 3 · 28 Nov',
    time: '12:00 PM',
    title: 'Unheard Voices Open Mic & Freshers’ Artistry',
    category: 'performance',
    venue: 'Kitab Ghar Courtyard',
    note: 'Campus debut poets, guitarists & storytellers'
  },
  {
    id: 's13',
    day: 'day3',
    dayLabel: 'Day 3 · 28 Nov',
    time: '02:15 PM',
    title: 'Parliamentary Debate Grand Final & Lit Quiz Finals',
    category: 'competition',
    venue: 'Main Auditorium',
    note: 'Championship debate followed by live buzzer round'
  },
  {
    id: 's14',
    day: 'day3',
    dayLabel: 'Day 3 · 28 Nov',
    time: '04:30 PM',
    title: 'Valedictory, Prizes & Anthology Launch',
    category: 'panel',
    venue: 'Main Auditorium',
    note: 'Winners announced & ANHAD ’26 Zine unveiled'
  },
  {
    id: 's15',
    day: 'day3',
    dayLabel: 'Day 3 · 28 Nov',
    time: '05:45 PM',
    title: 'Naad: Acoustic Closing Celebration',
    category: 'performance',
    venue: 'Main Lawn Stage',
    note: 'Ensemble folk-fusion finale closing the three-day festival'
  }
];

export const FAQ_TOPICS = {
  registration: {
    label: 'Registration & Passes',
    items: [
      {
        q: 'Is entry free for non-GCET college students?',
        a: 'General Visitor Passes for sessions, exhibits, and Kitab Ghar are free with prior registration on Luma. Competition slots carry a nominal fee on Unstop.'
      },
      {
        q: 'Can I register on the spot at the campus gate?',
        a: 'General visitor passes can be issued at Desk A until capacity, while all competitive events require online registration before their listed deadline.'
      },
      {
        q: 'Can one student participate in multiple competitions?',
        a: 'Yes, provided the round timings do not clash. Check the Day 1–3 schedule spread before booking overlapping tracks.'
      }
    ]
  },
  competitions: {
    label: 'Competitions & Rules',
    items: [
      {
        q: 'Are Hindi and Urdu submissions accepted alongside English?',
        a: 'Yes. Mehfil-e-Sukhan, Turncoat, Open Mic, and Flash Fiction welcome Hindi, Urdu, and English entries with dedicated judging rubrics.'
      },
      {
        q: 'Are cross-college teams allowed for the Parliamentary Debate?',
        a: 'Yes, cross-institutional teams are welcome as long as every member carries a valid physical college ID card.'
      },
      {
        q: 'When are debate motions and writing prompts shared?',
        a: 'Debate motions are released 30 minutes before each round; writing and cover-art prompts are revealed at the venue desk.'
      }
    ]
  },
  travel: {
    label: 'Travel & Entry',
    items: [
      {
        q: 'What is the nearest Metro station to GCET?',
        a: 'Knowledge Park II Metro Station on the Aqua Line is approximately 1.2 km (5 minutes by e-rickshaw) from the GCET main gate.'
      },
      {
        q: 'What ID documents are required at security?',
        a: 'Carry both your physical College ID card (or Government Photo ID for alumni/guests) and your digital pass QR code.'
      },
      {
        q: 'Is outstation accommodation available?',
        a: 'Limited shared hostel & partner-PG referrals near Knowledge Park II are coordinated for outstation finalists—write to the desk by 18 Nov.'
      }
    ]
  },
  certificates: {
    label: 'Certificates & Prizes',
    items: [
      {
        q: 'Will every participant receive an official certificate?',
        a: 'Yes. Verified digital participation certificates are emailed within 7 days of the fest; podium winners receive printed citations on Day 3.'
      },
      {
        q: 'How and when is prize money disbursed?',
        a: 'Trophies and merit citations are presented during the Day 3 Valedictory; cash prizes transfer via bank/UPI within 14 working days.'
      },
      {
        q: 'Where will final results and photos be published?',
        a: 'Official winners, jury notes, and the ANHAD ’26 gallery go live on the Community spread and @studentcouncil.gcet immediately after Day 3.'
      }
    ]
  }
};

export const RASA_DATA = {
  shringara: {
    name: 'Shringara · श्रृंगार',
    mood: 'Love, longing & lyricism',
    quote: '“गुलों में रंग भरे बाद-ए-नौ-बहार चले, चले भी आओ कि गुलशन का कारोबार चले।” — Faiz Ahmad Faiz',
    pick: 'Catch Sufi Night on Day 2 (5:30 PM, Main Lawn)'
  },
  veera: {
    name: 'Veera · वीर',
    mood: 'Courage, conviction & dissent',
    quote: '“Before the slogan echoed across streets, it was forged in prison cells surrounded by books and essays.”',
    pick: 'Visit Bhagat Singh: The Revolutionary Pen Gallery'
  },
  adbhuta: {
    name: 'Adbhuta · अद्भुत',
    mood: 'Wonder & oral storytelling',
    quote: '“Every story is a doorway left slightly ajar for the listener who refuses to hurry past.”',
    pick: 'Experience Dastangoi on Day 2 (3:45 PM, Amphitheatre)'
  },
  shanta: {
    name: 'Shanta · शांत',
    mood: 'Stillness, books & reflection',
    quote: '“किताबें झाँकती हैं बंद अलमारी के शीशों से, बड़ी हसरत से तकती हैं।” — Bashir Badr',
    pick: 'Browse Kitab Ghar Courtyard & Day 3 Reading Circle'
  },
  hasya: {
    name: 'Hasya · हास्य',
    mood: 'Wit, satire & nimble thought',
    quote: '“Switch your argument mid-sentence without losing your poise—or the room.”',
    pick: 'Join the Turncoat Throwdown on Day 1 (12:30 PM)'
  },
  karuna: {
    name: 'Karuna · करुणा',
    mood: 'Empathy & shared human memory',
    quote: '“Literature is how strangers lend one another a lantern in the dark.”',
    pick: 'Listen in at Unheard Voices Open Mic on Day 3'
  }
};

export const MAP_PINS = {
  auditorium: {
    title: 'Main Auditorium (Block A)',
    meta: 'Inaugural · Fourth Pillar Panel · Debate Finals · Valedictory',
    detail: 'Air-conditioned 650-seat auditorium directly straight ahead from Gate 1. Entry opens 20 minutes prior to each keynote.'
  },
  lawn: {
    title: 'Amphitheatre & Main Lawn',
    meta: 'Kavi Sammelan · Dastangoi · Sufi Night · Naad Finale',
    detail: 'Open-air terraced seating lit with warm lanterns after dusk. Cushioned floor seating in front, chairs behind.'
  },
  kitab: {
    title: 'Kitab Ghar Courtyard',
    meta: 'Book Fair · Open Mic · Conscious Living Reading Circle',
    detail: 'Shaded central quadrangle hosting independent bookstalls, author signings, tea counter, and the Ink Your Verse board.'
  },
  gallery: {
    title: 'Heritage Gallery (Block A, Floor 1)',
    meta: 'Bhagat Singh: The Revolutionary Pen Exhibit',
    detail: 'Quiet archival exhibition featuring essays, prison notebooks, timelines, and guided student docent tours (10:30 AM – 5:00 PM).'
  },
  desk: {
    title: 'Registration & Help Desk',
    meta: 'Wristbands · ID Check · Outstation Info · Lost & Found',
    detail: 'Located immediately inside Gate 1 beside the fountain plaza. Present your Luma/Unstop QR and College ID here first.'
  },
  metro: {
    title: 'Gate 1 · Metro Shuttle Point',
    meta: '5 mins from Knowledge Park II Metro (Aqua Line)',
    detail: 'Frequent e-rickshaws and shared autos run continuously between Knowledge Park II Metro Station and GCET Gate 1.'
  }
};

export function filterCompetitions(category = 'all') {
  if (!category || category === 'all') {
    return [...COMPETITIONS];
  }
  return COMPETITIONS.filter((c) => c.category === category);
}

export function filterSchedule({ day = 'all', category = 'all', query = '' } = {}) {
  const q = String(query || '').trim().toLowerCase();
  return SCHEDULE_ITEMS.filter((item) => {
    const matchDay = !day || day === 'all' || item.day === day;
    const matchCategory = !category || category === 'all' || item.category === category;
    const matchQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.venue.toLowerCase().includes(q) ||
      item.note.toLowerCase().includes(q);
    return matchDay && matchCategory && matchQuery;
  });
}

export function getFaqsByTopic(topicKey = 'registration') {
  const entry = FAQ_TOPICS[topicKey] || FAQ_TOPICS.registration;
  return {
    topicKey: FAQ_TOPICS[topicKey] ? topicKey : 'registration',
    label: entry.label,
    items: [...entry.items]
  };
}

export function formatCountdown(now = new Date(), target = FEST_START_DATE) {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return 'Live Now · 26–28 Nov 2026';
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d · ${hours}h · ${mins}m`;
}

export function validateFeedback({ name = '', email = '', message = '' } = {}) {
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim();
  const cleanMsg = String(message).trim();

  if (cleanName.length < 2) {
    return { valid: false, error: 'Please enter your name (at least 2 characters).' };
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRe.test(cleanEmail)) {
    return { valid: false, error: 'Please enter a valid email address so we can reply.' };
  }
  if (cleanMsg.length < 10) {
    return { valid: false, error: 'Please write at least 10 characters in your message.' };
  }
  return { valid: true, error: '' };
}
