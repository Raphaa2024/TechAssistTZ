import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Technician, 
  ServiceTicket, 
  UserRole, 
  PaymentProvider, 
  WardLocation, 
  TradeCategory,
  RegisteredOrganization,
  ClientCategory,
  TechInvoice,
  InvoiceItem
} from '../types';
import { INITIAL_TECHNICIANS, INITIAL_TICKETS, WARDS, INITIAL_ORGANIZATIONS, calculateDistance } from '../data/mockData';
import { calculateTechAssistDistance } from '../utils/geo';
import { analyzeProblemWithAI } from '../services/aiService';
import { playSound } from '../utils/audio';

export interface CurrentUserSession {
  name: string;
  category: ClientCategory | 'Mtaalamu wa TEHAMA' | 'Admin';
  phone: string;
  email?: string;
  wardName: string;
  role: UserRole;
  orgName?: string;
  contactPerson?: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeFundiId: string;
  setActiveFundiId: (id: string) => void;
  technicians: Technician[];
  tickets: ServiceTicket[];
  organizations: RegisteredOrganization[];
  activeTicket: ServiceTicket | null;
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  currentUserSession: CurrentUserSession | null;
  setCurrentUserSession: (session: CurrentUserSession | null) => void;
  loginUser: (data: { category: string; identifier: string; name?: string; ward?: string }) => void;
  logoutUser: () => void;
  
  // Actions
  createNewTicket: (params: {
    customerName: string;
    customerPhone: string;
    customerOrgType?: ClientCategory;
    customerOrgName?: string;
    customerLocation: WardLocation;
    customerAddressDetail: string;
    technicianId: string;
    trade: TradeCategory;
    deviceType?: string;
    serviceDescription: string;
    aiTroubleshootingSummary?: string;
  }) => ServiceTicket;
  
  registerOrganization: (data: {
    name: string;
    category: ClientCategory;
    contactPerson: string;
    phone: string;
    email?: string;
    wardName: string;
    deviceWorkstationsCount: number;
    notes?: string;
  }) => void;

  registerTechnician: (data: {
    name: string;
    phone: string;
    email?: string;
    trade: TradeCategory;
    specialization: string;
    wardName: string;
    baseFee: number;
  }) => void;

  updateTicketInvoice: (ticketId: string, invoiceData: {
    items: InvoiceItem[];
    subtotal: number;
    transportFee: number;
    totalAmount: number;
    platformCommissionPercent: number;
    platformCommissionAmount: number;
    technicianPayoutAmount: number;
  }) => void;

  payCompanyEscrow: (ticketId: string, provider: PaymentProvider) => void;
  startJourney: (ticketId: string) => void;
  advanceJourneyProgress: (ticketId: string, progressIncrement: number) => void;
  markArrived: (ticketId: string) => void;
  startJobWork: (ticketId: string) => void;
  completeJob: (ticketId: string, rating?: number, feedback?: string) => void;
  
  fundiReportCannotAttend: (ticketId: string, reason: string) => {
    reassigned: boolean;
    newTechnicianName?: string;
    technicianExpelled: boolean;
    strikes: number;
  };

  reinstateTechnician: (technicianId: string) => void;
  resetTechnicianStrikes: (technicianId: string) => void;
  sendMessage: (ticketId: string, sender: 'customer' | 'technician' | 'system', text: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_TECH = 'techassist_technicians_v4';
const STORAGE_KEY_TICKETS = 'techassist_tickets_v4';
const STORAGE_KEY_ORGS = 'techassist_orgs_v4';
const STORAGE_KEY_ROLE = 'techassist_role_v4';
const STORAGE_KEY_ACTIVE_FUNDI = 'techassist_active_fundi_v4';
const STORAGE_KEY_USER_SESSION = 'techassist_user_session_v4';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEY_ROLE) as UserRole) || 'landing';
  });

  // Fundi wa kwanza anakuwa RAPHAEL MEGERA ('fundi-raphael')
  const [activeFundiId, setActiveFundiIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_FUNDI) || 'fundi-raphael';
  });

  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const [currentUserSession, setCurrentUserSessionState] = useState<CurrentUserSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER_SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const setCurrentUserSession = (session: CurrentUserSession | null) => {
    setCurrentUserSessionState(session);
    if (session) {
      localStorage.setItem(STORAGE_KEY_USER_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER_SESSION);
    }
  };

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TECH);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TECHNICIANS;
      }
    }
    return INITIAL_TECHNICIANS;
  });

  const [tickets, setTickets] = useState<ServiceTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TICKETS;
      }
    }
    return INITIAL_TICKETS;
  });

  const [organizations, setOrganizations] = useState<RegisteredOrganization[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORGANIZATIONS;
      }
    }
    return INITIAL_ORGANIZATIONS;
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(() => {
    return tickets[0]?.id || null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TECH, JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORGS, JSON.stringify(organizations));
  }, [organizations]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEY_ROLE, newRole);
    playSound('click');
  };

  const setActiveFundiId = (id: string) => {
    setActiveFundiIdState(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_FUNDI, id);
    playSound('click');
  };

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  // Organization registration
  const registerOrganization = (data: {
    name: string;
    category: ClientCategory;
    contactPerson: string;
    phone: string;
    email?: string;
    wardName: string;
    deviceWorkstationsCount: number;
    notes?: string;
  }) => {
    const ward = WARDS.find((w) => w.name === data.wardName) || WARDS[0];
    const newOrg: RegisteredOrganization = {
      id: `org-${Date.now()}`,
      name: data.name,
      category: data.category,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email || 'info@domain.tz',
      wardLocation: ward,
      deviceWorkstationsCount: data.deviceWorkstationsCount,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    setOrganizations((prev) => [newOrg, ...prev]);
    setCurrentUserSession({
      name: data.contactPerson || data.name,
      category: data.category,
      phone: data.phone,
      email: data.email,
      wardName: ward.name,
      role: 'mteja',
      orgName: data.name,
      contactPerson: data.contactPerson,
    });
  };

  // Technician registration
  const registerTechnician = (data: {
    name: string;
    phone: string;
    email?: string;
    trade: TradeCategory;
    specialization: string;
    wardName: string;
    baseFee: number;
  }) => {
    const ward = WARDS.find((w) => w.name === data.wardName) || WARDS[0];
    const newTech: Technician = {
      id: `fundi-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      trade: data.trade,
      specialization: data.specialization,
      baseLocation: ward,
      currentLocation: ward,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      baseFee: data.baseFee,
      isAvailable: true,
      consecutiveMissedCalls: 0,
      isExpelled: false,
    };
    setTechnicians((prev) => [newTech, ...prev]);
    setActiveFundiId(newTech.id);
    setCurrentUserSession({
      name: newTech.name,
      category: 'Mtaalamu wa TEHAMA',
      phone: newTech.phone,
      email: newTech.email,
      wardName: ward.name,
      role: 'fundi',
    });
  };

  const loginUser = (data: {
    category: string;
    identifier: string;
    name?: string;
    ward?: string;
  }) => {
    playSound('click');
    if (data.category === 'Admin' || data.identifier.toLowerCase().includes('admin')) {
      setCurrentUserSession({
        name: data.name || 'Msimamizi Mkuu wa Mfumo',
        category: 'Admin',
        phone: data.identifier,
        wardName: 'Posta / CBD',
        role: 'admin',
      });
      setRole('admin');
      return;
    }

    if (data.category === 'Mtaalamu wa TEHAMA' || data.category === 'fundi') {
      const foundFundi =
        technicians.find(
          (t) =>
            t.phone.includes(data.identifier) ||
            (t.email && t.email.toLowerCase().includes(data.identifier.toLowerCase())) ||
            t.name.toLowerCase().includes(data.identifier.toLowerCase())
        ) || technicians[0]; // defaults to Raphael Megera
      
      setActiveFundiId(foundFundi.id);
      setCurrentUserSession({
        name: foundFundi.name,
        category: 'Mtaalamu wa TEHAMA',
        phone: foundFundi.phone,
        email: foundFundi.email,
        wardName: foundFundi.baseLocation.name,
        role: 'fundi',
      });
      setRole('fundi');
      return;
    }

    // Customer or Organization login
    const foundOrg =
      organizations.find(
        (o) =>
          o.phone.includes(data.identifier) ||
          (o.email && o.email.toLowerCase().includes(data.identifier.toLowerCase())) ||
          o.category === data.category ||
          o.name.toLowerCase().includes(data.identifier.toLowerCase())
      ) ||
      organizations.find((o) => o.category === data.category) ||
      organizations[0];

    const cat = (data.category as ClientCategory) || foundOrg.category;
    setCurrentUserSession({
      name: data.name || foundOrg.contactPerson || foundOrg.name,
      category: cat,
      phone: data.identifier || foundOrg.phone,
      email: foundOrg.email,
      wardName: data.ward || foundOrg.wardLocation.name,
      role: 'mteja',
      orgName: foundOrg.name,
      contactPerson: foundOrg.contactPerson,
    });
    setRole('mteja');
  };

  const logoutUser = () => {
    playSound('click');
    setCurrentUserSession(null);
    setRole('landing');
  };

  // Update Ticket Invoice & send to customer
  const updateTicketInvoice = (ticketId: string, invoiceData: {
    items: InvoiceItem[];
    subtotal: number;
    transportFee: number;
    totalAmount: number;
    platformCommissionPercent: number;
    platformCommissionAmount: number;
    technicianPayoutAmount: number;
  }) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newInvoice: TechInvoice = {
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-${t.tokenNumber}`,
          ticketId: t.id,
          technicianId: t.technicianId,
          technicianName: t.technicianName,
          customerName: t.customerName,
          items: invoiceData.items,
          subtotal: invoiceData.subtotal,
          transportFee: invoiceData.transportFee,
          totalAmount: invoiceData.totalAmount,
          platformCommissionPercent: invoiceData.platformCommissionPercent,
          platformCommissionAmount: invoiceData.platformCommissionAmount,
          technicianPayoutAmount: invoiceData.technicianPayoutAmount,
          status: 'SENT_TO_CUSTOMER',
          createdAt: new Date().toISOString(),
        };

        return {
          ...t,
          invoice: newInvoice,
          totalAmount: invoiceData.totalAmount,
          serviceFee: invoiceData.subtotal,
          status: 'INVOICE_SENT' as const,
          messages: [
            ...t.messages,
            {
              id: `msg-inv-${Date.now()}`,
              sender: 'technician' as const,
              senderName: t.technicianName,
              text: `Nimekutumia Ankara ya gharama za matengenezo: TZS ${invoiceData.totalAmount.toLocaleString()} (Inajumuisha ufundi na vipuri/usafiri). Tafadhali weka fedha kwenye Escrow ya mfumo ili nianze safari.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        };
      })
    );
  };

  // 1. Create a new service ticket
  const createNewTicket = (params: {
    customerName: string;
    customerPhone: string;
    customerOrgType?: ClientCategory;
    customerOrgName?: string;
    customerLocation: WardLocation;
    customerAddressDetail: string;
    technicianId: string;
    trade: TradeCategory;
    deviceType?: string;
    serviceDescription: string;
    aiTroubleshootingSummary?: string;
  }): ServiceTicket => {
    const tech = technicians.find((t) => t.id === params.technicianId) || technicians[0];
    const calc = calculateTechAssistDistance(tech.currentLocation.name, params.customerLocation.name);
    const tokenNumber = `TATZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: ServiceTicket = {
      id: `ticket-${Date.now()}`,
      tokenNumber,
      customerId: 'cust-current',
      customerName: params.customerName || 'Mteja',
      customerOrgType: params.customerOrgType || 'Mtu Binafsi',
      customerOrgName: params.customerOrgName,
      customerPhone: params.customerPhone || '+255 700 000 000',
      customerLocation: params.customerLocation,
      customerAddressDetail: params.customerAddressDetail,
      technicianId: tech.id,
      technicianName: tech.name,
      technicianPhone: tech.phone,
      trade: params.trade,
      deviceType: params.deviceType || 'Kompyuta / Kifaa cha TEHAMA',
      serviceDescription: params.serviceDescription,
      aiTroubleshootingSummary: params.aiTroubleshootingSummary,
      distanceKm: calc.km,
      isFarDistance: calc.isFar,
      estimatedTransitMinutes: calc.transitMinutes,
      travelTimeAllowedMinutes: Math.round(calc.transitMinutes * 1.3),
      createdAt: new Date().toISOString(),
      serviceFee: tech.baseFee,
      distanceTransportFee: calc.transportFee,
      totalAmount: tech.baseFee + calc.transportFee,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
      routeProgress: 0,
      isReassignedToken: false,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'system',
          senderName: 'Mfumo wa TechAssistTZ',
          text: `Ombi la huduma (${params.trade}) limetengenezwa. Token ya mfumo: ${tokenNumber}. Mtaalamu ${tech.name} amearifiwa kupitia Admin na atatuma Ankara ya matengenezo.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    // Run AI troubleshooting analysis
    analyzeProblemWithAI(params.trade, params.serviceDescription, params.customerLocation.name)
      .then((aiResult) => {
        setTickets((prev) =>
          prev.map((t) => {
            if (t.id !== newTicket.id) return t;
            return {
              ...t,
              aiDiagnosis: aiResult.diagnosis,
              aiSafetyAdvice: aiResult.safetyAdvice,
              aiSeverity: aiResult.severity,
              aiRecommendedTools: aiResult.recommendedTools,
              messages: [
                ...t.messages,
                {
                  id: `msg-ai-${Date.now()}`,
                  sender: 'system',
                  senderName: 'TechAssist AI Uchunguzi',
                  text: `🤖 UCHUNGUZI WA AWALI WA AI: ${aiResult.diagnosis} | ⚠️ TAHADHARI: ${aiResult.safetyAdvice}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              ]
            };
          })
        );
      })
      .catch((err) => console.warn('AI analysis error', err));

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    playSound('payment');
    return newTicket;
  };

  // 2. Customer pays into company escrow
  const payCompanyEscrow = (ticketId: string, provider: PaymentProvider) => {
    const ref = `${provider.slice(0, 2).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const updatedMessages = [
          ...t.messages,
          {
            id: `msg-${Date.now()}`,
            sender: 'system' as const,
            senderName: 'Uthibitisho wa Malipo ya Kampuni',
            text: `PESA IMESHAPOKEELEWA! Malipo ya TZS ${t.totalAmount.toLocaleString()} kupitia ${provider} (Ref: ${ref}) yamekaguliwa na kuthibitishwa na Kampuni. Fundi ${t.technicianName} anapewa ujumbe wa kuanza safari sasa!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ];

        return {
          ...t,
          paymentStatus: 'HELD_BY_COMPANY_ESCROW' as const,
          paymentProvider: provider,
          transactionRef: ref,
          paymentConfirmedAt: new Date().toISOString(),
          status: 'PAID_WAITING_DISPATCH' as const,
          messages: updatedMessages,
        };
      })
    );

    playSound('payment');
  };

  // 3. Fundi receives notice and starts journey
  const startJourney = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'EN_ROUTE' as const,
          journeyStartedAt: new Date().toISOString(),
          etaMinutesRemaining: t.estimatedTransitMinutes,
          routeProgress: 10,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'technician' as const,
              senderName: t.technicianName,
              text: `Nimepata taarifa kuwa pesa imelipwa kwa kampuni. Nimeanza safari kuelekea ${t.customerLocation.name}. Muda unaotarajiwa ni takribani dakika ${t.estimatedTransitMinutes}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        };
      })
    );

    playSound('dispatch');
  };

  // 4. Advance journey progress
  const advanceJourneyProgress = (ticketId: string, progressIncrement: number) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const nextProgress = Math.min(100, (t.routeProgress || 0) + progressIncrement);
        const eta = Math.max(1, Math.round(t.estimatedTransitMinutes * (1 - nextProgress / 100)));

        if (nextProgress >= 100) {
          playSound('arrival');
          return {
            ...t,
            routeProgress: 100,
            status: 'ARRIVED' as const,
            arrivedAt: new Date().toISOString(),
            etaMinutesRemaining: 0,
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'technician' as const,
                senderName: t.technicianName,
                text: `Nimefika eneo lako (${t.customerAddressDetail || t.customerLocation.name}). Nipo mlangoni!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ]
          };
        }

        return {
          ...t,
          routeProgress: nextProgress,
          etaMinutesRemaining: eta,
        };
      })
    );
  };

  // 5. Fundi arrives
  const markArrived = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'ARRIVED' as const,
          routeProgress: 100,
          arrivedAt: new Date().toISOString(),
          etaMinutesRemaining: 0,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'technician' as const,
              senderName: t.technicianName,
              text: 'Nimefika rasmi eneo la mteja. Tayari kuanza uchunguzi na utatuzi wa kazi.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        };
      })
    );
    playSound('arrival');
  };

  // 6. Start job work
  const startJobWork = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'IN_PROGRESS' as const,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'system' as const,
              senderName: 'Ufuatiliaji wa Kazi',
              text: 'Fundi ameanza kufanyia kazi hitilafu iliyoripotiwa.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        };
      })
    );
    playSound('click');
  };

  // 7. Complete job, issue Electronic Receipt & release Escrow payout to Fundi
  const completeJob = (ticketId: string, rating: number = 5, feedback: string = 'Kazi nzuri, nimeridhika kikamilifu!') => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        
        const receiptNumber = `RCP-TATZ-${Math.floor(100000 + Math.random() * 900000)}`;
        const completedDate = new Date().toISOString();
        const payoutAmount = t.invoice?.technicianPayoutAmount || Math.round(t.totalAmount * 0.85);

        return {
          ...t,
          status: 'COMPLETED' as const,
          completedAt: completedDate,
          paymentStatus: 'RELEASED_TO_FUNDI' as const,
          rating,
          feedback,
          receipt: {
            receiptNumber,
            issuedAt: completedDate,
            customerName: t.customerName,
            customerOrgName: t.customerOrgName,
            technicianName: t.technicianName,
            serviceDescription: t.serviceDescription,
            subtotal: t.serviceFee,
            transportFee: t.distanceTransportFee,
            totalPaid: t.totalAmount,
            paymentProvider: t.paymentProvider || 'M-Pesa / Tigo Pesa',
            transactionRef: t.transactionRef || `REF-${Date.now()}`,
            tinNumber: '142-990-812',
            vrnNumber: '40-098211-Z',
            verificationCode: `TRA-EFD-${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'system' as const,
              senderName: 'TechAssistTZ Escrow System',
              text: `🎉 KAZI IMEKAMILIKA NA KUTHIBITISHWA! Mteja amethibitisha kuridhika (Nyota ${rating}/5). Fedha ya TZS ${payoutAmount.toLocaleString()} imeachiwa kutoka Escrow na kutumwa kwa Fundi ${t.technicianName}. Risiti ya Kidigitali (#${receiptNumber}) imezalishwa kwa mteja.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        };
      })
    );

    const completedTicket = tickets.find((t) => t.id === ticketId);
    if (completedTicket) {
      setTechnicians((prev) =>
        prev.map((tech) => {
          if (tech.id === completedTicket.technicianId) {
            return {
              ...tech,
              completedJobs: tech.completedJobs + 1,
              consecutiveMissedCalls: 0,
            };
          }
          return tech;
        })
      );
    }

    playSound('payment');
  };

  // 8. Fundi cannot attend -> Reassign ticket & apply 3-strike rule
  const fundiReportCannotAttend = (ticketId: string, reason: string) => {
    const currentTicket = tickets.find((t) => t.id === ticketId);
    if (!currentTicket) {
      return { reassigned: false, technicianExpelled: false, strikes: 0 };
    }

    const currentTech = technicians.find((t) => t.id === currentTicket.technicianId);
    const newStrikeCount = (currentTech?.consecutiveMissedCalls || 0) + 1;
    const isNowExpelled = newStrikeCount >= 3;

    setTechnicians((prev) =>
      prev.map((tech) => {
        if (tech.id === currentTicket.technicianId) {
          return {
            ...tech,
            consecutiveMissedCalls: newStrikeCount,
            isExpelled: isNowExpelled,
            expelledReason: isNowExpelled
              ? 'Akaunti imefungiwa mara moja kwa kushindwa kufika kwenye miito 3 mfululizo (Sera ya Nidhamu ya Kampuni).'
              : undefined,
            expelledDate: isNowExpelled ? new Date().toISOString() : undefined,
          };
        }
        return tech;
      })
    );

    const alternativeTech = technicians.find(
      (t) =>
        t.id !== currentTicket.technicianId &&
        t.trade === currentTicket.trade &&
        !t.isExpelled &&
        t.isAvailable
    ) || technicians.find((t) => t.id !== currentTicket.technicianId && !t.isExpelled) || technicians[0];

    const newDistCalc = calculateDistance(alternativeTech.currentLocation, currentTicket.customerLocation);

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const expulsionNotice = isNowExpelled
          ? `⚠️ ONYO KUU: Fundi ${currentTicket.technicianName} amefikisha miito 3 mfululizo bila kuhudhuria na AMEONDOLEWA KWENYE MFUMO mara moja!`
          : `⚠️ Taarifa: Fundi ${currentTicket.technicianName} amepokea Onyo ${newStrikeCount}/3 kwa kushindwa kuhudhuria wito huu.`;

        const newMessages = [
          ...t.messages,
          {
            id: `msg-${Date.now()}-1`,
            sender: 'technician' as const,
            senderName: currentTicket.technicianName,
            text: `SAMAHANI: Sitaweza kufika kwa sababu: "${reason}". Nimewajulisha kampuni ili token ipewe fundi mwingine aliye karibu.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: `msg-${Date.now()}-2`,
            sender: 'system' as const,
            senderName: 'Usimamizi wa Kampuni',
            text: `${expulsionNotice} Token namba ${t.tokenNumber} imehamishiwa kwa haraka kwa Fundi Mpya: ${alternativeTech.name} (${newDistCalc.km} km, takriban dk ${newDistCalc.transitMinutes}). Malipo ya mteja bado yapo salama chini ya Kampuni.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ];

        return {
          ...t,
          status: 'PAID_WAITING_DISPATCH' as const,
          technicianId: alternativeTech.id,
          technicianName: alternativeTech.name,
          technicianPhone: alternativeTech.phone,
          previousTechnicianName: currentTicket.technicianName,
          cancelledByTechnicianId: currentTicket.technicianId,
          cancellationReason: reason,
          isReassignedToken: true,
          routeProgress: 0,
          distanceKm: newDistCalc.km,
          isFarDistance: newDistCalc.isFar,
          estimatedTransitMinutes: newDistCalc.transitMinutes,
          travelTimeAllowedMinutes: Math.round(newDistCalc.transitMinutes * 1.3),
          messages: newMessages,
        };
      })
    );

    playSound('reassigned');

    return {
      reassigned: true,
      newTechnicianName: alternativeTech.name,
      technicianExpelled: isNowExpelled,
      strikes: newStrikeCount,
    };
  };

  // 9. Admin helpers
  const reinstateTechnician = (technicianId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === technicianId) {
          return {
            ...t,
            isExpelled: false,
            consecutiveMissedCalls: 0,
            expelledReason: undefined,
            expelledDate: undefined,
          };
        }
        return t;
      })
    );
    playSound('payment');
  };

  const resetTechnicianStrikes = (technicianId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === technicianId) {
          return {
            ...t,
            consecutiveMissedCalls: 0,
          };
        }
        return t;
      })
    );
    playSound('click');
  };

  const sendMessage = (ticketId: string, sender: 'customer' | 'technician' | 'system', text: string) => {
    if (!text.trim()) return;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const senderName = sender === 'customer' 
      ? ticket.customerName 
      : sender === 'technician' 
      ? ticket.technicianName 
      : 'Mfumo wa TechAssistTZ';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender,
              senderName,
              text: text.trim(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        };
      })
    );
    playSound('click');
  };

  const resetDemoData = () => {
    setTechnicians(INITIAL_TECHNICIANS);
    setTickets(INITIAL_TICKETS);
    setSelectedTicketId(INITIAL_TICKETS[0].id);
    localStorage.removeItem(STORAGE_KEY_TECH);
    localStorage.removeItem(STORAGE_KEY_TICKETS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_FUNDI);
    playSound('dispatch');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeFundiId,
        setActiveFundiId,
        technicians,
        tickets,
        organizations,
        activeTicket,
        selectedTicketId,
        setSelectedTicketId,
        isMobilePreview,
        setIsMobilePreview,
        currentUserSession,
        setCurrentUserSession,
        loginUser,
        logoutUser,
        createNewTicket,
        registerOrganization,
        registerTechnician,
        updateTicketInvoice,
        payCompanyEscrow,
        startJourney,
        advanceJourneyProgress,
        markArrived,
        startJobWork,
        completeJob,
        fundiReportCannotAttend,
        reinstateTechnician,
        resetTechnicianStrikes,
        sendMessage,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};