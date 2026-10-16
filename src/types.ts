export type TradeCategory = 
  | 'Kompyuta & Laptop'
  | 'Printers & Photocopy'
  | 'Networking & Wi-Fi'
  | 'Simu & Tablets'
  | 'Software & Programming'
  | 'CCTV & Vifaa vya Usalama'
  | 'Umeme & Vifaa vya Ofisi';

export type ClientCategory = 
  | 'Mtu Binafsi'
  | 'Raia wa Kawaida'
  | 'Taasisi ya Elimu'
  | 'Mashuleni'
  | 'Makanisa'
  | 'Misikiti'
  | 'Kampuni / Ofisi'
  | 'Taasisi / Shirika'
  | 'Chuo / Shule';

export type TicketStatus = 
  | 'AI_TROUBLESHOOTING'     // Client is currently diagnosing with AI
  | 'PENDING_INVOICE'        // Escalated to specialist, awaiting itemized quote/invoice
  | 'INVOICE_SENT'           // Specialist sent invoice, awaiting client escrow deposit
  | 'PENDING_PAYMENT'        // Awaiting customer payment
  | 'PAID_WAITING_DISPATCH'  // Payment in company escrow; specialist dispatched
  | 'EN_ROUTE'               // Specialist en route to office/school/home
  | 'ARRIVED'                // Specialist arrived on site
  | 'IN_PROGRESS'            // Maintenance or configuration in progress
  | 'COMPLETED'              // Work verified, funds released (85% to fundi, 15% to platform)
  | 'CANCELLED_BY_FUNDI'     // Specialist reported emergency (consecutive strike recorded)
  | 'REASSIGNED';            // Token passed to another nearby verified specialist

export type PaymentStatus = 
  | 'PENDING'
  | 'HELD_BY_COMPANY_ESCROW'
  | 'RELEASED_TO_FUNDI'
  | 'REFUNDED';

export type PaymentProvider = 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'HaloPesa' | 'Benki / NMB / CRDB' | 'Benki / Kadi';

export interface WardLocation {
  name: string;
  district: string;
  x: number; // 0-100 coordinate on local map grid
  y: number; // 0-100 coordinate on local map grid
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl: string;
  trade: TradeCategory;
  specialization: string;
  certifications?: string[]; // e.g., Cisco CCNA, CompTIA A+, Microsoft Certified
  baseLocation: WardLocation;
  currentLocation: WardLocation;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  baseFee: number;
  isAvailable: boolean;
  consecutiveMissedCalls: number; // 0, 1, 2, or 3 (3 = EXPELLED)
  isExpelled: boolean;
  expelledReason?: string;
  expelledDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'technician' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface TechInvoice {
  id: string;
  invoiceNumber: string; // e.g., INV-TATZ-912
  ticketId: string;
  technicianId: string;
  technicianName: string;
  customerName: string;
  customerOrg?: string;
  items: InvoiceItem[];
  subtotal: number;
  transportFee: number;
  totalAmount: number;
  platformCommissionPercent: number; // 15% platform commission
  platformCommissionAmount: number;  // 15% of total
  technicianPayoutAmount: number;    // 85% of total to technician
  status: 'DRAFT' | 'SENT_TO_CUSTOMER' | 'PAID_ESCROW' | 'RELEASED';
  createdAt: string;
}

export interface AiTroubleshootChat {
  id: string;
  category: TradeCategory;
  deviceModel: string;
  messages: Array<{
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    options?: string[];
  }>;
  aiDiagnosisSummary: string;
  safetyCautions: string[];
  remedyStepsTried: string[];
  isResolved: boolean;
  canEscalateToTicket: boolean;
}

export interface RegisteredOrganization {
  id: string;
  name: string;
  category: ClientCategory;
  contactPerson: string;
  phone: string;
  email: string;
  wardLocation: WardLocation;
  deviceWorkstationsCount: number;
  registrationNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface ServiceTicket {
  id: string;
  tokenNumber: string; // e.g., 'TATZ-9402'
  customerId: string;
  customerName: string;
  customerOrgType: ClientCategory;
  customerOrgName?: string;
  customerPhone: string;
  customerLocation: WardLocation;
  customerAddressDetail: string;
  
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  trade: TradeCategory;
  deviceType: string; // e.g. "Epson L3150 Printer", "Dell PowerEdge Server", "HP EliteBook"
  serviceDescription: string;
  
  // AI Diagnostics & Summary
  aiTranscriptId?: string;
  aiTroubleshootingSummary?: string;
  aiDiagnosis?: string;
  aiSafetyAdvice?: string;
  aiSeverity?: string;
  aiRecommendedTools?: string[];
  aiAttemptedFixes?: string[];
  aiRecommendedAction?: string;
  
  // Distance and Route calculations (Haversine)
  distanceKm: number;
  isFarDistance: boolean;
  estimatedTransitMinutes: number;
  travelTimeAllowedMinutes: number;
  
  // Timestamps & Timers
  createdAt: string;
  invoiceGeneratedAt?: string;
  paymentConfirmedAt?: string;
  journeyStartedAt?: string;
  etaMinutesRemaining?: number;
  arrivedAt?: string;
  completedAt?: string;
  
  // Financials & Invoice
  invoice?: TechInvoice;
  serviceFee: number;
  distanceTransportFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentProvider?: PaymentProvider;
  transactionRef?: string;
  
  // Status & Reassignment
  status: TicketStatus;
  cancellationReason?: string;
  cancelledByTechnicianId?: string;
  previousTechnicianName?: string;
  isReassignedToken: boolean;
  
  // Progress (0 to 100)
  routeProgress: number;
  
  // Customer review
  rating?: number;
  feedback?: string;
  
  // Communication
  messages: ChatMessage[];
}

export type UserRole = 'landing' | 'mteja' | 'fundi' | 'admin' | 'ai_chat' | 'architecture' | 'tests';
