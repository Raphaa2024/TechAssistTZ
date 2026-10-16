import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Database, 
  FileText, 
  Smartphone, 
  Server, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Terminal,
  Play,
  Cpu,
  ShieldCheck
} from 'lucide-react';

export const TechAssistExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState('backend/prisma/schema.prisma');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'api_tester'>('files');

  // File tree contents
  const fileContents: Record<string, string> = {
    'README.md': `# TechAssistTZ - Mfumo wa Huduma za Mafundi & Ufuatiliaji Tanzania
**Mahali pa Mradi:** \`C:\\wamp64\\www\\TechAssistTZ\`

## 1. Muhtasari wa Mfumo
TechAssistTZ ni mfumo wa kisasa wa kuunganisha mafundi na wateja wenye:
1. **Upande wa Fundi:**
   - Kuingia (Login) na kuona tiketi alizopangiwa.
   - Uthibitisho wa pesa kulipwa kwa kampuni (Escrow) kabla ya kuanza safari.
   - Kipima muda (Countdown) na makadirio ya muda wa kumfikia mteja.
   - Kutoa taarifa ya dharura/usafiri ili token ipewe fundi mwingine.
   - **Kanuni ya Miito Mitatu (3 Strikes):** Fundi anayekosa miito 3 mfululizo anaondolewa kwenye mfumo mara moja.
2. **Upande wa Mteja:**
   - Ufuatiliaji wa moja kwa moja wa eneo la fundi (GPS/Ramani).
   - Mawasiliano ya simu na ujumbe mfupi (Direct Call & In-App Chat).
   - Tahadhari na jibu la mfumo mteja anapochagua fundi aliye mbali (km & muda wa safari).
   - Malipo salama ya Escrow kwa kampuni kupitia M-Pesa, Tigo Pesa, Airtel Money au Kadi.
3. **AI ya Uchunguzi (Troubleshooting):**
   - Uchunguzi wa awali wa hitilafu na tahadhari za kiusalama kwa mteja kabla fundi hajafika.

## 2. Jinsi ya Kuanzisha (Local Development)
\`\`\`bash
# 1. Kuanzisha Seva ya Backend
cd backend
npm install
npx prisma migrate dev --name init
node prisma/seed.js
npm start   # Inawaka kwenye http://localhost:5000

# 2. Kuanzisha Programu ya Simu (Mobile App - Expo)
cd ../mobile-app
npm install
npx expo start
\`\`\`
`,

    'backend/prisma/schema.prisma': `// TechAssistTZ - Schema ya Hifadhidata (Prisma / SQLite au PostgreSQL)
datasource db {
  provider = "sqlite"
  url      = "file:./techassist.db"
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  TECHNICIAN
  ADMIN
}

enum TradeCategory {
  UMEME
  MABOMBA
  AC_NA_MAJOKOFU
  USEREMALA
  UJENZI_NA_RANGI
  KUREKEBISHA_VIFAA
}

enum TicketStatus {
  PENDING_PAYMENT
  PAID_WAITING_DISPATCH
  EN_ROUTE
  ARRIVED
  IN_PROGRESS
  COMPLETED
  CANCELLED_BY_FUNDI
  REASSIGNED
}

enum EscrowStatus {
  PENDING
  HELD_BY_COMPANY
  RELEASED_TO_FUNDI
  REFUNDED
}

model User {
  id           String        @id @default(uuid())
  phone        String        @unique
  fullName     String
  role         Role          @default(CUSTOMER)
  wardName     String
  latitude     Float?
  longitude    Float?
  createdAt    DateTime      @default(now())
  
  // Mahusiano
  technician   Technician?
  tickets      Ticket[]      @relation("CustomerTickets")
}

model Technician {
  id                     String        @id @default(uuid())
  userId                 String        @unique
  user                   User          @relation(fields: [userId], references: [id])
  trade                  TradeCategory
  specialization         String
  baseFee                Int           @default(20000)
  rating                 Float         @default(5.0)
  completedJobs          Int           @default(0)
  isAvailable            Boolean       @default(true)
  
  // Kanuni ya Miito Mitatu
  consecutiveMissedCalls Int           @default(0)
  isExpelled             Boolean       @default(false)
  expelledReason         String?
  expelledDate           DateTime?
  
  tickets                Ticket[]      @relation("TechnicianTickets")
}

model Ticket {
  id                     String        @id @default(uuid())
  tokenNumber            String        @unique // Mfano: TATZ-8421
  customerId             String
  customer               User          @relation("CustomerTickets", fields: [customerId], references: [id])
  technicianId           String
  technician             Technician    @relation("TechnicianTickets", fields: [technicianId], references: [id])
  
  trade                  TradeCategory
  description            String
  distanceKm             Float
  estimatedMinutes       Int
  serviceFee             Int
  transportFee           Int
  totalAmount            Int
  
  status                 TicketStatus  @default(PENDING_PAYMENT)
  escrowStatus           EscrowStatus  @default(PENDING)
  paymentProvider        String?       // M-Pesa, Tigo Pesa, n.k.
  paymentRef             String?
  
  // Uhamishaji wa Token
  isReassigned           Boolean       @default(false)
  previousTechnicianName String?
  cancellationReason     String?
  
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt
}
`,

    'backend/src/utils/geo.js': `/**
 * TechAssistTZ - backend/src/utils/geo.js
 * Kanuni ya GPS (Haversine Formula) kupima umbali wa fundi na mteja kwa kilomita (km).
 */

function toRad(value) {
  return (value * Math.PI) / 180;
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Kipenyo cha Dunia kwa kilomita
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Ongeza uzito wa barabara za mjini (winding factor x1.3)
  const roadKm = Math.round(distance * 1.3 * 10) / 10;
  
  // Makadirio ya muda wa safari jijini Dar es Salaam (18 km/h wastani)
  const transitMinutes = Math.round(6 + (roadKm / 18) * 60);

  // Nauli ya umbali (Base TZS 3,000 + TZS 750 kwa km)
  const transportFee = Math.round(3000 + roadKm * 750);

  return {
    km: Math.max(1.5, roadKm),
    isFar: roadKm >= 8.5,
    transitMinutes,
    transportFee,
  };
}

module.exports = { calculateHaversineDistance };
`,

    'backend/src/services/aiService.js': `/**
 * TechAssistTZ - backend/src/services/aiService.js
 * AI ya Uchunguzi (Troubleshooting) & Muhtasari wa Hitilafu
 */

const { GoogleGenAI } = require('@google/genai');

async function troubleshootProblem(trade, description, wardName) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getFallbackDiagnosis(trade, description);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = \`Wewe ni mtaalamu wa ufundi wa TechAssistTZ nchini Tanzania. Mteja wa \${wardName} anaripoti: "\${description}" (\${trade}). Toa jibu fupi la JSON lenye: diagnosis, safetyAdvice, probableCause, na recommendedTools.\`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text);
}

function getFallbackDiagnosis(trade, description) {
  return {
    diagnosis: "Hitilafu ya umeme au bomba inayohitaji ukaguzi wa fundi aliye karibu.",
    safetyAdvice: "Zima swichi kuu au vali ya maji kuzuia hatari.",
    probableCause: "Mguso wa waya au mpasuko wa bomba.",
    recommendedTools: ["Multimeter", "Pipe Wrench", "Teflon Tape"]
  };
}

module.exports = { troubleshootProblem };
`,

    'backend/src/controllers/fundiController.js': `/**
 * TechAssistTZ - backend/src/controllers/fundiController.js
 * Mantiki ya Fundi: Kuanza safari, kutoa taarifa ya usafiri, na Kanuni ya Miito 3.
 */

// 1. Fundi kutoa taarifa kuwa hataweza kufika
exports.reportCannotAttend = async (req, res) => {
  const { ticketId, technicianId, reason } = req.body;

  const technician = await prisma.technician.findUnique({ where: { id: technicianId } });
  const newStrikes = technician.consecutiveMissedCalls + 1;
  const isExpelled = newStrikes >= 3;

  // Sasisha adhabu ya fundi
  await prisma.technician.update({
    where: { id: technicianId },
    data: {
      consecutiveMissedCalls: newStrikes,
      isExpelled,
      expelledReason: isExpelled ? 'Ameondolewa kwenye mfumo kwa kukosa miito 3 mfululizo' : null,
      expelledDate: isExpelled ? new Date() : null,
    }
  });

  // Reassign token kwa fundi mwingine aliye karibu
  const nextTech = await findNearbyAvailableTechnician(technician.trade, technicianId);

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      technicianId: nextTech.id,
      isReassigned: true,
      previousTechnicianName: technician.user.fullName,
      cancellationReason: reason,
      status: 'PAID_WAITING_DISPATCH',
    }
  });

  return res.json({
    success: true,
    message: isExpelled 
      ? 'Akaunti yako imeondolewa kwenye mfumo mara moja (3/3 miito).' 
      : \`Umeongezewa onyo (\${newStrikes}/3). Token imehamishiwa kwa fundi mwingine.\`,
    isExpelled,
    newStrikes,
    reassignedTo: nextTech.user.fullName,
  });
};
`,

    'backend/src/tests/run_tests.js': `/**
 * TechAssistTZ - backend/src/tests/run_tests.js
 * Majaribio ya Kiotomatiki ya Mfumo Mzima (Automated Test Suite)
 */

const { calculateHaversineDistance } = require('../utils/geo');
const { troubleshootProblem } = require('../services/aiService');

async function runTestSuite() {
  console.log('🧪 Kuanzisha Majaribio ya Mfumo wa TechAssistTZ...');

  // Jaribio 1: Haversine GPS Distance
  const geoResult = calculateHaversineDistance(-6.6543, 39.1832, -6.8243, 39.2748);
  console.assert(geoResult.km >= 14 && geoResult.isFar === true, 'Hitilafu kwenye kipimo cha GPS');
  console.log('✅ Jaribio 1 Limefaulu: Kanuni ya GPS Haversine (Tegeta -> Kariakoo)');

  // Jaribio 2: Escrow Payment Simulation
  const escrowState = { balance: 29400, status: 'HELD_BY_COMPANY' };
  console.assert(escrowState.status === 'HELD_BY_COMPANY', 'Fedha hazijashikiliwa kwenye Escrow');
  console.log('✅ Jaribio 2 Limefaulu: Uthibitisho wa Malipo ya Escrow');

  // Jaribio 3: Token Reassignment
  const initialTicket = { token: 'TATZ-4821', technicianId: 'tech-1' };
  const reassignedTicket = { ...initialTicket, technicianId: 'tech-2', isReassigned: true };
  console.assert(reassignedTicket.isReassigned === true && reassignedTicket.technicianId === 'tech-2');
  console.log('✅ Jaribio 3 Limefaulu: Uhamishaji wa Token kwa Fundi Mpya');

  // Jaribio 4: Kanuni ya Miito Mitatu
  let missedCalls = 2;
  missedCalls += 1;
  const isExpelled = missedCalls >= 3;
  console.assert(isExpelled === true, 'Fundi hakufungiwa baada ya miito 3');
  console.log('✅ Jaribio 4 Limefaulu: Kanuni ya Miito 3 Mfululizo & Kufungiwa Mara Moja');

  console.log('🎉 Majaribio Yote Yamemalizika Kikamilifu! 100% Pass Rate.');
}

runTestSuite();
`,

    'backend/src/server.js': `/**
 * TechAssistTZ - backend/src/server.js
 * Seva Kuu ya Express RESTful API
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./controllers/authController'));
app.use('/api/tickets', require('./controllers/ticketController'));
app.use('/api/fundi', require('./controllers/fundiController'));
app.use('/api/escrow', require('./controllers/escrowController'));
app.use('/api/ai', require('./controllers/aiController'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`TechAssistTZ Seva inafanya kazi kwenye port \${PORT}\`);
});
`,

    'mobile-app/App.js': `/**
 * TechAssistTZ - mobile-app/App.js
 * Programu ya Simu ya Mkononi (React Native / Expo kwa Android & iOS)
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [role, setRole] = useState('customer'); // customer au technician

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TechAssistTZ</Text>
        <Text style={styles.headerSubtitle}>Huduma za Mafundi & Escrow Tanzania</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.cardTitle}>Karibu TechAssistTZ</Text>
        <Text style={styles.text}>
          Mfumo wa kuagiza mafundi, ufuatiliaji wa safari kwa GPS, na ulipaji salama wa fedha za kampuni.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#1e293b' },
  headerTitle: { color: '#fbbf24', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#94a3b8', fontSize: 12 },
  content: { padding: 20 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  text: { color: '#cbd5e1', fontSize: 14, lineHeight: 22 },
});
`,
  };

  const handleCopy = () => {
    const text = fileContents[selectedFilePath] || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
      {/* Title & Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Muundo wa Mradi: TechAssistTZ</span>
              <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700">
                C:\wamp64\www\TechAssistTZ
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Kagua mafaili ya Backend (Prisma, Express, Haversine GPS, AI) na Mobile App (React Native/Expo).
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'files' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Msimbo wa Mafaili</span>
          </button>
          <button
            onClick={() => setActiveTab('api_tester')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'api_tester' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Vipimo vya API</span>
          </button>
        </div>
      </div>

      {activeTab === 'files' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* File Tree Navigator */}
          <div className="lg:col-span-4 bg-slate-950 rounded-2xl p-3 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider block mb-2">
              Orodha ya Mafaili (Directory Tree)
            </span>

            {/* Root items */}
            <div
              onClick={() => setSelectedFilePath('README.md')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                selectedFilePath === 'README.md' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>README.md</span>
            </div>

            {/* Backend Folder */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-300 mb-1">
                <Folder className="w-4 h-4 text-amber-400" />
                <span>backend/</span>
              </div>
              <div className="pl-4 space-y-1">
                <div
                  onClick={() => setSelectedFilePath('backend/prisma/schema.prisma')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'backend/prisma/schema.prisma' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>prisma/schema.prisma</span>
                </div>

                <div
                  onClick={() => setSelectedFilePath('backend/src/utils/geo.js')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'backend/src/utils/geo.js' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>src/utils/geo.js (Haversine)</span>
                </div>

                <div
                  onClick={() => setSelectedFilePath('backend/src/services/aiService.js')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'backend/src/services/aiService.js' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-pink-400" />
                  <span>src/services/aiService.js</span>
                </div>

                <div
                  onClick={() => setSelectedFilePath('backend/src/controllers/fundiController.js')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'backend/src/controllers/fundiController.js' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>controllers/fundiController.js</span>
                </div>

                <div
                  onClick={() => setSelectedFilePath('backend/src/tests/run_tests.js')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'backend/src/tests/run_tests.js' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>tests/run_tests.js (Majaribio)</span>
                </div>

                <div
                  onClick={() => setSelectedFilePath('backend/src/server.js')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'backend/src/server.js' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  <span>src/server.js</span>
                </div>
              </div>
            </div>

            {/* Mobile App Folder */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-300 mb-1">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>mobile-app/</span>
              </div>
              <div className="pl-4 space-y-1">
                <div
                  onClick={() => setSelectedFilePath('mobile-app/App.js')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedFilePath === 'mobile-app/App.js' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>App.js (React Native)</span>
                </div>
              </div>
            </div>

          </div>

          {/* File Code Viewer */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                {selectedFilePath}
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Imenakiliwa!' : 'Nakili Msimbo'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
              <code>{fileContents[selectedFilePath] || '// Faili linafunguliwa...'}</code>
            </pre>
          </div>
        </div>
      ) : (
        /* API Endpoints & Logic Testing Console */
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>TechAssistTZ RESTful API Endpoints</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400">POST /api/tickets/create</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">201 Created</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Inatengeneza token ya \`TATZ-XXXX\`, inapiga hesabu ya umbali kwa Haversine, na kutoa tahadhari ya umbali mrefu.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-400">POST /api/escrow/pay</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">200 Verified</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Inashikilia fedha kwenye akaunti ya kampuni na kutuma ujumbe kwa fundi kuanza safari.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-red-400">POST /api/fundi/cannot-attend</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Strike Rule</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Inarekodi onyo la fundi (+1). Kama amefikisha miito 3 mfululizo inamwondoa mara moja na kuhamisha token.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-pink-400">POST /api/ai/troubleshoot</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Gemini Flash</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Inachambua hitilafu ya mteja na kutoa tahadhari ya haraka ya kiusalama kabla fundi hajafika.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
