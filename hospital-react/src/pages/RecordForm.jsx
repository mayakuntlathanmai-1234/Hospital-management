import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, User, Stethoscope, ClipboardList, Activity, MessageSquare, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function RecordForm() {
  const { user } = useAuth();
  const { patients, doctors, addRecord } = useApp();
  const [form, setForm] = useState({ patientId: '', doctorId: '', diagnosis: '', treatment: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If user is a Doctor, automatically find their doctor ID by email
  useEffect(() => {
    if (user?.role === 'DOCTOR' && doctors.length > 0) {
      const me = doctors.find(d => d.email === user.email);
      if (me) {
        setForm(prev => ({ ...prev, doctorId: me.id }));
      }
    }
  }, [user, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId) {
      setError('Please select both a patient and a doctor.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addRecord({
        ...form,
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId)
      });
      setSuccess(true);
      setTimeout(() => navigate(`/records`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card anim-scale flex-center" style={{ minHeight: '300px', textAlign: 'center' }}>
        <div className="card-body">
          <CheckCircle2 size={64} className="text-secondary" style={{ marginBottom: '1rem' }} />
          <h2 className="section-heading">Record Finalized!</h2>
          <p className="text-muted">Clinical history has been updated for this patient.</p>
          <Loader2 className="anim-spin" style={{ marginTop: '1.5rem', opacity: 0.5 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-center" style={{ justifyContent: 'center' }}>
      <div className="form-container anim-scale">
        <div className="form-header">
          <div className="form-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <FilePlus size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h2 className="form-title">Create Clinical Record</h2>
            <p className="form-subtitle">Document diagnosis and prescribed treatment</p>
          </div>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: 10, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label><User size={14} /> Select Patient</label>
              <select required value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})}>
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
              </select>
            </div>
            
            {/* ONLY ADMIN CAN SELECT DOCTOR */}
            <div className="form-group">
              <label><Stethoscope size={14} /> Treating Doctor</label>
              {user?.role === 'ADMIN' ? (
                <select required value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                  <option value="">-- Select Specialist --</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                </select>
              ) : (
                <input type="text" className="form-control" readOnly value={`Dr. ${doctors.find(d => d.id == form.doctorId)?.name || 'Loading...'}`} />
              )}
            </div>
          </div>

          <div className="form-group">
            <label><ClipboardList size={14} /> Medical Diagnosis</label>
            <input type="text" placeholder="e.g. Acute Viral Infection" required 
              value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} />
          </div>

          <div className="form-group">
            <label><Activity size={14} /> Prescribed Treatment</label>
            <textarea placeholder="Describe the treatment plan..." required 
              value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} />
          </div>

          <div className="form-group">
            <label><MessageSquare size={14} /> Additional Clinical Notes</label>
            <textarea placeholder="Clinical observations..." 
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-white" onClick={() => navigate('/records')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="anim-spin" size={18} /> : <FilePlus size={18} />}
              <span>{loading ? 'Creating File...' : 'Finalize Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
