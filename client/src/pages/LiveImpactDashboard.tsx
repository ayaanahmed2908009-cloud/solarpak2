import { useState, useEffect, useRef, useCallback } from "react";

const API = "https://solarpak-dashboard-production.up.railway.app/api";
const REFRESH_MS = 60_000;
const ATLAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZdtqwuX0WFHRLIDvZj-bYUiqsWWIYGhP_dd-wgGwrcT5BzXtDS6Zc9eC46M9_CIsK0eqKBPIdONAR/pub?gid=77479870&single=true&output=csv";

const C = {
  white:"#ffffff", pageBg:"#f7f8f7", sectionBg:"#f2f5f2",
  navy:"#1b2d25", green:"#2d6a4f", greenMid:"#3a7d56",
  greenLight:"#e8f2ec", greenDot:"#4caf7d",
  gold:"#c8973a", goldLight:"#fdf6e7",
  sky:"#0284c7", slate:"#475569",
  body:"#4a5c52", subtle:"#8fa898", border:"#e3ebe5",
  shadow:"0 2px 12px rgba(30,60,40,0.07)",
  shadowMd:"0 6px 28px rgba(30,60,40,0.11)",
  shadowLg:"0 16px 48px rgba(30,60,40,0.18)",
};

const DEFAULTS = {
  systemKw:0, energyKwh:0, maintUsd:0,
  lifeYears:25, tariff:0.12, selfPct:80, landM2:0,
  cleanings:0, waterPerClean:0, downtimeDays:0,
};

const PROJECT_TYPE_COLORS = { home:C.greenMid, school:C.sky, clinic:C.gold, hospital:"#9333ea" };
const PROJECT_TYPE_ICONS  = { home:"", school:"", clinic:"", hospital:"" };
const PROJECT_TYPE_LABELS = { home:"Residential", school:"School", clinic:"Clinic", hospital:"Hospital" };

function useCounter(target, duration=3500, start=false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start || target===0) return;
    let t0=null;
    const tick = ts => {
      if (!t0) t0=ts;
      const p = Math.min((ts-t0)/duration,1);
      setVal((1-Math.pow(1-p,3))*target);
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target,duration,start]);
  return val;
}

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setSeen(true); },{threshold:0.1});
    if (ref.current) io.observe(ref.current);
    return ()=>io.disconnect();
  }, []);
  return [ref, seen];
}

function fmt(n, fixed) {
  if (fixed!==undefined) return n.toLocaleString("en-US",{minimumFractionDigits:fixed,maximumFractionDigits:fixed});
  if (n>=1e6) return (n/1e6).toFixed(2)+"M";
  if (n>=1e4) return Math.round(n).toLocaleString("en-US");
  if (n>=100) return n.toFixed(1);
  if (n>=1)   return n.toFixed(2);
  return n.toFixed(4);
}

function fmtShort(n) {
  if (n>=1e6) return (n/1e6).toFixed(1)+"M";
  if (n>=1e3) return (n/1e3).toFixed(1)+"K";
  return n.toLocaleString("en-US",{maximumFractionDigits:1});
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Eyebrow({text,align="center"}) {
  return <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.16em",color:C.gold,textTransform:"uppercase",marginBottom:10,textAlign:align}}>{text}</p>;
}
function Card({children,style}) {
  return <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:28,boxShadow:C.shadow,...style}}>{children}</div>;
}
function Bolt({color=C.green,size=22}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function SPLogo({size=42}) {
  return <img src="/favicon.png" alt="SolarPak" style={{width:size,height:size,objectFit:"contain"}}/>;
}
function StatusPill({fetching,lastFetched}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:7,background:C.greenLight,borderRadius:4,padding:"5px 12px"}}>
      <span style={{width:7,height:7,borderRadius:"4px",background:C.greenDot,display:"inline-block",animation:fetching?"pulse 1s infinite":"none"}}/>
      <span style={{fontSize:11,color:C.green,fontWeight:600}}>{fetching?"Refreshing…":lastFetched?`Updated ${lastFetched}`:"Live"}</span>
    </div>
  );
}

function MetricMark({label=""}) {
  const kind = label.toLowerCase();
  const stroke = C.green;
  if (kind.includes("water")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M12 3C9 7 6.5 10.3 6.5 14a5.5 5.5 0 0 0 11 0c0-3.7-2.5-7-5.5-11Z"/><path d="M9.5 15.5c.5 1.2 1.3 1.8 2.5 2"/></svg>;
  if (kind.includes("carbon") || kind.includes("co2") || kind.includes("ghg")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15.5c0-3.2 2.4-5.5 5.4-5.5 1.1-2.1 4.3-2.4 5.6-.2 1.7.1 3 1.4 3 3.1 0 1.8-1.5 3.1-3.4 3.1H8.8A2.8 2.8 0 0 1 6 15.5Z"/><path d="M4 20c2-1 3.7-1 5.5 0 1.8 1 3.5 1 5.5 0 2-1 3.7-1 5.5 0"/></svg>;
  if (kind.includes("revenue") || kind.includes("savings") || kind.includes("margin")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M5 19V9M12 19V5M19 19v-7"/><path d="M3 19h18"/></svg>;
  if (kind.includes("system") || kind.includes("capacity") || kind.includes("energy") || kind.includes("solar")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 15 8-3 8 3-8 3-8-3Z"/><path d="M4 15v4l8 3 8-3v-4M8 13.5V7l8-3 4 1.5v7"/><path d="M12 7v8"/></svg>;
  if (kind.includes("people") || kind.includes("homes") || kind.includes("lives")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.4-3.2 2.2-5 5.5-5s5.1 1.8 5.5 5"/><circle cx="17" cy="9" r="2.2"/><path d="M15 14.5c2.8-.5 4.7 1 5.2 3.8"/></svg>;
  if (kind.includes("installation") || kind.includes("project")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10.5 12 5l7 5.5V19H5v-8.5Z"/><path d="M9 19v-5h6v5M3 10.5 12 3l9 7.5"/></svg>;
  if (kind.includes("tree") || kind.includes("land")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M8 20h8M12 4 8.5 9h2l-3 4h9l-3-4h2L12 4Z"/></svg>;
  if (kind.includes("performance") || kind.includes("availability") || kind.includes("uptime")) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.3 2.3 4.8-5"/></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 4C11 4 5 8 5 15c0 2.5 1.5 4 4 4 7 0 11-6 11-15Z"/><path d="M5 19c2.5-4 6-7 11-9"/></svg>;
}

function StatCard({icon,label,value,unit,pill,color=C.greenMid,sparkData,sparkColor,ready}) {
  const [ref,seen]=useInView();
  const anim=useCounter(typeof value==="number"?value:0,3500,seen&&!!ready);
  const display=typeof value==="number"?fmt(anim):value;
  return (
    <div ref={ref} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:"22px 22px 16px",boxShadow:C.shadow,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div style={{width:52,height:52,borderRadius:4,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon||<MetricMark label={label}/>}</div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:36,fontWeight:800,color:C.navy,lineHeight:1,letterSpacing:"-0.02em"}}>
            {display}{unit&&<span style={{fontSize:14,fontWeight:600,color,marginLeft:4}}>{unit}</span>}
          </div>
          <div style={{fontSize:13,color:C.body,marginTop:3}}>{label}</div>
        </div>
      </div>
      {sparkData&&sparkData.length>1&&<Sparkline data={sparkData} color={sparkColor||color} height={40}/>}
      {pill&&(
        <div style={{background:C.greenLight,borderRadius:4,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:7,height:7,borderRadius:"4px",background:C.greenDot,flexShrink:0,display:"inline-block"}}/>
          <span style={{fontSize:12,color:C.green,fontWeight:500}}>{pill}</span>
        </div>
      )}
    </div>
  );
}

function Bar({label,value,max,unit,color=C.greenMid}) {
  const [ref,seen]=useInView();
  const pct=Math.min((value/(max||1))*100,100);
  return (
    <div ref={ref} style={{marginBottom:18}}>
      {label&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
        <span style={{fontSize:13,color:C.body}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color:C.navy}}>{value.toLocaleString("en-US",{maximumFractionDigits:2})}{unit&&<span style={{fontSize:11,color,marginLeft:3}}>{unit}</span>}</span>
      </div>}
      <div style={{height:8,background:C.greenLight,borderRadius:49,overflow:"hidden"}}>
        <div style={{height:"100%",width:seen?`${pct}%`:"0%",background:`linear-gradient(90deg,${color},${color}cc)`,borderRadius:49,transition:"width 1.4s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}

function Sparkline({data=[],color=C.greenMid,height=44}) {
  if (data.length<2) return <div style={{height,display:"flex",alignItems:"center"}}><span style={{fontSize:10,color:C.subtle}}>No data yet</span></div>;
  const clean=data.map(v=>isNaN(v)?0:v);
  const min=Math.min(...clean),max=Math.max(...clean),range=max-min||1;
  const W=280,H=height;
  const pts=clean.map((v,i)=>`${(i/(clean.length-1))*W},${H-((v-min)/range)*(H-6)-3}`).join(" ");
  const uid=`sp${color.replace(/[^a-z0-9]/gi,"")}${height}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}} preserveAspectRatio="none">
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity=".25"/>
        <stop offset="100%" stopColor={color} stopOpacity=".02"/>
      </linearGradient></defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${uid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function LineChart({data=[],xKey="date",yKey,color=C.greenMid,unit="",height=200}) {
  const [hov,setHov]=useState(null);
  if (data.length<2) return (
    <div style={{height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <span style={{fontSize:36}} />
      <span style={{fontSize:13,color:C.subtle,textAlign:"center",lineHeight:1.7}}>Historical data will appear here as records accumulate.</span>
    </div>
  );
  const vals=data.map(d=>parseFloat(d[yKey])||0);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const W=600,H=height,pl=8,pr=8,pt=14,pb=40;
  const iw=W-pl-pr,ih=H-pt-pb;
  const xy=i=>({x:pl+(i/(vals.length-1))*iw,y:pt+(1-(vals[i]-min)/range)*ih});
  const pts=vals.map((_,i)=>{const p=xy(i);return `${p.x},${p.y}`;}).join(" ");
  const p0=xy(0),pN=xy(vals.length-1);
  const ticks=[...new Set([0,Math.floor(vals.length/3),Math.floor(2*vals.length/3),vals.length-1])];
  const uid=`lc_${yKey}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}} preserveAspectRatio="none" onMouseLeave={()=>setHov(null)}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity=".22"/>
        <stop offset="100%" stopColor={color} stopOpacity=".02"/>
      </linearGradient></defs>
      {[0,.25,.5,.75,1].map(p=><line key={p} x1={pl} x2={W-pr} y1={pt+p*ih} y2={pt+p*ih} stroke={C.border} strokeWidth="1"/>)}
      <polygon points={`${p0.x},${H-pb} ${pts} ${pN.x},${H-pb}`} fill={`url(#${uid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {vals.map((_,i)=>{const p=xy(i);return(<circle key={i} cx={p.x} cy={p.y} r={hov===i?5:3} fill={hov===i?color:"transparent"} stroke={hov===i?color:"transparent"} style={{cursor:"crosshair"}} onMouseEnter={()=>setHov(i)}/>);})}
      {hov!==null&&(()=>{const p=xy(hov);const lbl=`${String(data[hov][xKey])}: ${vals[hov].toLocaleString("en-US",{maximumFractionDigits:2})}${unit}`;const bx=Math.min(Math.max(p.x-58,2),W-120);return(<g><rect x={bx} y={p.y-28} width={116} height={20} rx={4} fill={C.navy}/><text x={bx+58} y={p.y-13} textAnchor="middle" fill="#fff" fontSize="9.5">{lbl}</text></g>);})()}
      {ticks.map(i=>{const p=xy(i);return(<text key={i} x={p.x} y={H-8} textAnchor="middle" fill={C.subtle} fontSize="9">{String(data[i][xKey])}</text>);})}
    </svg>
  );
}

function SavingsChart({netAnnual,years}) {
  const [hov,setHov]=useState(null);
  const cum=Array.from({length:years},(_,i)=>netAnnual*(i+1));
  const hi=Math.max(...cum,1);
  return (
    <div style={{position:"relative"}}>
      {hov!==null&&<div style={{position:"absolute",top:-34,left:"50%",transform:"translateX(-50%)",background:C.navy,color:"#fff",fontSize:11,padding:"4px 10px",borderRadius:4,whiteSpace:"nowrap",zIndex:10,pointerEvents:"none"}}>Year {hov+1}: ${cum[hov].toLocaleString("en-US",{maximumFractionDigits:0})}</div>}
      <div style={{display:"flex",gap:2,alignItems:"flex-end",height:80}}>
        {cum.map((v,i)=>{const h=Math.max((v/hi)*100,4);return <div key={i} style={{flex:1}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}><div style={{height:`${h}%`,minHeight:4,borderRadius:"4px",background:C.greenMid,opacity:hov!==null&&hov!==i?0.5:1,border:hov===i?`1.5px solid ${C.navy}`:"1.5px solid transparent",transition:"opacity .12s"}}/></div>;})}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        <span style={{fontSize:10,color:C.subtle}}>Year 1</span>
        <span style={{fontSize:10,color:C.subtle}}>Year {years}</span>
      </div>
    </div>
  );
}

function KPITile({label,value,sub,color=C.navy}) {
  return (
    <div style={{background:C.sectionBg,borderRadius:4,padding:"20px 18px",border:`1px solid ${C.border}`,textAlign:"center"}}>
      <div style={{fontSize:10,fontWeight:700,color:C.subtle,letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontSize:24,fontWeight:800,color,lineHeight:1,marginBottom:6}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.subtle,lineHeight:1.5}}>{sub}</div>}
    </div>
  );
}

// ─── AI FORECAST PANEL ────────────────────────────────────────────────────────
function AIForecastPanel({currentData,history,metrics}) {
  const [forecast,setForecast]=useState(null);
  const [loading,setLoading]=useState(false);
  const [lastRun,setLastRun]=useState(null);
  const [err,setErr]=useState(null);
  useEffect(()=>{
    fetch(`${API}/forecast`).then(r=>r.json()).then(j=>{
      if(j.ok&&j.data){setForecast(j.data);setLastRun(j.created_at?new Date(j.created_at).toLocaleString():null);}
    }).catch(()=>{});
  },[]);
  const run=useCallback(async()=>{
    setLoading(true);setErr(null);
    try{
      const r=await fetch(`${API}/forecast/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentData,metrics})});
      const j=await r.json();
      if(!j.ok)throw new Error(j.error);
      setForecast(j.data);setLastRun(new Date().toLocaleString());
    }catch(e){setErr("Unable to generate forecast. Please try again.");console.error(e);}
    setLoading(false);
  },[currentData,metrics]);
  const confColor={High:C.green,Medium:C.gold,Low:"#dc2626"};
  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:32}}>
        <div>
          <Eyebrow text="Forecast" align="left"/>
          <h2 style={{fontSize:28,fontWeight:800,color:C.navy,letterSpacing:"-0.02em",marginBottom:8}}>Performance Forecast</h2>
          <p style={{fontSize:13,color:C.body,lineHeight:1.7,maxWidth:520}}>Quantitative projections derived from live system data and Pakistan solar irradiance models. Applies 0.5%/yr panel degradation and 2.5%/yr tariff escalation.{lastRun&&<span style={{color:C.subtle}}> · Last updated: {lastRun}</span>}</p>
        </div>
        <button onClick={run} disabled={loading} style={{background:loading?C.sectionBg:C.navy,color:loading?C.subtle:"#fff",border:"none",borderRadius:4,padding:"13px 26px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9,transition:"all .2s",boxShadow:loading?"none":C.shadowMd,whiteSpace:"nowrap"}}>
          {loading?(<><span style={{width:14,height:14,border:`2px solid ${C.subtle}`,borderTopColor:"transparent",borderRadius:"4px",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>Forecasting…</>):forecast?"↻ Refresh Forecast":"Generate Forecast"}
        </button>
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:4,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#dc2626"}}>{err}</div>}
      {!forecast&&!loading&&!err&&(
        <Card style={{textAlign:"center",padding:"64px 32px"}}>
          <div style={{fontSize:52,marginBottom:18}} />
          <div style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:10}}>No forecast available yet</div>
          <div style={{fontSize:13,color:C.subtle,maxWidth:380,margin:"0 auto",lineHeight:1.75}}>Click <strong style={{color:C.navy}}>Generate Forecast</strong> to produce a quantitative 5-year projection.</div>
        </Card>
      )}
      {loading&&(
        <Card style={{textAlign:"center",padding:"64px 32px"}}>
          <div style={{fontSize:52,marginBottom:18,animation:"pulse 1.2s ease-in-out infinite"}} />
          <div style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:8}}>Running forecast model…</div>
          <div style={{fontSize:12,color:C.subtle}}>Applying degradation curves, tariff projections and irradiance data</div>
        </Card>
      )}
      {forecast&&!loading&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:C.navy,borderRadius:4,padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:26,flexShrink:0}} />
              <div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:4}}>Forecast Summary</div>
                <div style={{fontSize:15,color:"#e8f5ee",fontWeight:500,lineHeight:1.5}}>{forecast.trendSummary}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",borderRadius:4,padding:"8px 16px"}}>
              <span style={{width:8,height:8,borderRadius:"4px",background:confColor[forecast.confidenceLevel]||C.gold,display:"inline-block"}}/>
              <span style={{fontSize:12,color:"#e8f5ee",fontWeight:700}}>{forecast.confidenceLevel} Confidence</span>
            </div>
          </div>
          <Card>
            <div style={{fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:20}}>Projected Outputs by Horizon</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Period","Energy Output","CO₂ Avoided","Customer Savings","Capacity Factor"].map((h,hi)=>(<th key={h} style={{padding:"10px 16px",textAlign:hi===0?"left":"right",fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.07em",textTransform:"uppercase",borderBottom:`2px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
                <tbody>{(forecast.horizons||[]).map((h,i)=>(<tr key={i} style={{background:i%2===0?C.sectionBg:C.white}}>
                  <td style={{padding:"15px 16px",fontWeight:800,color:C.navy,fontSize:14}}>{h.period}</td>
                  <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.body}}>{(h.energyKwh||0).toLocaleString("en-US",{maximumFractionDigits:0})}<span style={{fontSize:10,color:C.subtle,marginLeft:4}}>kWh</span></td>
                  <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.green,fontWeight:600}}>{(h.co2MT||0).toFixed(2)}<span style={{fontSize:10,color:C.subtle,marginLeft:4}}>MTCO₂e</span></td>
                  <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.gold,fontWeight:700}}>${(h.savingsUsd||0).toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                  <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.body}}>{(h.capacityPct||0).toFixed(1)}<span style={{fontSize:10,color:C.subtle,marginLeft:3}}>%</span></td>
                </tr>))}</tbody>
              </table>
            </div>
          </Card>
          <div className="g4">
            <KPITile label="Energy CAGR" value={`${(forecast.cagr?.energy||0).toFixed(2)}%`} sub="Compound annual growth" color={C.greenMid}/>
            <KPITile label="Savings CAGR" value={`${(forecast.cagr?.savings||0).toFixed(2)}%`} sub="Incl. tariff escalation" color={C.gold}/>
            <KPITile label="Panel Degradation" value={`${(forecast.degradationPct||0).toFixed(2)}%/yr`} sub="Applied to output curve" color={C.slate}/>
            <KPITile label="Lifetime CO₂ Offset" value={`${(forecast.lifetimeCo2MT||0).toFixed(1)} MT`} sub={`Over ${currentData.lifeYears||25} years`} color={C.green}/>
          </div>
          <div style={{background:`linear-gradient(135deg,${C.navy} 0%,#2a4a38 100%)`,borderRadius:4,padding:"32px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:10}}>Projected Lifetime Savings</div>
              <div style={{fontSize:52,fontWeight:900,color:"#fff",letterSpacing:"-0.03em",lineHeight:1}}>${(forecast.lifetimeSavingsUsd||0).toLocaleString("en-US",{maximumFractionDigits:0})}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:10,lineHeight:1.6}}>Over {currentData.lifeYears||25}-year lifespan · 0.5%/yr degradation · 2.5%/yr tariff escalation</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14,minWidth:160}}>
              {[{l:"Peak Year Output",v:`${(forecast.peakYearEnergy||0).toLocaleString("en-US",{maximumFractionDigits:0})} kWh`},{l:"Lifetime CO₂ Saved",v:`${(forecast.lifetimeCo2MT||0).toFixed(1)} MTCO₂e`}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.08)",borderRadius:4,padding:"12px 18px"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginBottom:4,letterSpacing:"0.08em",textTransform:"uppercase"}}>{s.l}</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="g2">
            <Card>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.10em",textTransform:"uppercase",color:C.green,marginBottom:18}}>Key Forecast Drivers</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {(forecast.keyDrivers||[]).map((d,i)=>(<div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:24,height:24,borderRadius:4,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.green,flexShrink:0,marginTop:1}}>{i+1}</div><span style={{fontSize:13,color:C.body,lineHeight:1.6}}>{d}</span></div>))}
              </div>
            </Card>
            <Card>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.10em",textTransform:"uppercase",color:"#dc2626",marginBottom:18}}>Risk Factors</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {(forecast.riskFactors||[]).map((r,i)=>(<div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:24,height:24,borderRadius:4,background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,marginTop:1}}></div><span style={{fontSize:13,color:C.body,lineHeight:1.6}}>{r}</span></div>))}
              </div>
            </Card>
          </div>
          <p style={{fontSize:11,color:C.subtle,lineHeight:1.75}}>Forecast generated by Claude AI · Pakistan grid EF 0.50 kgCO₂e/kWh · 0.5%/yr panel degradation · 2.5%/yr tariff escalation · Projections only.</p>
        </div>
      )}
    </div>
  );
}

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────
function HistoryTab({history}) {
  const [metric,setMetric]=useState("energyKwh");
  const enriched=history.map(h=>({...h,
    ghg:((h.energyKwh||0)*0.50*1.20)/1000,
    custSave:((h.selfPct||80)/100)*(h.energyKwh||0)*(h.tariff||0.12),
    capFact:h.systemKw>0?((h.energyKwh||0)/(h.systemKw*8760))*100:0,
    avail:((365-(h.downtimeDays||0))/365)*100
  }));
  const METRICS=[
    {key:"energyKwh",label:"Energy Generated",unit:"kWh",color:C.greenMid},
    {key:"ghg",label:"CO₂ Avoided",unit:"MTCO₂e",color:"#16a34a"},
    {key:"custSave",label:"Customer Savings",unit:"USD",color:C.gold},
    {key:"capFact",label:"Capacity Factor",unit:"%",color:C.sky},
    {key:"avail",label:"Availability",unit:"%",color:C.greenMid},
    {key:"systemKw",label:"System Size",unit:"kW",color:C.slate},
  ];
  const sel=METRICS.find(m=>m.key===metric);
  return (
    <div className="fu">
      <div style={{marginBottom:32}}>
        <Eyebrow text="Historical Tracking"/>
        <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Data Over Time</h2>
        <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:520,margin:"0 auto"}}>Performance data tracked over time. Updates automatically.</p>
      </div>
      {history.length<2&&(
        <div style={{background:C.greenLight,border:`1px solid ${C.border}`,borderRadius:4,padding:"18px 22px",marginBottom:24,display:"flex",gap:14,alignItems:"center"}}>
          <span style={{fontSize:22,flexShrink:0}} />
          <div style={{fontSize:13,color:C.body,lineHeight:1.7}}>Historical data will appear here as records accumulate over time.</div>
        </div>
      )}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {METRICS.map(m=>(<button key={m.key} onClick={()=>setMetric(m.key)} style={{background:metric===m.key?m.color:C.white,color:metric===m.key?"#fff":C.body,border:`1px solid ${metric===m.key?m.color:C.border}`,borderRadius:4,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{m.label}</button>))}
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:15,fontWeight:700,color:C.navy}}>{sel?.label}</div>
          <div style={{fontSize:12,color:C.subtle}}>{enriched.length} data point{enriched.length!==1?"s":""}{enriched.length>0&&` · ${enriched[0].date} → ${enriched[enriched.length-1].date}`}</div>
        </div>
        <LineChart data={enriched} xKey="date" yKey={metric} color={sel?.color||C.greenMid} unit={sel?.unit||""} height={280}/>
      </Card>
      <div className="g3" style={{marginBottom:16}}>
        {METRICS.filter(m=>m.key!==metric).slice(0,3).map(m=>(
          <Card key={m.key} style={{cursor:"pointer",padding:18}} onClick={()=>setMetric(m.key)}>
            <div style={{fontSize:11,fontWeight:600,color:C.subtle,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>{m.label}</div>
            <Sparkline data={enriched.map(h=>h[m.key]||0)} color={m.color} height={48}/>
            {enriched.length>0&&<div style={{fontSize:20,fontWeight:800,color:C.navy,marginTop:8}}>{(enriched[enriched.length-1][m.key]||0).toFixed(2)}<span style={{fontSize:11,color:C.subtle,marginLeft:4}}>{m.unit}</span></div>}
          </Card>
        ))}
      </div>
      {enriched.length>1&&(
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:16}}>Recent Snapshots</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Date","Energy (kWh)","System (kW)","CO₂ (MTCO₂e)","Savings (USD)","Availability"].map((h,hi)=>(<th key={h} style={{padding:"9px 12px",textAlign:hi===0?"left":"right",fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`2px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
              <tbody>{enriched.slice(-12).reverse().map((r,i)=>(
                <tr key={i} style={{background:i%2===0?C.sectionBg:C.white}}>
                  <td style={{padding:"10px 12px",color:C.navy,fontWeight:700,fontSize:13}}>{r.date}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:C.body,fontSize:13}}>{(r.energyKwh||0).toLocaleString()}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:C.body,fontSize:13}}>{r.systemKw}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:C.green,fontWeight:600,fontSize:13}}>{r.ghg.toFixed(3)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:C.gold,fontWeight:600,fontSize:13}}>${r.custSave.toFixed(0)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:C.body,fontSize:13}}>{r.avail.toFixed(1)}%</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── ATLAS FUNCTIONS ──────────────────────────────────────────────────────────
function parseAtlasCSV(text) {
  const rows=[];let row=[],cell="",inQuotes=false;
  for(let i=0;i<text.length;i++){
    const char=text[i],next=text[i+1];
    if(char==='"'&&inQuotes&&next==='"'){cell+='"';i++;continue;}
    if(char==='"'){inQuotes=!inQuotes;continue;}
    if(char===','&&!inQuotes){row.push(cell);cell="";continue;}
    if((char==='\n'||char==='\r')&&!inQuotes){
      if(char==='\r'&&next==='\n')i++;
      row.push(cell);cell="";
      if(row.some(v=>v.trim()!==''))rows.push(row);
      row=[];continue;
    }
    cell+=char;
  }
  if(cell.length>0||row.length>0){row.push(cell);if(row.some(v=>v.trim()!==''))rows.push(row);}
  if(rows.length<2)return[];
  const hdrs=rows[0].map(h=>h.trim().replace(/^\uFEFF/,'').toLowerCase());
  return rows.slice(1).map(cols=>{
    const row={};
    hdrs.forEach((h,i)=>{row[h]=(cols[i]||'').trim();});
    const kw=parseFloat(row.capacitykw||0);
    const annualKwh=kw*5*365;
    row.annualCO2=parseFloat((annualKwh*0.50/1000).toFixed(2));
    row.treeEquiv=Math.round(row.annualCO2*45);
    row.capacityKW=kw;
    row.peopleServed=parseInt(row.peopleserved||0);
    row.latitude=parseFloat(row.latitude||0);
    row.longitude=parseFloat(row.longitude||0);
    row.photos=(row.photos||'').split('|').map(s=>s.trim()).filter(Boolean);
    row.projectType=(row.projecttype||'home').toLowerCase();
    row.id=row.id||String(Math.random());
    row.title=row.title||'';
    row.excerpt=row.excerpt||'';
    row.document=row.document||'';
    return row;
  }).filter(r=>r.latitude&&r.longitude);
}

function getMarkerSVG(type){
  const color=PROJECT_TYPE_COLORS[type]||C.greenMid;
  return `<div style="width:28px;height:36px;position:relative;cursor:pointer"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/><circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/></svg></div>`;
}

async function generateAISummary(inst){
  const prompt=`Write one warm, specific sentence (max 28 words) for a public impact dashboard about this SolarPak solar installation in Pakistan. Be human and inspiring, use the real numbers.\n\nProject: ${inst.name}\nLocation: ${inst.city||inst.province}, Pakistan\nType: ${PROJECT_TYPE_LABELS[inst.projectType]||inst.projectType}\nCapacity: ${inst.capacityKW} kW\nPeople served: ${inst.peopleServed}\nAnnual CO₂ avoided: ${inst.annualCO2} metric tons\n\nOutput only the sentence, nothing else.`;
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:80,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();
    return(d.content||[]).map(b=>b.text||"").join("").trim();
  }catch{
    return `This ${(PROJECT_TYPE_LABELS[inst.projectType]||"installation").toLowerCase()} in ${inst.province} serves ${inst.peopleServed} people with ${inst.capacityKW} kW of clean solar power.`;
  }
}

async function generateAtlasInsights(installations){
  const totalPeople=installations.reduce((s,i)=>s+i.peopleServed,0);
  const totalCO2=installations.reduce((s,i)=>s+i.annualCO2,0);
  const largest=[...installations].sort((a,b)=>b.capacityKW-a.capacityKW)[0];
  const byProv=installations.reduce((a,i)=>{a[i.province]=(a[i.province]||0)+i.peopleServed;return a;},{});
  const topProv=Object.entries(byProv).sort((a,b)=>b[1]-a[1])[0];
  const prompt=`Write 3 short punchy insight bullets (max 18 words each) about these SolarPak solar installations in Pakistan. Be specific with numbers. Output 3 lines, no markdown, no bullets.\n\nStats: ${installations.length} installations, ${totalPeople} people served, ${totalCO2.toFixed(1)} MT CO₂/yr avoided, largest: ${largest?.name} (${largest?.capacityKW}kW), top province: ${topProv?.[0]} (${topProv?.[1]} people)`;
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();
    return(d.content||[]).map(b=>b.text||"").join("").trim().split("\n").filter(Boolean).slice(0,3);
  }catch{
    return[`${installations.length} installations across Pakistan serving ${totalPeople.toLocaleString()} people.`];
  }
}

function ProjectCard({inst,onClose}){
  const [summary,setSummary]=useState(null);
  const [loadingSum,setLoadingSum]=useState(true);
  const [photoIdx,setPhotoIdx]=useState(0);
  const [documentOpen,setDocumentOpen]=useState(false);
  useEffect(()=>{setLoadingSum(true);generateAISummary(inst).then(s=>{setSummary(s);setLoadingSum(false);});},[inst.id]);
  useEffect(()=>{setPhotoIdx(0);setDocumentOpen(false);},[inst.id]);
  const typeColor=PROJECT_TYPE_COLORS[inst.projectType]||C.greenMid;
  const hasPhotos=inst.photos?.length>0;
  const hasDoc=Boolean(inst.document&&inst.document.trim());
  return(
    <div style={{background:C.white,borderRadius:4,overflow:"hidden",boxShadow:C.shadowLg,width:"100%"}}>
      {hasPhotos?(
        <div style={{height:160,position:"relative",background:"#000",overflow:"hidden"}}>
          <img src={inst.photos[photoIdx]} alt={inst.name} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.92}}/>
          {inst.photos.length>1&&<div style={{position:"absolute",bottom:8,right:8,display:"flex",gap:4}}>{inst.photos.map((_,i)=>(<button key={i} onClick={()=>setPhotoIdx(i)} style={{width:7,height:7,borderRadius:"4px",border:"none",cursor:"pointer",padding:0,background:i===photoIdx?"#fff":"rgba(255,255,255,0.4)"}}/>))}</div>}
        </div>
      ):(
        <div style={{height:80,background:`linear-gradient(135deg,${typeColor} 0%,${C.navy} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
          <span style={{fontSize:28}} />
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{PROJECT_TYPE_LABELS[inst.projectType]||inst.projectType}</div>
            <div style={{fontSize:13,color:"#fff",fontWeight:700}}>{inst.province}</div>
          </div>
        </div>
      )}
      <div style={{padding:"16px 18px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,paddingRight:8}}>
            <div style={{fontSize:14,fontWeight:800,color:C.navy,lineHeight:1.3,marginBottom:3}}>{inst.name}</div>
            <div style={{fontSize:11,color:C.subtle}}>{inst.city||inst.province} · {inst.installationdate||inst.installationDate}</div>
          </div>
          <button onClick={onClose} style={{background:C.sectionBg,border:"none",borderRadius:4,width:26,height:26,cursor:"pointer",color:C.subtle,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
        </div>
        <div style={{background:C.greenLight,borderRadius:4,padding:"10px 13px",marginBottom:12,border:`1px solid ${C.border}`}}>
          {loadingSum?(
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:11,height:11,border:`2px solid ${C.subtle}`,borderTopColor:"transparent",borderRadius:"4px",animation:"spin 0.7s linear infinite"}}/><span style={{fontSize:11,color:C.subtle}}>Preparing summary…</span></div>
          ):(
            <p style={{fontSize:12,color:C.green,lineHeight:1.6,margin:0,fontStyle:"italic"}}>"{summary}"</p>
          )}
        </div>
        {hasDoc&&(
          <div onClick={()=>setDocumentOpen(true)} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:"13px 14px",marginBottom:12,cursor:"pointer",boxShadow:C.shadow}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=C.shadowMd;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.shadow;}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:11}}>
              <div style={{width:36,height:36,borderRadius:4,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}></div>
              <div style={{minWidth:0,flex:1}}>
                <div style={{fontSize:9,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Research Document</div>
                <div style={{fontSize:13,fontWeight:800,color:C.navy,lineHeight:1.3,marginBottom:5}}>{inst.title||"Project Document"}</div>
                {inst.excerpt&&<div style={{fontSize:11,color:C.subtle,lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{inst.excerpt}</div>}
                <div style={{marginTop:8,fontSize:10,fontWeight:800,color:C.green}}>Read full document →</div>
              </div>
            </div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
          {[{icon:"",label:"System Size",value:`${inst.capacityKW} kW`},{icon:"",label:"People Served",value:fmtShort(inst.peopleServed)},{icon:"",label:"CO₂ Avoided",value:`${inst.annualCO2} t/yr`},{icon:"",label:"Tree Equiv.",value:`${fmtShort(inst.treeEquiv)} trees`}].map(s=>(
            <div key={s.label} style={{background:C.sectionBg,borderRadius:4,padding:"9px 11px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.subtle,marginBottom:2}}>{s.icon} {s.label}</div>
              <div style={{fontSize:13,fontWeight:800,color:C.navy}}>{s.value}</div>
            </div>
          ))}
        </div>
        <span style={{background:typeColor+"20",color:typeColor,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:4,border:`1px solid ${typeColor}40`}}>{PROJECT_TYPE_LABELS[inst.projectType]||inst.projectType}</span>
      </div>
      {documentOpen&&(
        <div onClick={()=>setDocumentOpen(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.68)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"min(950px,95vw)",height:"min(850px,92vh)",background:C.white,borderRadius:48,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 25px 90px rgba(0,0,0,.30)"}}>
            <div style={{padding:"16px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:15,flexShrink:0}}>
              <div>
                <div style={{fontSize:17,fontWeight:800,color:C.navy}}>{inst.title||"Project Document"}</div>
                <div style={{fontSize:10,color:C.subtle,marginTop:3}}>{inst.name}</div>
              </div>
              <button onClick={()=>setDocumentOpen(false)} style={{background:C.sectionBg,border:"none",borderRadius:4,width:35,height:35,cursor:"pointer",color:C.navy,fontSize:20,lineHeight:1,flexShrink:0}}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",background:"#f7f8f7",padding:"30px 20px"}}>
              <article style={{width:"min(720px,100%)",margin:"0 auto",background:C.white,border:`1px solid ${C.border}`,padding:"45px clamp(24px,6vw,65px)",boxShadow:C.shadow}}>
                <div style={{fontSize:10,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10}}>SolarPak Research</div>
                <h1 style={{fontSize:30,lineHeight:1.2,fontWeight:800,color:C.navy,marginBottom:12}}>{inst.title||"Project Document"}</h1>
                <div style={{height:3,width:48,background:C.green,borderRadius:4,marginBottom:30}}/>
                {inst.document.replace(/\r\n/g,"\n").split(/\n\s*\n/).map((para,i)=>{
                  const text=para.trim();if(!text)return null;
                  if(text.startsWith("### "))return<h3 key={i} style={{fontSize:17,color:C.navy,fontWeight:800,margin:"28px 0 10px"}}>{text.replace(/^### /,"")}</h3>;
                  if(text.startsWith("## "))return<h2 key={i} style={{fontSize:21,color:C.navy,fontWeight:800,margin:"32px 0 12px"}}>{text.replace(/^## /,"")}</h2>;
                  if(text.startsWith("# "))return<h1 key={i} style={{fontSize:27,color:C.navy,fontWeight:800,margin:"35px 0 14px"}}>{text.replace(/^# /,"")}</h1>;
                  const lines=text.split("\n");
                  if(lines.every(l=>l.trim().startsWith("- ")))return<ul key={i} style={{paddingLeft:24,margin:"12px 0 20px"}}>{lines.map((l,j)=><li key={j} style={{fontSize:14,lineHeight:1.8,color:C.body,marginBottom:6}}>{l.replace(/^-\s*/,"")}</li>)}</ul>;
                  return<p key={i} style={{fontSize:14,lineHeight:1.85,color:C.body,margin:"0 0 18px",whiteSpace:"pre-wrap"}}>{text}</p>;
                })}
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PoweredAtlas(){
  const mapRef=useRef(null);
  const mapInstanceRef=useRef(null);
  const markersRef=useRef({});
  const [leafletLoaded,setLeafletLoaded]=useState(false);
  const [installations,setInstallations]=useState([]);
  const [loadingData,setLoadingData]=useState(true);
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState("");
  const [filterProvince,setFilterProvince]=useState("All");
  const [filterType,setFilterType]=useState("all");
  const [insights,setInsights]=useState(null);
  const [loadingInsights,setLoadingInsights]=useState(false);

  useEffect(()=>{
    if(window.L){setLeafletLoaded(true);return;}
    const link=document.createElement("link");link.rel="stylesheet";link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(link);
    const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.onload=()=>setLeafletLoaded(true);document.body.appendChild(script);
  },[]);

  useEffect(()=>{
    setLoadingData(true);
    fetch(ATLAS_CSV).then(r=>r.text()).then(text=>{setInstallations(parseAtlasCSV(text));setLoadingData(false);}).catch(()=>setLoadingData(false));
  },[]);

  useEffect(()=>{
    if(!leafletLoaded||!mapRef.current||mapInstanceRef.current)return;
    const L=window.L;
    const PAK_BOUNDS=L.latLngBounds([[23.5,60.5],[37.0,77.0]]);
    const map=L.map(mapRef.current,{center:[27.0,68.0],zoom:6,minZoom:5,maxZoom:16,maxBounds:PAK_BOUNDS,maxBoundsViscosity:1.0});
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a>',maxZoom:18}).addTo(map);
    mapInstanceRef.current=map;
  },[leafletLoaded]);

  useEffect(()=>{
    if(!mapInstanceRef.current||!window.L||installations.length===0)return;
    const L=window.L;
    Object.values(markersRef.current).forEach(m=>m.remove());markersRef.current={};
    installations.forEach(inst=>{
      const icon=L.divIcon({html:getMarkerSVG(inst.projectType),iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36],className:""});
      const marker=L.marker([inst.latitude,inst.longitude],{icon,title:inst.name}).addTo(mapInstanceRef.current);
      marker.on("click",()=>{setSelected(inst);mapInstanceRef.current.flyTo([inst.latitude,inst.longitude],13,{duration:1.0});});
      markersRef.current[inst.id]=marker;
    });
  },[installations]);

  const filtered=installations.filter(i=>{
    const s=search.toLowerCase();
    return(!search||i.name?.toLowerCase().includes(s)||(i.city||"").toLowerCase().includes(s)||i.province?.toLowerCase().includes(s))&&(filterProvince==="All"||i.province===filterProvince)&&(filterType==="all"||i.projectType===filterType);
  });

  useEffect(()=>{
    if(!mapInstanceRef.current||!window.L)return;
    const filteredIds=new Set(filtered.map(i=>i.id));
    Object.entries(markersRef.current).forEach(([id,marker])=>{
      if(filteredIds.has(id)){if(!mapInstanceRef.current.hasLayer(marker))marker.addTo(mapInstanceRef.current);}
      else{if(mapInstanceRef.current.hasLayer(marker))marker.remove();}
    });
  },[filtered]);

  const provinces=["All",...new Set(installations.map(i=>i.province).filter(Boolean))];
  const totalPeople=installations.reduce((s,i)=>s+i.peopleServed,0);
  const totalKW=installations.reduce((s,i)=>s+i.capacityKW,0);
  const totalCO2=installations.reduce((s,i)=>s+i.annualCO2,0);
  const totalTrees=installations.reduce((s,i)=>s+i.treeEquiv,0);
  const handleInsights=useCallback(async()=>{if(!installations.length)return;setLoadingInsights(true);const result=await generateAtlasInsights(installations);setInsights(result);setLoadingInsights(false);},[installations]);
  const selectStyle={padding:"9px 13px",border:`1px solid ${C.border}`,borderRadius:4,fontSize:12,fontFamily:"inherit",color:C.body,background:C.white,cursor:"pointer",outline:"none"};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{textAlign:"center"}}>
        <Eyebrow text="Powered"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}><MetricMark label="installation"/><h2 style={{fontSize:28,fontWeight:800,color:C.navy,margin:0,letterSpacing:"-0.02em"}}>Powered Atlas</h2></div>
        <p style={{fontSize:14,color:C.body,maxWidth:520,margin:"0 auto",lineHeight:1.7}}>Powered is a short new series capturing the lives changed by recent solar installations.</p>
      </div>
      {loadingData?(
        <div style={{textAlign:"center",padding:24,color:C.subtle,fontSize:13}}>Loading installations…</div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
          {[{label:"Total Installations",value:installations.length,unit:""},{label:"People Impacted",value:totalPeople,unit:""},{label:"Total Capacity",value:totalKW,unit:"kW"},{label:"CO₂ Avoided/yr",value:totalCO2,unit:"t"},{label:"Tree Equivalent",value:totalTrees,unit:""}].map(s=>(
            <div key={s.label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:"16px 18px",boxShadow:C.shadow,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:4,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}><MetricMark label={s.label}/></div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:C.navy,lineHeight:1,letterSpacing:"-0.02em"}}>{fmtShort(s.value)}{s.unit&&<span style={{fontSize:12,color:C.greenMid,marginLeft:3}}>{s.unit}</span>}</div>
                <div style={{fontSize:11,color:C.subtle,marginTop:2}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:"14px 18px",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,minWidth:180}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:C.subtle,pointerEvents:"none"}}></span>
          <input type="text" placeholder="Search installations, cities…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"9px 13px 9px 34px",border:`1px solid ${C.border}`,borderRadius:4,fontSize:12,fontFamily:"inherit",color:C.navy,background:C.white,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <select value={filterProvince} onChange={e=>setFilterProvince(e.target.value)} style={selectStyle}>{provinces.map(p=><option key={p}>{p}</option>)}</select>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={selectStyle}>
          <option value="all">All Types</option>
          {Object.entries(PROJECT_TYPE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
        <span style={{fontSize:12,color:C.subtle,whiteSpace:"nowrap"}}>{filtered.length} of {installations.length} shown</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
        <div style={{position:"relative"}}>
          <div ref={mapRef} style={{height:520,borderRadius:4,border:`1px solid ${C.border}`,boxShadow:C.shadow,background:C.sectionBg,overflow:"hidden"}}>
            {!leafletLoaded&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,zIndex:10}}><div style={{width:28,height:28,border:`3px solid ${C.border}`,borderTopColor:C.green,borderRadius:"4px",animation:"spin 0.8s linear infinite"}}/><span style={{fontSize:13,color:C.subtle}}>Loading map…</span></div>}
          </div>
          <div style={{position:"absolute",bottom:14,left:14,zIndex:1000,background:"rgba(255,255,255,0.96)",borderRadius:4,padding:"9px 13px",border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px"}}>
              {Object.entries(PROJECT_TYPE_LABELS).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:9,height:9,borderRadius:"4px",background:PROJECT_TYPE_COLORS[k]}}/><span style={{fontSize:11,color:C.body}}>{v}</span></div>))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {selected&&<ProjectCard inst={selected} onClose={()=>setSelected(null)}/>}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:14,boxShadow:C.shadow}}>
            <div style={{fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Installations</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:selected?200:420,overflowY:"auto"}}>
              {filtered.length===0&&<div style={{textAlign:"center",padding:20,color:C.subtle,fontSize:12}}>No installations match filters.</div>}
              {filtered.map(inst=>{
                const color=PROJECT_TYPE_COLORS[inst.projectType]||C.greenMid;
                const isSel=selected?.id===inst.id;
                return(
                  <button key={inst.id} onClick={()=>{setSelected(inst);mapInstanceRef.current?.flyTo([inst.latitude,inst.longitude],13,{duration:1.0});}} style={{background:isSel?C.greenLight:C.white,border:`1px solid ${isSel?C.green:C.border}`,borderRadius:4,padding:"10px 12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:28,height:28,borderRadius:4,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}><MetricMark label={inst.projectType||"Installation"}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:700,color:C.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{inst.name}</div>
                        <div style={{fontSize:10,color:C.subtle}}>{inst.city||inst.province} · {inst.capacityKW}kW</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={{background:C.white,border:`.1px solid ${C.border}`,borderRadius:4,padding:.01,boxShadow:C.shadow}}>
      </div>
      <p style={{fontSize:11,color:C.subtle,textAlign:"center",lineHeight:1.7}}>SolarPak installation network</p>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section,setSection]=useState("dashboard");
  const [inp,setInp]=useState(DEFAULTS);
  const [fetching,setFetching]=useState(true);
  const [lastFetched,setLastFetched]=useState(null);
  const [dataReady,setDataReady]=useState(false);
  const [tab,setTab]=useState("env");
  const [history,setHistory]=useState([]);

  async function fetchAll() {
    setFetching(true);
    try {
      const [liveJ,histJ]=await Promise.all([
        fetch(`${API}/live`).then(r=>r.json()),
        fetch(`${API}/history`).then(r=>r.json()),
      ]);
      if(liveJ.ok&&liveJ.data&&Object.keys(liveJ.data).length>0){
        setInp(prev=>({...prev,...liveJ.data}));
        setLastFetched(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
        setDataReady(true);
      }
      if(histJ.ok)setHistory(histJ.data||[]);
    } catch(e){console.warn("Fetch error:",e);}
    setFetching(false);
  }

  useEffect(()=>{fetchAll();const id=setInterval(fetchAll,REFRESH_MS);return()=>clearInterval(id);},[]);

  const selfPctNum=typeof inp.selfPct==="string"?parseFloat(inp.selfPct.replace("%","")):inp.selfPct||0;
  const E=inp.energyKwh||0;
  const ghg=(E*0.50*1.20)/1000;
  const wClean=(inp.cleanings||0)*(inp.waterPerClean||0);
  const water=Math.max((E*2.5)/1000-wClean,0);
  const nox=E*0.0012,so2=E*0.003,pm25=E*0.0005;
  const landHa=(inp.landM2||0)/10000;
  const landEff=landHa>0?(E/1000)/landHa:0;
  const capFact=inp.systemKw>0?(E/(inp.systemKw*8760))*100:0;
  const perfR=inp.systemKw*5*365>0?(E/(inp.systemKw*5*365))*100:0;
  const avail=((365-(inp.downtimeDays||0))/365)*100;
  const revenue=E*(inp.tariff||0);
  const custSave=(selfPctNum/100)*E*(inp.tariff||0);
  const netAnn=custSave-(inp.maintUsd||0);
  const gMargin=revenue>0?(netAnn/revenue)*100:0;
  const lifetime=netAnn*(inp.lifeYears||25);
  const metrics={ghg,water,nox,so2,pm25,landEff,capFact,perfR,avail,revenue,custSave,netAnn,gMargin,lifetime};
  const spk=key=>history.map(h=>parseFloat(h[key])||0);
  const spkGhg=history.map(h=>((h.energyKwh||0)*0.50*1.20)/1000);

  const TABS=[
    {id:"env",label:"Environmental"},
    {id:"perf",label:"Performance"},
    {id:"eco",label:"Economics"},
    {id:"history",label:"History"},
  ];

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.pageBg};font-family:'DM Sans','Avenir Next','Helvetica Neue',Arial,sans-serif;color:${C.body};-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .fu{animation:fadeUp .4s ease both}
        .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .g2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        @media(max-width:1000px){.g4{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:560px){.g4,.g3,.g2{grid-template-columns:1fr}}
        table{font-size:13px}
        .leaflet-container{border-radius:16px}
      `}</style>
      <div style={{minHeight:"100vh",background:C.pageBg}}>
        <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1120,margin:"0 auto",padding:"0 32px",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
              <SPLogo size={44}/>
              <span style={{fontSize:20,fontWeight:800,color:C.navy,letterSpacing:"-0.02em"}}>SolarPak</span>
            </div>
            <div style={{display:"flex",background:C.sectionBg,border:"1px solid "+C.border,borderRadius:4,padding:3,gap:4}}>
              {[{id:"dashboard",label:"Dashboard",color:"#c46b16",activeBg:"#f4a261"},{id:"atlas",label:"Powered Atlas",color:"#1f5f45",activeBg:"#76b893"}].map(s=>(
                <button key={s.id} onClick={()=>setSection(s.id)} style={{background:section===s.id?s.activeBg:"transparent",color:section===s.id?"#17231d":s.color,border:"none",borderRadius:3,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",boxShadow:section===s.id?"0 1px 3px rgba(27,45,37,.16)":"none",whiteSpace:"nowrap"}}>{s.label}</button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <a href="https://solarpak.org" target="_blank" rel="noopener noreferrer" style={{color:C.green,fontSize:13,fontWeight:700,textDecoration:"none"}}>Home</a>
              <StatusPill fetching={fetching} lastFetched={lastFetched}/>
            </div>
          </div>
        </nav>

        <div style={{maxWidth:1120,margin:"0 auto",padding:"56px 32px 96px"}}>
          {section==="atlas"&&<div className="fu"><PoweredAtlas/></div>}

          {section==="dashboard"&&(
            <>
              {/* HERO */}
              <div className="fu" style={{textAlign:"center",marginBottom:52}}>
                <Eyebrow text="SolarPak Impact Labs"/>
                <h1 style={{fontSize:"clamp(30px,5vw,56px)",fontWeight:900,color:C.navy,lineHeight:1.08,letterSpacing:"-0.03em",marginBottom:20}}>Impact by Each Installation</h1>
                <p style={{fontSize:17,color:C.body,maxWidth:520,margin:"0 auto 44px",lineHeight:1.75}}>A measured view of the change created by each installation — a way to track what your donations are doing.</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,textAlign:"left"}}>
                  <StatCard icon={<Bolt/>} label="Energy Generated / Year" value={E} unit="kWh" pill={`${inp.systemKw} kW system`} sparkData={spk("energyKwh")} sparkColor={C.greenMid} ready={dataReady}/>
                  <StatCard icon={null} label="CO₂ Avoided" value={ghg} unit="MTCO₂e" pill="EF 0.50 kgCO₂e/kWh · 20% loss" sparkData={spkGhg} sparkColor="#16a34a" ready={dataReady}/>
                  <StatCard icon={null} label="Water Conserved" value={water} unit="m³" pill={`Net of ${wClean.toFixed(2)} m³ panel cleaning`} ready={dataReady}/>
                </div>
              </div>

              {/* TABS */}
              <div className="fu" style={{animationDelay:".08s",marginBottom:28}}>
                <div style={{display:"flex",gap:4,borderBottom:`2px solid ${C.border}`,overflowX:"auto"}}>
                  {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"12px 20px",fontSize:13,fontFamily:"inherit",fontWeight:600,color:tab===t.id?C.green:C.subtle,borderBottom:`2px solid ${tab===t.id?C.green:"transparent"}`,marginBottom:-2,transition:"color .15s",whiteSpace:"nowrap"}}>{t.label}</button>))}
                </div>
              </div>

              {/* ENVIRONMENTAL */}
              {tab==="env"&&(
                <div className="fu">
                  <div style={{marginBottom:32}}>
                    <Eyebrow text="Environmental impact"/>
                    <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Emissions &amp; Resource Impact</h2>
                    <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>Carbon displacement and resource conservation calibrated to Pakistan's grid.</p>
                  </div>
                  <div className="g4" style={{marginBottom:20}}>
                    <StatCard icon={null} label="GHG Avoided" value={ghg} unit="MTCO₂e" pill="EF 0.50 kgCO₂e/kWh · 20% loss" sparkData={spkGhg} ready={dataReady}/>
                    <StatCard icon={null} label="Energy Generated" value={E} unit="kWh" pill={`${inp.systemKw} kW system`} sparkData={spk("energyKwh")} ready={dataReady}/>
                    <StatCard icon={null} label="Water Conserved" value={water} unit="m³" pill={`Net of ${wClean.toFixed(2)} m³ cleaning`} ready={dataReady}/>
                    <StatCard icon={null} label="Grid Carbon Factor" value={0.50} unit="kg/kWh" pill="Pakistan average displaced" ready={dataReady}/>
                  </div>
                  <Card>
                    <Eyebrow text="Air Quality"/>
                    <h3 style={{fontSize:20,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:6}}>Pollutants Averted</h3>
                    <p style={{fontSize:13,color:C.body,textAlign:"center",marginBottom:28,lineHeight:1.6}}>SE Asian weighted-average emission factors applied to annual generation.</p>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:28}}>
                      {[{label:"NOₓ Averted",val:nox,color:"#d97706",factor:"0.0012 kg/kWh"},{label:"SO₂ Averted",val:so2,color:"#dc2626",factor:"0.003 kg/kWh"},{label:"PM2.5 Averted",val:pm25,color:"#7c3aed",factor:"0.0005 kg/kWh"}].map(p=>(
                        <div key={p.label}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                            <span style={{fontSize:14,fontWeight:700,color:C.navy}}>{p.label}</span>
                            <span style={{fontSize:15,fontWeight:800,color:p.color}}>{p.val.toFixed(1)} kg</span>
                          </div>
                          <Bar value={p.val} max={p.val*1.3} unit="kg" color={p.color}/>
                          <div style={{fontSize:11,color:C.subtle,marginTop:-8}}>Factor: {p.factor} (SE Asia avg)</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* PERFORMANCE */}
              {tab==="perf"&&(
                <div className="fu">
                  <div style={{marginBottom:32}}>
                    <Eyebrow text="System performance"/>
                    <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Efficiency Metrics</h2>
                    <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>Technical KPIs benchmarked against South Asian regional standards.</p>
                  </div>
                  <div className="g3" style={{marginBottom:20}}>
                    <StatCard icon={null} label="Land Efficiency" value={landEff} unit="MWh/ha" pill={`${inp.landM2} m² total land area`} ready={dataReady}/>
                    <StatCard icon={null} label="Capacity Factor" value={capFact} unit="%" pill="Actual vs. theoretical max" sparkData={history.map(h=>h.systemKw>0?((h.energyKwh||0)/(h.systemKw*8760))*100:0)} sparkColor={C.sky} ready={dataReady}/>
                    <StatCard icon={null} label="Performance Ratio" value={perfR} unit="%" pill="5 sun-hrs/day baseline" ready={dataReady}/>
                  </div>
                  <Card>
                    <h3 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:20}}>Performance Benchmarks</h3>
                    <Bar label="Capacity Factor" value={parseFloat(capFact.toFixed(1))} max={100} unit="%"/>
                    <Bar label="Performance Ratio" value={parseFloat(perfR.toFixed(1))} max={100} unit="%" color="#0284c7"/>
                    <Bar label="System Availability" value={parseFloat(avail.toFixed(1))} max={100} unit="%" color={C.green}/>
                    <div style={{marginTop:22,paddingTop:22,borderTop:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:12}}>
                      {[{l:"Typical Capacity Factor",v:"15–25%",n:"Solar in Pakistan"},{l:"Good Performance Ratio",v:"≥ 75%",n:"Industry standard"},{l:"Target Availability",v:"> 95%",n:"Well-maintained"}].map(b=>(
                        <div key={b.l} style={{background:C.sectionBg,borderRadius:4,padding:"14px 16px",border:`1px solid ${C.border}`}}>
                          <div style={{fontSize:11,color:C.subtle,marginBottom:5}}>{b.l}</div>
                          <div style={{fontSize:20,fontWeight:800,color:C.green}}>{b.v}</div>
                          <div style={{fontSize:11,color:C.subtle,marginTop:2}}>{b.n}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ECONOMICS */}
              {tab==="eco"&&(
                <div className="fu">
                  <div style={{marginBottom:32}}>
                    <Eyebrow text="Financial impact"/>
                    <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Economic Analysis</h2>
                    <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>Savings and financial performance over the full system lifespan.</p>
                  </div>
                  <div className="g3" style={{marginBottom:20}}>
                    <StatCard icon={null} label="Annual Revenue" value={revenue} unit="USD" pill={`@ $${inp.tariff}/kWh tariff`} sparkData={history.map(h=>(h.energyKwh||0)*(h.tariff||0.12))} sparkColor={C.gold} ready={dataReady}/>
                    <StatCard icon={null} label="Customer Savings" value={custSave} unit="USD/yr" pill={`${selfPctNum}% self-consumption`} sparkData={history.map(h=>((h.selfPct||80)/100)*(h.energyKwh||0)*(h.tariff||0.12))} sparkColor={C.gold} ready={dataReady}/>
                    <StatCard icon={null} label="Gross Margin" value={gMargin} unit="%" pill="Revenue minus op. cost" ready={dataReady}/>
                  </div>
                  <Card style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:24}}>
                      <div>
                        <h3 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:4}}>{inp.lifeYears}-Year Cumulative Savings</h3>
                        <p style={{fontSize:12,color:C.subtle}}>Hover each bar to see the cumulative figure</p>
                      </div>
                      <div style={{background:C.greenLight,border:`1px solid ${C.border}`,borderRadius:4,padding:"10px 18px",textAlign:"center"}}>
                        <div style={{fontSize:11,color:C.subtle,marginBottom:3}}>Total lifetime savings</div>
                        <div style={{fontSize:22,fontWeight:800,color:C.green}}>${lifetime.toLocaleString("en-US",{maximumFractionDigits:0})}</div>
                      </div>
                    </div>
                    <SavingsChart netAnnual={netAnn} years={inp.lifeYears||25}/>
                  </Card>
                  <Card>
                    <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>System Availability</h3>
                    <Bar label={`${avail.toFixed(1)}% uptime — ${inp.downtimeDays} downtime days / year`} value={parseFloat(avail.toFixed(1))} max={100} unit="%"/>
                  </Card>
                </div>
              )}

              {tab==="history"&&<HistoryTab history={history}/>}

              {/* SUMMARY BANNER */}
              <div className="fu" style={{marginTop:52}}>
                <div style={{background:C.green,borderRadius:4,padding:"42px 40px"}}>
                  <Eyebrow text="Your Total Impact"/>
                  <h2 style={{fontSize:26,fontWeight:800,color:C.white,textAlign:"center",marginBottom:32,marginTop:4}}>Impact by Each Installation</h2>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:20}}>
                    {[
                      {icon:"",v:`${fmt(ghg,2)} MTCO₂e`,l:"CO₂ Avoided"},
                      {icon:"",v:`${fmt(E*(inp.lifeYears||25)/1000)} MWh`,l:"Lifetime Energy"},
                      {icon:"",v:`$${lifetime.toLocaleString("en-US",{maximumFractionDigits:0})}`,l:`${inp.lifeYears||25}yr Savings`},
                      {icon:"",v:`${fmt(water,1)} m³`,l:"Water Conserved"},
                      {v:`${avail.toFixed(1)}%`,l:"System Uptime"},
                    ].map(s=>(
                      <div key={s.l} style={{textAlign:"center",background:"rgba(255,255,255,0.1)",borderRadius:4,padding:"18px 12px"}}>
                        <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
                        <div style={{fontSize:18,fontWeight:800,color:C.white,marginBottom:4}}>{s.v}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",letterSpacing:"0.1em"}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{marginTop:28,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"flex-start"}} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

