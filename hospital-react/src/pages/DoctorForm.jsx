import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, Phone, Mail, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DoctorForm() {
  const [form, setForm] = useState({ name: '', specialization: 'General Physician', contactNumber: '', email: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addDoctor } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addDoctor({ ...form, experience: parseInt(form.experience) });
      navigate('/doctors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'General Physician', 'Cardiologist', 'Neurologist', 'Pediatrician', 
    'Dermatologist', 'Orthopedic', 'Psychiatrist', 'Oncologist'
  ];

  return (
    <div className="flex-center" style={{ justifyContent: 'center' }}>
      <div className="form-container anim-scale">
        <div className="form-header">
          <div className="form-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
            <Stethoscope size={28} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <h2 className="form-title">Onboard New Doctor</h2>
            <p className="form-subtitle">Add a medical specialist to the hospital staff panel</p>
          </div>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: 10, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={14} /> Doctor's Full Name</label>
            <input type="text" placeholder="e.g. Dr. Sarah Jenkins" required 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Activity size={14} /> Specialization</label>
              <select value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})}>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><GraduationCap size={14} /> Years of Experience</label>
              <input type="number" placeholder="e.g. 10" required 
                value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Phone size={14} /> Contact Number</label>
              <input type="text" placeholder="+91 9988776655" required 
                value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Email Address</label>
              <input type="email" placeholder="sarah@mediflow.com" required 
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-white" onClick={() => navigate('/doctors')}>Cancel</button>
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              {loading ? <Loader2 className="anim-spin" size={18} /> : <Stethoscope size={18} />}
              <span>{loading ? 'Onboarding...' : 'Add Doctor to Staff'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
