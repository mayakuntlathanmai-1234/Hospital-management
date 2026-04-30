import { Link } from 'react-router-dom';
import { CalendarDays, Stethoscope, Clock, ShieldCheck, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DoctorDashboard() {
  const { appointments } = useApp();
  const myQueue = appointments.filter(a => a.status === 'Confirmed');

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Doctor's Dashboard</h1>
          <p className="section-subheading">Review your patients and manage upcoming consultations.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Consultations</div>
            <div className="stat-value">{myQueue.length}</div>
          </div>
          <div className="stat-icon" style={{ background: '#EFF6FF', color: 'var(--primary)' }}><Clock size={26} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">System Status</div>
            <div className="stat-value">Active</div>
          </div>
          <div className="stat-icon" style={{ background: '#F0FDF4', color: 'var(--secondary)' }}><ShieldCheck size={26} /></div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-body">
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Patient Queue</h3>
          {myQueue.length === 0 ? <p className="text-muted">No appointments for today.</p> : (
            <div className="list-group">
              {myQueue.map(a => (
                <div key={a.id} className="flex-between" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: '0.5rem' }}>
                  <div>
                    <div className="fw-700">{a.patientName}</div>
                    <div className="text-xs text-muted">{a.appointmentTime} - {a.description}</div>
                  </div>
                  <Link to="/records/add" className="btn btn-sm btn-white">Add Diagnosis</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
