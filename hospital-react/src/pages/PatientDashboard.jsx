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

      <div className="stats-grid">
        <div className="card">
          <div className="card-body">
            <h3 className="flex-center gap-sm" style={{ color: 'white', marginBottom: '1rem' }}><CalendarDays size={18} /> Next Appointment</h3>
            {nextAppt ? (
              <div className="stat-info">
                <div className="stat-value">{nextAppt.appointmentDate}</div>
                <div className="stat-label">Dr. {nextAppt.doctorName} at {nextAppt.appointmentTime}</div>
              </div>
            ) : <p className="text-muted">No appointments.</p>}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="flex-center gap-sm" style={{ color: 'white', marginBottom: '1rem' }}><ClipboardList size={18} /> Latest Diagnosis</h3>
            {latestRecord ? (
              <div>
                <div className="badge badge-success">{latestRecord.diagnosis}</div>
                <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>{latestRecord.treatment}</p>
              </div>
            ) : <p className="text-muted">No records yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
