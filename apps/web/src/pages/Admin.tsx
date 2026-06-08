import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Dashboard } from './admin/Dashboard';
import './admin.css';

const ADMIN_USERNAME = 'admin';

export function Admin() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="admin-page">
        <div className="login-container">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20" style={{ borderTopColor: '#EAB308' }} />
        </div>
      </div>
    );
  }

  if (!user) return (
    <div className="admin-page">
      <LoginForm onLogin={(password) => login(ADMIN_USERNAME, password)} />
    </div>
  );

  return (
    <div className="admin-page">
      <Dashboard onLogout={logout} />
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onLogin(password);
    } catch (err) {
      setError((err as Error).message || 'Invalid password. Please try again.');
      setPassword('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <span style={{ color: '#EAB308' }}>PIKANOMWAAN</span>
          <span>.ADMIN</span>
        </div>
        <p className="login-subtitle">Control Panel Access</p>

        <div id="alertContainer">
          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter admin password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Accessing...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
