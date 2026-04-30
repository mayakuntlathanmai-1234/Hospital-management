import { Link } from 'react-router-dom';
import { Cross, UserPlus, CalendarPlus, Users, Stethoscope, CalendarDays, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { patients, doctors, appointments } = useApp();
  return (
    <section className="anim-up">
      {/* Hero */}
      <div className="card anim-scale" style={{ marginBottom: '2rem', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, background: 'radial-gradient(circle,rgba(14,165,233,0.1),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'radial-gradient(circle,rgba(34,197,94,0.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="card-body" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-tint)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 99, padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
            <Cross size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>MediFlow HMS</span>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '1rem', lineHeight: 1.15 }}>
            <span style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Healthcare Excellence,</span><br />
            <span style={{ color: 'white' }}>Intelligently Managed.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-on-glass-muted)', maxWidth: 580, margin: '0 auto 2.25rem', lineHeight: 1.7 }}>
            MediFlow unifies patient care, specialist coordination, and clinical documentation into a single elegant platform built for modern healthcare.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/patients/register" className="btn btn-primary btn-lg"><UserPlus size={18} /> Admit Patient</Link>
            <Link to="/appointments/book" className="btn btn-white btn-lg"><CalendarPlus size={18} /> Book Appointment</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card anim-up delay-1">
          <div className="stat-info">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{patients.length}</div>
            <div className="stat-change up"><TrendingUp size={12} /> Registered profiles</div>
          </div>
          <div className="stat-icon" style={{ background: '#EFF6FF' }}><Users size={26} style={{ color: '#0EA5E9' }} /></div>
        </div>
        <div className="stat-card anim-up delay-2">
          <div className="stat-info">
            <div className="stat-label">Specialist Doctors</div>
            <div className="stat-value">{doctors.length}</div>
            <div className="stat-change up"><Stethoscope size={12} /> Available staff</div>
          </div>
          <div className="stat-icon" style={{ background: '#F0FDF4' }}><Stethoscope size={26} style={{ color: '#22C55E' }} /></div>
        </div>
        <div className="stat-card anim-up delay-3">
          <div className="stat-info">
            <div className="stat-label">Appointments</div>
            <div className="stat-value">{appointments.length}</div>
            <div className="stat-change neutral"><CalendarDays size={12} /> Active bookings</div>
          </div>
          <div className="stat-icon" style={{ background: '#FFFBEB' }}><CalendarDays size={26} style={{ color: '#F59E0B' }} /></div>
        </div>
      </div>
    </section>
  );
}
