'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { nav } from './translations';

const NAV_LINKS = [
  { label: nav.services, href: '#services' },
  { label: nav.portfolio, href: '#portfolio' },
  { label: 'Beats Library', href: '#beats' },
];

const SCROLL_THRESHOLD = 24;

const HamburgerIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="0" y1="1" x2="20" y2="1" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="0" y1="7" x2="20" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="0" y1="13" x2="20" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="1" y1="1" x2="17" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="1" x2="1" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        style={{ background: '#e81c32', color: '#fff', borderRadius: '9999px' }}
      >
        {nav.skipToMain}
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50"
        style={{ padding: scrolled ? '8px 16px' : '16px 16px', transition: 'padding 300ms ease' }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8"
          style={{
            height: '56px',
            background: scrolled ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: scrolled
              ? '0 12px 40px rgba(0,0,0,0.5), 0 28px 60px rgba(0,0,0,0.3), 0 0 60px rgba(235,64,52,0.06), 0 0 0 1px rgba(255,255,255,0.06)'
              : 'none',
            transition: 'background 300ms ease, box-shadow 300ms ease',
          }}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-playfair text-lg md:text-xl tracking-tight" style={{ color: '#fff', fontWeight: 600 }}>
              Dole<span style={{ color: '#e81c32' }}>&apos;</span>s Music
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'color 300ms ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <a
              href="#contact-form"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '8px 20px',
                background: 'linear-gradient(to right, #9a0018, #d41124)',
                color: '#fff',
                fontSize: '13px', fontWeight: 600, letterSpacing: '0.03em',
                textDecoration: 'none',
                borderRadius: '9999px',
                border: 'none',
                boxShadow: '0 0 24px rgba(235,64,52,0.4)',
                transition: 'box-shadow 300ms ease, transform 200ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 0 32px rgba(235,64,52,0.5)';
                el.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 0 24px rgba(235,64,52,0.4)';
                el.style.transform = 'scale(1)';
              }}
            >
              {nav.cta}
            </a>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button
              className="flex items-center justify-center w-11 h-11"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '12px', cursor: 'pointer',
              }}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col h-full" style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
            <div className="flex items-center justify-between px-6" style={{ height: '64px' }}>
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <span className="font-playfair text-lg tracking-tight" style={{ color: '#fff', fontWeight: 600 }}>
                  Dole<span style={{ color: '#e81c32' }}>&apos;</span>s Music
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-11 h-11"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.10)', margin: '0 24px' }} />

            <div className="flex flex-col gap-1 px-6 pt-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: 'rgba(255,255,255,0.7)', fontSize: '18px', fontWeight: 500,
                    textDecoration: 'none', padding: '14px 0', display: 'block',
                    transition: 'color 300ms ease',
                    borderBottom: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="px-6 pt-8 mt-auto pb-8">
              <a
                href="#contact-form"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '14px 20px',
                  background: 'linear-gradient(to right, #9a0018, #d41124)',
                  color: '#fff', fontSize: '15px', fontWeight: 600,
                  textDecoration: 'none', borderRadius: '9999px',
                  boxShadow: '0 0 24px rgba(235,64,52,0.4)',
                }}
              >
                {nav.cta}
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
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
