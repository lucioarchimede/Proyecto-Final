'use client';
import { useState, useMemo, useCallback } from 'react';

const MSF=['Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MS=['Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const CM=2;
const fm=n=>"$"+Math.abs(n).toLocaleString("es-AR");
const gs=(pays,kid,mo)=>{const p=pays.find(x=>x.studentIds.includes(kid)&&x.mes===mo&&x.estado!=="rechazado");return p?(p.estado==="verificado"?"ok":"pen"):"no"};
const GR="#1B5E20";
const Badge=({s})=>{const m={ok:{bg:"#ECFDF5",c:"#059669",b:"#A7F3D0",l:"Verificado"},pen:{bg:"#FFFBEB",c:"#D97706",b:"#FDE68A",l:"Pendiente"},rej:{bg:"#FEF2F2",c:"#DC2626",b:"#FECACA",l:"Rechazado"},no:{bg:"#F3F4F6",c:"#6B7280",b:"#E5E7EB",l:"Impago"}};const v=m[s]||m.no;return <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:v.bg,color:v.c,border:"1px solid "+v.b}}>{v.l}</span>};

export default function AdminView({allStudents,rates,payments,onBack,onUpdatePayment,onAddPayment,onUpdateRate,onUpdateStudent}){
  const[scr,setScr]=useState("dash");
  const[srch,setSrch]=useState("");
  const[pf,setPf]=useState("all");
  const[expP,setExpP]=useState(null);
  const[expS,setExpS]=useState(null);
  const[addP,setAddP]=useState(false);
  const[debtM,setDebtM]=useState(false);
  const[editKid,setEditKid]=useState(null);
  const[toast,setToast]=useState(null);
  const[np,setNp]=useState({k:"",mo:"Abril",a:"",mt:"MercadoPago",ref:"",obs:"",st:"verificado"});
  const tt=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2200)},[]);
  const getCuota=(s)=>Math.round((rates[s.nivel]||0)*(1-(s.beca||0)));
  const debt=useMemo(()=>{let v=0;allStudents.forEach(k=>MSF.slice(0,CM+1).forEach(m=>{if(gs(payments,k.legajo,m)==="no")v+=getCuota(k)}));return v},[payments,allStudents,rates]);
  const debtors=useMemo(()=>{const l=[];allStudents.forEach(k=>{const u=[];MSF.slice(0,CM+1).forEach(m=>{if(gs(payments,k.legajo,m)==="no")u.push(m)});if(u.length>0)l.push({...k,um:u,da:u.length*getCuota(k)})});return l.sort((a,b)=>b.da-a.da)},[payments,allStudents,rates]);
  const fPays=useMemo(()=>payments.filter(p=>{if(pf!=="all"&&p.estado!==pf)return false;if(srch){const q=srch.toLowerCase();const ks=p.studentIds.map(l=>allStudents.find(k=>k.legajo===l)).filter(Boolean);if(!ks.some(k=>(k.nombre+" "+k.apellido).toLowerCase().includes(q))&&!p.studentIds.some(l=>String(l).includes(q))&&!(p.referencia||"").toLowerCase().includes(q))return false}return true}),[payments,pf,srch,allStudents]);
  const monthlyRev=MSF.slice(0,CM+1).map(m=>({m,ok:payments.filter(p=>p.mes===m&&p.estado==="verificado").reduce((a,p)=>a+p.monto,0),pen:payments.filter(p=>p.mes===m&&p.estado==="pendiente").reduce((a,p)=>a+p.monto,0)}));
  const YearGrid=({kid})=><div style={{display:"flex",gap:3,marginTop:6,marginBottom:8}}>{MS.map((m,i)=>{const fut=i>CM;const st=fut?"fut":gs(payments,kid,MSF[i]);const c={ok:"#059669",pen:"#D97706",no:"#DC2626",fut:"#E5E7EB"};return <div key={m} title={MSF[i]} style={{flex:1,height:24,borderRadius:4,background:fut?"#F3F4F6":st==="ok"?"#ECFDF5":st==="pen"?"#FFFBEB":"#FEF2F2",border:"1px solid "+(fut?"#E5E7EB":st==="ok"?"#A7F3D0":st==="pen"?"#FDE68A":"#FECACA"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,color:c[st]||"#D1D5DB"}}>{m}</div>})}</div>;

  const Hdr=()=><div style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}><div><div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase"}}>Colegio Almafuerte</div><div style={{fontSize:16,color:"#fff",fontWeight:600,marginTop:2}}>Administración</div></div><button onClick={onBack} style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.12)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"rgba(255,255,255,.8)"}}>←</button></div>;

  const DashSc=()=><div style={{padding:16}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
      {[{l:"Recaudado",v:fm(payments.filter(p=>p.estado==="verificado").reduce((a,p)=>a+p.monto,0)),c:"#059669"},{l:"Pendiente",v:fm(payments.filter(p=>p.estado==="pendiente").reduce((a,p)=>a+p.monto,0)),c:"#D97706"},{l:"Con deuda",v:debtors.length+"/"+allStudents.length,c:"#DC2626"},{l:"Deuda total",v:fm(debt),c:"#7C3AED"}].map((k,i)=><div key={i} style={{background:"#fff",borderRadius:12,padding:"13px 16px",border:"1px solid #E8ECF0",borderLeft:"3px solid "+k.c}}><div style={{fontSize:10,color:"#9CA3AF",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{k.l}</div><div style={{fontSize:19,fontWeight:700,color:k.c}}>{k.v}</div></div>)}
    </div>
    <div style={{background:"#fff",borderRadius:12,padding:14,marginBottom:14,border:"1px solid #E8ECF0"}}>
      <div style={{fontWeight:600,fontSize:13,color:"#111827",marginBottom:10}}>Recaudación por mes</div>
      {monthlyRev.map(mr=><div key={mr.m} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F2F4F6"}}><span style={{fontSize:13,fontWeight:500,color:"#111827"}}>{mr.m}</span><div style={{display:"flex",alignItems:"center",gap:10}}>{mr.pen>0&&<span style={{fontSize:11,color:"#D97706",fontWeight:500}}>{fm(mr.pen)} pend.</span>}<span style={{fontSize:13,fontWeight:700,color:mr.ok>0?"#059669":"#9CA3AF"}}>{mr.ok>0?fm(mr.ok):"—"}</span></div></div>)}
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>setAddP(true)} style={{flex:1,padding:13,background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Registrar pago</button>
      <button onClick={()=>setDebtM(true)} style={{flex:1,padding:13,background:"#fff",border:"1px solid #FECACA",borderRadius:12,fontSize:13,fontWeight:600,color:"#DC2626",cursor:"pointer"}}>Deudores</button>
    </div>
    <div style={{fontWeight:600,fontSize:14,color:"#111827",marginBottom:8}}>Últimos pagos</div>
    {payments.slice(0,5).map(p=>{const ks=p.studentIds.map(l=>allStudents.find(k=>k.legajo===l)).filter(Boolean);return <div key={p.id} style={{background:"#fff",borderRadius:10,padding:"11px 14px",marginBottom:5,border:"1px solid #E8ECF0",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:12,color:"#111827"}}>{ks.map(k=>k.apellido+" "+k.nombre).join(", ")}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{p.mes} · {p.fecha} · {p.metodo}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:14}}>{fm(p.monto)}</div><Badge s={p.estado==="verificado"?"ok":p.estado==="pendiente"?"pen":"rej"}/></div></div>})}
    <button onClick={()=>{setScr("pays");setSrch("");setExpP(null)}} style={{width:"100%",padding:9,background:"none",border:"none",fontSize:12,fontWeight:600,color:"#059669",cursor:"pointer",marginTop:4}}>Ver todos</button>
  </div>;

  const PaySc=()=><div style={{padding:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:600,fontSize:16,color:"#111827"}}>Pagos</div><button onClick={()=>setAddP(true)} style={{padding:"7px 14px",background:GR,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Nuevo</button></div>
    <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar alumno o referencia..." style={{width:"100%",padding:"9px 14px",borderRadius:10,border:"1px solid #E8ECF0",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff",marginBottom:8}}/>
    <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto"}}>{[["all","Todos"],["verificado","Verificados"],["pendiente","Pendientes"],["rechazado","Rechazados"]].map(([k,l])=><button key={k} onClick={()=>setPf(k)} style={{padding:"5px 12px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",background:pf===k?GR:"#fff",color:pf===k?"#fff":"#9CA3AF"}}>{l}</button>)}</div>
    {fPays.length===0?<div style={{textAlign:"center",padding:30,color:"#9CA3AF",fontSize:13}}>Sin resultados</div>
    :fPays.map(p=>{const ks=p.studentIds.map(l=>allStudents.find(k=>k.legajo===l)).filter(Boolean);const o=expP===p.id;const st=p.estado==="verificado"?"ok":p.estado==="pendiente"?"pen":"rej";return <div key={p.id} style={{background:"#fff",borderRadius:12,marginBottom:6,border:"1px solid #E8ECF0",overflow:"hidden"}}>
      <div onClick={()=>setExpP(o?null:p.id)} style={{padding:"11px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:"#111827"}}>{ks.map(k=>k.apellido+" "+k.nombre).join(", ")}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{p.mes} · {p.fecha} · {p.metodo}</div></div><div style={{textAlign:"right",flexShrink:0,marginLeft:8}}><div style={{fontWeight:700,fontSize:14}}>{fm(p.monto)}</div><Badge s={st}/></div></div>
      {o&&<div style={{padding:"0 14px 12px",borderTop:"1px solid #F2F4F6"}}>
        {p.observaciones&&<div style={{marginTop:8,fontSize:12,color:"#D97706",background:"#FFFBEB",border:"1px solid #FDE68A",padding:"7px 10px",borderRadius:8}}>{p.observaciones}</div>}
        <div style={{display:"flex",gap:6,marginTop:10}}>
          {p.estado==="pendiente"&&<><button onClick={()=>{onUpdatePayment(p.id,"verificado");tt("Verificado")}} style={{flex:1,padding:9,background:"#059669",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>✓ Verificar</button><button onClick={()=>{onUpdatePayment(p.id,"rechazado");tt("Rechazado")}} style={{flex:1,padding:9,background:"#DC2626",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>✗ Rechazar</button></>}
          {p.estado==="verificado"&&<button onClick={()=>{onUpdatePayment(p.id,"pendiente");tt("Revertido")}} style={{flex:1,padding:9,background:"#FAFBFC",color:"#6B7280",border:"1px solid #E8ECF0",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Revertir</button>}
          {p.estado==="rechazado"&&<button onClick={()=>{onUpdatePayment(p.id,"pendiente");tt("Pendiente")}} style={{flex:1,padding:9,background:"#FFFBEB",color:"#D97706",border:"1px solid #FDE68A",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>A pendiente</button>}
        </div>
      </div>}
    </div>})}
  </div>;

  const StuSc=()=><div style={{padding:16}}>
    <div style={{fontWeight:600,fontSize:16,color:"#111827",marginBottom:12}}>Alumnos ({allStudents.length})</div>
    <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar..." style={{width:"100%",padding:"9px 14px",borderRadius:10,border:"1px solid #E8ECF0",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff",marginBottom:12}}/>
    {(srch?allStudents.filter(k=>(k.nombre+" "+k.apellido+" "+k.legajo+" "+k.nivel).toLowerCase().includes(srch.toLowerCase())):allStudents).map(k=>{
      const o=expS===k.legajo;const cuota=getCuota(k);const un=MSF.slice(0,CM+1).filter(m=>gs(payments,k.legajo,m)==="no");const ok=un.length===0;const stuPays=payments.filter(p=>p.studentIds.includes(k.legajo));
      return <div key={k.legajo} style={{background:"#fff",borderRadius:12,marginBottom:6,border:"1px solid #E8ECF0",overflow:"hidden"}}>
        <div onClick={()=>setExpS(o?null:k.legajo)} style={{padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:8,background:ok?"#ECFDF5":"#FEF2F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:ok?"#059669":"#DC2626",flexShrink:0}}>{k.nombre[0]}{k.apellido[0]}</div>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"#111827"}}>{k.apellido} {k.nombre}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{k.nivel} · {k.curso} · {fm(cuota)}/mes{k.beca>0?" · Beca "+(k.beca*100)+"%":""}</div></div>
          {ok?<Badge s="ok"/>:<span style={{fontSize:11,fontWeight:600,color:"#DC2626"}}>{un.length} debe</span>}
        </div>
        {o&&<div style={{padding:"0 14px 14px",borderTop:"1px solid #F2F4F6"}}>
          <div style={{fontSize:12,color:"#6B7280",paddingTop:8,marginBottom:4}}>{k.responsable} · {k.email}</div>
          <div style={{fontSize:10,fontWeight:600,color:"#9CA3AF",marginTop:8,marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Estado anual</div>
          <YearGrid kid={k.legajo}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
            <div style={{fontSize:10,fontWeight:600,color:"#9CA3AF",textTransform:"uppercase"}}>Pagos ({stuPays.length})</div>
            <button onClick={e=>{e.stopPropagation();setEditKid({...k})}} style={{fontSize:11,fontWeight:600,color:"#059669",cursor:"pointer",background:"#ECFDF5",padding:"3px 10px",borderRadius:6,border:"1px solid #A7F3D0"}}>Editar</button>
          </div>
          {stuPays.length===0?<div style={{fontSize:12,color:"#9CA3AF",fontStyle:"italic",padding:"8px 0"}}>Sin pagos</div>
          :stuPays.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #F2F4F6"}}>
            <div><div style={{fontSize:12,fontWeight:500,color:"#111827"}}>{p.mes} · {p.fecha}</div><div style={{fontSize:10,color:"#9CA3AF"}}>{p.metodo}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:600}}>{fm(p.monto)}</div><Badge s={p.estado==="verificado"?"ok":p.estado==="pendiente"?"pen":"rej"}/></div>
          </div>)}
        </div>}
      </div>
    })}
  </div>;

  const ConfigSc=()=><div style={{padding:16}}>
    <div style={{fontWeight:600,fontSize:16,color:"#111827",marginBottom:14}}>Configuración</div>
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #E8ECF0"}}>
      <div style={{fontWeight:600,fontSize:13,color:"#111827",marginBottom:12}}>Cuotas por nivel</div>
      <div style={{fontSize:11,color:"#9CA3AF",marginBottom:10}}>Editá el monto y hacé click afuera para aplicar.</div>
      {Object.entries(rates).map(([lvl,amt])=><div key={lvl} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F2F4F6"}}>
        <div style={{fontWeight:600,fontSize:13,color:"#111827"}}>{lvl}</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12,color:"#9CA3AF"}}>$</span>
          <input type="number" key={"r-"+lvl} defaultValue={amt} onBlur={e=>{const v=parseInt(e.target.value)||0;if(v!==amt){onUpdateRate(lvl,v);tt(lvl+": "+fm(v))}}} style={{width:100,padding:"6px 10px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,fontWeight:600,textAlign:"right",outline:"none"}}/>
        </div>
      </div>)}
      <div style={{marginTop:10,fontSize:11,color:"#9CA3AF",background:"#FAFBFC",padding:"8px 10px",borderRadius:8}}>Recaudación mensual (sin becas): {fm(allStudents.reduce((s,k)=>s+(rates[k.nivel]||0),0))}</div>
    </div>
    <div style={{background:"#fff",borderRadius:12,padding:16,border:"1px solid #E8ECF0"}}>
      <div style={{fontWeight:600,fontSize:13,color:"#111827",marginBottom:12}}>Resumen</div>
      {Object.keys(rates).map(lvl=>{const inLvl=allStudents.filter(k=>k.nivel===lvl);const rec=inLvl.reduce((s,k)=>s+getCuota(k),0);return <div key={lvl} style={{padding:"8px 0",borderBottom:"1px solid #F2F4F6"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:13}}>{lvl} ({inLvl.length})</span><span style={{fontSize:13,fontWeight:600,color:"#059669"}}>{fm(rec)}/mes</span></div></div>})}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontWeight:700,fontSize:14}}><span>Total real</span><span style={{color:"#059669"}}>{fm(allStudents.reduce((s,k)=>s+getCuota(k),0))}</span></div>
    </div>
  </div>;

  const Overlay=({children,onClose})=><div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"18px 18px 0 0",width:"100%",maxWidth:460,maxHeight:"88vh",overflow:"auto",padding:"16px 20px 28px"}}>{children}</div></div>;

  const DebtMod=()=>debtM?<Overlay onClose={()=>setDebtM(false)}>
    <div style={{fontWeight:700,fontSize:16,color:"#DC2626",marginBottom:14}}>Deudores ({debtors.length})</div>
    {debtors.map(x=><div key={x.legajo} style={{background:"#FEF2F2",borderRadius:10,padding:"11px 14px",marginBottom:6,border:"1px solid #FECACA"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:600,fontSize:13}}>{x.apellido} {x.nombre}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{x.nivel} · {x.curso}</div></div><div style={{fontWeight:700,fontSize:14,color:"#DC2626"}}>{fm(x.da)}</div></div>
      <div style={{fontSize:11,color:"#DC2626",fontWeight:500,marginTop:4}}>Debe: {x.um.join(", ")}</div>
      <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{x.responsable} · {x.email}</div>
    </div>)}
    {debtors.length>0&&<div style={{marginTop:12,padding:12,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,textAlign:"center"}}><div style={{fontWeight:700,fontSize:17,color:"#DC2626"}}>{fm(debtors.reduce((a,d)=>a+d.da,0))}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>Deuda total</div></div>}
  </Overlay>:null;

  const AddMod=()=>addP?<Overlay onClose={()=>setAddP(false)}>
    <div style={{fontWeight:700,fontSize:16,color:"#111827",marginBottom:14}}>Registrar pago</div>
    {[{l:"Legajos (coma)",kk:"k",ph:"1001, 1002"},{l:"Monto ($)",kk:"a",ph:"135000",t:"number"},{l:"Referencia",kk:"ref",ph:"MP-001"},{l:"Observaciones",kk:"obs",ph:"Opcional"}].map(x=><div key={x.kk} style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:3,textTransform:"uppercase"}}>{x.l}</div><input value={np[x.kk]} onChange={e=>setNp({...np,[x.kk]:e.target.value})} placeholder={x.ph} type={x.t||"text"} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>)}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
      <div><div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:3,textTransform:"uppercase"}}>Mes</div><select value={np.mo} onChange={e=>setNp({...np,mo:e.target.value})} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,background:"#fff",boxSizing:"border-box"}}>{MSF.slice(0,CM+1).map(m=><option key={m}>{m}</option>)}</select></div>
      <div><div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:3,textTransform:"uppercase"}}>Medio</div><select value={np.mt} onChange={e=>setNp({...np,mt:e.target.value})} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,background:"#fff",boxSizing:"border-box"}}>{["MercadoPago","Transferencia","Efectivo"].map(m=><option key={m}>{m}</option>)}</select></div>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["verificado","Verificado"],["pendiente","Pendiente"]].map(([v,l])=><button key={v} onClick={()=>setNp({...np,st:v})} style={{flex:1,padding:9,borderRadius:8,border:"1px solid "+(np.st===v?(v==="verificado"?"#A7F3D0":"#FDE68A"):"#E8ECF0"),fontSize:12,fontWeight:600,cursor:"pointer",background:np.st===v?(v==="verificado"?"#ECFDF5":"#FFFBEB"):"#FAFBFC",color:np.st===v?(v==="verificado"?"#059669":"#D97706"):"#9CA3AF"}}>{l}</button>)}
    </div>
    <button onClick={()=>{const ks=np.k.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));if(!ks.length||!np.a){tt("Completar datos");return}onAddPayment({studentIds:ks,mes:np.mo,monto:Number(np.a),metodo:np.mt,estado:np.st,referencia:np.ref,observaciones:np.obs});setAddP(false);setNp({k:"",mo:"Abril",a:"",mt:"MercadoPago",ref:"",obs:"",st:"verificado"});tt("Pago registrado")}} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>Registrar</button>
  </Overlay>:null;

  const EditMod=()=>{if(!editKid)return null;const ek=editKid;const cb=rates[ek.nivel]||0;const cf=Math.round(cb*(1-(ek.beca||0)));
  return <div onClick={()=>setEditKid(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"18px 18px 0 0",width:"100%",maxWidth:460,maxHeight:"88vh",overflow:"auto",padding:"16px 20px 28px"}}>
    <div style={{fontWeight:700,fontSize:16,marginBottom:14}}>Editar — {ek.nombre} {ek.apellido}</div>
    <div style={{fontSize:12,color:"#9CA3AF",marginBottom:12}}>Legajo: {ek.legajo}</div>
    <div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:3,textTransform:"uppercase"}}>Nivel</div><select value={ek.nivel} onChange={e=>setEditKid({...ek,nivel:e.target.value})} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,background:"#fff",boxSizing:"border-box"}}>{Object.keys(rates).map(l=><option key={l} value={l}>{l} — {fm(rates[l])}/mes</option>)}</select></div>
    <div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:3,textTransform:"uppercase"}}>Beca</div><select value={ek.beca} onChange={e=>setEditKid({...ek,beca:parseFloat(e.target.value)})} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,background:"#fff",boxSizing:"border-box"}}>{[0,0.25,0.5,0.75,1].map(b=><option key={b} value={b}>{b===0?"Sin beca":b*100+"% descuento"}</option>)}</select></div>
    <div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#9CA3AF",marginBottom:3,textTransform:"uppercase"}}>Curso</div><input key={ek.legajo} defaultValue={ek.curso} onBlur={e=>setEditKid(prev=>({...prev,curso:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #E8ECF0",fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>
    <div style={{background:"#FAFBFC",borderRadius:10,padding:12,marginBottom:16,border:"1px solid #E8ECF0"}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:"#6B7280"}}>Base ({ek.nivel})</span><span style={{fontWeight:600}}>{fm(cb)}</span></div>
      {ek.beca>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginTop:4}}><span style={{color:"#D97706"}}>Beca ({ek.beca*100}%)</span><span style={{fontWeight:600,color:"#D97706"}}>-{fm(cb*ek.beca)}</span></div>}
      <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,marginTop:8,paddingTop:8,borderTop:"1px solid #E8ECF0"}}><span>Final</span><span style={{color:"#059669"}}>{fm(cf)}</span></div>
    </div>
    <button onClick={()=>{onUpdateStudent(ek);setEditKid(null);tt("Actualizado")}} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>Guardar</button>
  </div></div>};

  const ToastEl=()=>toast?<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:300,background:GR,color:"#fff",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:500,boxShadow:"0 8px 30px rgba(0,0,0,.2)"}}>{toast}</div>:null;

  const Nav=()=><div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40,background:"#fff",borderTop:"1px solid #E8ECF0",display:"flex",justifyContent:"space-around",padding:"8px 0 12px"}}>
    {[{id:"dash",l:"Dashboard",ic:"≡"},{id:"pays",l:"Pagos",ic:"$"},{id:"stud",l:"Alumnos",ic:"☺"},{id:"config",l:"Config",ic:"⚙"}].map(t=>{const a=scr===t.id;return <button key={t.id} onClick={()=>{setScr(t.id);setSrch("");setExpP(null);setExpS(null)}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 10px",opacity:a?1:.5}}><span style={{fontSize:20,color:a?GR:"#9CA3AF"}}>{t.ic}</span><span style={{fontSize:10,fontWeight:600,color:a?GR:"#9CA3AF"}}>{t.l}</span></button>})}
  </div>;

  return <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:"#FAFBFC",fontFamily:"'IBM Plex Sans',-apple-system,sans-serif",paddingBottom:68}}>
    <ToastEl/><DebtMod/><AddMod/><EditMod/><Hdr/>
    {scr==="dash"&&<DashSc/>}{scr==="pays"&&<PaySc/>}{scr==="stud"&&<StuSc/>}{scr==="config"&&<ConfigSc/>}
    <Nav/>
  </div>;
}