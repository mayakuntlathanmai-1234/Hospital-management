import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Phone, Mail, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PatientForm() {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', contactNumber: '', email: '', disease: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addPatient } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addPatient({ ...form, age: parseInt(form.age) });
      navigate('/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ justifyContent: 'center' }}>
      <div className="form-container anim-scale">
        <div className="form-header">
          <div className="form-icon"><UserPlus size={28} style={{ color: 'var(--primary-light)' }} /></div>
          <div>
            <h2 className="form-title">Admit New Patient</h2>
            <p className="form-subtitle">Register a new patient into the hospital system</p>
          </div>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: 10, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={14} /> Full Name</label>
            <input type="text" placeholder="e.g. Robert Wilson" required 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="25" required 
                value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Phone size={14} /> Contact Number</label>
              <input type="text" placeholder="+91 9876543210" required 
                value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Email Address</label>
              <input type="email" placeholder="robert@example.com" 
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label><Activity size={14} /> Chief Complaint / Disease</label>
            <input type="text" placeholder="e.g. Chronic Migraine" required 
              value={form.disease} onChange={e => setForm({...form, disease: e.target.value})} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-white" onClick={() => navigate('/patients')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="anim-spin" size={18} /> : <UserPlus size={18} />}
              <span>{loading ? 'Admitting...' : 'Register Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
