'use client'

import { useState, useEffect } from "react";

type WeatherData = {
    location: {
        lat: number;
        lon: number;
        elevation?: number;
    };
    current: {
        time: string;
        temperature_2m: number;
        rain: number;
        is_day: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        wind_speed_10m: number;
    };
    daily: {
        sunrise: string[];
        sunset: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
    };
};

// ─── SVG Weather Icons ────────────────────────────────────────────────────────
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
    const [weatherApi, setWeatherApi] = useState<WeatherData | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayWeather | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWeatherData = async () => {
            try {
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                const res = await fetch(`${baseUrl}/api/meteo`);
                if (!res.ok) throw new Error(`Eroare HTTP! Status: ${res.status}`);
                const jsonData = await res.json();
                setWeatherApi(jsonData);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        getWeatherData();

        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#f5f0e8',
                fontFamily: "'Jost', sans-serif",
                flexDirection: 'column',
                gap: '1rem',
            }}>
                <div style={{
                    width: 48,
                    height: 48,
                    border: '2px solid rgba(196,154,60,0.2)',
                    borderTop: '2px solid #c49a3c',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#5a7a5a', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Se încarcă datele meteo…
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const today = new Date();
    const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

    const TODAY: TodayWeather = {
        day: dayNames[today.getDay()],
        date: new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(today),
        icon: "sunny",
        label: "Vreme frumoasă",
        description: "Cer mai mult senin.",
        high: weatherApi ? Math.round(weatherApi.current.temperature_2m) : 0,
        low: 0,
        feelsLike: weatherApi ? Math.round(weatherApi.current.apparent_temperature) : 0,
        humidity: weatherApi ? weatherApi.current.relative_humidity_2m : 0,
        wind: weatherApi ? Math.round(weatherApi.current.wind_speed_10m) : 0,
        precipitation: weatherApi?.daily?.precipitation_probability_max?.[0] ?? 0,
        visibility: 10,
        sunrise: weatherApi && weatherApi.daily.sunrise[0]
            ? weatherApi.daily.sunrise[0].includes('T')
                ? weatherApi.daily.sunrise[0].split('T')[1].slice(0, 5)
                : new Date(weatherApi.daily.sunrise[0]).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
            : "--:--",
        sunset: weatherApi && weatherApi.daily.sunset[0]
            ? weatherApi.daily.sunset[0].includes('T')
                ? weatherApi.daily.sunset[0].split('T')[1].slice(0, 5)
                : new Date(weatherApi.daily.sunset[0]).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
            : "--:--",
    };

    const WEEK: DayWeather[] = [];
    for (let i = 1; i <= 5; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const dayIndex = futureDate.getDay();
        const rawHigh = weatherApi?.daily?.temperature_2m_max?.[i] ?? 0;
        const rawLow  = weatherApi?.daily?.temperature_2m_min?.[i] ?? 0;
        WEEK.push({
            day: dayNames[dayIndex],
            date: futureDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }),
            icon: "cloudy",
            label: "",
            high: Math.round(rawHigh),
            low: Math.round(rawLow),
            humidity: 100,
            wind: 0,
            precipitation: weatherApi ? weatherApi.daily.precipitation_probability_max[i] : 0,
        });
    }

    const navLinks = [
        { label: "Acasă",      href: "/" },
        { label: "Harta", href: "/harta" },
        { label: "Contacte",    href: "/contact" },
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

        /* Hamburger */
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
          z-index: 101;
        }
        .hamburger span {
          width: 24px; height: 1.5px;
          background: var(--forest); display: block;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .hamburger.is-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.is-open span:nth-child(2) { opacity: 0; }
        .hamburger.is-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile overlay menu */
        .mobile-menu {
          display: none;
          position: fixed; inset: 0; z-index: 99;
          background: var(--cream);
          flex-direction: column;
          align-items: center; justify-content: center; gap: 2.5rem;
          opacity: 0; transform: translateY(-12px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .mobile-menu.open {
          display: flex;
          opacity: 1; transform: translateY(0);
          pointer-events: all;
        }
        .mobile-menu a {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; color: var(--forest);
          text-decoration: none; font-weight: 300;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .mobile-menu a:hover { color: var(--gold); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          /* Always show nav on mobile so hamburger is accessible */
          .nav {
            opacity: 1 !important;
            pointer-events: all !important;
            transform: none !important;
            background: transparent;
          }
          .nav.scrolled {
            background: rgba(245,240,232,0.96);
            backdrop-filter: blur(14px);
            box-shadow: 0 1px 0 rgba(0,0,0,0.08);
          }
        }

        /* ── HERO ── */
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
          position: relative; overflow: hidden;
          padding: 7rem 2rem 5rem;
        }
        @media (max-width: 768px) {
          .weather-hero { padding: 5rem 1rem 4rem; }
        }
        @media (max-width: 480px) {
          .weather-hero { padding: 4.5rem 0.75rem 3rem; }
        }

        .weather-hero::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 55% 28% at 12% 18%, rgba(255,255,255,0.5) 0%, transparent 70%),
            radial-gradient(ellipse 38% 18% at 82% 12%, rgba(255,255,255,0.4) 0%, transparent 70%),
            radial-gradient(ellipse 45% 22% at 55% 30%, rgba(255,255,255,0.3) 0%, transparent 70%);
        }

        .weather-hills {
          position: absolute; bottom: 0; left: 0; right: 0;
          pointer-events: none; z-index: 1;
        }

        .weather-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto; width: 100%;
        }

        /* ── EYEBROW ── */
        .w-eyebrow {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .w-eyebrow-line { width: 2rem; height: 1px; background: rgba(45,74,45,0.3); flex-shrink: 0; }
        .w-eyebrow span {
          font-size: 0.7rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(45,74,45,0.6); font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        @media (max-width: 480px) {
          .w-eyebrow span { font-size: 0.6rem; letter-spacing: 0.12em; }
        }

        /* ── TODAY CARD ── */
        .today-card {
          background: rgba(255,255,255,0.52);
          border: 1px solid rgba(255,255,255,0.75);
          backdrop-filter: blur(24px);
          border-radius: 6px;
          padding: 3rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 3rem;
          margin-bottom: 2px;
          animation: fadeUp 0.8s ease both;
          box-shadow: 0 8px 40px rgba(45,74,45,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }

        @media (max-width: 860px) {
          .today-card {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
          }
          /* On tablet/mobile, right column goes first (icon + stats) */
          .today-right { order: -1; flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 1.5rem; }
          .today-icon-wrap { width: 80px; height: 80px; }
          .today-stats { flex: 1; min-width: 200px; }
        }

        @media (max-width: 480px) {
          .today-card { padding: 1.5rem; gap: 1.5rem; }
          .today-right { flex-direction: column; align-items: center; }
          .today-stats { width: 100%; }
        }

        .today-date-label {
          font-size: 0.7rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--sage); margin-bottom: 0.5rem;
        }
        .today-day-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 300; color: var(--forest);
          line-height: 1; margin-bottom: 0.25rem;
        }
        .today-full-date { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.5rem; }

        .today-temp-row {
          display: flex; align-items: flex-end; gap: 1rem;
          margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .today-temp {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 300; color: var(--forest);
          line-height: 1; letter-spacing: -0.02em;
        }
        .today-temp-unit {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          color: var(--sage); margin-bottom: 0.75rem;
        }
        .today-label { font-size: 1rem; color: var(--forest); margin-bottom: 0.25rem; font-weight: 500; }
        .today-highlow { font-size: clamp(1rem, 2.5vw, 1.5rem); color: var(--muted); letter-spacing: 0.05em; }
        .today-highlow strong { color: var(--forest); }

        .today-desc {
          font-size: 0.9rem; line-height: 1.8;
          color: var(--muted); max-width: 52ch;
          border-top: 1px solid rgba(45,74,45,0.1);
          padding-top: 1.5rem; margin-top: 0.5rem;
          font-style: italic;
        }

        .today-right {
          display: flex; flex-direction: column;
          align-items: center; gap: 2rem;
        }
        .today-icon-wrap {
          width: 120px; height: 120px;
          display: flex; align-items: center; justify-content: center;
          animation: floatIcon 5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes floatIcon {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .today-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1px; background: rgba(45,74,45,0.08); width: 100%;
        }
        .today-stat {
          background: rgba(255,255,255,0.6);
          padding: 0.9rem 1.1rem;
          display: flex; flex-direction: column; gap: 0.3rem;
        }
        .today-stat-label {
          font-size: 0.62rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--sage);
          display: flex; align-items: center; gap: 0.35rem;
        }
        .today-stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 300; color: var(--forest);
        }

        /* ── SUN STRIP ── */
        .sun-strip {
          display: flex; gap: 1.5rem; flex-wrap: wrap;
          margin-top: 1.5rem; padding: 1.1rem 1.5rem;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(45,74,45,0.1); border-radius: 3px;
        }
        .sun-item {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.8rem; color: var(--muted);
          white-space: nowrap;
        }
        .sun-item strong { color: var(--forest); font-weight: 500; }
        .sun-divider { width: 1px; background: rgba(45,74,45,0.1); flex-shrink: 0; }
        @media (max-width: 360px) {
          .sun-strip { flex-direction: column; gap: 0.75rem; }
          .sun-divider { display: none; }
        }

        /* ── WEEK GRID ── */
        .week-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2px;
          background: rgba(45,74,45,0.08);
          animation: fadeUp 0.8s 0.2s ease both;
          width: 100%;
          margin-bottom: 0;
        }
        @media (max-width: 900px) {
          .week-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 520px) {
          .week-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .day-card {
          background: rgba(255,255,255,0.48);
          backdrop-filter: blur(12px);
          padding: 1.5rem 1rem;
          display: flex; flex-direction: column;
          align-items: center; gap: 0.75rem;
          cursor: pointer;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
          border: 1px solid transparent;
          /* Prevents ugly partial columns */
          min-width: 0;
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
        @media (max-width: 520px) {
          .day-card { padding: 1.25rem 0.75rem; }
        }

        .day-name {
          font-size: 0.65rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--sage); font-weight: 500;
        }
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
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.5rem;
          animation: fadeUp 0.35s ease both;
          backdrop-filter: blur(16px);
        }
        @media (max-width: 700px) {
          .detail-panel { grid-template-columns: 1fr 1fr; padding: 1.5rem; }
        }
        @media (max-width: 400px) {
          .detail-panel { grid-template-columns: 1fr; }
        }

        .detail-item { display: flex; flex-direction: column; gap: 0.3rem; }
        .detail-item-label {
          font-size: 0.62rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--sage);
          display: flex; align-items: center; gap: 0.35rem;
        }
        .detail-item-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 300; color: var(--forest);
        }

        /* ── FOOTER ── */
        footer {
          background: var(--dark);
          color: rgba(255,255,255,0.6);
          padding: 3rem 2rem 2rem;
        }
        @media (max-width: 480px) {
          footer { padding: 2rem 1rem 1.5rem; }
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
          justify-content: space-between; gap: 0.5rem;
          font-size: 0.72rem; color: rgba(255,255,255,0.25);
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── REDUCED MOTION ── */
        @media (prefers-reduced-motion: reduce) {
          .today-icon-wrap { animation: none; }
          .today-card, .week-grid { animation: none; }
          .day-card:hover { transform: none; }
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
                <button
                    className={`hamburger ${menuOpen ? "is-open" : ""}`}
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label={menuOpen ? "Închide meniu" : "Deschide meniu"}
                    aria-expanded={menuOpen}
                >
                    <span /><span /><span />
                </button>
            </nav>

            {/* ── MOBILE MENU ── */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`} role="dialog" aria-modal="true">
                {navLinks.map((l) => (
                    <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
                        {l.label}
                    </a>
                ))}
            </div>

            {/* ── WEATHER SECTION ── */}
            <section className="weather-hero">
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
                                <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", paddingBottom:"0.75rem" }}>
                                    <span className="today-temp-unit">°C</span>
                                </div>
                                <div>
                                    <div className="today-label">{TODAY.label}</div>
                                    <div className="today-highlow" style={{ marginTop:"0.25rem" }}>
                                        Se simte ca <strong>{TODAY.feelsLike}°C</strong>
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
                                    <WeatherIconComp type={day.icon} size={40} />
                                </div>
                                <span className="day-label-small">{day.label}</span>
                                <div className="day-temps">
                                    <span className="day-high" style={{ color: tempColor(day.high) }}>{day.high}°</span>
                                    {day.low !== 0 && (
                                        <span className="day-low">{day.low}°</span>
                                    )}
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
                                <span className="detail-item-label"><IconDroplet />Umiditate maximă</span>
                                <span className="detail-item-val">{selectedDay.humidity}%</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-item-label"><IconWind />Vânt estimat</span>
                                <span className="detail-item-val">{selectedDay.wind} km/h</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-item-label"><IconDroplet />Probabilitate precipitații</span>
                                <span className="detail-item-val">{selectedDay.precipitation}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer>
                <div className="footer-inner">
                    <div>
                        <div className="footer-brand">Cristești<span>.</span></div>
                        <div className="footer-tagline">Portalul informativ al comunității locale.</div>
                    </div>
                    <div className="footer-links">
                        {navLinks.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
                    </div>
                </div>
                <div className="footer-bottom">
                    <div>&copy; {new Date().getFullYear()} Cristești. Toate drepturile rezervate.</div>
                    <div>Proiect realizat cu Next.js</div>
                </div>
            </footer>
        </>
    );
}