import React from 'react';
import { ServiceTicket } from '../types';
import { WARDS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  Compass, 
  Clock, 
  Gauge, 
  FastForward,
  AlertCircle
} from 'lucide-react';

interface LiveMapTrackerProps {
  ticket: ServiceTicket;
}

export const LiveMapTracker: React.FC<LiveMapTrackerProps> = ({ ticket }) => {
  const { advanceJourneyProgress, markArrived } = useApp();

  const customerLoc = ticket.customerLocation;
  // Estimate technician starting coordinates: if we have technician base/current
  const originX = customerLoc.x > 50 ? customerLoc.x - 28 : customerLoc.x + 28;
  const originY = customerLoc.y > 50 ? customerLoc.y - 25 : customerLoc.y + 25;

  const progress = Math.min(100, Math.max(0, ticket.routeProgress || 0));
  
  // Calculate current interpolated position along journey
  const currentX = originX + (customerLoc.x - originX) * (progress / 100);
  const currentY = originY + (customerLoc.y - originY) * (progress / 100);

  const isEnRoute = ticket.status === 'EN_ROUTE';
  const isArrived = ticket.status === 'ARRIVED' || ticket.status === 'IN_PROGRESS' || ticket.status === 'COMPLETED';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Map Header Status Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isEnRoute ? 'bg-amber-500/20 text-amber-400 animate-pulse' : isArrived ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Ramani ya Ufuatiliaji wa Moja kwa Moja</span>
              {isEnRoute && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </h4>
            <p className="text-[11px] text-slate-400">
              Kutoka kituo cha fundi hadi {ticket.customerLocation.name}
            </p>
          </div>
        </div>

        {/* ETA & Distance Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>{ticket.distanceKm} km</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {isArrived ? (
              <span className="text-emerald-400">Amewasili</span>
            ) : isEnRoute ? (
              <span>Dk {ticket.etaMinutesRemaining ?? ticket.estimatedTransitMinutes} zimesalia</span>
            ) : (
              <span>Inasubiri Safari</span>
            )}
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 select-none overflow-hidden">
        {/* Subtle City Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Roads & Water body simulation (Indian Ocean Coastline in Dar) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Coastal water curve */}
          <path
            d="M 75 0 Q 85 40 70 100 L 100 100 L 100 0 Z"
            fill="#0ea5e9"
            fillOpacity="0.08"
          />

          {/* Main roads network */}
          <path d="M 10 50 Q 50 45 90 60" stroke="#334155" strokeWidth="1.8" fill="none" strokeDasharray="2,1" />
          <path d="M 45 0 Q 48 50 55 100" stroke="#334155" strokeWidth="1.8" fill="none" />
          <path d="M 20 20 Q 50 40 80 80" stroke="#1e293b" strokeWidth="1.5" fill="none" />

          {/* Planned Route Line */}
          <path
            d={`M ${originX} ${originY} Q ${(originX + customerLoc.x) / 2 + 5} ${(originY + customerLoc.y) / 2 - 5} ${customerLoc.x} ${customerLoc.y}`}
            stroke={isEnRoute ? '#f59e0b' : '#475569'}
            strokeWidth="2.5"
            strokeDasharray={isEnRoute ? '3,2' : 'none'}
            fill="none"
            className={isEnRoute ? 'animate-pulse' : ''}
          />

          {/* Completed Route Segment */}
          {progress > 0 && (
            <path
              d={`M ${originX} ${originY} Q ${(originX + currentX) / 2 + 2} ${(originY + currentY) / 2 - 2} ${currentX} ${currentY}`}
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />
          )}
        </svg>

        {/* Ward Landmarks on Map */}
        {WARDS.map((w) => (
          <div
            key={w.name}
            style={{ left: `${w.x}%`, top: `${w.y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity"
          >
            <div className="flex flex-col items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap bg-slate-900/80 px-1 rounded">
                {w.name}
              </span>
            </div>
          </div>
        ))}

        {/* Origin Marker (Fundi Start Hub) */}
        <div
          style={{ left: `${originX}%`, top: `${originY}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative group">
            <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg text-[10px]">
              🛠️
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-slate-950/90 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-800">
              Kituo cha Fundi
            </div>
          </div>
        </div>

        {/* Destination Marker (Customer House) */}
        <div
          style={{ left: `${customerLoc.x}%`, top: `${customerLoc.y}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative group">
            {/* Pulsing ring */}
            <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg text-white font-bold">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-slate-950/95 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap border border-emerald-500/40">
              🏠 {customerLoc.name} (Mteja)
            </div>
          </div>
        </div>

        {/* Moving Technician Vehicle / Pin */}
        <div
          style={{
            left: `${currentX}%`,
            top: `${currentY}%`,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative group cursor-pointer">
            <div className={`w-10 h-10 rounded-2xl ${isArrived ? 'bg-emerald-500' : 'bg-amber-500'} text-slate-950 border-2 border-white flex items-center justify-center shadow-2xl shadow-amber-500/50 transform group-hover:scale-110 transition-transform`}>
              <span className="text-lg">🛵</span>
            </div>
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-slate-700 whitespace-nowrap">
              {ticket.technicianName.split(' ')[0]} {progress > 0 ? `(${progress}%)` : ''}
            </div>
          </div>
        </div>

        {/* Route Info Overlay at bottom */}
        <div className="absolute bottom-2 left-3 right-3 bg-slate-950/90 backdrop-blur-md rounded-xl p-2.5 border border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300">
              Hali ya Safari: <strong className="text-white">{isArrived ? 'Amefika Mlangoni' : isEnRoute ? `Njiani (${progress}% ya safari)` : 'Inasubiri Fundi Kuanza Safari'}</strong>
            </span>
          </div>

          {/* Quick Simulation controls for tester/user */}
          {isEnRoute && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => advanceJourneyProgress(ticket.id, 25)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold border border-amber-500/30 transition-colors"
                title="Piga hatua mbele kwenye safari kwa majaribio"
              >
                <FastForward className="w-3 h-3" />
                <span>Songa +25%</span>
              </button>
              <button
                onClick={() => markArrived(ticket.id)}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                title="Weka kuwa fundi amefika moja kwa moja"
              >
                Amewasili
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar under map */}
      <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${isArrived ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
