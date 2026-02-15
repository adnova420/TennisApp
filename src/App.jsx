import { useState, useEffect, useRef, useCallback } from "react";

// ─── Storage ───
const storage = window.storage;
async function loadData(k, fb) { try { const r = await storage.get(k); return r ? JSON.parse(r.value) : fb; } catch { return fb; } }
async function saveData(k, v) { try { await storage.set(k, JSON.stringify(v)); } catch (e) { console.error(e); } }

// ─── Data ───
const COURTS = [
  { id: 1, name: "Libro Centre Courts", address: "3295 Meloche Rd, Amherstburg", surface: "Hard", lights: true, courts: 4 },
  { id: 2, name: "Zekelman Tennis Centre", address: "2000 Talbot Rd W, Windsor", surface: "Hard", lights: true, courts: 8 },
  { id: 3, name: "Parkside Tennis Club", address: "600 Mill St, Kingsville", surface: "Clay", lights: true, courts: 6 },
  { id: 4, name: "Mic Mac Park Courts", address: "Mic Mac Park, Windsor", surface: "Hard", lights: false, courts: 2 },
  { id: 5, name: "Centennial Park Courts", address: "Centennial Park, Amherstburg", surface: "Hard", lights: false, courts: 2 },
];

const DIVISIONS = {
  "Open Singles": ["5.0+","4.5","4.0","3.5","3.0","2.5"],
  "Open Doubles": ["8.5+","7.5","6.0+"],
  "Women's Singles": ["3.5+","3.0"],
  "Women's Doubles": ["All"],
  "Mixed Doubles": ["6.5+","5.5+"],
};

const DEMO_PLAYERS = [
  { id: "p1", name: "Matt Ruttle", rating: 4.5, division: "Open Singles", wins: 12, losses: 3, active2026: true, avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: false, Sat: true, Sun: false } },
  { id: "p2", name: "Adrian Mag", rating: 5.0, division: "Open Singles", wins: 15, losses: 1, active2026: true, avail: { Mon: false, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: true } },
  { id: "p3", name: "Valentina Rueda", rating: 3.5, division: "Women's Singles", wins: 10, losses: 2, active2026: true, avail: { Mon: true, Tue: true, Wed: false, Thu: false, Fri: true, Sat: true, Sun: false } },
  { id: "p4", name: "Hermann Djodanko", rating: 4.0, division: "Open Singles", wins: 8, losses: 5, active2026: true, avail: { Mon: false, Tue: true, Wed: true, Thu: false, Fri: false, Sat: true, Sun: true } },
  { id: "p5", name: "Fadi Shaya", rating: 4.5, division: "Open Doubles", wins: 14, losses: 2, active2026: true, avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false } },
  { id: "p6", name: "Diana Wu", rating: 3.5, division: "Mixed Doubles", wins: 9, losses: 4, active2026: true, avail: { Mon: false, Tue: true, Wed: true, Thu: false, Fri: true, Sat: true, Sun: true } },
  { id: "p7", name: "Aaron Vandelinder", rating: 3.5, division: "Open Singles", wins: 7, losses: 6, active2026: false, avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: false, Sat: false, Sun: true } },
  { id: "p8", name: "Kazik Czubernat", rating: 3.0, division: "Open Singles", wins: 6, losses: 7, active2026: false, avail: { Mon: false, Tue: false, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false } },
  { id: "p9", name: "Angela Rueda", rating: 3.0, division: "Women's Doubles", wins: 5, losses: 3, active2026: true, avail: { Mon: true, Tue: false, Wed: true, Thu: false, Fri: false, Sat: true, Sun: true } },
  { id: "p10", name: "Christie Downes", rating: 3.0, division: "Mixed Doubles", wins: 4, losses: 5, active2026: false, avail: { Mon: false, Tue: true, Wed: false, Thu: true, Fri: true, Sat: false, Sun: true } },
  { id: "p11", name: "Margaret Bowers", rating: 3.5, division: "Women's Singles", wins: 8, losses: 4, active2026: true, avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: false, Sat: true, Sun: false } },
  { id: "p12", name: "Josh Polsky", rating: 4.0, division: "Open Doubles", wins: 11, losses: 3, active2026: true, avail: { Mon: false, Tue: false, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false } },
];

const SPONSORS = [
  { name: "Pizza Express", url: "#" },{ name: "Miskus Chiropractic", url: "#" },{ name: "Rita's Sweets & Treats", url: "#" },
  { name: "Radovich Chiropractic", url: "#" },{ name: "Canadian Tire Amherstburg", url: "#" },{ name: "Bodhi Massage Therapy", url: "#" },{ name: "RD Refunds Canada", url: "#" },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_SHORT = ["S","M","T","W","T","F","S"];
const DAY_KEYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const TIME_SLOTS = ["8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];

const TOURNAMENTS = [
  { id:"t1", name:"GATL Summer Slam", year:2026, rating:"All Divisions", stage:"registration", startDate:"Jun 14, 2026", endDate:"Jun 28, 2026", location:"Zekelman Tennis Centre", desc:"Annual summer tournament open to all divisions.", registered:42, max:64 },
  { id:"t2", name:"Amherstburg Open", year:2026, rating:"3.5+", stage:"live-challenges", startDate:"Feb 10, 2026", endDate:"Mar 8, 2026", location:"Libro Centre Courts", desc:"Competitive open for rated 3.5+ players.", registered:16, max:16,
    players:[{name:"Adrian Mag",rating:5.0,wins:3,losses:0},{name:"Matt Ruttle",rating:4.5,wins:2,losses:1},{name:"Fadi Shaya",rating:4.5,wins:2,losses:1},{name:"Hermann Djodanko",rating:4.0,wins:1,losses:2},{name:"Aaron Vandelinder",rating:3.5,wins:1,losses:2},{name:"Diana Wu",rating:3.5,wins:0,losses:3}] },
  { id:"t3", name:"Essex County Championship", year:2026, rating:"4.0+", stage:"live-bracket", startDate:"Jan 20, 2026", endDate:"Feb 15, 2026", location:"Zekelman Tennis Centre", desc:"Championship bracket play for 4.0+ players.", registered:8, max:8,
    bracket:{ qf:[{p1:"Adrian Mag",p2:"Kazik Czubernat",score:"6-1, 6-2",winner:"Adrian Mag"},{p1:"Matt Ruttle",p2:"Aaron Vandelinder",score:"6-4, 7-5",winner:"Matt Ruttle"},{p1:"Fadi Shaya",p2:"Diana Wu",score:"6-3, 6-4",winner:"Fadi Shaya"},{p1:"Hermann Djodanko",p2:"Valentina Rueda",score:"4-6, 6-3, 7-5",winner:"Hermann Djodanko"}], sf:[{p1:"Adrian Mag",p2:"Matt Ruttle",score:"7-6, 6-4",winner:"Adrian Mag"},{p1:"Fadi Shaya",p2:"Hermann Djodanko",score:"6-3, 3-6, 6-2",winner:"Fadi Shaya"}], final:[{p1:"Adrian Mag",p2:"Fadi Shaya",score:null,winner:null}] } },
  { id:"t4", name:"GATL Season 10 Finals", year:2025, rating:"All Divisions", stage:"completed", startDate:"Sep 6, 2025", endDate:"Sep 20, 2025", location:"Zekelman Tennis Centre", desc:"End of season championship.", registered:56, max:64, champion:"Adrian Mag" },
  { id:"t5", name:"Summer Classic 2025", year:2025, rating:"All Divisions", stage:"completed", startDate:"Jul 12, 2025", endDate:"Jul 26, 2025", location:"Libro Centre Courts", desc:"Mid-season invitational.", registered:32, max:32, champion:"Matt Ruttle" },
  { id:"t6", name:"Parkside Doubles Bash", year:2025, rating:"Open Doubles", stage:"completed", startDate:"Aug 2, 2025", endDate:"Aug 16, 2025", location:"Parkside Tennis Club", desc:"Doubles-only on clay.", registered:24, max:24, champion:"Fadi & Rami Shaya" },
];

const DEFAULT_TEAMS = [
  { id: "tm1", p1: "Fadi Shaya", p2: "Josh Polsky", type: "Open Doubles", rating: "8.5+", status: "active" },
  { id: "tm2", p1: "Valentina Rueda", p2: "Angela Rueda", type: "Women's Doubles", rating: "6.5+", status: "active" },
];

const DEFAULT_TEAM_REQUESTS = [
  { id: "tr1", from: "Matt Ruttle", to: "Diana Wu", type: "Mixed Doubles", status: "pending" },
];

// ─── Theme ───
const t = {
  bg:"#0d1117",surface:"#151b23",surfaceHover:"#1c232d",card:"#161b22",border:"#2a3140",
  accent:"#c8e635",accentDim:"#a3bc2b",accentGlow:"rgba(200,230,53,0.12)",
  text:"#f0f2f5",textMuted:"#8b95a5",textDim:"#4a5568",
  success:"#4ade80",warning:"#fbbf24",danger:"#f87171",info:"#60a5fa",
};

// ─── Icons ───
const Icon = ({ type, size = 20, color = "currentColor" }) => {
  const p = {
    tennis:<><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 2C9 6 9 18 12 22" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 2C15 6 15 18 12 22" stroke={color} strokeWidth="1.5" fill="none"/><path d="M2 12h20" stroke={color} strokeWidth="1.5"/></>,
    calendar:<><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.5"/></>,
    trophy:<><path d="M8 21h8M12 17v4M17 4V2H7v2M7 4h10a5 5 0 01-5 9 5 5 0 01-5-9z" stroke={color} strokeWidth="1.5" fill="none"/><path d="M7 4H4v2a3 3 0 003 3M17 4h3v2a3 3 0 01-3 3" stroke={color} strokeWidth="1.5" fill="none"/></>,
    sword:<><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M15 21l6-6" stroke={color} strokeWidth="1.5" fill="none"/></>,
    court:<><rect x="2" y="4" width="20" height="16" rx="1" stroke={color} strokeWidth="1.5" fill="none"/><line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1"/><rect x="6" y="7" width="12" height="10" rx="0" stroke={color} strokeWidth="1" fill="none" opacity=".4"/></>,
    star:<><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    send:<><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    check:<><path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" fill="none"/></>,
    x:<><path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" fill="none"/></>,
    clock:<><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 6v6l4 2" stroke={color} strokeWidth="1.5" fill="none"/></>,
    home:<><path d="M3 12l9-9 9 9" stroke={color} strokeWidth="1.5" fill="none"/><path d="M5 10v10h14V10" stroke={color} strokeWidth="1.5" fill="none"/></>,
    logout:<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.5" fill="none"/></>,
    bell:<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.5" fill="none"/></>,
    users:<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="1.5" fill="none"/></>,
    info:<><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2"/></>,
    arrowDown:<><path d="M12 5v14M19 12l-7 7-7-7" stroke={color} strokeWidth="2" fill="none"/></>,
    back:<><path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" fill="none"/></>,
    plus:<><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" fill="none"/></>,
    team:<><circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="17" cy="7" r="3" stroke={color} strokeWidth="1.5" fill="none"/><path d="M2 21v-1a5 5 0 015-5h2M14 15h2a5 5 0 015 5v1" stroke={color} strokeWidth="1.5" fill="none"/><path d="M13 12h0" stroke={color} strokeWidth="3" strokeLinecap="round"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>{p[type]}</svg>;
};

// ─── CSS ───
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Barlow',sans-serif;background:${t.bg};color:${t.text};overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::selection{background:${t.accent};color:${t.bg}}
  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px}
  @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
  .anim{animation:fadeInUp .7s ease-out both}
  .s1{animation-delay:.1s}.s2{animation-delay:.2s}.s3{animation-delay:.3s}.s4{animation-delay:.4s}.s5{animation-delay:.5s}
`;

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
const Button = ({ children, variant="primary", size="md", onClick, disabled, style, icon }) => {
  const base = { display:"inline-flex",alignItems:"center",gap:8,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"'Barlow Condensed', sans-serif",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",borderRadius:4,transition:"all 0.2s",opacity:disabled?0.5:1,padding:size==="sm"?"8px 16px":size==="lg"?"16px 36px":"12px 24px",fontSize:size==="sm"?12:size==="lg"?15:13 };
  const v = { primary:{background:t.accent,color:t.bg},secondary:{background:"transparent",color:t.text,border:`2px solid ${t.border}`},ghost:{background:"transparent",color:t.textMuted},danger:{background:"rgba(248,113,113,0.1)",color:t.danger,border:`1px solid rgba(248,113,113,0.2)`},success:{background:"rgba(74,222,128,0.1)",color:t.success,border:`1px solid rgba(74,222,128,0.2)`} };
  return <button onClick={onClick} disabled={disabled} style={{...base,...v[variant],...style}} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.filter="brightness(1.15)"}}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.filter="brightness(1)"}}>{icon&&<Icon type={icon} size={size==="sm"?13:15}/>}{children}</button>;
};

const Badge = ({ children, color=t.accent }) => <span style={{display:"inline-flex",padding:"4px 12px",borderRadius:3,fontSize:11,fontWeight:600,background:`${color}15`,color,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Barlow Condensed', sans-serif"}}>{children}</span>;

const Card = ({ children, style, onClick, hover=true }) => <div onClick={onClick} style={{background:t.card,borderRadius:8,border:`1px solid ${t.border}`,padding:24,transition:"all 0.25s",cursor:onClick?"pointer":"default",...style}} onMouseEnter={e=>{if(hover){e.currentTarget.style.borderColor=t.textDim;e.currentTarget.style.transform="translateY(-2px)"}}} onMouseLeave={e=>{if(hover){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.transform="translateY(0)"}}}>{children}</div>;

const Input = ({ label, type="text", value, onChange, placeholder, style, disabled }) => (
  <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:t.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed', sans-serif"}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{background:disabled?t.bg:t.surface,border:`1px solid ${t.border}`,borderRadius:4,padding:"12px 16px",color:disabled?t.textDim:t.text,fontSize:14,fontFamily:"'Barlow', sans-serif",outline:"none",transition:"border-color 0.2s",opacity:disabled?0.6:1}}
      onFocus={e=>{if(!disabled)e.target.style.borderColor=t.accent}} onBlur={e=>e.target.style.borderColor=t.border} />
  </div>
);

const Select = ({ label, value, onChange, options, style, disabled }) => (
  <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:t.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed', sans-serif"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
      style={{background:disabled?t.bg:t.surface,border:`1px solid ${t.border}`,borderRadius:4,padding:"12px 16px",color:disabled?t.textDim:t.text,fontSize:14,fontFamily:"'Barlow', sans-serif",outline:"none",appearance:"none",opacity:disabled?0.6:1,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b95a5' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}}>
      {options.map(o=><option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value}>{typeof o==="string"?o:o.label}</option>)}
    </select>
  </div>
);

const StatBox = ({ label, value, icon, color=t.accent }) => (
  <div style={{display:"flex",alignItems:"center",gap:16,padding:"20px 24px",background:t.surface,borderRadius:6,border:`1px solid ${t.border}`,borderLeft:`3px solid ${color}`}}>
    <div style={{width:44,height:44,borderRadius:6,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon type={icon} size={20} color={color}/></div>
    <div><div style={{fontSize:28,fontWeight:700,fontFamily:"'Oswald', sans-serif",color}}>{value}</div><div style={{fontSize:11,color:t.textMuted,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed', sans-serif"}}>{label}</div></div>
  </div>
);

const SH = ({ badge, title, subtitle, center }) => (
  <div style={{textAlign:center?"center":"left",marginBottom:48}}>
    {badge&&<Badge>{badge}</Badge>}
    <h2 style={{fontFamily:"'Oswald', sans-serif",fontSize:"clamp(32px,5vw,48px)",fontWeight:700,textTransform:"uppercase",letterSpacing:"-0.01em",marginTop:badge?12:0,lineHeight:1.1}}>{title}</h2>
    {subtitle&&<p style={{color:t.textMuted,marginTop:10,fontSize:15,maxWidth:center?500:"100%",margin:center?"10px auto 0":"10px 0 0"}}>{subtitle}</p>}
    <div style={{width:60,height:3,background:t.accent,marginTop:16,marginLeft:center?"auto":0,marginRight:center?"auto":0,borderRadius:2}}/>
  </div>
);

// ─── Overlay ───
const Overlay = ({ children, onClose, title, wide }) => (
  <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",padding:24,animation:"fadeIn 0.2s"}} onClick={onClose}>
    <div style={{background:t.card,borderRadius:12,border:`1px solid ${t.border}`,width:"100%",maxWidth:wide?900:640,maxHeight:"85vh",overflow:"auto",animation:"slideUp 0.3s ease-out"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 28px",borderBottom:`1px solid ${t.border}`,position:"sticky",top:0,background:t.card,zIndex:1}}>
        <h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:20,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{title}</h3>
        <button onClick={onClose} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:4,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.textMuted}}><Icon type="x" size={16}/></button>
      </div>
      <div style={{padding:28}}>{children}</div>
    </div>
  </div>
);

// ─── Court Card ───
const CourtCard = ({ court, selectable, selected, onSelect }) => (
  <div onClick={onSelect} style={{position:"relative",overflow:"hidden",background:t.card,borderRadius:8,border:`1px solid ${selected?t.accent:t.border}`,padding:20,transition:"all 0.2s",cursor:selectable?"pointer":"default",boxShadow:selected?`0 0 0 1px ${t.accent}`:"none"}}
    onMouseEnter={e=>{if(selectable)e.currentTarget.style.borderColor=selected?t.accent:t.textDim}} onMouseLeave={e=>{if(selectable)e.currentTarget.style.borderColor=selected?t.accent:t.border}}>
    <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:selected?t.accent:`${t.accent}40`}}/>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12,paddingLeft:8}}>
      <div style={{width:44,height:44,borderRadius:6,background:`${t.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${t.accent}20`,flexShrink:0}}><Icon type="court" size={20} color={t.accent}/></div>
      <div style={{minWidth:0}}><h4 style={{fontFamily:"'Oswald', sans-serif",fontSize:15,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.03em"}}>{court.name}</h4><div style={{fontSize:12,color:t.textMuted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{court.address}</div></div>
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingLeft:8}}>
      <Badge color={t.info}>{court.surface}</Badge><Badge color={court.lights?t.success:t.textDim}>{court.lights?"Lights":"No Lights"}</Badge><Badge>{court.courts} Courts</Badge>
    </div>
    {selected&&<div style={{position:"absolute",top:10,right:10}}><Icon type="check" size={18} color={t.accent}/></div>}
  </div>
);

// ─── Availability Dots (S M T W T F S) ───
const AvailDots = ({ avail, size="sm" }) => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const letters = ["S","M","T","W","T","F","S"];
  const sz = size==="sm" ? 11 : 13;
  return (
    <div style={{display:"flex",gap:size==="sm"?2:4}}>
      {days.map((d,i)=>{
        const on = avail?.[d];
        return <span key={d+i} style={{fontSize:sz,fontWeight:700,fontFamily:"'Barlow Condensed', sans-serif",color:on?t.accent:t.textDim,opacity:on?1:0.35,letterSpacing:0,lineHeight:1}}>{letters[i]}</span>;
      })}
    </div>
  );
};

// ═══════════════════════════════════════
// OVERLAY: SEND CHALLENGE (with locked opponent + availability)
// ═══════════════════════════════════════
const SendChallengeOverlay = ({ onClose, userName, lockedPlayer }) => {
  const [form, setForm] = useState({ opponent: lockedPlayer?.name || "", date: "", time: "6:00 PM", courtId: null });
  const [sent, setSent] = useState(false);
  const opp = lockedPlayer || DEMO_PLAYERS.find(p => p.name === form.opponent);

  const handleSend = async () => {
    if (!form.opponent || !form.date || !form.courtId) return;
    const court = COURTS.find(c => c.id === form.courtId);
    const ch = { id:`c${Date.now()}`, from:userName, to:form.opponent, date:form.date, time:form.time, court:court?.name||"", status:"pending" };
    const existing = await loadData("gatl-challenges", []);
    await saveData("gatl-challenges", [...existing, ch]);
    setSent(true);
  };

  if (sent) return (
    <Overlay onClose={onClose} title="Challenge Sent">
      <div style={{textAlign:"center",padding:"32px 0"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:`${t.success}15`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:`2px solid ${t.success}30`}}><Icon type="check" size={28} color={t.success}/></div>
        <h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:22,fontWeight:600,textTransform:"uppercase",marginBottom:8}}>Challenge Sent!</h3>
        <p style={{color:t.textMuted}}>Your challenge to <strong>{form.opponent}</strong> has been submitted.</p>
        <Button style={{marginTop:24}} onClick={onClose}>Done</Button>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose} title={lockedPlayer ? `Challenge ${lockedPlayer.name}` : "Send Challenge"} wide>
      {/* Opponent availability banner */}
      {opp?.avail && (
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"14px 20px",background:t.surface,borderRadius:6,border:`1px solid ${t.border}`,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:`${t.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:t.accent,fontFamily:"'Oswald', sans-serif",flexShrink:0}}>{opp.name.charAt(0)}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{opp.name} <span style={{color:t.textMuted,fontWeight:400}}>({opp.rating} NTRP)</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:t.textMuted,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>Available:</span>
              <div style={{display:"flex",gap:6}}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>{
                  const on = opp.avail[d];
                  return <span key={d} style={{fontSize:12,fontWeight:700,fontFamily:"'Barlow Condensed', sans-serif",padding:"2px 6px",borderRadius:3,background:on?`${t.accent}15`:"transparent",color:on?t.accent:t.textDim,border:`1px solid ${on?t.accent+"30":"transparent"}`}}>{["S","M","T","W","T","F","S"][i]}</span>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
        {lockedPlayer ? (
          <Input label="Opponent" value={lockedPlayer.name} onChange={()=>{}} disabled />
        ) : (
          <Select label="Opponent" value={form.opponent} onChange={v=>setForm({...form,opponent:v})}
            options={[{value:"",label:"Select a player..."},...DEMO_PLAYERS.map(p=>({value:p.name,label:`${p.name} (${p.rating})`}))]} />
        )}
        <Input label="Date" type="date" value={form.date} onChange={v=>setForm({...form,date:v})} />
        <Select label="Time" value={form.time} onChange={v=>setForm({...form,time:v})}
          options={["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"]} />
      </div>
      <label style={{fontSize:11,fontWeight:600,color:t.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed', sans-serif",display:"block",marginBottom:12}}>Select Court</label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        {COURTS.map(c=><CourtCard key={c.id} court={c} selectable selected={form.courtId===c.id} onSelect={()=>setForm({...form,courtId:c.id})}/>)}
      </div>
      <div style={{display:"flex",gap:12}}>
        <Button onClick={handleSend} icon="send" disabled={!form.opponent||!form.date||!form.courtId}>Send Challenge</Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </Overlay>
  );
};

// ═══════════════════════════════════════
// OVERLAY: SET AVAILABILITY
// ═══════════════════════════════════════
const SetAvailabilityOverlay = ({ onClose }) => {
  const [av, setAv] = useState({});
  const [drag, setDrag] = useState(false);
  const [act, setAct] = useState(null);
  useEffect(()=>{(async()=>setAv(await loadData("gatl-availability",{})))();},[]);
  const toggle = useCallback((d,ti)=>{
    setAv(prev=>{const k=`${d}-${ti}`;const n={...prev};if(act===null){if(n[k])delete n[k];else n[k]=true}else if(act==="add")n[k]=true;else delete n[k];saveData("gatl-availability",n);return n;});
  },[act]);
  const md=(d,ti)=>{setDrag(true);setAct(av[`${d}-${ti}`]?"remove":"add");toggle(d,ti);};
  const me=(d,ti)=>{if(drag)toggle(d,ti);};
  const stop=()=>{setDrag(false);setAct(null);};
  return(
    <Overlay onClose={onClose} title="Set Availability" wide>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <p style={{color:t.textMuted,fontSize:13}}>Click and drag to set when you're free to play.</p>
        <div style={{display:"flex",gap:12,alignItems:"center"}}><Badge>{Object.keys(av).length} slots</Badge><Button variant="danger" size="sm" onClick={async()=>{setAv({});await saveData("gatl-availability",{});}} icon="x">Clear</Button></div>
      </div>
      <div style={{overflow:"auto",border:`1px solid ${t.border}`,borderRadius:6}} onMouseUp={stop} onMouseLeave={stop}>
        <div style={{display:"grid",gridTemplateColumns:`72px repeat(7,1fr)`,minWidth:580,userSelect:"none"}}>
          <div style={{padding:12,background:t.surface,borderBottom:`1px solid ${t.border}`}}/>
          {DAYS.map(d=><div key={d} style={{padding:12,textAlign:"center",fontWeight:600,fontSize:12,background:t.surface,borderBottom:`1px solid ${t.border}`,color:t.textMuted,letterSpacing:"0.1em",fontFamily:"'Barlow Condensed', sans-serif",textTransform:"uppercase"}}>{d}</div>)}
          {TIME_SLOTS.map(ti=>(<>
            <div key={`l-${ti}`} style={{padding:"10px 12px",fontSize:11,color:t.textDim,fontWeight:600,display:"flex",alignItems:"center",borderBottom:`1px solid ${t.border}08`,fontFamily:"'Barlow Condensed', sans-serif"}}>{ti}</div>
            {DAYS.map(d=>{const on=av[`${d}-${ti}`];return(
              <div key={`${d}-${ti}`} onMouseDown={()=>md(d,ti)} onMouseEnter={()=>me(d,ti)} style={{padding:3,borderBottom:`1px solid ${t.border}08`,borderLeft:`1px solid ${t.border}08`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:"100%",height:28,borderRadius:3,background:on?`${t.accent}20`:"transparent",border:`1px solid ${on?t.accent+"50":"transparent"}`,transition:"all 0.1s",display:"flex",alignItems:"center",justifyContent:"center"}}>{on&&<div style={{width:5,height:5,borderRadius:"50%",background:t.accent}}/>}</div>
              </div>
            );})}
          </>))}
        </div>
      </div>
      <div style={{marginTop:14,display:"flex",gap:20,justifyContent:"center",color:t.textDim,fontSize:12}}>
        <span style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:14,borderRadius:3,background:`${t.accent}20`,border:`1px solid ${t.accent}50`}}/> Available</span>
        <span style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:14,borderRadius:3,border:`1px solid ${t.border}`}}/> Unavailable</span>
      </div>
    </Overlay>
  );
};

// ═══════════════════════════════════════
// OVERLAY: BROWSE COURTS
// ═══════════════════════════════════════
const BrowseCourtsOverlay = ({ onClose }) => (
  <Overlay onClose={onClose} title="Browse Courts" wide>
    <p style={{color:t.textMuted,fontSize:13,marginBottom:20}}>Available courts across Essex County.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{COURTS.map(c=><CourtCard key={c.id} court={c}/>)}</div>
  </Overlay>
);

// ═══════════════════════════════════════
// NAV
// ═══════════════════════════════════════
const Navbar = ({ page, setPage, loggedIn, onLogout, userName, isAdmin, impersonating, onStopImpersonate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>30);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const items = !loggedIn
    ? [{id:"home",label:"Home"},{id:"about",label:"About"},{id:"divisions",label:"Divisions"},{id:"champions",label:"Champions"}]
    : isAdmin && !impersonating
    ? [{id:"admin-impersonate",label:"Impersonate"},{id:"admin-settings",label:"Settings"}]
    : [{id:"dashboard",label:"Dashboard"},{id:"tournaments",label:"Tournaments"},{id:"community",label:"Community"}];
  return(<>
    {/* Impersonation banner */}
    {impersonating && (
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:`linear-gradient(90deg, ${t.danger}, #c2185b)`,padding:"8px 32px",display:"flex",alignItems:"center",justifyContent:"center",gap:16,fontSize:13,fontWeight:600,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",color:"#fff"}}>
        <Icon type="info" size={14} color="#fff" />
        Impersonating: {impersonating}
        <button onClick={onStopImpersonate} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:3,padding:"4px 14px",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Exit</button>
      </div>
    )}
    <nav style={{position:"fixed",top:impersonating?34:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(13,17,23,0.95)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?`1px solid ${t.border}`:"1px solid transparent",transition:"all 0.3s"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:76}}>
        <div style={{display:"flex",alignItems:"center",gap:14,cursor:"pointer"}} onClick={()=>setPage(loggedIn?(isAdmin&&!impersonating?"admin-impersonate":"dashboard"):"home")}>
          <div style={{width:42,height:42,borderRadius:"50%",background:isAdmin&&!impersonating?t.danger:t.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon type="tennis" size={22} color={isAdmin&&!impersonating?"#fff":t.bg}/></div>
          <div><span style={{fontFamily:"'Oswald', sans-serif",fontWeight:700,fontSize:22,letterSpacing:"0.05em",textTransform:"uppercase"}}>GATL</span><span style={{fontSize:9,color:isAdmin&&!impersonating?t.danger:t.textMuted,display:"block",letterSpacing:"0.15em",fontFamily:"'Barlow Condensed', sans-serif",fontWeight:500,textTransform:"uppercase"}}>{isAdmin&&!impersonating?"Admin Portal":"Est. 2016"}</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {items.map(i=><button key={i.id} onClick={()=>setPage(i.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 16px",fontFamily:"'Barlow Condensed', sans-serif",fontWeight:600,fontSize:14,letterSpacing:"0.1em",textTransform:"uppercase",color:page===i.id?t.accent:t.textMuted,borderBottom:page===i.id?`2px solid ${t.accent}`:"2px solid transparent",transition:"color 0.2s"}} onMouseEnter={e=>{if(page!==i.id)e.target.style.color=t.text}} onMouseLeave={e=>{if(page!==i.id)e.target.style.color=t.textMuted}}>{i.label}</button>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {loggedIn?(<>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",background:t.surface,borderRadius:4,border:`1px solid ${isAdmin&&!impersonating?t.danger+"50":t.border}`}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:isAdmin&&!impersonating?`${t.danger}20`:`${t.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:isAdmin&&!impersonating?t.danger:t.accent}}>{(impersonating||userName).charAt(0).toUpperCase()}</div>
              <span style={{fontWeight:600,fontSize:13,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.05em",textTransform:"uppercase"}}>{impersonating||userName}</span>
              {isAdmin&&!impersonating&&<Badge color={t.danger}>Admin</Badge>}
            </div>
            <button onClick={onLogout} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:4,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.textMuted}}><Icon type="logout" size={16}/></button>
          </>):(<><Button variant="ghost" size="sm" onClick={()=>setPage("login")}>Log In</Button><Button size="sm" onClick={()=>setPage("register")}>Join League</Button></>)}
        </div>
      </div>
    </nav>
  </>);
};

// ═══════════════════════════════════════
// HERO + PUBLIC SECTIONS (compact)
// ═══════════════════════════════════════
const Hero = ({ sp }) => (
  <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:`radial-gradient(ellipse 80% 50% at 20% 60%,rgba(76,120,30,0.18) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 75% 30%,rgba(200,230,53,0.08) 0%,transparent 50%),radial-gradient(ellipse 100% 80% at 50% 100%,rgba(34,80,20,0.15) 0%,transparent 60%),${t.bg}`}}>
    <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(${t.accent} 1px,transparent 1px),linear-gradient(90deg,${t.accent} 1px,transparent 1px)`,backgroundSize:"80px 80px"}}/>
    <div style={{position:"absolute",left:"10%",top:"18%",width:"35%",height:"60%",border:`1px solid ${t.accent}`,opacity:0.06,borderRadius:2}}><div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:t.accent}}/><div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:t.accent}}/></div>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:`linear-gradient(transparent,${t.bg})`}}/>
    <div style={{position:"absolute",right:"-5%",bottom:"5%",opacity:0.04}}><svg width="500" height="500" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" stroke={t.accent} strokeWidth="2" fill="none"/><path d="M50 2 C35 25,35 75,50 98" stroke={t.accent} strokeWidth="2" fill="none"/><path d="M50 2 C65 25,65 75,50 98" stroke={t.accent} strokeWidth="2" fill="none"/></svg></div>
    <div style={{textAlign:"center",maxWidth:900,padding:"140px 24px 100px",position:"relative",zIndex:1}}>
      <div className="anim" style={{marginBottom:28}}><span style={{display:"inline-block",padding:"8px 20px",fontSize:12,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,border:`1px solid ${t.accent}40`,borderRadius:3,fontFamily:"'Barlow Condensed', sans-serif"}}>Season 11 — Registration Open</span></div>
      <h1 className="anim s1" style={{fontFamily:"'Oswald', sans-serif",fontSize:"clamp(56px,10vw,110px)",fontWeight:700,lineHeight:0.95,letterSpacing:"0.02em",textTransform:"uppercase",marginBottom:28,color:"#fff"}}>GREATER<br/><span style={{color:t.accent,textShadow:"0 0 80px rgba(200,230,53,0.25)"}}>AMHERSTBURG</span><br/>TENNIS LEAGUE</h1>
      <p className="anim s2" style={{fontSize:17,color:"rgba(255,255,255,0.65)",maxWidth:520,margin:"0 auto 44px",lineHeight:1.7,fontWeight:300}}>Essex County's premier outdoor public tennis league. Nearly 300 players competing across all skill levels.</p>
      <div className="anim s3" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}><Button size="lg" onClick={()=>sp("register")} icon="tennis">Join the League</Button><Button variant="secondary" size="lg" onClick={()=>sp("about")} icon="info">Learn More</Button></div>
      <div className="anim s4" style={{display:"flex",gap:56,justifyContent:"center",marginTop:72}}>{[{n:"300+",l:"Active Players"},{n:"10",l:"Seasons"},{n:"14",l:"Divisions"},{n:"5",l:"Courts"}].map(s=><div key={s.l} style={{textAlign:"center"}}><div style={{fontFamily:"'Oswald', sans-serif",fontSize:36,fontWeight:700,color:"#fff"}}>{s.n}</div><div style={{fontSize:11,color:t.textMuted,letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4,fontFamily:"'Barlow Condensed', sans-serif",fontWeight:500}}>{s.l}</div></div>)}</div>
    </div>
  </section>
);

const AboutSection = () => (<section style={{padding:"100px 32px",maxWidth:1200,margin:"0 auto"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}}><div><SH badge="About GATL" title="Celebrating 10 Seasons of Community Tennis"/><p style={{color:t.textMuted,lineHeight:1.85,marginBottom:16,fontSize:15}}>The Greater Amherstburg Tennis League is proud to serve players across Essex County as the region's premier outdoor public tennis league. Now in its 10th season, the GATL continues to grow while honouring its roots in the original Amherstburg Men's Tennis League, established in 2003.</p><p style={{color:t.textMuted,lineHeight:1.85,marginBottom:36,fontSize:15}}>Today, the league brings together nearly 300 active players competing in a wide range of divisions suited for all levels.</p><div style={{display:"flex",flexDirection:"column",gap:16}}>{[{n:"Zekelman Tennis Centre — St. Clair College",d:"Home of the GATL Championships since 2022"},{n:"Parkside Tennis Club",d:"Host of Thursday Night Tennis (TNT)"}].map(v=><div key={v.n} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"16px 20px",background:t.surface,borderRadius:6,border:`1px solid ${t.border}`}}><div style={{width:4,minHeight:40,background:t.accent,borderRadius:2,flexShrink:0}}/><div><div style={{fontWeight:600,fontSize:14}}>{v.n}</div><div style={{fontSize:13,color:t.textMuted,marginTop:4}}>{v.d}</div></div></div>)}</div></div><div style={{background:t.surface,borderRadius:8,padding:56,textAlign:"center",border:`1px solid ${t.border}`,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:4,background:t.accent}}/><div style={{fontFamily:"'Oswald', sans-serif",fontSize:120,fontWeight:700,color:t.accent,lineHeight:1,opacity:0.15}}>10</div><div style={{fontSize:22,fontWeight:700,marginTop:-16,fontFamily:"'Oswald', sans-serif",textTransform:"uppercase"}}>Seasons Strong</div><div style={{color:t.textMuted,fontSize:14,marginTop:8}}>Play. Compete. Connect. Grow.</div><div style={{marginTop:36,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{[{i:"tennis",l:"Singles",c:"8 Divisions"},{i:"users",l:"Doubles",c:"6 Divisions"},{i:"trophy",l:"Tournaments",c:"2 Per Season"},{i:"star",l:"Playoffs",c:"All Divisions"}].map(s=><div key={s.l} style={{padding:18,background:t.card,borderRadius:6,border:`1px solid ${t.border}`}}><Icon type={s.i} size={18} color={t.accent}/><div style={{fontSize:13,fontWeight:600,marginTop:8,fontFamily:"'Barlow Condensed', sans-serif",textTransform:"uppercase"}}>{s.l}</div><div style={{fontSize:12,color:t.textMuted}}>{s.c}</div></div>)}</div></div></div></section>);

const DivisionsSection = () => (<section style={{padding:"80px 32px",maxWidth:1200,margin:"0 auto"}}><SH badge="2026 Season" title="League Divisions" center/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>{Object.entries(DIVISIONS).map(([n,lv])=><Card key={n} style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${t.accent},transparent)`}}/><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,paddingTop:8}}><div style={{width:40,height:40,borderRadius:6,background:`${t.accent}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon type={n.includes("Doubles")?"users":n.includes("Mixed")?"star":"tennis"} size={18} color={t.accent}/></div><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:18,fontWeight:600,textTransform:"uppercase"}}>{n}</h3></div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{lv.map(l=><span key={l} style={{padding:"6px 14px",borderRadius:3,fontSize:13,fontWeight:600,background:t.surface,border:`1px solid ${t.border}`,fontFamily:"'Barlow Condensed', sans-serif"}}>{l}</span>)}</div></Card>)}</div></section>);

const ChampionsSection = () => { const [yr,setYr]=useState(2025); const data={2025:[{d:"Open 5.0+",n:"Adrian Mag"},{d:"Open 4.5",n:"Matt Ruttle"},{d:"Open 4.0",n:"Hermann Djodanko"},{d:"Open 3.5",n:"Aaron Vandelinder"},{d:"Open 3.0",n:"Kazik Czubernat"},{d:"Women's 3.5+",n:"Valentina Rueda"},{d:"Women's 3.0",n:"Ivana Vujadinoric"},{d:"Men's Doubles 8.5+",n:"Fadi & Rami Shaya"},{d:"Women's Doubles",n:"Valentina & Angela Rueda"},{d:"Mixed Doubles 6.5+",n:"Diana Wu & Yong Li"}],2024:[{d:"Open 4.5+",n:"Matteo Palumbo"},{d:"Open 4.0",n:"Mark Kupko"},{d:"Open 3.5",n:"Peter Bastien"},{d:"Women's 3.5+",n:"Margaret Bowers"}]}; return(<section style={{padding:"80px 32px",background:t.surface}}><div style={{maxWidth:1200,margin:"0 auto"}}><SH badge="Hall of Champions" title="Playoff Champions" center/><div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:40,flexWrap:"wrap"}}>{[2025,2024,2023,2022].map(y=><button key={y} onClick={()=>setYr(y)} style={{padding:"10px 22px",borderRadius:4,border:"none",background:yr===y?t.accent:"transparent",color:yr===y?t.bg:t.textMuted,cursor:"pointer",fontFamily:"'Oswald', sans-serif",fontWeight:600,fontSize:16,transition:"all 0.2s"}}>{y}</button>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>{(data[yr]||[{d:"Coming soon",n:"Check back"}]).map((c,i)=><Card key={i} style={{display:"flex",alignItems:"center",gap:14,padding:18}}><div style={{width:44,height:44,borderRadius:"50%",background:`${t.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`2px solid ${t.accent}30`}}><Icon type="trophy" size={18} color={t.accent}/></div><div><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{c.n}</div><div style={{fontSize:12,color:t.textMuted,fontFamily:"'Barlow Condensed', sans-serif",textTransform:"uppercase"}}>{c.d}</div></div></Card>)}</div></div></section>);};

const SponsorsSection = () => (<section style={{padding:"60px 32px",maxWidth:1200,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:t.textMuted,marginBottom:24,fontFamily:"'Barlow Condensed', sans-serif"}}>2026 League Sponsors</div><div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>{SPONSORS.map(s=><a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{padding:"12px 24px",background:t.card,borderRadius:4,border:`1px solid ${t.border}`,color:t.textMuted,textDecoration:"none",fontSize:13,fontWeight:600,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.05em",textTransform:"uppercase",transition:"all 0.2s"}} onMouseEnter={e=>{e.target.style.borderColor=t.accent;e.target.style.color=t.accent}} onMouseLeave={e=>{e.target.style.borderColor=t.border;e.target.style.color=t.textMuted}}>{s.name}</a>)}</div></section>);

const Footer = () => (<footer style={{padding:"60px 32px 40px",borderTop:`1px solid ${t.border}`,background:t.surface}}><div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48}}><div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><div style={{width:36,height:36,borderRadius:"50%",background:t.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon type="tennis" size={18} color={t.bg}/></div><span style={{fontFamily:"'Oswald', sans-serif",fontWeight:700,fontSize:20,letterSpacing:"0.05em",textTransform:"uppercase"}}>GATL</span></div><p style={{color:t.textMuted,fontSize:14,lineHeight:1.7,maxWidth:400}}>Greater Amherstburg Tennis League — Essex County's premier outdoor public tennis league since 2016.</p></div><div><h4 style={{fontWeight:600,fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16,color:t.textMuted,fontFamily:"'Barlow Condensed', sans-serif"}}>Contact</h4><div style={{display:"flex",flexDirection:"column",gap:10,color:t.textMuted,fontSize:14}}><span>Bill Seagris</span><a href="mailto:bill@gatl.ca" style={{color:t.accent,textDecoration:"none"}}>bill@gatl.ca</a><span>313-669-7059</span></div></div><div><h4 style={{fontWeight:600,fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16,color:t.textMuted,fontFamily:"'Barlow Condensed', sans-serif"}}>Quick Links</h4><div style={{display:"flex",flexDirection:"column",gap:10,color:t.textMuted,fontSize:14}}><a href="https://gatl.youcanbook.me/" target="_blank" rel="noopener noreferrer" style={{color:t.textMuted,textDecoration:"none"}}>Book a Court</a></div></div></div><div style={{maxWidth:1200,margin:"32px auto 0",paddingTop:24,borderTop:`1px solid ${t.border}`,textAlign:"center",fontSize:13,color:t.textDim}}>&copy; 2026 GATL. All rights reserved.</div></footer>);

// ─── Auth ───
const AuthBg = ({ children }) => <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 24px",position:"relative",background:`radial-gradient(ellipse 60% 50% at 30% 50%,rgba(76,120,30,0.12) 0%,transparent 60%),${t.bg}`}}><div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:`linear-gradient(${t.accent} 1px,transparent 1px),linear-gradient(90deg,${t.accent} 1px,transparent 1px)`,backgroundSize:"60px 60px"}}/>{children}</div>;
const LoginPage = ({ onLogin, onAdminLogin, sp }) => { const [e,setE]=useState("");const [p,setP]=useState(""); 
  const handleLogin = () => {
    if (e.toLowerCase() === "admin@gatl.ca" && p === "admin") { onAdminLogin(); return; }
    onLogin(e || "Player");
  };
  return <AuthBg><Card style={{maxWidth:440,width:"100%",padding:44,position:"relative",zIndex:1,background:"rgba(22,27,34,0.95)",backdropFilter:"blur(20px)"}}><div style={{textAlign:"center",marginBottom:36}}><div style={{width:56,height:56,borderRadius:"50%",background:t.accent,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Icon type="tennis" size={28} color={t.bg}/></div><h2 style={{fontFamily:"'Oswald', sans-serif",fontSize:30,fontWeight:700,textTransform:"uppercase"}}>Welcome Back</h2><p style={{color:t.textMuted,fontSize:14,marginTop:8}}>Sign in to manage your GATL profile</p></div><div style={{display:"flex",flexDirection:"column",gap:16}}><Input label="Email" type="email" value={e} onChange={setE} placeholder="you@example.com"/><Input label="Password" type="password" value={p} onChange={setP} placeholder="••••••••"/><Button style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={handleLogin} icon="check">Sign In</Button><div style={{textAlign:"center",fontSize:14,color:t.textMuted,marginTop:8}}>Don't have an account? <span style={{color:t.accent,cursor:"pointer",fontWeight:600}} onClick={()=>sp("register")}>Join the league</span></div></div></Card></AuthBg>; };
const RegisterPage = ({ onLogin, sp }) => { const [f,setF]=useState({name:"",email:"",phone:"",rating:"3.0",division:"Open Singles"}); return <AuthBg><Card style={{maxWidth:520,width:"100%",padding:44,position:"relative",zIndex:1,background:"rgba(22,27,34,0.95)",backdropFilter:"blur(20px)"}}><div style={{textAlign:"center",marginBottom:36}}><Badge>Season 11</Badge><h2 style={{fontFamily:"'Oswald', sans-serif",fontSize:30,fontWeight:700,marginTop:12,textTransform:"uppercase"}}>Join GATL</h2><p style={{color:t.textMuted,fontSize:14,marginTop:8}}>Register for the 2026 season</p></div><div style={{display:"flex",flexDirection:"column",gap:16}}><Input label="Full Name" value={f.name} onChange={v=>setF({...f,name:v})} placeholder="John Smith"/><Input label="Email" type="email" value={f.email} onChange={v=>setF({...f,email:v})} placeholder="you@example.com"/><Input label="Phone" value={f.phone} onChange={v=>setF({...f,phone:v})} placeholder="(519) 555-0123"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Select label="NTRP Rating" value={f.rating} onChange={v=>setF({...f,rating:v})} options={["2.0","2.5","3.0","3.5","4.0","4.5","5.0+"]}/><Select label="Division" value={f.division} onChange={v=>setF({...f,division:v})} options={Object.keys(DIVISIONS)}/></div><Button style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>onLogin(f.name||"Player")} icon="tennis">Register & Join</Button><div style={{textAlign:"center",fontSize:14,color:t.textMuted}}>Already a member? <span style={{color:t.accent,cursor:"pointer",fontWeight:600}} onClick={()=>sp("login")}>Sign in</span></div></div></Card></AuthBg>; };

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
const Dashboard = ({ userName }) => {
  const [ch, setCh] = useState([]);
  const [up, setUp] = useState([]);
  const [ov, setOv] = useState(null);
  useEffect(()=>{(async()=>{
    const c=await loadData("gatl-challenges",[{id:"c1",from:"Matt Ruttle",to:userName,date:"Feb 18",time:"6:00 PM",court:"Libro Centre Courts",status:"pending"},{id:"c2",from:userName,to:"Hermann Djodanko",date:"Feb 20",time:"7:00 PM",court:"Zekelman Tennis Centre",status:"accepted"}]);
    setCh(c); setUp([{opponent:"Hermann Djodanko",date:"Feb 20",time:"7:00 PM",court:"Zekelman Tennis Centre"}]);
  })();},[userName]);
  const pending=ch.filter(c=>c.status==="pending"&&c.to===userName);
  return(
    <div style={{padding:"108px 32px 60px",maxWidth:1200,margin:"0 auto"}}>
      <div className="anim" style={{marginBottom:40}}><h1 style={{fontFamily:"'Oswald', sans-serif",fontSize:40,fontWeight:700,textTransform:"uppercase"}}>Welcome back, <span style={{color:t.accent}}>{userName}</span></h1><p style={{color:t.textMuted,marginTop:8,fontSize:15}}>Here's your league overview for the 2026 season.</p><div style={{width:60,height:3,background:t.accent,marginTop:16,borderRadius:2}}/></div>
      <div className="anim s1" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}><StatBox label="Wins" value="8" icon="trophy" color={t.success}/><StatBox label="Losses" value="3" icon="x" color={t.danger}/><StatBox label="Rating" value="4.0" icon="star" color={t.accent}/><StatBox label="Pending" value={pending.length} icon="bell" color={t.warning}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <Card className="anim s2" hover={false}><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:18,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",display:"flex",alignItems:"center",gap:10,marginBottom:20}}><Icon type="sword" size={18} color={t.accent}/> Match Requests</h3>{pending.length===0?<p style={{color:t.textDim,fontSize:14}}>No pending match requests</p>:pending.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:16,background:t.surface,borderRadius:6,border:`1px solid ${t.border}`,marginBottom:8}}><div><div style={{fontWeight:600}}>{c.from}</div><div style={{fontSize:12,color:t.textMuted}}>{c.date} at {c.time} — {c.court}</div></div><div style={{display:"flex",gap:8}}><Button variant="success" size="sm" icon="check">Accept</Button><Button variant="danger" size="sm" icon="x">Decline</Button></div></div>)}</Card>
        <Card className="anim s3" hover={false}><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:18,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",display:"flex",alignItems:"center",gap:10,marginBottom:20}}><Icon type="calendar" size={18} color={t.accent}/> Upcoming Matches</h3>{up.length===0?<p style={{color:t.textDim,fontSize:14}}>No upcoming matches</p>:up.map((m,i)=><div key={i} style={{padding:16,background:t.surface,borderRadius:6,border:`1px solid ${t.border}`,marginBottom:8,display:"flex",alignItems:"center",gap:16}}><div style={{width:48,height:48,borderRadius:6,background:`${t.accent}12`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${t.accent}25`}}><Icon type="tennis" size={20} color={t.accent}/></div><div style={{flex:1}}><div style={{fontWeight:600}}>vs {m.opponent}</div><div style={{fontSize:12,color:t.textMuted}}>{m.date} at {m.time}</div></div><Badge color={t.info}>{m.court}</Badge></div>)}</Card>
      </div>
      <div className="anim s4" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:24}}>
        {[{label:"Send Challenge",icon:"sword",key:"challenge",desc:"Challenge another player"},{label:"Set Availability",icon:"calendar",key:"availability",desc:"Update your schedule"},{label:"Browse Courts",icon:"court",key:"courts",desc:"Find a court to play"}].map(a=>
          <Card key={a.key} onClick={()=>setOv(a.key)} style={{cursor:"pointer",textAlign:"center",padding:36}}><div style={{width:56,height:56,borderRadius:8,background:`${t.accent}10`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${t.accent}20`}}><Icon type={a.icon} size={24} color={t.accent}/></div><div style={{fontWeight:600,fontSize:16,marginBottom:4,fontFamily:"'Oswald', sans-serif",textTransform:"uppercase",letterSpacing:"0.05em"}}>{a.label}</div><div style={{fontSize:13,color:t.textMuted}}>{a.desc}</div></Card>
        )}
      </div>
      {ov==="challenge"&&<SendChallengeOverlay onClose={()=>setOv(null)} userName={userName}/>}
      {ov==="availability"&&<SetAvailabilityOverlay onClose={()=>setOv(null)}/>}
      {ov==="courts"&&<BrowseCourtsOverlay onClose={()=>setOv(null)}/>}
    </div>
  );
};

// ═══════════════════════════════════════
// TOURNAMENTS (unchanged from last version)
// ═══════════════════════════════════════
const sc=s=>({registration:t.info,"live-challenges":t.warning,"live-bracket":t.accent,completed:t.textDim}[s]||t.textMuted);
const sl=s=>({registration:"Registration","live-challenges":"Live — Challenges","live-bracket":"Live — Bracket",completed:"Completed"}[s]||s);
const TCard=({tt,onClick})=><Card onClick={onClick} style={{position:"relative",overflow:"hidden",cursor:"pointer"}}><div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:sc(tt.stage)}}/><div style={{paddingLeft:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:18,fontWeight:600,textTransform:"uppercase"}}>{tt.name}</h3><div style={{fontSize:13,color:t.textMuted,marginTop:4}}>{tt.location}</div></div><Badge color={sc(tt.stage)}>{sl(tt.stage)}</Badge></div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}><Badge>{tt.year}</Badge><Badge color={t.info}>{tt.rating}</Badge></div><div style={{fontSize:13,color:t.textMuted}}>{tt.startDate} — {tt.endDate}</div>{tt.stage==="registration"&&<div style={{marginTop:12,background:t.surface,borderRadius:4,padding:"8px 12px",fontSize:12,color:t.textMuted,border:`1px solid ${t.border}`}}><span style={{color:t.text,fontWeight:600}}>{tt.registered}</span>/{tt.max} registered</div>}{tt.stage==="completed"&&tt.champion&&<div style={{marginTop:12,display:"flex",alignItems:"center",gap:8,fontSize:13}}><Icon type="trophy" size={14} color={t.accent}/><span style={{color:t.accent,fontWeight:600}}>Champion: {tt.champion}</span></div>}</div></Card>;

const TDetail=({tt,onBack})=>(<div><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",gap:8,fontSize:13,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600,marginBottom:24}}><Icon type="back" size={16}/>Back to Tournaments</button><div style={{marginBottom:32}}><h2 style={{fontFamily:"'Oswald', sans-serif",fontSize:36,fontWeight:700,textTransform:"uppercase"}}>{tt.name}</h2><p style={{color:t.textMuted,marginTop:6}}>{tt.desc}</p><div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}><Badge>{tt.year}</Badge><Badge color={t.info}>{tt.rating}</Badge><Badge color={sc(tt.stage)}>{sl(tt.stage)}</Badge><Badge>{tt.location}</Badge></div><div style={{width:60,height:3,background:t.accent,marginTop:20,borderRadius:2}}/></div>
  {tt.stage==="registration"&&<Card hover={false}><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:20,fontWeight:600,textTransform:"uppercase",marginBottom:16}}>Registration Open</h3><p style={{color:t.textMuted,fontSize:14,marginBottom:20}}>{tt.registered} of {tt.max} spots filled.</p><div style={{background:t.surface,borderRadius:4,height:8,marginBottom:20,overflow:"hidden"}}><div style={{height:"100%",width:`${(tt.registered/tt.max)*100}%`,background:t.accent,borderRadius:4}}/></div><Button icon="check">Register Now</Button></Card>}
  {tt.stage==="live-challenges"&&tt.players&&<Card hover={false} style={{padding:0,overflow:"hidden"}}><div style={{padding:"20px 24px",borderBottom:`1px solid ${t.border}`}}><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:20,fontWeight:600,textTransform:"uppercase"}}>Active Standings</h3></div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:t.surface}}>{["#","Player","Rating","W","L"].map(h=><th key={h} style={{padding:"12px 20px",textAlign:"left",fontSize:11,fontWeight:600,color:t.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",borderBottom:`2px solid ${t.border}`,fontFamily:"'Barlow Condensed', sans-serif"}}>{h}</th>)}</tr></thead><tbody>{tt.players.sort((a,b)=>(b.wins-b.losses)-(a.wins-a.losses)).map((p,i)=><tr key={p.name} style={{borderBottom:`1px solid ${t.border}08`}} onMouseEnter={e=>e.currentTarget.style.background=t.surfaceHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"12px 20px",fontWeight:700,color:i===0?t.accent:t.textMuted,fontFamily:"'Oswald', sans-serif",fontSize:16}}>{i+1}</td><td style={{padding:"12px 20px",fontWeight:600}}>{p.name}</td><td style={{padding:"12px 20px"}}><Badge>{p.rating}</Badge></td><td style={{padding:"12px 20px",fontWeight:700,color:t.success}}>{p.wins}</td><td style={{padding:"12px 20px",fontWeight:700,color:t.danger}}>{p.losses}</td></tr>)}</tbody></table></Card>}
  {tt.stage==="live-bracket"&&tt.bracket&&<div style={{display:"flex",gap:32,overflowX:"auto",paddingBottom:16}}>{[{label:"Quarterfinals",m:tt.bracket.qf},{label:"Semifinals",m:tt.bracket.sf},{label:"Final",m:tt.bracket.final}].map(r=><div key={r.label} style={{minWidth:260,flex:"0 0 260px"}}><div style={{fontSize:12,fontWeight:600,color:t.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Barlow Condensed', sans-serif",marginBottom:16,textAlign:"center"}}>{r.label}</div><div style={{display:"flex",flexDirection:"column",gap:12,justifyContent:"space-around",height:"100%"}}>{r.m.map((m,i)=><div key={i} style={{background:t.card,borderRadius:6,border:`1px solid ${t.border}`,overflow:"hidden"}}>{[m.p1,m.p2].map(pl=><div key={pl} style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:pl===m.p1?`1px solid ${t.border}`:"none",background:m.winner===pl?`${t.accent}08`:"transparent"}}><span style={{fontWeight:m.winner===pl?700:400,color:m.winner===pl?t.accent:t.text,fontSize:13}}>{pl}</span>{m.winner===pl&&<Icon type="check" size={14} color={t.accent}/>}</div>)}<div style={{padding:"6px 16px",fontSize:11,color:m.score?t.textDim:t.warning,background:t.surface,textAlign:"center",fontWeight:m.score?400:600}}>{m.score||"TBD"}</div></div>)}</div></div>)}</div>}
  {tt.stage==="completed"&&<Card hover={false} style={{textAlign:"center",padding:48}}><div style={{width:64,height:64,borderRadius:"50%",background:`${t.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",border:`2px solid ${t.accent}30`}}><Icon type="trophy" size={28} color={t.accent}/></div><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:22,fontWeight:600,textTransform:"uppercase"}}>Tournament Complete</h3>{tt.champion&&<p style={{color:t.accent,fontSize:16,fontWeight:600,marginTop:8}}>Champion: {tt.champion}</p>}<p style={{color:t.textMuted,fontSize:14,marginTop:8}}>{tt.registered} players participated</p></Card>}
</div>);

const TournamentsPage = () => { const [sel,setSel]=useState(null); if(sel) return <div style={{padding:"108px 32px 60px",maxWidth:1200,margin:"0 auto"}}><TDetail tt={sel} onBack={()=>setSel(null)}/></div>; const ac=TOURNAMENTS.filter(x=>x.stage!=="completed"); const pa=TOURNAMENTS.filter(x=>x.stage==="completed"); return(<div style={{padding:"108px 32px 60px",maxWidth:1200,margin:"0 auto"}}><SH title="Tournaments" subtitle="Compete in seasonal tournaments across Essex County."/>{ac.length>0&&<><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:22,fontWeight:600,textTransform:"uppercase",marginBottom:20,display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:t.success,boxShadow:`0 0 8px ${t.success}`}}/>Upcoming & Ongoing</h3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16,marginBottom:48}}>{ac.map(x=><TCard key={x.id} tt={x} onClick={()=>setSel(x)}/>)}</div></>}{pa.length>0&&<><h3 style={{fontFamily:"'Oswald', sans-serif",fontSize:22,fontWeight:600,textTransform:"uppercase",marginBottom:20}}>Past Tournaments</h3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>{pa.map(x=><TCard key={x.id} tt={x} onClick={()=>setSel(x)}/>)}</div></>}</div>);};

// ═══════════════════════════════════════
// COMMUNITY PAGE (Players + Teams)
// ═══════════════════════════════════════
const CommunityPage = ({ userName }) => {
  const [topFilter, setTopFilter] = useState("all"); // "all" | "singles" | "doubles"
  const [subFilter, setSubFilter] = useState(null); // null | "open" | "womens" | "mixed"
  const [challengeTarget, setChallengeTarget] = useState(null);
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [requests, setRequests] = useState(DEFAULT_TEAM_REQUESTS);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeamForm, setNewTeamForm] = useState({ partner: "", type: "Open Doubles" });

  const handleTopFilter = (f) => { setTopFilter(f); setSubFilter(null); };

  // Filter logic
  const filtered = DEMO_PLAYERS.filter(p => {
    if (topFilter === "all") return true;
    if (topFilter === "singles") {
      const isSingles = p.division.includes("Singles");
      if (!isSingles) return false;
      if (subFilter === "open") return p.division === "Open Singles";
      if (subFilter === "womens") return p.division === "Women's Singles";
      return true;
    }
    if (topFilter === "doubles") {
      const isDoubles = p.division.includes("Doubles");
      if (!isDoubles) return false;
      if (subFilter === "open") return p.division === "Open Doubles";
      if (subFilter === "womens") return p.division === "Women's Doubles";
      if (subFilter === "mixed") return p.division === "Mixed Doubles";
      return true;
    }
    return true;
  }).sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses));

  const showTeams = topFilter === "all" || topFilter === "doubles";

  // Filter teams by sub-filter when in doubles view
  const filteredTeams = teams.filter(tm => {
    if (topFilter === "all") {
      // Show only "my" teams
      return tm.p1 === userName || tm.p2 === userName;
    }
    if (topFilter === "doubles") {
      if (subFilter === "open") return tm.type === "Open Doubles";
      if (subFilter === "womens") return tm.type === "Women's Doubles";
      if (subFilter === "mixed") return tm.type === "Mixed Doubles";
      return true;
    }
    return false;
  });

  const handleAcceptTeam = (id) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    const team = { id: `tm${Date.now()}`, p1: req.from, p2: req.to, type: req.type, rating: "TBD", status: "active" };
    setTeams([...teams, team]);
    setRequests(requests.filter(r => r.id !== id));
  };
  const handleDeclineTeam = (id) => setRequests(requests.filter(r => r.id !== id));
  const handleCancelTeam = (id) => setRequests(requests.filter(r => r.id !== id));

  const handleSendTeamReq = () => {
    if (!newTeamForm.partner) return;
    const req = { id: `tr${Date.now()}`, from: userName, to: newTeamForm.partner, type: newTeamForm.type, status: "pending" };
    setRequests([...requests, req]);
    setShowNewTeam(false);
    setNewTeamForm({ partner: "", type: "Open Doubles" });
  };

  const shortName = (n) => { const p = n.split(" "); return p.length > 1 ? p[0] + " " + p[p.length-1].charAt(0) + "." : n; };

  const topBtns = [{ id: "all", label: "All Players" }, { id: "singles", label: "Singles" }, { id: "doubles", label: "Doubles" }];
  const singlesSubBtns = [{ id: "open", label: "Open" }, { id: "womens", label: "Women's" }];
  const doublesSubBtns = [{ id: "open", label: "Open" }, { id: "womens", label: "Women's" }, { id: "mixed", label: "Mixed" }];
  const subBtns = topFilter === "singles" ? singlesSubBtns : topFilter === "doubles" ? doublesSubBtns : [];

  const FilterBtn = ({ active, label, onClick }) => (
    <button onClick={onClick} style={{
      padding: "8px 20px", borderRadius: 4, border: "none",
      background: active ? t.accent : "transparent",
      color: active ? t.bg : t.textMuted,
      cursor: "pointer", fontSize: 12, fontWeight: 600,
      fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
      transition: "all 0.15s",
    }}>{label}</button>
  );

  // Participation status dot
  const StatusDot = ({ active }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: active ? t.success : t.textDim,
        boxShadow: active ? `0 0 6px ${t.success}60` : "none",
        opacity: active ? 1 : 0.4,
      }} />
    </div>
  );

  return (
    <div style={{ padding: "108px 32px 60px", maxWidth: 1200, margin: "0 auto" }}>
      <SH title="Community" subtitle="Browse players, manage teams, and send challenges." />

      {/* ─── TOP-LEVEL FILTERS (above everything) ─── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        {topBtns.map(f => <FilterBtn key={f.id} active={topFilter === f.id} label={f.label} onClick={() => handleTopFilter(f.id)} />)}
      </div>

      {/* ─── SUB-FILTERS (appear under Singles or Doubles) ─── */}
      {subBtns.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 8, paddingLeft: 4, animation: "slideUp 0.2s ease-out" }}>
          <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 1, height: 16, background: t.border }} />
          </div>
          {subBtns.map(f => <FilterBtn key={f.id} active={subFilter === f.id} label={f.label} onClick={() => setSubFilter(subFilter === f.id ? null : f.id)} />)}
        </div>
      )}

      {/* ─── PLAYERS SECTION ─── */}
      <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 28, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <Icon type="users" size={20} color={t.accent} /> Players
      </h3>

      <Card hover={false} style={{ padding: 0, overflow: "hidden", marginBottom: showTeams ? 56 : 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.surface }}>
              {["#", "Player", "Rating", "W", "L", "Win %", "2026", "Availability", ""].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: h === "2026" ? "center" : "left", fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: `2px solid ${t.border}`, fontFamily: "'Barlow Condensed', sans-serif", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${t.border}08` }}
                onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: i === 0 ? t.accent : t.textMuted, fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>{i + 1}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: t.accent, flexShrink: 0 }}>{p.name.charAt(0)}</div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}><Badge>{p.rating}</Badge></td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: t.success }}>{p.wins}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: t.danger }}>{p.losses}</td>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{((p.wins / (p.wins + p.losses)) * 100).toFixed(0)}%</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}><StatusDot active={p.active2026} /></td>
                <td style={{ padding: "12px 16px" }}><AvailDots avail={p.avail} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <Button variant="ghost" size="sm" icon="sword" onClick={() => setChallengeTarget(p)}>Challenge</Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: t.textDim }}>No players match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* ─── TEAMS SECTION (only on All Players or Doubles) ─── */}
      {showTeams && (<>
        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon type="team" size={20} color={t.accent} /> Teams</span>
          <Button size="sm" onClick={() => setShowNewTeam(!showNewTeam)} icon={showNewTeam ? "x" : "plus"}>{showNewTeam ? "Cancel" : "Create Team"}</Button>
        </h3>

        {/* New team form */}
        {showNewTeam && (
          <Card hover={false} style={{ marginBottom: 20, animation: "slideUp 0.3s ease-out" }}>
            <h4 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Send Team Request</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
              <Select label="Partner" value={newTeamForm.partner} onChange={v => setNewTeamForm({ ...newTeamForm, partner: v })}
                options={[{ value: "", label: "Select a player..." }, ...DEMO_PLAYERS.map(p => ({ value: p.name, label: p.name }))]} />
              <Select label="Team Type" value={newTeamForm.type} onChange={v => setNewTeamForm({ ...newTeamForm, type: v })}
                options={["Open Doubles", "Women's Doubles", "Mixed Doubles"]} />
              <Button onClick={handleSendTeamReq} icon="send" disabled={!newTeamForm.partner}>Send Request</Button>
            </div>
          </Card>
        )}

        {/* Pending incoming requests */}
        {requests.filter(r => r.to === userName).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.warning, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 12 }}>Pending Requests</div>
            {requests.filter(r => r.to === userName).map(r => (
              <Card key={r.id} hover={false} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{r.from} <span style={{ color: t.textMuted, fontWeight: 400 }}>wants to form a</span> {r.type} <span style={{ color: t.textMuted, fontWeight: 400 }}>team</span></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="success" size="sm" onClick={() => handleAcceptTeam(r.id)} icon="check">Accept</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeclineTeam(r.id)} icon="x">Decline</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Outgoing requests (with cancel button) */}
        {requests.filter(r => r.from === userName).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.info, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 12 }}>Sent Requests</div>
            {requests.filter(r => r.from === userName).map(r => (
              <Card key={r.id} hover={false} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>Waiting on <span style={{ color: t.accent }}>{r.to}</span> — {r.type}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Badge color={t.warning}>Pending</Badge>
                  <Button variant="danger" size="sm" onClick={() => handleCancelTeam(r.id)} icon="x">Cancel</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Active teams */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filteredTeams.map(tm => (
            <Card key={tm.id} style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: t.accent }} />
              <div style={{ paddingLeft: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: t.accent, border: `2px solid ${t.card}`, zIndex: 1 }}>{tm.p1.charAt(0)}</div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${t.info}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: t.info, marginLeft: -10, border: `2px solid ${t.card}` }}>{tm.p2.charAt(0)}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{shortName(tm.p1)} & {shortName(tm.p2)}</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{tm.type}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge color={t.success}>Active</Badge>
                  {tm.rating !== "TBD" && <Badge>{tm.rating}</Badge>}
                </div>
              </div>
            </Card>
          ))}
          {filteredTeams.length === 0 && (
            <div style={{ padding: 24, color: t.textDim, fontSize: 14 }}>
              {topFilter === "all" ? "You're not on any teams yet." : "No teams match this filter."}
            </div>
          )}
        </div>
      </>)}

      {/* Challenge overlay */}
      {challengeTarget && <SendChallengeOverlay onClose={() => setChallengeTarget(null)} userName={userName} lockedPlayer={challengeTarget} />}
    </div>
  );
};

// ═══════════════════════════════════════
// ADMIN: IMPERSONATE PAGE
// ═══════════════════════════════════════
const AdminImpersonatePage = ({ onImpersonate }) => {
  const [search, setSearch] = useState("");
  const rows = DEMO_PLAYERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ padding: "108px 32px 60px", maxWidth: 1200, margin: "0 auto" }}>
      <SH title="Impersonate User" subtitle="Select a player to act on their behalf. You'll see their full portal." />
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center" }}>
        <Input placeholder="Search players..." value={search} onChange={setSearch} style={{ flex: 1, maxWidth: 360 }} />
        <Badge color={t.danger}>{rows.length} Players</Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {rows.map(p => (
          <Card key={p.id} onClick={() => onImpersonate(p.name)} style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: p.active2026 ? t.success : t.textDim }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: t.accent, fontFamily: "'Oswald', sans-serif", flexShrink: 0 }}>{p.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: t.textMuted, display: "flex", gap: 8, marginTop: 4 }}>
                  <span>{p.division}</span><span>•</span><span>{p.rating} NTRP</span><span>•</span><span>{p.wins}W-{p.losses}L</span>
                </div>
              </div>
              <div style={{ padding: "8px 16px", background: `${t.danger}12`, borderRadius: 4, border: `1px solid ${t.danger}25`, fontSize: 11, fontWeight: 700, color: t.danger, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Impersonate</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// ADMIN: SETTINGS PAGE
// ═══════════════════════════════════════
const AdminSettingsPage = () => {
  const [tab, setTab] = useState("players");
  const [players, setPlayers] = useState([...DEMO_PLAYERS]);
  const [teams, setTeams] = useState([...DEFAULT_TEAMS]);
  const [tournaments, setTournaments] = useState([...TOURNAMENTS]);
  const [editItem, setEditItem] = useState(null); // { type, index, data }
  const [editField, setEditField] = useState({});

  const tabs = [
    { id: "players", label: "Players", icon: "users" },
    { id: "teams", label: "Teams", icon: "team" },
    { id: "tournaments", label: "Tournaments", icon: "trophy" },
    { id: "matches", label: "Matches", icon: "sword" },
    { id: "brackets", label: "Brackets", icon: "star" },
  ];

  const openEdit = (type, index, data) => { setEditItem({ type, index }); setEditField({ ...data }); };
  const closeEdit = () => { setEditItem(null); setEditField({}); };

  const saveEdit = () => {
    if (!editItem) return;
    if (editItem.type === "player") {
      const u = [...players]; u[editItem.index] = { ...u[editItem.index], ...editField, rating: parseFloat(editField.rating) || u[editItem.index].rating, wins: parseInt(editField.wins) || 0, losses: parseInt(editField.losses) || 0 }; setPlayers(u);
    } else if (editItem.type === "team") {
      const u = [...teams]; u[editItem.index] = { ...u[editItem.index], ...editField }; setTeams(u);
    } else if (editItem.type === "tournament") {
      const u = [...tournaments]; u[editItem.index] = { ...u[editItem.index], ...editField, registered: parseInt(editField.registered) || 0, max: parseInt(editField.max) || 0 }; setTournaments(u);
    }
    closeEdit();
  };

  const deleteItem = (type, index) => {
    if (type === "player") { const u = [...players]; u.splice(index, 1); setPlayers(u); }
    else if (type === "team") { const u = [...teams]; u.splice(index, 1); setTeams(u); }
    else if (type === "tournament") { const u = [...tournaments]; u.splice(index, 1); setTournaments(u); }
  };

  const thS = { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `2px solid ${t.border}`, fontFamily: "'Barlow Condensed', sans-serif", whiteSpace: "nowrap" };
  const tdS = { padding: "10px 16px", borderBottom: `1px solid ${t.border}08`, fontSize: 13 };

  // Matches: flatten all tournament challenge-stage players
  const allMatches = tournaments.filter(tt => tt.stage === "live-challenges" && tt.players).flatMap(tt =>
    tt.players.map((p, i) => ({ tournamentName: tt.name, tournamentId: tt.id, ...p, _idx: i }))
  );

  // Brackets: flatten all bracket matches
  const allBrackets = tournaments.filter(tt => tt.bracket).flatMap(tt => {
    const out = [];
    if (tt.bracket.qf) tt.bracket.qf.forEach((m, i) => out.push({ ...m, round: "QF", tournamentName: tt.name, tId: tt.id, rKey: "qf", mIdx: i }));
    if (tt.bracket.sf) tt.bracket.sf.forEach((m, i) => out.push({ ...m, round: "SF", tournamentName: tt.name, tId: tt.id, rKey: "sf", mIdx: i }));
    if (tt.bracket.final) tt.bracket.final.forEach((m, i) => out.push({ ...m, round: "Final", tournamentName: tt.name, tId: tt.id, rKey: "final", mIdx: i }));
    return out;
  });

  const [editMatch, setEditMatch] = useState(null);
  const [editBracket, setEditBracket] = useState(null);

  const saveMatch = () => {
    if (!editMatch) return;
    const u = [...tournaments];
    const tIdx = u.findIndex(x => x.id === editMatch.tournamentId);
    if (tIdx >= 0 && u[tIdx].players) {
      u[tIdx].players[editMatch._idx] = { ...u[tIdx].players[editMatch._idx], wins: parseInt(editMatch.wins) || 0, losses: parseInt(editMatch.losses) || 0 };
      setTournaments(u);
    }
    setEditMatch(null);
  };

  const saveBracket = () => {
    if (!editBracket) return;
    const u = [...tournaments];
    const tIdx = u.findIndex(x => x.id === editBracket.tId);
    if (tIdx >= 0 && u[tIdx].bracket) {
      u[tIdx].bracket[editBracket.rKey][editBracket.mIdx] = { p1: editBracket.p1, p2: editBracket.p2, score: editBracket.score || null, winner: editBracket.winner || null };
      setTournaments(u);
    }
    setEditBracket(null);
  };

  return (
    <div style={{ padding: "108px 32px 60px", maxWidth: 1200, margin: "0 auto" }}>
      <SH title="Admin Settings" subtitle="Manage all league data — players, teams, tournaments, matches, and brackets." />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, flexWrap: "wrap" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 22px", borderRadius: 4, border: "none",
            background: tab === tb.id ? t.danger : "transparent",
            color: tab === tb.id ? "#fff" : t.textMuted,
            cursor: "pointer", fontSize: 12, fontWeight: 600,
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.15s",
          }}><Icon type={tb.icon} size={14} color={tab === tb.id ? "#fff" : t.textMuted} />{tb.label}</button>
        ))}
      </div>

      {/* ── PLAYERS TAB ── */}
      {tab === "players" && (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: t.surface }}>
              {["Name", "Division", "Rating", "W", "L", "Active", "Actions"].map(h => <th key={h} style={thS}>{h}</th>)}
            </tr></thead>
            <tbody>{players.map((p, i) => (
              <tr key={p.id} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={tdS}><span style={{ fontWeight: 600 }}>{p.name}</span></td>
                <td style={tdS}>{p.division}</td>
                <td style={tdS}><Badge>{p.rating}</Badge></td>
                <td style={{ ...tdS, color: t.success, fontWeight: 700 }}>{p.wins}</td>
                <td style={{ ...tdS, color: t.danger, fontWeight: 700 }}>{p.losses}</td>
                <td style={tdS}><div style={{ width: 8, height: 8, borderRadius: "50%", background: p.active2026 ? t.success : t.textDim, boxShadow: p.active2026 ? `0 0 6px ${t.success}60` : "none" }} /></td>
                <td style={tdS}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="ghost" size="sm" onClick={() => openEdit("player", i, { name: p.name, division: p.division, rating: String(p.rating), wins: String(p.wins), losses: String(p.losses), active2026: p.active2026 })}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteItem("player", i)} icon="x">Del</Button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* ── TEAMS TAB ── */}
      {tab === "teams" && (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: t.surface }}>
              {["Player 1", "Player 2", "Type", "Rating", "Status", "Actions"].map(h => <th key={h} style={thS}>{h}</th>)}
            </tr></thead>
            <tbody>{teams.map((tm, i) => (
              <tr key={tm.id} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...tdS, fontWeight: 600 }}>{tm.p1}</td>
                <td style={{ ...tdS, fontWeight: 600 }}>{tm.p2}</td>
                <td style={tdS}>{tm.type}</td>
                <td style={tdS}><Badge>{tm.rating}</Badge></td>
                <td style={tdS}><Badge color={t.success}>{tm.status}</Badge></td>
                <td style={tdS}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="ghost" size="sm" onClick={() => openEdit("team", i, { p1: tm.p1, p2: tm.p2, type: tm.type, rating: tm.rating, status: tm.status })}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteItem("team", i)} icon="x">Del</Button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* ── TOURNAMENTS TAB ── */}
      {tab === "tournaments" && (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: t.surface }}>
              {["Name", "Year", "Stage", "Rating", "Location", "Registered", "Actions"].map(h => <th key={h} style={thS}>{h}</th>)}
            </tr></thead>
            <tbody>{tournaments.map((tt, i) => (
              <tr key={tt.id} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...tdS, fontWeight: 600 }}>{tt.name}</td>
                <td style={tdS}>{tt.year}</td>
                <td style={tdS}><Badge color={sc(tt.stage)}>{sl(tt.stage)}</Badge></td>
                <td style={tdS}>{tt.rating}</td>
                <td style={tdS}>{tt.location}</td>
                <td style={tdS}>{tt.registered}/{tt.max}</td>
                <td style={tdS}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="ghost" size="sm" onClick={() => openEdit("tournament", i, { name: tt.name, year: String(tt.year), stage: tt.stage, rating: tt.rating, location: tt.location, startDate: tt.startDate, endDate: tt.endDate, desc: tt.desc, registered: String(tt.registered), max: String(tt.max), champion: tt.champion || "" })}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteItem("tournament", i)} icon="x">Del</Button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* ── MATCHES TAB (tournament challenge standings) ── */}
      {tab === "matches" && (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          {allMatches.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: t.textDim }}>No active challenge-stage tournaments.</div> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: t.surface }}>
                {["Tournament", "Player", "Rating", "W", "L", "Actions"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>{allMatches.map((m, i) => (
                <tr key={`${m.tournamentId}-${i}`} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={tdS}><Badge>{m.tournamentName}</Badge></td>
                  <td style={{ ...tdS, fontWeight: 600 }}>{m.name}</td>
                  <td style={tdS}>{m.rating}</td>
                  <td style={{ ...tdS, color: t.success, fontWeight: 700 }}>{m.wins}</td>
                  <td style={{ ...tdS, color: t.danger, fontWeight: 700 }}>{m.losses}</td>
                  <td style={tdS}><Button variant="ghost" size="sm" onClick={() => setEditMatch({ ...m })}>Edit</Button></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </Card>
      )}

      {/* ── BRACKETS TAB ── */}
      {tab === "brackets" && (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          {allBrackets.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: t.textDim }}>No bracket-stage tournaments.</div> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: t.surface }}>
                {["Tournament", "Round", "Player 1", "Player 2", "Score", "Winner", "Actions"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>{allBrackets.map((b, i) => (
                <tr key={`${b.tId}-${b.rKey}-${i}`} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={tdS}><Badge>{b.tournamentName}</Badge></td>
                  <td style={tdS}><Badge color={b.round === "Final" ? t.accent : t.info}>{b.round}</Badge></td>
                  <td style={{ ...tdS, fontWeight: b.winner === b.p1 ? 700 : 400, color: b.winner === b.p1 ? t.accent : t.text }}>{b.p1}</td>
                  <td style={{ ...tdS, fontWeight: b.winner === b.p2 ? 700 : 400, color: b.winner === b.p2 ? t.accent : t.text }}>{b.p2}</td>
                  <td style={tdS}>{b.score || <span style={{ color: t.warning }}>TBD</span>}</td>
                  <td style={tdS}>{b.winner ? <Badge color={t.accent}>{b.winner}</Badge> : <span style={{ color: t.warning }}>TBD</span>}</td>
                  <td style={tdS}><Button variant="ghost" size="sm" onClick={() => setEditBracket({ ...b })}>Edit</Button></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </Card>
      )}

      {/* ── EDIT OVERLAY (players / teams / tournaments) ── */}
      {editItem && (
        <Overlay onClose={closeEdit} title={`Edit ${editItem.type.charAt(0).toUpperCase() + editItem.type.slice(1)}`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {editItem.type === "player" && (<>
              <Input label="Name" value={editField.name || ""} onChange={v => setEditField({ ...editField, name: v })} />
              <Select label="Division" value={editField.division || ""} onChange={v => setEditField({ ...editField, division: v })} options={Object.keys(DIVISIONS)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Input label="Rating" value={editField.rating || ""} onChange={v => setEditField({ ...editField, rating: v })} />
                <Input label="Wins" value={editField.wins || ""} onChange={v => setEditField({ ...editField, wins: v })} />
                <Input label="Losses" value={editField.losses || ""} onChange={v => setEditField({ ...editField, losses: v })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}>Active 2026</span>
                <button onClick={() => setEditField({ ...editField, active2026: !editField.active2026 })} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: editField.active2026 ? t.success : t.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: editField.active2026 ? 23 : 3, transition: "left 0.2s" }} />
                </button>
              </div>
            </>)}
            {editItem.type === "team" && (<>
              <Input label="Player 1" value={editField.p1 || ""} onChange={v => setEditField({ ...editField, p1: v })} />
              <Input label="Player 2" value={editField.p2 || ""} onChange={v => setEditField({ ...editField, p2: v })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Select label="Type" value={editField.type || ""} onChange={v => setEditField({ ...editField, type: v })} options={["Open Doubles", "Women's Doubles", "Mixed Doubles"]} />
                <Input label="Rating" value={editField.rating || ""} onChange={v => setEditField({ ...editField, rating: v })} />
              </div>
              <Select label="Status" value={editField.status || ""} onChange={v => setEditField({ ...editField, status: v })} options={["active", "inactive"]} />
            </>)}
            {editItem.type === "tournament" && (<>
              <Input label="Name" value={editField.name || ""} onChange={v => setEditField({ ...editField, name: v })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Year" value={editField.year || ""} onChange={v => setEditField({ ...editField, year: v })} />
                <Select label="Stage" value={editField.stage || ""} onChange={v => setEditField({ ...editField, stage: v })} options={["registration", "live-challenges", "live-bracket", "completed"]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Rating" value={editField.rating || ""} onChange={v => setEditField({ ...editField, rating: v })} />
                <Input label="Location" value={editField.location || ""} onChange={v => setEditField({ ...editField, location: v })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Start Date" value={editField.startDate || ""} onChange={v => setEditField({ ...editField, startDate: v })} />
                <Input label="End Date" value={editField.endDate || ""} onChange={v => setEditField({ ...editField, endDate: v })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Registered" value={editField.registered || ""} onChange={v => setEditField({ ...editField, registered: v })} />
                <Input label="Max Players" value={editField.max || ""} onChange={v => setEditField({ ...editField, max: v })} />
              </div>
              <Input label="Champion" value={editField.champion || ""} onChange={v => setEditField({ ...editField, champion: v })} placeholder="Leave blank if not completed" />
              <Input label="Description" value={editField.desc || ""} onChange={v => setEditField({ ...editField, desc: v })} />
            </>)}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Button onClick={saveEdit} icon="check">Save Changes</Button>
              <Button variant="ghost" onClick={closeEdit}>Cancel</Button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── EDIT MATCH OVERLAY ── */}
      {editMatch && (
        <Overlay onClose={() => setEditMatch(null)} title={`Edit Match — ${editMatch.name}`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Player" value={editMatch.name} disabled onChange={() => {}} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Wins" value={String(editMatch.wins)} onChange={v => setEditMatch({ ...editMatch, wins: v })} />
              <Input label="Losses" value={String(editMatch.losses)} onChange={v => setEditMatch({ ...editMatch, losses: v })} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Button onClick={saveMatch} icon="check">Save</Button>
              <Button variant="ghost" onClick={() => setEditMatch(null)}>Cancel</Button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── EDIT BRACKET OVERLAY ── */}
      {editBracket && (
        <Overlay onClose={() => setEditBracket(null)} title={`Edit ${editBracket.round} Match`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Player 1" value={editBracket.p1} onChange={v => setEditBracket({ ...editBracket, p1: v })} />
              <Input label="Player 2" value={editBracket.p2} onChange={v => setEditBracket({ ...editBracket, p2: v })} />
            </div>
            <Input label="Score" value={editBracket.score || ""} onChange={v => setEditBracket({ ...editBracket, score: v })} placeholder="e.g. 6-3, 7-5" />
            <Select label="Winner" value={editBracket.winner || ""} onChange={v => setEditBracket({ ...editBracket, winner: v })}
              options={[{ value: "", label: "TBD" }, { value: editBracket.p1, label: editBracket.p1 }, { value: editBracket.p2, label: editBracket.p2 }]} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Button onClick={saveBracket} icon="check">Save</Button>
              <Button variant="ghost" onClick={() => setEditBracket(null)}>Cancel</Button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
const PublicHome = ({ sp }) => <><Hero sp={sp} /><SponsorsSection /><AboutSection /><DivisionsSection /><ChampionsSection /><Footer /></>;

export default function App() {
  const [page, setPage] = useState("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [impersonating, setImpersonating] = useState(null); // player name or null

  useEffect(() => { (async () => {
    const s = await loadData("gatl-session", null);
    if (s) {
      setLoggedIn(true); setUserName(s.name);
      if (s.admin) { setIsAdmin(true); setPage("admin-impersonate"); }
      else setPage("dashboard");
    }
  })(); }, []);

  const login = async (n) => { const d = n.includes("@") ? n.split("@")[0] : n; setLoggedIn(true); setUserName(d); setIsAdmin(false); setImpersonating(null); setPage("dashboard"); await saveData("gatl-session", { name: d }); };
  const adminLogin = async () => { setLoggedIn(true); setUserName("Admin"); setIsAdmin(true); setImpersonating(null); setPage("admin-impersonate"); await saveData("gatl-session", { name: "Admin", admin: true }); };
  const logout = async () => { setLoggedIn(false); setUserName(""); setIsAdmin(false); setImpersonating(null); setPage("home"); try { await storage.delete("gatl-session"); } catch {} };

  const startImpersonate = (name) => { setImpersonating(name); setPage("dashboard"); };
  const stopImpersonate = () => { setImpersonating(null); setPage("admin-impersonate"); };

  // The "active" username for player-facing pages
  const activeUser = impersonating || userName;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const r = () => { switch (page) {
    case "home": return <PublicHome sp={setPage} />;
    case "about": return <><AboutSection /><Footer /></>;
    case "divisions": return <><DivisionsSection /><Footer /></>;
    case "champions": return <><ChampionsSection /><Footer /></>;
    case "login": return <LoginPage onLogin={login} onAdminLogin={adminLogin} sp={setPage} />;
    case "register": return <RegisterPage onLogin={login} sp={setPage} />;
    case "dashboard": return <Dashboard userName={activeUser} />;
    case "tournaments": return <TournamentsPage />;
    case "community": return <CommunityPage userName={activeUser} />;
    case "admin-impersonate": return <AdminImpersonatePage onImpersonate={startImpersonate} />;
    case "admin-settings": return <AdminSettingsPage />;
    default: return <PublicHome sp={setPage} />;
  }};

  return <>
    <style>{globalCSS}</style>
    <Navbar page={page} setPage={setPage} loggedIn={loggedIn} onLogout={logout} userName={userName} isAdmin={isAdmin} impersonating={impersonating} onStopImpersonate={stopImpersonate} />
    <main style={{ minHeight: "100vh", paddingTop: impersonating ? 34 : 0 }}>{r()}</main>
  </>;
}
