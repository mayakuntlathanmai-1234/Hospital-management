import { Link } from 'react-router-dom';
import { CalendarPlus, Users, Stethoscope, CalendarDays, FileText, UserPlus, Search, ShieldCheck, ChevronRight, Activity, TrendingUp, Clock, Loader2, ClipboardList, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { patients, doctors, appointments, records, loading } = useApp();
  const [counts, setCounts] = useState({ patientCount: 0, doctorCount: 0, appointmentCount: 0, recordCount: 0 });
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      setFetching(true);
      try {
        const res = await api.get('/dashboard/counts');
        setCounts(res.data);
      } catch (err) {
        console.error("Dashboard count error", err);
      } finally {
        setFetching(false);
      }
    };
    if (user?.role === 'ADMIN') fetchCounts();
  }, [user]);

  if (user?.role === 'ADMIN') return <AdminDashboard counts={counts} fetching={fetching} />
  if (user?.role === 'DOCTOR') return <DoctorDashboard appointments={appointments} />
  return <PatientDashboard appointments={appointments} records={records} />
}

function AdminDashboard({ counts, fetching }) {
  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Administrator Panel</h1>
          <p className="section-subheading">Total system oversight and medical facility management.</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary"><CalendarPlus size={16} /> Global Scheduler</Link>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Registered Patients', value: counts.patientCount, change: 'All time total', icon: <Users size={26} style={{ color: '#0EA5E9' }} />, bg: '#EFF6FF', changeIcon: <TrendingUp size={12} /> },
          { label: 'Medical Specialists', value: counts.doctorCount, change: 'On-duty staff', icon: <Stethoscope size={26} style={{ color: '#22C55E' }} />, bg: '#F0FDF4', changeIcon: <Stethoscope size={12} />, cls: 'up' },
          { label: "Total Appointments", value: counts.appointmentCount, change: 'System wide', icon: <CalendarDays size={26} style={{ color: '#F59E0B' }} />, bg: '#FFFBEB', changeIcon: <Clock size={12} /> },
          { label: 'Clinical Records', value: counts.recordCount, change: 'Filed documents', icon: <FileText size={26} style={{ color: '#6366F1' }} />, bg: '#EEF2FF', changeIcon: <FileText size={12} /> },
        ].map((s, i) => (
          <div key={i} className={`stat-card anim-up delay-${i + 1}`}>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{fetching ? <Loader2 className="anim-spin" size={24} /> : s.value}</div>
              <div className={`stat-change ${s.cls || 'neutral'}`}>{s.changeIcon} {s.change}</div>
            </div>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="card anim-scale" style={{ marginTop: '2rem' }}>
        <div className="card-body">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Management Quick Links</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link to="/patients/register" className="btn btn-white"><UserPlus size={16} /> Admit Patient</Link>
            <Link to="/doctors/add" className="btn btn-white"><Stethoscope size={16} /> Add Specialist</Link>
            <Link to="/appointments" className="btn btn-white"><CalendarDays size={16} /> Monitor Schedule</Link>
            <Link to="/records" className="btn btn-white"><ClipboardList size={16} /> System Records</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DoctorDashboard({ appointments }) {
  const pending = appointments.filter(a => a.status === 'Confirmed');
  
  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Clinical Dashboard</h1>
          <p className="section-subheading">Manage your daily patient queue and medical consultations.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Consultations</div>
            <div className="stat-value">{pending.length}</div>
            <div className="stat-change up"><Clock size={12} /> Today's schedule</div>
          </div>
          <div className="stat-icon" style={{ background: '#EFF6FF' }}><CalendarDays size={26} style={{ color: 'var(--primary)' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Your Specialties</div>
            <div className="stat-value">Active</div>
            <div className="stat-change up"><ShieldCheck size={12} /> Verified Status</div>
          </div>
          <div className="stat-icon" style={{ background: '#F0FDF4' }}><Stethoscope size={26} style={{ color: 'var(--secondary)' }} /></div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-body">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>Upcoming Consultations</h3>
            <Link to="/appointments" className="text-sm" style={{ color: 'var(--primary-light)' }}>View All</Link>
          </div>
          {pending.length === 0 ? (
            <p className="text-muted">No appointments scheduled for today.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pending.slice(0, 3).map(a => (
                <div key={a.id} className="flex-between" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                  <div className="flex-center gap-md">
                    <div className="avatar-pill">{a.patientName[0]}</div>
                    <div>
                      <div className="fw-700">{a.patientName}</div>
                      <div className="text-xs text-muted">{a.appointmentTime} • {a.description}</div>
                    </div>
                  </div>
                  <Link to="/records/add" className="btn btn-sm btn-white">Add Record</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PatientDashboard({ appointments, records }) {
  const nextAppt = appointments[0];
  const lastRecord = records[records.length - 1];

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Patient Wellness Portal</h1>
          <p className="section-subheading">Access your medical history, prescriptions, and schedule.</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary"><CalendarPlus size={16} /> Book Appointment</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="flex-center gap-sm" style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>
              <CalendarDays size={18} className="text-primary-light" /> Your Next Appointment
            </h3>
            {nextAppt ? (
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="stat-info">
                  <div className="stat-label">Consulting with Dr. {nextAppt.doctorName}</div>
                  <div className="stat-value" style={{ fontSize: '1.5rem' }}>{nextAppt.appointmentDate}</div>
                  <div className="stat-change neutral"><Clock size={12} /> at {nextAppt.appointmentTime}</div>
                </div>
                <div className="stat-icon" style={{ background: 'var(--primary-tint)' }}><Activity size={26} className="text-primary-light" /></div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p className="text-muted">No upcoming appointments scheduled.</p>
                <Link to="/appointments/book" className="btn btn-white btn-sm" style={{ marginTop: '1rem' }}>Book Now</Link>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="flex-center gap-sm" style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>
              <ClipboardList size={18} className="text-secondary" /> Latest Record
            </h3>
            {lastRecord ? (
              <div>
                <div className="badge badge-success" style={{ marginBottom: '1rem' }}>{lastRecord.diagnosis}</div>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{lastRecord.treatment}</p>
                <Link to="/records" className="btn btn-white btn-sm" style={{ width: '100%', marginTop: '1.5rem' }}>Full History</Link>
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle size={32} className="text-muted" style={{ marginBottom: '1rem' }} />
                <p className="text-muted">No medical records on file.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
