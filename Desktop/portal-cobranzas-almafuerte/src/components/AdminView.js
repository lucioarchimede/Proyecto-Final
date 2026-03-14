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
const MS = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
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

  violet: '#7C3AED',
  violetSoft: '#F5F3FF',
  violetBorder: '#DDD6FE',

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
  from { transform:scale(.96); opacity:0; }
  to { transform:scale(1); opacity:1; }
}
* { box-sizing: border-box; }
button { transition: all .18s ease; }
input, button, select, textarea { font: inherit; }
html, body { margin: 0; padding: 0; }
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

const SectionTitle = ({ children, right, style = {} }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
      ...style,
    }}
  >
    <div
      style={{
        fontWeight: 800,
        fontSize: 18,
        color: UI.text,
      }}
    >
      {children}
    </div>
    {right}
  </div>
);

const getBadgeStyles = (s) => {
  const map = {
    ok: {
      bg: UI.successSoft,
      c: UI.success,
      b: UI.successBorder,
      l: 'Verificado',
    },
    pen: {
      bg: UI.warningSoft,
      c: UI.warning,
      b: UI.warningBorder,
      l: 'Pendiente',
    },
    rej: {
      bg: UI.dangerSoft,
      c: UI.danger,
      b: UI.dangerBorder,
      l: 'Rechazado',
    },
    no: {
      bg: '#F3F4F6',
      c: '#6B7280',
      b: '#E5E7EB',
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
        whiteSpace: 'nowrap',
      }}
    >
      {v.l}
    </span>
  );
};

const IconBack = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconDash = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="4" rx="2" />
    <rect x="14" y="10" width="7" height="11" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
  </svg>
);

const IconMoney = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const IconUsers = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSettings = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2.4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.35.54.89.89 1.51 1H21a2 2 0 1 1 0 4h-.09c-.62.11-1.16.46-1.51 1z" />
  </svg>
);

const IconPlus = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconChevron = ({ color, open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '.2s', flexShrink: 0 }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function AdminView({
  allStudents,
  rates,
  payments,
  onBack,
  onUpdatePayment,
  onAddPayment,
  onUpdateRate,
  onUpdateStudent,
}) {
  const [scr, setScr] = useState('dash');
  const [srch, setSrch] = useState('');
  const [pf, setPf] = useState('all');
  const [expP, setExpP] = useState(null);
  const [expS, setExpS] = useState(null);
  const [addP, setAddP] = useState(false);
  const [debtM, setDebtM] = useState(false);
  const [editKid, setEditKid] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastOut, setToastOut] = useState(false);

  const [np, setNp] = useState({
    k: '',
    mo: 'Abril',
    a: '',
    mt: 'MercadoPago',
    ref: '',
    obs: '',
    st: 'verificado',
  });

  const tt = useCallback((m) => {
    setToast(m);
    setToastOut(false);
    setTimeout(() => setToastOut(true), 2000);
    setTimeout(() => {
      setToast(null);
      setToastOut(false);
    }, 2400);
  }, []);

  const getCuota = (s) => Math.round((rates[s.nivel] || 0) * (1 - (s.beca || 0)));

  const debt = useMemo(() => {
    let v = 0;
    allStudents.forEach((k) =>
      MSF.slice(0, CM + 1).forEach((m) => {
        if (gs(payments, k.legajo, m) === 'no') v += getCuota(k);
      })
    );
    return v;
  }, [payments, allStudents, rates]);

  const debtors = useMemo(() => {
    const l = [];
    allStudents.forEach((k) => {
      const u = [];
      MSF.slice(0, CM + 1).forEach((m) => {
        if (gs(payments, k.legajo, m) === 'no') u.push(m);
      });
      if (u.length > 0) l.push({ ...k, um: u, da: u.length * getCuota(k) });
    });
    return l.sort((a, b) => b.da - a.da);
  }, [payments, allStudents, rates]);

  const fPays = useMemo(
    () =>
      payments.filter((p) => {
        if (pf !== 'all' && p.estado !== pf) return false;
        if (srch) {
          const q = srch.toLowerCase();
          const ks = p.studentIds.map((l) => allStudents.find((k) => k.legajo === l)).filter(Boolean);
          if (
            !ks.some((k) => (k.nombre + ' ' + k.apellido).toLowerCase().includes(q)) &&
            !p.studentIds.some((l) => String(l).includes(q)) &&
            !(p.referencia || '').toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      }),
    [payments, pf, srch, allStudents]
  );

  const monthlyRev = MSF.slice(0, CM + 1).map((m) => ({
    m,
    ok: payments
      .filter((p) => p.mes === m && p.estado === 'verificado')
      .reduce((a, p) => a + p.monto, 0),
    pen: payments
      .filter((p) => p.mes === m && p.estado === 'pendiente')
      .reduce((a, p) => a + p.monto, 0),
  }));

  const totalVerified = payments
    .filter((p) => p.estado === 'verificado')
    .reduce((a, p) => a + p.monto, 0);

  const totalPending = payments
    .filter((p) => p.estado === 'pendiente')
    .reduce((a, p) => a + p.monto, 0);

  const filteredStudents = srch
    ? allStudents.filter((k) =>
        (k.nombre + ' ' + k.apellido + ' ' + k.legajo + ' ' + k.nivel)
          .toLowerCase()
          .includes(srch.toLowerCase())
      )
    : allStudents;

  const YearGrid = ({ kid }) => (
    <div style={{ display: 'flex', gap: 4, marginTop: 8, marginBottom: 10 }}>
      {MS.map((m, i) => {
        const fut = i > CM;
        const st = fut ? 'fut' : gs(payments, kid, MSF[i]);
        const c = { ok: UI.success, pen: UI.warning, no: UI.danger, fut: '#94A3B8' };

        return (
          <div
            key={m}
            title={MSF[i]}
            style={{
              flex: 1,
              height: 26,
              borderRadius: 8,
              background: fut
                ? '#F8FAFC'
                : st === 'ok'
                ? UI.successSoft
                : st === 'pen'
                ? UI.warningSoft
                : UI.dangerSoft,
              border: `1px solid ${
                fut
                  ? '#E2E8F0'
                  : st === 'ok'
                  ? UI.successBorder
                  : st === 'pen'
                  ? UI.warningBorder
                  : UI.dangerBorder
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 700,
              color: c[st] || UI.textMuted,
            }}
          >
            {m}
          </div>
        );
      })}
    </div>
  );

  const Hdr = () => (
    <div
      style={{
        background: 'linear-gradient(135deg,#166534,#15803D)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 6px 18px rgba(0,0,0,.08)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          padding: '16px 20px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            Colegio Almafuerte
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#fff',
              fontWeight: 800,
              marginTop: 4,
              lineHeight: 1.1,
            }}
          >
            Administración
          </div>
        </div>

        <button
          onClick={onBack}
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
          <IconBack color="#fff" />
        </button>
      </div>
    </div>
  );

  const StatCard = ({ label, value, color, soft }) => (
    <SurfaceCard
      style={{
        padding: '15px 16px',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: UI.textMuted,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {soft && (
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: soft,
            marginTop: 12,
          }}
        />
      )}
    </SurfaceCard>
  );

  const PrimaryBtn = ({ children, onClick, style = {}, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '14px 16px',
        background: disabled ? '#E5E7EB' : 'linear-gradient(135deg,#166534,#15803D)',
        color: '#fff',
        border: 'none',
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 10px 20px rgba(22,101,52,.18)',
        ...style,
      }}
    >
      {children}
    </button>
  );

  const Input = ({ value, onChange, placeholder, type = 'text', style = {} }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      style={{
        width: '100%',
        padding: '11px 14px',
        borderRadius: 12,
        border: `1px solid ${UI.border}`,
        fontSize: 13,
        outline: 'none',
        background: '#fff',
        color: UI.text,
        ...style,
      }}
    />
  );

  const Select = ({ value, onChange, children, style = {} }) => (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '11px 14px',
        borderRadius: 12,
        border: `1px solid ${UI.border}`,
        fontSize: 13,
        background: '#fff',
        color: UI.text,
        ...style,
      }}
    >
      {children}
    </select>
  );

  const pageGridStyle =
    scr === 'dash'
      ? {
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.25fr) minmax(320px,.9fr)',
          gap: 16,
          alignItems: 'start',
        }
      : { display: 'block' };

  const DashSc = () => (
    <div style={pageGridStyle}>
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <StatCard
            label="Recaudado"
            value={fm(totalVerified)}
            color={UI.success}
            soft={UI.successSoft}
          />
          <StatCard
            label="Pendiente"
            value={fm(totalPending)}
            color={UI.warning}
            soft={UI.warningSoft}
          />
          <StatCard
            label="Con deuda"
            value={`${debtors.length}/${allStudents.length}`}
            color={UI.danger}
            soft={UI.dangerSoft}
          />
          <StatCard
            label="Deuda total"
            value={fm(debt)}
            color={UI.violet}
            soft={UI.violetSoft}
          />
        </div>

        <SurfaceCard
          style={{
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 15,
              color: UI.text,
              marginBottom: 12,
            }}
          >
            Recaudación por mes
          </div>

          {monthlyRev.map((mr, idx) => (
            <div
              key={mr.m}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: idx < monthlyRev.length - 1 ? `1px solid ${UI.borderSoft}` : 'none',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: UI.text,
                }}
              >
                {mr.m}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                {mr.pen > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: UI.warning,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 999,
                      background: UI.warningSoft,
                      border: `1px solid ${UI.warningBorder}`,
                    }}
                  >
                    {fm(mr.pen)} pend.
                  </span>
                )}

                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: mr.ok > 0 ? UI.success : UI.textMuted,
                  }}
                >
                  {mr.ok > 0 ? fm(mr.ok) : '—'}
                </span>
              </div>
            </div>
          ))}
        </SurfaceCard>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => setAddP(true)}
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg,#166534,#15803D)',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(22,101,52,.18)',
            }}
          >
            + Registrar pago
          </button>

          <button
            onClick={() => setDebtM(true)}
            style={{
              padding: '14px 16px',
              background: '#fff',
              border: `1px solid ${UI.dangerBorder}`,
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 800,
              color: UI.danger,
              cursor: 'pointer',
            }}
          >
            Deudores
          </button>
        </div>
      </div>

      <div>
        <SectionTitle
          right={
            <button
              onClick={() => {
                setScr('pays');
                setSrch('');
                setExpP(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                fontWeight: 800,
                color: UI.success,
                cursor: 'pointer',
              }}
            >
              Ver todos
            </button>
          }
        >
          Últimos pagos
        </SectionTitle>

        {[...payments]
          .slice(0, 6)
          .map((p) => {
            const ks = p.studentIds.map((l) => allStudents.find((k) => k.legajo === l)).filter(Boolean);
            return (
              <SurfaceCard
                key={p.id}
                style={{
                  padding: '13px 14px',
                  marginBottom: 8,
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
                      fontSize: 13,
                      color: UI.text,
                    }}
                  >
                    {ks.map((k) => k.apellido + ' ' + k.nombre).join(', ')}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: UI.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {p.mes} · {p.fecha} · {p.metodo}
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
                  <Badge s={p.estado === 'verificado' ? 'ok' : p.estado === 'pendiente' ? 'pen' : 'rej'} />
                </div>
              </SurfaceCard>
            );
          })}
      </div>
    </div>
  );

  const PaySc = () => (
    <div>
      <SectionTitle
        right={
          <button
            onClick={() => setAddP(true)}
            style={{
              padding: '10px 14px',
              background: UI.brand,
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IconPlus color="#fff" /> Nuevo
          </button>
        }
      >
        Pagos
      </SectionTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <Input
          value={srch}
          onChange={(e) => setSrch(e.target.value)}
          placeholder="Buscar alumno o referencia..."
        />

        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {[
            ['all', 'Todos'],
            ['verificado', 'Verificados'],
            ['pendiente', 'Pendientes'],
            ['rechazado', 'Rechazados'],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setPf(k)}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: 'none',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: pf === k ? UI.brand : '#fff',
                color: pf === k ? '#fff' : UI.textSoft,
                boxShadow: pf === k ? '0 8px 16px rgba(22,101,52,.14)' : UI.shadowSm,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {fPays.length === 0 ? (
        <SurfaceCard
          style={{
            textAlign: 'center',
            padding: 30,
            color: UI.textMuted,
            fontSize: 13,
          }}
        >
          Sin resultados
        </SurfaceCard>
      ) : (
        fPays.map((p) => {
          const ks = p.studentIds.map((l) => allStudents.find((k) => k.legajo === l)).filter(Boolean);
          const o = expP === p.id;
          const st = p.estado === 'verificado' ? 'ok' : p.estado === 'pendiente' ? 'pen' : 'rej';

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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: UI.text,
                    }}
                  >
                    {ks.map((k) => k.apellido + ' ' + k.nombre).join(', ')}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: UI.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {p.mes} · {p.fecha} · {p.metodo}
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
                  <Badge s={st} />
                </div>

                <IconChevron color={UI.textMuted} open={o} />
              </div>

              {o && (
                <div
                  style={{
                    padding: '0 15px 15px',
                    borderTop: `1px solid ${UI.borderSoft}`,
                    background: '#FCFDFC',
                    animation: 'fadeIn .15s ease-out',
                  }}
                >
                  {p.observaciones && (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 12,
                        color: UI.warning,
                        background: UI.warningSoft,
                        border: `1px solid ${UI.warningBorder}`,
                        padding: '10px 12px',
                        borderRadius: 12,
                      }}
                    >
                      {p.observaciones}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    {p.estado === 'pendiente' && (
                      <>
                        <button
                          onClick={() => {
                            onUpdatePayment(p.id, 'verificado');
                            tt('Verificado');
                          }}
                          style={{
                            padding: 11,
                            background: UI.success,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ✓ Verificar
                        </button>

                        <button
                          onClick={() => {
                            onUpdatePayment(p.id, 'rechazado');
                            tt('Rechazado');
                          }}
                          style={{
                            padding: 11,
                            background: UI.danger,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ✗ Rechazar
                        </button>
                      </>
                    )}

                    {p.estado === 'verificado' && (
                      <button
                        onClick={() => {
                          onUpdatePayment(p.id, 'pendiente');
                          tt('Revertido');
                        }}
                        style={{
                          padding: 11,
                          background: '#FAFBFC',
                          color: UI.textSoft,
                          border: `1px solid ${UI.border}`,
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Revertir
                      </button>
                    )}

                    {p.estado === 'rechazado' && (
                      <button
                        onClick={() => {
                          onUpdatePayment(p.id, 'pendiente');
                          tt('Pendiente');
                        }}
                        style={{
                          padding: 11,
                          background: UI.warningSoft,
                          color: UI.warning,
                          border: `1px solid ${UI.warningBorder}`,
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        A pendiente
                      </button>
                    )}
                  </div>
                </div>
              )}
            </SurfaceCard>
          );
        })
      )}
    </div>
  );

  const StuSc = () => (
    <div>
      <SectionTitle>Alumnos ({allStudents.length})</SectionTitle>

      <Input
        value={srch}
        onChange={(e) => setSrch(e.target.value)}
        placeholder="Buscar..."
        style={{ marginBottom: 14 }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 10,
        }}
      >
        {filteredStudents.map((k) => {
          const o = expS === k.legajo;
          const cuota = getCuota(k);
          const un = MSF.slice(0, CM + 1).filter((m) => gs(payments, k.legajo, m) === 'no');
          const ok = un.length === 0;
          const stuPays = payments.filter((p) => p.studentIds.includes(k.legajo));

          return (
            <SurfaceCard
              key={k.legajo}
              style={{
                marginBottom: 0,
                overflow: 'hidden',
                alignSelf: 'start',
              }}
            >
              <div
                onClick={() => setExpS(o ? null : k.legajo)}
                style={{
                  padding: '14px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: ok ? UI.successSoft : UI.dangerSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    color: ok ? UI.success : UI.danger,
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
                      fontSize: 14,
                      color: UI.text,
                    }}
                  >
                    {k.apellido} {k.nombre}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: UI.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {k.nivel} · {k.curso} · {fm(cuota)}/mes
                    {k.beca > 0 ? ` · Beca ${k.beca * 100}%` : ''}
                  </div>
                </div>

                {ok ? (
                  <Badge s="ok" />
                ) : (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: UI.danger,
                      padding: '5px 9px',
                      borderRadius: 999,
                      background: UI.dangerSoft,
                      border: `1px solid ${UI.dangerBorder}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {un.length} debe
                  </div>
                )}

                <IconChevron color={UI.textMuted} open={o} />
              </div>

              {o && (
                <div
                  style={{
                    padding: '0 15px 16px',
                    borderTop: `1px solid ${UI.borderSoft}`,
                    background: '#FCFDFC',
                    animation: 'fadeIn .15s ease-out',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: UI.textSoft,
                      paddingTop: 10,
                      marginBottom: 4,
                    }}
                  >
                    {k.responsable} · {k.email}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: UI.textMuted,
                      marginTop: 10,
                      marginBottom: 3,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Estado anual
                  </div>

                  <YearGrid kid={k.legajo} />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                      marginBottom: 8,
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: UI.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      Pagos ({stuPays.length})
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditKid({ ...k });
                      }}
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: UI.success,
                        cursor: 'pointer',
                        background: UI.successSoft,
                        padding: '7px 12px',
                        borderRadius: 10,
                        border: `1px solid ${UI.successBorder}`,
                      }}
                    >
                      Editar
                    </button>
                  </div>

                  {stuPays.length === 0 ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: UI.textMuted,
                        fontStyle: 'italic',
                        padding: '8px 0',
                      }}
                    >
                      Sin pagos
                    </div>
                  ) : (
                    stuPays.map((p) => (
                      <div
                        key={p.id}
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
                              fontWeight: 700,
                              color: UI.text,
                            }}
                          >
                            {p.mes} · {p.fecha}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: UI.textMuted,
                              marginTop: 3,
                            }}
                          >
                            {p.metodo}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: UI.text,
                              marginBottom: 5,
                            }}
                          >
                            {fm(p.monto)}
                          </div>
                          <Badge s={p.estado === 'verificado' ? 'ok' : p.estado === 'pendiente' ? 'pen' : 'rej'} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </SurfaceCard>
          );
        })}
      </div>
    </div>
  );

  const ConfigSc = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}
    >
      <div>
        <SectionTitle>Configuración</SectionTitle>

        <SurfaceCard
          style={{
            padding: 16,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 15,
              color: UI.text,
              marginBottom: 12,
            }}
          >
            Cuotas por nivel
          </div>

          <div
            style={{
              fontSize: 12,
              color: UI.textMuted,
              marginBottom: 12,
            }}
          >
            Editá el monto y hacé click afuera para aplicar.
          </div>

          {Object.entries(rates).map(([lvl, amt], idx) => (
            <div
              key={lvl}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: idx < Object.entries(rates).length - 1 ? `1px solid ${UI.borderSoft}` : 'none',
                gap: 12,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: UI.text,
                }}
              >
                {lvl}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: UI.textMuted }}>$</span>
                <input
                  type="number"
                  key={'r-' + lvl}
                  defaultValue={amt}
                  onBlur={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    if (v !== amt) {
                      onUpdateRate(lvl, v);
                      tt(lvl + ': ' + fm(v));
                    }
                  }}
                  style={{
                    width: 120,
                    padding: '8px 10px',
                    borderRadius: 12,
                    border: `1px solid ${UI.border}`,
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: 'right',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 12,
              fontSize: 12,
              color: UI.textSoft,
              background: '#FAFBFC',
              padding: '10px 12px',
              borderRadius: 12,
              border: `1px solid ${UI.border}`,
            }}
          >
            Recaudación mensual (sin becas):{' '}
            <span style={{ fontWeight: 800, color: UI.text }}>
              {fm(allStudents.reduce((s, k) => s + (rates[k.nivel] || 0), 0))}
            </span>
          </div>
        </SurfaceCard>
      </div>

      <div>
        <SectionTitle>Resumen</SectionTitle>

        <SurfaceCard
          style={{
            padding: 16,
          }}
        >
          {Object.keys(rates).map((lvl, idx) => {
            const inLvl = allStudents.filter((k) => k.nivel === lvl);
            const rec = inLvl.reduce((s, k) => s + getCuota(k), 0);

            return (
              <div
                key={lvl}
                style={{
                  padding: '10px 0',
                  borderBottom: idx < Object.keys(rates).length - 1 ? `1px solid ${UI.borderSoft}` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: UI.text,
                    }}
                  >
                    {lvl} ({inLvl.length})
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: UI.success,
                    }}
                  >
                    {fm(rec)}/mes
                  </span>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 12,
              marginTop: 4,
              fontWeight: 800,
              fontSize: 15,
              color: UI.text,
            }}
          >
            <span>Total real</span>
            <span style={{ color: UI.success }}>
              {fm(allStudents.reduce((s, k) => s + getCuota(k), 0))}
            </span>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );

  const Overlay = ({ children, onClose }) => (
    <div
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          overflow: 'auto',
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
        {children}
      </div>
    </div>
  );

  const DebtMod = () =>
    debtM ? (
      <Overlay onClose={() => setDebtM(false)}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: UI.danger,
            marginBottom: 16,
          }}
        >
          Deudores ({debtors.length})
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 8,
          }}
        >
          {debtors.map((x) => (
            <div
              key={x.legajo}
              style={{
                background: UI.dangerSoft,
                borderRadius: 16,
                padding: '13px 14px',
                border: `1px solid ${UI.dangerBorder}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: UI.text,
                    }}
                  >
                    {x.apellido} {x.nombre}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: UI.textMuted,
                      marginTop: 3,
                    }}
                  >
                    {x.nivel} · {x.curso}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    color: UI.danger,
                    flexShrink: 0,
                  }}
                >
                  {fm(x.da)}
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: UI.danger,
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                Debe: {x.um.join(', ')}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: UI.textMuted,
                  marginTop: 4,
                }}
              >
                {x.responsable} · {x.email}
              </div>
            </div>
          ))}
        </div>

        {debtors.length > 0 && (
          <div
            style={{
              marginTop: 14,
              padding: 14,
              background: UI.dangerSoft,
              border: `1px solid ${UI.dangerBorder}`,
              borderRadius: 16,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: UI.danger,
              }}
            >
              {fm(debtors.reduce((a, d) => a + d.da, 0))}
            </div>

            <div
              style={{
                fontSize: 12,
                color: UI.textMuted,
                marginTop: 3,
              }}
            >
              Deuda total
            </div>
          </div>
        )}
      </Overlay>
    ) : null;

  const AddMod = () =>
    addP ? (
      <Overlay onClose={() => setAddP(false)}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: UI.text,
            marginBottom: 16,
          }}
        >
          Registrar pago
        </div>

        {[
          { l: 'Legajos (coma)', kk: 'k', ph: '1001, 1002' },
          { l: 'Monto ($)', kk: 'a', ph: '135000', t: 'number' },
          { l: 'Referencia', kk: 'ref', ph: 'MP-001' },
          { l: 'Observaciones', kk: 'obs', ph: 'Opcional' },
        ].map((x) => (
          <div key={x.kk} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: UI.textMuted,
                marginBottom: 5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {x.l}
            </div>

            <Input
              value={np[x.kk]}
              onChange={(e) => setNp({ ...np, [x.kk]: e.target.value })}
              placeholder={x.ph}
              type={x.t || 'text'}
            />
          </div>
        ))}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: UI.textMuted,
                marginBottom: 5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Mes
            </div>

            <Select value={np.mo} onChange={(e) => setNp({ ...np, mo: e.target.value })}>
              {MSF.slice(0, CM + 1).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: UI.textMuted,
                marginBottom: 5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Medio
            </div>

            <Select value={np.mt} onChange={(e) => setNp({ ...np, mt: e.target.value })}>
              {['MercadoPago', 'Transferencia', 'Efectivo'].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            ['verificado', 'Verificado'],
            ['pendiente', 'Pendiente'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setNp({ ...np, st: v })}
              style={{
                flex: 1,
                padding: 11,
                borderRadius: 12,
                border: `1px solid ${
                  np.st === v
                    ? v === 'verificado'
                      ? UI.successBorder
                      : UI.warningBorder
                    : UI.border
                }`,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                background:
                  np.st === v
                    ? v === 'verificado'
                      ? UI.successSoft
                      : UI.warningSoft
                    : '#FAFBFC',
                color:
                  np.st === v
                    ? v === 'verificado'
                      ? UI.success
                      : UI.warning
                    : UI.textMuted,
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <PrimaryBtn
          onClick={() => {
            const ks = np.k
              .split(',')
              .map((x) => parseInt(x.trim()))
              .filter((x) => !isNaN(x));

            if (!ks.length || !np.a) {
              tt('Completar datos');
              return;
            }

            onAddPayment({
              studentIds: ks,
              mes: np.mo,
              monto: Number(np.a),
              metodo: np.mt,
              estado: np.st,
              referencia: np.ref,
              observaciones: np.obs,
            });

            setAddP(false);
            setNp({
              k: '',
              mo: 'Abril',
              a: '',
              mt: 'MercadoPago',
              ref: '',
              obs: '',
              st: 'verificado',
            });
            tt('Pago registrado');
          }}
        >
          Registrar
        </PrimaryBtn>
      </Overlay>
    ) : null;

  const EditMod = () => {
    if (!editKid) return null;

    const ek = editKid;
    const cb = rates[ek.nivel] || 0;
    const cf = Math.round(cb * (1 - (ek.beca || 0)));

    return (
      <Overlay onClose={() => setEditKid(null)}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: UI.text,
            marginBottom: 6,
          }}
        >
          Editar — {ek.nombre} {ek.apellido}
        </div>

        <div
          style={{
            fontSize: 12,
            color: UI.textMuted,
            marginBottom: 14,
          }}
        >
          Legajo: {ek.legajo}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: UI.textMuted,
              marginBottom: 5,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Nivel
          </div>

          <Select
            value={ek.nivel}
            onChange={(e) => setEditKid({ ...ek, nivel: e.target.value })}
          >
            {Object.keys(rates).map((l) => (
              <option key={l} value={l}>
                {l} — {fm(rates[l])}/mes
              </option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: UI.textMuted,
              marginBottom: 5,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Beca
          </div>

          <Select
            value={ek.beca}
            onChange={(e) => setEditKid({ ...ek, beca: parseFloat(e.target.value) })}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((b) => (
              <option key={b} value={b}>
                {b === 0 ? 'Sin beca' : b * 100 + '% descuento'}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: UI.textMuted,
              marginBottom: 5,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Curso
          </div>

          <Input
            value={ek.curso}
            onChange={(e) => setEditKid((prev) => ({ ...prev, curso: e.target.value }))}
          />
        </div>

        <div
          style={{
            background: '#FAFBFC',
            borderRadius: 16,
            padding: 14,
            marginBottom: 18,
            border: `1px solid ${UI.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: UI.textSoft,
            }}
          >
            <span>Base ({ek.nivel})</span>
            <span style={{ fontWeight: 700, color: UI.text }}>{fm(cb)}</span>
          </div>

          {ek.beca > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                marginTop: 6,
              }}
            >
              <span style={{ color: UI.warning }}>Beca ({ek.beca * 100}%)</span>
              <span style={{ fontWeight: 700, color: UI.warning }}>-{fm(cb * ek.beca)}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              fontWeight: 800,
              marginTop: 10,
              paddingTop: 10,
              borderTop: `1px solid ${UI.border}`,
              color: UI.text,
            }}
          >
            <span>Final</span>
            <span style={{ color: UI.success }}>{fm(cf)}</span>
          </div>
        </div>

        <PrimaryBtn
          onClick={() => {
            onUpdateStudent(ek);
            setEditKid(null);
            tt('Actualizado');
          }}
        >
          Guardar
        </PrimaryBtn>
      </Overlay>
    );
  };

  const ToastEl = () =>
    toast ? (
      <div
        style={{
          position: 'fixed',
          top: 84,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 300,
          background: '#111827',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          boxShadow: UI.shadowMd,
          animation: toastOut ? 'fadeOut 0.4s forwards' : 'fadeIn 0.4s ease-out',
        }}
      >
        {toast}
      </div>
    ) : null;

  const Nav = () => (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${UI.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0 12px',
        boxShadow: '0 -6px 18px rgba(16,24,40,.04)',
      }}
    >
      {[
        { id: 'dash', l: 'Dashboard', Icon: IconDash },
        { id: 'pays', l: 'Pagos', Icon: IconMoney },
        { id: 'stud', l: 'Alumnos', Icon: IconUsers },
        { id: 'config', l: 'Config', Icon: IconSettings },
      ].map((t) => {
        const a = scr === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              setScr(t.id);
              setSrch('');
              setExpP(null);
              setExpS(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minWidth: 64,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: a ? UI.brandSoft : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: a ? UI.brand : UI.textMuted,
              }}
            >
              <t.Icon color="currentColor" />
            </div>

            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: a ? UI.brand : UI.textMuted,
              }}
            >
              {t.l}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: UI.bg,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        paddingBottom: 76,
      }}
    >
      <style>{cssAll}</style>

      <ToastEl />
      <DebtMod />
      <AddMod />
      <EditMod />
      <Hdr />

      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          padding: '16px 20px 96px',
        }}
      >
        {scr === 'dash' && <DashSc />}
        {scr === 'pays' && <PaySc />}
        {scr === 'stud' && <StuSc />}
        {scr === 'config' && <ConfigSc />}
      </div>

      <Nav />
    </div>
  );
}