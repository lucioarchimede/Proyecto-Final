'use client';
import { useState, useMemo, useCallback } from 'react';

const MSF = [
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const CM = 2;

const UI = {
  brand: '#166534',
  brandStrong: '#14532D',
  brandAlt: '#15803D',
  brandSoft: '#ECFDF3',

  success: '#059669',
  successSoft: '#ECFDF5',
  successBorder: '#A7F3D0',

  warning: '#D97706',
  warningSoft: '#FFFBEB',
  warningBorder: '#FDE68A',

  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  dangerBorder: '#FECACA',

  info: '#2563EB',
  infoSoft: '#EFF6FF',
  infoBorder: '#BFDBFE',

  bg: '#F6F8F7',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFBFC',

  text: '#111827',
  textSoft: '#667085',
  textMuted: '#98A2B3',

  border: '#E5E7EB',
  borderSoft: '#EEF2F6',

  shadowSm: '0 1px 2px rgba(16,24,40,.04)',
  shadowMd: '0 8px 24px rgba(16,24,40,.08)',
  shadowLg: '0 16px 32px rgba(16,24,40,.12)',

  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 18,
  radiusXl: 24,
};

const fm = (n) => '$' + Math.abs(n).toLocaleString('es-AR');

const gs = (pays, kid, mo) => {
  const p = pays.find(
    (x) => x.studentIds.includes(kid) && x.mes === mo && x.estado !== 'rechazado'
  );
  return p ? (p.estado === 'verificado' ? 'ok' : 'pen') : 'no';
};

const getBadgeStyles = (s) => {
  const map = {
    ok: {
      bg: UI.successSoft,
      c: UI.success,
      b: UI.successBorder,
      l: 'Pagado',
    },
    pen: {
      bg: UI.warningSoft,
      c: UI.warning,
      b: UI.warningBorder,
      l: 'Pendiente',
    },
    no: {
      bg: UI.dangerSoft,
      c: UI.danger,
      b: UI.dangerBorder,
      l: 'Impago',
    },
    fut: {
      bg: '#F8FAFC',
      c: '#94A3B8',
      b: '#E2E8F0',
      l: '—',
    },
  };
  return map[s] || map.no;
};

const Badge = ({ s }) => {
  const v = getBadgeStyles(s);
  return (
    <span
      style={{
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: v.bg,
        color: v.c,
        border: `1px solid ${v.b}`,
        lineHeight: 1,
      }}
    >
      {v.l}
    </span>
  );
};

// Iconos SVG
const IconHome = ({ color }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconPay = ({ color }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconHist = ({ color }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconMore = ({ color }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const IconBell = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconDown = ({ color }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconCheck = ({ size, color }) => (
  <svg
    width={size || 20}
    height={size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconAlert = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconLogout = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const INIT_NOTIFS = [
  {
    id: 'N1',
    t: 'Pago verificado',
    m: 'Cuota Febrero acreditada para tus hijos.',
    tm: '5 Feb',
    r: true,
  },
  {
    id: 'N2',
    t: 'Próximo vencimiento',
    m: 'La Cuota de Abril vence el 10/04.',
    tm: 'Hoy',
    r: false,
  },
];

const cssAll = `
@keyframes fadeIn {
  from { opacity:0; transform:translateY(-6px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes fadeOut {
  from { opacity:1; transform:translate(-50%,0); }
  to { opacity:0; transform:translate(-50%,-8px); }
}
@keyframes slideUp {
  from { transform:translateY(24px); opacity:0; }
  to { transform:translateY(0); opacity:1; }
}
@keyframes popIn {
  from { transform:scale(.92); opacity:0; }
  to { transform:scale(1); opacity:1; }
}
@keyframes spinMP {
  to { transform:rotate(360deg); }
}
* { box-sizing: border-box; }
button { transition: all .18s ease; }
input, button { font: inherit; }
`;

const SurfaceCard = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: UI.surface,
      borderRadius: UI.radiusLg,
      border: '1px solid rgba(17,24,39,.05)',
      boxShadow: UI.shadowSm,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children, style = {} }) => (
  <div
    style={{
      fontWeight: 700,
      fontSize: 16,
      color: UI.text,
      marginBottom: 12,
      ...style,
    }}
  >
    {children}
  </div>
);

export default function ParentView({
  family,
  students,
  rates,
  payments,
  onLogout,
  onPay,
}) {
  const [scr, setScr] = useState('home');
  const [exp, setExp] = useState(null);
  const [showPaid, setShowPaid] = useState({});
  const [pay, setPay] = useState(false);
  const [step, setStep] = useState(1);
  const [selK, setSelK] = useState({});
  const [selM, setSelM] = useState({});
  const [mpLoad, setMpLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [expP, setExpP] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastOut, setToastOut] = useState(false);

  const tt = useCallback((m) => {
    setToast(m);
    setToastOut(false);
    setTimeout(() => setToastOut(true), 2000);
    setTimeout(() => {
      setToast(null);
      setToastOut(false);
    }, 2400);
  }, []);

  const unread = notifs.filter((n) => !n.r).length;

  const getCuota = (s) => Math.round((rates[s.nivel] || 0) * (1 - (s.beca || 0)));

  const getIssues = (kid) => {
    const out = [];
    MSF.slice(0, CM + 1).forEach((m) => {
      const st = gs(payments, kid, m);
      if (st === 'no') out.push({ m, st: 'impaga' });
      else if (st === 'pen') out.push({ m, st: 'pendiente' });
    });
    return out;
  };

  const paidC = useMemo(() => {
    let c = 0;
    students.forEach((k) =>
      MSF.slice(0, CM + 1).forEach((m) => {
        if (gs(payments, k.legajo, m) === 'ok') c++;
      })
    );
    return c;
  }, [payments, students]);

  const totalDue = students.length * (CM + 1);

  const debtTotal = useMemo(() => {
    let v = 0;
    students.forEach((k) =>
      MSF.slice(0, CM + 1).forEach((m) => {
        if (gs(payments, k.legajo, m) === 'no') v += getCuota(k);
      })
    );
    return v;
  }, [payments, students, rates]);

  const penTotal = useMemo(() => {
    let v = 0;
    students.forEach((k) =>
      MSF.slice(0, CM + 1).forEach((m) => {
        if (gs(payments, k.legajo, m) === 'pen') v += getCuota(k);
      })
    );
    return v;
  }, [payments, students, rates]);

  const sKL = Object.keys(selK)
    .filter((x) => selK[x])
    .map(Number);
  const sML = Object.keys(selM).filter((x) => selM[x]);

  const pTot = sKL.reduce((sum, kid) => {
    const k = students.find((x) => x.legajo === kid);
    return sum + sML.length * (k ? getCuota(k) : 0);
  }, 0);

  const openPay = (preK, preM) => {
    const k = {};
    if (preK) preK.forEach((l) => (k[l] = true));
    else students.forEach((c) => (k[c.legajo] = true));
    setSelK(k);

    const m = {};
    if (preM) m[preM] = true;
    else {
      const firstUnpaid = MSF.slice(0, CM + 1).find((mes) =>
        students.some((s) => gs(payments, s.legajo, mes) === 'no')
      );
      if (firstUnpaid) m[firstUnpaid] = true;
    }
    setSelM(m);

    setStep(1);
    setPay(true);
    setSuccess(false);
    setMpLoad(false);
    setTransfer(false);
  };

  const closePay = () => {
    setPay(false);
    setSuccess(false);
    setMpLoad(false);
    setTransfer(false);
  };

  const doMP = () => {
    setMpLoad(true);
    setTimeout(async () => {
      for (const mo of sML) {
        const amt = sKL.reduce((sum, kid) => {
          const k = students.find((x) => x.legajo === kid);
          return sum + (k ? getCuota(k) : 0);
        }, 0);

        await onPay({
          studentIds: sKL,
          mes: mo,
          monto: amt,
          metodo: 'MercadoPago',
          estado: 'verificado',
        });
      }

      setNotifs((prev) => [
        {
          id: 'N' + Date.now(),
          t: 'Pago acreditado',
          m: 'Pago por MercadoPago procesado.',
          tm: 'Ahora',
          r: false,
        },
        ...prev,
      ]);
      setMpLoad(false);
      setSuccess(true);
    }, 2200);
  };

  const confirmTR = async () => {
    for (const mo of sML) {
      const amt = sKL.reduce((sum, kid) => {
        const k = students.find((x) => x.legajo === kid);
        return sum + (k ? getCuota(k) : 0);
      }, 0);

      await onPay({
        studentIds: sKL,
        mes: mo,
        monto: amt,
        metodo: 'Transferencia',
        estado: 'pendiente',
      });
    }

    setNotifs((prev) => [
      {
        id: 'N' + Date.now(),
        t: 'Pago registrado',
        m: 'Transferencia pendiente de verificación.',
        tm: 'Ahora',
        r: false,
      },
      ...prev,
    ]);
    setTransfer(false);
    setSuccess(true);
  };

  const cp = (t) => {
    navigator.clipboard && navigator.clipboard.writeText(t);
    tt('Copiado al portapapeles');
  };

  const avM = MSF.slice(0, CM + 1).filter((m) =>
    students.some((s) => gs(payments, s.legajo, m) !== 'ok')
  );

  const Hdr = () => (
    <div
      style={{
        background: 'linear-gradient(135deg,#166534,#15803D)',
        padding: '16px 18px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 6px 18px rgba(0,0,0,.08)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,.72)',
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}
        >
          Portal de familias
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#fff',
            fontWeight: 700,
            marginTop: 4,
            lineHeight: 1.1,
          }}
        >
          {family?.responsable || 'Cargando...'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => {
            setShowNotif(!showNotif);
            if (!showNotif) {
              setNotifs((prev) => prev.map((n) => ({ ...n, r: true })));
            }
          }}
          style={{
            position: 'relative',
            width: 42,
            height: 42,
            borderRadius: 14,
            background: 'rgba(255,255,255,.14)',
            border: '1px solid rgba(255,255,255,.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <IconBell color="#fff" />
          {unread > 0 && (
            <div
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: '#EF4444',
                color: '#fff',
                minWidth: 18,
                height: 18,
                padding: '0 4px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(239,68,68,.35)',
              }}
            >
              {unread}
            </div>
          )}
        </button>

        <button
          onClick={onLogout}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: 'rgba(255,255,255,.14)',
            border: '1px solid rgba(255,255,255,.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <IconLogout color="#fff" />
        </button>
      </div>
    </div>
  );

  const NotifPanel = () =>
    showNotif ? (
      <div
        onClick={() => setShowNotif(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: 'rgba(15,23,42,.28)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            margin: '68px 12px 0',
            borderRadius: 18,
            maxHeight: '55vh',
            overflow: 'auto',
            border: `1px solid ${UI.border}`,
            boxShadow: UI.shadowLg,
            animation: 'fadeIn .2s ease-out',
          }}
        >
          <div
            style={{
              padding: '16px 16px 10px',
              fontWeight: 700,
              fontSize: 15,
              color: UI.text,
              borderBottom: `1px solid ${UI.borderSoft}`,
            }}
          >
            Notificaciones
          </div>

          {notifs.length === 0 && (
            <div
              style={{
                padding: 22,
                textAlign: 'center',
                color: UI.textMuted,
                fontSize: 13,
              }}
            >
              Sin notificaciones
            </div>
          )}

          {notifs.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${UI.borderSoft}`,
                background: n.r ? '#fff' : UI.brandSoft,
              }}
            >
              <div
                style={{
                  fontWeight: n.r ? 600 : 700,
                  fontSize: 13,
                  color: UI.text,
                }}
              >
                {n.t}
              </div>
              <div style={{ fontSize: 12, color: UI.textSoft, marginTop: 2 }}>
                {n.m}
              </div>
              <div style={{ fontSize: 10, color: UI.textMuted, marginTop: 4 }}>
                {n.tm}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const ChildCard = ({ k }) => {
    const o = exp === k.legajo;
    const issues = getIssues(k.legajo);
    const allOk = issues.length === 0;
    const hasPen = issues.some((x) => x.st === 'pendiente');
    const cuota = getCuota(k);
    const unpaid = MSF.slice(0, CM + 1).filter(
      (m) => gs(payments, k.legajo, m) !== 'ok'
    );
    const paidM = MSF.slice(0, CM + 1).filter(
      (m) => gs(payments, k.legajo, m) === 'ok'
    );
    const sp = showPaid[k.legajo];

    const totalPendAlumno = MSF.slice(0, CM + 1).reduce((acc, mes) => {
      const st = gs(payments, k.legajo, mes);
      return st === 'ok' ? acc : acc + cuota;
    }, 0);

    return (
      <SurfaceCard
        style={{
          marginBottom: 10,
          overflow: 'hidden',
        }}
      >
        <div
          onClick={() => setExp(o ? null : k.legajo)}
          style={{
            padding: '15px 16px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: allOk
                ? UI.brandSoft
                : hasPen
                ? UI.warningSoft
                : UI.dangerSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: allOk
                ? UI.success
                : hasPen
                ? UI.warning
                : UI.danger,
              flexShrink: 0,
            }}
          >
            {k.nombre[0]}
            {k.apellido[0]}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: UI.text,
                lineHeight: 1.2,
              }}
            >
              {k.nombre} {k.apellido}
            </div>

            <div
              style={{
                fontSize: 12,
                color: UI.textMuted,
                marginTop: 3,
              }}
            >
              {k.nivel} · {k.curso} · {fm(cuota)}/mes
            </div>

            {allOk ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 8,
                  padding: '4px 9px',
                  borderRadius: 999,
                  background: UI.successSoft,
                  color: UI.success,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Al día
              </div>
            ) : (
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <Badge s={hasPen ? 'pen' : 'no'} />
                <div
                  style={{
                    fontSize: 11,
                    color: UI.textSoft,
                    fontWeight: 600,
                  }}
                >
                  Pendiente: {fm(totalPendAlumno)}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              color: UI.textMuted,
              fontSize: 16,
              transform: o ? 'rotate(180deg)' : 'none',
              transition: '.2s',
              flexShrink: 0,
            }}
          >
            ▾
          </div>
        </div>

        {o && (
          <div
            style={{
              padding: '0 16px 16px',
              borderTop: `1px solid ${UI.borderSoft}`,
              animation: 'fadeIn .15s ease-out',
              background: '#FCFDFC',
            }}
          >
            {unpaid.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: UI.textMuted,
                    padding: '14px 0 8px',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Requiere atención
                </div>

                {unpaid.map((m) => {
                  const st = gs(payments, k.legajo, m);
                  const isNo = st === 'no';

                  return (
                    <div
                      key={m}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '11px 12px',
                        marginBottom: 6,
                        borderRadius: 14,
                        background: isNo ? UI.dangerSoft : UI.warningSoft,
                        border: `1px solid ${
                          isNo ? UI.dangerBorder : UI.warningBorder
                        }`,
                        gap: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: UI.text,
                            fontWeight: 700,
                          }}
                        >
                          {m}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: UI.textMuted,
                            marginTop: 2,
                          }}
                        >
                          {fm(cuota)}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          flexWrap: 'wrap',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Badge s={st} />
                        {st === 'no' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPay([k.legajo], m);
                            }}
                            style={{
                              fontSize: 12,
                              color: '#fff',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background:
                                'linear-gradient(135deg,#166534,#15803D)',
                              padding: '8px 12px',
                              borderRadius: 10,
                              border: 'none',
                              boxShadow: '0 8px 18px rgba(22,101,52,.16)',
                            }}
                          >
                            Pagar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {paidM.length > 0 && (
              <div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPaid({ ...showPaid, [k.legajo]: !sp });
                  }}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: UI.success,
                    padding: '12px 0 8px',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    cursor: 'pointer',
                  }}
                >
                  Pagadas ({paidM.length}) {sp ? '▴' : '▾'}
                </div>

                {sp &&
                  paidM.map((m) => {
                    const payInfo = payments.find(
                      (p) =>
                        p.studentIds.includes(k.legajo) &&
                        p.mes === m &&
                        p.estado === 'verificado'
                    );

                    return (
                      <div
                        key={m}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 0',
                          borderBottom: `1px solid ${UI.borderSoft}`,
                          gap: 10,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              color: UI.text,
                              fontWeight: 600,
                            }}
                          >
                            {m} — {fm(cuota)}
                          </div>
                          {payInfo && (
                            <div
                              style={{
                                fontSize: 11,
                                color: UI.textMuted,
                                marginTop: 2,
                              }}
                            >
                              {payInfo.metodo} · {payInfo.fecha}
                            </div>
                          )}
                        </div>
                        <Badge s="ok" />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </SurfaceCard>
    );
  };

  const HomeSc = () => (
    <div style={{ paddingBottom: 118 }}>
      <div
        style={{
          padding: '16px 16px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 10,
        }}
      >
        {[
          { l: 'Alumnos', v: students.length, c: UI.brand },
          {
            l: 'Al día',
            v: `${paidC}/${totalDue}`,
            c: paidC === totalDue ? UI.success : UI.warning,
          },
          { l: 'Vence', v: '10 Abr', c: UI.danger },
        ].map((c, i) => (
          <SurfaceCard
            key={i}
            style={{
              padding: '14px 14px',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: UI.textMuted,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
              }}
            >
              {c.l}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: c.c,
                marginTop: 8,
                lineHeight: 1,
              }}
            >
              {c.v}
            </div>
          </SurfaceCard>
        ))}
      </div>

      <div
        style={{
          margin: '14px 16px 0',
          padding: '14px 14px',
          borderRadius: 16,
          background: '#F5F9FF',
          border: `1px solid #D9E8FF`,
          boxShadow: UI.shadowSm,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: UI.info,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 14,
            color: '#fff',
            fontWeight: 800,
            boxShadow: '0 8px 18px rgba(37,99,235,.18)',
          }}
        >
          i
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#1E40AF',
            }}
          >
            Comunicado
          </div>
          <div
            style={{
              fontSize: 13,
              color: UI.info,
              marginTop: 3,
              lineHeight: 1.35,
            }}
          >
            Las cuotas de Abril vencen el 10/04.
          </div>
        </div>
      </div>

      {debtTotal > 0 || penTotal > 0 ? (
        <div
          onClick={() => openPay(null, null)}
          style={{
            margin: '14px 16px 0',
            padding: '15px 16px',
            borderRadius: 16,
            background: UI.dangerSoft,
            border: `1px solid ${UI.dangerBorder}`,
            cursor: 'pointer',
            boxShadow: UI.shadowSm,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: 0,
              }}
            >
              <IconAlert color={UI.danger} />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: UI.danger,
                }}
              >
                Saldo a pagar: {fm(debtTotal + penTotal)}
              </span>
            </div>
            <span style={{ color: UI.danger, fontSize: 18, fontWeight: 700 }}>
              ›
            </span>
          </div>

          {students.map((kid) => {
            const iss = getIssues(kid.legajo);
            if (iss.length === 0) return null;

            return (
              <div
                key={kid.legajo}
                style={{
                  fontSize: 12,
                  color: UI.textSoft,
                  marginTop: 4,
                  lineHeight: 1.35,
                }}
              >
                <span style={{ fontWeight: 700, color: UI.text }}>
                  {kid.nombre}:{' '}
                </span>
                {iss.map((is, i) => (
                  <span
                    key={i}
                    style={{
                      color: is.st === 'impaga' ? UI.danger : UI.warning,
                      fontWeight: 600,
                    }}
                  >
                    {is.m}
                    {i < iss.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            margin: '14px 16px 0',
            padding: '14px 16px',
            borderRadius: 16,
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: UI.shadowSm,
          }}
        >
          <IconCheck size={18} color={UI.success} />
          <span
            style={{
              fontWeight: 700,
              color: UI.success,
              fontSize: 13,
            }}
          >
            Todas las cuotas al día
          </span>
        </div>
      )}

      <div style={{ padding: '20px 16px 10px' }}>
        <SectionTitle style={{ marginBottom: 10 }}>Alumnos</SectionTitle>
        {students.map((k) => (
          <ChildCard key={k.legajo} k={k} />
        ))}
      </div>

      <div
        style={{
          position: 'fixed',
          left: 16,
          right: 16,
          bottom: 78,
          zIndex: 25,
        }}
      >
        <button
          onClick={() => openPay(null, null)}
          style={{
            width: '100%',
            padding: '16px 18px',
            background: 'linear-gradient(135deg,#166534,#15803D)',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 14px 28px rgba(22,101,52,.22)',
          }}
        >
          <IconPay color="#fff" />
          Pagar cuotas
        </button>
      </div>
    </div>
  );

  const PayMod = () => {
    if (!pay) return null;

    if (success) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,.4)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 22,
              padding: '30px 24px',
              width: '100%',
              maxWidth: 390,
              textAlign: 'center',
              animation: 'popIn .25s ease-out',
              boxShadow: UI.shadowLg,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 999,
                background: UI.successSoft,
                border: `1px solid ${UI.successBorder}`,
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck size={30} color={UI.success} />
            </div>

            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: UI.text,
              }}
            >
              Pago registrado
            </div>

            <p
              style={{
                fontSize: 13,
                color: UI.textSoft,
                marginTop: 8,
                lineHeight: 1.45,
              }}
            >
              Tu pago por {fm(pTot)} está siendo procesado.
            </p>

            <button
              onClick={closePay}
              style={{
                width: '100%',
                marginTop: 22,
                padding: 14,
                background: 'linear-gradient(135deg,#166534,#15803D)',
                color: '#fff',
                borderRadius: 14,
                border: 'none',
                fontWeight: 800,
                boxShadow: '0 10px 20px rgba(22,101,52,.18)',
                cursor: 'pointer',
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      );
    }

    if (mpLoad) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0284c7',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid rgba(255,255,255,.28)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spinMP .7s linear infinite',
              marginBottom: 18,
            }}
          />
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            Procesando con MercadoPago...
          </div>
        </div>
      );
    }

    if (transfer) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '24px 24px 0 0',
              width: '100%',
              maxWidth: 480,
              padding: '18px 20px 30px',
              animation: 'slideUp .25s ease-out',
              boxShadow: '0 -10px 30px rgba(0,0,0,.12)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 4,
                borderRadius: 999,
                background: '#D1D5DB',
                margin: '0 auto 14px',
              }}
            />

            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 14,
                color: UI.text,
              }}
            >
              Datos para transferencia
            </div>

            <div
              style={{
                background: UI.warningSoft,
                padding: 12,
                borderRadius: 14,
                fontSize: 12,
                color: UI.warning,
                marginBottom: 16,
                display: 'flex',
                gap: 8,
                border: `1px solid ${UI.warningBorder}`,
                lineHeight: 1.4,
              }}
            >
              <IconAlert color={UI.warning} />
              <span>Transferir exactamente {fm(pTot)}</span>
            </div>

            {[
              ['CBU', '2850590940090418135201'],
              ['Alias', 'colegio.almafuerte.pagos'],
              ['Monto', fm(pTot)],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: `1px solid ${UI.borderSoft}`,
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: UI.textMuted }}>{l}</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: UI.text,
                      marginTop: 3,
                      wordBreak: 'break-word',
                    }}
                  >
                    {v}
                  </div>
                </div>

                <button
                  onClick={() => cp(v)}
                  style={{
                    padding: '8px 12px',
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    color: UI.textSoft,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Copiar
                </button>
              </div>
            ))}

            <button
              onClick={confirmTR}
              style={{
                width: '100%',
                marginTop: 22,
                padding: 15,
                background: 'linear-gradient(135deg,#166534,#15803D)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                fontWeight: 800,
                boxShadow: '0 10px 20px rgba(22,101,52,.18)',
                cursor: 'pointer',
              }}
            >
              Ya realicé el pago
            </button>

            <button
              onClick={() => setTransfer(false)}
              style={{
                width: '100%',
                marginTop: 10,
                padding: 10,
                background: 'none',
                border: 'none',
                color: UI.textMuted,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Volver
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,.38)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '24px 24px 0 0',
            width: '100%',
            maxWidth: 480,
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '18px 20px 30px',
            animation: 'slideUp .25s ease-out',
            boxShadow: '0 -10px 30px rgba(0,0,0,.12)',
          }}
        >
          <div
            style={{
              width: 34,
              height: 4,
              borderRadius: 999,
              background: '#D1D5DB',
              margin: '0 auto 14px',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: UI.text,
                }}
              >
                Pagar cuotas
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: UI.textMuted,
                  marginTop: 3,
                }}
              >
                Seleccioná alumnos y meses a abonar
              </div>
            </div>

            <button
              onClick={closePay}
              style={{
                background: '#F3F4F6',
                border: 'none',
                width: 34,
                height: 34,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <IconX color={UI.textMuted} />
            </button>
          </div>

          {step === 1 ? (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: UI.textMuted,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                1. Seleccionar alumnos
              </div>

              {students.map((k) => (
                <label
                  key={k.legajo}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    background: selK[k.legajo] ? '#F0FDF4' : '#FCFCFD',
                    borderRadius: 14,
                    marginBottom: 8,
                    border: selK[k.legajo]
                      ? '1.5px solid #16A34A'
                      : '1px solid #EAECF0',
                    boxShadow: selK[k.legajo]
                      ? '0 0 0 3px rgba(34,197,94,.08)'
                      : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!selK[k.legajo]}
                    onChange={(e) =>
                      setSelK({ ...selK, [k.legajo]: e.target.checked })
                    }
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: UI.text,
                      }}
                    >
                      {k.nombre}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: UI.textMuted,
                        marginTop: 3,
                      }}
                    >
                      {fm(getCuota(k))}
                    </div>
                  </div>
                </label>
              ))}

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: UI.textMuted,
                  marginTop: 18,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                2. Seleccionar meses
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {avM.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelM({ ...selM, [m]: !selM[m] })}
                    style={{
                      padding: '10px 13px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      border: `1.5px solid ${selM[m] ? UI.brand : UI.border}`,
                      background: selM[m] ? UI.brand : '#fff',
                      color: selM[m] ? '#fff' : UI.textSoft,
                      cursor: 'pointer',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                disabled={!sKL.length || !sML.length}
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  marginTop: 22,
                  padding: '16px 18px',
                  background:
                    sKL.length && sML.length
                      ? 'linear-gradient(135deg,#166534,#15803D)'
                      : '#E5E7EB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow:
                    sKL.length && sML.length
                      ? '0 10px 20px rgba(22,101,52,.18)'
                      : 'none',
                  cursor: sKL.length && sML.length ? 'pointer' : 'not-allowed',
                }}
              >
                Continuar {pTot > 0 && ` — ${fm(pTot)}`}
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  background: '#F8FAFC',
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 16,
                  border: `1px solid ${UI.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: UI.textMuted,
                    marginBottom: 10,
                    fontWeight: 700,
                  }}
                >
                  Resumen del pago
                </div>

                {sKL.map((l) => {
                  const k = students.find((x) => x.legajo === l);
                  return sML.map((m) => (
                    <div
                      key={l + m}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 13,
                        marginBottom: 7,
                        gap: 10,
                      }}
                    >
                      <span style={{ color: UI.textSoft }}>
                        {k?.nombre} - {m}
                      </span>
                      <span style={{ fontWeight: 700, color: UI.text }}>
                        {fm(getCuota(k))}
                      </span>
                    </div>
                  ));
                })}

                <div
                  style={{
                    borderTop: `1px solid ${UI.border}`,
                    marginTop: 12,
                    paddingTop: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: 17,
                    color: UI.text,
                  }}
                >
                  <span>Total</span>
                  <span>{fm(pTot)}</span>
                </div>
              </div>

              <button
                onClick={doMP}
                style={{
                  width: '100%',
                  padding: 15,
                  background: '#009EE3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 800,
                  marginBottom: 10,
                  boxShadow: '0 10px 18px rgba(0,158,227,.2)',
                  cursor: 'pointer',
                }}
              >
                Pagar con MercadoPago
              </button>

              <button
                onClick={() => setTransfer(true)}
                style={{
                  width: '100%',
                  padding: 15,
                  background: '#fff',
                  border: `1.5px solid ${UI.border}`,
                  borderRadius: 14,
                  fontWeight: 700,
                  color: UI.textSoft,
                  cursor: 'pointer',
                }}
              >
                Pagar con Transferencia
              </button>

              <button
                onClick={() => setStep(1)}
                style={{
                  width: '100%',
                  marginTop: 12,
                  background: 'none',
                  border: 'none',
                  color: UI.textMuted,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ← Volver a selección
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const HistSc = () => {
    const studentIds = students.map((s) => s.legajo);
    const myP = [...payments]
      .filter((p) => p.studentIds.some((id) => studentIds.includes(id)))
      .reverse();

    return (
      <div style={{ padding: 16, paddingBottom: 96 }}>
        <SectionTitle>Historial</SectionTitle>

        {myP.map((p) => {
          const ks = p.studentIds
            .map((l) => students.find((s) => s.legajo === l))
            .filter(Boolean);
          const o = expP === p.id;

          return (
            <SurfaceCard
              key={p.id}
              style={{
                marginBottom: 8,
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setExpP(o ? null : p.id)}
                style={{
                  padding: '14px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: UI.text,
                    }}
                  >
                    {p.mes} — {ks.map((k) => k.nombre).join(', ')}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: UI.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {p.fecha}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: UI.text,
                      marginBottom: 6,
                    }}
                  >
                    {fm(p.monto)}
                  </div>
                  <Badge s={p.estado === 'verificado' ? 'ok' : 'pen'} />
                </div>
              </div>

              {o && (
                <div
                  style={{
                    padding: 14,
                    borderTop: `1px solid ${UI.borderSoft}`,
                    background: '#F9FBFA',
                    fontSize: 12,
                    color: UI.textSoft,
                  }}
                >
                  <div>
                    <b style={{ color: UI.text }}>Método:</b> {p.metodo}
                  </div>
                  <button
                    onClick={() => tt('Descargando...')}
                    style={{
                      width: '100%',
                      marginTop: 12,
                      padding: 10,
                      background: 'linear-gradient(135deg,#166534,#15803D)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Descargar comprobante
                  </button>
                </div>
              )}
            </SurfaceCard>
          );
        })}
      </div>
    );
  };

  const RecSc = () => {
    const studentIds = students.map((s) => s.legajo);
    const myP = [...payments]
      .filter((p) => p.studentIds.some((id) => studentIds.includes(id)))
      .reverse();

    return (
      <div style={{ padding: 16, paddingBottom: 96 }}>
        <SectionTitle>Comprobantes</SectionTitle>

        {myP.map((p) => {
          const ks = p.studentIds
            .map((l) => students.find((s) => s.legajo === l))
            .filter(Boolean);

          return (
            <SurfaceCard
              key={p.id}
              style={{
                marginBottom: 8,
                padding: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: UI.text,
                  }}
                >
                  {p.mes}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: UI.textMuted,
                    marginTop: 4,
                  }}
                >
                  {ks.map((k) => k.nombre).join(', ')} · {fm(p.monto)}
                </div>
              </div>

              <button
                onClick={() => tt('Descargado')}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: UI.brandSoft,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconDown color={UI.success} />
              </button>
            </SurfaceCard>
          );
        })}
      </div>
    );
  };

  const MoreSc = () => (
    <div style={{ padding: 16, paddingBottom: 96 }}>
      <SectionTitle>Información</SectionTitle>

      <SurfaceCard
        style={{
          padding: 16,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 10,
            color: UI.text,
          }}
        >
          Datos bancarios
        </div>

        {[
          ['CBU', '2850590940090418135201'],
          ['Alias', 'colegio.almafuerte.pagos'],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: `1px solid ${UI.borderSoft}`,
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: UI.textMuted }}>{l}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: UI.text,
                  marginTop: 3,
                  wordBreak: 'break-word',
                }}
              >
                {v}
              </div>
            </div>

            <button
              onClick={() => cp(v)}
              style={{
                padding: '8px 12px',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: UI.textSoft,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Copiar
            </button>
          </div>
        ))}
      </SurfaceCard>

      <button
        onClick={onLogout}
        style={{
          width: '100%',
          padding: 14,
          background: '#fff',
          border: `1px solid ${UI.dangerBorder}`,
          borderRadius: 16,
          color: UI.danger,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: UI.shadowSm,
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );

  const navBtn = (key, label, Icon) => {
    const active = scr === key;

    return (
      <button
        onClick={() => setScr(key)}
        style={{
          background: 'none',
          border: 'none',
          color: active ? UI.brand : UI.textMuted,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          minWidth: 62,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background: active ? UI.brandSoft : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon color="currentColor" />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
      </button>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: UI.bg,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        paddingBottom: 20,
      }}
    >
      <style>{cssAll}</style>

      <Hdr />
      <NotifPanel />

      {scr === 'home' && <HomeSc />}
      {scr === 'hist' && <HistSc />}
      {scr === 'rec' && <RecSc />}
      {scr === 'more' && <MoreSc />}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          background: 'rgba(255,255,255,.92)',
          backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${UI.border}`,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 80,
          boxShadow: '0 -6px 18px rgba(16,24,40,.04)',
        }}
      >
        {navBtn('home', 'Inicio', IconHome)}
        {navBtn('hist', 'Historial', IconHist)}
        {navBtn('rec', 'Recibos', IconDown)}
        {navBtn('more', 'Más', IconMore)}
      </div>

      <PayMod />

      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 86,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            zIndex: 200,
            boxShadow: UI.shadowMd,
            animation: toastOut
              ? 'fadeOut 0.4s forwards'
              : 'fadeIn 0.4s ease-out',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}