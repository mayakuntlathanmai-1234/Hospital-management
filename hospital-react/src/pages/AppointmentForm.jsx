import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, User, Stethoscope, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, doctors, addAppointment } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    description: '',
    status: 'Confirmed'
  });

  // If user is a Patient, automatically find their patient ID by email
  useEffect(() => {
    if (user?.role === 'PATIENT' && patients.length > 0) {
      const me = patients.find(p => p.email === user.email);
      if (me) {
        setFormData(prev => ({ ...prev, patientId: me.id }));
      }
    }
  }, [user, patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addAppointment(formData);
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to book appointment. Doctor might be double-booked.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card anim-scale flex-center" style={{ minHeight: '300px', textAlign: 'center' }}>
        <div className="card-body">
          <CheckCircle2 size={64} className="text-secondary" style={{ marginBottom: '1rem' }} />
          <h2 className="section-heading">Appointment Booked!</h2>
          <p className="text-muted">Your schedule has been updated successfully.</p>
          <Loader2 className="anim-spin" style={{ marginTop: '1.5rem', opacity: 0.5 }} />
        </div>
      </div>
    );
  }

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Schedule Consultation</h1>
          <p className="section-subheading">Book a medical appointment with our specialists.</p>
        </div>
      </div>

      <div className="card glass">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="grid-2">
            
            {/* ONLY ADMIN CAN SELECT PATIENT */}
            {user?.role === 'ADMIN' && (
              <div className="form-group col-2">
                <label className="form-label"><User size={14} /> Select Patient</label>
                <select 
                  className="form-control"
                  required
                  value={formData.patientId}
                  onChange={e => setFormData({...formData, patientId: e.target.value})}
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.disease})</option>)}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label"><Stethoscope size={14} /> Select Doctor</label>
              <select 
                className="form-control"
                required
                value={formData.doctorId}
                onChange={e => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><CalendarDays size={14} /> Appointment Date</label>
              <input 
                type="date" 
                className="form-control"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.appointmentDate}
                onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={14} /> Preferred Time</label>
              <input 
                type="time" 
                className="form-control"
                required
                value={formData.appointmentTime}
                onChange={e => setFormData({...formData, appointmentTime: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FileText size={14} /> Reason for Visit</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Brief description of symptoms"
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {error && <div className="form-group col-2 text-danger flex-center gap-sm"><AlertCircle size={16}/> {error}</div>}

            <div className="form-group col-2" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                {loading ? <Loader2 className="anim-spin" /> : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
