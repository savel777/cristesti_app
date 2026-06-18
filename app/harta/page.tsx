'use client'

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const HartaSatelit = dynamic(() => import('@/components/HartaSatelit'), {
    ssr: false,
    loading: () => (
        <div style={{
            width:'100%', height:'100%',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            background:'#f5f0e8', gap:'0.75rem'
        }}>
            <div style={{
                width:'2rem', height:'2rem',
                border:'2px solid #2d4a2d',
                borderTopColor:'transparent',
                borderRadius:'50%',
                animation:'spin 0.8s linear infinite'
            }} />
            <p style={{
                fontFamily:"'Jost',sans-serif",
                fontSize:'0.82rem', color:'#6b6b6b',
                letterSpacing:'0.12em', textTransform:'uppercase'
            }}>Se încarcă harta...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
});

const locatiiInitiale: Locatie[] = [
    { id:'biserica',         nume:'Biserica "Adormirea Maicii Domnului"', categorie:'Atractii',   descriere:'Lăcaș de cult ortodox, monument spiritual al comunității.',          coordonate:[47.05998544075632,  28.284372321002213] },
    { id:'punct-medical',    nume:'Punctul Medical',                       categorie:'Institutii', descriere:'Centrul de asistență medicală primară al localității.',               coordonate:[47.059374508663716, 28.285004140597348] },
    { id:'discoteca',        nume:'Discoteca',                             categorie:'Servicii',   descriere:'Locul de distracție și agrement pentru tinerii din sat.',             coordonate:[47.057990092959386, 28.28418993079333]  },
    { id:'statia-alimentare',nume:'Stația de alimentare',                 categorie:'Servicii',   descriere:'Stație de carburanți pe traseul principal al localității.',           coordonate:[47.05797856180371,  28.277370035191662] },
    { id:'cimitirul',        nume:'Cimitirul Cristești',                  categorie:'Atractii',   descriere:'Cimitirul satului, loc de odihnă al înaintașilor comunității.',       coordonate:[47.057093509193905, 28.27962008146973]  },
    { id:'gimnaziul',        nume:'Gimnaziul Cristești',                  categorie:'Institutii', descriere:'Instituție de învățământ gimnazial a localității.',                   coordonate:[47.057390743140814, 28.28596018870306]  },
    { id:'dealul-vatica',    nume:'Dealul lui Vatică',                    categorie:'Atractii',   descriere:'Cel mai frumos punct panoramic al satului, cu vedere spre vale.',      coordonate:[47.05560622270924,  28.293214111199276] },
    { id:'consiliul-satesc', nume:'Consiliul Sătesc',                    categorie:'Institutii', descriere:'Administrația publică locală a satului Cristești.',                   coordonate:[47.05588433731287,  28.28178968483528]  },
    { id:'cafenea-marialia', nume:'Cafeaneaua MariaLia',                 categorie:'Servicii',   descriere:'Cafenea locală, loc de întâlnire și relaxare al comunității.',        coordonate:[47.053863398688186, 28.28006205488885]  },
    { id:'gradinita',        nume:'Grădinița Izvoraș',                   categorie:'Institutii', descriere:'Grădinița locală pentru copiii preșcolari din Cristești.',            coordonate:[47.054347015260234, 28.28472286512609]  },
    { id:'lacul-razim',      nume:'Lacul Razim',                         categorie:'Natura',     descriere:'Bazin acvatic pitoresc, ideal pentru pescuit și relaxare.',           coordonate:[47.05050533631415,  28.270097564001315] },
    { id:'statia-autobuze',  nume:'Stația de autobuze Mozaic',           categorie:'Servicii',   descriere:'Stația principală cu conexiuni spre Nisporeni și Chișinău.',          coordonate:[47.05159125463287,  28.280289738143182] },
    { id:'casa-prisacaru',   nume:'Casa lui Prisacaru Savelie',          categorie:'Atractii',   descriere:'Reper local important și simbol al ospitalității Cristeștilor.',       coordonate:[47.048884136180504, 28.283719917214544] },
];

const META: Record<string, { dot: string; bg: string; fg: string; emoji: string }> = {
    Institutii: { dot:'#3b82f6', bg:'#eff6ff', fg:'#1d4ed8', emoji:'🏛' },
    Servicii:   { dot:'#f59e0b', bg:'#fffbeb', fg:'#b45309', emoji:'🛎' },
    Natura:     { dot:'#10b981', bg:'#ecfdf5', fg:'#047857', emoji:'🌿' },
    Atractii:   { dot:'#8b5cf6', bg:'#f5f3ff', fg:'#6d28d9', emoji:'⭐' },
};

const CATEGORII = ['Toate','Institutii','Servicii','Natura','Atractii'];

export default function PaginaHarta() {
    const [locatii]      = useState<Locatie[]>(locatiiInitiale);
    const [selectata, setSelectata]       = useState<Locatie | null>(null);
    const [cautare, setCautare]           = useState('');
    const [categorie, setCategorie]       = useState('Toate');
    // mobile bottom-sheet states: 'closed' | 'peek' | 'open'
    const [sheetState, setSheetState]     = useState<'closed'|'peek'|'open'>('peek');
    const touchStartY = useRef<number>(0);
    const touchDeltaY = useRef<number>(0);

    const filtrate = locatii.filter(l =>
        l.nume.toLowerCase().includes(cautare.toLowerCase()) &&
        (categorie === 'Toate' || l.categorie === categorie)
    );

    const alege = (loc: Locatie) => {
        setSelectata(loc);
        setSheetState('peek');
    };

    /* ── touch drag pe handle ── */
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
    };
    const onTouchEnd = () => {
        const d = touchDeltaY.current;
        if (d < -40) setSheetState('open');
        else if (d > 40) setSheetState(sheetState === 'open' ? 'peek' : 'closed');
        touchDeltaY.current = 0;
    };

    return (
        <>
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
            *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
            :root {
                --cream:#f5f0e8; --wheat:#e8d5a3; --gold:#c49a3c;
                --forest:#2d4a2d; --sage:#5a7a5a; --dark:#1a1a1a; --muted:#6b6b6b;
            }
            html,body { height:100%; overflow:hidden; }
            body { font-family:'Jost',sans-serif; background:var(--cream); }

            /* ─── NAV ─── */
            .nav {
                position:fixed; top:0; left:0; right:0; z-index:300;
                height:52px;
                background:rgba(245,240,232,0.97);
                backdrop-filter:blur(14px);
                border-bottom:1px solid rgba(196,154,60,.18);
                display:flex; align-items:center;
                justify-content:space-between;
                padding:0 1.25rem;
            }
            .nav-brand {
                font-family:'Cormorant Garamond',serif;
                font-size:1.3rem; font-weight:600;
                color:var(--forest); text-decoration:none; letter-spacing:.02em;
            }
            .nav-brand span { color:var(--gold); }
            .nav-page {
                font-size:.65rem; letter-spacing:.18em; text-transform:uppercase;
                color:var(--muted); font-weight:500;
            }
            .nav-back {
                display:flex; align-items:center; gap:.35rem;
                font-size:.7rem; font-weight:500; letter-spacing:.1em;
                text-transform:uppercase; color:var(--forest);
                text-decoration:none; opacity:.75; transition:opacity .2s;
                white-space:nowrap;
            }
            .nav-back:hover { opacity:1; }
            .nav-back svg { width:13px; height:13px; }

            /* ─── LAYOUT ─── */
            .layout {
                display:flex; height:100vh; padding-top:52px;
            }

            /* ─── SIDEBAR DESKTOP ─── */
            .sidebar {
                width:320px; min-width:320px;
                height:100%; display:flex; flex-direction:column;
                background:var(--cream);
                border-right:1px solid rgba(196,154,60,.18);
                z-index:10;
            }

            .sb-header {
                padding:1.4rem 1.4rem 1rem;
                border-bottom:1px solid rgba(196,154,60,.12);
                background:linear-gradient(to bottom,rgba(232,213,163,.2),transparent);
            }
            .sb-eyebrow {
                display:flex; align-items:center; gap:.6rem; margin-bottom:.4rem;
            }
            .eline { width:1.5rem; height:1px; background:var(--gold); }
            .etxt {
                font-size:.58rem; letter-spacing:.2em; text-transform:uppercase;
                color:var(--gold); font-weight:500;
            }
            .sb-title {
                font-family:'Cormorant Garamond',serif;
                font-size:1.55rem; font-weight:300; color:var(--forest); line-height:1.2;
            }
            .sb-title em { font-style:italic; color:var(--sage); }
            .sb-sub { font-size:.68rem; color:var(--muted); margin-top:.2rem; }

            .sb-search { padding:.9rem 1.2rem .5rem; }
            .s-wrap { position:relative; }
            .s-input {
                width:100%; padding:.6rem 2.2rem .6rem .9rem;
                background:#fff; border:1px solid rgba(196,154,60,.25);
                font-family:'Jost',sans-serif; font-size:.82rem;
                color:var(--dark); outline:none; border-radius:2px;
                transition:border-color .2s;
            }
            .s-input:focus { border-color:var(--gold); }
            .s-input::placeholder { color:#b0a89a; }
            .s-ico {
                position:absolute; right:.7rem; top:50%;
                transform:translateY(-50%);
                color:var(--gold); font-size:.9rem; pointer-events:none;
            }

            .sb-filters {
                padding:.5rem 1.2rem .9rem;
                display:flex; gap:.35rem; flex-wrap:wrap;
                border-bottom:1px solid rgba(196,154,60,.12);
            }
            .f-btn {
                padding:.28rem .75rem; border:1px solid rgba(196,154,60,.28);
                background:transparent; cursor:pointer;
                font-family:'Jost',sans-serif; font-size:.63rem;
                font-weight:500; letter-spacing:.1em; text-transform:uppercase;
                color:var(--muted); border-radius:2px; transition:all .2s;
                white-space:nowrap;
            }
            .f-btn:hover { border-color:var(--forest); color:var(--forest); }
            .f-btn.on { background:var(--forest); color:var(--cream); border-color:var(--forest); }

            .sb-list {
                flex:1; overflow-y:auto; padding:.6rem .7rem;
            }
            .sb-list::-webkit-scrollbar { width:3px; }
            .sb-list::-webkit-scrollbar-thumb { background:rgba(196,154,60,.3); border-radius:2px; }

            .list-hdr {
                font-size:.58rem; letter-spacing:.18em; text-transform:uppercase;
                color:var(--gold); font-weight:500;
                padding:.2rem .5rem .55rem; display:block;
            }

            .loc-btn {
                width:100%; text-align:left;
                padding:.8rem .9rem;
                background:transparent; border:1px solid transparent;
                border-radius:2px; cursor:pointer;
                display:flex; align-items:flex-start; gap:.7rem;
                margin-bottom:2px; transition:all .2s;
            }
            .loc-btn:hover { background:rgba(232,213,163,.2); border-color:rgba(196,154,60,.2); }
            .loc-btn.sel { background:rgba(45,74,45,.07); border-color:rgba(45,74,45,.25); }
            .loc-dot { width:8px; height:8px; border-radius:50%; margin-top:5px; flex-shrink:0; }
            .loc-body { flex:1; min-width:0; }
            .loc-name {
                font-family:'Cormorant Garamond',serif;
                font-size:.98rem; font-weight:600;
                color:var(--forest); display:block; margin-bottom:.15rem; line-height:1.25;
            }
            .loc-desc {
                font-size:.74rem; color:var(--muted); line-height:1.5;
                display:-webkit-box; -webkit-line-clamp:2;
                -webkit-box-orient:vertical; overflow:hidden;
            }
            .loc-badge {
                display:inline-block; margin-top:.35rem;
                font-size:.58rem; font-weight:500; letter-spacing:.08em;
                text-transform:uppercase; padding:.18rem .5rem; border-radius:2px;
            }

            .empty {
                padding:2.5rem 1rem; text-align:center;
            }
            .empty p { font-size:.8rem; color:var(--muted); font-style:italic; line-height:1.6; }

            .sb-legend {
                padding:.6rem 1.2rem;
                border-top:1px solid rgba(196,154,60,.12);
                display:flex; flex-wrap:wrap; gap:.5rem 1rem;
            }
            .leg-item {
                display:flex; align-items:center; gap:.3rem;
                font-size:.62rem; color:var(--muted); letter-spacing:.04em;
            }
            .leg-dot { width:6px; height:6px; border-radius:50%; }

            .sb-foot {
                padding:.6rem 1.2rem;
                border-top:1px solid rgba(196,154,60,.1);
                background:rgba(232,213,163,.1);
                display:flex; justify-content:space-between; align-items:center;
            }
            .sb-foot-brand {
                font-family:'Cormorant Garamond',serif;
                font-size:.85rem; color:var(--forest); opacity:.55;
            }
            .sb-foot-brand span { color:var(--gold); }
            .sb-foot-copy { font-size:.6rem; color:var(--muted); }

            /* ─── HARTĂ ─── */
            .map-main { flex:1; height:100%; position:relative; }

            /* ── CARD DETALII (desktop, când e selectată o locație) ── */
            .detail-card {
                position:absolute; bottom:1.5rem; right:1.5rem; z-index:50;
                width:260px;
                background:rgba(245,240,232,0.97);
                backdrop-filter:blur(12px);
                border:1px solid rgba(196,154,60,.25);
                border-radius:3px;
                box-shadow:0 8px 32px rgba(0,0,0,.12);
                padding:1.1rem 1.2rem 1rem;
                animation:slideIn .25s ease;
            }
            @keyframes slideIn {
                from { opacity:0; transform:translateY(8px); }
                to   { opacity:1; transform:translateY(0); }
            }
            .dc-cat {
                font-size:.58rem; letter-spacing:.15em; text-transform:uppercase;
                color:var(--gold); font-weight:500; margin-bottom:.4rem; display:block;
            }
            .dc-name {
                font-family:'Cormorant Garamond',serif;
                font-size:1.1rem; font-weight:600; color:var(--forest); line-height:1.25;
                margin-bottom:.4rem;
            }
            .dc-desc { font-size:.76rem; color:var(--muted); line-height:1.55; }
            .dc-link {
                display:inline-flex; align-items:center; gap:.35rem;
                margin-top:.8rem; font-size:.68rem; font-weight:500;
                letter-spacing:.08em; text-transform:uppercase;
                color:var(--forest); text-decoration:none;
                border-bottom:1px solid var(--gold); padding-bottom:1px;
                transition:gap .2s;
            }
            .dc-link:hover { gap:.6rem; }
            .dc-close {
                position:absolute; top:.6rem; right:.7rem;
                background:none; border:none; cursor:pointer;
                font-size:1rem; color:var(--muted); line-height:1;
                transition:color .2s;
            }
            .dc-close:hover { color:var(--forest); }

            /* ─── MOBILE ─── */
            @media (max-width: 768px) {
                .sidebar { display:none; }
                .detail-card { display:none; }

                /* Bottom sheet */
                .mob-sheet {
                    position:fixed; left:0; right:0; bottom:0; z-index:250;
                    background:var(--cream);
                    border-radius:16px 16px 0 0;
                    box-shadow:0 -4px 40px rgba(0,0,0,.18);
                    display:flex; flex-direction:column;
                    transition:height .35s cubic-bezier(.4,0,.2,1);
                    max-height:88vh;
                }
                .mob-sheet.closed { height:0px; overflow:hidden; }
                .mob-sheet.peek   { height:auto; max-height:58vh; }
                .mob-sheet.open   { height:88vh; }

                /* handle */
                .mob-handle {
                    display:flex; justify-content:center; padding:10px 0 4px;
                    cursor:grab; flex-shrink:0;
                    touch-action:none;
                }
                .mob-handle-bar {
                    width:36px; height:4px; border-radius:2px;
                    background:rgba(196,154,60,.4);
                }

                /* Header interno mobile */
                .mob-sheet-hdr {
                    padding:.4rem 1.1rem .7rem; flex-shrink:0;
                }
                .mob-sheet-title {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.25rem; font-weight:300; color:var(--forest);
                }
                .mob-sheet-title em { font-style:italic; color:var(--sage); }
                .mob-sheet-sub { font-size:.65rem; color:var(--muted); }

                .mob-search { padding:.4rem 1.1rem .4rem; flex-shrink:0; }

                .mob-filters {
                    padding:.3rem 1.1rem .6rem;
                    display:flex; gap:.4rem; overflow-x:auto; flex-shrink:0;
                    scrollbar-width:none; border-bottom:1px solid rgba(196,154,60,.12);
                }
                .mob-filters::-webkit-scrollbar { display:none; }

                .mob-list {
                    flex:1; overflow-y:auto; padding:.5rem .8rem;
                    -webkit-overflow-scrolling:touch;
                }
                .mob-list::-webkit-scrollbar { width:0; }

                /* Card per locatie pe mobil */
                .mob-loc-card {
                    width:100%; text-align:left;
                    background:#fff; border:none;
                    border-radius:10px; margin-bottom:.6rem;
                    padding:.9rem 1rem;
                    display:flex; align-items:center; gap:.9rem;
                    box-shadow:0 1px 6px rgba(0,0,0,.07);
                    cursor:pointer; transition:box-shadow .2s, transform .15s;
                    -webkit-tap-highlight-color:transparent;
                }
                .mob-loc-card:active { transform:scale(.98); }
                .mob-loc-card.sel { box-shadow:0 2px 14px rgba(45,74,45,.18); }
                .mob-loc-icon {
                    width:42px; height:42px; border-radius:10px;
                    display:flex; align-items:center; justify-content:center;
                    font-size:1.2rem; flex-shrink:0;
                }
                .mob-loc-name {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1rem; font-weight:600; color:var(--forest);
                    display:block; margin-bottom:.15rem; line-height:1.25;
                    text-align:left;
                }
                .mob-loc-desc {
                    font-size:.72rem; color:var(--muted); line-height:1.45;
                    text-align:left;
                    display:-webkit-box; -webkit-line-clamp:2;
                    -webkit-box-orient:vertical; overflow:hidden;
                }
                .mob-loc-body { flex:1; min-width:0; }
                .mob-loc-arrow { color:rgba(196,154,60,.6); font-size:.85rem; flex-shrink:0; }

                /* Detail overlay pe mobil */
                .mob-detail {
                    position:fixed; left:1rem; right:1rem; bottom:1rem; z-index:260;
                    background:rgba(245,240,232,0.98);
                    backdrop-filter:blur(16px);
                    border-radius:14px;
                    box-shadow:0 8px 40px rgba(0,0,0,.18);
                    padding:1.2rem 1.25rem 1rem;
                    animation:slideUp .3s ease;
                    border:1px solid rgba(196,154,60,.2);
                }
                @keyframes slideUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .mob-detail-close {
                    position:absolute; top:.7rem; right:.9rem;
                    background:rgba(196,154,60,.12); border:none; cursor:pointer;
                    width:28px; height:28px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:.9rem; color:var(--muted);
                    -webkit-tap-highlight-color:transparent;
                }
                .mob-detail-cat {
                    font-size:.58rem; letter-spacing:.15em; text-transform:uppercase;
                    color:var(--gold); font-weight:500; margin-bottom:.3rem; display:block;
                }
                .mob-detail-name {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.25rem; font-weight:600; color:var(--forest);
                    line-height:1.25; margin-bottom:.4rem; padding-right:2rem;
                }
                .mob-detail-desc { font-size:.8rem; color:var(--muted); line-height:1.6; }
                .mob-detail-link {
                    display:flex; align-items:center; justify-content:center; gap:.5rem;
                    margin-top:.85rem; padding:.65rem 1rem;
                    background:var(--forest); color:var(--cream);
                    text-decoration:none; border-radius:8px;
                    font-size:.75rem; font-weight:500; letter-spacing:.08em;
                    text-transform:uppercase;
                    -webkit-tap-highlight-color:transparent;
                }

                /* FAB - deschide lista */
                .mob-fab {
                    position:fixed; bottom:1rem; right:1rem; z-index:240;
                    background:var(--forest); color:var(--cream);
                    border:none; cursor:pointer;
                    width:56px; height:56px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:1.35rem;
                    box-shadow:0 4px 20px rgba(45,74,45,.45);
                    -webkit-tap-highlight-color:transparent;
                    transition:transform .2s, background .2s;
                }
                .mob-fab:active { transform:scale(.92); }
                .mob-fab.sheet-open { background:var(--sage); }

                /* count badge pe FAB */
                .fab-badge {
                    position:absolute; top:-4px; right:-4px;
                    background:var(--gold); color:#fff;
                    font-size:.6rem; font-weight:700;
                    width:18px; height:18px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    border:2px solid var(--cream);
                }

                /* Mob header strip - sub nav */
                .mob-map-strip {
                    position:absolute; top:.7rem; left:.7rem; z-index:40;
                    background:rgba(245,240,232,0.95);
                    backdrop-filter:blur(10px);
                    border:1px solid rgba(196,154,60,.2);
                    border-radius:8px;
                    padding:.45rem .8rem;
                    display:flex; align-items:center; gap:.5rem;
                    font-size:.68rem; color:var(--forest); font-weight:500;
                    letter-spacing:.04em;
                    pointer-events:none;
                }
                .strip-dot {
                    width:6px; height:6px; border-radius:50%;
                    background:var(--gold); animation:pulse 2s infinite;
                }
                @keyframes pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:.5; transform:scale(1.4); }
                }
            }

            /* ─── DESKTOP ONLY ─── */
            @media (min-width: 769px) {
                .mob-sheet, .mob-fab, .mob-detail, .mob-map-strip { display:none !important; }
            }
        `}</style>

            {/* ── NAV ── */}
            <nav className="nav">
                <a href="/" className="nav-brand">Cristești<span>.</span></a>
                <span className="nav-page">Harta Localității</span>
                <a href="/" className="nav-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Acasă
                </a>
            </nav>

            <div className="layout">

                {/* ════ SIDEBAR DESKTOP ════ */}
                <aside className="sidebar">
                    <div className="sb-header">
                        <div className="sb-eyebrow">
                            <div className="eline"/><span className="etxt">Ghid local</span>
                        </div>
                        <h1 className="sb-title">Harta <em>Cristeștilor</em></h1>
                        <p className="sb-sub">Raionul Nisporeni · Republica Moldova</p>
                    </div>

                    <div className="sb-search">
                        <div className="s-wrap">
                            <input className="s-input" type="text"
                                   placeholder="Caută o locație..."
                                   value={cautare} onChange={e => setCautare(e.target.value)} />
                            <span className="s-ico">⌕</span>
                        </div>
                    </div>

                    <div className="sb-filters">
                        {CATEGORII.map(c => (
                            <button key={c} className={'f-btn' + (categorie===c?' on':'')}
                                    onClick={() => setCategorie(c)}>
                                {c !== 'Toate' && META[c]?.emoji + ' '}{c}
                            </button>
                        ))}
                    </div>

                    <div className="sb-list">
                        <span className="list-hdr">{filtrate.length} locații identificate</span>
                        {filtrate.length === 0 && (
                            <div className="empty"><p>Nicio locație găsită.<br/>Încearcă altă căutare.</p></div>
                        )}
                        {filtrate.map(loc => {
                            const m = META[loc.categorie];
                            return (
                                <button key={loc.id}
                                        className={'loc-btn' + (selectata?.id===loc.id?' sel':'')}
                                        onClick={() => alege(loc)}>
                                    <div className="loc-dot" style={{background: m?.dot}}/>
                                    <div className="loc-body">
                                        <span className="loc-name">{loc.nume}</span>
                                        <p className="loc-desc">{loc.descriere}</p>
                                        <span className="loc-badge" style={{background:m?.bg, color:m?.fg}}>
                                        {m?.emoji} {loc.categorie}
                                    </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="sb-legend">
                        {Object.entries(META).map(([cat, m]) => (
                            <div className="leg-item" key={cat}>
                                <div className="leg-dot" style={{background:m.dot}}/>
                                <span>{cat}</span>
                            </div>
                        ))}
                    </div>

                    <div className="sb-foot">
                        <div className="sb-foot-brand">Cristești<span>.</span></div>
                        <span className="sb-foot-copy">© {new Date().getFullYear()}</span>
                    </div>
                </aside>

                {/* ════ HARTĂ ════ */}
                <main className="map-main">
                    <HartaSatelit
                        locatii={filtrate}
                        locatieSelectata={selectata}
                        onSelectLocatie={alege}
                    />

                    {/* Strip info pe mobil */}
                    <div className="mob-map-strip">
                        <div className="strip-dot"/>
                        <span>{filtrate.length} locații · Cristești</span>
                    </div>

                    {/* Card detalii desktop */}
                    {selectata && (
                        <div className="detail-card">
                            <button className="dc-close" onClick={() => setSelectata(null)}>×</button>
                            <span className="dc-cat">{META[selectata.categorie]?.emoji} {selectata.categorie}</span>
                            <div className="dc-name">{selectata.nume}</div>
                            <p className="dc-desc">{selectata.descriere}</p>
                            <a className="dc-link"
                               href={'https://www.google.com/maps/dir/?api=1&destination=' + selectata.coordonate[0] + ',' + selectata.coordonate[1]}
                               target="_blank" rel="noopener noreferrer">
                                🗺 Traseu →
                            </a>
                        </div>
                    )}
                </main>
            </div>

            {/* ════ MOBILE UI ════ */}

            {/* Detail card mobil (apare când e selectată o locație) */}
            {selectata && (
                <div className="mob-detail">
                    <button className="mob-detail-close" onClick={() => setSelectata(null)}>×</button>
                    <span className="mob-detail-cat">{META[selectata.categorie]?.emoji} {selectata.categorie}</span>
                    <div className="mob-detail-name">{selectata.nume}</div>
                    <p className="mob-detail-desc">{selectata.descriere}</p>
                    <a className="mob-detail-link"
                       href={'https://www.google.com/maps/dir/?api=1&destination=' + selectata.coordonate[0] + ',' + selectata.coordonate[1]}
                       target="_blank" rel="noopener noreferrer">
                        🗺 Vezi traseul pe Google Maps
                    </a>
                </div>
            )}

            {/* FAB toggle */}
            <button
                className={'mob-fab' + (sheetState !== 'closed' ? ' sheet-open' : '')}
                onClick={() => setSheetState(s => s === 'closed' ? 'peek' : 'closed')}
                aria-label="Lista locații">
                {sheetState !== 'closed' ? '✕' : '☰'}
                <span className="fab-badge">{filtrate.length}</span>
            </button>

            {/* Bottom Sheet */}
            <div className={'mob-sheet ' + sheetState}>
                {/* Handle drag */}
                <div className="mob-handle"
                     onTouchStart={onTouchStart}
                     onTouchMove={onTouchMove}
                     onTouchEnd={onTouchEnd}
                     onClick={() => setSheetState(s => s === 'open' ? 'peek' : 'open')}>
                    <div className="mob-handle-bar"/>
                </div>

                <div className="mob-sheet-hdr">
                    <div className="mob-sheet-title">Harta <em>Cristeștilor</em></div>
                    <div className="mob-sheet-sub">Raionul Nisporeni · {filtrate.length} locații</div>
                </div>

                <div className="mob-search">
                    <div className="s-wrap">
                        <input className="s-input" type="text"
                               placeholder="Caută o locație..."
                               value={cautare} onChange={e => setCautare(e.target.value)} />
                        <span className="s-ico">⌕</span>
                    </div>
                </div>

                <div className="mob-filters">
                    {CATEGORII.map(c => (
                        <button key={c} className={'f-btn' + (categorie===c?' on':'')}
                                onClick={() => setCategorie(c)}>
                            {c !== 'Toate' && META[c]?.emoji + ' '}{c}
                        </button>
                    ))}
                </div>

                <div className="mob-list">
                    {filtrate.length === 0 && (
                        <div className="empty" style={{paddingTop:'1.5rem'}}>
                            <p>Nicio locație găsită.</p>
                        </div>
                    )}
                    {filtrate.map(loc => {
                        const m = META[loc.categorie];
                        return (
                            <button key={loc.id}
                                    className={'mob-loc-card' + (selectata?.id===loc.id?' sel':'')}
                                    onClick={() => alege(loc)}>
                                <div className="mob-loc-icon" style={{background: m?.bg}}>
                                    {m?.emoji}
                                </div>
                                <div className="mob-loc-body">
                                    <span className="mob-loc-name">{loc.nume}</span>
                                    <p className="mob-loc-desc">{loc.descriere}</p>
                                </div>
                                <span className="mob-loc-arrow">›</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}