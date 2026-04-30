import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, UserCircle, Activity, AlertCircle, Loader2 } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'PATIENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.role);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', justifyContent: 'center', padding: '1rem' }}>
      <div className="form-container anim-scale" style={{ maxWidth: 450 }}>
        <div className="form-header" style={{ textAlign: 'center', display: 'block' }}>
          <div className="form-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg,var(--secondary),var(--primary))' }}>
            <UserPlus size={28} style={{ color: 'white' }} />
          </div>
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">Join the hospital healthcare network</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: 10, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={14} /> Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Dr. John Doe" 
              required 
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. john@example.com" 
              required 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><Lock size={14} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><UserCircle size={14} /> Account Role</label>
            <select 
              value={form.role} 
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ padding: '0.8rem 1rem' }}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <Loader2 className="anim-spin" size={20} /> : <UserPlus size={20} />}
            <span>{loading ? 'Creating Account...' : 'Register Now'}</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-on-glass-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
