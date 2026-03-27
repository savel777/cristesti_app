"use client";

import { useEffect, useRef, useState } from "react";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconSun = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);
const IconLeaf = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);
const IconHome = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const IconMapPin = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const IconUsers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconArrowRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            let start = 0;
            const step = target / 60;
            const timer = setInterval(() => {
              start += step;
              if (start >= target) { setCount(target); clearInterval(timer); }
              else setCount(Math.floor(start));
            }, 16);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Acasă", href: "#" },
    { label: "Istorie", href: "#despre" },
    { label: "Natură", href: "#natura" },
    { label: "Comunitate", href: "#comunitate" },
    { label: "Evenimente", href: "#evenimente" },
    { label: "Contact", href: "#contact" },
  ];

  const features = [
    { icon: <IconLeaf />, title: "Natură curată", desc: "Dealuri verzi, livezi înflorite și aer curat de câmpie moldovenească." },
    { icon: <IconHome />, title: "Tradiții vii", desc: "Obiceiuri transmise din generație în generație, păstrate cu mândrie." },
    { icon: <IconUsers />, title: "Comunitate unită", desc: "Oameni calzi, ospitalieri, gata să te întâmpine cu suflet deschis." },
    { icon: <IconSun />, title: "Viață autentică", desc: "Ritmul blând al satului, departe de agitația orașului." },
  ];

  const events = [
    { date: "24 Jun", month: "2025", title: "Sânzienele — Noaptea Florilor", desc: "Tradiția legării coroanelor din flori de câmp și aprinderea focurilor rituale." },
    { date: "15 Aug", month: "2025", title: "Hramul Satului", desc: "Sărbătoarea patronului spiritual al Cristeștilor, cu muzică live și mese festive." },
    { date: "01 Oct", month: "2025", title: "Festivalul Recoltei", desc: "Expoziție de produse tradiționale: vin, must, legume și dulcețuri de casă." },
  ];

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:   #f5f0e8;
          --wheat:   #e8d5a3;
          --gold:    #c49a3c;
          --forest:  #2d4a2d;
          --sage:    #5a7a5a;
          --earth:   #8b6f47;
          --sky:     #7ca0b8;
          --dark:    #1a1a1a;
          --text:    #2c2c2c;
          --muted:   #6b6b6b;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Jost', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s ease;
        }
        .nav.scrolled {
          background: rgba(245,240,232,0.95);
          backdrop-filter: blur(12px);
          padding: 0.75rem 2rem;
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--forest);
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .nav-logo span { color: var(--gold); }
        .nav-links {
          display: flex; gap: 2rem; list-style: none;
        }
        .nav-links a {
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--forest);
          text-decoration: none; opacity: 0.8;
          transition: opacity 0.2s;
        }
        .nav-links a:hover { opacity: 1; }
        .nav-cta {
          background: var(--forest); color: var(--cream) !important;
          padding: 0.5rem 1.25rem; border-radius: 2px;
          opacity: 1 !important;
        }
        .nav-cta:hover { background: var(--sage); }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { width: 24px; height: 1.5px; background: var(--forest); display: block; transition: all 0.3s; }
        .mobile-menu {
          display: none; position: fixed; inset: 0; z-index: 99;
          background: var(--cream); flex-direction: column;
          align-items: center; justify-content: center; gap: 2rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; color: var(--forest); text-decoration: none;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          background: linear-gradient(
            175deg,
            #2d4a2d 0%, #3d6b3d 25%,
            #5a7a5a 45%, #7ca0b8 70%,
            #c8dce8 85%, #f5f0e8 100%
          );
          display: flex; flex-direction: column;
          justify-content: flex-end; padding-bottom: 8rem;
          position: relative; overflow: hidden;
        }

        /* Rolling hills SVG layer */
        .hero-hills {
          position: absolute; bottom: 0; left: 0; right: 0;
          pointer-events: none;
        }

        /* Grain overlay */
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
        }

        .hero-content {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
          align-items: flex-end;
        }

        .hero-eyebrow {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .hero-eyebrow-line { width: 2.5rem; height: 1px; background: var(--wheat); }
        .hero-eyebrow span {
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--wheat);
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 300; line-height: 1.05;
          color: #fff; letter-spacing: -0.01em;
        }
        .hero-title em {
          font-style: italic; color: var(--wheat);
          display: block;
        }

        .hero-sub {
          margin-top: 2rem;
          font-size: 0.95rem; line-height: 1.8;
          color: rgba(255,255,255,0.75);
          max-width: 30ch;
        }

        .hero-actions {
          display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap;
        }
        .btn-primary {
          background: var(--wheat); color: var(--forest);
          padding: 0.875rem 2rem; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 0.8rem;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
          transition: all 0.3s;
        }
        .btn-primary:hover { background: #fff; transform: translateY(-2px); }
        .btn-ghost {
          background: transparent; color: rgba(255,255,255,0.85);
          padding: 0.875rem 2rem; border: 1px solid rgba(255,255,255,0.35);
          cursor: pointer; font-family: 'Jost', sans-serif;
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none;
          display: inline-flex; align-items: center;
          transition: all 0.3s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.7); color: #fff; }

        /* Right side decorative card */
        .hero-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 2.5rem;
          animation: floatCard 6s ease-in-out infinite;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .hero-card-label {
          font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--wheat); margin-bottom: 1.25rem;
        }
        .hero-stat {
          display: flex; align-items: baseline; gap: 0.5rem;
          margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 1rem;
        }
        .hero-stat:last-of-type { border: none; margin-bottom: 0; padding-bottom: 0; }
        .hero-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.25rem; font-weight: 300; color: #fff;
        }
        .hero-stat-desc {
          font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.4;
        }

        .scroll-hint {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          z-index: 2; display: flex; flex-direction: column; align-items: center;
          gap: 0.5rem; color: rgba(255,255,255,0.5);
          animation: bounce 2.5s ease-in-out infinite;
        }
        .scroll-hint span { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; }
        @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

        @media (max-width: 768px) {
          .hero-content { grid-template-columns: 1fr; }
          .hero-card { display: none; }
        }

        /* ── STRIP ── */
        .location-strip {
          background: var(--forest); color: var(--wheat);
          padding: 1rem 2rem;
          display: flex; justify-content: center; align-items: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .location-item {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .location-item svg { opacity: 0.7; }

        /* ── SECTIONS ── */
        .section { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; }
        .section-full { padding: 6rem 0; }

        .section-eyebrow {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;
        }
        .eyebrow-line { width: 2rem; height: 1px; background: var(--gold); }
        .eyebrow-text {
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); font-weight: 500;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 300; line-height: 1.15;
          color: var(--forest);
        }
        .section-title em { font-style: italic; color: var(--sage); }

        /* ── FEATURES ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin-top: 4rem; background: var(--wheat);
        }
        @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .features-grid { grid-template-columns: 1fr; } }

        .feature-card {
          background: var(--cream); padding: 2.5rem 2rem;
          transition: all 0.3s;
        }
        .feature-card:hover { background: var(--forest); color: #fff; }
        .feature-card:hover .feature-icon { background: rgba(255,255,255,0.15); color: var(--wheat); }
        .feature-card:hover .feature-title { color: var(--wheat); }
        .feature-card:hover .feature-desc { color: rgba(255,255,255,0.7); }

        .feature-icon {
          width: 2.5rem; height: 2.5rem; background: var(--wheat);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem; color: var(--forest); transition: all 0.3s;
        }
        .feature-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 600; color: var(--forest);
          margin-bottom: 0.75rem; transition: color 0.3s;
        }
        .feature-desc {
          font-size: 0.88rem; line-height: 1.7; color: var(--muted);
          transition: color 0.3s;
        }

        /* ── STATS BAND ── */
        .stats-band {
          background: var(--forest);
          padding: 4rem 2rem;
        }
        .stats-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 1px; background: rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) { .stats-inner { grid-template-columns: repeat(2,1fr); } }

        .stat-item {
          background: var(--forest);
          padding: 3rem 2rem; text-align: center;
        }
        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem; font-weight: 300; color: var(--wheat);
          display: block; line-height: 1;
        }
        .stat-label {
          font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-top: 0.75rem; display: block;
        }

        /* ── NATURA ── */
        .natura-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center; margin-top: 1rem;
        }
        @media (max-width: 768px) { .natura-grid { grid-template-columns: 1fr; } }

        .natura-text p {
          font-size: 1rem; line-height: 1.9; color: var(--muted);
          margin-bottom: 1.25rem;
        }
        .natura-text p strong { color: var(--forest); font-weight: 500; }

        .natura-visual {
          position: relative; height: 480px;
        }
        .natura-bg-card {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #2d4a2d 0%, #5a7a5a 50%, #7ca0b8 100%);
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .natura-bg-card::after {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cellipse cx='200' cy='320' rx='250' ry='120' fill='rgba(45,74,45,0.6)'/%3E%3Cellipse cx='80' cy='380' rx='180' ry='100' fill='rgba(45,74,45,0.7)'/%3E%3Cellipse cx='340' cy='360' rx='160' ry='90' fill='rgba(45,74,45,0.5)'/%3E%3C/svg%3E") center / cover;
        }
        .natura-scenery {
          position: relative; z-index: 1; text-align: center;
          padding: 2rem;
        }
        .natura-scenery-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 300; color: rgba(255,255,255,0.9);
          letter-spacing: 0.05em;
        }
        .natura-tag {
          display: inline-block; padding: 0.4rem 1rem;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 2rem; font-size: 0.72rem; color: var(--wheat);
          letter-spacing: 0.1em; text-transform: uppercase; margin: 0.25rem;
        }
        .natura-accent {
          position: absolute; top: -1.5rem; right: -1.5rem; width: 5rem; height: 5rem;
          background: var(--gold); border-radius: 50%; opacity: 0.15;
        }
        .natura-accent2 {
          position: absolute; bottom: -2rem; left: -2rem; width: 8rem; height: 8rem;
          border: 2px solid var(--sage); border-radius: 50%; opacity: 0.25;
        }

        /* ── EVENTS ── */
        .events-section { background: #f0ece0; padding: 6rem 2rem; }
        .events-inner { max-width: 1200px; margin: 0 auto; }
        .events-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1.5rem; margin-top: 3rem;
        }
        @media (max-width: 768px) { .events-grid { grid-template-columns: 1fr; } }

        .event-card {
          background: var(--cream); padding: 2rem;
          border-top: 3px solid var(--gold);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .event-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
        .event-date-block {
          display: flex; align-items: baseline; gap: 0.4rem;
          margin-bottom: 1.25rem;
        }
        .event-day {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem; font-weight: 300; color: var(--gold); line-height: 1;
        }
        .event-month-year {
          font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted);
        }
        .event-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 600; color: var(--forest);
          margin-bottom: 0.75rem; line-height: 1.3;
        }
        .event-desc { font-size: 0.85rem; line-height: 1.7; color: var(--muted); }
        .event-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          margin-top: 1.25rem; font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--forest); text-decoration: none;
          border-bottom: 1px solid var(--gold); padding-bottom: 2px;
          transition: gap 0.2s;
        }
        .event-link:hover { gap: 0.7rem; }

        /* ── QUOTE ── */
        .quote-section {
          background: var(--forest); padding: 6rem 2rem; text-align: center;
        }
        .quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 6rem; font-weight: 300;
          color: var(--gold); opacity: 0.4;
          line-height: 0.5; display: block; margin-bottom: 1.5rem;
        }
        .quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 300; font-style: italic;
          color: rgba(255,255,255,0.92); max-width: 700px;
          margin: 0 auto 2rem; line-height: 1.5;
        }
        .quote-author {
          font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--wheat); opacity: 0.7;
        }

        /* ── FOOTER ── */
        footer {
          background: var(--dark); color: rgba(255,255,255,0.6);
          padding: 3rem 2rem 2rem;
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; flex-wrap: wrap;
          justify-content: space-between; align-items: flex-start;
          gap: 2rem; padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem; font-weight: 300; color: #fff;
        }
        .footer-brand span { color: var(--gold); }
        .footer-tagline { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 0.4rem; }
        .footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .footer-links a {
          font-size: 0.82rem; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--wheat); }
        .footer-bottom {
          max-width: 1200px; margin: 1.5rem auto 0;
          display: flex; flex-wrap: wrap;
          justify-content: space-between;
          font-size: 0.72rem; color: rgba(255,255,255,0.25);
        }

        /* ── FADE IN ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
        .delay-4 { animation-delay: 0.6s; }
      `}</style>

        {/* ── NAV ── */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-logo">Cristești<span>.</span></div>
          <ul className="nav-links">
            {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={l.label === "Contact" ? "nav-cta" : ""}>{l.label}</a>
                </li>
            ))}
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Meniu">
            <span /><span /><span />
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <button style={{ position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "var(--forest)" }} onClick={() => setMenuOpen(false)}>×</button>
          {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
        </div>

        {/* ── HERO ── */}
        <section className="hero" id="#">
          {/* Rolling hills */}
          <svg className="hero-hills" viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,160 C180,100 360,200 540,150 C720,100 900,190 1080,140 C1260,90 1350,160 1440,140 L1440,220 L0,220 Z" fill="rgba(245,240,232,0.15)" />
            <path d="M0,180 C200,130 400,200 600,165 C800,130 1000,195 1200,160 C1300,145 1380,175 1440,160 L1440,220 L0,220 Z" fill="rgba(245,240,232,0.25)" />
            <path d="M0,200 C240,170 480,210 720,190 C960,170 1200,205 1440,188 L1440,220 L0,220 Z" fill="#f5f0e8" />
          </svg>

          <div className="hero-content">
            <div>
              <div className="hero-eyebrow fade-up">
                <div className="hero-eyebrow-line" />
                <span>Raionul Nisporeni · Republica Moldova</span>
              </div>
              <h1 className="hero-title fade-up delay-1">
                Bine ai venit în
                <em>Cristești</em>
              </h1>
              <p className="hero-sub fade-up delay-2">
                Un sat cu suflet mare, ascuns printre dealurile verzi ale Moldovei.
                Locul unde timpul curge mai blând și tradițiile rămân vii.
              </p>
              <div className="hero-actions fade-up delay-3">
                <a href="#despre" className="btn-primary">
                  Descoperă <IconArrowRight />
                </a>
                <a href="#contact" className="btn-ghost">Contact</a>
              </div>
            </div>

            <div className="fade-up delay-4">
              <div className="hero-card">
                <div className="hero-card-label">Cristești în cifre</div>
                <div className="hero-stat">
                  <span className="hero-stat-num">~400</span>
                  <div className="hero-stat-desc">locuitori care numesc<br />Cristeștii acasă</div>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-num">XVIII</span>
                  <div className="hero-stat-desc">secol — atestare<br />documentară</div>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-num">12 km</span>
                  <div className="hero-stat-desc">față de centrul<br />raionului Nisporeni</div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-hint">
            <span>Derulează</span>
            <IconChevronDown />
          </div>
        </section>

        {/* ── LOCATION STRIP ── */}
        <div className="location-strip">
          {[
            { icon: <IconMapPin />, text: "Raionul Nisporeni, Moldova" },
            { icon: <IconLeaf />, text: "Sat pitoresc în centrul Moldovei" },
            { icon: <IconSun />, text: "Climat temperat continental" },
            { icon: <IconHome />, text: "Tradiții și ospitalitate" },
          ].map((item, i) => (
              <div className="location-item" key={i}>{item.icon}<span>{item.text}</span></div>
          ))}
        </div>

        {/* ── DESPRE ── */}
        <div id="despre">
          <div className="section">
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Povestea noastră</span>
            </div>
            <h2 className="section-title">Un sat cu rădăcini<br /><em>adânci în pământ moldav</em></h2>

            <div className="features-grid" style={{ marginTop: "3.5rem" }}>
              {features.map((f, i) => (
                  <div className="feature-card" key={i}>
                    <div className="feature-icon">{f.icon}</div>
                    <div className="feature-title">{f.title}</div>
                    <p className="feature-desc">{f.desc}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS BAND ── */}
        <div className="stats-band">
          <div className="stats-inner">
            {[
              { num: 400, suf: "+", label: "Locuitori" },
              { num: 300, suf: "+", label: "Ani de istorie" },
              { num: 12, suf: " km", label: "Până la Nisporeni" },
              { num: 3, suf: "", label: "Festivale anuale" },
            ].map((s, i) => (
                <div className="stat-item" key={i}>
                  <span className="stat-number"><Counter target={s.num} suffix={s.suf} /></span>
                  <span className="stat-label">{s.label}</span>
                </div>
            ))}
          </div>
        </div>

        {/* ── NATURĂ ── */}
        <div id="natura">
          <div className="section">
            <div className="natura-grid">
              <div className="natura-text">
                <div className="section-eyebrow">
                  <div className="eyebrow-line" />
                  <span className="eyebrow-text">Peisaj & Natură</span>
                </div>
                <h2 className="section-title" style={{ marginBottom: "2rem" }}>
                  Frumusețea<br /><em>neîntrecută a locului</em>
                </h2>
                <p>Cristeștii se cuibărește pe <strong>dealurile blânde</strong> ale raionului Nisporeni, înconjurat de păduri de stejar, livezi roditoare și câmpuri de floarea-soarelui care îngălbenesc vara.</p>
                <p>Aerul curat, peisajele nealterate și liniștea apăsătoare a naturii fac din sat un colț de rai pentru cei care caută <strong>autenticul vieții de la țară</strong>.</p>
                <p>Primăvara, dealurile se îmbracă în alb și roz când livezile înfloresc. Toamna, viile oferă struguri bogați, iar aerul miroase a must și pâine coaptă.</p>
                <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {["Păduri de stejar", "Livezi", "Dealuri line", "Vii tradiționale", "Izlaz communal"].map(tag => (
                      <span key={tag} style={{ padding: "0.4rem 1rem", background: "var(--wheat)", borderRadius: "2rem", fontSize: "0.78rem", color: "var(--forest)", fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="natura-visual">
                <div className="natura-bg-card">
                  <div className="natura-scenery">
                    <div style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
                      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" width="180">
                        {/* Sun */}
                        <circle cx="95" cy="15" r="10" fill="#e8d5a3" opacity="0.9" />
                        {/* Mountains/hills */}
                        <ellipse cx="30" cy="70" rx="40" ry="25" fill="#2d4a2d" opacity="0.8" />
                        <ellipse cx="80" cy="65" rx="50" ry="22" fill="#3d6b3d" opacity="0.7" />
                        <ellipse cx="60" cy="75" rx="70" ry="18" fill="#2d4a2d" opacity="0.9" />
                        {/* Church */}
                        <rect x="52" y="42" width="10" height="18" fill="rgba(255,255,255,0.6)" />
                        <polygon points="57,32 48,42 66,42" fill="rgba(255,255,255,0.7)" />
                        <rect x="55" y="28" width="4" height="6" fill="rgba(255,255,255,0.8)" />
                        {/* Trees */}
                        <polygon points="15,55 20,40 25,55" fill="#2d4a2d" />
                        <polygon points="100,58 106,43 112,58" fill="#2d4a2d" />
                        {/* Sky gradient */}
                        <ellipse cx="57" cy="20" rx="60" ry="15" fill="#7ca0b8" opacity="0.15" />
                      </svg>
                    </div>
                    <div className="natura-scenery-title">Cristești, Nisporeni</div>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", letterSpacing: "0.1em", marginTop: "0.5rem", textTransform: "uppercase" }}>Moldova · Inima Țării</p>
                    <div style={{ marginTop: "1.5rem" }}>
                      {["Altitudine ~200m", "Climă temperat-continentală", "Vegetație de deal"].map(t => (
                          <span key={t} className="natura-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="natura-accent" />
                <div className="natura-accent2" />
              </div>
            </div>
          </div>
        </div>

        {/* ── QUOTE ── */}
        <div className="quote-section" id="comunitate">
          <span className="quote-mark">"</span>
          <p className="quote-text">
            Oriunde ai merge în lume, Cristeștii rămâne în inima ta — în mirosul fânului proaspăt cosit, în glasul clopotelor de duminică și în zâmbetul cald al vecinilor.
          </p>
          <span className="quote-author">— Glasul satului</span>
        </div>

        {/* ── EVENTS ── */}
        <div className="events-section" id="evenimente">
          <div className="events-inner">
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Calendar Cultural</span>
            </div>
            <h2 className="section-title">Evenimente &<br /><em>sărbători ale anului</em></h2>

            <div className="events-grid">
              {events.map((ev, i) => (
                  <div className="event-card" key={i}>
                    <div className="event-date-block">
                      <span className="event-day">{ev.date}</span>
                      <span className="event-month-year">{ev.month}</span>
                    </div>
                    <div className="event-title">{ev.title}</div>
                    <p className="event-desc">{ev.desc}</p>
                    <a href="#" className="event-link">Detalii <IconArrowRight /></a>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div id="contact">
          <div className="section" style={{ textAlign: "center" }}>
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Ia legătura cu noi</span>
              <div className="eyebrow-line" />
            </div>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>Ești mereu<br /><em>binevenit acasă</em></h2>
            <p style={{ color: "var(--muted)", maxWidth: "40ch", margin: "0 auto 2.5rem", lineHeight: 1.8, fontSize: "0.95rem" }}>
              Ai întrebări despre sat, vrei să contribui cu informații sau să te implici în comunitate? Scrie-ne!
            </p>
            <a href="mailto:contact@cristesti.md" className="btn-primary" style={{ display: "inline-flex" }}>
              Scrie-ne un mesaj <IconArrowRight />
            </a>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-inner">
            <div>
              <div className="footer-brand">Cristești<span>.</span>md</div>
              <div className="footer-tagline">Raionul Nisporeni · Republica Moldova</div>
            </div>
            <div className="footer-links">
              <strong style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>Navigare</strong>
              {navLinks.slice(0, -1).map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
            </div>
            <div className="footer-links">
              <strong style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>Contact</strong>
              <a href="mailto:contact@cristesti.md">contact@cristesti.md</a>
              <a href="#">Primăria Nisporeni</a>
              <a href="#">Facebook</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Cristești, Raionul Nisporeni</span>
            <span>Făcut cu ❤ pentru comunitate</span>
          </div>
        </footer>
      </>
  );
}