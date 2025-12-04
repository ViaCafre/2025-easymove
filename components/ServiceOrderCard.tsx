import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Clock,
  Users,
  Hammer,
  Box,
  FileText,
  MapPin,
  TrendingDown,
  Wallet,
  MoreHorizontal,
  CheckCircle2,
  Ban,
  Phone,
  ShieldCheck,
  FileSignature,
  Globe,
  Circle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ServiceOrder, formatCurrency, calculateProfit, calculateCosts, ViewMode } from '../types';

interface ServiceOrderCardProps {
  order: ServiceOrder;
  onClick: (order: ServiceOrder) => void;
  isDimmed?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  viewMode?: ViewMode; 
}

// --- SUB-COMPONENTS ---

const CountdownTimer = ({ targetDate, compact = false }: { targetDate: string, compact?: boolean }) => {
  const [status, setStatus] = useState<'normal' | 'warning' | 'critical' | 'late'>('normal');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const [y, m, d] = targetDate.split('-').map(Number);
      const targetMidnight = new Date(y, m - 1, d).getTime();
      const diff = Math.ceil((targetMidnight - nowMidnight) / (1000 * 60 * 60 * 24));

      if (diff < 0) { setStatus('late'); setLabel(`${Math.abs(diff)}d Atraso`); }
      else if (diff === 0) { setStatus('critical'); setLabel('Hoje'); }
      else if (diff <= 5) { setStatus('critical'); setLabel(`${diff} dias`); }
      else if (diff <= 10) { setStatus('warning'); setLabel(`${diff} dias`); }
      else { setStatus('normal'); setLabel(`${diff} dias`); }
    };
    calculate();
  }, [targetDate]);

  const styles = {
    normal: 'bg-slate-800/80 text-slate-400 border-slate-700/50',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.1)]',
    late: 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]',
  };

  return (
    <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition-all ${styles[status]}`}>
      {!compact && (status === 'late' || status === 'critical' ? <AlertTriangle size={10} /> : <Clock size={10} />)}
      <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>
    </div>
  );
};

const NeonStatusBadge = ({ active, icon: Icon, label, color }: { active: boolean, icon: any, label: string, color: 'emerald' | 'blue' }) => {
    const activeClass = color === 'emerald' 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
        : 'text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.25)]';
    
    const inactiveClass = 'text-slate-600 bg-slate-900/50 border-white/5 opacity-60 grayscale';

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-300 ${active ? activeClass : inactiveClass}`} title={label}>
            <Icon size={12} className={active ? 'animate-pulse' : ''} />
            <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? '' : 'text-slate-600'}`}>
                {label}
            </span>
            {active && <div className={`w-1 h-1 rounded-full ${color === 'emerald' ? 'bg-emerald-400' : 'bg-blue-400'} shadow-[0_0_5px_currentColor]`} />}
        </div>
    );
};

// --- NEW PAYMENT BADGE WITH SATISFYING POP ---
const PaymentCheckBadge = ({ active, label, pct, value }: { active: boolean, label: string, pct: string, value: string }) => {
    return (
        <div className={`relative flex flex-col p-3 rounded-xl border transition-all duration-300 group overflow-hidden ${
            active 
            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]' 
            : 'bg-slate-900/40 border-white/5 opacity-60'
        }`}>
             {/* Top Label */}
             <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${active ? 'text-emerald-400' : 'text-slate-500'}`}>{label}</span>
             
             <div className="flex items-center justify-between mt-1">
                 <div className="flex flex-col">
                    <span className={`text-xl font-black leading-none ${active ? 'text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-slate-700'}`}>
                        {pct}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">{value}</span>
                 </div>

                 {/* Animated Icon with Pop Effect */}
                 <div className="relative w-8 h-8 flex items-center justify-center">
                     <AnimatePresence mode="wait">
                        {active ? (
                            <motion.div
                                key="checked"
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <CheckCircle2 size={28} className="text-emerald-400 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="unchecked"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-slate-900/50" />
                            </motion.div>
                        )}
                     </AnimatePresence>
                 </div>
             </div>
             
             {/* Flash Effect on Active */}
             {active && (
                <motion.div 
                    initial={{ x: '-100%', opacity: 0.5 }}
                    animate={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none"
                />
             )}
        </div>
    )
}

const TimelineWidget = ({ progress }: { progress: number }) => {
    const steps = [
        { pct: 20, label: 'Reserva' },
        { pct: 60, label: 'Coleta' },
        { pct: 100, label: 'Entrega' }
    ];

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Progresso</span>
                <span className={`text-[10px] font-black ${progress === 100 ? 'text-emerald-400' : 'text-blue-400'}`}>{progress}%</span>
            </div>
            <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute top-0 left-0 h-full rounded-full ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                />
            </div>
            <div className="flex justify-between mt-1">
                 {steps.map(s => (
                     <span key={s.label} className={`text-[8px] uppercase font-bold tracking-wider transition-colors ${progress >= s.pct ? 'text-slate-300' : 'text-slate-700'}`}>
                         {s.label}
                     </span>
                 ))}
            </div>
        </div>
    );
};

const ProfitDisplay = ({ profit, costs }: { profit: number, costs: number }) => {
    const isPositive = profit >= 0;
    return (
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Lucro Líquido</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            </div>
            <div className={`text-xl md:text-2xl font-black tracking-tight ${isPositive ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`}>
                {formatCurrency(profit)}
            </div>
            <div className="text-[10px] text-rose-400/70 font-mono mt-0.5">
                Custos: -{formatCurrency(costs)}
            </div>
        </div>
    )
}

// --- MEGA OVERLAY COMPONENT ---

const MegaOverlayContent = ({ order, onClose }: { order: ServiceOrder, onClose: () => void }) => {
    const profit = calculateProfit(order.financials);
    const costs = calculateCosts(order.financials);
    const total = order.financials.totalValue;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                className="w-full max-w-4xl bg-[#0b1121] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 bg-slate-950/80 border-b border-white/5 flex justify-between items-start">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-400">{order.id}</span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase tracking-wider">Detalhes Avançados</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">{order.clientName}</h2>
                        {order.whatsapp && (
                            <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                                <Phone size={14} /> {order.whatsapp}
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <ProfitDisplay profit={profit} costs={costs} />
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0b1121] to-[#020617]">
                    
                    {/* Left: Financials & Status */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Wallet size={14} /> Fluxo Financeiro
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <PaymentCheckBadge 
                                    active={order.paymentStatus.deposit} 
                                    label="Reserva" 
                                    pct="20%" 
                                    value={formatCurrency(total * 0.2)} 
                                />
                                <PaymentCheckBadge 
                                    active={order.paymentStatus.pickup} 
                                    label="Coleta" 
                                    pct="40%" 
                                    value={formatCurrency(total * 0.4)} 
                                />
                                <PaymentCheckBadge 
                                    active={order.paymentStatus.delivery} 
                                    label="Entrega" 
                                    pct="40%" 
                                    value={formatCurrency(total * 0.4)} 
                                />
                            </div>
                            <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-white/5 flex justify-between items-center">
                                <span className="text-sm text-slate-300 font-bold">Total Cobrado</span>
                                <span className="text-xl font-bold text-white">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div>
                             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck size={14} /> Conformidade
                            </h3>
                            <div className="flex gap-3">
                                <NeonStatusBadge active={order.isContractSigned} icon={FileSignature} label="Contrato Assinado" color="emerald" />
                                <NeonStatusBadge active={order.isPostedFretebras} icon={Globe} label="Fretebras" color="blue" />
                                <NeonStatusBadge active={order.isCostsPaid} icon={CheckCircle2} label="Custos Pagos" color="emerald" />
                            </div>
                        </div>

                        {/* Mini Notes Display - Updated for better visibility */}
                        {order.notes && order.notes.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={14} /> Observações ({order.notes.length})
                                </h3>
                                <div className="space-y-3">
                                    {order.notes.slice(0, 3).map((note) => (
                                        <div key={note.id} className="p-4 rounded-xl border border-white/5 relative overflow-hidden bg-slate-900/40">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{backgroundColor: note.color}} />
                                            <p className="text-sm text-slate-200 line-clamp-3 pl-2 leading-relaxed">{note.content}</p>
                                        </div>
                                    ))}
                                    {order.notes.length > 3 && (
                                        <p className="text-xs text-slate-500 italic text-center pt-2">+ {order.notes.length - 3} observações ocultas</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Logistics & Costs */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin size={14} /> Logística
                            </h3>
                            <div className="relative pl-6 space-y-8 border-l border-slate-800 ml-2">
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase mb-1">Origem • {new Date(order.pickupDate).toLocaleDateString()}</p>
                                    <p className="text-base text-slate-200">{order.origin}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                    <p className="text-[10px] text-violet-500 font-bold uppercase mb-1">Destino • {new Date(order.deliveryForecast).toLocaleDateString()}</p>
                                    <p className="text-base text-slate-200">{order.destination}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingDown size={14} /> Detalhamento de Custos
                            </h3>
                            <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><Truck size={14} /> Motorista</span>
                                    <span className="text-rose-400 font-mono">-{formatCurrency(order.financials.driverCost)}</span>
                                </div>
                                {order.financials.extras.map(ex => (
                                    <div key={ex.id} className="flex justify-between text-sm">
                                        <span className="text-slate-400 flex items-center gap-2"><Users size={14} /> {ex.qty}x {ex.name}</span>
                                        <span className="text-rose-400/80 font-mono">-{formatCurrency(ex.qty * ex.cost)}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-white/5 my-1" />
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-300">Total Despesas</span>
                                    <span className="text-rose-500">-{formatCurrency(costs)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}


// --- MAIN COMPONENT ---

export const ServiceOrderCard: React.FC<ServiceOrderCardProps> = ({ 
  order, 
  onClick, 
  isDimmed = false,
  onHover,
  onLeave,
  viewMode = 'default'
}) => {
  const [isLongHovered, setIsLongHovered] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const profit = calculateProfit(order.financials);
  const costs = calculateCosts(order.financials);

  const handleMouseEnter = () => {
      onHover?.();
      hoverTimerRef.current = setTimeout(() => {
          setIsLongHovered(true);
      }, 1200); // 1.2s delay for mega overlay
  };

  const handleMouseLeave = () => {
      onLeave?.();
      if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
      }
  };

  const containerClass = `
    group relative overflow-hidden transition-all duration-500 ease-out border backdrop-blur-xl cursor-pointer
    ${viewMode === 'list' ? 'rounded-lg' : 'rounded-2xl'}
    ${isDimmed 
        ? 'bg-slate-950/40 border-white/5 opacity-40 grayscale-[0.8] scale-[0.99]' 
        : 'bg-gradient-to-br from-slate-900/90 to-[#0b1121]/90 border-white/10 hover:border-emerald-500/30 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]'
    }
  `;

  return (
    <>
        <motion.div
            layoutId={order.id}
            layout
            className={containerClass}
            onClick={() => onClick(order)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Glow Gradient */}
            {!isDimmed && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            )}

            {/* --- DEFAULT MODE (Ticket) --- */}
            {viewMode === 'default' && (
                <div className="flex flex-col md:flex-row h-full">
                    {/* Left: Info */}
                    <div className="flex-1 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative z-10">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/50 to-transparent opacity-50" />
                        
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-wrap gap-2">
                                <span className="font-mono text-[9px] text-slate-500 bg-slate-950/50 px-1.5 py-0.5 rounded border border-white/5">{order.id}</span>
                                <NeonStatusBadge active={order.isContractSigned} icon={FileSignature} label="Contrato" color="emerald" />
                                <NeonStatusBadge active={order.isPostedFretebras} icon={Globe} label="Web" color="blue" />
                            </div>
                            <CountdownTimer targetDate={order.pickupDate} />
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight mb-1">{order.clientName}</h3>
                            <p className="text-xs text-slate-400 truncate">{order.origin} <ArrowRight size={10} className="inline mx-1 text-slate-600" /> {order.destination}</p>
                        </div>

                        <TimelineWidget progress={order.progress} />
                    </div>

                    {/* Right: Financials */}
                    <div className="w-full md:w-64 p-5 bg-gradient-to-l from-[#050a15] to-transparent flex flex-col justify-center items-end border-t md:border-t-0 border-white/5">
                        <ProfitDisplay profit={profit} costs={costs} />
                        <div className="mt-4 flex gap-1 justify-end">
                            {/* Mini payment dots */}
                            {[order.paymentStatus.deposit, order.paymentStatus.pickup, order.paymentStatus.delivery].map((paid, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full border transition-colors duration-500 ${paid ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_5px_currentColor]' : 'bg-slate-800 border-slate-700'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- GRID MODE (Card) --- */}
            {viewMode === 'grid' && (
                <div className="p-5 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1.5">
                             <NeonStatusBadge active={order.isContractSigned} icon={FileSignature} label="Con" color="emerald" />
                             <NeonStatusBadge active={order.isPostedFretebras} icon={Globe} label="Web" color="blue" />
                        </div>
                        <CountdownTimer targetDate={order.pickupDate} compact />
                    </div>

                    <div className="mb-6">
                         <span className="font-mono text-[9px] text-slate-500 block mb-1">{order.id}</span>
                         <h3 className="text-lg font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[3.5rem]">{order.clientName}</h3>
                    </div>

                    <div className="mt-auto space-y-4">
                        <TimelineWidget progress={order.progress} />
                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                            <div className="text-[9px] font-mono text-slate-500">
                                {new Date(order.pickupDate).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}
                            </div>
                            <ProfitDisplay profit={profit} costs={costs} />
                        </div>
                    </div>
                </div>
            )}

            {/* --- COMPACT MODE --- */}
            {viewMode === 'compact' && (
                <div className="p-4 flex flex-col h-full justify-between relative z-10">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-white line-clamp-1">{order.clientName}</h3>
                        <CountdownTimer targetDate={order.pickupDate} compact />
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-end">
                        <span className={`text-[10px] font-bold ${order.progress === 100 ? 'text-emerald-500' : 'text-blue-500'}`}>{order.progress}%</span>
                        <div className={`text-sm font-black ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(profit)}
                        </div>
                    </div>
                </div>
            )}

            {/* --- LIST MODE --- */}
            {viewMode === 'list' && (
                <div className="flex items-center gap-4 p-3 h-16 relative z-10">
                    <div className={`w-1 h-8 rounded-full ${profit >= 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                    <span className="font-mono text-[10px] text-slate-500 w-16 shrink-0">{order.id}</span>
                    
                    <div className="flex-1 min-w-0 px-2">
                        <h3 className="text-sm font-bold text-white truncate">{order.clientName}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500 truncate">{order.origin}</span>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-2">
                         <NeonStatusBadge active={order.isContractSigned} icon={FileSignature} label="CON" color="emerald" />
                         <NeonStatusBadge active={order.isPostedFretebras} icon={Globe} label="WEB" color="blue" />
                    </div>

                    <div className="w-24 shrink-0 text-right">
                         <div className={`text-sm font-black ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(profit)}</div>
                    </div>
                    
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            )}

            {/* --- EXPANDED MODE (Full Hero) --- */}
            {viewMode === 'expanded' && (
                <div className="flex flex-col">
                    <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                         <div className="flex gap-3">
                             <span className="font-mono text-xs text-slate-400">{order.id}</span>
                             <div className="flex gap-2">
                                <NeonStatusBadge active={order.isContractSigned} icon={FileSignature} label="Contrato" color="emerald" />
                                <NeonStatusBadge active={order.isPostedFretebras} icon={Globe} label="Fretebras" color="blue" />
                             </div>
                         </div>
                         <CountdownTimer targetDate={order.pickupDate} />
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                             <h3 className="text-3xl font-bold text-white mb-6">{order.clientName}</h3>
                             <div className="pl-4 border-l-2 border-slate-800 space-y-6">
                                 <div>
                                     <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Coleta</p>
                                     <p className="text-lg text-slate-200">{order.origin}</p>
                                 </div>
                                 <div>
                                     <p className="text-[10px] font-bold text-violet-500 uppercase mb-1">Entrega</p>
                                     <p className="text-lg text-slate-200">{order.destination}</p>
                                 </div>
                             </div>
                         </div>
                         <div className="flex flex-col justify-center bg-slate-950/30 rounded-xl p-6 border border-white/5">
                             <div className="mb-6">
                                 <ProfitDisplay profit={profit} costs={costs} />
                             </div>
                             <TimelineWidget progress={order.progress} />
                         </div>
                    </div>
                </div>
            )}
        </motion.div>

        {/* --- PORTAL OVERLAY --- */}
        {createPortal(
            <AnimatePresence>
                {isLongHovered && (
                    <MegaOverlayContent order={order} onClose={() => setIsLongHovered(false)} />
                )}
            </AnimatePresence>,
            document.body
        )}
    </>
  );
};