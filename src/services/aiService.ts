/**
 * TechAssistTZ - backend/src/services/aiService.js
 * AI ya Uchunguzi wa Kiufundi (Troubleshooting) & Muhtasari wa Kazi
 */

export interface AiTroubleshootResult {
  diagnosis: string;
  safetyAdvice: string;
  probableCause: string;
  recommendedTools: string[];
  severity: 'Kawaida' | 'Wastani' | 'Dharura Kubwa';
  summaryForFundi: string;
}

export async function analyzeProblemWithAI(
  trade: string,
  description: string,
  customerWard: string
): Promise<AiTroubleshootResult> {
  // Try calling Gemini API if key is available
  try {
    const apiKey = 
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY);

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Wewe ni mhandisi mwandamizi wa TechAssistTZ nchini Tanzania. Mteja wa eneo la ${customerWard} anaripoti tatizo la ufundi wa "${trade}": "${description}".
Toa uchunguzi wa awali kwa lugha ya Kiswahili fasaha katika umbizo la JSON lenye sehemu hizi pekee:
{
  "diagnosis": "Uchunguzi mfupi wa kitaalamu",
  "safetyAdvice": "Tahadhari ya haraka ya kiusalama kabla fundi hajafika",
  "probableCause": "Chanzo kinachoelekea kusababisha hitilafu",
  "recommendedTools": ["Vifaa 3-4 fundi anavyopaswa kuja navyo"],
  "severity": "Kawaida au Wastani au Dharura Kubwa",
  "summaryForFundi": "Muhtasari wa maneno 20 kwa ajili ya fundi"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          diagnosis: parsed.diagnosis,
          safetyAdvice: parsed.safetyAdvice,
          probableCause: parsed.probableCause,
          recommendedTools: parsed.recommendedTools || ['Multimeter', 'Vifaa vya usalama'],
          severity: parsed.severity || 'Wastani',
          summaryForFundi: parsed.summaryForFundi,
        };
      }
    }
  } catch (err) {
    console.warn('Using deterministic TechAssistTZ rule engine for AI troubleshooting:', err);
  }

  // High-fidelity fallback rule-based AI engine tailored for East African domestic & commercial faults
  const lowerDesc = description.toLowerCase();

  if (trade === 'Umeme') {
    if (lowerDesc.includes('luku') || lowerDesc.includes('breki') || lowerDesc.includes('switch') || lowerDesc.includes('moshi')) {
      return {
        diagnosis: 'Hitilafu ya Mzunguko Mfupi (Short Circuit) au Mzigo Mkubwa wa Umeme (Overload) kwenye Main Switch au MCB.',
        safetyAdvice: 'ZIMA MAIN SWITCH mara moja! Usiguse soketi wala vifaa vyenye joto mpaka fundi atapothibitisha usalama wa mfumo.',
        probableCause: 'Kifaa cha jiko la umeme au hita kimepata mguso wa earth/neutral, au breaker ya luku imelegea kwenye bodi.',
        recommendedTools: ['Digital Multimeter', 'Insulated Screwdrivers 1000V', 'Replacement MCB (32A/16A)', 'Insulation Tape'],
        severity: 'Dharura Kubwa',
        summaryForFundi: 'Hitilafu ya LUKU kuruka na switch kuungua. Pima continuity na insulation resistance kabla ya kuwasha.',
      };
    }
    return {
      diagnosis: 'Hitilafu ya Awamu ya Umeme (Phase Imbalance) au Muunganisho Uliolegea.',
      safetyAdvice: 'Tenganisha vifaa vizito (friji, pasi, mashine ya kufulia) kutoka kwenye soketi.',
      probableCause: 'Neutral wire imekatika au kuungua kwenye junction box.',
      recommendedTools: ['Test Pen', 'Amp Clamp Meter', 'Pliers', 'Waya za shaba 2.5mm'],
      severity: 'Wastani',
      summaryForFundi: 'Kukosekana kwa umeme kwenye baadhi ya vyumba. Kagua junction boxes na bodi kuu.',
    };
  }

  if (trade === 'Mabomba') {
    if (lowerDesc.includes('tanki') || lowerDesc.includes('kuvuja') || lowerDesc.includes('pasuka') || lowerDesc.includes('furiko')) {
      return {
        diagnosis: 'Kuvuja kwa Bomba Kuu la Shinikizo (Pressure Pipe Burst) au Hitilafu ya Ball Valve / Float Switch ya Tanki.',
        safetyAdvice: 'FUNGA VALI KUU YA MAJI (Stopcock/Gate Valve) ya nyumba mara moja kuzuia mafuriko na uharibifu wa vifaa!',
        probableCause: 'Shinikizo kubwa la maji ya DAWASA/Booster pump au mpasuko kwenye kiunganishi cha PVC/PPR.',
        recommendedTools: ['Pipe Wrench 12/14 inch', 'PPR Welding Machine', 'Thread Seal Tape (Teflon)', 'Couplings & Elbows'],
        severity: 'Dharura Kubwa',
        summaryForFundi: 'Mpasuko wa bomba kuu la tanki. Fundi aje na viunganishi vya PPR/PVC na teflon tayari kwa kubadilisha.',
      };
    }
    return {
      diagnosis: 'Kuziba kwa Njia ya Maji Taka (Drainage Blockage) au Kituo cha Sink/Choo.',
      safetyAdvice: 'Usitumie maji mengi kwenye sinki au beseni husika mpaka mtaro ufunguliwe.',
      probableCause: 'Mkusanyiko wa mafuta na masalia ya vyakula au vitu vigumu kwenye P-trap.',
      recommendedTools: ['Plumbing Snake / Rod', 'Plunger', 'Chemical Drain Cleaner', 'Bucket & Gloves'],
      severity: 'Kawaida',
      summaryForFundi: 'Kuziba kwa mfereji au sink. Fanya ufunguzi wa P-trap na kutoa uchafu ulioganda.',
    };
  }

  if (trade === 'AC & Majokofu') {
    return {
      diagnosis: 'Upungufu wa Gesi (Refrigerant Leakage) au Hitilafu ya Compressor / Capacitor.',
      safetyAdvice: 'Zima kifaa ili kuzuia compressor kupata joto kali (overheating) na kuungua.',
      probableCause: 'Mvujo mdogo kwenye mirija ya shaba (copper tubing) au condenser iliyojaa vumbi.',
      recommendedTools: ['Manifold Gauge', 'R410A / R32 / R134a Gas Canister', 'Leak Detector Soap', 'Vacuum Pump'],
      severity: 'Wastani',
      summaryForFundi: 'AC haitoi baridi au friji haligandi. Pima shinikizo la gesi na angalia kama compressor inanguruma.',
    };
  }

  // General fallback
  return {
    diagnosis: `Hitilafu ya kiufundi ya ${trade} inayohitaji uchunguzi wa ana kwa ana.`,
    safetyAdvice: 'Weka umbali na eneo la kifaa kilichoharibika na epuka kulazimisha kuwasha.',
    probableCause: 'Uchovu wa vifaa au msuguano wa kiufundi.',
    recommendedTools: ['Seti kamili ya vifaa vya ufundi', 'Vifaa vya kinga (PPE)'],
    severity: 'Wastani',
    summaryForFundi: `Ombi la huduma ya ${trade} eneo la ${customerWard}. Kagua na fanya matengenezo kwa ufanisi.`,
  };
}
