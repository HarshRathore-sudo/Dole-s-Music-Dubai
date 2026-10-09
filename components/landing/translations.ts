/* ══════════════════════════════════════════════════════════════
   Canada Landing Page — English-only content
   ══════════════════════════════════════════════════════════════ */

/* ─── Navbar ─── */
export const nav = {
  services:    'Services',
  portfolio:   'Portfolio',
  about:       'About',
  cta:         'Get in Touch',
  skipToMain:  'Skip to main content',
};

/* ─── Hero ─── */
export const hero = {
  eyebrow:      'PREMIUM AUDIO SERVICES',
  line1:        'World-Class',
  line2:        'Audio Production',
  line3:        'Now Serving Canada Virtually',
  subhead:      'Professional mixing, mastering, and music production delivered remotely to artists, brands, and storytellers across Canada.',
  ctaPrimary:   'Send Us a Message',
  ctaSecondary: 'Listen to Our Work',
};

/* ─── Services ─── */
export const services = {
  eyebrow: 'SERVICES',
  heading: 'What We Do',
  description: 'Four core services. One goal: make your music sound its best.',
};

/* ─── Service cards ─── */
export const serviceCards = [
  {
    title: 'Production',
    description: 'Full music production from scratch. We take your idea, reference tracks, or rough demos and build a complete track. Arrangement, instrumentation, sound design — all of it.',
    deliverables: ['Full arrangement', 'Sound design', 'Live instruments', 'Stem delivery'],
  },
  {
    title: 'Mixing',
    description: 'We balance, shape, and polish your recorded tracks into a cohesive, release-ready mix. Whether you have raw stems from a home studio or a professional recording, we make it sound its best.',
    deliverables: ['Level balancing', 'EQ & dynamics', 'Spatial placement', 'Vocal treatment'],
  },
  {
    title: 'Mastering',
    description: 'The final step before release. We optimize your mix for streaming platforms, radio, and physical formats. Multiple master versions delivered.',
    deliverables: ['Loudness optimization', 'Platform-specific masters', 'Stem mastering available', 'WAV & MP3 delivery'],
  },
  {
    title: 'Custom Beats',
    description: 'Original beats and instrumentals made to your specifications. Tell us the vibe, genre, and references — we build it for you.',
    deliverables: ['Custom composition', 'Genre-flexible', 'Full stems included', 'Commercial license'],
  },
];

/* ─── Beats section ─── */
export const beats = {
  sectionTitle: 'Beats Library',
  sectionSub:   'Preview our sound. Every beat produced in-house.',
  cta:          'Get In Touch',
};

/* ─── Portfolio ─── */
export const portfolioContent = {
  eyebrow:     'PORTFOLIO',
  heading:     'Our Work',
  description: 'Films, singles, and brand sound — real credits from our studio.',
  tabs: {
    all:       'All',
    singles:   'Singles & Artists',
    filmTv:    'Film & TV',
    brands:    'Brands',
  },
};

export const portfolioItems: Record<string, { title: string; credit: string; workType: string }> = {
  jaadu:        { title: 'Jaadu — Do Patti', credit: 'Sachet–Parampara', workType: 'Film soundtrack — production and mix' },
  paisa:        { title: 'Paisa Hai Toh — Farzi', credit: 'Sachin-Jigar, Vishal Dadlani', workType: 'Film soundtrack — production and mix' },
  jumehraat:    { title: 'Jumehraat', credit: 'Hitzone · Prod by Jason', workType: 'Single — production, mix, and master' },
  sitare:       { title: 'Sitare', credit: 'Shaggy · OG', workType: 'Single — mix and master' },
  greyGames:    { title: 'Grey Games', credit: 'Kannada screen BGM', workType: 'Background score for film' },
  wrestling:    { title: 'Wrestling Extreme Mania', credit: 'Brand sonic identity', workType: 'Brand audio — theme and sound design' },
  saanpSeedhi:  { title: 'Saanp Seedhi', credit: 'Thoratt', workType: 'Single — production, mix, and master' },
  seedhaParcel: { title: 'Seedha Parcel', credit: 'Hitzone · Prod by Jason', workType: 'Single — production, mix, and master' },
  together:     { title: 'Together', credit: 'Hitzone x Bella · Prod by Jason', workType: 'Single — production, mix, and master' },
  homieLog:     { title: 'Homie Log', credit: 'Thoratt · Prod by Flamboy', workType: 'Single — production and mix' },
};

/* ─── Before / After Player ─── */
export const beforeAfter = {
  sectionTitle: 'Hear the Difference',
  sectionSub:   'Toggle between raw and studio-mastered versions.',
  before:       'Before',
  after:        'After',
};

/* ─── How It Works ─── */
export const howItWorks = {
  eyebrow: 'HOW IT WORKS',
  heading: 'Working With Us',
  steps: [
    {
      title: 'Consult with a Senior Engineer',
      description: 'Not a sales call. You speak directly with the engineer who’ll work on your project. We discuss your references, direction, and scope.',
    },
    {
      title: 'Get a Dedicated Project Manager',
      description: 'Once we agree on scope and financials, you’re assigned a PM who sets up a direct channel with you. One point of contact for everything.',
    },
    {
      title: 'Production & Revisions',
      description: 'We share drafts as they develop. Your PM collects feedback, coordinates revisions, and keeps you updated throughout.',
    },
    {
      title: 'Delivery & Ownership',
      description: 'You receive final masters, stems, and all original files. Full ownership with a No Objection Certificate.',
    },
  ],
};

/* ─── Testimonials ─── */
export const testimonials = {
  eyebrow:     'TESTIMONIALS',
  heading:     'What Artists Say',
  description: 'Real feedback from artists who worked with us.',
};

export const testimonialItems = [
  {
    text: "Working with Dole's Music felt genuinely empowering. The experience was smooth from start to finish, with clear communication, strong organization, and real respect for my creative vision.",
    author: 'Yashaswi',
    initial: 'Y',
  },
  {
    text: "Before starting any track they listen to the kind of output I am expecting as an artist and provide a demo first to fix the arrangement. It makes the work easier and they don't ask for full payment before starting.",
    author: 'Pritam',
    initial: 'P',
  },
  {
    text: "The team understands the vibes, so it's easy to create good music. They know the life of an independent artist isn't easy, especially financially, so they offer flexible payment options. They also help with promotion, which is amazing.",
    author: 'Zindagi Mubarak',
    initial: 'Z',
  },
  {
    text: "What made the process easier for me was that the sound engineers never created unnecessary pressure. He always takes the time to understand my vision first and communicates everything clearly. Even if I make mistakes, he handles them calmly and supportively.",
    author: 'Yashaswi',
    initial: 'Y',
  },
  {
    text: "The team at Dole's Music is one of the best to work with. They know how to bring out the best in an artist. No matter the genre, they approach every song with a fresh mindset and create something truly unique and high quality.",
    author: 'Meraki',
    initial: 'M',
  },
];

/* ─── FAQ ─── */
export const faqItems = [
  {
    question: 'How long does a project take?',
    answer: 'Expect about 2 weeks from start to final delivery, including revisions, for production and mix/master projects. Expedited delivery is available at additional cost based on timeline constraints.',
  },
  {
    question: 'Who owns the final work?',
    answer: 'Full ownership transfers to you, the client. We provide a No Objection Certificate (NOC) confirming this.',
  },
  {
    question: 'How many revisions do I get?',
    answer: 'Up to 5 revisions are included with every project.',
  },
  {
    question: 'What files do I receive?',
    answer: 'WAV files and stem files with different masters.',
  },
  {
    question: 'How often will I hear from you?',
    answer: 'Your dedicated project manager will update you every day or every other day, whenever there is progress. You will also have video calls with the PM and the project engineer.',
  },
  {
    question: 'How do I pay?',
    answer: 'We accept credit card payments.',
  },
];

/* ─── About ─── */
export const about = {
  eyebrow:     'About',
  heading:     'The Studio',
  description: "Dole's Music is a professional audio production house based in Mumbai, India. We deliver mixing, mastering, and full music production remotely to artists, brands, and filmmakers across Canada. From chart-ready singles to film scores and brand audio — we handle the sound so you can focus on the vision.",
};

/* ─── Final CTA ─── */
export const finalCta = {
  heading: "Let's Work Together",
  button:  'Get in Touch',
};

/* ─── Footer ─── */
export const footer = {
  tagline:   'Professional audio production for artists, brands, and filmmakers.',
  location:  'Mumbai, India',
  contact:   'Contact',
  copyright: "Dole's Music. All rights reserved.",
};

/* ─── Brand ─── */
export const brandName = "Dole's Music";

/* ─── Beat genre labels ─── */
export const beatGenres: Record<string, string> = {
  'All':           'All',
  'Afro / House':  'Afro / House',
  'Arabic Trap':   'Arabic Trap',
  'Desi':          'Desi',
  'Drill':         'Drill',
  'Hip-Hop':       'Hip-Hop',
  'Punjabi Trap':  'Punjabi Trap',
};

/* ─── Beat title labels ─── */
export const beatTitles: Record<string, string> = {
  'Afro House Beat':                     'Afro House Beat',
  'Dancefloor (118 BPM)':                'Dancefloor (118 BPM)',
  'Arabic Trap Beat':                    'Arabic Trap Beat',
  'Arabic Trap Beat (100 BPM)':          'Arabic Trap Beat (100 BPM)',
  'Shamur Beat (108 BPM, Dm)':           'Shamur Beat (108 BPM, Dm)',
  'Dark Jersey Drill Beat':              'Dark Jersey Drill Beat',
  'Indian Drill Beat':                   'Indian Drill Beat',
  'Indian Drill Beat III':               'Indian Drill Beat III',
  'Afro Drill x Jersey (140 BPM)':       'Afro Drill x Jersey (140 BPM)',
  'Khaas Freestyle Type Beat (98 BPM)':  'Khaas Freestyle Type Beat (98 BPM)',
  'Scott Storch Type Beat':              'Scott Storch Type Beat',
  'Torn Speaker (100 BPM)':              'Torn Speaker (100 BPM)',
  'Mama Beats 23':                       'Mama Beats 23',
  'Mama Beats 24':                       'Mama Beats 24',
  'Mama Beats 46':                       'Mama Beats 46',
  'Mama Beats 48':                       'Mama Beats 48',
  'Mama Beats 49':                       'Mama Beats 49',
  'Mama Beats 51':                       'Mama Beats 51',
  'Mama Beats 70':                       'Mama Beats 70',
  'Punjabi Trap Beat':                   'Punjabi Trap Beat',
};

/* ─── Beat artist ─── */
export const beatArtist = "Dole's Music";
