import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardList, Activity, AlertCircle, CalendarPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PatientDashboard() {
  const { appointments, records } = useApp();
  const nextAppt = appointments[0];
  const latestRecord = records[records.length - 1];

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Patient Wellness Portal</h1>
          <p className="section-subheading">Your personal medical records and scheduling assistant.</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary"><CalendarPlus size={16} /> Book New</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="flex-center gap-sm" style={{ color: 'white', marginBottom: '1.5rem' }}><CalendarDays size={18} /> Next Appointment</h3>
            {nextAppt ? (
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.8rem' }}>{nextAppt.appointmentDate}</div>
                <div className="stat-label">Dr. {nextAppt.doctorName} • {nextAppt.appointmentTime}</div>
              </div>
            ) : <p className="text-muted">No upcoming appointments.</p>}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="flex-center gap-sm" style={{ color: 'white', marginBottom: '1.5rem' }}><Activity size={18} /> Latest Diagnosis</h3>
            {latestRecord ? (
              <div>
                <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>{latestRecord.diagnosis}</div>
                <p className="text-xs text-muted">{latestRecord.treatment}</p>
              </div>
            ) : <p className="text-muted">No clinical records found.</p>}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-body">
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Notifications & Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="flex-center gap-md" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
              <AlertCircle className="text-primary-light" size={20} />
              <div>
                <div className="fw-700">Annual Checkup Due</div>
                <div className="text-xs text-muted">It has been 12 months since your last full physical examination.</div>
              </div>
            </div>
            <div className="flex-center gap-md" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
              <Activity className="text-secondary" size={20} />
              <div>
                <div className="fw-700">Health Tip: Stay Hydrated</div>
                <div className="text-xs text-muted">Drinking 8 glasses of water daily improves your metabolic health.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
