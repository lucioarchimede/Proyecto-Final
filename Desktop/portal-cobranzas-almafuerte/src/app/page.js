'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Login from '@/components/login';
import ParentView from '@/components/ParentView';
import AdminView from '@/components/AdminView'; 

const ADMIN_EMAILS = ['admin@almafuerte.edu.ar','gustavo@almafuerte.edu.ar'];

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null);
  const [family, setFamily] = useState(null);
  const [familyId, setFamilyId] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [rates, setRates] = useState({});
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { setUser(u); await loadData(u); }
      else { setUser(null); setMode(null); setFamily(null); setStudents([]); setPayments([]); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadData = async (u) => {
    try {
      const rDoc = await getDoc(doc(db, 'config', 'rates'));
      if (rDoc.exists()) setRates(rDoc.data());

      const allStuSnap = await getDocs(collection(db, 'students'));
      const allStu = allStuSnap.docs.map(d => d.data());
      setAllStudents(allStu);

      const allPaySnap = await getDocs(collection(db, 'payments'));
      const allPay = allPaySnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllPayments(allPay);

      if (ADMIN_EMAILS.includes(u.email)) {
        setMode('select');
      } else {
        setMode('parent');
      }

      const famQ = query(collection(db, 'Familias'), where('authUid', '==', u.uid));
      const famSnap = await getDocs(famQ);
      if (!famSnap.empty) {
        const famDoc = famSnap.docs[0];
        setFamily(famDoc.data());
        setFamilyId(famDoc.id);
        const myStudents = allStu.filter(s => famDoc.data().studentIds.includes(s.legajo));
        setStudents(myStudents);
        const myPays = allPay.filter(p => p.familiaId === famDoc.id);
        setPayments(myPays);
      }
    } catch (err) { console.error('Error:', err); }
  };

  const addPayment = async (data) => {
    try {
      const newPay = { ...data, familiaId: familyId || '', fecha: new Date().toLocaleDateString('es-AR'), referencia: (data.metodo === 'MercadoPago' ? 'MP-' : 'TRF-') + Date.now().toString().slice(-8) };
      const ref = await addDoc(collection(db, 'payments'), newPay);
      const full = { id: ref.id, ...newPay };
      setPayments(prev => [full, ...prev]);
      setAllPayments(prev => [full, ...prev]);
      return true;
    } catch (err) { console.error(err); return false; }
  };

  const adminAddPayment = async (data) => {
    try {
      const newPay = { ...data, fecha: new Date().toLocaleDateString('es-AR'), referencia: data.referencia || 'MAN-' + Date.now().toString().slice(-6) };
      const ref = await addDoc(collection(db, 'payments'), newPay);
      const full = { id: ref.id, ...newPay };
      setAllPayments(prev => [full, ...prev]);
      setPayments(prev => [full, ...prev]);
      return true;
    } catch (err) { console.error(err); return false; }
  };

  const updatePaymentStatus = async (payId, newStatus) => {
    try {
      await updateDoc(doc(db, 'payments', payId), { estado: newStatus });
      setAllPayments(prev => prev.map(p => p.id === payId ? { ...p, estado: newStatus } : p));
      setPayments(prev => prev.map(p => p.id === payId ? { ...p, estado: newStatus } : p));
    } catch (err) { console.error(err); }
  };

  const updateRate = async (nivel, value) => {
    try {
      await updateDoc(doc(db, 'config', 'rates'), { [nivel]: value });
      setRates(prev => ({ ...prev, [nivel]: value }));
    } catch (err) { console.error(err); }
  };

  const updateStudent = async (student) => {
    try {
      await setDoc(doc(db, 'students', String(student.legajo)), student);
      setAllStudents(prev => prev.map(s => s.legajo === student.legajo ? student : s));
      setStudents(prev => prev.map(s => s.legajo === student.legajo ? student : s));
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => { await signOut(auth); };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#9CA3AF', fontSize: 14 }}>Cargando...</div></div>;
  if (!user) return <Login onLogin={setUser} />;

  if (mode === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFBFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24, color: '#fff' }}>A</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Colegio Almafuerte</div>
        <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 36 }}>Portal de Cobranzas</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
          {family && <button onClick={() => setMode('parent')} style={{ padding: '20px 22px', background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 700 }}>F</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Portal Familias</div><div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{family.responsable}</div></div>
            <span style={{ color: '#9CA3AF' }}>›</span>
          </button>}
          <button onClick={() => setMode('admin')} style={{ padding: '20px 22px', background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 700 }}>A</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Panel Administrativo</div><div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{allStudents.length} alumnos</div></div>
            <span style={{ color: '#9CA3AF' }}>›</span>
          </button>
        </div>
        <button onClick={handleLogout} style={{ marginTop: 36, background: 'none', border: 'none', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>Cerrar sesión</button>
      </div>
    );
  }

  if (mode === 'admin') {
    return <AdminView allStudents={allStudents} rates={rates} payments={allPayments} onBack={() => setMode('select')} onUpdatePayment={updatePaymentStatus} onAddPayment={adminAddPayment} onUpdateRate={updateRate} onUpdateStudent={updateStudent} />;
  }

  return <ParentView family={family} students={students} rates={rates} payments={payments} onLogout={handleLogout} onPay={addPayment} />;
}
