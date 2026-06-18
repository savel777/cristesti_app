'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// CSS-ul Leaflet trebuie importat în app/layout.tsx, NU aici
// import 'leaflet/dist/leaflet.css'  <-- șters, mută în layout.tsx

export interface Locatie {
    id: string;
    nume: string;
    categorie: 'Institutii' | 'Servicii' | 'Natura' | 'Atractii';
    descriere: string;
    coordonate: [number, number];
    contact?: string;
}

const culoareCategorie: Record<Locatie['categorie'], string> = {
    Institutii: '#1d4ed8',
    Servicii:   '#b45309',
    Natura:     '#047857',
    Atractii:   '#7c3aed',
};

function creareIcon(categorie: Locatie['categorie'], esteSelectat: boolean) {
    const culoare = culoareCategorie[categorie] || '#374151';
    const marime  = esteSelectat ? 34 : 24;
    const bordura = esteSelectat ? 4  : 3;
    const outline = esteSelectat
        ? 'outline:3px solid ' + culoare + '55; outline-offset:2px;'
        : '';

    const html =
        '<div style="' +
        'width:'         + marime  + 'px;' +
        'height:'        + marime  + 'px;' +
        'background:'    + culoare + ';'   +
        'border:'        + bordura + 'px solid #ffffff;' +
        'border-radius:50%;' +
        'box-shadow:0 2px 6px rgba(0,0,0,0.35);' +
        outline +
        '"></div>';

    return L.divIcon({
        className:   'marker-locatie',
        html:        html,
        iconSize:    [marime, marime],
        iconAnchor:  [marime / 2, marime / 2],
        popupAnchor: [0, -marime / 2],
    });
}

function MutareCamera({ coordonate }: { coordonate: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(coordonate, 17, { duration: 1.2 });
    }, [coordonate, map]);
    return null;
}

function AjustareInitiala({ locatii }: { locatii: Locatie[] }) {
    const map = useMap();
    useEffect(() => {
        if (locatii.length === 0) return;
        const limite = L.latLngBounds(locatii.map((l) => l.coordonate));
        map.fitBounds(limite, { padding: [40, 40], maxZoom: 16 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}

interface HartaProps {
    locatii: Locatie[];
    locatieSelectata: Locatie | null;
    onSelectLocatie: (locatie: Locatie) => void;
}

export default function HartaSatelit({ locatii, locatieSelectata, onSelectLocatie }: HartaProps) {
    // Guard: renderăm harta DOAR după ce suntem pe client (evită eroarea appendChild)
    const [montat, setMontat] = useState(false);
    useEffect(() => { setMontat(true); }, []);

    if (!montat) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-2">
                <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Se inițializează harta...</p>
            </div>
        );
    }

    const centruCristesti: [number, number] = [47.0565, 28.2810];

    return (
        <MapContainer
            key="harta-cristesti"
            center={centruCristesti}
            zoom={14}
            scrollWheelZoom
            className="w-full h-full z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
            />

            {locatii.map((loc) => {
                const esteSelectat = locatieSelectata?.id === loc.id;
                const linkRuta =
                    'https://www.google.com/maps/dir/?api=1&destination=' +
                    loc.coordonate[0] + ',' + loc.coordonate[1];

                return (
                    <Marker
                        key={loc.id}
                        position={loc.coordonate}
                        icon={creareIcon(loc.categorie, esteSelectat)}
                        eventHandlers={{ click: () => onSelectLocatie(loc) }}
                    >
                        <Popup>
                            <div style={{ minWidth: '180px', padding: '4px' }}>
                                <h4 style={{ fontWeight: 600, margin: '0 0 4px 0', fontSize: '14px' }}>
                                    {loc.nume}
                                </h4>
                                <p style={{ color: '#4b5563', fontSize: '12px', margin: '0 0 6px 0' }}>
                                    {loc.descriere}
                                </p>
                                {loc.contact && (
                                    <span style={{
                                        display: 'block',
                                        fontSize: '11px',
                                        fontFamily: 'monospace',
                                        color: '#047857',
                                        background: '#ecfdf5',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        marginBottom: '6px',
                                        width: 'max-content'
                                    }}>
                                        📞 {loc.contact}
                                    </span>
                                )}
                                <a
                                    href={linkRuta}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '12px', color: '#1d4ed8' }}
                                >
                                    🗺️ Vezi traseul pe Google Maps
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            {locatieSelectata && <MutareCamera coordonate={locatieSelectata.coordonate} />}
            <AjustareInitiala locatii={locatii} />
        </MapContainer>
    );
}