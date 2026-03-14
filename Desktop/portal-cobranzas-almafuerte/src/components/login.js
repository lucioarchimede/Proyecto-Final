'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onLogin(result.user);
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No existe una cuenta con ese email');
      else if (err.code === 'auth/wrong-password') setError('Contraseña incorrecta');
      else if (err.code === 'auth/invalid-email') setError('Email inválido');
      else setError('Error al iniciar sesión. Intentá de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: '#FAFBFC', fontFamily: "'IBM Plex Sans', sans-serif"
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: '#111827',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 24, color: '#fff'
        }}>🏫</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
          Colegio Almafuerte
        </div>
        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Portal de Familias
        </div>
      </div>

      <form onSubmit={handleLogin} style={{
        background: '#fff', borderRadius: 16, padding: 24,
        width: '100%', maxWidth: 360, border: '1px solid #E8ECF0'
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>
          Iniciar sesión
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>
            EMAIL
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #E8ECF0', fontSize: 14, outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>
            CONTRASEÑA
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #E8ECF0', fontSize: 14, outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '8px 12px', borderRadius: 8, background: '#FEF2F2',
            border: '1px solid #FECACA', fontSize: 12, color: '#DC2626',
            marginBottom: 12
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 14, background: loading ? '#9CA3AF' : '#111827',
            color: '#fff', border: 'none', borderRadius: 12, fontSize: 14,
            fontWeight: 600, cursor: loading ? 'default' : 'pointer', marginTop: 8
          }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}