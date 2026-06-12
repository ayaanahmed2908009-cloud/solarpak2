import { useState, useEffect, useRef, useCallback } from "react";

const API = "https://solarpak-dashboard-production.up.railway.app/api";
const REFRESH_MS = 60_000;

const C = {
  white:"#ffffff", pageBg:"#f7f8f7", sectionBg:"#f2f5f2",
  navy:"#1b2d25", green:"#2d6a4f", greenMid:"#3a7d56",
  greenLight:"#e8f2ec", greenDot:"#4caf7d",
  gold:"#c8973a", goldLight:"#fdf6e7",
  sky:"#0284c7", slate:"#475569",
  body:"#4a5c52", subtle:"#8fa898", border:"#e3ebe5",
  shadow:"0 2px 12px rgba(30,60,40,0.07)",
  shadowMd:"0 6px 28px rgba(30,60,40,0.11)",
};

const DEFAULTS = {
  systemKw:10, energyKwh:18250, installUsd:8000, maintUsd:200,
  lifeYears:25, tariff:0.12, selfPct:80, landM2:60,
  cleanings:12, waterPerClean:0.05, downtimeDays:5,
};

function useCounter(target: number, duration=1400, start=false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start || target===0) return;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (!t0) t0=ts;
      const p = Math.min((ts-t0)/duration,1);
      setVal((1-Math.pow(1-p,3))*target);
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target,duration,start]);
  return val;
}

function useInView(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setSeen(true); },{threshold:0.1});
    if (ref.current) io.observe(ref.current);
    return ()=>io.disconnect();
  }, []);
  return [ref, seen];
}

function fmt(n: number, fixed?: number): string {
  if (fixed!==undefined) return n.toLocaleString("en-US",{minimumFractionDigits:fixed,maximumFractionDigits:fixed});
  if (n>=1e6) return (n/1e6).toFixed(2)+"M";
  if (n>=1e4) return Math.round(n).toLocaleString("en-US");
  if (n>=100) return n.toFixed(1);
  if (n>=1)   return n.toFixed(2);
  return n.toFixed(4);
}

function Sparkline({ data=[], color=C.greenMid, height=44 }: { data?: number[]; color?: string; height?: number }) {
  if (data.length<2) return <div style={{height,display:"flex",alignItems:"center"}}><span style={{fontSize:10,color:C.subtle}}>No data yet</span></div>;
  const clean=data.map(v=>isNaN(v)?0:v);
  const min=Math.min(...clean), max=Math.max(...clean), range=max-min||1;
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

function LineChart({ data=[], xKey="date", yKey, color=C.greenMid, unit="", height=200 }: { data?: any[]; xKey?: string; yKey: string; color?: string; unit?: string; height?: number }) {
  const [hov, setHov] = useState<number | null>(null);
  if (data.length<2) return (
    <div style={{height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <span style={{fontSize:36}}>📈</span>
      <span style={{fontSize:13,color:C.subtle,textAlign:"center",lineHeight:1.7}}>
        Historical data will appear here as records accumulate over time.
      </span>
    </div>
  );
  const vals=data.map(d=>parseFloat(d[yKey])||0);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const W=600,H=height,pl=8,pr=8,pt=14,pb=30;
  const iw=W-pl-pr, ih=H-pt-pb;
  const xy=(i: number)=>({x:pl+(i/(vals.length-1))*iw, y:pt+(1-(vals[i]-min)/range)*ih});
  const pts=vals.map((_,i)=>{const p=xy(i);return `${p.x},${p.y}`;}).join(" ");
  const p0=xy(0), pN=xy(vals.length-1);
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
      {vals.map((_,i)=>{const p=xy(i);return(
        <circle key={i} cx={p.x} cy={p.y} r={hov===i?5:3}
          fill={hov===i?color:"transparent"} stroke={hov===i?color:"transparent"}
          style={{cursor:"crosshair"}} onMouseEnter={()=>setHov(i)}/>
      );})}
      {hov!==null&&(()=>{
        const p=xy(hov);
        const lbl=`${String(data[hov][xKey]).slice(5)}: ${vals[hov].toLocaleString("en-US",{maximumFractionDigits:2})}${unit}`;
        const bx=Math.min(Math.max(p.x-58,2),W-120);
        return(<g><rect x={bx} y={p.y-28} width={116} height={20} rx={4} fill={C.navy}/>
          <text x={bx+58} y={p.y-13} textAnchor="middle" fill="#fff" fontSize="9.5">{lbl}</text></g>);
      })()}
      {ticks.map(i=>{const p=xy(i);return(
        <text key={i} x={p.x} y={H-8} textAnchor="middle" fill={C.subtle} fontSize="9">{String(data[i][xKey]).slice(5)}</text>
      );})}
    </svg>
  );
}

function Eyebrow({text, align="center"}: {text: string; align?: string}) {
  return <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.16em",color:C.gold,textTransform:"uppercase",marginBottom:10,textAlign:align as any}}>{text}</p>;
}
function Card({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) {
  return <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:28,boxShadow:C.shadow,...style}}>{children}</div>;
}
function Bolt({color=C.green, size=22}: {color?: string; size?: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function SPLogo({size=42}: {size?: number}) {
  return <img src="/favicon.png" alt="SolarPak" style={{width:size,height:size,objectFit:"contain"}}/>;
}
function StatusPill({fetching, lastFetched}: {fetching: boolean; lastFetched: string | null}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:7,background:C.greenLight,borderRadius:20,padding:"5px 12px"}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:C.greenDot,display:"inline-block",animation:fetching?"pulse 1s infinite":"none"}}/>
      <span style={{fontSize:11,color:C.green,fontWeight:600}}>{fetching?"Refreshing…":lastFetched?`Updated ${lastFetched}`:"Live"}</span>
    </div>
  );
}

function StatCard({icon, label, value, unit, pill, color=C.greenMid, sparkData, sparkColor}: {icon: React.ReactNode; label: string; value: number | string; unit?: string; pill?: string; color?: string; sparkData?: number[]; sparkColor?: string}) {
  const [ref, seen]=useInView();
  const anim=useCounter(typeof value==="number"?value:0,1400,seen);
  const display=typeof value==="number"?fmt(anim):value;
  return (
    <div ref={ref} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:"22px 22px 16px",boxShadow:C.shadow,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:36,fontWeight:800,color:C.navy,lineHeight:1,letterSpacing:"-0.02em"}}>
            {display}{unit&&<span style={{fontSize:14,fontWeight:600,color,marginLeft:4}}>{unit}</span>}
          </div>
          <div style={{fontSize:13,color:C.body,marginTop:3}}>{label}</div>
        </div>
      </div>
      {sparkData&&sparkData.length>1&&<Sparkline data={sparkData} color={sparkColor||color} height={40}/>}
      {pill&&(
        <div style={{background:C.greenLight,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:C.greenDot,flexShrink:0,display:"inline-block"}}/>
          <span style={{fontSize:12,color:C.green,fontWeight:500}}>{pill}</span>
        </div>
      )}
    </div>
  );
}

function Bar({label, value, max, unit, color=C.greenMid}: {label?: string; value: number; max: number; unit?: string; color?: string}) {
  const [ref, seen]=useInView();
  const pct=Math.min((value/(max||1))*100,100);
  return (
    <div ref={ref} style={{marginBottom:18}}>
      {label&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
        <span style={{fontSize:13,color:C.body}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color:C.navy}}>{value.toLocaleString("en-US",{maximumFractionDigits:2})}{unit&&<span style={{fontSize:11,color,marginLeft:3}}>{unit}</span>}</span>
      </div>}
      <div style={{height:8,background:C.greenLight,borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:seen?`${pct}%`:"0%",background:`linear-gradient(90deg,${color},${color}cc)`,borderRadius:99,transition:"width 1.4s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}

function PaybackChart({netAnnual, install, payback, years}: {netAnnual: number; install: number; payback: number; years: number}) {
  const [hov, setHov]=useState<number | null>(null);
  const cum=Array.from({length:years},(_,i)=>netAnnual*(i+1)-install);
  const hi=Math.max(...cum,1),lo=Math.min(...cum,-1),range=hi-lo;
  return (
    <div style={{position:"relative"}}>
      {hov!==null&&<div style={{position:"absolute",top:-34,left:"50%",transform:"translateX(-50%)",background:C.navy,color:"#fff",fontSize:11,padding:"4px 10px",borderRadius:7,whiteSpace:"nowrap",zIndex:10,pointerEvents:"none"}}>Year {hov+1}: ${cum[hov].toLocaleString("en-US",{maximumFractionDigits:0})}</div>}
      <div style={{display:"flex",gap:2,alignItems:"flex-end",height:80}}>
        {cum.map((v,i)=>{
          const h=Math.max(((v-lo)/range)*100,4);
          const isBreak=Math.abs(i+1-payback)<0.7;
          return <div key={i} style={{flex:1}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <div style={{height:`${h}%`,minHeight:4,borderRadius:"3px 3px 0 0",background:isBreak?C.gold:v>=0?C.greenMid:"#f87171",opacity:hov!==null&&hov!==i?0.5:1,border:hov===i?`1.5px solid ${C.navy}`:"1.5px solid transparent",transition:"opacity .12s"}}/>
          </div>;
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        <span style={{fontSize:10,color:C.subtle}}>Year 1</span>
        {payback>0&&payback<=years&&<span style={{fontSize:10,color:C.gold,fontWeight:700}}>↑ Breakeven yr {payback.toFixed(1)}</span>}
        <span style={{fontSize:10,color:C.subtle}}>Year {years}</span>
      </div>
      <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
        {[{c:"#f87171",l:"Pre-payback"},{c:C.gold,l:"Breakeven"},{c:C.greenMid,l:"Net positive"}].map(x=>(
          <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:9,height:9,borderRadius:2,background:x.c,display:"inline-block"}}/>
            <span style={{fontSize:11,color:C.body}}>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPITile({label, value, sub, color=C.navy}: {label: string; value: string; sub?: string; color?: string}) {
  return (
    <div style={{background:C.sectionBg,borderRadius:16,padding:"20px 18px",border:`1px solid ${C.border}`,textAlign:"center"}}>
      <div style={{fontSize:10,fontWeight:700,color:C.subtle,letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontSize:24,fontWeight:800,color,lineHeight:1,marginBottom:6}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.subtle,lineHeight:1.5}}>{sub}</div>}
    </div>
  );
}

function AIForecastPanel({currentData, history, metrics}: {currentData: any; history: any[]; metrics: any}) {
  const [forecast, setForecast] = useState<any>(null);
  const [loading,  setLoading]  = useState(false);
  const [lastRun,  setLastRun]  = useState<string | null>(null);
  const [err,      setErr]      = useState<string | null>(null);

  useEffect(()=>{
    fetch(`${API}/forecast`)
      .then(r=>r.json())
      .then(j=>{
        if (j.ok && j.data) {
          setForecast(j.data);
          setLastRun(j.created_at ? new Date(j.created_at).toLocaleString() : null);
        }
      }).catch(()=>{});
  },[]);

  const run = useCallback(async()=>{
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`${API}/forecast/generate`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ currentData, metrics }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      setForecast(j.data);
      setLastRun(new Date().toLocaleString());
    } catch(e) {
      console.error(e);
      setErr("Unable to generate forecast at this time. Please try again shortly.");
    }
    setLoading(false);
  },[currentData,metrics]);

  const confColor: Record<string, string> = {High:C.green,Medium:C.gold,Low:"#dc2626"};

  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:32}}>
        <div>
          <Eyebrow text="AI-Powered Forecasting" align="left"/>
          <h2 style={{fontSize:28,fontWeight:800,color:C.navy,letterSpacing:"-0.02em",marginBottom:8}}>Performance Forecast</h2>
          <p style={{fontSize:13,color:C.body,lineHeight:1.7,maxWidth:520}}>
            Quantitative projections derived from live system data and Pakistan solar irradiance models.
            Applies 0.5%/yr panel degradation and 2.5%/yr tariff escalation.
            {lastRun&&<span style={{color:C.subtle}}> · Last updated: {lastRun}</span>}
          </p>
        </div>
        <button onClick={run} disabled={loading} style={{background:loading?C.sectionBg:C.navy,color:loading?C.subtle:"#fff",border:"none",borderRadius:12,padding:"13px 26px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9,transition:"all .2s",boxShadow:loading?"none":C.shadowMd,whiteSpace:"nowrap"}}>
          {loading?(<><span style={{width:14,height:14,border:`2px solid ${C.subtle}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>Forecasting…</>):forecast?"↻ Refresh Forecast":"Generate Forecast"}
        </button>
      </div>

      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#dc2626"}}>{err}</div>}

      {!forecast&&!loading&&!err&&(
        <Card style={{textAlign:"center",padding:"64px 32px"}}>
          <div style={{fontSize:52,marginBottom:18}}>📡</div>
          <div style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:10}}>No forecast available yet</div>
          <div style={{fontSize:13,color:C.subtle,maxWidth:380,margin:"0 auto",lineHeight:1.75}}>
            Click <strong style={{color:C.navy}}>Generate Forecast</strong> to produce a quantitative 5-year projection using live system data.
          </div>
        </Card>
      )}

      {loading&&(
        <Card style={{textAlign:"center",padding:"64px 32px"}}>
          <div style={{fontSize:52,marginBottom:18,animation:"pulse 1.2s ease-in-out infinite"}}>⚡</div>
          <div style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:8}}>Running forecast model…</div>
          <div style={{fontSize:12,color:C.subtle}}>Applying degradation curves, tariff projections and irradiance data</div>
        </Card>
      )}

      {forecast&&!loading&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          <div style={{background:C.navy,borderRadius:16,padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:26,flexShrink:0}}>📊</span>
              <div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:4}}>Forecast Summary</div>
                <div style={{fontSize:15,color:"#e8f5ee",fontWeight:500,lineHeight:1.5}}>{forecast.trendSummary}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 16px"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:confColor[forecast.confidenceLevel]||C.gold,display:"inline-block"}}/>
              <span style={{fontSize:12,color:"#e8f5ee",fontWeight:700}}>{forecast.confidenceLevel} Confidence</span>
            </div>
          </div>

          <Card>
            <div style={{fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:20}}>Projected Outputs by Horizon</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  {["Period","Energy Output","CO₂ Avoided","Customer Savings","Capacity Factor"].map((h,hi)=>(
                    <th key={h} style={{padding:"10px 16px",textAlign:hi===0?"left":"right",fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.07em",textTransform:"uppercase",borderBottom:`2px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {(forecast.horizons||[]).map((h: any,i: number)=>(
                    <tr key={i} style={{background:i%2===0?C.sectionBg:C.white}}>
                      <td style={{padding:"15px 16px",fontWeight:800,color:C.navy,fontSize:14}}>{h.period}</td>
                      <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.body}}>{(h.energyKwh||0).toLocaleString("en-US",{maximumFractionDigits:0})}<span style={{fontSize:10,color:C.subtle,marginLeft:4}}>kWh</span></td>
                      <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.green,fontWeight:600}}>{(h.co2MT||0).toFixed(2)}<span style={{fontSize:10,color:C.subtle,marginLeft:4}}>MTCO₂e</span></td>
                      <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.gold,fontWeight:700}}>${(h.savingsUsd||0).toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                      <td style={{padding:"15px 16px",textAlign:"right",fontSize:14,color:C.body}}>{(h.capacityPct||0).toFixed(1)}<span style={{fontSize:10,color:C.subtle,marginLeft:3}}>%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="g4">
            <KPITile label="Energy CAGR" value={`${(forecast.cagr?.energy||0).toFixed(2)}%`} sub="Compound annual growth" color={C.greenMid}/>
            <KPITile label="Savings CAGR" value={`${(forecast.cagr?.savings||0).toFixed(2)}%`} sub="Incl. tariff escalation" color={C.gold}/>
            <KPITile label="Panel Degradation" value={`${(forecast.degradationPct||0).toFixed(2)}%/yr`} sub="Applied to output curve" color={C.slate}/>
            <KPITile label="Lifetime CO₂ Offset" value={`${(forecast.lifetimeCo2MT||0).toFixed(1)} MT`} sub={`Over ${currentData.lifeYears||25} years`} color={C.green}/>
          </div>

          <div style={{background:`linear-gradient(135deg,${C.navy} 0%,#2a4a38 100%)`,borderRadius:20,padding:"32px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:10}}>Projected Lifetime Savings</div>
              <div style={{fontSize:52,fontWeight:900,color:"#fff",letterSpacing:"-0.03em",lineHeight:1}}>${(forecast.lifetimeSavingsUsd||0).toLocaleString("en-US",{maximumFractionDigits:0})}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:10,lineHeight:1.6}}>Over {currentData.lifeYears||25}-year lifespan · 0.5%/yr degradation · 2.5%/yr tariff escalation</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14,minWidth:160}}>
              {[{l:"Peak Year Output",v:`${(forecast.peakYearEnergy||0).toLocaleString("en-US",{maximumFractionDigits:0})} kWh`},{l:"Lifetime CO₂ Saved",v:`${(forecast.lifetimeCo2MT||0).toFixed(1)} MTCO₂e`}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 18px"}}>
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
                {(forecast.keyDrivers||[]).map((d: string,i: number)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:24,height:24,borderRadius:7,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.green,flexShrink:0,marginTop:1}}>{i+1}</div>
                    <span style={{fontSize:13,color:C.body,lineHeight:1.6}}>{d}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.10em",textTransform:"uppercase",color:"#dc2626",marginBottom:18}}>Risk Factors</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {(forecast.riskFactors||[]).map((r: string,i: number)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:24,height:24,borderRadius:7,background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,marginTop:1}}>⚠</div>
                    <span style={{fontSize:13,color:C.body,lineHeight:1.6}}>{r}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <p style={{fontSize:11,color:C.subtle,lineHeight:1.75}}>Forecast generated by Claude AI · Pakistan grid EF 0.50 kgCO₂e/kWh · 0.5%/yr panel degradation · 2.5%/yr tariff escalation · Projections only, not a guarantee of financial returns.</p>
        </div>
      )}
    </div>
  );
}

function HistoryTab({history}: {history: any[]}) {
  const [metric, setMetric] = useState("energyKwh");
  const enriched = history.map(h=>({
    ...h,
    ghg:     ((h.energyKwh||0)*0.50*1.20)/1000,
    custSave:((h.selfPct||80)/100)*(h.energyKwh||0)*(h.tariff||0.12),
    capFact: h.systemKw>0?((h.energyKwh||0)/(h.systemKw*8760))*100:0,
    avail:   ((365-(h.downtimeDays||0))/365)*100,
  }));
  const METRICS=[
    {key:"energyKwh",label:"Energy Generated",unit:"kWh",   color:C.greenMid},
    {key:"ghg",      label:"CO₂ Avoided",     unit:"MTCO₂e",color:"#16a34a"},
    {key:"custSave", label:"Customer Savings", unit:"USD",   color:C.gold},
    {key:"capFact",  label:"Capacity Factor",  unit:"%",     color:C.sky},
    {key:"avail",    label:"Availability",     unit:"%",     color:C.greenMid},
    {key:"systemKw", label:"System Size",      unit:"kW",    color:C.slate},
  ];
  const sel=METRICS.find(m=>m.key===metric);
  return (
    <div className="fu">
      <div style={{marginBottom:32}}>
        <Eyebrow text="Historical Tracking"/>
        <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Data Over Time</h2>
        <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:520,margin:"0 auto"}}>
          Performance data tracked over time. Updates automatically.
        </p>
      </div>

      {history.length<2&&(
        <div style={{background:C.greenLight,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px",marginBottom:24,display:"flex",gap:14,alignItems:"center"}}>
          <span style={{fontSize:22,flexShrink:0}}>📊</span>
          <div style={{fontSize:13,color:C.body,lineHeight:1.7}}>
            Historical performance data will appear here as records accumulate over time.
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {METRICS.map(m=>(
          <button key={m.key} onClick={()=>setMetric(m.key)} style={{background:metric===m.key?m.color:C.white,color:metric===m.key?"#fff":C.body,border:`1px solid ${metric===m.key?m.color:C.border}`,borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{m.label}</button>
        ))}
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:15,fontWeight:700,color:C.navy}}>{sel?.label}</div>
          <div style={{fontSize:12,color:C.subtle}}>
            {enriched.length} data point{enriched.length!==1?"s":""}
            {enriched.length>0&&` · ${enriched[0].date} → ${enriched[enriched.length-1].date}`}
          </div>
        </div>
        <LineChart data={enriched} xKey="date" yKey={metric} color={sel?.color||C.greenMid} unit={sel?.unit||""} height={220}/>
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
              <thead><tr>
                {["Date","Energy (kWh)","System (kW)","CO₂ (MTCO₂e)","Savings (USD)","Availability"].map((h,hi)=>(
                  <th key={h} style={{padding:"9px 12px",textAlign:hi===0?"left":"right",fontSize:11,fontWeight:700,color:C.subtle,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`2px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {enriched.slice(-12).reverse().map((r,i)=>(
                  <tr key={i} style={{background:i%2===0?C.sectionBg:C.white}}>
                    <td style={{padding:"10px 12px",color:C.navy,fontWeight:700,fontSize:13}}>{r.date}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",color:C.body,fontSize:13}}>{(r.energyKwh||0).toLocaleString()}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",color:C.body,fontSize:13}}>{r.systemKw}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",color:C.green,fontWeight:600,fontSize:13}}>{r.ghg.toFixed(3)}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",color:C.gold,fontWeight:600,fontSize:13}}>${r.custSave.toFixed(0)}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",color:C.body,fontSize:13}}>{r.avail.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function LiveImpactDashboard() {
  const [inp,         setInp]         = useState(DEFAULTS);
  const [fetching,    setFetching]    = useState(true);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [tab,         setTab]         = useState("env");
  const [history,     setHistory]     = useState<any[]>([]);

  async function fetchAll() {
    setFetching(true);
    try {
      const [liveJ, histJ] = await Promise.all([
        fetch(`${API}/live`).then(r=>r.json()),
        fetch(`${API}/history`).then(r=>r.json()),
      ]);
      if (liveJ.ok) {
        setInp(prev=>({...prev,...liveJ.data}));
        setLastFetched(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
      }
      if (histJ.ok) setHistory(histJ.data||[]);
    } catch(e) { console.warn("Fetch error:",e); }
    setFetching(false);
  }

  useEffect(()=>{
    fetchAll();
    const id=setInterval(fetchAll, REFRESH_MS);
    return ()=>clearInterval(id);
  },[]);

  const E       = inp.energyKwh;
  const ghg     = (E*0.50*1.20)/1000;
  const wClean  = inp.cleanings*inp.waterPerClean;
  const water   = Math.max((E*2.5)/1000-wClean,0);
  const nox     = E*0.0012, so2=E*0.003, pm25=E*0.0005;
  const landHa  = inp.landM2/10000;
  const landEff = landHa>0?(E/1000)/landHa:0;
  const capFact = inp.systemKw>0?(E/(inp.systemKw*8760))*100:0;
  const perfR   = inp.systemKw*5*365>0?(E/(inp.systemKw*5*365))*100:0;
  const avail   = ((365-inp.downtimeDays)/365)*100;
  const revenue = E*inp.tariff;
  const lcoe    = E*inp.lifeYears>0?(inp.installUsd+inp.maintUsd*inp.lifeYears)/(E*inp.lifeYears):0;
  const custSave= (inp.selfPct/100)*E*inp.tariff;
  const netAnn  = custSave-inp.maintUsd;
  const roi     = inp.installUsd>0?(netAnn/inp.installUsd)*100:0;
  const payback = netAnn>0?inp.installUsd/netAnn:0;
  const gMargin = revenue>0?(netAnn/revenue)*100:0;
  const opCost  = E>0?inp.maintUsd/E:0;
  const lifetime= netAnn*inp.lifeYears-inp.installUsd;
  const metrics = {ghg,water,nox,so2,pm25,landEff,capFact,perfR,avail,revenue,lcoe,custSave,netAnn,roi,payback,gMargin,opCost,lifetime};

  const spk    = (key: string) => history.map(h=>parseFloat(h[key])||0);
  const spkGhg = history.map(h=>((h.energyKwh||0)*0.50*1.20)/1000);

  const TABS=[
    {id:"env",    label:"🌿  Environmental"},
    {id:"perf",   label:"⚡  Performance"},
    {id:"eco",    label:"💰  Economics"},
    {id:"history",label:"📈  History"},
    {id:"ai",     label:"📡  Forecast"},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.pageBg};font-family:'Inter',sans-serif;color:${C.body};-webkit-font-smoothing:antialiased}
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
      `}</style>

      <div style={{minHeight:"100vh",background:C.pageBg}}>
        <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1120,margin:"0 auto",padding:"0 32px",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <SPLogo size={44}/>
              <span style={{fontSize:20,fontWeight:800,color:C.navy,letterSpacing:"-0.02em"}}>SolarPak</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <StatusPill fetching={fetching} lastFetched={lastFetched}/>
              <a href="https://solarpak.org" target="_blank" rel="noopener noreferrer" style={{background:C.green,color:C.white,fontSize:13,fontWeight:600,textDecoration:"none",padding:"9px 20px",borderRadius:10}}>solarpak.org ↗</a>
            </div>
          </div>
        </nav>

        <div style={{maxWidth:1120,margin:"0 auto",padding:"56px 32px 96px"}}>

          <div className="fu" style={{textAlign:"center",marginBottom:52}}>
            <Eyebrow text="Our Global Impact"/>
            <h1 style={{fontSize:"clamp(30px,5vw,56px)",fontWeight:900,color:C.navy,lineHeight:1.08,letterSpacing:"-0.03em",marginBottom:20}}>
              Transforming Lives<br/><span style={{color:C.green}}>Across Pakistan</span>
            </h1>
            <p style={{fontSize:17,color:C.body,maxWidth:520,margin:"0 auto 44px",lineHeight:1.75}}>Every solar panel we install creates ripple effects of positive change. Witness the real-time impact of your donations.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,textAlign:"left"}}>
              <StatCard icon={<Bolt/>} label="Energy Generated / Year" value={E} unit="kWh" pill={`${inp.systemKw} kW system`} sparkData={spk("energyKwh")} sparkColor={C.greenMid}/>
              <StatCard icon="🌿" label="CO₂ Avoided" value={ghg} unit="MTCO₂e" pill="EF 0.50 kgCO₂e/kWh · 20% loss" sparkData={spkGhg} sparkColor="#16a34a"/>
              <StatCard icon="💧" label="Water Conserved" value={water} unit="m³" pill={`Net of ${wClean.toFixed(2)} m³ panel cleaning`}/>
            </div>
          </div>

          <div className="fu" style={{animationDelay:".08s",marginBottom:28}}>
            <div style={{display:"flex",gap:4,borderBottom:`2px solid ${C.border}`,overflowX:"auto"}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"12px 20px",fontSize:13,fontFamily:"inherit",fontWeight:600,color:tab===t.id?C.green:C.subtle,borderBottom:`2px solid ${tab===t.id?C.green:"transparent"}`,marginBottom:-2,transition:"color .15s",whiteSpace:"nowrap"}}>{t.label}</button>
              ))}
            </div>
          </div>

          {tab==="env"&&(
            <div className="fu">
              <div style={{marginBottom:32}}>
                <Eyebrow text="Environmental Impact"/>
                <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Emissions &amp; Resource Impact</h2>
                <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>Carbon displacement and resource conservation calibrated to Pakistan's grid.</p>
              </div>
              <div className="g4" style={{marginBottom:20}}>
                <StatCard icon="🌿" label="GHG Avoided"       value={ghg}   unit="MTCO₂e" pill="EF 0.50 kgCO₂e/kWh · 20% loss" sparkData={spkGhg}/>
                <StatCard icon="⚡" label="Energy Generated"  value={E}     unit="kWh"    pill={`${inp.systemKw} kW system`}     sparkData={spk("energyKwh")}/>
                <StatCard icon="💧" label="Water Conserved"   value={water} unit="m³"     pill={`Net of ${wClean.toFixed(2)} m³ cleaning`}/>
                <StatCard icon="🔋" label="Grid Carbon Factor" value={0.50} unit="kg/kWh" pill="Pakistan average displaced"/>
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

          {tab==="perf"&&(
            <div className="fu">
              <div style={{marginBottom:32}}>
                <Eyebrow text="System Performance"/>
                <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Efficiency Metrics</h2>
                <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>Technical KPIs benchmarked against South Asian regional standards.</p>
              </div>
              <div className="g3" style={{marginBottom:20}}>
                <StatCard icon="📐" label="Land Efficiency"   value={landEff} unit="MWh/ha" pill={`${inp.landM2} m² total land area`}/>
                <StatCard icon="⚙️" label="Capacity Factor"  value={capFact} unit="%" pill="Actual vs. theoretical max" sparkData={history.map(h=>h.systemKw>0?((h.energyKwh||0)/(h.systemKw*8760))*100:0)} sparkColor={C.sky}/>
                <StatCard icon="📊" label="Performance Ratio" value={perfR}   unit="%" pill="5 sun-hrs/day baseline"/>
              </div>
              <Card>
                <h3 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:20}}>Performance Benchmarks</h3>
                <Bar label="Capacity Factor"     value={parseFloat(capFact.toFixed(1))} max={100} unit="%"/>
                <Bar label="Performance Ratio"   value={parseFloat(perfR.toFixed(1))}   max={100} unit="%" color="#0284c7"/>
                <Bar label="System Availability" value={parseFloat(avail.toFixed(1))}   max={100} unit="%" color={C.green}/>
                <div style={{marginTop:22,paddingTop:22,borderTop:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:12}}>
                  {[{l:"Typical Capacity Factor",v:"15–25%",n:"Solar in Pakistan"},{l:"Good Performance Ratio",v:"≥ 75%",n:"Industry standard"},{l:"Target Availability",v:"> 95%",n:"Well-maintained"}].map(b=>(
                    <div key={b.l} style={{background:C.sectionBg,borderRadius:12,padding:"14px 16px",border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:11,color:C.subtle,marginBottom:5}}>{b.l}</div>
                      <div style={{fontSize:20,fontWeight:800,color:C.green}}>{b.v}</div>
                      <div style={{fontSize:11,color:C.subtle,marginTop:2}}>{b.n}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab==="eco"&&(
            <div className="fu">
              <div style={{marginBottom:32}}>
                <Eyebrow text="Financial Impact"/>
                <h2 style={{fontSize:28,fontWeight:800,color:C.navy,textAlign:"center",marginBottom:8}}>Economic Analysis</h2>
                <p style={{fontSize:14,color:C.body,textAlign:"center",lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>ROI, savings, and investment returns over the full system lifespan.</p>
              </div>
              <div className="g4" style={{marginBottom:20}}>
                <StatCard icon="💰" label="Annual Revenue"   value={revenue}  unit="USD"    pill={`@ $${inp.tariff}/kWh tariff`} sparkData={history.map(h=>(h.energyKwh||0)*(h.tariff||0.12))} sparkColor={C.gold}/>
                <StatCard icon="📉" label="LCOE"             value={lcoe}     unit="$/kWh"  pill="Levelized cost over lifetime"/>
                <StatCard icon="🏠" label="Customer Savings" value={custSave} unit="USD/yr" pill={`${inp.selfPct}% self-consumption`} sparkData={history.map(h=>((h.selfPct||80)/100)*(h.energyKwh||0)*(h.tariff||0.12))} sparkColor={C.gold}/>
                <StatCard icon="📈" label="ROI"              value={roi}      unit="%"      pill="Return on installation cost"/>
              </div>
              <div className="g3" style={{marginBottom:20}}>
                <StatCard icon="⏱️" label="Payback Period"  value={payback}  unit="yrs"    pill="Simple payback on install"/>
                <StatCard icon="📊" label="Gross Margin"     value={gMargin}  unit="%"      pill="Revenue minus op. cost"/>
                <StatCard icon="🔧" label="Annual Op. Cost" value={opCost}   unit="$/kWh"  pill="Maintenance per unit generated"/>
              </div>
              <Card style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:24}}>
                  <div>
                    <h3 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:4}}>{inp.lifeYears}-Year Cumulative Return</h3>
                    <p style={{fontSize:12,color:C.subtle}}>Hover each bar to see the cumulative figure</p>
                  </div>
                  <div style={{background:lifetime>=0?C.greenLight:"#fef2f2",border:`1px solid ${lifetime>=0?C.border:"#fecaca"}`,borderRadius:12,padding:"10px 18px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:C.subtle,marginBottom:3}}>Net lifetime return</div>
                    <div style={{fontSize:22,fontWeight:800,color:lifetime>=0?C.green:"#dc2626"}}>${lifetime.toLocaleString("en-US",{maximumFractionDigits:0})}</div>
                  </div>
                </div>
                <PaybackChart netAnnual={netAnn} install={inp.installUsd} payback={payback} years={inp.lifeYears}/>
              </Card>
              <Card>
                <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>System Availability</h3>
                <Bar label={`${avail.toFixed(1)}% uptime — ${inp.downtimeDays} downtime days / year`} value={parseFloat(avail.toFixed(1))} max={100} unit="%"/>
              </Card>
            </div>
          )}

          {tab==="history"&&<HistoryTab history={history}/>}
          {tab==="ai"&&<div className="fu"><AIForecastPanel currentData={inp} history={history} metrics={metrics}/></div>}

          <div className="fu" style={{marginTop:52}}>
            <div style={{background:C.green,borderRadius:22,padding:"42px 40px"}}>
              <Eyebrow text="Your Total Impact"/>
              <h2 style={{fontSize:26,fontWeight:800,color:C.white,textAlign:"center",marginBottom:32,marginTop:4}}>Transforming Lives Across Pakistan</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:20}}>
                {[
                  {icon:"🌿",v:`${fmt(ghg,2)} MTCO₂e`,l:"CO₂ Avoided"},
                  {icon:"⚡",v:`${fmt(E*inp.lifeYears/1000)} MWh`,l:"Lifetime Energy"},
                  {icon:"💰",v:`$${lifetime.toLocaleString("en-US",{maximumFractionDigits:0})}`,l:"Net 25yr Return"},
                  {icon:"💧",v:`${fmt(water,1)} m³`,l:"Water Conserved"},
                  {icon:"⏱️",v:`${avail.toFixed(1)}%`,l:"System Uptime"},
                ].map(s=>(
                  <div key={s.l} style={{textAlign:"center",background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"18px 12px"}}>
                    <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
                    <div style={{fontSize:18,fontWeight:800,color:C.white,marginBottom:4}}>{s.v}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",letterSpacing:"0.1em"}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginTop:28,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"flex-start"}}>
            <p style={{fontSize:11,color:C.subtle,lineHeight:1.8,maxWidth:700}}>
              Emission factors: Pakistan grid 0.50 kgCO₂e/kWh · Distribution losses 20% · Water 2.5 L/kWh avg · NOₓ 0.0012 · SO₂ 0.003 · PM2.5 0.0005 kg/kWh · Sun hours 5 h/day SE Asia avg.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
