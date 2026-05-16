'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import DubaiNavbar from './DubaiNavbar';
import { DubaiLanguageProvider, useDubaiLang } from './DubaiLanguageContext';
import {
  pick, pickArr,
  hero, services as svcT, pricing as prT, rush as rushT,
  beats as beatsT, portfolio as portT, testimonials as testT, about as aboutT,
  beforeAfter as baT,
  finalCta, footer as footerT,
  brand, beatGenres, beatTitles, beatArtist, testimonialItems,
  nav, mobileCta,
} from './translations';
import SecureBeatsPlayer from './SecureBeatsPlayer';
import CardBeforeAfterPlayer from './CardBeforeAfterPlayer';
import { globalAudioManager } from './globalAudioManager';
import type { CardAudioSample } from './CardBeforeAfterPlayer';
import type { Beat } from './SecureBeatsPlayer';
import type { Lang } from './translations';

/* ══════════════════════════════════════════════════════════════
   Dubai Landing Page — Full Restore + AR/EN Translation
   All content is real. No placeholders. No fake credits.
   Mumbai-based studio serving Dubai virtually.
   ══════════════════════════════════════════════════════════════ */

/* ─── Trust-bar brands (real clients — kept in English always) ─── */
const BRANDS = [
  'Hero MotoCorp',
  'Himalaya',
  'Apex Hospitals',
  'Vision11',
  'Wrestling Extreme Mania',
  'Vridhi Home Finance',
];

/* ─── Portfolio (real credits with real YouTube IDs) ─── */
const PORTFOLIO = [
  { translationKey: 'aajKiRaat' as const, categoryKey: 'film' as const, ytId: 'roz9sXFkTuE' },
  { translationKey: 'jaadu' as const, categoryKey: 'film' as const, ytId: 'pgsBaKYTi1M' },
  { translationKey: 'paisa' as const, categoryKey: 'film' as const, ytId: 'XsOPuQ9Z7Eo' },
  { translationKey: 'jumehraat' as const, categoryKey: 'single' as const, ytId: 'PvjQMOJfDKU' },
  { translationKey: 'sitare' as const, categoryKey: 'single' as const, ytId: 'KP78gDwR7RQ' },
  { translationKey: 'greyGames' as const, categoryKey: 'bgm' as const, ytId: 'GGXiPOiNZGQ' },
  { translationKey: 'wrestling' as const, categoryKey: 'brand' as const, ytId: 'gNcVam9qWnE' },
  { translationKey: 'saanpSeedhi' as const, categoryKey: 'single' as const, ytId: 'lhlZrBdiqBk' },
  { translationKey: 'seedhaParcel' as const, categoryKey: 'single' as const, ytId: 'ptcKrvLoBjE' },
  { translationKey: 'together' as const, categoryKey: 'single' as const, ytId: 'YVC4-Oahl60' },
  { translationKey: 'homieLog' as const, categoryKey: 'single' as const, ytId: 'h7bwX-Iarv4' },
];

/* ─── Common CTA link for all packages ─── */
const BOOKING_LINK = 'https://tealfeed.com/doles_music/connect/call?callType=69f0b4eb03abf7c5fa258689';

/* ─── Beats Library — raw data (EN keys); resolved to lang at render time ─── */
const BEATS_RAW = [
  { id: 'b1',  titleKey: 'Afro House Beat',                     genreKey: 'Afro / House',  src: '/beats/Afro-House-Beat.mp3' },
  { id: 'b2',  titleKey: 'Dancefloor (118 BPM)',                genreKey: 'Afro / House',  src: '/beats/Dancefloor-118.mp3' },
  { id: 'b3',  titleKey: 'Arabic Trap Beat',                    genreKey: 'Arabic Trap',   src: '/beats/Arabic-Trap-Beat.mp3' },
  { id: 'b4',  titleKey: 'Arabic Trap Beat (100 BPM)',          genreKey: 'Arabic Trap',   src: '/beats/Arabic-Trap-Beat-100BPM.mp3' },
  { id: 'b5',  titleKey: 'Shamur Beat (108 BPM, Dm)',           genreKey: 'Desi',          src: '/beats/Shamur-Beat-108BPM.mp3' },
  { id: 'b6',  titleKey: 'Dark Jersey Drill Beat',              genreKey: 'Drill',         src: '/beats/Dark-Jersey-Drill-Beat.mp3' },
  { id: 'b7',  titleKey: 'Indian Drill Beat',                   genreKey: 'Drill',         src: '/beats/Indian-Drill-Beat-Demo.mp3' },
  { id: 'b8',  titleKey: 'Indian Drill Beat III',               genreKey: 'Drill',         src: '/beats/Indian-Drill-Beat-Demo-3.mp3' },
  { id: 'b9',  titleKey: 'Afro Drill x Jersey (140 BPM)',       genreKey: 'Drill',         src: '/beats/Afro-Drill-X-Jersey-Beat-140BPM.mp3' },
  { id: 'b10', titleKey: 'Khaas Freestyle Type Beat (98 BPM)',  genreKey: 'Hip-Hop',       src: '/beats/Khaas-Freestyle-Type-Beat-98BPM.mp3' },
  { id: 'b11', titleKey: 'Scott Storch Type Beat',              genreKey: 'Hip-Hop',       src: '/beats/Scott-Storch-Type-Beat.mp3' },
  { id: 'b12', titleKey: 'Torn Speaker (100 BPM)',              genreKey: 'Hip-Hop',       src: '/beats/Torn-Speaker-100BPM.mp3' },
  { id: 'b13', titleKey: 'Mama Beats 23',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-23-For-Rohu.mp3' },
  { id: 'b14', titleKey: 'Mama Beats 24',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-24-For-Rohu.mp3' },
  { id: 'b15', titleKey: 'Mama Beats 46',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-46.mp3' },
  { id: 'b16', titleKey: 'Mama Beats 48',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-48.mp3' },
  { id: 'b17', titleKey: 'Mama Beats 49',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-49.mp3' },
  { id: 'b18', titleKey: 'Mama Beats 51',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-51.mp3' },
  { id: 'b19', titleKey: 'Mama Beats 70',                       genreKey: 'Hip-Hop',       src: '/beats/Mama-Beats-70.mp3' },
  { id: 'b20', titleKey: 'Punjabi Trap Beat',                   genreKey: 'Punjabi Trap',  src: '/beats/Punjabi-Trap-Beat.mp3' },
];

function getBeatsData(lang: Lang): Beat[] {
  return BEATS_RAW.map(b => ({
    id: b.id,
    title: beatTitles[b.titleKey] ? pick(beatTitles[b.titleKey], lang) : b.titleKey,
    artist: pick(beatArtist, lang),
    genre: beatGenres[b.genreKey] ? pick(beatGenres[b.genreKey], lang) : b.genreKey,
    src: b.src,
  }));
}

/* ─── Before / After audio samples — keyed by package title (EN) ─── */
const PACKAGE_SAMPLES: Record<string, CardAudioSample> = {
  'The \u201CHands-Free\u201D Mix': {
    trackTitle: 'Behte Rehte',
    artist: 'Param & Doleshwar Raj',
    src: '/beats/Behte-Rehte-Param-and-Doleshwar-Raj.mp3',
  },
  'The Premium Mix': {
    trackTitle: 'Ant Shant',
    artist: 'SSD',
    src: '/beats/Ant-Shant-SSD.mp3',
  },
  'Vocal Production': {
    trackTitle: 'Vocal Production',
    artist: "Dole's Music",
    beforeSrc: '/audio/Voice-Prod-Before.mp3',
    afterSrc: '/audio/Voice-Prod-After.mp3',
  },
  'Production 101': {
    trackTitle: 'Production 101',
    artist: "Dole's Music",
    beforeSrc: '/audio/Prod-101-Before.mp3',
    afterSrc: '/audio/Prod-101-After.mp3',
  },
  'Premium Prod': {
    trackTitle: 'Premium Production',
    artist: "Dole's Music",
    beforeSrc: '/audio/Premium-Prod-Before.mp3',
    afterSrc: '/audio/Premium-Prod-After.mp3',
  },
  'Reel Audio': {
    trackTitle: 'Gumshuda',
    artist: 'Param & Doleshwar Raj',
    src: '/beats/Gumshuda-Param-Doleshwar-Raj.mp3',
  },
};

/* ─── Pricing data (links stay the same regardless of language) ─── */
function getMixingPackages(lang: Lang) {
  return [
    {
      title: pick(prT.handsFree.title, lang),
      enTitle: prT.handsFree.title.en,
      price: '800 AED',
      badge: null,
      tagline: pick(prT.handsFree.tagline, lang),
      features: pickArr(prT.handsFree.features, lang),
      cta: pick(prT.handsFree.cta, lang),
      link: BOOKING_LINK,
    },
    {
      title: pick(prT.premiumMix.title, lang),
      enTitle: prT.premiumMix.title.en,
      price: '2,000 AED',
      badge: pick(prT.premiumMix.badge, lang),
      tagline: pick(prT.premiumMix.tagline, lang),
      features: pickArr(prT.premiumMix.features, lang),
      cta: pick(prT.premiumMix.cta, lang),
      link: BOOKING_LINK,
    },
  ];
}

function getProductionSoundDesign(lang: Lang) {
  return [
    {
      title: pick(prT.vocalProduction.title, lang),
      enTitle: prT.vocalProduction.title.en,
      price: '450 AED',
      badge: null,
      tagline: pick(prT.vocalProduction.tagline, lang),
      features: pickArr(prT.vocalProduction.features, lang),
      cta: pick(prT.vocalProduction.cta, lang),
      link: BOOKING_LINK,
    },
    {
      title: pick(prT.production.title, lang),
      enTitle: prT.production.title.en,
      price: '1,500 AED',
      badge: null,
      tagline: pick(prT.production.tagline, lang),
      features: pickArr(prT.production.features, lang),
      cta: pick(prT.production.cta, lang),
      link: BOOKING_LINK,
    },
    {
      title: pick(prT.premiumProd.title, lang),
      enTitle: prT.premiumProd.title.en,
      price: '3,000 AED',
      badge: pick(prT.premiumProd.badge, lang),
      tagline: pick(prT.premiumProd.tagline, lang),
      features: pickArr(prT.premiumProd.features, lang),
      cta: pick(prT.premiumProd.cta, lang),
      link: BOOKING_LINK,
    },
  ];
}

function getAddons(lang: Lang) {
  return [
    {
      title: pick(prT.realAudio.title, lang),
      enTitle: prT.realAudio.title.en,
      price: '600 AED',
      oldPrice: pick(prT.realAudio.oldPrice, lang),
      badge: null,
      tagline: pick(prT.realAudio.tagline, lang),
      features: pickArr(prT.realAudio.features, lang),
      cta: pick(prT.realAudio.cta, lang),
      link: BOOKING_LINK,
    },
  ];
}

/* ═══ Tiny SVG helpers ═══ */
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* Rack screw decoration for the Analog section */
const RackScrew = () => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'rgba(200,160,82,0.25)',
      border: '1px solid rgba(200,160,82,0.3)',
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
    }}
  />
);

/* LED dot for section accents */
const LEDDot = ({ on = true }: { on?: boolean }) => (
  <span
    aria-hidden="true"
    className={on ? 'led-pulse' : ''}
    style={{
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: on ? 'var(--brass)' : 'rgba(200,160,82,0.2)',
      boxShadow: on ? '0 0 6px rgba(200,160,82,0.5)' : 'none',
    }}
  />
);

/* Equalizer bars for mixing section */
const EqBars = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }} aria-hidden="true">
    {[12, 20, 8, 16, 24, 10, 18, 14].map((h, i) => (
      <div
        key={i}
        className="eq-bar"
        style={{
          width: 3,
          height: h,
          background: 'var(--brass)',
          borderRadius: 1,
          opacity: 0.6,
          animationDelay: `${i * 120}ms`,
        }}
      />
    ))}
  </div>
);

/* VU meter decoration */
const VUMeter = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 10 }} aria-hidden="true">
    {[0.3, 0.5, 0.7, 0.85, 1, 0.9, 0.6].map((opacity, i) => (
      <div
        key={i}
        className="vu-segment"
        style={{
          width: 4,
          height: 10,
          borderRadius: 1,
          background: i >= 5 ? '#e74c3c' : 'var(--brass)',
          opacity,
          animationDelay: `${i * 80}ms`,
        }}
      />
    ))}
  </div>
);

/* Instagram icon */
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

/* LinkedIn icon */
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* Lock / SSL icon */
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ═══ Hero waveform — animated sine wave ═══ */
function HeroWaveform({ phaseOffset = 0 }: { phaseOffset?: number }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let raf: number;
    const start = performance.now();
    const period = 6000;

    const animate = (now: number) => {
      const elapsed = (now - start + phaseOffset) % period;
      const t = (elapsed / period) * Math.PI * 2;

      const y1 = 12 + 8 * Math.sin(t);
      const y2 = 12 - 8 * Math.sin(t + Math.PI * 0.4);
      const y3 = 12 + 8 * Math.sin(t + Math.PI * 0.8);
      const y4 = 12 - 8 * Math.sin(t + Math.PI * 1.2);

      path.setAttribute(
        'd',
        `M0,12 Q60,${y1.toFixed(1)} 120,12 Q180,${y2.toFixed(1)} 240,12 Q300,${y3.toFixed(1)} 360,12 Q420,${y4.toFixed(1)} 480,12`
      );

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phaseOffset]);

  return (
    <svg
      className="hero-waveform"
      width="480"
      height="24"
      viewBox="0 0 480 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ maxWidth: '100%' }}
    >
      <path
        ref={pathRef}
        d="M0,12 Q60,4 120,12 Q180,20 240,12 Q300,4 360,12 Q420,20 480,12"
        stroke="rgba(200, 160, 82, 0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ═══ Hero area wave — canvas-based ═══ */
function HeroAreaWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    let w = 0;
    let h = 0;
    let raf: number;
    let time = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const draw = () => {
      const t = time;
      ctx.clearRect(0, 0, w, h);

      const centerY = h * 0.45;
      const step = 12;
      const baseAmplitude = 22;

      const bandCount = 3;
      for (let b = 0; b < bandCount; b++) {
        const offset = (b - bandCount / 2) * (h * 0.14);
        const baseY = centerY + offset;
        const amp = baseAmplitude * (0.65 + 0.35 * Math.sin(b * 0.8));
        const speed = 0.6 + b * 0.15;
        const freq = 0.013 + b * 0.0025;

        const points: { x: number; y: number }[] = [];
        for (let x = 0; x <= w + step; x += step) {
          const wave =
            Math.sin(x * freq + t * speed) * amp +
            Math.sin(x * freq * 0.5 + t * speed * 1.4) * amp * 0.45 +
            Math.sin(x * freq * 0.25 + t * speed * 0.7) * amp * 0.2;
          points.push({ x, y: baseY + wave });
        }

        ctx.beginPath();
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.lineTo(w + step, h + 20);
        ctx.lineTo(-step, h + 20);
        ctx.closePath();

        const alpha = 0.08 + 0.03 * Math.sin(t * 0.5 + b);
        ctx.fillStyle = `rgba(200, 160, 82, ${alpha})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(200, 160, 82, ${0.15 + 0.08 * Math.sin(t * 0.5 + b)})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
      }

      const barCount = Math.min(32, Math.floor(w / 18));
      const barGap = w / (barCount + 1);
      const barWidth = 5;
      const barBaseY = h - 12;
      const barMaxHeight = 44;
      const radius = barWidth / 2;

      for (let i = 0; i < barCount; i++) {
        const phase1 = i * 0.38 + t * 2.0;
        const phase2 = i * 0.22 + t * 1.4;
        const bh =
          barMaxHeight *
          (0.2 + 0.8 * (Math.sin(phase1) * 0.5 + 0.5) * 0.65 + (Math.sin(phase2) * 0.5 + 0.5) * 0.35);
        const x = barGap * (i + 0.5) - barWidth / 2;
        const topY = barBaseY - bh;

        ctx.beginPath();
        ctx.moveTo(x + radius, barBaseY);
        ctx.lineTo(x + barWidth - radius, barBaseY);
        ctx.quadraticCurveTo(x + barWidth, barBaseY, x + barWidth, barBaseY - radius);
        ctx.lineTo(x + barWidth, topY + radius);
        ctx.quadraticCurveTo(x + barWidth, topY, x + barWidth - radius, topY);
        ctx.lineTo(x + radius, topY);
        ctx.quadraticCurveTo(x, topY, x, topY + radius);
        ctx.lineTo(x, barBaseY - radius);
        ctx.quadraticCurveTo(x, barBaseY, x + radius, barBaseY);
        ctx.closePath();

        const grad = ctx.createLinearGradient(x, barBaseY, x, topY);
        grad.addColorStop(0, 'rgba(200, 160, 82, 0.35)');
        grad.addColorStop(0.4, 'rgba(200, 160, 82, 0.18)');
        grad.addColorStop(0.85, 'rgba(200, 160, 82, 0.05)');
        grad.addColorStop(1, 'rgba(200, 160, 82, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      const lineGrad = ctx.createLinearGradient(0, barBaseY, w, barBaseY);
      lineGrad.addColorStop(0, 'rgba(200, 160, 82, 0)');
      lineGrad.addColorStop(0.2, 'rgba(200, 160, 82, 0.06)');
      lineGrad.addColorStop(0.5, 'rgba(200, 160, 82, 0.10)');
      lineGrad.addColorStop(0.8, 'rgba(200, 160, 82, 0.06)');
      lineGrad.addColorStop(1, 'rgba(200, 160, 82, 0)');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, barBaseY + 1);
      ctx.lineTo(w, barBaseY + 1);
      ctx.stroke();

      time += 0.014;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);

    if (!mql.matches) {
      raf = requestAnimationFrame(draw);
    } else {
      time = 0;
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-area-wave"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '55%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ═══ Shared card style builder ═══ */
const cardBase: React.CSSProperties = {
  position: 'relative',
  padding: '32px 28px',
  background: 'rgba(200,160,82,0.04)',
  border: '1px solid rgba(200,160,82,0.12)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  overflow: 'hidden',
  transition: 'box-shadow 300ms ease, border-color 300ms ease',
};

/* ═══ Pricing card renderer — desktop full + mobile flip ═══ */
function PricingCard({ item, variant, isArabic, audioSample, beforeLabel, afterLabel }: {
  item: { title: string; enTitle?: string; price: string; oldPrice?: string; badge: string | null; tagline: string; features: string[]; cta: string; link: string };
  variant?: 'rack';
  isArabic?: boolean;
  audioSample?: CardAudioSample;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [flipHeight, setFlipHeight] = useState<number | undefined>(undefined);

  const measureHeight = useCallback(() => {
    const fH = frontRef.current?.scrollHeight ?? 0;
    const bH = backRef.current?.scrollHeight ?? 0;
    setFlipHeight(flipped ? bH : fH);
  }, [flipped]);

  useEffect(() => {
    measureHeight();
    // re-measure on resize
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight]);

  const arFont = isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : undefined;
  const rackStyles = variant === 'rack' ? { borderColor: 'rgba(200,160,82,0.18)' } : {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { position: _pos, ...cardBaseNoPos } = cardBase;
  const isFilled = item.cta === 'Secure Your Session' || item.cta === '\u0627\u062D\u062C\u0632 \u062C\u0644\u0633\u062A\u0643';

  const rackDecorations = variant === 'rack' ? (
    <>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none', zIndex: 0 }} />
      <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}><RackScrew /></span>
      <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}><RackScrew /></span>
      <span style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}><RackScrew /></span>
      <span style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1 }}><RackScrew /></span>
    </>
  ) : null;

  const badgeEl = item.badge ? (
    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--brass)', color: 'var(--ink)', fontSize: 11, fontWeight: 600, letterSpacing: isArabic ? '0' : '0.06em', textTransform: isArabic ? 'none' : ('uppercase' as const), marginBottom: 16, fontFamily: arFont }}>{item.badge}</span>
  ) : null;

  const titlePriceEl = (compact?: boolean) => (
    <>
      <h4 style={{ color: compact ? 'var(--brass)' : 'var(--bone)', fontSize: compact ? 16 : 20, fontWeight: 500, marginBottom: 4, lineHeight: 1.3, fontFamily: arFont }}>
        {item.title}{compact ? ` — ${item.price}` : ''}
      </h4>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
          <p style={{ color: 'var(--brass)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>{item.price}</p>
          {item.oldPrice && <p style={{ color: 'var(--mute)', fontSize: 18, fontWeight: 400, textDecoration: 'line-through', opacity: 0.6, margin: 0 }}>{item.oldPrice}</p>}
        </div>
      )}
    </>
  );

  const featuresEl = (small?: boolean) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: small ? '0 0 20px 0' : '0 0 24px 0' }}>
      {item.features.map((f, i) => (
        <li key={i} style={{ color: 'var(--bone)', fontSize: small ? 12 : 13, lineHeight: small ? 1.5 : 1.6, padding: small ? '3px 0' : '4px 0', display: 'flex', alignItems: 'center', gap: small ? 6 : 8, flexDirection: isArabic ? 'row-reverse' : 'row', fontFamily: arFont }}>
          <LEDDot />{f}
        </li>
      ))}
    </ul>
  );

  const ctaEl = (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-nav pricing-cta"
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '10px 24px',
        border: '1px solid var(--brass)',
        background: isFilled ? 'var(--brass)' : 'transparent',
        color: isFilled ? 'var(--ink)' : 'var(--brass)',
        fontSize: 13, fontWeight: 500,
        letterSpacing: isArabic ? '0' : '0.05em',
        textTransform: isArabic ? 'none' : ('uppercase' as const),
        textDecoration: 'none', borderRadius: 0, cursor: 'pointer', fontFamily: arFont,
        transition: 'background-color 280ms cubic-bezier(0.25, 1, 0.5, 1), border-color 280ms cubic-bezier(0.25, 1, 0.5, 1), color 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms cubic-bezier(0.25, 1, 0.5, 1), transform 280ms cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = isFilled ? '#d4b96a' : 'var(--brass)';
        el.style.borderColor = isFilled ? '#d4b96a' : 'var(--brass)';
        el.style.color = 'var(--ink)';
        el.style.boxShadow = '0 4px 20px rgba(200, 160, 82, 0.35)';
        el.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = isFilled ? 'var(--brass)' : 'transparent';
        el.style.borderColor = 'var(--brass)';
        el.style.color = isFilled ? 'var(--ink)' : 'var(--brass)';
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
    >
      {item.cta}
    </a>
  );

  const audioEl = audioSample && beforeLabel && afterLabel ? (
    <div onClick={(e) => e.stopPropagation()}>
      <CardBeforeAfterPlayer sample={audioSample} beforeLabel={beforeLabel} afterLabel={afterLabel} isArabic={isArabic} />
    </div>
  ) : null;

  return (
    <div className="pricing-card-outer" style={{ textAlign: isArabic ? 'right' : 'left' }}>
      {/* ── Desktop: full card (hidden on mobile via CSS) ── */}
      <div className="pricing-card pricing-card-desktop" style={{ ...cardBase, ...rackStyles }}>
        {rackDecorations}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {badgeEl}
          {titlePriceEl()}
          <p style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.7, marginBottom: 20, minHeight: 48, fontFamily: arFont }}>{item.tagline}</p>
          {featuresEl()}
          {ctaEl}
          {audioEl}
        </div>
      </div>

      {/* ── Mobile: 3D flip card (hidden on desktop via CSS) ── */}
      <div
        className={`pricing-card-mobile ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        style={flipHeight ? { height: flipHeight } : undefined}
      >
        <div className="flip-inner">
          {/* FRONT — title, price, tagline, tap-hint */}
          <div ref={frontRef} className="flip-face flip-front pricing-card" style={{ ...cardBase, ...rackStyles }}>
            {rackDecorations}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {badgeEl}
              {titlePriceEl()}
              <p style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.7, marginBottom: 12, fontFamily: arFont }}>{item.tagline}</p>
              {/* Feature count teaser */}
              <p style={{ color: 'var(--brass)', fontSize: 12, fontWeight: 500, opacity: 0.7, margin: '0 0 8px', fontFamily: arFont }}>
                {isArabic ? `${item.features.length} ميزات مضمنة` : `${item.features.length} features included`}
              </p>
              <div className="tap-hint">
                <span>{isArabic ? '\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u0641\u0627\u0635\u064A\u0644' : 'Tap for details'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/></svg>
              </div>
            </div>
          </div>
          {/* BACK — features, CTA, audio player */}
          <div ref={backRef} className="flip-face flip-back pricing-card" style={{ ...cardBaseNoPos, ...rackStyles }}>
            {rackDecorations}
            <div style={{ position: 'relative', zIndex: 1, paddingBottom: 8 }}>
              {titlePriceEl(true)}
              <div style={{ marginTop: 12 }}>{featuresEl(true)}</div>
              <div style={{ marginTop: 16, marginBottom: 12 }}>{ctaEl}</div>
              {audioEl}
              <div className="tap-hint" style={{ marginTop: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                <span>{isArabic ? '\u0627\u0646\u0642\u0631 \u0644\u0644\u0639\u0648\u062F\u0629' : 'Tap to go back'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   INNER COMPONENT (consumes language context)
   ══════════════════════════════════════════════════════════════ */
/* ── Time formatter for floating player ── */
function formatFloatingTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function DubaiLandingPageInner() {
  const { lang, isArabic, dir } = useDubaiLang();
  const arFont = isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : undefined;

  // Compute translated pricing arrays
  const MIXING_PACKAGES = getMixingPackages(lang);
  const PRODUCTION_SOUND_DESIGN = getProductionSoundDesign(lang);
  const ADDONS = getAddons(lang);

  // Compute translated beats data
  const BEATS_DATA = getBeatsData(lang);

  /* ── Sticky mobile CTA: appears after scrolling past hero ── */
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Floating media player state ── */
  const [floatingPlayer, setFloatingPlayer] = useState<{
    id: string;
    title: string;
    artist: string;
    isPlaying: boolean;
    progress: number;
    currentTime: number;
    duration: number;
    onToggle?: () => void;
  } | null>(null);

  useEffect(() => {
    const unsub = globalAudioManager.onFloatingChange((state) => {
      setFloatingPlayer(state);
    });
    return unsub;
  }, []);

  /* ── Update floating player title when language changes for YouTube videos ── */
  useEffect(() => {
    const current = globalAudioManager.getFloatingState();
    if (!current || !current.id.startsWith('yt-')) return;
    // Extract ytId from floating player id (format: "yt-{ytId}")
    const ytId = current.id.replace('yt-', '');
    const item = PORTFOLIO.find(p => p.ytId === ytId);
    if (!item) return;
    const newTitle = pick(portT[item.translationKey].title, lang);
    const newArtist = pick(portT[item.translationKey].credit, lang);
    if (current.title !== newTitle || current.artist !== newArtist) {
      globalAudioManager.setFloatingState({
        ...current,
        title: newTitle,
        artist: newArtist,
      });
    }
  }, [lang]);

  return (
    <div className="dubai-scope" dir={dir} style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--bone)', fontFamily: arFont, overflowX: 'hidden' }}>
      <DubaiNavbar />

      {/* Spacer for fixed nav */}
      <div style={{ height: 'var(--nav-h, 80px)' }} />

      <main id="main-content">

        {/* ══════════════════════════════════════════════════════
            HERO — centered, full viewport
           ══════════════════════════════════════════════════════ */}
        <section
          id="hero"
          style={{
            minHeight: 'calc(100vh - var(--nav-h, 80px))',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Cinematic hero background — studio photo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}>
            <img
              src="/dolls43.jpeg"
              alt=""
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                filter: 'grayscale(100%) contrast(1.1)',
                opacity: 0.18,
              }}
            />
            {/* Bottom fade to section below */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to top, var(--ink), transparent)',
              pointerEvents: 'none',
            }} />
            {/* Top fade for navbar blend */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '20%',
              background: 'linear-gradient(to bottom, var(--ink), transparent)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Decorative sine-wave SVG behind hero */}
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 180, opacity: 0.04, pointerEvents: 'none' }}
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
          >
            <path d="M0,90 C360,180 720,0 1080,90 C1260,135 1350,45 1440,90 L1440,180 L0,180 Z" fill="var(--brass)" />
          </svg>

          <HeroAreaWave />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
            <p style={{
              color: 'var(--brass)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: isArabic ? '0.05em' : '0.2em',
              textTransform: isArabic ? 'none' : 'uppercase',
              marginBottom: 16,
              fontFamily: arFont,
            }}>
              {pick(hero.eyebrow, lang)}
            </p>

            <h1 className={isArabic ? '' : 'font-playfair'} style={{ marginBottom: 16 }}>
              <span style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--bone)', fontFamily: arFont }}>
                {pick(hero.line1, lang)}
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--brass)', fontFamily: arFont }}>
                {pick(hero.line2, lang)}
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', fontWeight: 300, lineHeight: 1.4, fontStyle: 'italic', color: 'var(--mute)', marginTop: 8, fontFamily: arFont }}>
                {pick(hero.line3, lang)}
              </span>
            </h1>

            <HeroWaveform />

            <p style={{
              color: 'var(--mute)',
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 520,
              margin: '24px auto',
              fontFamily: arFont,
            }}>
              {pick(hero.subhead, lang)}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#services"
                className="hero-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '11px 22px',
                  border: '1px solid var(--brass)',
                  background: 'transparent',
                  color: 'var(--brass)',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: isArabic ? '0' : '0.05em',
                  textTransform: isArabic ? 'none' : 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  fontFamily: arFont,
                  transition: 'background-color 240ms cubic-bezier(0.25, 1, 0.5, 1), color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--brass)';
                  el.style.color = 'var(--ink)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.color = 'var(--brass)';
                }}
              >
                {pick(hero.ctaPrimary, lang)}
              </a>

              <a
                href="#beats"
                className="hero-cta hero-cta-filled"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 20px',
                  border: '1px solid var(--brass)',
                  background: 'var(--brass)',
                  color: 'var(--ink)',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: isArabic ? '0' : '0.05em',
                  textTransform: isArabic ? 'none' : 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  fontFamily: arFont,
                  flexDirection: isArabic ? 'row-reverse' : 'row',
                  transition: 'background-color 280ms cubic-bezier(0.25, 1, 0.5, 1), border-color 280ms cubic-bezier(0.25, 1, 0.5, 1), color 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms cubic-bezier(0.25, 1, 0.5, 1), transform 280ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '#d4b96a';
                  el.style.borderColor = '#d4b96a';
                  el.style.boxShadow = '0 4px 20px rgba(200, 160, 82, 0.35)';
                  el.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--brass)';
                  el.style.borderColor = 'var(--brass)';
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <PlayIcon />
                {pick(hero.ctaSecondary, lang)}
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            BEATS LIBRARY + PORTFOLIO — combined split section
           ══════════════════════════════════════════════════════ */}
        <section
          id="beats"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* ── Shared section header ── */}
          <div style={{ marginBottom: 40, textAlign: isArabic ? 'right' : 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }} aria-hidden="true">
                {[10, 16, 6, 14, 20, 8, 12].map((h, i) => (
                  <div key={i} className="eq-bar" style={{ width: 3, height: h, background: 'var(--brass)', borderRadius: 1, opacity: 0.7, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <h2 className={isArabic ? '' : 'font-playfair'} style={{
                color: 'var(--bone)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                margin: 0,
                fontFamily: arFont,
              }}>
                {pick(beatsT.sectionTitle, lang)}
                <span style={{ color: 'var(--mute)', fontWeight: 300 }}> &amp; </span>
                {pick(portT.heading, lang)}
              </h2>
            </div>
            <p style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.6, maxWidth: 620, margin: 0, fontFamily: arFont }}>
              {pick(beatsT.sectionSub, lang)}
            </p>
          </div>

          {/* ── Split layout: beats left, portfolio right — same fixed height, both scrollable ── */}
          <div id="portfolio" className="beats-portfolio-split" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            alignItems: 'start',
          }}>
            {/* ── Left: Beats Library ── */}
            <div className="beats-panel" style={{
              height: 720,
              overflowY: 'auto',
              overflowX: 'hidden',
              minHeight: 0,
            }}>
              <SecureBeatsPlayer
                beats={BEATS_DATA}
                ctaText={pick(beatsT.cta, lang)}
                ctaLink={BOOKING_LINK}
                isArabic={isArabic}
                sectionTitle={pick(beatsT.sectionTitle, lang)}
                sectionSub={pick(beatsT.sectionSub, lang)}
                compact
                maxTrackHeight={2000}
              />
            </div>

            {/* ── Right: Portfolio — header fixed, grid scrollable ── */}
            <div className="portfolio-panel" style={{
              height: 720,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}>
              {/* Mini header for portfolio column — stays fixed */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
                flexDirection: isArabic ? 'row-reverse' : 'row',
                flexShrink: 0,
              }}>
                <PlayIcon />
                <h3 style={{
                  color: 'var(--bone)',
                  fontSize: 16,
                  fontWeight: 500,
                  margin: 0,
                  fontFamily: arFont,
                  letterSpacing: isArabic ? '0' : '0.02em',
                }}>
                  {pick(portT.heading, lang)}
                </h3>
                <span style={{
                  color: 'var(--mute)',
                  fontSize: 11,
                  opacity: 0.6,
                  fontFamily: arFont,
                }}>
                  — {pick(portT.description, lang).split('—')[0].trim()}
                </span>
              </div>

              {/* Scrollable video grid */}
              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 4, minHeight: 0 }} className="portfolio-scroll-area">
              <div className="portfolio-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
              }}>
                {PORTFOLIO.map((item) => {
                  const cardId = `yt-card-${item.ytId}`;
                  return (
                    <div
                      key={item.ytId}
                      id={cardId}
                      className="pricing-card portfolio-card-item"
                      style={{
                        display: 'block',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'rgba(200,160,82,0.04)',
                        border: '1px solid rgba(200,160,82,0.12)',
                        cursor: 'pointer',
                        transition: 'box-shadow 300ms ease, border-color 300ms ease, transform 200ms ease',
                      }}
                      onClick={(e) => {
                        const videoTitle = pick(portT[item.translationKey].title, lang);
                        const videoCredit = pick(portT[item.translationKey].credit, lang);
                        const ytPlayerId = `yt-${item.ytId}`;

                        // Helper to stop this YouTube video
                        const stopThisYT = () => {
                          const thisCard = document.getElementById(cardId);
                          if (thisCard) {
                            const iframe = thisCard.querySelector('.yt-iframe-area iframe') as HTMLIFrameElement;
                            if (iframe) iframe.src = 'about:blank';
                            const ia = thisCard.querySelector('.yt-iframe-area') as HTMLElement;
                            if (ia) ia.style.display = 'none';
                            const ta = thisCard.querySelector('.yt-thumb-area') as HTMLElement;
                            if (ta) ta.style.display = 'block';
                          }
                          globalAudioManager.clearFloatingState(ytPlayerId);
                        };

                        // Register with global manager — stops beats, before/after, other YT
                        globalAudioManager.requestPlay(ytPlayerId, stopThisYT);

                        const card = e.currentTarget;
                        const thumbArea = card.querySelector('.yt-thumb-area') as HTMLElement;
                        const iframeArea = card.querySelector('.yt-iframe-area') as HTMLElement;
                        if (thumbArea && iframeArea) {
                          // Stop any other YouTube iframes that are already playing
                          document.querySelectorAll('.yt-iframe-area').forEach(el => {
                            const otherCard = el.closest('.portfolio-card-item');
                            if (otherCard && otherCard !== card) {
                              const otherIframe = el.querySelector('iframe') as HTMLIFrameElement;
                              if (otherIframe) otherIframe.src = 'about:blank';
                              (el as HTMLElement).style.display = 'none';
                              const otherThumb = otherCard.querySelector('.yt-thumb-area') as HTMLElement;
                              if (otherThumb) otherThumb.style.display = 'block';
                            }
                          });

                          thumbArea.style.display = 'none';
                          iframeArea.style.display = 'block';
                          // Set iframe src with autoplay=1 only on click (not preloaded)
                          const iframe = iframeArea.querySelector('iframe') as HTMLIFrameElement;
                          if (iframe) {
                            const ytId = iframe.getAttribute('data-ytid');
                            if (ytId) {
                              iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
                            }
                          }

                          // Show in floating player
                          globalAudioManager.setFloatingState({
                            id: ytPlayerId,
                            title: videoTitle,
                            artist: videoCredit,
                            isPlaying: true,
                            progress: 0,
                            currentTime: 0,
                            duration: 0,
                            onToggle: () => {
                              // Toggle = stop the YouTube video and clear floating
                              stopThisYT();
                              globalAudioManager.release(ytPlayerId);
                            },
                          });
                        }
                      }}
                    >
                      {/* YouTube thumbnail — shown initially */}
                      <div className="yt-thumb-area" style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden', background: '#111' }}>
                        <img
                          src={`https://img.youtube.com/vi/${item.ytId}/mqdefault.jpg`}
                          alt={pick(portT[item.translationKey].title, lang)}
                          loading="lazy"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.35)',
                          transition: 'background 200ms ease',
                        }} className="portfolio-play-overlay">
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: 'rgba(200,160,82,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ink)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                            transition: 'transform 200ms ease, background 200ms ease',
                          }}>
                            <PlayIcon />
                          </div>
                        </div>
                      </div>
                      {/* YouTube iframe — hidden initially, shown on click */}
                      {/* YouTube iframe — hidden initially; src set on click with autoplay=1 */}
                      <div className="yt-iframe-area" style={{ display: 'none', position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                        <iframe
                          data-ytid={item.ytId}
                          src="about:blank"
                          title={pick(portT[item.translationKey].title, lang)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                          }}
                        />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <p style={{ color: 'var(--bone)', fontSize: 13, fontWeight: 500, margin: 0, fontFamily: arFont, textAlign: isArabic ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pick(portT[item.translationKey].title, lang)}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                          <p style={{ color: 'var(--mute)', fontSize: 11, margin: 0, fontFamily: arFont, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
                            {pick(portT[item.translationKey].credit, lang)}
                          </p>
                          <span style={{
                            flexShrink: 0,
                            padding: '1px 6px',
                            border: '1px solid var(--line-brass)',
                            color: 'var(--brass)',
                            fontSize: 9,
                            fontWeight: 500,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            marginLeft: isArabic ? 0 : 6,
                            marginRight: isArabic ? 6 : 0,
                          }}>
                            {pick(portT[item.categoryKey], lang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>{/* close portfolio-scroll-area */}
            </div>
          </div>

          {/* ── Combined CTA below both sections ── */}
          <div style={{
            marginTop: 36,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <a
              href={BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-nav pricing-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 44px',
                background: 'var(--brass)',
                color: 'var(--ink)',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: isArabic ? '0' : '0.06em',
                textTransform: isArabic ? 'none' : 'uppercase',
                textDecoration: 'none',
                border: '1px solid var(--brass)',
                borderRadius: 0,
                cursor: 'pointer',
                fontFamily: arFont,
                transition: 'background-color 280ms ease, box-shadow 280ms ease, transform 280ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#d4b96a';
                el.style.boxShadow = '0 4px 24px rgba(200, 160, 82, 0.4)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--brass)';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              {pick(beatsT.cta, lang)}
            </a>
          </div>
        </section>

        {/* Mobile inter-section CTA strip removed — "Book a Session" button above is sufficient */}

        {/* ══════════════════════════════════════════════════════
            SERVICES & PRICING
           ══════════════════════════════════════════════════════ */}
        <section
          id="services"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 120, paddingBottom: 120, position: 'relative' }}
        >
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', top: 60, right: 0, width: '50%', height: 300, opacity: 0.02, pointerEvents: 'none' }}
            viewBox="0 0 600 300"
            preserveAspectRatio="none"
          >
            <path d="M0,150 Q150,0 300,150 Q450,300 600,150" fill="none" stroke="var(--brass)" strokeWidth="2" />
          </svg>

          <p style={{
            color: 'var(--brass)',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: isArabic ? '0.05em' : '0.15em',
            textTransform: isArabic ? 'none' : 'uppercase',
            marginBottom: 16,
            fontFamily: arFont,
          }}>
            {pick(svcT.eyebrow, lang)}
          </p>
          <h2 className={isArabic ? '' : 'font-playfair'} style={{
            color: 'var(--bone)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 16,
            fontFamily: arFont,
          }}>
            {pick(svcT.heading, lang)}
          </h2>
          <p style={{
            color: 'var(--mute)',
            fontSize: 16,
            lineHeight: 1.7,
            marginBottom: 64,
            maxWidth: 560,
            fontFamily: arFont,
          }}>
            {pick(svcT.description, lang)}
          </p>

          {/* ─── Sub-section A: Mixing Packages ─── */}
          <div style={{ marginBottom: 64 }}>
            <div className="flex items-center gap-4" style={{ marginBottom: 24, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
              <EqBars />
              <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
                <h3 style={{ color: 'var(--bone)', fontSize: 18, fontWeight: 500, letterSpacing: isArabic ? '0' : '0.02em', fontFamily: arFont }}>
                  {pick(svcT.mixingTitle, lang)}
                </h3>
                <p style={{ color: 'var(--mute)', fontSize: 12, letterSpacing: isArabic ? '0' : '0.06em', textTransform: isArabic ? 'none' : 'uppercase', fontFamily: arFont }}>
                  {pick(svcT.mixingSub, lang)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MIXING_PACKAGES.map((item) => (
                <PricingCard
                  key={item.title}
                  item={item}
                  isArabic={isArabic}
                  audioSample={item.enTitle ? PACKAGE_SAMPLES[item.enTitle] : undefined}
                  beforeLabel={pick(baT.before, lang)}
                  afterLabel={pick(baT.after, lang)}
                />
              ))}
            </div>
          </div>

          {/* ─── Sub-section B: Production & Mastering ─── */}
          <div style={{ marginBottom: 64 }}>
            <div className="flex items-center gap-4" style={{ marginBottom: 24, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
              <VUMeter />
              <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
                <h3 style={{ color: 'var(--bone)', fontSize: 18, fontWeight: 500, letterSpacing: isArabic ? '0' : '0.02em', fontFamily: arFont }}>
                  {pick(svcT.productionTitle, lang)}
                </h3>
                <p style={{ color: 'var(--mute)', fontSize: 12, letterSpacing: isArabic ? '0' : '0.06em', textTransform: isArabic ? 'none' : 'uppercase', fontFamily: arFont }}>
                  {pick(svcT.productionSub, lang)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRODUCTION_SOUND_DESIGN.map((item) => (
                <PricingCard
                  key={item.title}
                  item={item}
                  variant="rack"
                  isArabic={isArabic}
                  audioSample={item.enTitle ? PACKAGE_SAMPLES[item.enTitle] : undefined}
                  beforeLabel={pick(baT.before, lang)}
                  afterLabel={pick(baT.after, lang)}
                />
              ))}
            </div>
          </div>

          {/* ─── Sub-section D: Add-Ons & Blitz Deals ─── */}
          <div>
            <div style={{ marginBottom: 24, textAlign: isArabic ? 'right' : 'left' }}>
              <h3 style={{ color: 'var(--bone)', fontSize: 18, fontWeight: 500, letterSpacing: isArabic ? '0' : '0.02em', fontFamily: arFont }}>
                {pick(svcT.addonsTitle, lang)}
              </h3>
              <p style={{ color: 'var(--mute)', fontSize: 12, letterSpacing: isArabic ? '0' : '0.06em', textTransform: isArabic ? 'none' : 'uppercase', fontFamily: arFont }}>
                {pick(svcT.addonsSub, lang)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EP Bundle card */}
              {ADDONS.map((item) => (
                <PricingCard
                  key={item.title}
                  item={item}
                  isArabic={isArabic}
                  audioSample={item.enTitle ? PACKAGE_SAMPLES[item.enTitle] : undefined}
                  beforeLabel={pick(baT.before, lang)}
                  afterLabel={pick(baT.after, lang)}
                />
              ))}

              {/* Skip-the-Line — custom format */}
              <div className="pricing-card" style={{ ...cardBase, textAlign: isArabic ? 'right' : 'left' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ color: 'var(--bone)', fontSize: 20, fontWeight: 500, marginBottom: 8, lineHeight: 1.3, fontFamily: arFont }}>
                    {pick(rushT.title, lang)}
                  </h4>
                  <p style={{ color: 'var(--brass)', fontSize: 16, fontWeight: 500, marginBottom: 20, fontStyle: 'italic', fontFamily: arFont }}>
                    {pick(rushT.tagline, lang)}
                  </p>

                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line-brass)', flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                      <span style={{ color: 'var(--bone)', fontSize: 14, fontFamily: arFont }}>{pick(rushT.rush48, lang)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                        <span style={{ color: 'var(--brass)', fontSize: 16, fontWeight: 600 }}>+200 AED <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--mute)', fontFamily: arFont }}>{pick(rushT.perTrack, lang)}</span></span>
                        <a
                          href={BOOKING_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-nav pricing-cta"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 16px',
                            border: '1px solid var(--brass)',
                            background: 'transparent',
                            color: 'var(--brass)',
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: isArabic ? '0' : '0.05em',
                            textTransform: isArabic ? 'none' : 'uppercase',
                            textDecoration: 'none',
                            borderRadius: 0,
                            cursor: 'pointer',
                            fontFamily: arFont,
                            transition: 'background-color 240ms ease, color 240ms ease, box-shadow 240ms ease',
                          }}
                        >
                          {pick(rushT.book, lang)}
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                      <span style={{ color: 'var(--bone)', fontSize: 14, fontFamily: arFont }}>{pick(rushT.rush24, lang)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                        <span style={{ color: 'var(--brass)', fontSize: 16, fontWeight: 600 }}>+500 AED <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--mute)', fontFamily: arFont }}>{pick(rushT.perTrack, lang)}</span></span>
                        <a
                          href={BOOKING_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-nav pricing-cta"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 16px',
                            border: '1px solid var(--brass)',
                            background: 'transparent',
                            color: 'var(--brass)',
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: isArabic ? '0' : '0.05em',
                            textTransform: isArabic ? 'none' : 'uppercase',
                            textDecoration: 'none',
                            borderRadius: 0,
                            cursor: 'pointer',
                            fontFamily: arFont,
                            transition: 'background-color 240ms ease, color 240ms ease, box-shadow 240ms ease',
                          }}
                        >
                          {pick(rushT.book, lang)}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio is now combined with Beats Library above services */}

        {/* ══════════════════════════════════════════════════════
            TRUST BAR — compact single-row ticker
           ══════════════════════════════════════════════════════ */}
        <div style={{
          borderTop: '1px solid var(--line-brass)',
          borderBottom: '1px solid var(--line-brass)',
          padding: '18px 0',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 60,
            background: 'linear-gradient(to right, var(--ink), transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 60,
            background: 'linear-gradient(to left, var(--ink), transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />

          <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={`tb-${i}`} style={{
                color: 'var(--bone)',
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: '0.08em',
                opacity: 0.3,
                padding: '0 24px',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}>
                {brand}
                <span style={{ opacity: 0.25, margin: '0 6px', color: 'var(--brass)' }}>&middot;</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            STUDIO PHOTO STRIP — auto-scrolling cinematic reel
           ══════════════════════════════════════════════════════ */}
        <div className="studio-strip" style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '40px 0',
        }}>
          {/* Edge fades */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, zIndex: 2,
            background: 'linear-gradient(to right, var(--ink), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, zIndex: 2,
            background: 'linear-gradient(to left, var(--ink), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Scrolling photo belt */}
          <div className="studio-belt" style={{
            display: 'flex',
            gap: 16,
            width: 'max-content',
          }}>
            {[...Array(2)].map((_, setIdx) =>
              [
                { src: '/dolls43.jpeg', alt: 'Engineer in studio' },
                { src: '/dolls42.jpeg', alt: 'Mixing session' },
                { src: '/dolls1.jpeg', alt: 'Guitar recording' },
                { src: '/dolls40.jpeg', alt: 'Studio gear' },
                { src: '/dolls41.jpeg', alt: 'Guitar collection' },
                { src: '/dolls2.jpeg', alt: 'Red-lit session' },
                { src: '/dolls3.jpeg', alt: 'Acoustic session' },
              ].map((photo, i) => (
                <div key={`studio-${setIdx}-${i}`} style={{
                  width: 280,
                  height: 180,
                  minWidth: 280,
                  flexShrink: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(200,160,82,0.1)',
                }}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'saturate(0.6) contrast(1.1)',
                      transition: 'filter 0.4s ease',
                    }}
                  />
                  {/* Subtle brass overlay on hover — applied via CSS */}
                  <div className="studio-photo-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(200,160,82,0.05), transparent 60%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            TESTIMONIALS
           ══════════════════════════════════════════════════════ */}
        <section
          id="testimonials"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 120 }}
        >
          <p style={{
            color: 'var(--brass)',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: isArabic ? '0.05em' : '0.15em',
            textTransform: isArabic ? 'none' : 'uppercase',
            marginBottom: 16,
            fontFamily: arFont,
          }}>
            {pick(testT.eyebrow, lang)}
          </p>
          <h2 className={isArabic ? '' : 'font-playfair'} style={{
            color: 'var(--bone)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 12,
            fontFamily: arFont,
          }}>
            {pick(testT.heading, lang)}
          </h2>
          <p style={{
            color: 'var(--mute)',
            fontSize: 16,
            lineHeight: 1.7,
            marginBottom: 48,
            maxWidth: 480,
            fontFamily: arFont,
          }}>
            {pick(testT.description, lang)}
          </p>

          {/* Testimonials conveyor belt — auto on desktop, swipeable on mobile */}
          {/* Outer wrapper: non-scrolling, holds the fade gradients */}
          <div className="testimonial-wrapper" style={{
            position: 'relative',
            marginLeft: '-1.5rem',
            marginRight: '-1.5rem',
          }}>
            {/* Edge fade gradients — on non-scrolling wrapper so they stay fixed */}
            <div className="testimonial-fade-left" style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, zIndex: 3,
              background: 'linear-gradient(to right, var(--ink), transparent)',
              pointerEvents: 'none',
            }} />
            <div className="testimonial-fade-right" style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, zIndex: 3,
              background: 'linear-gradient(to left, var(--ink), transparent)',
              pointerEvents: 'none',
            }} />

            {/* Inner scroll container */}
            <div className="testimonial-outer" style={{
              overflow: 'hidden',
              paddingLeft: 0,
              paddingRight: 0,
            }}>

            <div className="testimonial-belt" style={{
              display: 'flex',
              gap: 24,
              width: 'max-content',
            }}>
              {[...Array(2)].map((_, setIdx) =>
                testimonialItems.map((testimonial, i) => (
                  <div key={`${setIdx}-${i}`} style={{
                    ...cardBase,
                    padding: '36px 32px',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    width: 380,
                    minWidth: 380,
                    flexShrink: 0,
                    textAlign: isArabic ? 'right' : 'left',
                    direction: isArabic ? 'rtl' : 'ltr',
                  }}>
                    <svg width="28" height="20" viewBox="0 0 32 24" fill="var(--brass)" opacity="0.25" aria-hidden="true" style={{ marginBottom: 16, flexShrink: 0 }}>
                      <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 4C10.4 5.6 8 8.8 8 12h6v12H0Zm18 0V14.4C18 6.4 22.8 1.6 32 0l.8 4C27.2 5.6 25.6 8.8 25.6 12H32v12H18Z" />
                    </svg>
                    <blockquote style={{
                      color: 'var(--bone)',
                      fontSize: 16,
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                      marginBottom: 24,
                      fontWeight: 300,
                      flex: 1,
                      fontFamily: arFont,
                    }}>
                      &ldquo;{pick(testimonial.text, lang)}&rdquo;
                    </blockquote>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--brass)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ink)',
                        fontSize: 14,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        {testimonial.initial}
                      </div>
                      <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
                        <p style={{ color: 'var(--bone)', fontSize: 14, fontWeight: 500, fontFamily: arFont }}>{pick(testimonial.author, lang)}</p>
                        <p style={{ color: 'var(--mute)', fontSize: 12, fontFamily: arFont }}>
                          {pick(testT.artistLabel, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>{/* /testimonial-outer */}
          </div>{/* /testimonial-wrapper */}

          {/* Mobile swipe hint for testimonials */}
          <div className="testimonial-swipe-hint" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, opacity: 0.5 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span style={{ color: 'var(--mute)', fontSize: 12, fontFamily: arFont }}>{pick(mobileCta.swipe, lang)}</span>
          </div>
        </section>

        {/* ── Mobile inter-section CTA strip (after testimonials) ── */}
        <div className="mobile-section-cta" style={{ display: 'none' }}>
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px 24px',
              background: 'rgba(200,160,82,0.06)',
              borderTop: '1px solid rgba(200,160,82,0.15)',
              borderBottom: '1px solid rgba(200,160,82,0.15)',
              color: 'var(--brass)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: isArabic ? '0' : '0.04em',
              textDecoration: 'none',
              fontFamily: arFont,
              textTransform: isArabic ? 'none' as const : 'uppercase' as const,
              transition: 'background 200ms ease',
            }}
          >
            {pick(mobileCta.bookNow, lang)}
            <ChevronRight />
          </a>
        </div>

        {/* ══════════════════════════════════════════════════════
            ABOUT — honest positioning
           ══════════════════════════════════════════════════════ */}
        <section
          id="about"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 120 }}
        >
          <div className="about-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}>
            {/* Left: text content */}
            <div>
          <p style={{
            color: 'var(--brass)',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: isArabic ? '0.05em' : '0.15em',
            textTransform: isArabic ? 'none' : 'uppercase',
            marginBottom: 16,
            fontFamily: arFont,
          }}>
            {pick(aboutT.eyebrow, lang)}
          </p>
          <h2 className={isArabic ? '' : 'font-playfair'} style={{
            color: 'var(--bone)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 32,
            maxWidth: 600,
            fontFamily: arFont,
          }}>
            {pick(aboutT.heading, lang)}
          </h2>
          <p style={{
            color: 'var(--mute)',
            fontSize: 16,
            lineHeight: 1.8,
            maxWidth: 640,
            fontFamily: arFont,
          }}>
            {pick(aboutT.description, lang)}
          </p>

          {/* About section CTA — WhatsApp + Book */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'nowrap', flexDirection: isArabic ? 'row-reverse' : 'row' }}>
            <a
              href="https://wa.me/917259356149"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-nav about-cta-whatsapp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                border: '1px solid rgba(37,211,102,0.5)',
                background: 'rgba(37,211,102,0.08)',
                color: '#25d366',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: isArabic ? '0' : '0.04em',
                textTransform: isArabic ? 'none' as const : 'uppercase' as const,
                textDecoration: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                fontFamily: arFont,
                transition: 'background-color 240ms ease, box-shadow 240ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(37,211,102,0.15)';
                el.style.boxShadow = '0 0 16px rgba(37,211,102,0.2)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(37,211,102,0.08)';
                el.style.boxShadow = 'none';
              }}
            >
              <WhatsAppIcon />
              {pick(mobileCta.letsTalk, lang)}
            </a>
            <a
              href={BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-nav"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                border: '1px solid var(--brass)',
                background: 'transparent',
                color: 'var(--brass)',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: isArabic ? '0' : '0.04em',
                textTransform: isArabic ? 'none' as const : 'uppercase' as const,
                textDecoration: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                fontFamily: arFont,
                transition: 'background-color 240ms ease, color 240ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--brass)';
                el.style.color = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.color = 'var(--brass)';
              }}
            >
              {pick(nav.bookSession, lang)}
              <ChevronRight />
            </a>
          </div>
            </div>{/* /about text column */}

            {/* Right: studio photo collage */}
            <div className="about-photos" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              height: '100%',
              maxHeight: 480,
            }}>
              <div style={{
                gridRow: '1 / 3',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(200,160,82,0.12)',
              }}>
                <img src="/dolls1.jpeg" alt="Guitar session — blue studio lighting" loading="lazy" style={{
                  width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) contrast(1.05)',
                }} />
              </div>
              <div style={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(200,160,82,0.12)',
              }}>
                <img src="/dolls42.jpeg" alt="Engineer mixing at DAW" loading="lazy" style={{
                  width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) contrast(1.05)',
                }} />
              </div>
              <div style={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(200,160,82,0.12)',
              }}>
                <img src="/dolls40.jpeg" alt="Studio equipment close-up" loading="lazy" style={{
                  width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) contrast(1.05)',
                }} />
              </div>
            </div>
          </div>{/* /about-grid */}
        </section>

        {/* ══════════════════════════════════════════════════════
            FINAL CTA
           ══════════════════════════════════════════════════════ */}
        <section
          className="flex flex-col items-center justify-center text-center px-6"
          style={{
            paddingTop: 80,
            paddingBottom: 100,
            borderTop: '1px solid var(--line-brass)',
          }}
        >
          <h2 className={isArabic ? '' : 'font-playfair'} style={{
            color: 'var(--bone)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 40,
            fontFamily: arFont,
          }}>
            {pick(finalCta.heading, lang)}
          </h2>
          <a
            href="#services"
            className="cta-nav"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 32px',
              background: 'var(--brass)',
              color: 'var(--ink)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: isArabic ? '0' : '0.04em',
              textTransform: isArabic ? 'none' : 'uppercase',
              textDecoration: 'none',
              borderRadius: 0,
              border: '1px solid var(--brass)',
              cursor: 'pointer',
              fontFamily: arFont,
              transition: 'background-color 280ms cubic-bezier(0.25, 1, 0.5, 1), border-color 280ms cubic-bezier(0.25, 1, 0.5, 1), color 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms cubic-bezier(0.25, 1, 0.5, 1), transform 280ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#d4b96a';
              el.style.borderColor = '#d4b96a';
              el.style.boxShadow = '0 4px 20px rgba(200, 160, 82, 0.35)';
              el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--brass)';
              el.style.borderColor = 'var(--brass)';
              el.style.boxShadow = 'none';
              el.style.transform = 'translateY(0)';
            }}
          >
            {pick(finalCta.button, lang)}
          </a>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOOTER
           ══════════════════════════════════════════════════════ */}
        <footer style={{ borderTop: '1px solid var(--line-brass)', background: 'rgba(10,10,10,0.6)' }}>
          <div className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto" style={{ paddingTop: 48, paddingBottom: 40 }}>
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10" style={{ marginBottom: 40 }}>
              {/* Brand + tagline */}
              <div>
                <p className={isArabic ? '' : 'font-playfair'} style={{ color: 'var(--bone)', fontSize: 20, fontWeight: 400, marginBottom: 12, fontFamily: arFont }}>
                  {pick(brand.name, lang)}
                </p>
                <p style={{ color: 'var(--mute)', fontSize: 13, lineHeight: 1.7, fontFamily: arFont }}>
                  {pick(footerT.tagline, lang)}
                </p>
                <div className="flex items-center gap-2" style={{ marginTop: 16, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ color: 'var(--mute)', fontSize: 13, fontFamily: arFont }}>{pick(footerT.location, lang)}</span>
                </div>
              </div>

              {/* Contact */}
              <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
                <p style={{ color: 'var(--bone)', fontSize: 13, fontWeight: 500, letterSpacing: isArabic ? '0' : '0.06em', textTransform: isArabic ? 'none' : 'uppercase', marginBottom: 16, fontFamily: arFont }}>
                  {pick(footerT.contact, lang)}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: isArabic ? 'flex-end' : 'flex-start' }}>
                  <a href="mailto:sastha@dolesmusic.com" style={{ color: 'var(--mute)', fontSize: 13, textDecoration: 'none', transition: 'color 200ms ease' }} className="footer-link">
                    sastha@dolesmusic.com
                  </a>
                  <a href="tel:+917259356149" style={{ color: 'var(--mute)', fontSize: 13, textDecoration: 'none', transition: 'color 200ms ease' }} className="footer-link">
                    +91 7259356149
                  </a>
                  <a href="https://wa.me/917259356149" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 200ms ease', flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ paddingTop: 20, borderTop: '1px solid var(--line-brass)' }}>
              <p style={{ color: 'var(--mute)', fontSize: 12, fontFamily: arFont }}>
                &copy; {new Date().getFullYear()} {pick(footerT.copyright, lang)}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/dolesmusic_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{ color: 'var(--mute)', transition: 'color 200ms ease' }}
                  className="footer-link"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.linkedin.com/company/dolesmusic"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: 'var(--mute)', transition: 'color 200ms ease' }}
                  className="footer-link"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Floating media player — visible when beats are playing ── */}
      {floatingPlayer && (
        <div
          className="floating-media-player"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'rgba(10, 10, 10, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(200,160,82,0.25)',
            transform: floatingPlayer ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {/* Progress bar — thin line at top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'rgba(200,160,82,0.1)',
          }}>
            <div style={{
              height: '100%',
              width: `${floatingPlayer.progress}%`,
              background: 'var(--brass)',
              transition: 'width 0.3s linear',
            }} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            gap: 12,
            maxWidth: 1440,
            margin: '0 auto',
          }}>
            {/* Play/Pause button */}
            <button
              onClick={() => floatingPlayer.onToggle?.()}
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(200,160,82,0.4)',
                background: 'rgba(200,160,82,0.08)',
                color: 'var(--brass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(200,160,82,0.18)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,160,82,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(200,160,82,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,160,82,0.4)';
              }}
              aria-label={floatingPlayer.id.startsWith('yt-') ? 'Stop' : (floatingPlayer.isPlaying ? 'Pause' : 'Play')}
            >
              {floatingPlayer.id.startsWith('yt-') ? (
                /* YouTube: show stop (X) icon since we can't pause iframe */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              ) : floatingPlayer.isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="3" width="5" height="18" rx="1" />
                  <rect x="14" y="3" width="5" height="18" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <p style={{
                color: 'var(--bone)',
                fontSize: 13,
                fontWeight: 500,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
              }}>
                {floatingPlayer.title}
              </p>
              <p style={{
                color: 'var(--mute)',
                fontSize: 11,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
              }}>
                {floatingPlayer.artist}
              </p>
            </div>

            {/* Time display or source badge */}
            {floatingPlayer.id.startsWith('yt-') ? (
              <span style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--mute)',
                fontSize: 10,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000" style={{ flexShrink: 0 }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video
              </span>
            ) : (
              <span style={{
                flexShrink: 0,
                color: 'var(--mute)',
                fontSize: 11,
                fontFamily: 'monospace',
                letterSpacing: '0.02em',
              }}>
                {formatFloatingTime(floatingPlayer.currentTime)} / {formatFloatingTime(floatingPlayer.duration)}
              </span>
            )}

            {/* EQ bars animation when playing */}
            {floatingPlayer.isPlaying && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16, flexShrink: 0 }} aria-hidden="true">
                {[8, 14, 6, 12, 10].map((h, i) => (
                  <div
                    key={i}
                    className="eq-bar"
                    style={{
                      width: 2,
                      height: h,
                      background: 'var(--brass)',
                      borderRadius: 1,
                      opacity: 0.7,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sticky mobile CTA bar — slides up after scrolling past hero ── */}
      <div className={`mobile-sticky-cta ${showStickyCta ? 'mobile-sticky-cta-visible' : ''}`} style={floatingPlayer ? { bottom: 68 } : undefined}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
          <span className="mobile-sticky-cta-text" style={{ color: 'var(--mute)', fontSize: 11, fontWeight: 400, fontFamily: arFont }}>
            {pick(mobileCta.limitedSlots, lang)}
          </span>
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-sticky-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 20px',
              background: 'var(--brass)',
              color: 'var(--ink)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: isArabic ? '0' : '0.05em',
              textTransform: isArabic ? 'none' as const : 'uppercase' as const,
              textDecoration: 'none',
              borderRadius: 0,
              border: 'none',
              fontFamily: arFont,
              whiteSpace: 'nowrap',
            }}
          >
            {pick(nav.bookSession, lang)}
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GLOBAL STYLES — animations & hover effects
         ══════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* ── Arabic font import ── */
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');

        /* ── Marquee ── */
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
        }

        /* ── Testimonial conveyor belt ── */
        @keyframes testimonial-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonial-belt {
          animation: testimonial-scroll 45s linear infinite;
        }
        .testimonial-belt:hover {
          animation-play-state: paused;
        }

        /* ── Studio photo strip conveyor ── */
        @keyframes studio-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .studio-belt {
          animation: studio-scroll 40s linear infinite;
        }
        .studio-belt:hover {
          animation-play-state: paused;
        }
        .studio-belt img:hover {
          filter: saturate(1) contrast(1.1) !important;
        }

        /* ── Equalizer bars ── */
        @keyframes eq-bounce {
          0%, 100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1); }
        }
        .eq-bar {
          transform-origin: bottom;
          animation: eq-bounce 1.2s ease-in-out infinite;
        }

        /* ── VU meter segments ── */
        @keyframes vu-pulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
        .vu-segment {
          animation: vu-pulse 2s ease-in-out infinite;
        }

        /* ── LED pulse ── */
        @keyframes led-glow {
          0%, 100% { box-shadow: 0 0 4px rgba(200,160,82,0.3); }
          50%      { box-shadow: 0 0 8px rgba(200,160,82,0.6); }
        }
        .led-pulse {
          animation: led-glow 2.5s ease-in-out infinite;
        }

        /* ── Pricing card hover glow ── */
        .pricing-card:hover {
          box-shadow: 0 0 24px rgba(200,160,82,0.12), 0 4px 20px rgba(0,0,0,0.3);
          border-color: rgba(200,160,82,0.25) !important;
        }

        /* ── Footer link hover ── */
        .dubai-scope .footer-link:hover {
          color: var(--bone) !important;
        }

        /* ── Pricing CTA hover ── */
        .pricing-cta:hover {
          background: var(--brass) !important;
          color: var(--ink) !important;
          box-shadow: 0 0 16px rgba(200,160,82,0.2);
        }

        /* ── Hero CTA focus-visible ── */
        .hero-cta:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 3px;
        }

        /* ── Spinner for loading state ── */
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ── Volume slider thumb ── */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--brass);
          cursor: pointer;
          border: none;
          margin-top: -4px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--brass);
          cursor: pointer;
          border: none;
        }

        /* ── Scrollbar for beats list ── */
        div::-webkit-scrollbar {
          width: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(200,160,82,0.2);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(200,160,82,0.35);
        }

        /* ── Beats panel scrollbar ── */
        .beats-panel::-webkit-scrollbar {
          width: 4px;
        }
        .beats-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .beats-panel::-webkit-scrollbar-thumb {
          background: rgba(200,160,82,0.2);
          border-radius: 2px;
        }
        .beats-panel::-webkit-scrollbar-thumb:hover {
          background: rgba(200,160,82,0.35);
        }

        /* ── Beats + Portfolio split responsive — tablet ── */
        @media (max-width: 1024px) {
          .beats-portfolio-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .beats-panel,
          .portfolio-panel {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
          }
          .portfolio-scroll-area {
            overflow: visible !important;
          }
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* ── Portfolio play overlay ── */
        .portfolio-card-item:hover .portfolio-play-overlay {
          background: rgba(0,0,0,0.5) !important;
        }
        .portfolio-card-item:hover .portfolio-play-overlay > div {
          transform: scale(1.1);
          background: var(--brass) !important;
        }
        .portfolio-card-item:hover {
          transform: translateY(-2px);
          border-color: rgba(200,160,82,0.3) !important;
        }

        /* ── Portfolio scroll area scrollbar ── */
        .portfolio-scroll-area::-webkit-scrollbar {
          width: 4px;
        }
        .portfolio-scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .portfolio-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(200,160,82,0.2);
          border-radius: 2px;
        }
        .portfolio-scroll-area::-webkit-scrollbar-thumb:hover {
          background: rgba(200,160,82,0.35);
        }

        /* ═══ FLOATING MEDIA PLAYER ═══ */
        .floating-media-player {
          box-shadow: 0 -4px 24px rgba(0,0,0,0.5);
        }

        /* ═══ MOBILE-ONLY ELEMENTS — hidden on desktop ═══ */
        .pricing-card-mobile { display: none; }
        .tap-hint { display: none; }
        .mobile-sticky-cta { display: none; }
        .mobile-section-cta { display: none; }
        .testimonial-swipe-hint { display: none; }

        /* ═══ MOBILE OPTIMIZATIONS (<768px) ═══ */
        @media (max-width: 768px) {
          /* ── Show mobile flip cards, hide desktop cards ── */
          .pricing-card-desktop { display: none !important; }
          .pricing-card-mobile {
            display: block !important;
            cursor: pointer;
            perspective: 1000px;
            transition: height 0.5s ease;
          }
          .flip-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
          }
          .pricing-card-mobile.flipped .flip-inner {
            transform: rotateY(180deg);
          }
          .flip-face {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .flip-front {
            position: relative;
          }
          .flip-back {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            transform: rotateY(180deg);
          }
          .pricing-card-mobile.flipped {
            /* height is set via JS */
          }

          /* ── Tap hint — visible on mobile ── */
          .tap-hint {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid rgba(200,160,82,0.1);
            color: var(--brass);
            font-size: 12px;
            font-weight: 500;
            animation: tap-pulse 2s ease-in-out infinite;
          }
          @keyframes tap-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }

          /* ── Gold shimmer sweep on unflipped cards ── */
          .pricing-card-mobile:not(.flipped)::after {
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(200,160,82,0.07), transparent);
            animation: card-shimmer 3.5s ease-in-out infinite;
            pointer-events: none;
            z-index: 3;
          }
          @keyframes card-shimmer {
            0%   { left: -50%; }
            50%  { left: 100%; }
            100% { left: 100%; }
          }

          /* ── Beats + Portfolio: constrained internal scroll ── */
          .beats-panel {
            max-height: 520px !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch;
            height: auto !important;
          }
          .portfolio-panel {
            max-height: 500px !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
          }
          .portfolio-scroll-area {
            overflow-y: auto !important;
            flex: 1 !important;
            -webkit-overflow-scrolling: touch;
          }
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }

          /* ── Beats Player: mobile-tight layout ── */
          .beats-genre-desktop { display: none !important; }
          .beats-genre-mobile { display: block !important; }

          @keyframes filterSlideDown {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* Compact now-playing bar */
          .beats-now-playing {
            padding: 10px 14px !important;
          }

          /* Hide volume on mobile (hardware controls are enough) */
          .beats-volume-ctrl { display: none !important; }

          /* Compact track rows */
          .beats-track-row {
            padding: 10px 14px !important;
            gap: 10px !important;
          }

          /* Hide per-track genre badge on mobile (user already filtered) */
          .beats-track-genre-badge { display: none !important; }

          /* Compact genre section dividers */
          .beats-genre-divider {
            padding: 8px 14px 4px !important;
          }

          /* ── Reduce section padding on mobile ── */
          #hero { min-height: calc(100dvh - var(--nav-h, 80px)) !important; min-height: calc(100vh - var(--nav-h, 80px)) !important; }
          @supports (min-height: 100dvh) {
            #hero { min-height: calc(100dvh - var(--nav-h, 80px)) !important; }
          }
          #beats { padding-top: 48px !important; padding-bottom: 48px !important; }
          #services { padding-top: 64px !important; padding-bottom: 64px !important; }

          /* ── Tighter grids on mobile ── */
          .beats-portfolio-split { gap: 28px !important; }

          /* ── Testimonials mobile: narrower cards ── */
          .testimonial-belt > div {
            width: 280px !important;
            min-width: 280px !important;
            padding: 24px 20px !important;
          }
          .testimonial-belt > div blockquote {
            font-size: 14px !important;
            line-height: 1.7 !important;
          }

          /* ── Brand trust bar mobile: smaller text ── */
          .marquee-track span {
            font-size: 11px !important;
            padding: 0 16px !important;
          }

          /* ── Testimonials section: tighter mobile padding ── */
          #testimonials {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          #testimonials h2 {
            font-size: clamp(1.4rem, 6vw, 2rem) !important;
          }
          #testimonials > p:last-of-type {
            margin-bottom: 28px !important;
          }

          /* ═══ TESTIMONIALS: conveyor belt + swipeable on mobile ═══ */
          /* Wrapper stays non-scrolling — gradients are fixed at edges */
          .testimonial-wrapper {
            overflow: hidden !important;
          }
          /* Narrow fade gradients on mobile */
          .testimonial-fade-left,
          .testimonial-fade-right {
            width: 30px !important;
          }
          /* Inner scroll container allows swipe */
          .testimonial-outer {
            overflow-x: auto !important;
            overflow-y: hidden !important;
            -webkit-overflow-scrolling: touch;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          /* Keep conveyor belt animation on mobile — user can still swipe */
          .testimonial-belt {
            animation: testimonial-scroll 35s linear infinite !important;
            gap: 14px !important;
          }
          /* Pause animation on touch (user is swiping) */
          .testimonial-outer:active .testimonial-belt,
          .testimonial-belt:active {
            animation-play-state: paused !important;
          }
          .testimonial-belt > div {
            width: 280px !important;
            min-width: 280px !important;
            padding: 24px 20px !important;
          }
          .testimonial-belt > div blockquote {
            font-size: 14px !important;
            line-height: 1.7 !important;
          }
          /* Show ALL cards (both sets) for seamless conveyor loop */
          .testimonial-belt > div:nth-child(n+6) {
            display: flex !important;
          }
          /* Swipe hint visible on mobile */
          .testimonial-swipe-hint {
            display: flex !important;
          }
          /* Hide scrollbar for cleaner look */
          .testimonial-outer::-webkit-scrollbar {
            display: none;
          }
          .testimonial-outer {
            scrollbar-width: none;
          }

          /* ═══ STICKY MOBILE CTA BAR ═══ */
          .mobile-sticky-cta {
            display: block !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 90;
            background: rgba(14, 14, 14, 0.96);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid rgba(200,160,82,0.2);
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .mobile-sticky-cta-visible {
            transform: translateY(0) !important;
          }
          @keyframes stickyPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(200,160,82,0.3); }
            50% { box-shadow: 0 0 12px 2px rgba(200,160,82,0.15); }
          }
          .mobile-sticky-cta-btn {
            animation: stickyPulse 3s ease-in-out infinite;
          }

          /* ═══ INTER-SECTION CTA STRIPS ═══ */
          .mobile-section-cta {
            display: block !important;
          }
          @keyframes ctaShimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .mobile-section-cta a {
            background-image: linear-gradient(90deg, rgba(200,160,82,0.06) 0%, rgba(200,160,82,0.12) 50%, rgba(200,160,82,0.06) 100%) !important;
            background-size: 200% 100%;
            animation: ctaShimmer 4s ease-in-out infinite;
          }

          /* ═══ STUDIO PHOTO STRIP: smaller on mobile ═══ */
          .studio-strip {
            padding: 24px 0 !important;
          }
          .studio-belt > div {
            width: 200px !important;
            min-width: 200px !important;
            height: 130px !important;
          }
          .studio-belt {
            gap: 10px !important;
          }

          /* ═══ ABOUT GRID: stack on mobile ═══ */
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .about-photos {
            max-height: 300px !important;
          }

          /* ═══ HERO BG: adjust for mobile ═══ */
          #hero img[src*="dolls43"] {
            object-position: 35% 25% !important;
            opacity: 0.16 !important;
          }

          /* ═══ ABOUT SECTION: tighter on mobile ═══ */
          #about {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          #about p {
            font-size: 14px !important;
            line-height: 1.7 !important;
          }
          #about .about-cta-whatsapp,
          #about .cta-nav {
            padding: 12px 16px !important;
            font-size: 12px !important;
            flex: 1 1 0 !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* ═══ FOOTER: pad bottom for sticky CTA + floating player ═══ */
          footer {
            padding-bottom: 140px !important;
          }

          /* ═══ FINAL CTA: tighter on mobile ═══ */
          .dubai-scope section:last-of-type {
            padding-top: 48px !important;
            padding-bottom: 60px !important;
          }

          /* ═══ HERO: tighter on mobile ═══ */
          #hero > div[style*="padding"] {
            padding-top: 36px !important;
            padding-bottom: 36px !important;
          }

          /* ═══ BRAND TRUST BAR: compact ═══ */
          .marquee-track span {
            font-size: 11px !important;
            padding: 0 16px !important;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .testimonial-belt,
          .studio-belt,
          .eq-bar,
          .vu-segment,
          .led-pulse,
          .hero-cta {
            animation: none !important;
            transition: none !important;
          }
          .hero-waveform path {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT — wraps with language provider
   ══════════════════════════════════════════════════════════════ */
export default function DubaiLandingPage() {
  return (
    <DubaiLanguageProvider>
      <DubaiLandingPageInner />
    </DubaiLanguageProvider>
  );
}
