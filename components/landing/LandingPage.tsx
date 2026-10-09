'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Navbar from './Navbar';
import {
  hero, services as svcT, beats as beatsT,
  portfolioContent as portContentT, portfolioItems as portItems,
  testimonials as testT, about as aboutT,
  beforeAfter as baT,
  howItWorks as hiwT,
  faqItems,
  serviceCards,
  finalCta, footer as footerT,
  brandName, beatGenres, beatTitles, beatArtist, testimonialItems,
} from './translations';
import SecureBeatsPlayer from './SecureBeatsPlayer';
import CardBeforeAfterPlayer from './CardBeforeAfterPlayer';
import { globalAudioManager } from './globalAudioManager';
import type { CardAudioSample } from './CardBeforeAfterPlayer';
import type { Beat } from './SecureBeatsPlayer';

/* ─── Trust-bar brands (real clients) ─── */
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

type PortfolioTab = 'all' | 'filmTv' | 'singles' | 'brands';
const CATEGORY_MAP: Record<string, PortfolioTab> = {
  film: 'filmTv',
  bgm: 'filmTv',
  single: 'singles',
  brand: 'brands',
};

/* ─── Beats Library — static data (show 6 by default) ─── */
const BEATS_DATA: Beat[] = [
  { id: 'b1',  title: beatTitles['Afro House Beat'],                    artist: beatArtist, genre: beatGenres['Afro / House'],  src: 'AFRO_HOUSE_BEAT' },
  { id: 'b2',  title: beatTitles['Dancefloor (118 BPM)'],               artist: beatArtist, genre: beatGenres['Afro / House'],  src: 'DANCEFLOOR_118' },
  { id: 'b3',  title: beatTitles['Arabic Trap Beat'],                   artist: beatArtist, genre: beatGenres['Arabic Trap'],   src: 'ARABIC_TRAP_BEAT' },
  { id: 'b4',  title: beatTitles['Arabic Trap Beat (100 BPM)'],         artist: beatArtist, genre: beatGenres['Arabic Trap'],   src: 'ARABIC_TRAP_BEAT_100BPM' },
  { id: 'b5',  title: beatTitles['Dark Jersey Drill Beat'],             artist: beatArtist, genre: beatGenres['Drill'],         src: 'DARK_JERSEY_DRILL_BEAT' },
  { id: 'b6',  title: beatTitles['Indian Drill Beat'],                  artist: beatArtist, genre: beatGenres['Drill'],         src: 'INDIAN_DRILL_BEAT_DEMO' },
  { id: 'b7',  title: beatTitles['Indian Drill Beat III'],              artist: beatArtist, genre: beatGenres['Drill'],         src: 'INDIAN_DRILL_BEAT_DEMO_3' },
  { id: 'b8',  title: beatTitles['Khaas Freestyle Type Beat (98 BPM)'], artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'KHAAS_FREESTYLE_TYPE_BEAT_98BPM' },
  { id: 'b9',  title: beatTitles['Scott Storch Type Beat'],             artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'SCOTT_STORCH_TYPE_BEAT' },
  { id: 'b10', title: beatTitles['Mama Beats 23'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_23_FOR_ROHU' },
  { id: 'b11', title: beatTitles['Mama Beats 24'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_24_FOR_ROHU' },
  { id: 'b12', title: beatTitles['Mama Beats 46'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_46' },
  { id: 'b13', title: beatTitles['Mama Beats 48'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_48' },
  { id: 'b14', title: beatTitles['Mama Beats 49'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_49' },
  { id: 'b15', title: beatTitles['Mama Beats 51'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_51' },
  { id: 'b16', title: beatTitles['Mama Beats 70'],                      artist: beatArtist, genre: beatGenres['Hip-Hop'],       src: 'MAMA_BEATS_70' },
  { id: 'b17', title: beatTitles['Punjabi Trap Beat'],                  artist: beatArtist, genre: beatGenres['Punjabi Trap'],  src: 'PUNJABI_TRAP_BEAT' },
];

/* ─── Before / After audio samples — keyed by service name ─── */
const SERVICE_SAMPLES: Record<string, CardAudioSample> = {
  Mixing: {
    trackTitle: 'Vocal Production',
    artist: "Dole's Music",
    beforeSrc: 'VOICE_PROD_BEFORE',
    afterSrc: 'VOICE_PROD_AFTER',
  },
  Production: {
    trackTitle: 'Production 101',
    artist: "Dole's Music",
    beforeSrc: 'PROD_101_BEFORE',
    afterSrc: 'PROD_101_AFTER',
  },
};

/* ─── Contact form endpoint (Google Apps Script) ─── */
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyacCuJONBHOLybrbmnc_iWdIfw8XvHEr5zPACAvJYrthzygTVgMNEKYvsoAYOrHymF/exec';

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

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
    let frame: number;
    let t = phaseOffset;
    const animate = () => {
      t += 0.015;
      if (pathRef.current) {
        let d = 'M0,40 ';
        for (let x = 0; x <= 200; x += 2) {
          const y = 40 + Math.sin((x / 200) * Math.PI * 4 + t) * 12
                      + Math.sin((x / 200) * Math.PI * 2 + t * 0.7) * 6;
          d += `L${x},${y.toFixed(2)} `;
        }
        pathRef.current.setAttribute('d', d);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [phaseOffset]);

  return (
    <svg
      className="hero-waveform"
      viewBox="0 0 200 80"
      preserveAspectRatio="none"
      style={{ width: '100%', maxWidth: 420, height: 40, display: 'block', margin: '20px auto 0', opacity: 0.35 }}
      aria-hidden="true"
    >
      <path ref={pathRef} d="M0,40 L200,40" fill="none" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ═══ Hero area wave — canvas-based animated waveform with EQ bars ═══ */
function HeroAreaWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barsCount = 64;
      const barW = w / barsCount;
      const maxH = h * 0.7;

      for (let i = 0; i < barsCount; i++) {
        const x = i * barW;
        const norm = i / barsCount;
        const envelope = Math.sin(norm * Math.PI) * 0.8 + 0.2;
        const wave1 = Math.sin(norm * Math.PI * 6 + t * 2) * 0.3;
        const wave2 = Math.sin(norm * Math.PI * 3 + t * 1.3) * 0.2;
        const barH = maxH * envelope * (0.5 + wave1 + wave2);
        const alpha = 0.03 + envelope * 0.04;

        ctx.fillStyle = `rgba(232, 28, 50, ${alpha})`;
        ctx.fillRect(x, h - barH, barW - 1, barH);
      }

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60%',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
}

/* ═══ Shared card style ═══ */
const cardBase: React.CSSProperties = {
  position: 'relative',
  padding: '32px 28px',
  background: 'rgba(24, 24, 27, 0.80)',
  border: '1px solid rgba(39, 39, 42, 0.60)',
  borderRadius: '16px',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  overflow: 'hidden',
  transition: 'box-shadow 300ms ease, border-color 300ms ease',
};

/* ── Time formatter for floating player ── */
function formatFloatingTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  /* ── Portfolio tab state ── */
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>('all');

  /* ── FAQ accordion state ── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openService, setOpenService] = useState<number | null>(0);
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);

  /* ── Contact form state ── */
  const [formData, setFormData] = useState({ name: '', email: '', instagram: '', whatsapp: '', description: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  /* ── Privacy modal state ── */
  const [showPrivacy, setShowPrivacy] = useState(false);

  /* ── Testimonial carousel state ── */
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTestimonialTimer = useCallback(() => {
    if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    testimonialTimerRef.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonialItems.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startTestimonialTimer();
    return () => { if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current); };
  }, [startTestimonialTimer]);

  const goToTestimonial = useCallback((idx: number) => {
    setActiveTestimonial(idx);
    startTestimonialTimer();
  }, [startTestimonialTimer]);

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

  useEffect(() => {
    const equalize = () => {
      const cards = document.querySelectorAll<HTMLElement>('.service-split-card');
      if (window.innerWidth <= 768) {
        cards.forEach(c => c.style.minHeight = '');
        return;
      }
      cards.forEach(c => c.style.minHeight = '');
      const maxH = Math.max(...Array.from(cards).map(c => c.offsetHeight));
      cards.forEach(c => c.style.minHeight = `${maxH}px`);
    };
    equalize();
    window.addEventListener('resize', equalize);
    return () => window.removeEventListener('resize', equalize);
  }, []);

  /* ── Contact form submit handler ── */
  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // no-cors responses are opaque — treat as success
    }
    setFormSubmitting(false);
    setFormSubmitted(true);
  }, [formData]);

  /* ── Filtered portfolio ── */
  const filteredPortfolio = portfolioTab === 'all'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => CATEGORY_MAP[p.categoryKey] === portfolioTab);

  return (
    <div className="site-scope" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--bone)', overflowX: 'hidden' }}>
      <Navbar />

      {/* Spacer for fixed nav */}
      <div style={{ height: 'var(--nav-h, 80px)' }} />

      <main id="main-content">

        {/* ══════════════════════════════════════════════════════
            1. HERO
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
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src="/dolls43.jpeg"
              alt=""
              aria-hidden="true"
              style={{
                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%',
                filter: 'grayscale(100%) contrast(1.1)', opacity: 0.18,
              }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, var(--ink), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20%', background: 'linear-gradient(to bottom, var(--ink), transparent)', pointerEvents: 'none' }} />
          </div>

          <svg aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 180, opacity: 0.04, pointerEvents: 'none' }} viewBox="0 0 1440 180" preserveAspectRatio="none">
            <path d="M0,90 C360,180 720,0 1080,90 C1260,135 1350,45 1440,90 L1440,180 L0,180 Z" fill="var(--brass)" />
          </svg>

          <HeroAreaWave />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
            <p style={{ color: 'var(--brass)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
              {hero.eyebrow}
            </p>

            <h1 className="font-playfair" style={{ marginBottom: 16 }}>
              <span style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--bone)' }}>
                {hero.line1}
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--brass)' }}>
                {hero.line2}
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', fontWeight: 300, lineHeight: 1.4, fontStyle: 'italic', color: 'var(--mute)', marginTop: 8 }}>
                {hero.line3}
              </span>
            </h1>

            <HeroWaveform />

            <p className="font-body" style={{ color: 'var(--mute)', fontSize: 15, lineHeight: 1.7, maxWidth: 520, margin: '24px auto' }}>
              {hero.subhead}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#contact-form"
                className="hero-cta"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 28px', border: 'none',
                  background: 'linear-gradient(to right, #9a0018, #d41124)', color: '#fff',
                  fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', borderRadius: '9999px', cursor: 'pointer',
                  boxShadow: '0 0 40px 12px rgba(212,24,36,0.14), 0 0 80px 24px rgba(212,24,36,0.07)',
                  transition: 'box-shadow 300ms ease, transform 200ms ease',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = '0 0 32px rgba(235,64,52,0.5)'; el.style.transform = 'scale(1.03)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = '0 0 40px 12px rgba(212,24,36,0.14), 0 0 80px 24px rgba(212,24,36,0.07)'; el.style.transform = 'scale(1)'; }}
              >
                {hero.ctaPrimary}
              </a>

              <a
                href="#portfolio"
                className="hero-cta hero-cta-ghost"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', border: '1px solid rgba(255,255,255,0.20)',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', borderRadius: '9999px', cursor: 'pointer',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  transition: 'border-color 300ms ease, box-shadow 300ms ease, background 300ms ease',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(232,28,50,0.45)'; el.style.background = 'rgba(255,255,255,0.11)'; el.style.boxShadow = '0 0 40px -12px rgba(212,24,36,0.42)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.20)'; el.style.background = 'rgba(255,255,255,0.06)'; el.style.boxShadow = 'none'; }}
              >
                <PlayIcon />
                {hero.ctaSecondary}
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            2. STATS BANNER
           ══════════════════════════════════════════════════════ */}
        <section style={{
          borderTop: '1px solid var(--line-brass)',
          borderBottom: '1px solid var(--line-brass)',
          padding: '40px 24px',
        }}>
          <div className="max-w-[1440px] mx-auto" style={{
            display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap',
          }}>
            {[
              { number: '300+', label: 'Tracks Mixed' },
              { number: '250+', label: 'Tracks Produced' },
              { number: '100+', label: 'Artists Worked With' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center', minWidth: 140 }}>
                <p style={{ color: 'var(--brass)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, lineHeight: 1, margin: 0 }}>
                  {stat.number}
                </p>
                <p style={{ color: 'var(--mute)', fontSize: 13, marginTop: 8, letterSpacing: '0.04em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            3. SERVICES — 4 cards, no pricing
           ══════════════════════════════════════════════════════ */}
        <section
          id="services"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 100, paddingBottom: 100, position: 'relative' }}
        >
          <p style={{ color: 'var(--brass)', fontSize: 12, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            {svcT.eyebrow}
          </p>
          <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 16 }}>
            {svcT.heading}
          </h2>
          <p className="font-body" style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.7, marginBottom: 56, maxWidth: 560 }}>
            {svcT.description}
          </p>

          {/* Desktop: split cards */}
          <div className="service-cards-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {serviceCards.map((card, idx) => {
              const photos = ['/dolls43.jpeg', '/dolls42.jpeg', '/dolls1.jpeg', '/dolls40.jpeg'];
              const num = String(idx + 1).padStart(2, '0');
              const isEven = idx % 2 === 0;
              return (
                <div key={card.title} className={`service-card service-split-card${SERVICE_SAMPLES[card.title] ? '' : ' no-player'}`} style={{
                  ...cardBase,
                  padding: 0,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    order: isEven ? 0 : 1,
                  }}>
                    <img
                      src={photos[idx]}
                      alt={`${card.title} studio`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) contrast(1.1)', opacity: 0.7 }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: isEven
                        ? 'linear-gradient(to right, transparent 50%, rgba(24,24,27,0.95))'
                        : 'linear-gradient(to left, transparent 50%, rgba(24,24,27,0.95))',
                      pointerEvents: 'none',
                    }} />
                    <span style={{
                      position: 'absolute', bottom: 16, [isEven ? 'right' : 'left']: 20,
                      fontSize: 'clamp(5rem, 10vw, 8rem)', fontWeight: 700, lineHeight: 1,
                      color: 'rgba(232,28,50,0.08)', pointerEvents: 'none',
                      fontFamily: 'var(--font-playfair), serif',
                    }}>
                      {num}
                    </span>
                  </div>
                  <div style={{
                    padding: '36px 32px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    order: isEven ? 1 : 0,
                  }}>
                    <span style={{ color: 'var(--brass)', fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                      {num}
                    </span>
                    <h3 style={{ color: 'var(--bone)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 500, marginBottom: 12, lineHeight: 1.2 }}>
                      {card.title}
                    </h3>
                    <p className="font-body" style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                      {card.description}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {card.deliverables.map((d) => (
                        <li key={d} style={{ color: 'var(--mute)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'var(--brass)', fontSize: 11, flexShrink: 0 }}>&#10003;</span> {d}
                        </li>
                      ))}
                    </ul>
                    {SERVICE_SAMPLES[card.title] && (
                      <div style={{ marginBottom: 20 }}>
                        <CardBeforeAfterPlayer
                          sample={SERVICE_SAMPLES[card.title]}
                          beforeLabel={baT.before}
                          afterLabel={baT.after}
                        />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <a href="#contact-form" className="service-cta" style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px 28px', border: '1px solid var(--brass)', background: 'transparent', color: 'var(--brass)',
                        fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                        textDecoration: 'none', borderRadius: '9999px', cursor: 'pointer',
                        transition: 'background 240ms ease, color 240ms ease, box-shadow 240ms ease',
                      }}>
                        {beatsT.cta}<ChevronRight />
                      </a>
                      {card.title === 'Custom Beats' && (
                      <a href="#beats" className="service-cta-ghost" style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '12px 22px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--mute)',
                        fontSize: 13, fontWeight: 500, letterSpacing: '0.03em',
                        textDecoration: 'none', borderRadius: '9999px', cursor: 'pointer',
                        transition: 'border-color 240ms ease, color 240ms ease',
                      }}>
                        <PlayIcon />Browse Beats
                      </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: collapsible accordion cards */}
          <div className="service-cards-mobile" style={{ display: 'none', flexDirection: 'column', gap: 12 }}>
            {serviceCards.map((card, idx) => {
              const photos = ['/dolls43.jpeg', '/dolls42.jpeg', '/dolls1.jpeg', '/dolls40.jpeg'];
              const num = String(idx + 1).padStart(2, '0');
              const isOpen = openService === idx;
              return (
                <div key={card.title} style={{
                  ...cardBase,
                  padding: 0,
                  overflow: 'hidden',
                  transition: 'border-color 300ms ease',
                  borderColor: isOpen ? 'var(--brass)' : 'rgba(255,255,255,0.06)',
                }}>
                  <button
                    onClick={() => setOpenService(isOpen ? null : idx)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      border: '2px solid var(--brass)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--brass)', fontSize: 14, fontWeight: 600, background: 'rgba(232,28,50,0.06)',
                    }}>
                      {num}
                    </span>
                    <h3 style={{ color: 'var(--bone)', fontSize: 17, fontWeight: 500, flex: 1, margin: 0, lineHeight: 1.3 }}>
                      {card.title}
                    </h3>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      style={{ flexShrink: 0, transition: 'transform 300ms ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M4 6l4 4 4-4" stroke="var(--mute)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div style={{
                    maxHeight: isOpen ? 800 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 400ms ease',
                  }}>
                    <div style={{
                      position: 'relative', height: 180, overflow: 'hidden',
                    }}>
                      <img
                        src={photos[idx]}
                        alt={`${card.title} studio`}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) contrast(1.1)', opacity: 0.7 }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(24,24,27,0.95))',
                        pointerEvents: 'none',
                      }} />
                    </div>

                    <div style={{ padding: '16px 20px 24px' }}>
                      <p className="font-body" style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                        {card.description}
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {card.deliverables.map((d) => (
                          <li key={d} style={{ color: 'var(--mute)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'var(--brass)', fontSize: 11, flexShrink: 0 }}>&#10003;</span> {d}
                          </li>
                        ))}
                      </ul>
                      {SERVICE_SAMPLES[card.title] && (
                        <div style={{ marginBottom: 16 }}>
                          <CardBeforeAfterPlayer
                            sample={SERVICE_SAMPLES[card.title]}
                            beforeLabel={baT.before}
                            afterLabel={baT.after}
                          />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <a href="#contact-form" className="service-cta" style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '10px 24px', border: '1px solid var(--brass)', background: 'transparent', color: 'var(--brass)',
                          fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                          textDecoration: 'none', borderRadius: '9999px', cursor: 'pointer',
                        }}>
                          {beatsT.cta}<ChevronRight />
                        </a>
                        {card.title === 'Custom Beats' && (
                        <a href="#beats" className="service-cta-ghost" style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '10px 18px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--mute)',
                          fontSize: 12, fontWeight: 500, textDecoration: 'none', borderRadius: '9999px', cursor: 'pointer',
                        }}>
                          <PlayIcon />Browse Beats
                        </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            4. PORTFOLIO with category tabs
           ══════════════════════════════════════════════════════ */}
        <section
          id="portfolio"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          <p style={{ color: 'var(--brass)', fontSize: 12, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            {portContentT.eyebrow}
          </p>
          <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>
            {portContentT.heading}
          </h2>
          <p className="font-body" style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>
            {portContentT.description}
          </p>

          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {(Object.entries(portContentT.tabs) as [PortfolioTab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPortfolioTab(key)}
                style={{
                  padding: '8px 20px',
                  border: portfolioTab === key ? '1px solid var(--brass)' : '1px solid rgba(255,255,255,0.15)',
                  background: portfolioTab === key ? 'rgba(232,28,50,0.12)' : 'transparent',
                  color: portfolioTab === key ? 'var(--brass)' : 'var(--mute)',
                  fontSize: 13, fontWeight: 500, borderRadius: '9999px', cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Portfolio grid */}
          <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {(showAllPortfolio ? filteredPortfolio : filteredPortfolio.slice(0, 4)).map((item) => {
              const info = portItems[item.translationKey];
              const cardId = `yt-card-${item.ytId}`;
              return (
                <div
                  key={item.ytId}
                  id={cardId}
                  className="portfolio-card-item"
                  style={{
                    display: 'block', position: 'relative', overflow: 'hidden',
                    background: 'rgba(232,28,50,0.04)', border: '1px solid rgba(232,28,50,0.12)',
                    borderRadius: 12, cursor: 'pointer',
                    transition: 'box-shadow 300ms ease, border-color 300ms ease, transform 200ms ease',
                  }}
                  onClick={(e) => {
                    const ytPlayerId = `yt-${item.ytId}`;
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

                    globalAudioManager.requestPlay(ytPlayerId, stopThisYT);

                    const card = e.currentTarget;
                    const thumbArea = card.querySelector('.yt-thumb-area') as HTMLElement;
                    const iframeArea = card.querySelector('.yt-iframe-area') as HTMLElement;
                    if (thumbArea && iframeArea) {
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
                      const iframe = iframeArea.querySelector('iframe') as HTMLIFrameElement;
                      if (iframe) {
                        const ytId = iframe.getAttribute('data-ytid');
                        if (ytId) iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
                      }

                      globalAudioManager.setFloatingState({
                        id: ytPlayerId,
                        title: info.title,
                        artist: info.credit,
                        isPlaying: true, progress: 0, currentTime: 0, duration: 0,
                        onToggle: () => { stopThisYT(); globalAudioManager.release(ytPlayerId); },
                      });
                    }
                  }}
                >
                  <div className="yt-thumb-area" style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden', background: '#111' }}>
                    <img
                      src={`https://img.youtube.com/vi/${item.ytId}/mqdefault.jpg`}
                      alt={info.title}
                      loading="lazy"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', transition: 'background 200ms ease' }} className="portfolio-play-overlay">
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(232,28,50,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)', transition: 'transform 200ms ease, background 200ms ease' }}>
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                  <div className="yt-iframe-area" style={{ display: 'none', position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                    <iframe
                      data-ytid={item.ytId}
                      src="about:blank"
                      title={info.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ color: 'var(--mute)', fontSize: 12, margin: '0 0 4px', lineHeight: 1.4 }}>
                      {info.workType}
                    </p>
                    <p style={{ color: 'var(--bone)', fontSize: 14, fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {info.title}
                    </p>
                    <p style={{ color: 'var(--mute)', fontSize: 12, margin: '4px 0 0' }}>
                      {info.credit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPortfolio.length > 4 && (
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowAllPortfolio(!showAllPortfolio)}
                style={{
                  padding: '10px 28px', border: '1px solid var(--brass)',
                  background: 'transparent', color: 'var(--bone)', fontSize: 13, fontWeight: 500,
                  borderRadius: '9999px', cursor: 'pointer', transition: 'background 240ms ease, border-color 240ms ease',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brass)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {showAllPortfolio ? 'View Less' : `View All (${filteredPortfolio.length})`}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 300ms ease', transform: showAllPortfolio ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════
            5. BEATS LIBRARY
           ══════════════════════════════════════════════════════ */}
        <section
          id="beats"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }} aria-hidden="true">
                {[10, 16, 6, 14, 20, 8, 12].map((h, i) => (
                  <div key={i} className="eq-bar" style={{ width: 3, height: h, background: 'var(--brass)', borderRadius: 1, opacity: 0.7, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.2, margin: 0 }}>
                {beatsT.sectionTitle}
              </h2>
            </div>
            <p className="font-body" style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.6, maxWidth: 620, margin: 0 }}>
              {beatsT.sectionSub}
            </p>
          </div>

          <div className="beats-panel" style={{ maxHeight: 360, overflowY: 'auto', overflowX: 'hidden' }}>
            <SecureBeatsPlayer
              beats={BEATS_DATA}
              ctaText={beatsT.cta}
              ctaLink="#contact-form"
              sectionTitle={beatsT.sectionTitle}
              sectionSub={beatsT.sectionSub}
              compact
              maxTrackHeight={2000}
            />
          </div>

          <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center' }}>
            <a
              href="#contact-form"
              className="cta-nav"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 44px', background: 'var(--brass)', color: 'var(--ink)',
                fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none', border: '1px solid var(--brass)', borderRadius: '9999px', cursor: 'pointer',
                transition: 'background-color 280ms ease, box-shadow 280ms ease, transform 280ms ease',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = '#e81c32'; el.style.boxShadow = '0 4px 24px rgba(232,28,50,0.4)'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'var(--brass)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}
            >
              {beatsT.cta}
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            6. HOW IT WORKS
           ══════════════════════════════════════════════════════ */}
        <section
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 100 }}
        >
          <p style={{ color: 'var(--brass)', fontSize: 12, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            {hiwT.eyebrow}
          </p>
          <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 48 }}>
            {hiwT.heading}
          </h2>

          {/* Desktop: 4-column grid */}
          <div className="hiw-grid hiw-desktop" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            position: 'relative',
          }}>
            {hiwT.steps.map((step, i) => (
              <div key={i} style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--brass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: 'var(--brass)', fontSize: 18, fontWeight: 600,
                  background: 'rgba(232,28,50,0.06)',
                }}>
                  {i + 1}
                </div>
                <h3 style={{ color: 'var(--bone)', fontSize: 16, fontWeight: 500, marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p className="font-body" style={{ color: 'var(--mute)', fontSize: 13, lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="hiw-mobile" style={{ display: 'none', position: 'relative', paddingLeft: 40 }}>
            <div style={{
              position: 'absolute', left: 19, top: 24, bottom: 24, width: 2,
              background: 'linear-gradient(to bottom, var(--brass), rgba(232,28,50,0.1))',
            }} />
            {hiwT.steps.map((step, i) => (
              <div key={i} style={{
                position: 'relative', paddingBottom: i < hiwT.steps.length - 1 ? 32 : 0,
              }}>
                <div style={{
                  position: 'absolute', left: -40, top: 0,
                  width: 40, height: 40, borderRadius: '50%',
                  border: '2px solid var(--brass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brass)', fontSize: 16, fontWeight: 600,
                  background: 'var(--ink)',
                  zIndex: 1,
                }}>
                  {i + 1}
                </div>
                <div style={{ paddingLeft: 16, paddingTop: 4 }}>
                  <h3 style={{ color: 'var(--bone)', fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                    {step.title}
                  </h3>
                  <p className="font-body" style={{ color: 'var(--mute)', fontSize: 13, lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            7. TRUST BAR — brand ticker
           ══════════════════════════════════════════════════════ */}
        <div style={{
          borderTop: '1px solid var(--line-brass)',
          borderBottom: '1px solid var(--line-brass)',
          padding: '18px 0',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, var(--ink), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, var(--ink), transparent)', zIndex: 2, pointerEvents: 'none' }} />

          <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={`tb-${i}`} style={{
                color: 'var(--bone)', fontSize: 13, fontWeight: 400, letterSpacing: '0.08em',
                opacity: 0.3, padding: '0 24px', whiteSpace: 'nowrap', textTransform: 'uppercase',
              }}>
                {brand}
                <span style={{ opacity: 0.25, margin: '0 6px', color: 'var(--brass)' }}>&middot;</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            STUDIO PHOTO STRIP
           ══════════════════════════════════════════════════════ */}
        <div className="studio-strip" style={{ position: 'relative', overflow: 'hidden', padding: '40px 0' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, zIndex: 2, background: 'linear-gradient(to right, var(--ink), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, zIndex: 2, background: 'linear-gradient(to left, var(--ink), transparent)', pointerEvents: 'none' }} />

          <div className="studio-belt" style={{ display: 'flex', gap: 16, width: 'max-content' }}>
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
                  width: 280, height: 180, minWidth: 280, flexShrink: 0, borderRadius: 4,
                  overflow: 'hidden', position: 'relative', border: '1px solid rgba(232,28,50,0.1)',
                }}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.6) contrast(1.1)', transition: 'filter 0.4s ease' }} />
                  <div className="studio-photo-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(232,28,50,0.05), transparent 60%)', pointerEvents: 'none' }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            8. TESTIMONIALS
           ══════════════════════════════════════════════════════ */}
        <section
          id="testimonials"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 100 }}
        >
          <p style={{ color: 'var(--brass)', fontSize: 12, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            {testT.eyebrow}
          </p>
          <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>
            {testT.heading}
          </h2>
          <p className="font-body" style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.7, marginBottom: 48, maxWidth: 480 }}>
            {testT.description}
          </p>

          <div className="testimonial-carousel" style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
            {/* Prev / Next arrows */}
            <button
              onClick={() => goToTestimonial((activeTestimonial - 1 + testimonialItems.length) % testimonialItems.length)}
              aria-label="Previous testimonial"
              style={{
                position: 'absolute', top: '50%', left: -48, transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(24,24,27,0.8)', color: 'var(--mute)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 200ms ease, color 200ms ease',
                zIndex: 2,
              }}
              className="testimonial-arrow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => goToTestimonial((activeTestimonial + 1) % testimonialItems.length)}
              aria-label="Next testimonial"
              style={{
                position: 'absolute', top: '50%', right: -48, transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(24,24,27,0.8)', color: 'var(--mute)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 200ms ease, color 200ms ease',
                zIndex: 2,
              }}
              className="testimonial-arrow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            {/* Slides */}
            <div style={{ overflow: 'hidden', borderRadius: 16 }}>
              <div style={{
                display: 'flex',
                transform: `translateX(-${activeTestimonial * 100}%)`,
                transition: 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}>
                {testimonialItems.map((testimonial, i) => (
                  <div key={i} style={{
                    ...cardBase, padding: '40px 36px',
                    display: 'flex', flexDirection: 'column' as const,
                    width: '100%', minWidth: '100%', flexShrink: 0,
                    boxSizing: 'border-box',
                  }}>
                    <svg width="28" height="20" viewBox="0 0 32 24" fill="var(--brass)" opacity="0.25" aria-hidden="true" style={{ marginBottom: 16, flexShrink: 0 }}>
                      <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 4C10.4 5.6 8 8.8 8 12h6v12H0Zm18 0V14.4C18 6.4 22.8 1.6 32 0l.8 4C27.2 5.6 25.6 8.8 25.6 12H32v12H18Z" />
                    </svg>
                    <blockquote style={{
                      color: 'var(--bone)', fontSize: 17, lineHeight: 1.8, fontStyle: 'italic',
                      marginBottom: 28, fontWeight: 300, flex: 1,
                    }}>
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', background: 'var(--brass)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--ink)', fontSize: 15, fontWeight: 600, flexShrink: 0,
                      }}>
                        {testimonial.initial}
                      </div>
                      <div>
                        <p style={{ color: 'var(--bone)', fontSize: 15, fontWeight: 500, margin: 0 }}>{testimonial.author}</p>
                        <p style={{ color: 'var(--mute)', fontSize: 12, margin: '2px 0 0' }}>Artist</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {testimonialItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToTestimonial(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: activeTestimonial === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: 'none',
                    background: activeTestimonial === i ? 'var(--brass)' : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 300ms ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            9. FAQ ACCORDION
           ══════════════════════════════════════════════════════ */}
        <section
          className="px-6 md:px-10 lg:px-16 max-w-[800px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 100 }}
        >
          <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 40, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {faqItems.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--line-brass)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bone)',
                    fontSize: 16, fontWeight: 500, textAlign: 'left',
                  }}
                >
                  {faq.question}
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brass)"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: 'transform 300ms ease', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 300ms ease',
                }}>
                  <p className="font-body" style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.7, paddingBottom: 20 }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            10. CONTACT FORM + CONTACT INFO
           ══════════════════════════════════════════════════════ */}
        <section
          id="contact-form"
          className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto"
          style={{ paddingTop: 80, paddingBottom: 100 }}
        >
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Left: form */}
            <div>
              <h2 className="font-playfair" style={{ color: 'var(--bone)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 32 }}>
                {finalCta.heading}
              </h2>

              {formSubmitted ? (
                <div style={{ ...cardBase, textAlign: 'center', padding: '48px 32px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--bone)', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Thanks for reaching out!</p>
                  <p style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.6 }}>We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input
                    type="text"
                    placeholder="Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    style={{
                      padding: '14px 16px', background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(39,39,42,0.6)',
                      borderRadius: 12, color: 'var(--bone)', fontSize: 14, outline: 'none',
                      transition: 'border-color 200ms ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,28,50,0.4)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39,39,42,0.6)'; }}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    style={{
                      padding: '14px 16px', background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(39,39,42,0.6)',
                      borderRadius: 12, color: 'var(--bone)', fontSize: 14, outline: 'none',
                      transition: 'border-color 200ms ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,28,50,0.4)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39,39,42,0.6)'; }}
                  />
                  <input
                    type="text"
                    placeholder="Instagram @ (optional)"
                    value={formData.instagram}
                    onChange={(e) => setFormData(p => ({ ...p, instagram: e.target.value }))}
                    style={{
                      padding: '14px 16px', background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(39,39,42,0.6)',
                      borderRadius: 12, color: 'var(--bone)', fontSize: 14, outline: 'none',
                      transition: 'border-color 200ms ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,28,50,0.4)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39,39,42,0.6)'; }}
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp number (optional)"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                    style={{
                      padding: '14px 16px', background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(39,39,42,0.6)',
                      borderRadius: 12, color: 'var(--bone)', fontSize: 14, outline: 'none',
                      transition: 'border-color 200ms ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,28,50,0.4)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39,39,42,0.6)'; }}
                  />
                  <textarea
                    placeholder="Tell us about your project (optional)"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    style={{
                      padding: '14px 16px', background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(39,39,42,0.6)',
                      borderRadius: 12, color: 'var(--bone)', fontSize: 14, outline: 'none', resize: 'vertical',
                      transition: 'border-color 200ms ease', fontFamily: 'inherit',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,28,50,0.4)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39,39,42,0.6)'; }}
                  />
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    style={{
                      padding: '14px 32px', background: 'linear-gradient(to right, #9a0018, #d41124)',
                      color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: '9999px',
                      cursor: formSubmitting ? 'wait' : 'pointer',
                      boxShadow: '0 0 24px rgba(235,64,52,0.3)',
                      transition: 'box-shadow 300ms ease, transform 200ms ease',
                      opacity: formSubmitting ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!formSubmitting) { e.currentTarget.style.boxShadow = '0 0 32px rgba(235,64,52,0.5)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(235,64,52,0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {formSubmitting ? 'Sending...' : finalCta.button}
                  </button>
                </form>
              )}
            </div>

            {/* Right: contact info */}
            <div style={{ paddingTop: 80 }}>
              <div style={{ ...cardBase, padding: '32px 28px' }}>
                <h3 style={{ color: 'var(--bone)', fontSize: 18, fontWeight: 500, marginBottom: 24 }}>Other ways to reach us</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <a href="mailto:sastha@dolesmusic.com" style={{ color: 'var(--brass)', fontSize: 16, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    sastha@dolesmusic.com
                  </a>

                  <a href="https://wa.me/917259356149" target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '12px 24px', border: '1px solid rgba(37,211,102,0.5)', background: 'rgba(37,211,102,0.08)',
                    color: '#25d366', fontSize: 14, fontWeight: 500, textDecoration: 'none', borderRadius: '9999px',
                    transition: 'background 240ms ease',
                  }}>
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </a>

                  <a href="https://www.instagram.com/dolesmusic_official/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mute)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 200ms ease' }} className="footer-link">
                    <InstagramIcon />
                    @dolesmusic_official
                  </a>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--mute)', fontSize: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Mumbai, India
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <a href="https://www.instagram.com/dolesmusic_official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--mute)', transition: 'color 200ms ease' }} className="footer-link">
                      <InstagramIcon />
                    </a>
                    <a href="https://www.linkedin.com/company/dolesmusic" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--mute)', transition: 'color 200ms ease' }} className="footer-link">
                      <LinkedInIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            11. FOOTER
           ══════════════════════════════════════════════════════ */}
        <footer style={{ borderTop: '1px solid var(--line-brass)', background: 'rgba(10,10,10,0.6)' }}>
          <div className="px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto" style={{ paddingTop: 48, paddingBottom: 40 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10" style={{ marginBottom: 40 }}>
              <div>
                <p className="font-playfair" style={{ color: 'var(--bone)', fontSize: 20, fontWeight: 400, marginBottom: 12 }}>
                  {brandName}
                </p>
                <p className="font-body" style={{ color: 'var(--mute)', fontSize: 13, lineHeight: 1.7 }}>
                  {footerT.tagline}
                </p>
                <div className="flex items-center gap-2" style={{ marginTop: 16 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ color: 'var(--mute)', fontSize: 13 }}>{footerT.location}</span>
                </div>
              </div>

              <div>
                <p style={{ color: 'var(--bone)', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
                  {footerT.contact}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="mailto:sastha@dolesmusic.com" style={{ color: 'var(--mute)', fontSize: 13, textDecoration: 'none', transition: 'color 200ms ease' }} className="footer-link">
                    sastha@dolesmusic.com
                  </a>
                  <a href="https://wa.me/917259356149" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 200ms ease' }}>
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ paddingTop: 20, borderTop: '1px solid var(--line-brass)' }}>
              <p style={{ color: 'var(--mute)', fontSize: 12 }}>
                &copy; {new Date().getFullYear()} {footerT.copyright}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPrivacy(true)}
                  style={{ color: 'var(--mute)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', transition: 'color 200ms ease' }}
                >
                  Privacy Policy
                </button>
                <a href="https://www.instagram.com/dolesmusic_official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--mute)', transition: 'color 200ms ease' }} className="footer-link">
                  <InstagramIcon />
                </a>
                <a href="https://www.linkedin.com/company/dolesmusic" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--mute)', transition: 'color 200ms ease' }} className="footer-link">
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Floating media player ── */}
      {floatingPlayer && (
        <div
          className="floating-media-player"
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(10, 10, 10, 0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(232,28,50,0.25)',
            transform: floatingPlayer ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(232,28,50,0.1)' }}>
            <div style={{ height: '100%', width: `${floatingPlayer.progress}%`, background: 'var(--brass)', transition: 'width 0.3s linear' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 12, maxWidth: 1440, margin: '0 auto' }}>
            <button
              onClick={() => floatingPlayer.onToggle?.()}
              style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                border: '1px solid rgba(232,28,50,0.4)', background: 'rgba(232,28,50,0.08)',
                color: 'var(--brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(232,28,50,0.18)'; (e.currentTarget).style.borderColor = 'rgba(232,28,50,0.6)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = 'rgba(232,28,50,0.08)'; (e.currentTarget).style.borderColor = 'rgba(232,28,50,0.4)'; }}
              aria-label={floatingPlayer.id.startsWith('yt-') ? 'Stop' : (floatingPlayer.isPlaying ? 'Pause' : 'Play')}
            >
              {floatingPlayer.id.startsWith('yt-') ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              ) : floatingPlayer.isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="3" width="5" height="18" rx="1" /><rect x="14" y="3" width="5" height="18" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <p style={{ color: 'var(--bone)', fontSize: 13, fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                {floatingPlayer.title}
              </p>
              <p style={{ color: 'var(--mute)', fontSize: 11, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                {floatingPlayer.artist}
              </p>
            </div>

            {floatingPlayer.id.startsWith('yt-') ? (
              <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--mute)', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000" style={{ flexShrink: 0 }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video
              </span>
            ) : (
              <span style={{ flexShrink: 0, color: 'var(--mute)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                {formatFloatingTime(floatingPlayer.currentTime)} / {formatFloatingTime(floatingPlayer.duration)}
              </span>
            )}

            {floatingPlayer.isPlaying && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16, flexShrink: 0 }} aria-hidden="true">
                {[8, 14, 6, 12, 10].map((h, i) => (
                  <div key={i} className="eq-bar" style={{ width: 2, height: h, background: 'var(--brass)', borderRadius: 1, opacity: 0.7, animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Privacy Policy Modal ── */}
      {showPrivacy && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowPrivacy(false)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', background: '#111', border: '1px solid rgba(39,39,42,0.6)',
              borderRadius: 16, maxWidth: 640, width: '100%', maxHeight: '80vh', overflowY: 'auto', padding: '40px 32px',
            }}
          >
            <button
              onClick={() => setShowPrivacy(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--mute)', cursor: 'pointer', fontSize: 20 }}
              aria-label="Close privacy policy"
            >
              &times;
            </button>
            <h2 style={{ color: 'var(--bone)', fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Privacy Policy</h2>
            <div style={{ color: 'var(--mute)', fontSize: 14, lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>What we collect:</strong> When you use our contact form, we collect your name, email address, and optionally your phone number and project description.</p>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>Why we collect it:</strong> Solely to respond to your inquiry and discuss your project.</p>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>Where it&apos;s stored:</strong> Form submissions are stored in Google Sheets, secured by Google&apos;s infrastructure.</p>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>Analytics:</strong> This site uses Microsoft Clarity and Google Tag Manager to understand how visitors use the site. These tools collect anonymized usage data. No personal information is shared with advertisers.</p>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>Third-party sharing:</strong> We do not sell, trade, or share your personal information with third parties.</p>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>Your rights:</strong> You can request access to, correction of, or deletion of your personal data at any time by emailing us.</p>
              <p style={{ marginBottom: 16 }}><strong style={{ color: 'var(--bone)' }}>Contact for privacy requests:</strong> <a href="mailto:sastha@dolesmusic.com" style={{ color: 'var(--brass)' }}>sastha@dolesmusic.com</a></p>
              <p style={{ marginBottom: 0 }}>This policy is designed to be consistent with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA).</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          GLOBAL STYLES
         ══════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* ── Marquee ── */
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
        }

        /* ── Testimonial arrow hover ── */
        .testimonial-arrow:hover {
          border-color: var(--brass) !important;
          color: var(--brass) !important;
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

        /* ── Card hover glow ── */
        .service-card:hover {
          box-shadow: 0 0 24px rgba(232,28,50,0.12), 0 4px 20px rgba(0,0,0,0.3);
          border-color: rgba(232,28,50,0.25) !important;
        }

        /* ── Service CTA hover ── */
        .service-cta:hover {
          background: var(--brass) !important;
          color: var(--ink) !important;
          box-shadow: 0 0 16px rgba(232,28,50,0.2);
        }
        .service-cta-ghost:hover {
          border-color: var(--brass) !important;
          color: var(--bone) !important;
        }

        /* ── Footer link hover ── */
        .site-scope .footer-link:hover {
          color: var(--bone) !important;
        }

        /* ── Hero CTA focus-visible ── */
        .hero-cta:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 3px;
        }

        /* ── Spinner ── */
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ── Volume slider thumb ── */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px; height: 12px; border-radius: 50%; background: var(--brass); cursor: pointer; border: none; margin-top: -4px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px; height: 12px; border-radius: 50%; background: var(--brass); cursor: pointer; border: none;
        }

        /* ── Scrollbar ── */
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: rgba(232,28,50,0.2); border-radius: 2px; }
        div::-webkit-scrollbar-thumb:hover { background: rgba(232,28,50,0.35); }

        .beats-panel::-webkit-scrollbar { width: 4px; }
        .beats-panel::-webkit-scrollbar-track { background: transparent; }
        .beats-panel::-webkit-scrollbar-thumb { background: rgba(232,28,50,0.2); border-radius: 2px; }
        .beats-panel::-webkit-scrollbar-thumb:hover { background: rgba(232,28,50,0.35); }

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
          border-color: rgba(232,28,50,0.3) !important;
        }

        /* ── Floating media player ── */
        .floating-media-player {
          box-shadow: 0 -4px 24px rgba(0,0,0,0.5);
        }

        /* ── Form placeholder color ── */
        .site-scope input::placeholder,
        .site-scope textarea::placeholder {
          color: rgba(255,255,255,0.35);
        }

        /* Service cards: photo doesn't inflate card height on desktop */
        @media (min-width: 769px) {
          .service-split-card > div:first-child {
            position: relative;
            min-height: 0;
          }
          .service-split-card > div:first-child img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }
        }

        /* ═══ MOBILE (<768px) ═══ */
        @media (max-width: 768px) {
          #hero { min-height: calc(100dvh - var(--nav-h, 80px)) !important; min-height: calc(100vh - var(--nav-h, 80px)) !important; }
          @supports (min-height: 100dvh) {
            #hero { min-height: calc(100dvh - var(--nav-h, 80px)) !important; }
          }
          #beats { padding-top: 48px !important; padding-bottom: 48px !important; }
          #services { padding-top: 64px !important; padding-bottom: 64px !important; }

          /* Beats panel mobile */
          .beats-panel {
            overflow-x: hidden !important;
          }

          /* Beats player mobile tweaks */
          .beats-genre-desktop { display: none !important; }
          .beats-genre-mobile { display: block !important; }
          .beats-volume-ctrl { display: none !important; }
          .beats-track-row { padding: 10px 14px !important; gap: 10px !important; }
          .beats-track-genre-badge { display: none !important; }
          .beats-genre-divider { padding: 8px 14px 4px !important; }
          .beats-now-playing { padding: 10px 14px !important; }

          /* Portfolio grid: 1 col on mobile */
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }

          /* Service cards: hide desktop, show mobile accordion */
          .service-cards-desktop { display: none !important; }
          .service-cards-mobile { display: flex !important; }

          /* Testimonial carousel arrows: inside on mobile */
          .testimonial-arrow {
            display: none !important;
          }
          .testimonial-carousel {
            padding: 0 !important;
          }

          /* Brand trust bar: smaller text */
          .marquee-track span {
            font-size: 11px !important;
            padding: 0 16px !important;
          }

          /* Testimonials section tighter */
          #testimonials {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }

          /* Studio strip smaller */
          .studio-strip { padding: 24px 0 !important; }
          .studio-belt > div { width: 200px !important; min-width: 200px !important; height: 130px !important; }
          .studio-belt { gap: 10px !important; }

          /* How It Works: stack on mobile */
          .hiw-desktop { display: none !important; }
          .hiw-mobile { display: block !important; }

          /* Contact form: stack on mobile */
          .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }

          /* Hero BG adjust */
          #hero img[src*="dolls43"] { object-position: 35% 25% !important; opacity: 0.16 !important; }
          #hero > div[style*="padding"] { padding-top: 36px !important; padding-bottom: 36px !important; }

          /* Footer: pad bottom for floating player */
          footer { padding-bottom: 100px !important; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .studio-belt,
          .eq-bar,
          .hero-cta {
            animation: none !important;
            transition: none !important;
          }
          .hero-waveform path { animation: none; }
        }
      `}</style>
    </div>
  );
}
