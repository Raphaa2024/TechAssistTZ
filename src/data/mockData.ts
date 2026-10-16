import { Technician, WardLocation, ServiceTicket, RegisteredOrganization } from '../types';

// ==========================================
// MAENEO / MITAA (WARDS) - DAR ES SALAAM & MWANZA
// ==========================================
export const WARDS: WardLocation[] = [
  // --- MKOA WA DAR ES SALAAM ---
  { name: 'Kinondoni', district: 'Kinondoni (Dar)', x: 48, y: 40 },
  { name: 'Sinza', district: 'Ubungo (Dar)', x: 38, y: 44 },
  { name: 'Mwenge', district: 'Kinondoni (Dar)', x: 42, y: 32 },
  { name: 'Mikocheni', district: 'Kinondoni (Dar)', x: 55, y: 30 },
  { name: 'Mbezi Beach', district: 'Kinondoni (Dar)', x: 50, y: 15 },
  { name: 'Tegeta', district: 'Kinondoni (Dar)', x: 44, y: 6 },
  { name: 'Kariakoo', district: 'Ilala (Dar)', x: 58, y: 65 },
  { name: 'Posta / CBD', district: 'Ilala (Dar)', x: 68, y: 60 },
  { name: 'Ubungo', district: 'Ubungo (Dar)', x: 30, y: 48 },
  { name: 'Tabata', district: 'Ilala (Dar)', x: 32, y: 68 },
  { name: 'Temeke', district: 'Temeke (Dar)', x: 54, y: 80 },

  // --- MKOA WA MWANZA ---
  { name: 'Nyamagana / CBD', district: 'Nyamagana (Mwanza)', x: 80, y: 30 },
  { name: 'Capripoint', district: 'Nyamagana (Mwanza)', x: 82, y: 28 },
  { name: 'Kirumba', district: 'Ilemela (Mwanza)', x: 84, y: 25 },
  { name: 'Pasiansi', district: 'Ilemela (Mwanza)', x: 86, y: 20 },
  { name: 'Nyegezi', district: 'Nyamagana (Mwanza)', x: 78, y: 40 },
  { name: 'Mkolani', district: 'Nyamagana (Mwanza)', x: 75, y: 45 },
  { name: 'Buzuruga', district: 'Nyamagana (Mwanza)', x: 85, y: 35 },
  { name: 'Igoma', district: 'Nyamagana (Mwanza)', x: 90, y: 38 },
];

export function calculateDistance(loc1: WardLocation, loc2: WardLocation): {
  km: number;
  isFar: boolean;
  transitMinutes: number;
  transportFee: number;
} {
  const dx = loc1.x - loc2.x;
  const dy = loc1.y - loc2.y;
  const rawDist = Math.sqrt(dx * dx + dy * dy);
  
  const km = Math.max(1.5, Math.round(rawDist * 0.35 * 10) / 10);
  const isFar = km >= 8.5;
  const transitMinutes = Math.round(6 + (km / 18) * 60);
  const transportFee = Math.round(3000 + km * 750);

  return { km, isFar, transitMinutes, transportFee };
}

// ==========================================
// TAASISI NA WATEJA WA MFANO
// ==========================================
export const INITIAL_ORGANIZATIONS: RegisteredOrganization[] = [
  {
    id: 'org-1',
    name: 'Chuo Cha Usimamizi wa Fedha (IFM) - Mwanza Campus',
    category: 'Chuo / Taasisi',
    contactPerson: 'Mr. Raphael Megera (SICTO)',
    phone: '+255 712 725 417',
    email: 'raphael.megera@ifm.ac.tz',
    wardLocation: WARDS[13], // Kirumba (Mwanza)
    deviceWorkstationsCount: 85,
    registrationNumber: 'EDU-TZ-2018-091',
    notes: 'Maabara 3 za kompyuta, Serva ya Chuo, na mtandao wa Wi-Fi wa wanafunzi.',
    createdAt: '2026-08-10',
  },
  {
    id: 'org-mwanza-1',
    name: 'Chuo Kikuu Cha SAUT - Mwanza (Main Campus)',
    category: 'Chuo / Taasisi',
    contactPerson: 'Eng. Godfrey Kwayu (IT Manager)',
    phone: '+255 755 400 900',
    email: 'ict@saut.ac.tz',
    wardLocation: WARDS[15], // Nyegezi (Mwanza)
    deviceWorkstationsCount: 60,
    registrationNumber: 'EDU-MZA-2019-102',
    notes: 'Maabara ya Kompyuta Nyegezi Campus, Mfumo wa Maktaba na Wi-Fi ya Chuo.',
    createdAt: '2026-09-01',
  },
  {
    id: 'org-school',
    name: 'Shule ya Sekondari Azania & ICT Center',
    category: 'Shule',
    contactPerson: 'Mwl. Peter Shirima (Mwalimu Mkuu wa TEHAMA)',
    phone: '+255 788 123 456',
    email: 'info@azaniasec.sc.tz',
    wardLocation: WARDS[0], // Kinondoni
    deviceWorkstationsCount: 42,
    registrationNumber: 'SCH-TZ-7721',
    notes: 'Kompyuta 42 za wanafunzi, printa 3 za ofisi ya walimu, na projector ya ukumbi.',
    createdAt: '2026-09-18',
  },
  {
    id: 'org-church',
    name: 'Kanisa Kuu la KKKT - Usharika wa Kijitonyama',
    category: 'Kanisa / Msikiti',
    contactPerson: 'Mzee wa Kanisa / Msimamizi wa Vyombo (Sound & Media)',
    phone: '+255 712 345 678',
    email: 'media@kkktkijitonyama.or.tz',
    wardLocation: WARDS[1], // Sinza
    deviceWorkstationsCount: 12,
    registrationNumber: 'REL-CHU-4410',
    notes: 'Kompyuta za ofisi ya Mchungaji, mfumo wa sauti (Digital Mixer), Projectors na vifaa vya Live Stream.',
    createdAt: '2026-09-22',
  },
  {
    id: 'org-mosque',
    name: 'Msikiti Mkuu wa Maamur - Upanga / Kariakoo',
    category: 'Kanisa / Msikiti',
    contactPerson: 'Ustadh Omar Bakari (Msimamizi wa Taasisi)',
    phone: '+255 777 980 112',
    email: 'admin@maamurmosque.tz',
    wardLocation: WARDS[6], // Kariakoo
    deviceWorkstationsCount: 8,
    registrationNumber: 'REL-MSQ-2204',
    notes: 'Mfumo wa sauti (PA System & Amplifiers), Kompyuta za Ofisi na Kamera za Usalama (CCTV).',
    createdAt: '2026-09-25',
  },
  {
    id: 'org-company',
    name: 'Kilimanjaro Logistics & Clearing Ltd',
    category: 'Kampuni / Ofisi',
    contactPerson: 'Zulfa Kassim (HR & Operations)',
    phone: '+255 713 445 221',
    email: 'info@kilimanjaro-logistics.co.tz',
    wardLocation: WARDS[7], // Posta / CBD
    deviceWorkstationsCount: 24,
    registrationNumber: 'BRELA-99210-LLC',
    notes: 'Ofisi kuu ya ghorofa ya 3, Kompyuta za Dell, Mikrotik Router na Printa za mtandao.',
    createdAt: '2026-09-02',
  },
  {
    id: 'org-citizen',
    name: 'Mussa Jumanne (Mtu Binafsi)',
    category: 'Mtu Binafsi',
    contactPerson: 'Mussa Jumanne',
    phone: '+255 715 009 231',
    email: 'mussa.jumanne@gmail.com',
    wardLocation: WARDS[3], // Mikocheni
    deviceWorkstationsCount: 3,
    registrationNumber: 'NIDA-19940212-3211',
    notes: 'Laptop ya kazi ya HP, Simu ya Samsung, na Printa ndogo ya nyumbani ya Canon.',
    createdAt: '2026-10-01',
  }
];

// ==========================================
// MAFUNDI WALIOSAJILIWA (FUNDI WA KWANZA NI RAPHAEL MEGERA)
// ==========================================
export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'fundi-raphael',
    name: 'Raphael Megera (Eng.)',
    phone: '+255 712 725 417',
    email: 'raphael.megera@techassist.co.tz',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    trade: 'Kompyuta & Laptop',
    specialization: 'Kompyuta, Laptop, Printers, Networking, Systems Administration & AI Triage Support',
    certifications: ['TechAssistTZ Lead Engineer', 'CompTIA A+', 'Cisco CCNA'],
    baseLocation: WARDS[13], // Kirumba (Mwanza)
    currentLocation: WARDS[13],
    rating: 5.0,
    reviewCount: 120,
    completedJobs: 250,
    baseFee: 30000,
    isAvailable: true,
    consecutiveMissedCalls: 0,
    isExpelled: false,
  },
  {
    id: 'fundi-1',
    name: 'Kelvin Mrema (Eng.)',
    phone: '+255 714 882 109',
    email: 'kelvin.mrema@techassist.co.tz',
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    trade: 'Kompyuta & Laptop',
    specialization: 'Hardware, Windows/macOS, Screen Replacement, Motherboard BGA, Data Recovery',
    certifications: ['CompTIA A+', 'Microsoft Certified Systems Engineer (MCSE)'],
    baseLocation: WARDS[0], // Kinondoni
    currentLocation: WARDS[0],
    rating: 4.9,
    reviewCount: 76,
    completedJobs: 182,
    baseFee: 30000,
    isAvailable: true,
    consecutiveMissedCalls: 0,
    isExpelled: false,
  },
  {
    id: 'fundi-2',
    name: 'Neema Kimaro (Print & Copy Tech)',
    phone: '+255 754 112 334',
    email: 'neema.kimaro@techassist.co.tz',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    trade: 'Printers & Photocopy',
    specialization: 'Canon, HP LaserJet, Epson EcoTank, Paper Jam Fix, Toner Refill & Heavy Duty Ricoh/Kyocera',
    certifications: ['HP Certified Service Specialist', 'Canon Office System Master'],
    baseLocation: WARDS[1], // Sinza
    currentLocation: WARDS[1],
    rating: 4.9,
    reviewCount: 52,
    completedJobs: 139,
    baseFee: 35000,
    isAvailable: true,
    consecutiveMissedCalls: 0,
    isExpelled: false,
  },
  {
    id: 'fundi-3',
    name: 'Baraka Mwamba (Network Architect)',
    phone: '+255 688 443 201',
    email: 'baraka.mwamba@techassist.co.tz',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    trade: 'Networking & Wi-Fi',
    specialization: 'Mikrotik, Cisco Routers, LAN Cabling Cat6, Ubiquiti UniFi, Fiber Optic Splicing, Firewall',
    certifications: ['Cisco CCNA', 'MikroTik Certified Network Associate (MTCNA)'],
    baseLocation: WARDS[7], // Posta / CBD
    currentLocation: WARDS[7],
    rating: 4.8,
    reviewCount: 44,
    completedJobs: 98,
    baseFee: 40000,
    isAvailable: true,
    consecutiveMissedCalls: 0,
    isExpelled: false,
  },
  {
    id: 'fundi-mwanza',
    name: 'Juma Charles (Mwanza Tech Hub)',
    phone: '+255 768 554 112',
    email: 'juma.charles@techassist.co.tz',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    trade: 'Kompyuta & Laptop',
    specialization: 'Server Setup, Networking, PC Maintenance, POS Systems (Mwanza Region)',
    certifications: ['CompTIA Network+', 'Cisco CCNA'],
    baseLocation: WARDS[11], // Nyamagana (Mwanza)
    currentLocation: WARDS[11],
    rating: 4.9,
    reviewCount: 35,
    completedJobs: 80,
    baseFee: 30000,
    isAvailable: true,
    consecutiveMissedCalls: 0,
    isExpelled: false,
  }
];

// ==========================================
// TIKETI ZA HUDUMA (SERVICE TICKETS)
// ==========================================
export const INITIAL_TICKETS: ServiceTicket[] = [
  {
    id: 'ticket-101',
    tokenNumber: 'TATZ-4821',
    customerId: 'cust-1',
    customerName: 'Dkt. Emmanuel Mushi',
    customerOrgType: 'Chuo / Taasisi',
    customerOrgName: 'Chuo Cha Usimamizi wa Fedha (IFM) - Mwanza Campus',
    customerPhone: '+255 754 889 001',
    customerLocation: WARDS[13], // Kirumba (Mwanza)
    customerAddressDetail: 'IFM Mwanza Campus, Jengo la ICT, Ghorofa ya 1, Lab 2',
    technicianId: 'fundi-raphael', // Imefungamanishwa na akaunti yako!
    technicianName: 'Raphael Megera (Eng.)',
    technicianPhone: '+255 712 725 417',
    trade: 'Kompyuta & Laptop',
    deviceType: 'Canon imageRUNNER 2520 Network Photocopier',
    serviceDescription: 'Mashine inatoa hitilafu ya "Paper Jam in Tray 2" na kutoa mistari meusi kila mara karatasi inapochapishwa.',
    aiTroubleshootingSummary: 'Mteja alichat na AI: Hatua za awali za kusafisha rollers na kutoa karatasi zilizokwama zimefanyika lakini sensor ya feed roller inaonyesha uchakavu au hitilafu ya drum unit.',
    aiRecommendedAction: 'Inahitaji kubadilisha Pickup Roller na ukaguzi wa Drum & Blade ya wino.',
    distanceKm: 2.8,
    isFarDistance: false,
    estimatedTransitMinutes: 14,
    travelTimeAllowedMinutes: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    paymentConfirmedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    serviceFee: 35000,
    distanceTransportFee: 5100,
    totalAmount: 40100,
    paymentStatus: 'HELD_BY_COMPANY_ESCROW',
    paymentProvider: 'M-Pesa',
    transactionRef: 'MP-90182741X',
    status: 'PAID_WAITING_DISPATCH',
    invoice: {
      id: 'inv-101',
      invoiceNumber: 'INV-TATZ-4821',
      ticketId: 'ticket-101',
      technicianId: 'fundi-raphael',
      technicianName: 'Raphael Megera (Eng.)',
      customerName: 'Dkt. Emmanuel Mushi (IFM)',
      items: [
        { id: '1', description: 'Ukaguzi na Matengenezo ya Canon iR2520 (Ufundi)', quantity: 1, unitPrice: 35000, total: 35000 },
        { id: '2', description: 'Gharama ya Usafiri na Dispatch ya Vifaa', quantity: 1, unitPrice: 5100, total: 5100 },
      ],
      subtotal: 35000,
      transportFee: 5100,
      totalAmount: 40100,
      platformCommissionPercent: 15,
      platformCommissionAmount: 6015,
      technicianPayoutAmount: 34085,
      status: 'PAID_ESCROW',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    isReassignedToken: false,
    routeProgress: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        senderName: 'Mfumo wa TechAssistTZ',
        text: 'Ankara Na. INV-TATZ-4821 ya TZS 40,100 imelipwa na fedha zimewekwa salama chini ya Escrow ya Kampuni.',
        timestamp: '09:50 AM',
      },
      {
        id: 'msg-2',
        sender: 'customer',
        senderName: 'Dkt. Emmanuel Mushi',
        text: 'Habari Eng. Raphael Megera, nimemaliza kulipia Ankara. Tuna mitihani ya wanafunzi kesho asubuhi kwa hiyo mashine hii ni muhimu sana ifanye kazi.',
        timestamp: '09:52 AM',
      }
    ]
  }
];