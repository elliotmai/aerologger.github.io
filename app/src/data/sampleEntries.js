/**
 * Sample spots for local development. The real app reads these from Firestore
 * (see src/lib/entries.jsx). Entries carry no photos here on purpose: a spot
 * shows a real photo or none, never generated art.
 */
export const SAMPLE_ENTRIES = [
  { id: 's1', aircraftType: 'Boeing 747-8F', operator: 'Cargolux', registration: 'LX-VCM', flightNumber: 'CV8421', dateSpotted: '2026-10-04', locationName: 'Anchorage (ANC)', origin: 'ANC', destination: 'LUX', notes: 'Heavy departure on 07R.', photos: [], published: false, createdAt: 8 },
  { id: 's2', aircraftType: 'Airbus A350-1000', operator: 'Qatar Airways', registration: 'A7-ANA', flightNumber: 'QR739', dateSpotted: '2026-09-27', locationName: 'Seattle (SEA)', origin: 'DOH', destination: 'SEA', notes: 'First time seeing the -1000 in person.', photos: [], published: false, lifer: true, createdAt: 7 },
  { id: 's3', aircraftType: 'Boeing 737-9', operator: 'Alaska Airlines', registration: 'N915AK', flightNumber: 'AS318', dateSpotted: '2026-09-14', locationName: 'Seattle (SEA)', origin: 'SEA', destination: 'LAX', notes: 'Special livery, sunset light.', photos: [], published: false, createdAt: 6 },
  { id: 's4', aircraftType: 'Embraer E175', operator: 'Horizon Air', registration: 'N640QX', flightNumber: 'QX2290', dateSpotted: '2026-08-30', locationName: 'Portland (PDX)', origin: 'PDX', destination: 'SEA', notes: '', photos: [], published: false, createdAt: 5 },
  { id: 's5', aircraftType: 'Boeing 787-9', operator: 'Air New Zealand', registration: 'ZK-NZE', flightNumber: 'NZ6', dateSpotted: '2026-08-12', locationName: 'Los Angeles (LAX)', origin: 'LAX', destination: 'AKL', notes: 'Black tail, evening bank.', photos: [], published: false, createdAt: 4 },
  { id: 's6', aircraftType: 'Airbus A220-300', operator: 'Delta Air Lines', registration: 'N301DU', flightNumber: 'DL1184', dateSpotted: '2026-07-22', locationName: 'Salt Lake City (SLC)', origin: 'SLC', destination: 'SEA', notes: 'Quiet engines, smooth taxi.', photos: [], published: false, createdAt: 3 },
];
