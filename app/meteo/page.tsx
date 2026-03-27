'use client'

import { useState, useEffect } from "react";

// ─── SVG Weather Icons (fără Math.cos/sin — coords hardcoded) ─────────────────
const IconSunny = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="9" fill="#c49a3c" opacity="0.95" />
        <line x1="24" y1="7"  x2="24" y2="11" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="37" x2="24" y2="41" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="7"  y1="24" x2="11" y2="24" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="37" y1="24" x2="41" y2="24" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="11.51" y1="11.51" x2="14.34" y2="14.34" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="33.66" y1="33.66" x2="36.49" y2="36.49" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="36.49" y1="11.51" x2="33.66" y2="14.34" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
        <line x1="14.34" y1="33.66" x2="11.51" y2="36.49" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const IconPartlyCloudy = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="19" cy="19" r="7" fill="#f0c84a" opacity="0.9" />
        <line x1="19" y1="8"  x2="19" y2="11" stroke="#f0c84a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="19" y1="27" x2="19" y2="30" stroke="#f0c84a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8"  y1="19" x2="11" y2="19" stroke="#f0c84a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="27" y1="19" x2="30" y2="19" stroke="#f0c84a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="11.51" y1="11.51" x2="13.63" y2="13.63" stroke="#f0c84a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="24.37" y1="24.37" x2="26.49" y2="26.49" stroke="#f0c84a" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="30" cy="32" rx="11" ry="7"   fill="rgba(255,255,255,0.65)" />
        <ellipse cx="21" cy="34" rx="9"  ry="6"   fill="rgba(255,255,255,0.7)" />
        <ellipse cx="33" cy="35" rx="10" ry="6.5" fill="rgba(255,255,255,0.6)" />
        <ellipse cx="27" cy="27" rx="8"  ry="7"   fill="rgba(230,240,255,0.75)" />
    </svg>
);

const IconCloudy = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="26" rx="12" ry="8"   fill="rgba(190,205,220,0.75)" />
        <ellipse cx="14" cy="28" rx="9"  ry="6.5" fill="rgba(190,205,220,0.8)" />
        <ellipse cx="30" cy="29" rx="11" ry="7"   fill="rgba(190,205,220,0.7)" />
        <ellipse cx="22" cy="20" rx="8"  ry="7"   fill="rgba(210,225,235,0.85)" />
        <ellipse cx="30" cy="22" rx="7"  ry="6"   fill="rgba(210,225,235,0.8)" />
    </svg>
);

const IconRainy = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="20" rx="12" ry="8"   fill="rgba(150,170,195,0.75)" />
        <ellipse cx="14" cy="22" rx="9"  ry="6"   fill="rgba(150,170,195,0.8)" />
        <ellipse cx="30" cy="22" rx="11" ry="6.5" fill="rgba(150,170,195,0.7)" />
        <ellipse cx="22" cy="15" rx="8"  ry="6"   fill="rgba(170,188,208,0.85)" />
        <line x1="16" y1="32" x2="20" y2="38" stroke="#7ca0b8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="34" x2="26" y2="40" stroke="#7ca0b8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="28" y1="32" x2="32" y2="38" stroke="#7ca0b8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="19" y1="38" x2="23" y2="44" stroke="#7ca0b8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="25" y1="36" x2="29" y2="42" stroke="#7ca0b8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconStorm = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="18" rx="13" ry="8.5" fill="rgba(100,115,130,0.75)" />
        <ellipse cx="14" cy="20" rx="9"  ry="6"   fill="rgba(100,115,130,0.8)" />
        <ellipse cx="30" cy="20" rx="11" ry="6.5" fill="rgba(100,115,130,0.7)" />
        <ellipse cx="22" cy="13" rx="8"  ry="6"   fill="rgba(120,135,150,0.8)" />
        <polyline points="25,28 20,36 24,36 19,44" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const IconWind = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
);

const IconDroplet = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
);

const IconThermometer = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
);

const IconEye = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconSunrise = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0" />
        <line x1="12" y1="2"  x2="12" y2="9" />
        <line x1="4.22"  y1="10.22" x2="5.64"  y2="11.64" />
        <line x1="1"     y1="18"    x2="3"     y2="18" />
        <line x1="21"    y1="18"    x2="23"    y2="18" />
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
        <line x1="23"    y1="22"    x2="1"     y2="22" />
        <polyline points="8 6 12 2 16 6" />
    </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type WeatherIcon = "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "storm";

interface DayWeather {
    day: string; date: string; icon: WeatherIcon; label: string;
    high: number; low: number; humidity: number; wind: number; precipitation: number;
}
interface TodayWeather extends DayWeather {
    feelsLike: number; visibility: number; sunrise: string; sunset: string; description: string;
}

// ─── Hardcoded Data ───────────────────────────────────────────────────────────
const TODAY: TodayWeather = {
    day: "Vineri", date: "27 Martie 2026", icon: "partly-cloudy", label: "Parțial noros",
    high: 14, low: 4, feelsLike: 11, humidity: 62, wind: 18, precipitation: 15,
    visibility: 12, sunrise: "06:48", sunset: "19:22",
    description: "O zi de primăvară blândă deasupra Cristeștilor. Norii trec ocazional peste soare, dar temperaturile plăcute fac aerul să miroasă a pământ proaspăt și verdeață tânără.",
};

const WEEK: DayWeather[] = [
    { day: "Sâm", date: "28 Mar", icon: "sunny",         label: "Senin",         high: 17, low: 5, humidity: 48, wind: 12, precipitation: 0  },
    { day: "Dum", date: "29 Mar", icon: "sunny",         label: "Însorit",       high: 19, low: 7, humidity: 44, wind: 9,  precipitation: 0  },
    { day: "Lun", date: "30 Mar", icon: "partly-cloudy", label: "Parțial noros", high: 15, low: 6, humidity: 58, wind: 15, precipitation: 10 },
    { day: "Mar", date: "31 Mar", icon: "cloudy",        label: "Noros",         high: 12, low: 5, humidity: 72, wind: 22, precipitation: 30 },
    { day: "Mie", date: "1 Apr",  icon: "rainy",         label: "Ploaie ușoară", high: 9,  low: 3, humidity: 88, wind: 28, precipitation: 75 },
    { day: "Joi", date: "2 Apr",  icon: "rainy",         label: "Ploaie",        high: 8,  low: 2, humidity: 90, wind: 24, precipitation: 85 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function WeatherIconComp({ type, size }: { type: WeatherIcon; size?: number }) {
    switch (type) {
        case "sunny":         return <IconSunny size={size} />;
        case "partly-cloudy": return <IconPartlyCloudy size={size} />;
        case "cloudy":        return <IconCloudy size={size} />;
        case "rainy":         return <IconRainy size={size} />;
        case "storm":         return <IconStorm size={size} />;
    }
}

function tempColor(temp: number): string {
    if (temp >= 18) return "#d4900a";
    if (temp >= 12) return "#4a7a4a";
    if (temp >= 7)  return "#5a8aaa";
    return "#7a9aaa";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MeteoPage() {
    const [scrolled,    setScrolled]    = useState(false);
    const [menuOpen,    setMenuOpen]    = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayWeather | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = [
        { label: "Acasă",      href: "/" },
        { label: "Istorie",    href: "/#despre" },
        { label: "Natură",     href: "/#natura" },
        { label: "Comunitate", href: "/#comunitate" },
        { label: "Evenimente", href: "/#evenimente" },
        { label: "Contact",    href: "/#contact" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:  #f5f0e8;
          --wheat:  #e8d5a3;
          --gold:   #c49a3c;
          --forest: #2d4a2d;
          --sage:   #5a7a5a;
          --sky:    #7ca0b8;
          --dark:   #1a1a1a;
          --text:   #2c2c2c;
          --muted:  #6b6b6b;
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'Jost', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent; backdrop-filter: none;
          opacity: 0; pointer-events: none; transform: translateY(-8px);
        }
        .nav.scrolled {
          background: rgba(245,240,232,0.96); backdrop-filter: blur(14px);
          padding: 0.75rem 2rem; box-shadow: 0 1px 0 rgba(0,0,0,0.08);
          opacity: 1; pointer-events: all; transform: translateY(0);
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 600;
          color: var(--forest); letter-spacing: 0.02em;
        }
        .nav-logo span { color: var(--gold); }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a {
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--forest);
          text-decoration: none; opacity: 0.8; transition: opacity 0.2s;
        }
        .nav-links a:hover { opacity: 1; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { width: 24px; height: 1.5px; background: var(--forest); display: block; }
        .mobile-menu {
          display: none; position: fixed; inset: 0; z-index: 99;
          background: var(--cream); flex-direction: column;
          align-items: center; justify-content: center; gap: 2rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: var(--forest); text-decoration: none; }
        @media (max-width: 768px) { .nav-links { display: none; } .hamburger { display: flex; } }

        /* ─────────────────────────────────────────────────────────
           GRADIENT DE PRIMĂVARĂ
           Sus: albastru-cer clar → verde-mentă proaspăt
           Mijloc: galben-soare cald → piersică ușoară
           Jos: se dizolvă în cremul paginii
        ───────────────────────────────────────────────────────── */
        .weather-hero {
          min-height: 100vh;
          background: linear-gradient(
            168deg,
            #b8dfef 0%,
            #c2e8d0 18%,
            #d8eeaa 36%,
            #f2e27a 54%,
            #f5d080 66%,
            #f5e8c0 82%,
            #f5f0e8 100%
          );
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden; padding: 7rem 2rem 5rem;
        }

        /* nori albi decorativi */
        .weather-hero::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 55% 28% at 12% 18%, rgba(255,255,255,0.5) 0%, transparent 70%),
            radial-gradient(ellipse 38% 18% at 82% 12%, rgba(255,255,255,0.4) 0%, transparent 70%),
            radial-gradient(ellipse 45% 22% at 55% 30%, rgba(255,255,255,0.3) 0%, transparent 70%);
        }

        .weather-hills {
          position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none; z-index: 1;
        }

        .weather-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto; width: 100%;
        }

        /* ── EYEBROW ── */
        .w-eyebrow { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 3rem; }
        .w-eyebrow-line { width: 2rem; height: 1px; background: rgba(45,74,45,0.3); }
        .w-eyebrow span {
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(45,74,45,0.6); font-weight: 500;
        }

        /* ── TODAY CARD ── */
        .today-card {
          background: rgba(255,255,255,0.52);
          border: 1px solid rgba(255,255,255,0.75);
          backdrop-filter: blur(24px);
          border-radius: 6px;
          padding: 3rem;
          display: grid; grid-template-columns: 1fr auto;
          gap: 3rem; margin-bottom: 2rem;
          animation: fadeUp 0.8s ease both;
          box-shadow: 0 8px 40px rgba(45,74,45,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }
        @media (max-width: 700px) { .today-card { grid-template-columns: 1fr; gap: 2rem; padding: 2rem; } }

        .today-date-label {
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--sage); margin-bottom: 0.5rem;
        }
        .today-day-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300; color: var(--forest); line-height: 1; margin-bottom: 0.25rem;
        }
        .today-full-date { font-size: 0.85rem; color: var(--muted); margin-bottom: 2rem; }

        .today-temp-row { display: flex; align-items: flex-end; gap: 1.5rem; margin-bottom: 1.25rem; }
        .today-temp {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(5rem, 10vw, 8rem);
          font-weight: 300; color: var(--forest); line-height: 1; letter-spacing: -0.02em;
        }
        .today-temp-unit { font-size: 2.5rem; color: var(--sage); margin-bottom: 1rem; }
        .today-label { font-size: 1rem; color: var(--forest); margin-bottom: 0.25rem; font-weight: 500; }
        .today-highlow { font-size: 0.8rem; color: var(--muted); letter-spacing: 0.05em; }
        .today-highlow strong { color: var(--forest); }

        .today-desc {
          font-size: 0.9rem; line-height: 1.8; color: var(--muted); max-width: 52ch;
          border-top: 1px solid rgba(45,74,45,0.1); padding-top: 1.5rem;
          margin-top: 0.5rem; font-style: italic;
        }

        .today-right { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
        .today-icon-wrap {
          width: 120px; height: 120px;
          display: flex; align-items: center; justify-content: center;
          animation: floatIcon 5s ease-in-out infinite;
        }
        @keyframes floatIcon { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .today-stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
          background: rgba(45,74,45,0.08); width: 100%;
        }
        .today-stat {
          background: rgba(255,255,255,0.6); padding: 1rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.3rem;
        }
        .today-stat-label {
          font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--sage); display: flex; align-items: center; gap: 0.35rem;
        }
        .today-stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 300; color: var(--forest);
        }

        .sun-strip {
          display: flex; gap: 1.5rem; margin-top: 1.5rem;
          padding: 1.1rem 1.5rem;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(45,74,45,0.1);
          border-radius: 3px;
        }
        .sun-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; color: var(--muted); }
        .sun-item strong { color: var(--forest); font-weight: 500; }
        .sun-divider { width: 1px; background: rgba(45,74,45,0.1); }

        /* ── WEEK GRID ── */
        .week-grid {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 2px; background: rgba(45,74,45,0.08);
          animation: fadeUp 0.8s 0.2s ease both;
        }
        @media (max-width: 900px) { .week-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 500px) { .week-grid { grid-template-columns: repeat(2,1fr); } }

        .day-card {
          background: rgba(255,255,255,0.48);
          backdrop-filter: blur(12px);
          padding: 1.5rem 1rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
          cursor: pointer; transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
          border: 1px solid transparent;
        }
        .day-card:hover {
          background: rgba(255,255,255,0.72);
          border-color: rgba(255,255,255,0.85);
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(45,74,45,0.1);
        }
        .day-card.active {
          background: rgba(196,154,60,0.14);
          border-color: rgba(196,154,60,0.4);
        }

        .day-name { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sage); font-weight: 500; }
        .day-date-small { font-size: 0.72rem; color: var(--muted); }
        .day-icon { margin: 0.25rem 0; }
        .day-label-small { font-size: 0.7rem; color: var(--muted); text-align: center; line-height: 1.3; }
        .day-temps { display: flex; gap: 0.6rem; align-items: baseline; }
        .day-high { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; }
        .day-low { font-size: 0.8rem; color: var(--muted); }
        .day-precip { font-size: 0.68rem; color: var(--sky); display: flex; align-items: center; gap: 0.25rem; }

        /* ── DETAIL PANEL ── */
        .detail-panel {
          margin-top: 2px;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.75);
          padding: 2rem;
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;
          animation: fadeUp 0.35s ease both;
          backdrop-filter: blur(16px);
        }
        @media (max-width: 700px) { .detail-panel { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 400px) { .detail-panel { grid-template-columns: 1fr; } }

        .detail-item { display: flex; flex-direction: column; gap: 0.3rem; }
        .detail-item-label {
          font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--sage); display: flex; align-items: center; gap: 0.35rem;
        }
        .detail-item-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 300; color: var(--forest);
        }

        /* ── FOOTER ── */
        footer { background: var(--dark); color: rgba(255,255,255,0.6); padding: 3rem 2rem 2rem; }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
          gap: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 300; color: #fff; }
        .footer-brand span { color: var(--gold); }
        .footer-tagline { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 0.4rem; }
        .footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--wheat); }
        .footer-bottom {
          max-width: 1200px; margin: 1.5rem auto 0;
          display: flex; flex-wrap: wrap; justify-content: space-between;
          font-size: 0.72rem; color: rgba(255,255,255,0.25);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {/* ── NAV ── */}
            <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
                <div className="nav-logo">Cristești<span>.</span></div>
                <ul className="nav-links">
                    {navLinks.map((l) => (
                        <li key={l.label}><a href={l.href}>{l.label}</a></li>
                    ))}
                </ul>
                <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Meniu">
                    <span /><span /><span />
                </button>
            </nav>

            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <button style={{ position:"absolute", top:"1.5rem", right:"2rem", background:"none", border:"none", fontSize:"2rem", cursor:"pointer", color:"var(--forest)" }} onClick={() => setMenuOpen(false)}>×</button>
                {navLinks.map((l) => <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
            </div>

            {/* ── WEATHER SECTION ── */}
            <section className="weather-hero">

                {/* Dealuri verzi la bază */}
                <svg className="weather-hills" viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,100 C200,55 420,130 620,90 C820,50 1060,120 1240,82 C1330,65 1400,100 1440,88 L1440,160 L0,160 Z" fill="rgba(90,140,90,0.15)" />
                    <path d="M0,120 C260,88 520,145 780,118 C1020,94 1230,138 1440,120 L1440,160 L0,160 Z" fill="rgba(45,100,45,0.18)" />
                    <path d="M0,142 C320,128 640,155 960,144 C1120,138 1300,150 1440,144 L1440,160 L0,160 Z" fill="rgba(245,240,232,0.95)" />
                </svg>

                <div className="weather-inner">

                    <div className="w-eyebrow">
                        <div className="w-eyebrow-line" />
                        <span>Cristești, Nisporeni · Prognoza Meteo</span>
                    </div>

                    {/* ── TODAY CARD ── */}
                    <div className="today-card">
                        <div className="today-left">
                            <div className="today-date-label">Astăzi</div>
                            <div className="today-day-name">{TODAY.day}</div>
                            <div className="today-full-date">{TODAY.date}</div>

                            <div className="today-temp-row">
                                <div className="today-temp">{TODAY.high}</div>
                                <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", paddingBottom:"1rem" }}>
                                    <span className="today-temp-unit">°C</span>
                                </div>
                                <div>
                                    <div className="today-label">{TODAY.label}</div>
                                    <div className="today-highlow">
                                        <strong>↑ {TODAY.high}°</strong>&nbsp; ↓ {TODAY.low}°
                                    </div>
                                    <div className="today-highlow" style={{ marginTop:"0.25rem" }}>
                                        Simte ca <strong>{TODAY.feelsLike}°C</strong>
                                    </div>
                                </div>
                            </div>

                            <p className="today-desc">{TODAY.description}</p>

                            <div className="sun-strip">
                                <div className="sun-item">
                                    <IconSunrise size={15} />
                                    Răsărit <strong>{TODAY.sunrise}</strong>
                                </div>
                                <div className="sun-divider" />
                                <div className="sun-item">
                                    <IconSunrise size={15} />
                                    Apus <strong>{TODAY.sunset}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="today-right">
                            <div className="today-icon-wrap">
                                <WeatherIconComp type={TODAY.icon} size={110} />
                            </div>
                            <div className="today-stats">
                                <div className="today-stat">
                                    <span className="today-stat-label"><IconDroplet />Umiditate</span>
                                    <span className="today-stat-val">{TODAY.humidity}%</span>
                                </div>
                                <div className="today-stat">
                                    <span className="today-stat-label"><IconWind />Vânt</span>
                                    <span className="today-stat-val">{TODAY.wind} km/h</span>
                                </div>
                                <div className="today-stat">
                                    <span className="today-stat-label"><IconDroplet />Precipitații</span>
                                    <span className="today-stat-val">{TODAY.precipitation}%</span>
                                </div>
                                <div className="today-stat">
                                    <span className="today-stat-label"><IconEye />Vizibilitate</span>
                                    <span className="today-stat-val">{TODAY.visibility} km</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── WEEK GRID ── */}
                    <div className="week-grid">
                        {WEEK.map((day, i) => (
                            <div
                                key={i}
                                className={`day-card ${selectedDay?.day === day.day ? "active" : ""}`}
                                onClick={() => setSelectedDay(selectedDay?.day === day.day ? null : day)}
                            >
                                <span className="day-name">{day.day}</span>
                                <span className="day-date-small">{day.date}</span>
                                <div className="day-icon">
                                    <WeatherIconComp type={day.icon} size={38} />
                                </div>
                                <span className="day-label-small">{day.label}</span>
                                <div className="day-temps">
                                    <span className="day-high" style={{ color: tempColor(day.high) }}>{day.high}°</span>
                                    <span className="day-low">{day.low}°</span>
                                </div>
                                {day.precipitation > 0 && (
                                    <span className="day-precip">
                                        <IconDroplet size={11} /> {day.precipitation}%
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── DETAIL PANEL ── */}
                    {selectedDay && (
                        <div className="detail-panel">
                            <div className="detail-item">
                                <span className="detail-item-label"><IconThermometer />Maximă / Minimă</span>
                                <span className="detail-item-val">{selectedDay.high}° / {selectedDay.low}°</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-item-label"><IconDroplet />Umiditate</span>
                                <span className="detail-item-val">{selectedDay.humidity}%</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-item-label"><IconWind />Vânt</span>
                                <span className="detail-item-val">{selectedDay.wind} km/h</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-item-label"><IconDroplet />Precipitații</span>
                                <span className="detail-item-val">{selectedDay.precipitation}%</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-item-label">Condiții</span>
                                <span className="detail-item-val">{selectedDay.label}</span>
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer>
                <div className="footer-inner">
                    <div>
                        <div className="footer-brand">Cristești<span>.</span>md</div>
                        <div className="footer-tagline">Raionul Nisporeni · Republica Moldova</div>
                    </div>
                    <div className="footer-links">
                        <strong style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.7rem", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"0.5rem", display:"block" }}>Navigare</strong>
                        {navLinks.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
                    </div>
                    <div className="footer-links">
                        <strong style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.7rem", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"0.5rem", display:"block" }}>Contact</strong>
                        <a href="mailto:contact@cristesti.md">contact@cristesti.md</a>
                        <a href="#">Primăria Nisporeni</a>
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