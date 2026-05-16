'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDubaiLang } from './DubaiLanguageContext';
import { nav, pick, brand } from './translations';
import type { Lang } from './translations';

/* ─────────────────────────────────────────────────────────
   Dubai Navbar
   Luxury editorial nav — brass + ink palette, zero gradients,
   zero glow, sharp corners, clean 2-line hamburger.
   RTL-aware with AR/EN language toggle.
   ───────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { key: 'services' as const, href: '#services' },
  { key: 'portfolio' as const, href: '#portfolio' },
  { key: 'about' as const, href: '#about' },
];

const SCROLL_THRESHOLD = 24;

/* ── Monogram SVG (decorative) ── */
const Monogram = () => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ color: 'var(--brass)' }}
  >
    <rect x="0" y="6" width="2.5" height="4" rx="1" fill="currentColor" />
    <rect x="5" y="2" width="2.5" height="12" rx="1" fill="currentColor" />
    <rect x="10" y="0" width="2.5" height="16" rx="1" fill="currentColor" />
    <rect x="15" y="4" width="2.5" height="8" rx="1" fill="currentColor" />
  </svg>
);

/* ── Hamburger SVG — clean 2-line, 18px wide, 1.5px stroke ── */
const HamburgerIcon = () => (
  <svg
    width="18"
    height="12"
    viewBox="0 0 18 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="0" y1="0.75" x2="18" y2="0.75" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="0" y1="11.25" x2="18" y2="11.25" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── Close icon for mobile menu ── */
const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="1" y1="1" x2="17" y2="17" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17" y1="1" x2="1" y2="17" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function DubaiNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, isArabic } = useDubaiLang();

  /* ── Scroll listener ── */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLangToggle = (l: Lang) => {
    setLang(l);
  };

  const navLabelMap: Record<string, { en: string; ar: string }> = {
    services: nav.services,
    portfolio: nav.portfolio,
    about: nav.about,
  };

  return (
    <>
      {/* ── Skip to main content (accessibility) ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        style={{
          background: 'var(--brass)',
          color: 'var(--ink)',
          outline: '2px solid var(--brass)',
          outlineOffset: '3px',
        }}
      >
        {pick(nav.skipToMain, lang)}
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 'var(--nav-h, 80px)',
          background: scrolled ? 'var(--ink-scroll)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--line-brass)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background-color 300ms cubic-bezier(0.25, 1, 0.5, 1), border-color 300ms cubic-bezier(0.25, 1, 0.5, 1), backdrop-filter 300ms cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <div className="flex items-center justify-between h-full px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">

          {/* ═══ LEFT — Logo block ═══ */}
          <Link href="/" className="flex items-center gap-3 group" style={{ gap: '12px' }}>
            <Monogram />
            <span
              className={isArabic ? 'text-lg md:text-xl' : 'font-playfair text-lg md:text-xl tracking-tight'}
              style={{ color: 'var(--bone)', fontWeight: 400, fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : undefined }}
            >
              {isArabic ? pick(brand.name, lang) : (<>Dole<span style={{ color: 'var(--brass)' }}>&apos;</span>s Music</>)}
            </span>
          </Link>

          {/* ═══ CENTER — Desktop nav links ═══ */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  color: 'var(--mute)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: isArabic ? '0' : '0.05em',
                  textTransform: isArabic ? 'none' as const : 'uppercase' as const,
                  textDecoration: 'none',
                  transition: 'color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                  fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : 'inherit',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--bone)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--mute)';
                }}
              >
                {pick(navLabelMap[link.key], lang)}
              </a>
            ))}
          </div>

          {/* ═══ RIGHT — Lang toggle + CTA (desktop) ═══ */}
          <div className="hidden md:flex items-center gap-6">
            {/* AR/EN toggle — text-only, no pill */}
            <div className="flex items-center" role="group" aria-label="Language">
              <button
                className={lang === 'en' ? 'lang-active' : 'lang-inactive'}
                aria-pressed={lang === 'en'}
                onClick={() => handleLangToggle('en')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  color: lang === 'en' ? 'var(--bone)' : 'var(--mute)',
                  cursor: lang === 'en' ? 'default' : 'pointer',
                  transition: 'color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (lang !== 'en') {
                    (e.currentTarget as HTMLElement).style.color = 'var(--bone)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (lang !== 'en') {
                    (e.currentTarget as HTMLElement).style.color = 'var(--mute)';
                  }
                }}
              >
                EN
              </button>
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--mute)',
                  padding: '0 6px',
                  fontSize: '12px',
                  userSelect: 'none',
                }}
              >
                &middot;
              </span>
              <button
                className={lang === 'ar' ? 'lang-active' : 'lang-inactive'}
                aria-pressed={lang === 'ar'}
                onClick={() => handleLangToggle('ar')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  color: lang === 'ar' ? 'var(--bone)' : 'var(--mute)',
                  cursor: lang === 'ar' ? 'default' : 'pointer',
                  transition: 'color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (lang !== 'ar') {
                    (e.currentTarget as HTMLElement).style.color = 'var(--bone)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (lang !== 'ar') {
                    (e.currentTarget as HTMLElement).style.color = 'var(--mute)';
                  }
                }}
              >
                {'\u0639\u0631'}
              </button>
            </div>

            {/* CTA — outlined brass, sharp corners, zero gradient, zero glow */}
            <a
              href="#services"
              className="cta-nav"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                border: '1px solid var(--brass)',
                background: 'transparent',
                color: 'var(--brass)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: isArabic ? '0' : '0.05em',
                textTransform: isArabic ? 'none' as const : 'uppercase' as const,
                textDecoration: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'background-color 240ms cubic-bezier(0.25, 1, 0.5, 1), color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : 'inherit',
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
              onFocus={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.outline = '2px solid var(--brass)';
                el.style.outlineOffset = '3px';
              }}
              onBlur={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.outline = 'none';
              }}
            >
              {pick(nav.bookSession, lang)}
            </a>
          </div>

          {/* ═══ LANG TOGGLE + HAMBURGER — Mobile only ═══ */}
          <div className="flex md:hidden items-center gap-3">
            {/* Compact EN/AR toggle outside hamburger */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              style={{
                background: 'none',
                border: '1px solid var(--line-brass)',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: 'var(--brass)',
                cursor: 'pointer',
                borderRadius: 0,
                lineHeight: 1,
                transition: 'border-color 240ms ease',
              }}
            >
              {lang === 'en' ? '\u0639\u0631' : 'EN'}
            </button>

            <button
              className="flex items-center justify-center w-11 h-11"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          MOBILE MENU OVERLAY
         ═══════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(10, 10, 10, 0.92)' }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu panel */}
          <div
            className="relative flex flex-col h-full"
            style={{ background: 'var(--ink)' }}
          >
            {/* Mobile menu header */}
            <div
              className="flex items-center justify-between px-6"
              style={{ height: '64px' }}
            >
              <Link
                href="/"
                className="flex items-center"
                style={{ gap: '12px' }}
                onClick={() => setMobileOpen(false)}
              >
                <Monogram />
                <span
                  className={isArabic ? 'text-lg' : 'font-playfair text-lg tracking-tight'}
                  style={{ color: 'var(--bone)', fontWeight: 400, fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : undefined }}
                >
                  {isArabic ? pick(brand.name, lang) : (<>Dole<span style={{ color: 'var(--brass)' }}>&apos;</span>s Music</>)}
                </span>
              </Link>

              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-11 h-11"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Separator */}
            <div style={{ height: '1px', background: 'var(--line-brass)', margin: '0 24px' }} />

            {/* Nav links */}
            <div className="flex flex-col gap-1 px-6 pt-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="nav-link"
                  style={{
                    color: 'var(--mute)',
                    fontSize: '16px',
                    fontWeight: 500,
                    letterSpacing: isArabic ? '0' : '0.05em',
                    textTransform: isArabic ? 'none' as const : 'uppercase' as const,
                    textDecoration: 'none',
                    padding: '14px 0',
                    display: 'block',
                    transition: 'color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                    borderBottom: '1px solid var(--line-brass)',
                    textAlign: isArabic ? 'right' : 'left',
                    fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : 'inherit',
                  }}
                >
                  {pick(navLabelMap[link.key], lang)}
                </a>
              ))}
            </div>

            {/* AR/EN toggle in mobile menu */}
            <div className="px-6 pt-8">
              <div className="flex items-center" role="group" aria-label="Language">
                <button
                  aria-pressed={lang === 'en'}
                  onClick={() => handleLangToggle('en')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '14px',
                    letterSpacing: '0.05em',
                    color: lang === 'en' ? 'var(--bone)' : 'var(--mute)',
                    cursor: lang === 'en' ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  EN
                </button>
                <span
                  aria-hidden="true"
                  style={{
                    color: 'var(--mute)',
                    padding: '0 6px',
                    fontSize: '14px',
                    userSelect: 'none',
                  }}
                >
                  &middot;
                </span>
                <button
                  aria-pressed={lang === 'ar'}
                  onClick={() => handleLangToggle('ar')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '14px',
                    letterSpacing: '0.05em',
                    color: lang === 'ar' ? 'var(--bone)' : 'var(--mute)',
                    cursor: lang === 'ar' ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {'\u0639\u0631'}
                </button>
              </div>
            </div>

            {/* CTA — full-width in mobile, same brass outline style */}
            <div className="px-6 pt-8 mt-auto pb-8">
              <a
                href="#services"
                className="cta-nav"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '14px 20px',
                  border: '1px solid var(--brass)',
                  background: 'transparent',
                  color: 'var(--brass)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: isArabic ? '0' : '0.05em',
                  textTransform: isArabic ? 'none' as const : 'uppercase' as const,
                  textDecoration: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  transition: 'background-color 240ms cubic-bezier(0.25, 1, 0.5, 1), color 240ms cubic-bezier(0.25, 1, 0.5, 1)',
                  fontFamily: isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : 'inherit',
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
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Global focus-visible style for Dubai nav ── */}
      <style jsx global>{`
        /* Focus-visible for all interactive elements inside dubai nav scope */
        .dubai-scope a:focus-visible,
        .dubai-scope button:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 3px;
        }

        /* CSS custom prop for nav height responsive */
        @media (max-width: 768px) {
          :root { --nav-h: 64px; }
        }
        @media (min-width: 769px) {
          :root { --nav-h: 80px; }
        }
      `}</style>
    </>
  );
}
