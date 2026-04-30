import { Link } from 'react-router-dom';
import { CalendarPlus, CalendarDays, Clock, User, Stethoscope, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Appointments() {
  const { appointments, deleteAppointment, loading } = useApp();

  if (loading && appointments.length === 0) {
    return (
      <div className="flex-center" style={{ height: '60vh', justifyContent: 'center' }}>
        <Loader2 className="anim-spin" size={48} style={{ color: 'var(--primary-light)' }} />
      </div>
    );
  }

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Appointments Schedule</h1>
          <p className="section-subheading">View and manage clinical visits and patient consultations.</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary"><CalendarPlus size={16} /> Book New Slot</Link>
      </div>

      <div className="table-container anim-scale">
        <table>
          <thead>
            <tr>
              <th width="120">Date & Time</th>
              <th>Patient Details</th>
              <th>Assigned Doctor</th>
              <th>Status</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon"><CalendarDays size={40} /></div>
                  <div className="empty-state-title">No Appointments Booked</div>
                  <p className="empty-state-desc">The clinical schedule is currently clear for the selected period.</p>
                  <Link to="/appointments/book" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Book New Appointment</Link>
                </div>
              </td></tr>
            ) : appointments.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="flex-center gap-sm fw-700" style={{ color: 'white' }}>
                    <CalendarDays size={14} className="text-primary-light" /> {a.appointmentDate}
                  </div>
                  <div className="flex-center gap-sm text-xs" style={{ color: 'var(--text-on-glass-muted)', marginTop: 4 }}>
                    <Clock size={12} /> {a.appointmentTime}
                  </div>
                </td>
                <td>
                  <div className="flex-center gap-sm">
                    <div className="avatar-pill" style={{ background: 'var(--glass-white-lg)' }}><User size={14} /></div>
                    <div className="fw-600">{a.patientName}</div>
                  </div>
                </td>
                <td>
                  <div className="fw-700" style={{ color: 'white' }}>Dr. {a.doctorName}</div>
                  <div className="text-xs" style={{ color: 'var(--text-on-glass-muted)' }}>{a.doctorSpecialization}</div>
                </td>
                <td>
                  <span className={`badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {a.status === 'Confirmed' && <CheckCircle2 size={11} />} {a.status}
                  </span>
                </td>
                <td><div className="text-sm" style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.description}</div></td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-white btn-icon" title="Cancel/Delete"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                      onClick={() => { if(window.confirm('Cancel this appointment?')) deleteAppointment(a.id); }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
