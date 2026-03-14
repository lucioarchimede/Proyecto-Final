'use client';
import { useState, useMemo, useCallback } from 'react';
 
const MSF = ["Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const CM = 2;
const fm = n => "$" + Math.abs(n).toLocaleString("es-AR");
const gs = (pays, kid, mo) => { const p = pays.find(x => x.studentIds.includes(kid) && x.mes === mo && x.estado !== "rechazado"); return p ? (p.estado === "verificado" ? "ok" : "pen") : "no"; };

const Badge = ({ s }) => {
  const m = { ok:{bg:"#ECFDF5",c:"#059669",b:"#A7F3D0",l:"Pagado"}, pen:{bg:"#FFFBEB",c:"#D97706",b:"#FDE68A",l:"Pendiente"}, no:{bg:"#FEF2F2",c:"#DC2626",b:"#FECACA",l:"Impago"}, fut:{bg:"#F9FAFB",c:"#D1D5DB",b:"#F3F4F6",l:"—"} };
  const v = m[s] || m.no;
  return <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:v.bg,color:v.c,border:"1px solid "+v.b}}>{v.l}</span>;
};

// SVG Icons
const IconHome = ({color}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconPay = ({color}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IconHist = ({color}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconMore = ({color}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const IconBell = ({color}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconDown = ({color}) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconCheck = ({size,color}) => <svg width={size||20} height={size||20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX = ({color}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconCopy = ({color}) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IconAlert = ({color}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconLogout = ({color}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const INIT_NOTIFS = [
  {id:"N1",t:"Pago verificado",m:"Cuota Febrero acreditada para tus hijos.",tm:"5 Feb",r:true},
  {id:"N2",t:"Próximo vencimiento",m:"La Cuota de Abril vence el 10/04.",tm:"Hoy",r:false},
];

const cssAll = `
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes scaleCheck{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes toastIn{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes toastOut{from{opacity:1}to{opacity:0}}
@keyframes spinMP{to{transform:rotate(360deg)}}
`;

export default function ParentView({ family, students, rates, payments, onLogout, onPay }) {
  const [scr,setScr]=useState("home");
  const [exp,setExp]=useState(null);
  const [showPaid,setShowPaid]=useState({});
  const [pay,setPay]=useState(false);
  const [step,setStep]=useState(1);
  const [selK,setSelK]=useState({});
  const [selM,setSelM]=useState({});
  const [mpLoad,setMpLoad]=useState(false);
  const [success,setSuccess]=useState(false);
  const [transfer,setTransfer]=useState(false);
  const [showNotif,setShowNotif]=useState(false);
  const [notifs,setNotifs]=useState(INIT_NOTIFS);
  const [expP,setExpP]=useState(null);
  const [toast,setToast]=useState(null);
  const [toastOut,setToastOut]=useState(false);

  const tt = useCallback(m => {
    setToast(m); setToastOut(false);
    setTimeout(()=>setToastOut(true),2000);
    setTimeout(()=>{setToast(null);setToastOut(false)},2400);
  },[]);

  const unread = notifs.filter(n=>!n.r).length;

  const getCuota = (s) => Math.round((rates[s.nivel]||0)*(1-(s.beca||0)));

  const getIssues = (kid) => {
    const out=[];
    MSF.slice(0,CM+1).forEach(m=>{const st=gs(payments,kid.legajo,m);if(st==="no")out.push({m,st:"impaga"});else if(st==="pen")out.push({m,st:"pendiente"});});
    return out;
  };

  const paidC=useMemo(()=>{let c=0;students.forEach(k=>MSF.slice(0,CM+1).forEach(m=>{if(gs(payments,k.legajo,m)==="ok")c++}));return c},[payments,students]);
  const totalDue=students.length*(CM+1);
  const debtTotal=useMemo(()=>{let v=0;students.forEach(k=>MSF.slice(0,CM+1).forEach(m=>{if(gs(payments,k.legajo,m)==="no")v+=getCuota(k)}));return v},[payments,students,rates]);
  const penTotal=useMemo(()=>{let v=0;students.forEach(k=>MSF.slice(0,CM+1).forEach(m=>{if(gs(payments,k.legajo,m)==="pen")v+=getCuota(k)}));return v},[payments,students,rates]);

  const sKL=Object.keys(selK).filter(x=>selK[x]).map(Number);
  const sML=Object.keys(selM).filter(x=>selM[x]);
  const pTot=sKL.reduce((sum,kid)=>{const k=students.find(x=>x.legajo===kid);return sum+sML.length*(k?getCuota(k):0)},0);

  const openPay=(preK,preM)=>{const k={};if(preK)preK.forEach(l=>k[l]=true);else students.forEach(c=>k[c.legajo]=true);setSelK(k);const m={};if(preM)m[preM]=true;setSelM(m);setStep(1);setPay(true);setSuccess(false);setMpLoad(false);setTransfer(false)};
  const closePay=()=>{setPay(false);setSuccess(false);setMpLoad(false);setTransfer(false)};

  const doMP=()=>{
    setMpLoad(true);
    setTimeout(async()=>{
      for(const mo of sML){const amt=sKL.reduce((sum,kid)=>{const k=students.find(x=>x.legajo===kid);return sum+(k?getCuota(k):0)},0);await onPay({studentIds:sKL,mes:mo,monto:amt,metodo:"MercadoPago",estado:"verificado"});}
      setNotifs(prev=>[{id:"N"+Date.now(),t:"Pago acreditado",m:"Pago por MercadoPago procesado.",tm:"Ahora",r:false},...prev]);
      setMpLoad(false);setSuccess(true);
    },2200);
  };

  const confirmTR=async()=>{
    for(const mo of sML){const amt=sKL.reduce((sum,kid)=>{const k=students.find(x=>x.legajo===kid);return sum+(k?getCuota(k):0)},0);await onPay({studentIds:sKL,mes:mo,monto:amt,metodo:"Transferencia",estado:"pendiente"});}
    setNotifs(prev=>[{id:"N"+Date.now(),t:"Pago registrado",m:"Transferencia pendiente de verificación.",tm:"Ahora",r:false},...prev]);
    setTransfer(false);setSuccess(true);
  };

  const cp=t=>{navigator.clipboard&&navigator.clipboard.writeText(t);tt("Copiado al portapapeles")};

  const GR="#1B5E20";

  // ═══ HEADER ═══
  const Hdr=()=>(
    <div style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
      <div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase"}}>Portal de Familias</div>
        <div style={{fontSize:16,color:"#fff",fontWeight:600,marginTop:2}}>{family?.responsable||"Cargando..."}</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>{setShowNotif(!showNotif);if(!showNotif)setNotifs(prev=>prev.map(n=>({...n,r:true})))}} style={{position:"relative",width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.12)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <IconBell color="rgba(255,255,255,.8)"/>
          {unread>0&&<div style={{position:"absolute",top:-2,right:-2,background:"#EF4444",color:"#fff",width:16,height:16,borderRadius:8,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</div>}
        </button>
        <button onClick={onLogout} style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.12)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <IconLogout color="rgba(255,255,255,.8)"/>
        </button>
      </div>
    </div>
  );

  // ═══ NOTIF PANEL ═══
  const NotifPanel=()=>showNotif?(
    <div onClick={()=>setShowNotif(false)} style={{position:"fixed",inset:0,zIndex:90,background:"rgba(0,0,0,.25)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",margin:"60px 12px 0",borderRadius:14,maxHeight:"55vh",overflow:"auto",border:"1px solid #E8ECF0",boxShadow:"0 10px 40px rgba(0,0,0,.12)",animation:"fadeIn .2s ease-out"}}>
        <div style={{padding:"14px 16px 8px",fontWeight:600,fontSize:14,color:"#111827",borderBottom:"1px solid #F2F4F6"}}>Notificaciones</div>
        {notifs.length===0&&<div style={{padding:20,textAlign:"center",color:"#9CA3AF",fontSize:13}}>Sin notificaciones</div>}
        {notifs.map(n=>(
          <div key={n.id} style={{padding:"10px 16px",borderBottom:"1px solid #F2F4F6",background:n.r?"#fff":"#ECFDF5"}}>
            <div style={{fontWeight:n.r?500:600,fontSize:13,color:"#111827"}}>{n.t}</div>
            <div style={{fontSize:12,color:"#6B7280",marginTop:1}}>{n.m}</div>
            <div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{n.tm}</div>
          </div>
        ))}
      </div>
    </div>
  ):null;

  // ═══ CHILD CARD ═══
  const ChildCard=({k})=>{
    const o=exp===k.legajo;const issues=getIssues(k);const allOk=issues.length===0;const hasPen=issues.some(x=>x.st==="pendiente");const cuota=getCuota(k);
    const unpaid=MSF.slice(0,CM+1).filter(m=>gs(payments,k.legajo,m)!=="ok");const paidM=MSF.slice(0,CM+1).filter(m=>gs(payments,k.legajo,m)==="ok");const sp=showPaid[k.legajo];
    return(
      <div style={{background:"#fff",borderRadius:12,marginBottom:8,border:"1px solid #E8ECF0",overflow:"hidden"}}>
        <div onClick={()=>setExp(o?null:k.legajo)} style={{padding:"13px 16px",display:"flex",alignItems:"center",cursor:"pointer",gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:allOk?"#ECFDF5":hasPen?"#FFFBEB":"#FEF2F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:allOk?"#059669":hasPen?"#D97706":"#DC2626",flexShrink:0}}>{k.nombre[0]}{k.apellido[0]}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14,color:"#111827"}}>{k.nombre} {k.apellido}</div>
            <div style={{fontSize:12,color:"#9CA3AF",marginTop:1}}>{k.nivel} · {k.curso} · {fm(cuota)}/mes{k.beca>0?" (beca "+(k.beca*100)+"%)":""}</div>
            {allOk?<div style={{fontSize:11,color:"#059669",fontWeight:600,marginTop:3}}>Al día</div>
            :<div style={{fontSize:11,marginTop:3,display:"flex",flexWrap:"wrap",gap:2}}>{issues.map((is,i)=><span key={i} style={{color:is.st==="impaga"?"#DC2626":"#D97706",fontWeight:500}}>{is.m}: {is.st}{i<issues.length-1?" · ":""}</span>)}</div>}
          </div>
          <span style={{color:"#D1D5DB",fontSize:16,transform:o?"rotate(180deg)":"none",transition:".2s"}}>▾</span>
        </div>
        {o&&(
          <div style={{padding:"0 16px 14px",borderTop:"1px solid #F2F4F6",animation:"fadeIn .15s ease-out"}}>
            {unpaid.length>0&&<div>
              <div style={{fontSize:10,fontWeight:600,color:"#DC2626",padding:"10px 0 6px",textTransform:"uppercase",letterSpacing:.5}}>Requiere atención</div>
              {unpaid.map(m=>{const st=gs(payments,k.legajo,m);return(
                <div key={m} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",marginBottom:4,borderRadius:8,background:st==="no"?"#FEF2F2":"#FFFBEB",border:"1px solid "+(st==="no"?"#FECACA":"#FDE68A")}}>
                  <div><span style={{fontSize:13,color:"#111827",fontWeight:600}}>{m}</span><span style={{fontSize:11,color:"#9CA3AF",marginLeft:8}}>{fm(cuota)}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <Badge s={st}/>
                    {st==="no"&&<button onClick={e=>{e.stopPropagation();openPay([k.legajo],m)}} style={{fontSize:11,color:"#fff",fontWeight:600,cursor:"pointer",background:GR,padding:"4px 12px",borderRadius:6,border:"none"}}>Pagar</button>}
                  </div>
                </div>
              )})}
            </div>}
            {paidM.length>0&&<div>
              <div onClick={e=>{e.stopPropagation();setShowPaid({...showPaid,[k.legajo]:!sp})}} style={{fontSize:10,fontWeight:600,color:"#059669",padding:"10px 0 6px",textTransform:"uppercase",letterSpacing:.5,cursor:"pointer"}}>Pagadas ({paidM.length}) {sp?"▴":"▾"}</div>
              {sp&&paidM.map(m=>{const payInfo=payments.find(p=>p.studentIds.includes(k.legajo)&&p.mes===m&&p.estado==="verificado");return(
                <div key={m} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #F2F4F6"}}>
                  <div><span style={{fontSize:13,color:"#6B7280"}}>{m} — {fm(cuota)}</span>{payInfo&&<span style={{fontSize:10,color:"#9CA3AF",marginLeft:6}}>{payInfo.metodo} · {payInfo.fecha}</span>}</div>
                  <Badge s="ok"/>
                </div>
              )})}
            </div>}
            <div style={{fontSize:10,fontWeight:600,color:"#9CA3AF",padding:"10px 0 4px",textTransform:"uppercase",letterSpacing:.5}}>Próximos</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{MSF.slice(CM+1).map(m=><span key={m} style={{fontSize:11,color:"#9CA3AF",padding:"3px 8px",background:"#F2F4F6",borderRadius:4}}>{m}</span>)}</div>
          </div>
        )}
      </div>
    );
  };

  // ═══ HOME ═══
  const HomeSc=()=>(
    <div style={{paddingBottom:16}}>
      <div style={{padding:"14px 16px 0",display:"flex",gap:8}}>
        {[{l:"Alumnos",v:students.length,c:"#1B5E20"},{l:"Al día",v:paidC+"/"+totalDue,c:paidC===totalDue?"#059669":"#D97706"},{l:"Vence",v:"10 Abr",c:"#DC2626"}].map((c,i)=>(
          <div key={i} style={{flex:1,background:"#fff",borderRadius:12,padding:"13px 14px",border:"1px solid #E8ECF0"}}>
            <div style={{fontSize:10,color:"#9CA3AF",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{c.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:c.c,marginTop:5}}>{c.v}</div>
          </div>
        ))}
      </div>
      <div style={{margin:"12px 16px 0",padding:"12px 14px",borderRadius:12,background:"#EFF6FF",border:"1px solid #BFDBFE",display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:28,height:28,borderRadius:8,background:"#3B82F6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13,color:"#fff",fontWeight:700}}>i</div>
        <div><div style={{fontSize:12,fontWeight:600,color:"#1E40AF"}}>Comunicado</div><div style={{fontSize:12,color:"#3B82F6",marginTop:2}}>Las cuotas de Abril vencen el 10/04. Después se aplica recargo del 10%.</div></div>
      </div>
      {(debtTotal>0||penTotal>0)?(
        <div onClick={()=>openPay(null,null)} style={{margin:"12px 16px 0",padding:"14px 16px",borderRadius:12,background:"#FFFBEB",border:"1px solid #FDE68A",cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><IconAlert color="#D97706"/><span style={{fontWeight:700,fontSize:15,color:"#111827"}}>Saldo: {fm(debtTotal+penTotal)}</span></div>
            <span style={{color:"#D97706",fontSize:16}}>›</span>
          </div>
          {students.map(kid=>{const iss=getIssues(kid);if(iss.length===0)return null;return(
            <div key={kid.legajo} style={{fontSize:12,color:"#6B7280",marginTop:3}}>
              <span style={{fontWeight:600,color:"#111827"}}>{kid.nombre}: </span>
              {iss.map((is,i)=><span key={i} style={{color:is.st==="impaga"?"#DC2626":"#D97706",fontWeight:500}}>{is.m} ({is.st}){i<iss.length-1?" · ":""}</span>)}
            </div>
          )})}
        </div>
      ):(
        <div style={{margin:"12px 16px 0",padding:"14px 16px",borderRadius:12,background:"#ECFDF5",border:"1px solid #A7F3D0",display:"flex",alignItems:"center",gap:8}}>
          <IconCheck size={18} color="#059669"/><span style={{fontWeight:600,color:"#059669",fontSize:13}}>Todas las cuotas al día</span>
        </div>
      )}
      <div style={{padding:"18px 16px 8px"}}>
        <div style={{fontWeight:600,fontSize:14,color:"#111827",marginBottom:10}}>Alumnos</div>
        {students.map(k=><ChildCard key={k.legajo} k={k}/>)}
      </div>
      <div style={{padding:"0 16px"}}>
        <button onClick={()=>openPay(null,null)} style={{width:"100%",padding:15,background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <IconPay color="#fff"/>Pagar cuotas
        </button>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>setScr("hist")} style={{flex:1,padding:11,background:"#fff",border:"1px solid #E8ECF0",borderRadius:10,fontSize:12,fontWeight:600,color:"#6B7280",cursor:"pointer"}}>Historial</button>
          <button onClick={()=>setScr("rec")} style={{flex:1,padding:11,background:"#fff",border:"1px solid #E8ECF0",borderRadius:10,fontSize:12,fontWeight:600,color:"#6B7280",cursor:"pointer"}}>Comprobantes</button>
        </div>
      </div>
    </div>
  );

  // ═══ HISTORY ═══
  const HistSc=()=>{const myP=payments.filter(p=>p.studentIds.some(id=>students.map(s=>s.legajo).includes(id)));return(
    <div style={{padding:16}}>
      <div style={{fontWeight:600,fontSize:16,color:"#111827",marginBottom:12}}>Historial</div>
      {myP.length===0&&<div style={{textAlign:"center",padding:30,color:"#9CA3AF"}}>Sin pagos registrados.</div>}
      {myP.map(p=>{const ks=p.studentIds.map(l=>students.find(s=>s.legajo===l)).filter(Boolean);const o=expP===p.id;return(
        <div key={p.id} style={{background:"#fff",borderRadius:12,marginBottom:6,border:"1px solid #E8ECF0",overflow:"hidden"}}>
          <div onClick={()=>setExpP(o?null:p.id)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:600,fontSize:13,color:"#111827"}}>{p.mes} — {ks.map(k=>k.nombre).join(", ")}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{p.fecha} · {p.metodo}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:14}}>{fm(p.monto)}</div><Badge s={p.estado==="verificado"?"ok":"pen"}/></div>
          </div>
          {o&&<div style={{padding:"0 14px 12px",borderTop:"1px solid #F2F4F6",animation:"fadeIn .15s ease-out"}}>
            <div style={{fontSize:12,color:"#9CA3AF",paddingTop:8}}>Ref: {p.referencia}</div>
            <button onClick={()=>tt("Comprobante descargado")} style={{width:"100%",marginTop:8,padding:10,background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:8,fontSize:12,fontWeight:600,color:"#059669",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><IconDown color="#059669"/>Descargar comprobante</button>
          </div>}
        </div>
      )})}
    </div>
  )};

  // ═══ RECEIPTS ═══
  const RecSc=()=>{const myP=payments.filter(p=>p.studentIds.some(id=>students.map(s=>s.legajo).includes(id)));return(
    <div style={{padding:16}}>
      <div style={{fontWeight:600,fontSize:16,color:"#111827",marginBottom:12}}>Comprobantes</div>
      {myP.length===0&&<div style={{textAlign:"center",padding:30,color:"#9CA3AF"}}>Sin comprobantes.</div>}
      {myP.map(p=>{const ks=p.studentIds.map(l=>students.find(s=>s.legajo===l)).filter(Boolean);return(
        <div key={p.id} style={{background:"#fff",borderRadius:12,marginBottom:6,padding:"12px 14px",border:"1px solid #E8ECF0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:600,fontSize:13,color:"#111827"}}>{p.mes} — {ks.map(k=>k.nombre).join(", ")}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{p.fecha} · {fm(p.monto)}</div></div>
          <button onClick={()=>tt("Descargado")} style={{width:34,height:34,borderRadius:8,background:"#ECFDF5",border:"1px solid #A7F3D0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IconDown color="#059669"/></button>
        </div>
      )})}
    </div>
  )};

  // ═══ MORE ═══
  const MoreSc=()=>(
    <div style={{padding:16}}>
      <div style={{fontWeight:600,fontSize:16,color:"#111827",marginBottom:12}}>Información</div>
      <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:10,border:"1px solid #E8ECF0"}}>
        <div style={{fontWeight:600,fontSize:13,color:"#111827",marginBottom:10}}>Datos bancarios</div>
        {[["CBU","2850590940090418135201"],["Alias","colegio.almafuerte.pagos"],["Titular","Colegio Almafuerte SRL"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #F2F4F6"}}>
            <div><div style={{fontSize:10,color:"#9CA3AF"}}>{l}</div><div style={{fontSize:13,fontWeight:600,color:"#111827",marginTop:1}}>{v}</div></div>
            <button onClick={()=>cp(v)} style={{padding:"4px 12px",background:"#FAFBFC",border:"1px solid #E8ECF0",borderRadius:6,fontSize:11,fontWeight:600,color:"#6B7280",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><IconCopy color="#6B7280"/>Copiar</button>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{width:"100%",padding:13,background:"#fff",border:"1px solid #FECACA",borderRadius:12,fontSize:13,fontWeight:600,color:"#DC2626",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        <IconLogout color="#DC2626"/>Cerrar sesión
      </button>
    </div>
  );

  // ═══ PAY MODAL ═══
  const PayMod=()=>{
    if(!pay)return null;
    if(success)return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",width:"88%",maxWidth:380,textAlign:"center",animation:"fadeIn .3s ease-out"}}>
          <div style={{width:60,height:60,borderRadius:30,background:"#ECFDF5",border:"2px solid #A7F3D0",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",animation:"scaleCheck .5s ease-out"}}><IconCheck size={30} color="#059669"/></div>
          <div style={{fontSize:18,fontWeight:700,color:"#111827"}}>Pago registrado</div>
          <div style={{fontSize:13,color:"#6B7280",marginTop:6}}>{fm(pTot)}</div>
          <button onClick={()=>tt("Comprobante descargado")} style={{width:"100%",marginTop:20,padding:12,background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:10,fontSize:13,fontWeight:600,color:"#059669",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><IconDown color="#059669"/>Descargar</button>
          <button onClick={closePay} style={{width:"100%",marginTop:6,padding:10,background:"none",border:"none",fontSize:12,color:"#9CA3AF",cursor:"pointer"}}>Volver al inicio</button>
        </div>
      </div>
    );
    if(mpLoad)return(
      <div style={{position:"fixed",inset:0,background:"#0284c7",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff"}}>
        <div style={{width:44,height:44,border:"3px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spinMP .7s linear infinite",marginBottom:18}}/>
        <div style={{fontSize:15,fontWeight:600}}>Procesando pago...</div>
        <div style={{marginTop:6,fontSize:13,opacity:.6}}>Conectando con MercadoPago</div>
      </div>
    );
    if(transfer)return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{background:"#fff",borderRadius:"18px 18px 0 0",width:"100%",maxWidth:460,maxHeight:"88vh",overflow:"auto",padding:"16px 20px 28px",animation:"slideUp .25s ease-out"}}>
          <div style={{width:32,height:3,borderRadius:2,background:"#D1D5DB",margin:"0 auto 12px"}}/>
          <div style={{fontSize:16,fontWeight:700,color:"#111827",marginBottom:14}}>Datos para transferencia</div>
          <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:12,marginBottom:14,fontSize:12,color:"#D97706",fontWeight:500,display:"flex",alignItems:"center",gap:8}}><IconAlert color="#D97706"/>Transferir exactamente {fm(pTot)}</div>
          {[["Banco","Banco Macro"],["CBU","2850590940090418135201"],["Alias","colegio.almafuerte.pagos"],["Monto",fm(pTot)]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid #F2F4F6"}}>
              <div><div style={{fontSize:10,color:"#9CA3AF"}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:"#111827",marginTop:1}}>{v}</div></div>
              <button onClick={()=>cp(v)} style={{padding:"5px 12px",background:"#FAFBFC",border:"1px solid #E8ECF0",borderRadius:6,fontSize:11,fontWeight:600,color:"#6B7280",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><IconCopy color="#6B7280"/>Copiar</button>
            </div>
          ))}
          <button onClick={confirmTR} style={{width:"100%",marginTop:18,padding:15,background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>Ya realicé la transferencia</button>
        </div>
      </div>
    );
    const avM=MSF.slice(0,CM+1).filter(m=>sKL.some(l=>gs(payments,l,m)!=="ok"));
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{background:"#fff",borderRadius:"18px 18px 0 0",width:"100%",maxWidth:460,maxHeight:"88vh",overflow:"auto",padding:"16px 20px 28px",animation:"slideUp .25s ease-out"}}>
          <div style={{width:32,height:3,borderRadius:2,background:"#D1D5DB",margin:"0 auto 12px"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:16,fontWeight:700,color:"#111827"}}>Pagar cuotas</div>
            <button onClick={closePay} style={{background:"none",border:"none",cursor:"pointer"}}><IconX color="#9CA3AF"/></button>
          </div>
          {step===1&&<div>
            <div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Alumnos</div>
            {students.map(k=>{const cuota=getCuota(k);return(
              <label key={k.legajo} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",background:selK[k.legajo]?"#ECFDF5":"#FAFBFC",border:"1.5px solid "+(selK[k.legajo]?"#A7F3D0":"transparent"),borderRadius:10,marginBottom:5,cursor:"pointer"}}>
                <input type="checkbox" checked={!!selK[k.legajo]} onChange={e=>setSelK({...selK,[k.legajo]:e.target.checked})} style={{accentColor:GR,width:16,height:16}}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#111827"}}>{k.nombre} {k.apellido}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{k.nivel} · {k.curso}{k.beca>0?" · Beca "+(k.beca*100)+"%":""}</div></div>
                <span style={{fontSize:13,fontWeight:600,color:"#6B7280"}}>{fm(cuota)}</span>
              </label>
            )})}
            <div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginTop:16,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Meses</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {avM.map(m=><button key={m} onClick={()=>setSelM({...selM,[m]:!selM[m]})} style={{padding:"7px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"1.5px solid "+(selM[m]?"#A7F3D0":"#E8ECF0"),background:selM[m]?"#ECFDF5":"#fff",color:selM[m]?"#059669":"#9CA3AF"}}>{m}</button>)}
            </div>
            <button disabled={!sKL.length||!sML.length} onClick={()=>setStep(2)} style={{width:"100%",marginTop:18,padding:14,background:sKL.length&&sML.length?"linear-gradient(135deg,#1B5E20,#2E7D32)":"#E5E7EB",color:sKL.length&&sML.length?"#fff":"#9CA3AF",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:sKL.length&&sML.length?"pointer":"default"}}>
              Continuar{pTot>0?" — "+fm(pTot):""}
            </button>
          </div>}
          {step===2&&<div>
            <div style={{background:"#FAFBFC",borderRadius:12,padding:14,marginBottom:14,border:"1px solid #E8ECF0"}}>
              {sKL.map(l=>{const k=students.find(x=>x.legajo===l);if(!k)return null;const cuota=getCuota(k);return sML.map(m=>(
                <div key={l+"-"+m} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13,borderBottom:"1px solid #F2F4F6"}}>
                  <span style={{color:"#6B7280"}}>{k.nombre} {k.apellido} — {m}{k.beca>0?" (beca "+(k.beca*100)+"%)":""}</span>
                  <span style={{fontWeight:600}}>{fm(cuota)}</span>
                </div>
              ))})}
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontSize:16,fontWeight:700,color:"#111827"}}><span>Total</span><span>{fm(pTot)}</span></div>
            </div>
            <button onClick={doMP} style={{width:"100%",padding:15,background:"#0284c7",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:6}}>Pagar con MercadoPago</button>
            <button onClick={()=>setTransfer(true)} style={{width:"100%",padding:13,background:"#fff",border:"1px solid #E8ECF0",borderRadius:12,fontSize:13,fontWeight:600,color:"#6B7280",cursor:"pointer"}}>Pagar por transferencia</button>
            <button onClick={()=>setStep(1)} style={{width:"100%",marginTop:6,padding:9,background:"none",border:"none",fontSize:12,color:"#9CA3AF",cursor:"pointer"}}>← Volver</button>
          </div>}
        </div>
      </div>
    );
  };

  // ═══ TOAST ═══
  const ToastEl=()=>toast?(
    <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:300,background:"#1B5E20",color:"#fff",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:500,boxShadow:"0 8px 30px rgba(0,0,0,.2)",animation:toastOut?"toastOut .3s ease-in forwards":"toastIn .2s ease-out",display:"flex",alignItems:"center",gap:6}}>
      <IconCheck size={14} color="#fff"/>{toast}
    </div>
  ):null;

  // ═══ NAV ═══
  const Nav=()=>(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40,background:"#fff",borderTop:"1px solid #E8ECF0",display:"flex",justifyContent:"space-around",padding:"6px 0",paddingBottom:"max(10px, env(safe-area-inset-bottom))"}}>
      {[
        {id:"home",l:"Inicio",Icon:IconHome},
        {id:"_pay",l:"Pagar",Icon:IconPay},
        {id:"hist",l:"Historial",Icon:IconHist},
        {id:"more",l:"Más",Icon:IconMore}
      ].map(t=>{
        const active=scr===t.id;
        const color=active?GR:"#9CA3AF";
        return(
          <button key={t.id} onClick={()=>t.id==="_pay"?openPay(null,null):setScr(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 12px",opacity:active?1:.65}}>
            <t.Icon color={color}/>
            <span style={{fontSize:10,fontWeight:600,color}}>{t.l}</span>
          </button>
        );
      })}
    </div>
  );

  return(
    <div style={{maxWidth:440,margin:"0 auto",minHeight:"100vh",background:"#FAFBFC",fontFamily:"'IBM Plex Sans',-apple-system,sans-serif",paddingBottom:68}}>
      <style>{cssAll}</style>
      <ToastEl/>
      <NotifPanel/>
      <PayMod/>
      <Hdr/>
      {scr==="home"&&<HomeSc/>}
      {scr==="hist"&&<HistSc/>}
      {scr==="rec"&&<RecSc/>}
      {scr==="more"&&<MoreSc/>}
      <Nav/>
    </div>
  );
}
