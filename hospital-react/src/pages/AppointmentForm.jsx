import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, User, Stethoscope, CalendarDays, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AppointmentForm() {
  const { patients, doctors, addAppointment } = useApp();
  const [form, setForm] = useState({ 
    patientId: '', 
    doctorId: '', 
    appointmentDate: '', 
    appointmentTime: '', 
    status: 'Confirmed', 
    description: '' 
  });
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
      await addAppointment({
        ...form,
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId)
      });
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ justifyContent: 'center' }}>
      <div className="form-container anim-scale">
        <div className="form-header">
          <div className="form-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
            <CalendarPlus size={28} style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <h2 className="form-title">Book Appointment</h2>
            <p className="form-subtitle">Schedule a clinical consultation between a patient and a specialist</p>
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
                <option value="">-- Choose Patient --</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><Stethoscope size={14} /> Select Doctor</label>
              <select required value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                <option value="">-- Choose Specialist --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><CalendarDays size={14} /> Appointment Date</label>
              <input type="date" required 
                value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label><Clock size={14} /> Preferred Time</label>
              <input type="time" required 
                value={form.appointmentTime} onChange={e => setForm({...form, appointmentTime: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label><FileText size={14} /> Reason for Visit / Description</label>
            <textarea placeholder="Briefly describe the symptoms or reason for clinical visit..." 
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-white" onClick={() => navigate('/appointments')}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg,var(--warning),#D97706)' }} disabled={loading}>
              {loading ? <Loader2 className="anim-spin" size={18} /> : <CalendarPlus size={18} />}
              <span>{loading ? 'Booking Slot...' : 'Confirm Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
