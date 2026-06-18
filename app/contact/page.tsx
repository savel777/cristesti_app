'use client'

import { useState, useEffect, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Contact {
    id: number;
    numePrenume: string; // Mapat după structura din Aiven
    numar: string;       // Mapat după structura din Aiven
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconSearch = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconPhone = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
    </svg>
);

const IconUser = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconClose = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhoneDirectoryPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading]   = useState(true);
    const [query, setQuery]       = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Paginare
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        async function fetchContacts() {
            try {
                const res = await fetch('/api/contacte');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setContacts(data);
                }
            } catch (err) {
                console.error("Eroare la încărcarea datelor:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    const filtered = useMemo(() => {
        return contacts.filter(c => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return (
                c.numePrenume.toLowerCase().includes(q) ||
                c.numar.includes(q)
            );
        });
    }, [query, contacts]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const paginatedContacts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
    }, [filtered, currentPage]);

    const navLinks = [
        { label: "Acasă",      href: "/" },
        { label: "Harta", href: "/harta" },
        { label: "Meteo", href: "/meteo" },
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
          text-decoration: none;
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

        /* ── HERO ── */
        .dir-hero {
          min-height: 48vh;
          background: linear-gradient(168deg, #2d4a2d 0%, #3d6040 25%, #5a7a5a 55%, #8aaa7a 80%, #c8d8a0 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          position: relative; overflow: hidden;
          padding: 3rem 2rem 4rem;
        }
        .dir-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 20% 30%, rgba(255,255,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 20%, rgba(196,154,60,0.12) 0%, transparent 70%);
        }
        .dir-hills { position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none; }
        .dir-hero-inner { max-width: 1200px; margin: 0 auto; width: 100%; }
        .dir-eyebrow { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; opacity: 0; animation: fadeUp 0.7s 0.1s ease forwards; }
        .dir-eyebrow-line { width: 2rem; height: 1px; background: rgba(255,255,255,0.4); }
        .dir-eyebrow span { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.6); font-weight: 500; }
        .dir-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 300; color: #fff; line-height: 1.1; letter-spacing: -0.01em; margin-bottom: 1rem; opacity: 0; animation: fadeUp 0.7s 0.2s ease forwards; }
        .dir-title em { color: var(--wheat); font-style: italic; }
        .dir-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.6); max-width: 42ch; line-height: 1.7; margin-bottom: 2.5rem; opacity: 0; animation: fadeUp 0.7s 0.3s ease forwards; }

        /* ── SEARCH BAR ── */
        .search-wrap { display: flex; gap: 1rem; align-items: center; opacity: 0; animation: fadeUp 0.7s 0.4s ease forwards; flex-wrap: wrap; }
        .search-field { position: relative; flex: 1; min-width: 280px; max-width: 520px; }
        .search-icon { position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%); color: rgba(45,74,45,0.4); pointer-events: none; display: flex; align-items: center; }
        .search-input { width: 100%; padding: 0.9rem 1rem 0.9rem 2.8rem; font-family: 'Jost', sans-serif; font-size: 0.9rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.6); border-radius: 3px; color: var(--text); transition: all 0.25s; outline: none; }
        .search-input::placeholder { color: rgba(45,74,45,0.4); }
        .search-input:focus { background: rgba(255,255,255,1); border-color: var(--gold); box-shadow: 0 0 0 3px rgba(196,154,60,0.12); }
        .search-clear { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--muted); display: flex; align-items: center; padding: 4px; opacity: 0.6; transition: opacity 0.2s; }
        .search-clear:hover { opacity: 1; }
        .search-count { font-size: 0.78rem; color: rgba(255,255,255,0.55); white-space: nowrap; font-style: italic; }

        /* ── MAIN CONTENT ── */
        .dir-main { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; width: 100%; box-sizing: border-box; }

        /* ── TABLE ── */
        .dir-table-wrap { background: rgba(255,255,255,0.55); border: 1px solid rgba(45,74,45,0.1); border-radius: 4px; overflow: hidden; box-shadow: 0 4px 30px rgba(45,74,45,0.06); opacity: 0; animation: fadeUp 0.6s 0.1s ease forwards; width: 100%; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: var(--forest); }
        thead th { padding: 1rem 1.5rem; font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.65); font-weight: 500; text-align: left; }
        thead th:first-child { width: 3rem; text-align: center; }
        tbody tr { border-bottom: 1px solid rgba(45,74,45,0.07); transition: background 0.18s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(196,154,60,0.06); }
        tbody td { padding: 1rem 1.5rem; font-size: 0.88rem; color: var(--text); vertical-align: middle; }
        tbody td:first-child { text-align: center; color: var(--muted); font-size: 0.75rem; font-style: italic; }
        .td-name { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 400; color: var(--forest); }
        .td-phone { display: flex; align-items: center; gap: 0.5rem; font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: var(--text); letter-spacing: 0.03em; }
        .td-phone-icon { color: var(--sage); opacity: 0.7; }

        /* ── PAGINATION ── */
        .pagination-container { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: rgba(255, 255, 255, 0.4); border-top: 1px solid rgba(45, 74, 45, 0.07); flex-wrap: wrap; gap: 1rem; }
        .pagination-info { font-size: 0.8rem; color: var(--muted); font-style: italic; }
        .pagination-buttons { display: flex; align-items: center; gap: 0.35rem; }
        .pagination-btn { font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500; background: #fff; border: 1px solid rgba(45,74,45,0.12); color: var(--forest); border-radius: 3px; min-width: 32px; height: 32px; padding: 0 0.5rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .pagination-btn:hover:not(:disabled) { border-color: var(--gold); background: rgba(196,154,60,0.05); color: var(--gold); }
        .pagination-btn.active { background: var(--forest); color: #fff; border-color: var(--forest); cursor: default; }
        .pagination-btn:disabled { opacity: 0.35; cursor: not-allowed; background: transparent; }

        /* ── EMPTY STATE ── */
        .dir-empty { text-align: center; padding: 5rem 2rem; color: var(--muted); }
        .dir-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: var(--forest); margin-bottom: 0.75rem; font-weight: 300; }
        .dir-empty-sub { font-size: 0.85rem; font-style: italic; }

        /* ── FOOTER ── */
        footer { background: var(--dark); color: rgba(255,255,255,0.6); padding: 3rem 2rem 2rem; }
        .footer-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 300; color: #fff; }
        .footer-brand span { color: var(--gold); }
        .footer-tagline { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 0.4rem; }
        .footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--wheat); }
        .footer-bottom { max-width: 1200px; margin: 1.5rem auto 0; display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 0.72rem; color: rgba(255,255,255,0.25); gap: 0.5rem; }

        .loader { border: 2px solid rgba(45,74,45,0.1); border-top: 2px solid var(--forest); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 4rem auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* ── MEDIAPLATE-URI RESPONSIVE / ADAPTARE MOBIL ── */
        @media (max-width: 768px) {
          .dir-hero { padding: 5rem 1.5rem 3rem; min-height: 40vh; }
          .dir-main { padding: 1.5rem 1rem 4rem; }
          .nav { padding: 1rem 1.5rem; opacity: 1; pointer-events: all; transform: none; background: rgba(245,240,232,0.96); backdrop-filter: blur(14px); box-shadow: 0 1px 0 rgba(0,0,0,0.05); }
        }

        @media (max-width: 640px) {
          .search-count { width: 100%; text-align: left; color: rgba(255,255,255,0.7); font-size: 0.85rem; margin-top: -0.2rem; }
          .pagination-container { justify-content: center; flex-direction: column-reverse; text-align: center; padding: 1.25rem 1rem; }
          .pagination-buttons { width: 100%; justify-content: center; }

          /* TRUC RESPONSIVE PENTRU TABEL PE MOBIL (Transformare în Carduri) */
          table, thead, tbody, th, td, tr { display: block; }
          thead { display: none; } /* Ascundem capul tabelului pe mobil */
          
          tbody tr {
            padding: 1.25rem 1rem;
            border-bottom: 1px solid rgba(45,74,45,0.1);
            position: relative;
            background: #fff;
            margin-bottom: 0.5rem;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }
          
          tbody td {
            padding: 0 !important;
            text-align: left !important;
            border: none;
          }
          
          /* Indexul (#) plasat discret în colțul de sus */
          tbody td:first-child {
            position: absolute;
            top: 0.6rem;
            right: 1rem;
            font-size: 0.7rem;
            color: var(--muted);
          }
          
          tbody td:nth-child(2) {
            margin-bottom: 0.5rem;
          }
          
          .td-name {
            font-size: 1.15rem;
            font-weight: 500;
            display: block;
          }

          .td-phone {
            font-size: 1.1rem;
            color: var(--text);
            background: rgba(45,74,45,0.04);
            padding: 0.35rem 0.6rem;
            border-radius: 3px;
            display: inline-flex;
          }
        }
      `}</style>

            {/* ── NAV ── */}
            <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
                <a href="/" className="nav-logo">Cristești<span>.</span></a>
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
                <button
                    style={{ position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "var(--forest)" }}
                    onClick={() => setMenuOpen(false)}
                >×</button>
                {navLinks.map((l) => <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
            </div>

            {/* ── HERO ── */}
            <section className="dir-hero">
                <svg className="dir-hills" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,60 C200,30 420,75 620,50 C820,28 1060,70 1240,48 C1330,38 1400,58 1440,50 L1440,100 L0,100 Z" fill="rgba(90,140,90,0.12)" />
                    <path d="M0,75 C260,55 520,88 780,72 C1020,58 1230,82 1440,72 L1440,100 L0,100 Z" fill="rgba(45,74,45,0.15)" />
                    <path d="M0,88 C320,80 640,95 960,88 C1120,84 1300,92 1440,88 L1440,100 L0,100 Z" fill="rgba(245,240,232,0.95)" />
                </svg>

                <div className="dir-hero-inner">
                    <div className="dir-eyebrow">
                        <div className="dir-eyebrow-line" />
                        <span>Cristești, Nisporeni · Director Telefonic</span>
                    </div>

                    <h1 className="dir-title">
                        Agenda<br /><em>Telefonică</em>
                    </h1>

                    <p className="dir-subtitle">
                        Numerele de telefon fix ale locuitorilor și instituțiilor din satul Cristești, Raionul Nisporeni.
                    </p>

                    <div className="search-wrap">
                        <div className="search-field">
                            <span className="search-icon"><IconSearch size={17} /></span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Caută după nume sau număr…"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                aria-label="Caută în agendă"
                            />
                            {query && (
                                <button className="search-clear" onClick={() => setQuery("")} aria-label="Șterge căutarea">
                                    <IconClose size={14} />
                                </button>
                            )}
                        </div>
                        <span className="search-count">
                            {loading ? "Se încarcă..." : filtered.length === contacts.length
                                ? `${contacts.length} contacte`
                                : `${filtered.length} din ${contacts.length}`}
                        </span>
                    </div>
                </div>
            </section>

            {/* ── MAIN ── */}
            <main className="dir-main">
                <div className="dir-table-wrap">
                    {loading ? (
                        <div className="loader" />
                    ) : filtered.length === 0 ? (
                        <div className="dir-empty">
                            <div className="dir-empty-title">Niciun rezultat</div>
                            <p className="dir-empty-sub">Încearcă o altă căutare.</p>
                        </div>
                    ) : (
                        <>
                            <table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th><span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><IconUser size={12} />Nume și Prenume</span></th>
                                    <th><span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><IconPhone size={12} />Telefon Fix</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedContacts.map((contact, idx) => (
                                    <tr key={contact.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td>
                                            <span className="td-name">{contact.numePrenume}</span>
                                        </td>
                                        <td>
                                            <span className="td-phone">
                                                <span className="td-phone-icon"><IconPhone size={13} /></span>
                                                {contact.numar}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {/* ── PAGINARE RESPONSIVE ── */}
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <div className="pagination-info">
                                        Pagina {currentPage} din {totalPages} (Afișate {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} din {filtered.length})
                                    </div>
                                    <div className="pagination-buttons">
                                        <button
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            «
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                            if (page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1) {
                                                return (
                                                    <button
                                                        key={page}
                                                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === 2 || page === totalPages - 1) {
                                                return <span key={page} style={{ color: 'var(--muted)', padding: '0 0.1rem', fontSize: '0.8rem' }}>...</span>;
                                            }
                                            return null;
                                        })}

                                        <button
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer>
                <div className="footer-inner">
                    <div>
                        <div className="footer-brand">Cristești<span>.</span></div>
                        <div className="footer-tagline">Raionul Nisporeni · Republica Moldova</div>
                    </div>
                    <div className="footer-links">
                        <strong style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>Navigare</strong>
                        {navLinks.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
                    </div>
                    <div className="footer-links">
                        <strong style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>Contact</strong>
                        <a href="mailto:contact@cristesti.md">contact@cristesti.md</a>
                        <a href="#">Primăria Cristești</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Cristești, Raionul Nisporeni</span>
                    <span>Prisacaru Savelie</span>
                </div>
            </footer>
        </>
    );
}