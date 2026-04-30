import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, User, Stethoscope, ClipboardList, Activity, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RecordForm() {
  const { patients, doctors, addRecord } = useApp();
  const [form, setForm] = useState({ patientId: '', doctorId: '', diagnosis: '', treatment: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      navigate(`/records/patient/${form.patientId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ justifyContent: 'center' }}>
      <div className="form-container anim-scale">
        <div className="form-header">
          <div className="form-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <FilePlus size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h2 className="form-title">Create Clinical Record</h2>
            <p className="form-subtitle">Record clinical diagnosis and prescribe treatment for a patient</p>
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
            <div className="form-group">
              <label><Stethoscope size={14} /> Treating Doctor</label>
              <select required value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                <option value="">-- Select Specialist --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label><ClipboardList size={14} /> Medical Diagnosis</label>
            <input type="text" placeholder="e.g. Acute Viral Infection" required 
              value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} />
          </div>

          <div className="form-group">
            <label><Activity size={14} /> Prescribed Treatment</label>
            <textarea placeholder="Describe the treatment plan, medications, and dosage..." required 
              value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} />
          </div>

          <div className="form-group">
            <label><MessageSquare size={14} /> Additional Clinical Notes</label>
            <textarea placeholder="Any other observations or follow-up instructions..." 
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-white" onClick={() => navigate('/records')}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg,var(--accent),#4338CA)' }} disabled={loading}>
              {loading ? <Loader2 className="anim-spin" size={18} /> : <FilePlus size={18} />}
              <span>{loading ? 'Creating File...' : 'Finalize Clinical Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
