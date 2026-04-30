import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Activity, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', justifyContent: 'center', padding: '1rem' }}>
      <div className="form-container anim-scale" style={{ maxWidth: 420 }}>
        <div className="form-header" style={{ textAlign: 'center', display: 'block' }}>
          <div className="form-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>
            <Activity size={28} style={{ color: 'white' }} />
          </div>
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Login to access the MediFlow System</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: 10, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. admin@hospital.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label><Lock size={14} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <Loader2 className="anim-spin" size={20} /> : <LogIn size={20} />}
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-on-glass-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
