/* ══════════════════════════════════════════════════════════════
   Dubai Landing Page — English / Arabic Translations
   All Arabic text is human-quality, meaning-preserving translation
   (not machine-translated). RTL-aware.
   ══════════════════════════════════════════════════════════════ */

export type Lang = 'en' | 'ar';

function t(en: string, ar: string) {
  return { en, ar };
}

/* ─── Navbar ─── */
export const nav = {
  services:       t('Services', 'الخدمات'),
  portfolio:      t('Portfolio', 'أعمالنا'),
  about:          t('About', 'من نحن'),
  bookSession:    t('Book a Session', 'احجز جلستك'),
  skipToMain:     t('Skip to main content', 'تخطي إلى المحتوى الرئيسي'),
};

/* ─── Hero ─── */
export const hero = {
  eyebrow:        t('PREMIUM AUDIO SERVICES', 'خدمات صوتية متميزة'),
  line1:          t('World-Class', 'إنتاج صوتي'),
  line2:          t('Audio Production', 'عالمي المستوى'),
  line3:          t('Now Serving Dubai Virtually', 'الآن نخدم دبي عن بُعد'),
  subhead:        t(
    'Premium mixing, mastering, and sound design delivered remotely to Dubai\u2019s artists, brands, and storytellers \u2014 studio-quality results, anywhere you are.',
    'مكساج واتقان وتصميم صوتي متميّز يُقدَّم عن بُعد لفناني دبي وعلاماتها التجارية وصنّاع محتواها \u2014 نتائج بجودة الاستوديو، أينما كنت.'
  ),
  ctaPrimary:     t('Book a Free Consultation', 'احجز استشارة مجانية'),
  ctaSecondary:   t('Listen to Our Work', 'استمع إلى أعمالنا'),
};

/* ─── Services & Pricing Section ─── */
export const services = {
  eyebrow:        t('SERVICES & PRICING', 'الخدمات والأسعار'),
  heading:        t('The Sonic Experience', 'التجربة الصوتية'),
  description:    t(
    'Transparent pricing. Premium results. Every package engineered for excellence.',
    'أسعار شفافة. نتائج متميّزة. كل باقة مصمّمة لتحقيق التميّز.'
  ),
  // Sub-section headings
  mixingTitle:        t('Mixing & Mastering', 'المكساج والماسترينغ'),
  mixingSub:          t('Dynamic Equalizer Layout', 'تصميم الإيكوالايزر الديناميكي'),
  productionTitle:    t('Production & Sound Design', 'الإنتاج والتصميم الصوتي'),
  productionSub:      t('Analog Studio Rack', 'رف الاستوديو التماثلي'),
  addonsTitle:        t('Add-Ons & Blitz Deals', 'الإضافات والعروض السريعة'),
  addonsSub:          t('Backstage Access', 'وصول خلف الكواليس'),
};

/* ─── Pricing items — each package in both languages ─── */
export const pricing = {
  handsFree: {
    title:    t('The \u201CHands-Free\u201D Mix', 'المكساج \u201Cالتلقائي\u201D'),
    tagline:  t(
      'Trust the expert\u2019s ear. You drop the stems, we drop the perfect mix.',
      'ثق بأذن الخبير. أرسل المسارات ونحن نقدّم المكساج المثالي.'
    ),
    features: [
      t('Track up to 3:30 min', 'مسار حتى ٣:٣٠ دقيقة'),
      t('Up to 25 Stems', 'حتى ٢٥ مسار'),
      t('5-Day Delivery', 'تسليم خلال ٥ أيام'),
      t('AutoTune / WavesTune Only', 'أوتوتيون / ويفتيون فقط'),
      t('1 Revision', 'تعديل واحد'),
      t('1 Master', 'ماستر واحد'),
    ],
    cta:      t('Get Started', 'ابدأ الآن'),
  },
  premiumMix: {
    title:    t('The Premium Mix', 'المكساج الاحترافي'),
    badge:    t('Most Popular', 'الأكثر طلباً'),
    tagline:  t(
      'Deep-dive sonic engineering. Total creative control to perfect every frequency.',
      'هندسة صوتية متعمّقة. تحكّم إبداعي كامل لإتقان كل تردد.'
    ),
    features: [
      t('Track up to 6\u20137 min', 'مسار حتى ٦\u2013٧ دقائق'),
      t('Up to 100 Stems', 'حتى ١٠٠ مسار'),
      t('3 Virtual Sessions', '٣ جلسات افتراضية'),
      t('1st Draft in 3 Days', 'المسودة الأولى خلال ٣ أيام'),
      t('Final in 7\u201310 Days', 'النسخة النهائية خلال ٧\u2013١٠ أيام'),
      t('5 Revisions', '٥ تعديلات'),
      t('Manual Tuning \u2014 Melodyne & Time Flex', 'ضبط يدوي \u2014 Melodyne و Time Flex'),
      t('3 Masters', '٣ ماسترات'),
    ],
    cta:      t('Secure Your Session', 'احجز جلستك'),
  },
  vocalProduction: {
    title:    t('Vocal Production', 'إنتاج الأصوات'),
    tagline:  t(
      'Surgical tuning, pro timing, and vocal textures that make every section shine.',
      'ضبط دقيق وتوقيت احترافي وملمس صوتي يجعل كل مقطع يتألق.'
    ),
    features: [
      t('Track up to 4 min', 'مسار حتى ٤ دقائق'),
      t('Manual Tuning \u2014 Melodyne & Auto-Tune', 'ضبط يدوي \u2014 Melodyne وأوتوتيون'),
      t('Pro Timing (Manual)', 'توقيت احترافي (يدوي)'),
      t('Vocal Textures per Section', 'ملمس صوتي لكل مقطع'),
      t('1st Draft in 3 Days', 'المسودة الأولى خلال ٣ أيام'),
      t('5\u20136 Day Delivery', 'تسليم خلال ٥\u2013٦ أيام'),
      t('3 Revisions', '٣ تعديلات'),
    ],
    cta:      t('Get Started', 'ابدأ الآن'),
  },
  production: {
    title:    t('Production 101', 'الإنتاج ١٠١'),
    tagline:  t(
      'Full-scale production with live instruments, drum design, and stem-by-stem delivery.',
      'إنتاج شامل مع آلات حية وتصميم إيقاعات وتسليم مسار بمسار.'
    ),
    features: [
      t('Track up to 4 min', 'مسار حتى ٤ دقائق'),
      t('3 Virtual Sessions', '٣ جلسات افتراضية'),
      t('Up to 3 Live Instruments', 'حتى ٣ آلات موسيقية حية'),
      t('Drum Production & Sound Design', 'إنتاج الإيقاعات والتصميم الصوتي'),
      t('Stem-by-Stem Delivery', 'تسليم مسار بمسار'),
      t('Vertical & Horizontal Arrangement', 'توزيع رأسي وأفقي'),
      t('1st Draft in 3 Days', 'المسودة الأولى خلال ٣ أيام'),
      t('15-Day Total Delivery', 'تسليم إجمالي خلال ١٥ يوم'),
      t('3 Revisions', '٣ تعديلات'),
    ],
    cta:      t('Secure Your Session', 'احجز جلستك'),
  },
  premiumProd: {
    title:    t('Premium Prod', 'الإنتاج الاحترافي'),
    badge:    t('Full Creative Suite', 'الباقة الإبداعية الكاملة'),
    tagline:  t(
      'The ultimate production experience \u2014 unlimited revisions, genre diversity, and vocal production included.',
      'تجربة الإنتاج المطلقة \u2014 تعديلات غير محدودة، تنوّع الأنواع الموسيقية، وإنتاج صوتي مشمول.'
    ),
    features: [
      t('Track up to 6 min', 'مسار حتى ٦ دقائق'),
      t('5 Virtual Sessions', '٥ جلسات افتراضية'),
      t('Unlimited Revisions', 'تعديلات غير محدودة'),
      t('Vocal Production Included', 'إنتاج صوتي مشمول'),
      t('Up to 7 Live Instruments', 'حتى ٧ آلات موسيقية حية'),
      t('Genre Diversity in One Track', 'تنوّع الأنواع الموسيقية في مسار واحد'),
      t('1st Draft in 5 Days', 'المسودة الأولى خلال ٥ أيام'),
      t('20-Day Total Delivery', 'تسليم إجمالي خلال ٢٠ يوم'),
    ],
    cta:      t('Secure Your Session', 'احجز جلستك'),
  },
  realAudio: {
    title:    t('Reel Audio', 'الصوت الحقيقي'),
    oldPrice: t('680 AED', '٦٨٠ درهم'),
    tagline:  t(
      'A compact, fully produced acoustic arrangement — mixed and mastered to perfection.',
      'توزيع أكوستيك مكتمل ومضغوط — مكساج وماسترينغ بإتقان تام.'
    ),
    features: [
      t('Track up to 1:30 min', 'مسار حتى ١:٣٠ دقيقة'),
      t('Up to 3 Live Instruments', 'حتى ٣ آلات موسيقية حية'),
      t('1st Draft in 2 Days', 'المسودة الأولى خلال يومين'),
      t('Fully Mixed & Mastered', 'مكساج وماسترينغ كامل'),
      t('Acoustic Arrangement — Full in 5 Days', 'توزيع أكوستيك كامل خلال ٥ أيام'),
      t('No Virtual Sessions', 'بدون جلسات افتراضية'),
      t('3 Revisions', '٣ تعديلات'),
    ],
    cta:      t('Get Started', 'ابدأ الآن'),
  },
};

/* ─── Rush / Skip-the-line ─── */
export const rush = {
  title:        t('Skip-the-Line Delivery', 'التسليم بدون انتظار'),
  tagline:      t('\u201CNeed it yesterday?\u201D', '\u201Cتحتاجه بالأمس؟\u201D'),
  rush48:       t('48-Hour Rush', 'استعجال ٤٨ ساعة'),
  rush24:       t('24-Hour Blitz', 'استعجال ٢٤ ساعة'),
  perTrack:     t('per track', 'لكل مسار'),
  book:         t('Book', 'احجز'),
};

/* ─── Beats section ─── */
export const beats = {
  sectionTitle: t('Beats Library', 'مكتبة البيتات'),
  sectionSub:   t('Preview our signature sound — crafted for artists who demand excellence.', 'استعرض صوتنا المميز — مصنوع للفنانين الذين يطلبون التميّز.'),
  cta:          t('Book a Session', 'احجز جلستك'),
};

/* ─── Portfolio ─── */
export const portfolio = {
  eyebrow:      t('PORTFOLIO', 'أعمالنا'),
  heading:      t('Visualizing Sound', 'تصوير الصوت'),
  description:  t(
    'Films, singles & brand sonic identities — real credits from our studio.',
    'أفلام وأغاني وهوية صوتية للعلامات التجارية — أعمال حقيقية من استوديونا.'
  ),
  // Category badges
  film:         t('Film', 'سينما'),
  bgm:          t('BGM', 'موسيقى خلفية'),
  brand:        t('Brand', 'علامة تجارية'),
  single:       t('Single', 'أغنية فردية'),
  release:      t('Release', 'إصدار'),
  // Portfolio item titles & credits (proper names stay; descriptive text translated)
  aajKiRaat:    { title: t('Aaj Ki Raat – Stree 2', 'آج كي رات – ستري 2'), credit: t('Sachin-Jigar, Madhubanti, Divya K', 'ساشين-جيغار، مادوبانتي، ديفيا كي') },
  jaadu:        { title: t('Jaadu – Do Patti', 'جادو – دو باتي'), credit: t('Sachet–Parampara', 'ساشيت–بارامبارا') },
  paisa:        { title: t('Paisa Hai Toh – Farzi', 'بيسا هاي تو – فارزي'), credit: t('Sachin-Jigar, Vishal Dadlani', 'ساشين-جيغار، فيشال دادلاني') },
  greyGames:    { title: t('Grey Games', 'غراي غيمز'), credit: t('Kannada – Screen BGM', 'كنّادا – موسيقى تصويرية') },
  wrestling:    { title: t('Wrestling Extreme Mania', 'رسلينغ إكستريم مينيا'), credit: t('Brand sonic identity', 'الهوية الصوتية للعلامة التجارية') },
  saanpSeedhi:  { title: t('Saanp Seedhi', 'سانب سيدي'), credit: t('Thoratt', 'ثورات') },
  seedhaParcel: { title: t('Seedha Parcel', 'سيدها بارسل'), credit: t('Hitzone · Prod by Jason', 'هيتزون · إنتاج جيسون') },
  jumehraat:    { title: t('Jumehraat', 'جمعرات'), credit: t('Hitzone · Prod by Jason', 'هيتزون · إنتاج جيسون') },
  together:     { title: t('Together', 'توجيذر'), credit: t('Hitzone x Bella · Prod by Jason', 'هيتزون × بيلا · إنتاج جيسون') },
  sitare:       { title: t('Sitare', 'ستارے'), credit: t('Shaggy · OG', 'شاغي · أو جي') },
  homieLog:     { title: t('Homie Log', 'هومي لوج'), credit: t('Thoratt · Prod by Flamboy', 'ثورات · إنتاج فلامبوي') },
};

/* ─── Before / After Player ─── */
export const beforeAfter = {
  sectionTitle: t('Hear the Difference', 'اسمع الفرق'),
  sectionSub:   t('A/B comparison — toggle between raw and studio-mastered versions.', 'مقارنة مباشرة — تبديل بين النسخة الخام والنسخة المعالجة في الاستوديو.'),
  before:       t('Before', 'قبل'),
  after:        t('After', 'بعد'),
};

/* ─── Testimonials ─── */
export const testimonials = {
  eyebrow:      t('TESTIMONIALS', 'آراء العملاء'),
  heading:      t('What Artists Say', 'ماذا يقول الفنانون'),
  description:  t(
    'Real stories from artists who trusted us with their sound.',
    'قصص حقيقية من فنانين وثقوا بنا لصناعة صوتهم.'
  ),
  artistLabel:  t('Artist', 'فنان'),
};

/* ─── About ─── */
export const about = {
  eyebrow:      t('About', 'من نحن'),
  heading:      t('The Studio', 'الاستوديو'),
  description:  t(
    'Dole\u2019s Music is a Mumbai-based audio production house bringing together world-class engineering talent with a passion for sonic excellence. We deliver premium mixing, mastering, and sound design remotely to artists, brands, and storytellers across the Gulf \u2014 from chart-topping records to bespoke brand soundscapes, every project is crafted with intention.',
    'دولز ميوزك هو استوديو إنتاج صوتي مقره مومباي، يجمع مواهب هندسية عالمية المستوى بشغف للتميّز الصوتي. نقدّم خدمات المكساج والماسترينغ والتصميم الصوتي المتميزة عن بُعد للفنانين والعلامات التجارية وصنّاع المحتوى في منطقة الخليج \u2014 من الأسطوانات الأكثر مبيعاً إلى المشاهد الصوتية المخصصة للعلامات التجارية، كل مشروع يُصاغ بعناية وقصد.'
  ),
};

/* ─── Final CTA ─── */
export const finalCta = {
  heading:      t('Ready to Elevate Your Sound?', 'مستعد لرفع مستوى صوتك؟'),
  button:       t('Book Free Consultation', 'احجز استشارة مجانية'),
};

/* ─── Mobile CTA & helpers ─── */
export const mobileCta = {
  bookNow:       t('Free Consultation — Book Now', 'استشارة مجانية — احجز الآن'),
  limitedSlots:  t('Limited slots this month', 'أماكن محدودة هذا الشهر'),
  swipe:         t('Swipe for more', 'اسحب للمزيد'),
  letsTalk:      t("Let's Talk", 'لنتحدث'),
};

/* ─── Footer ─── */
export const footer = {
  tagline:      t(
    'World-class audio production and sonic engineering, delivering premium results for artists, brands, and filmmakers.',
    'إنتاج صوتي وهندسة صوتية عالمية المستوى، نقدّم نتائج متميّزة للفنانين والعلامات التجارية وصنّاع الأفلام.'
  ),
  location:     t('Mumbai, India', 'مومباي، الهند'),
  contact:      t('Contact', 'تواصل معنا'),
  copyright:    t(
    'Dole\u2019s Music. All rights reserved.',
    'دولز ميوزك. جميع الحقوق محفوظة.'
  ),
};

/* ─── Brand name ─── */
export const brand = {
  name:           t("Dole\u2019s Music", '\u062F\u0648\u0644\u0632 \u0645\u064A\u0648\u0632\u0643'),
};

/* ─── Beat genre translations ─── */
export const beatGenres: Record<string, { en: string; ar: string }> = {
  'All':           t('All', '\u0627\u0644\u0643\u0644'),
  'Afro / House':  t('Afro / House', '\u0623\u0641\u0631\u0648 / \u0647\u0627\u0648\u0633'),
  'Arabic Trap':   t('Arabic Trap', '\u062A\u0631\u0627\u0628 \u0639\u0631\u0628\u064A'),
  'Desi':          t('Desi', '\u062F\u064A\u0633\u064A'),
  'Drill':         t('Drill', '\u062F\u0631\u064A\u0644'),
  'Hip-Hop':       t('Hip-Hop', '\u0647\u064A\u0628 \u0647\u0648\u0628'),
  'Punjabi Trap':  t('Punjabi Trap', '\u062A\u0631\u0627\u0628 \u0628\u0646\u062C\u0627\u0628\u064A'),
};

/* ─── Beat title translations ─── */
export const beatTitles: Record<string, { en: string; ar: string }> = {
  'Afro House Beat':                     t('Afro House Beat', '\u0628\u064A\u062A \u0623\u0641\u0631\u0648 \u0647\u0627\u0648\u0633'),
  'Dancefloor (118 BPM)':                t('Dancefloor (118 BPM)', '\u062F\u0627\u0646\u0633\u0641\u0644\u0648\u0631 (\u0661\u0661\u0668 BPM)'),
  'Arabic Trap Beat':                    t('Arabic Trap Beat', '\u0628\u064A\u062A \u062A\u0631\u0627\u0628 \u0639\u0631\u0628\u064A'),
  'Arabic Trap Beat (100 BPM)':          t('Arabic Trap Beat (100 BPM)', '\u0628\u064A\u062A \u062A\u0631\u0627\u0628 \u0639\u0631\u0628\u064A (\u0661\u0660\u0660 BPM)'),
  'Shamur Beat (108 BPM, Dm)':           t('Shamur Beat (108 BPM, Dm)', '\u0628\u064A\u062A \u0634\u0627\u0645\u0648\u0631 (\u0661\u0660\u0668 BPM\u060C Dm)'),
  'Dark Jersey Drill Beat':              t('Dark Jersey Drill Beat', '\u0628\u064A\u062A \u062F\u0631\u064A\u0644 \u062C\u064A\u0631\u0633\u064A \u062F\u0627\u0631\u0643'),
  'Indian Drill Beat':                   t('Indian Drill Beat', '\u0628\u064A\u062A \u062F\u0631\u064A\u0644 \u0647\u0646\u062F\u064A'),
  'Indian Drill Beat III':               t('Indian Drill Beat III', '\u0628\u064A\u062A \u062F\u0631\u064A\u0644 \u0647\u0646\u062F\u064A III'),
  'Afro Drill x Jersey (140 BPM)':       t('Afro Drill x Jersey (140 BPM)', '\u0623\u0641\u0631\u0648 \u062F\u0631\u064A\u0644 \u00D7 \u062C\u064A\u0631\u0633\u064A (\u0661\u0664\u0660 BPM)'),
  'Khaas Freestyle Type Beat (98 BPM)':  t('Khaas Freestyle Type Beat (98 BPM)', '\u0628\u064A\u062A \u062E\u0627\u0635 \u0641\u0631\u064A\u0633\u062A\u0627\u064A\u0644 (\u0669\u0668 BPM)'),
  'Scott Storch Type Beat':              t('Scott Storch Type Beat', '\u0628\u064A\u062A \u0646\u0648\u0639 \u0633\u0643\u0648\u062A \u0633\u062A\u0648\u0631\u0634'),
  'Torn Speaker (100 BPM)':              t('Torn Speaker (100 BPM)', '\u062A\u0648\u0631\u0646 \u0633\u0628\u064A\u0643\u0631 (\u0661\u0660\u0660 BPM)'),
  'Mama Beats 23':                       t('Mama Beats 23', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0662\u0663'),
  'Mama Beats 24':                       t('Mama Beats 24', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0662\u0664'),
  'Mama Beats 46':                       t('Mama Beats 46', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0664\u0666'),
  'Mama Beats 48':                       t('Mama Beats 48', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0664\u0668'),
  'Mama Beats 49':                       t('Mama Beats 49', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0664\u0669'),
  'Mama Beats 51':                       t('Mama Beats 51', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0665\u0661'),
  'Mama Beats 70':                       t('Mama Beats 70', '\u0645\u0627\u0645\u0627 \u0628\u064A\u062A\u0633 \u0667\u0660'),
  'Punjabi Trap Beat':                   t('Punjabi Trap Beat', '\u0628\u064A\u062A \u062A\u0631\u0627\u0628 \u0628\u0646\u062C\u0627\u0628\u064A'),
};

/* ─── Beat artist translations ─── */
export const beatArtist = t("Dole\u2019s Music", '\u062F\u0648\u0644\u0632 \u0645\u064A\u0648\u0632\u0643');

/* ─── Testimonial items ─── */
export const testimonialItems = [
  {
    text: t(
      "Working with Dole\u2019s Music felt genuinely empowering. The experience was smooth from start to finish, with clear communication, strong organization, and real respect for my creative vision.",
      "\u0627\u0644\u0639\u0645\u0644 \u0645\u0639 \u062F\u0648\u0644\u0632 \u0645\u064A\u0648\u0632\u0643 \u0643\u0627\u0646 \u062A\u062C\u0631\u0628\u0629 \u0645\u0644\u0647\u0645\u0629 \u062D\u0642\u0651\u0627\u064B. \u0643\u0627\u0646\u062A \u0627\u0644\u062A\u062C\u0631\u0628\u0629 \u0633\u0644\u0633\u0629 \u0645\u0646 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0625\u0644\u0649 \u0627\u0644\u0646\u0647\u0627\u064A\u0629\u060C \u0645\u0639 \u062A\u0648\u0627\u0635\u0644 \u0648\u0627\u0636\u062D \u0648\u062A\u0646\u0638\u064A\u0645 \u0642\u0648\u064A \u0648\u0627\u062D\u062A\u0631\u0627\u0645 \u062D\u0642\u064A\u0642\u064A \u0644\u0631\u0624\u064A\u062A\u064A \u0627\u0644\u0625\u0628\u062F\u0627\u0639\u064A\u0629."
    ),
    author: t('Yashaswi', '\u064A\u0627\u0634\u0627\u0633\u0648\u064A'),
    initial: 'Y',
  },
  {
    text: t(
      "Well from before starting any track they listen to the kind of output as an artist I am expecting and they do provide a demo first to basically fix the arrangement. Which makes the work easier and even they don\u2019t ask for full payment before start making the track.",
      "\u0642\u0628\u0644 \u0628\u062F\u0621 \u0623\u064A \u0645\u0633\u0627\u0631\u060C \u064A\u0633\u062A\u0645\u0639\u0648\u0646 \u0625\u0644\u0649 \u0646\u0648\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u062A\u064A \u0623\u062A\u0648\u0642\u0639\u0647\u0627 \u0643\u0641\u0646\u0627\u0646\u060C \u0648\u064A\u0642\u062F\u0645\u0648\u0646 \u0639\u064A\u0651\u0646\u0629 \u0623\u0648\u0644\u0627\u064B \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062A\u0648\u0632\u064A\u0639. \u0647\u0630\u0627 \u064A\u062C\u0639\u0644 \u0627\u0644\u0639\u0645\u0644 \u0623\u0633\u0647\u0644\u060C \u0648\u0644\u0627 \u064A\u0637\u0644\u0628\u0648\u0646 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0643\u0627\u0645\u0644 \u0642\u0628\u0644 \u0628\u062F\u0621 \u0627\u0644\u0639\u0645\u0644."
    ),
    author: t('Pritam', '\u0628\u0631\u064A\u062A\u0627\u0645'),
    initial: 'P',
  },
  {
    text: t(
      "First of all, the team understands the vibes, so it\u2019s easy to create good music. They know the life of an independent artist is not easy, especially financially, so they offer flexible payment options which really help. They are also making sure to help with promotion, which is just amazing.",
      "\u0623\u0648\u0644\u0627\u064B\u060C \u0627\u0644\u0641\u0631\u064A\u0642 \u064A\u0641\u0647\u0645 \u0627\u0644\u0623\u062C\u0648\u0627\u0621\u060C \u0644\u0630\u0644\u0643 \u0645\u0646 \u0627\u0644\u0633\u0647\u0644 \u0625\u0646\u0634\u0627\u0621 \u0645\u0648\u0633\u064A\u0642\u0649 \u062C\u064A\u062F\u0629. \u064A\u0639\u0631\u0641\u0648\u0646 \u0623\u0646 \u062D\u064A\u0627\u0629 \u0627\u0644\u0641\u0646\u0627\u0646 \u0627\u0644\u0645\u0633\u062A\u0642\u0644 \u0644\u064A\u0633\u062A \u0633\u0647\u0644\u0629\u060C \u062E\u0627\u0635\u0629 \u0645\u0627\u062F\u064A\u0627\u064B\u060C \u0644\u0630\u0644\u0643 \u064A\u0642\u062F\u0645\u0648\u0646 \u062E\u064A\u0627\u0631\u0627\u062A \u062F\u0641\u0639 \u0645\u0631\u0646\u0629 \u062A\u0633\u0627\u0639\u062F \u062D\u0642\u0651\u0627\u064B. \u0643\u0645\u0627 \u064A\u0633\u0627\u0639\u062F\u0648\u0646 \u0641\u064A \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u060C \u0648\u0647\u0630\u0627 \u0634\u064A\u0621 \u0645\u0630\u0647\u0644."
    ),
    author: t('Zindagi Mubarak', '\u0632\u0646\u062F\u0642\u064A \u0645\u0628\u0627\u0631\u0643'),
    initial: 'Z',
  },
  {
    text: t(
      "What made the process easier for me as an artist was that sound engineers never created unnecessary pressure around the work. He always takes the time to understand my vision first and communicates everything clearly. Even if I make mistakes, he handles them very calmly and supportively.",
      "\u0645\u0627 \u062C\u0639\u0644 \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0623\u0633\u0647\u0644 \u0628\u0627\u0644\u0646\u0633\u0628\u0629 \u0644\u064A \u0643\u0641\u0646\u0627\u0646 \u0647\u0648 \u0623\u0646 \u0645\u0647\u0646\u062F\u0633\u064A \u0627\u0644\u0635\u0648\u062A \u0644\u0645 \u064A\u0636\u0639\u0648\u0627 \u0636\u063A\u0637\u0627\u064B \u063A\u064A\u0631 \u0636\u0631\u0648\u0631\u064A. \u062F\u0627\u0626\u0645\u0627\u064B \u064A\u0623\u062E\u0630 \u0627\u0644\u0648\u0642\u062A \u0644\u0641\u0647\u0645 \u0631\u0624\u064A\u062A\u064A \u0623\u0648\u0644\u0627\u064B \u0648\u064A\u062A\u0648\u0627\u0635\u0644 \u0628\u0648\u0636\u0648\u062D. \u062D\u062A\u0649 \u0625\u0630\u0627 \u0623\u062E\u0637\u0623\u062A\u060C \u064A\u062A\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0623\u0645\u0631 \u0628\u0647\u062F\u0648\u0621 \u0648\u062F\u0639\u0645."
    ),
    author: t('Yashaswi', '\u064A\u0627\u0634\u0627\u0633\u0648\u064A'),
    initial: 'Y',
  },
  {
    text: t(
      "I would honestly say that the team at Dole\u2019s Music is one of the best to work with. They really know how to bring out the best in an artist. No matter what the genre is, they approach every song with a fresh mindset and create something truly unique and high quality. If you ever get the chance to work with Dole\u2019s Music, don\u2019t miss it.",
      "\u0628\u0635\u0631\u0627\u062D\u0629\u060C \u0641\u0631\u064A\u0642 \u062F\u0648\u0644\u0632 \u0645\u064A\u0648\u0632\u0643 \u0645\u0646 \u0623\u0641\u0636\u0644 \u0645\u0646 \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0639\u0645\u0644 \u0645\u0639\u0647\u0645. \u064A\u0639\u0631\u0641\u0648\u0646 \u0643\u064A\u0641 \u064A\u0633\u062A\u062E\u0631\u062C\u0648\u0646 \u0623\u0641\u0636\u0644 \u0645\u0627 \u0641\u064A \u0627\u0644\u0641\u0646\u0627\u0646. \u0645\u0647\u0645\u0627 \u0643\u0627\u0646 \u0627\u0644\u0646\u0648\u0639 \u0627\u0644\u0645\u0648\u0633\u064A\u0642\u064A\u060C \u064A\u062A\u0639\u0627\u0645\u0644\u0648\u0646 \u0645\u0639 \u0643\u0644 \u0623\u063A\u0646\u064A\u0629 \u0628\u0639\u0642\u0644\u064A\u0629 \u062C\u062F\u064A\u062F\u0629 \u0648\u064A\u0635\u0646\u0639\u0648\u0646 \u0634\u064A\u0626\u0627\u064B \u0641\u0631\u064A\u062F\u0627\u064B \u0648\u0639\u0627\u0644\u064A \u0627\u0644\u062C\u0648\u062F\u0629. \u0625\u0630\u0627 \u0633\u0646\u062D\u062A \u0644\u0643 \u0627\u0644\u0641\u0631\u0635\u0629 \u0644\u0644\u0639\u0645\u0644 \u0645\u0639 \u062F\u0648\u0644\u0632 \u0645\u064A\u0648\u0632\u0643\u060C \u0644\u0627 \u062A\u0641\u0648\u0651\u062A\u0647\u0627."
    ),
    author: t('Meraki', '\u0645\u064A\u0631\u0627\u0643\u064A'),
    initial: 'M',
  },
];

/* ─── Helper: pick lang value ─── */
export function pick(pair: { en: string; ar: string }, lang: Lang): string {
  return pair[lang];
}

export function pickArr(pairs: { en: string; ar: string }[], lang: Lang): string[] {
  return pairs.map(p => p[lang]);
}
