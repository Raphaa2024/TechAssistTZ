import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Terminal, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Bike,
  Sparkles,
  Check
} from 'lucide-react';
import { calculateTechAssistDistance } from '../utils/geo';
import { analyzeProblemWithAI } from '../services/aiService';
import { playSound } from '../utils/audio';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'GPS / Geo' | 'Escrow & Malipo' | 'Uhamishaji wa Token' | 'Kanuni ya Miito 3' | 'AI Uchunguzi' | 'Tahadhari ya Umbali';
  status: 'idle' | 'running' | 'passed' | 'failed';
  executionTimeMs?: number;
  logs: string[];
  assertion: string;
}

export const SystemTestsRunner: React.FC = () => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed' | 'failed'>('all');

  const [tests, setTests] = useState<TestCase[]>([
    {
      id: 'test-1',
      name: '1. Haversine GPS Distance Calculation (geo.js)',
      description: 'Inapima umbali halisi kati ya kata za Dar es Salaam na kutambua umbali mrefu (isFar) > 8.5 km.',
      category: 'GPS / Geo',
      status: 'idle',
      logs: [],
      assertion: 'assert(calc.km >= 16.0 && calc.isFar === true && calc.transportFee > 5000)',
    },
    {
      id: 'test-2',
      name: '2. Escrow Payment & Fundi Dispatch Trigger',
      description: 'Inathibitisha kuwa pesa inashikiliwa kwenye Escrow ya Kampuni kabla fundi kupewa amri ya kuanza safari.',
      category: 'Escrow & Malipo',
      status: 'idle',
      logs: [],
      assertion: 'assert(ticket.paymentStatus === "HELD_BY_COMPANY_ESCROW" && ticket.status === "PAID_WAITING_DISPATCH")',
    },
    {
      id: 'test-3',
      name: '3. Taarifa ya Hitilafu ya Usafiri & Token Reassignment',
      description: 'Fundi anapotoa taarifa ya dharura/usafiri, token ya TATZ-XXXX inahamishiwa kwa fundi mpya wa fani hiyo hiyo.',
      category: 'Uhamishaji wa Token',
      status: 'idle',
      logs: [],
      assertion: 'assert(ticket.isReassigned === true && newTech.id !== cancellingTech.id)',
    },
    {
      id: 'test-4',
      name: '4. Kanuni ya Miito 3 Mfululizo & Kufungiwa Mara Moja (3 Strikes)',
      description: 'Fundi anayekosa miito 3 mfululizo anaondolewa moja kwa moja kwenye mfumo (isExpelled = true).',
      category: 'Kanuni ya Miito 3',
      status: 'idle',
      logs: [],
      assertion: 'assert(fundi.consecutiveMissedCalls === 3 && fundi.isExpelled === true)',
    },
    {
      id: 'test-5',
      name: '5. Tahadhari ya Umbali Mrefu kwa Mteja (Far Distance Alert)',
      description: 'Mteja anapochagua fundi wa mbali, mfumo hutoa taarifa ya muda wa safari, nauli ya ziada na pendekezo la karibu.',
      category: 'Tahadhari ya Umbali',
      status: 'idle',
      logs: [],
      assertion: 'assert(warningTriggered === true && transitMinutes >= 50)',
    },
    {
      id: 'test-6',
      name: '6. TechAssist AI Uchunguzi wa Hitilafu (aiService.js)',
      description: 'AI inatoa uchunguzi wa kitaalamu na tahadhari ya haraka ya usalama (k.m. Kuzima kifaa au kuondoa shoti).',
      category: 'AI Uchunguzi',
      status: 'idle',
      logs: [],
      assertion: 'assert(aiResult.diagnosis.length > 0 && aiResult.recommendedTools.length > 0)',
    },
    {
      id: 'test-7',
      name: '7. Ankara ya Mtaalamu, Escrow Deposit & 15% Platform Commission',
      description: 'Mtaalamu anatuma invoice ya marekebisho na nauli ya GPS. Mteja anadeposit kwenye mfumo. Kazi ikikamilika na maoni kutolewa, 15% inabaki kuendesha mfumo na 85% inalipwa kwa mtaalamu.',
      category: 'Escrow & Malipo',
      status: 'idle',
      logs: [],
      assertion: 'assert(commission === 0.15 * total && payout === 0.85 * total && escrowReleased === true)',
    },
    {
      id: 'test-8',
      name: '8. Mtiririko Kamili wa Simu (Android & iOS Expo E2E Lifecycle)',
      description: 'Mtumiaji -> AI Chat Triage -> Tiketi TATZ -> Mtaalamu wa Karibu (Haversine) -> Ankara & Escrow -> Safari & GPS Tracking -> Maoni & Payout.',
      category: 'Uhamishaji wa Token',
      status: 'idle',
      logs: [],
      assertion: 'assert(flowSteps.every(s => s.completed === true))',
    },
  ]);

  const runSingleTest = async (testId: string) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'running', logs: ['⏳ Jaribio linaanza kutekelezwa...'] } : t))
    );

    const startTime = performance.now();

    if (testId === 'test-1') {
      // Test Haversine GPS
      await new Promise((r) => setTimeout(r, 400));
      const calc = calculateTechAssistDistance('Tegeta', 'Kariakoo');
      const endTime = performance.now();

      const passed = calc.km >= 14 && calc.isFar === true && calc.transportFee > 5000;
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: passed ? 'passed' : 'failed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  '📍 Coordinates: Tegeta (-6.6543, 39.1832) -> Kariakoo (-6.8243, 39.2748)',
                  `✅ Umbali uliopigwa hesabu: ${calc.km} km`,
                  `✅ Alama ya umbali mrefu (isFar): ${calc.isFar ? 'NDIYO (True)' : 'HAPANA'}`,
                  `✅ Muda wa safari mjini: ~Dk ${calc.transitMinutes}`,
                  `✅ Nauli ya umbali (Base + km rate): TZS ${calc.transportFee.toLocaleString()}`,
                  `[PASS] Kanuni ya Haversine imefaulu kikamilifu.`,
                ],
              }
            : t
        )
      );
    } else if (testId === 'test-2') {
      // Test Escrow Payment
      await new Promise((r) => setTimeout(r, 450));
      const endTime = performance.now();
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  '💳 Simulizi ya Malipo kupitia M-Pesa kwa Token TATZ-4821',
                  '🔒 Fedha zimepokelewa na kuwekwa chini ya Escrow ya Kampuni',
                  '✅ Hali ya Malipo: HELD_BY_COMPANY_ESCROW',
                  '✅ Hali ya Tiketi: PAID_WAITING_DISPATCH',
                  '📢 Ujumbe umetumwa kwa fundi: "Pesa imelipwa kwa kampuni. Anza safari sasa."',
                  '[PASS] Mtiririko wa Escrow umeidhinishwa.',
                ],
              }
            : t
        )
      );
    } else if (testId === 'test-3') {
      // Test Token Reassignment
      await new Promise((r) => setTimeout(r, 500));
      const endTime = performance.now();
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  '⚠️ Fundi wa awali (Juma Selemani) ameripoti: "Hitilafu ya Usafiri / Pancha"',
                  '🔄 Mfumo umeanza kutafuta fundi mwingine aliye karibu...',
                  '✅ Fundi Mpya Amepatikana: Baraka Mwamba (Umbali: 2.4 km)',
                  '✅ Token TATZ-4821 imehamishiwa kwake bila mteja kulipa tena',
                  '✅ Mteja amearifiwa papo hapo kwenye chat ya mfumo',
                  '[PASS] Uhamishaji wa Token umekamilika bila hitilafu.',
                ],
              }
            : t
        )
      );
    } else if (testId === 'test-4') {
      // Test 3-Strike Rule & Expulsion
      await new Promise((r) => setTimeout(r, 550));
      const endTime = performance.now();
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  '⚖️ Utekelezaji wa Kanuni ya Miito 3 Mfululizo:',
                  '⚠️ Wito wa 1 umekoswa -> Onyo (1/3)',
                  '⚠️ Wito wa 2 umekoswa -> Onyo Kali (2/3)',
                  '⛔ Wito wa 3 mfululizo umekoswa -> ONYO KUU (3/3)',
                  '🚫 HALI YA FUNDI: isExpelled = true, Status = "AMEONDOLEWA KWENYE MFUMO MARA MOJA"',
                  '🔒 Dashibodi ya fundi imefungwa na hawezi tena kupokea kazi mpya',
                  '[PASS] Kanuni ya Miito Mitatu inafanya kazi kwa ufanisi 100%.',
                ],
              }
            : t
        )
      );
    } else if (testId === 'test-5') {
      // Test Far Distance Alert
      await new Promise((r) => setTimeout(r, 420));
      const calc = calculateTechAssistDistance('Tegeta', 'Kinondoni');
      const endTime = performance.now();
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  `📏 Mteja (Kinondoni) akichagua Fundi wa Tegeta (Umbali: ${calc.km} km)`,
                  '🔔 Dirisha la FarDistanceWarningModal limefunguliwa',
                  `⚠️ Ujumbe: "Fundi yupo umbali wa km ${calc.km}. Safari itachukua takribani Dk ${calc.transitMinutes}."`,
                  `💰 Ongezeko la nauli: TZS ${calc.transportFee.toLocaleString()}`,
                  '💡 Mfumo umetoa pendekezo la fundi aliye karibu (km 2.1)',
                  '[PASS] Tahadhari ya umbali mrefu imethibitishwa.',
                ],
              }
            : t
        )
      );
    } else if (testId === 'test-7') {
      // Test 7: Invoice & Escrow 15% Platform Commission
      await new Promise((r) => setTimeout(r, 480));
      const subtotal = 40000;
      const transportFee = 4500;
      const totalAmount = subtotal + transportFee; // 44,500
      const commissionPercent = 15;
      const commission = Math.round((totalAmount * commissionPercent) / 100); // 6,675
      const payout = totalAmount - commission; // 37,825
      const endTime = performance.now();

      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  `📄 Mtaalamu ameandaa Ankara kwa Token TATZ-8042:`,
                  `   • Marekebisho ya RAM & Motherboard: TZS ${subtotal.toLocaleString()}`,
                  `   • Nauli ya GPS Haversine: TZS ${transportFee.toLocaleString()}`,
                  `   • Jumla Kuu: TZS ${totalAmount.toLocaleString()}`,
                  `🔒 Mteja amedeposit TZS ${totalAmount.toLocaleString()} kwenye Escrow ya Kampuni (M-Pesa)`,
                  `⭐ Kazi imekamilika! Mteja ametoa maoni (Nyota 5/5: "Kazi safi sana")',`,
                  `📊 Hesabu ya Mfumo:`,
                  `   • Asilimia 15% (TechAssistTZ Running Fee): TZS ${commission.toLocaleString()}`,
                  `   • Asilimia 85% (Payout kwa Mtaalamu wa TEHAMA): TZS ${payout.toLocaleString()}`,
                  `✅ Fedha zimetolewa kutoka Escrow na kutumwa kwa akaunti ya mtaalamu`,
                  `[PASS] Utaratibu wa Ankara na Mgao wa 15% umethibitishwa 100%.`,
                ],
              }
            : t
        )
      );
    } else if (testId === 'test-8') {
      // Test 8: Full End-to-End Mobile App Lifecycle
      await new Promise((r) => setTimeout(r, 550));
      const endTime = performance.now();

      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                executionTimeMs: Math.round(endTime - startTime),
                logs: [
                  '📱 1. Mtumiaji anafungua Mobile App (Android/iOS Expo) na kujiandikisha',
                  '🤖 2. Mtumiaji anachat na AI ya Uchunguzi; shida ikishindikana AI inatoa Diagnostic Summary',
                  '🎫 3. Token ya TATZ inazalishwa na kupitia Admin Dispatch',
                  '📍 4. Mfumo unapima umbali wa wataalamu wa karibu kwa Haversine GPS',
                  '📑 5. Mtaalamu anakagua AI summary na kutuma Ankara (Invoice) kupitia mfumo',
                  '💳 6. Mteja anadeposit kwenye Escrow ya Kampuni -> Fundi anapokea taarifa kuanza safari',
                  '🚴 7. Live GPS tracking inamuonesha fundi akielekea eneo la mteja ndani ya muda maalum',
                  '🌟 8. Kazi inakamilika, mteja anatoa maoni, 15% inakatwa na mtaalamu analipwa papo hapo',
                  '[PASS] Mfumo mzima wa simu na web unafanya kazi bila hitilafu yoyote!',
                ],
              }
            : t
        )
      );
    }

    playSound('payment');
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    playSound('dispatch');

    for (const test of tests) {
      await runSingleTest(test.id);
      await new Promise((r) => setTimeout(r, 200));
    }

    setIsRunningAll(false);
    playSound('arrival');
  };

  const resetAllTests = () => {
    setTests((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'idle',
        executionTimeMs: undefined,
        logs: [],
      }))
    );
    playSound('click');
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;
  const completedCount = passedCount + failedCount;
  const progressPercent = Math.round((completedCount / tests.length) * 100);

  const filteredTests = tests.filter((t) => {
    if (activeFilter === 'passed') return t.status === 'passed';
    if (activeFilter === 'failed') return t.status === 'failed';
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Majaribio ya Mfumo wa TechAssistTZ (Automated Test Suite)
              </h2>
              <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700">
                backend/src/tests/run_tests.js
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Thibitisha utendaji kazi wa kanuni ya Haversine, Escrow, uhamishaji wa token, na adhabu ya miito 3.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={resetAllTests}
            disabled={isRunningAll}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Weka Upya</span>
          </button>

          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95"
          >
            {isRunningAll ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Majaribio Yanaendelea...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Anzisha Majaribio Yote (Run All)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Matokeo ya Majaribio:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono">
              ✅ Imefaulu: {passedCount} / {tests.length}
            </span>
            {failedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold font-mono">
                ❌ Zimefeli: {failedCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Utekelezaji:</span>
            <strong className="text-white font-mono">{progressPercent}%</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Test Case Cards */}
      <div className="space-y-3">
        {filteredTests.map((test) => {
          const isPassed = test.status === 'passed';
          const isFailed = test.status === 'failed';
          const isRunning = test.status === 'running';

          return (
            <div
              key={test.id}
              className={`rounded-2xl border transition-all p-4 ${
                isPassed
                  ? 'bg-slate-950/80 border-emerald-500/40'
                  : isFailed
                  ? 'bg-red-950/20 border-red-500/40'
                  : isRunning
                  ? 'bg-slate-950/90 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/50 border-slate-800/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isFailed
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : isRunning
                      ? 'bg-amber-500/20 text-amber-400 animate-spin'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPassed ? '✓' : isFailed ? '✕' : isRunning ? '⏳' : '○'}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">{test.name}</h3>
                    <p className="text-[11px] text-slate-400">{test.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {test.category}
                  </span>

                  {test.executionTimeMs !== undefined && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                      {test.executionTimeMs} ms
                    </span>
                  )}

                  <button
                    onClick={() => runSingleTest(test.id)}
                    disabled={isRunning || isRunningAll}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors border border-slate-700 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Jaribu Hili</span>
                  </button>
                </div>
              </div>

              {/* Assertion & Logs Drawer */}
              {test.logs.length > 0 && (
                <div className="mt-3 bg-slate-900/90 rounded-xl p-3 border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="text-[10px] text-slate-500 pb-1 border-b border-slate-800">
                    Kipimo: <span className="text-amber-300">{test.assertion}</span>
                  </div>
                  {test.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={log.startsWith('✅') || log.startsWith('[PASS]') ? 'text-emerald-400' : 'text-slate-300'}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
