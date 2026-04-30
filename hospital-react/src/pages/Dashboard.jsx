import { Link } from 'react-router-dom';
import { CalendarPlus, Users, Stethoscope, CalendarDays, FileText, UserPlus, FilePlus, Search, ShieldCheck, ChevronRight, Activity, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
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
    fetchCounts();
  }, []);

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Dashboard Overview</h1>
          <p className="section-subheading">Welcome back — here's what's happening today at the hospital.</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary"><CalendarPlus size={16} /> Schedule Appointment</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Registered Patients', value: counts.patientCount, change: 'All time total', icon: <Users size={26} style={{ color: '#0EA5E9' }} />, bg: '#EFF6FF', changeIcon: <TrendingUp size={12} /> },
          { label: 'Medical Specialists', value: counts.doctorCount, change: 'On-duty staff', icon: <Stethoscope size={26} style={{ color: '#22C55E' }} />, bg: '#F0FDF4', changeIcon: <Stethoscope size={12} />, cls: 'up' },
          { label: "Total Appointments", value: counts.appointmentCount, change: 'Pending visits', icon: <CalendarDays size={26} style={{ color: '#F59E0B' }} />, bg: '#FFFBEB', changeIcon: <Clock size={12} /> },
          { label: 'Clinical Records', value: counts.recordCount, change: 'Filed documents', icon: <FileText size={26} style={{ color: '#6366F1' }} />, bg: '#EEF2FF', changeIcon: <FileText size={12} /> },
        ].map((s, i) => (
          <div key={i} className={`stat-card anim-up delay-${i + 1}`}>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">
                {fetching ? <Loader2 className="anim-spin" size={24} style={{ color: 'var(--text-on-glass-muted)' }} /> : s.value}
              </div>
              <div className={`stat-change ${s.cls || 'neutral'}`}>{s.changeIcon} {s.change}</div>
            </div>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick Operations + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '1.5rem' }}>
        <div className="card anim-scale">
          <div className="card-body">
            <div className="flex-between gap-md" style={{ marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>Quick Operations</h3>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-on-glass-muted)', marginTop: 2 }}>Common hospital management tasks</p>
              </div>
              <span className="badge badge-success"><ShieldCheck size={11} /> System Optimal</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { to: '/patients/register', icon: <UserPlus size={22} style={{ color: 'var(--primary-light)' }} />, label: 'Admit Patient', sub: 'Register new patient', span: false },
                { to: '/doctors/add', icon: <UserPlus size={22} style={{ color: '#4ADE80' }} />, label: 'Add Doctor', sub: 'Onboard specialist', span: false },
                { to: '/appointments/book', icon: <CalendarPlus size={22} />, label: 'Book Appointment', sub: 'Schedule a clinical visit', span: true, primary: true },
                { to: '/records/add', icon: <FilePlus size={22} style={{ color: '#A5B4FC' }} />, label: 'New Record', sub: 'Create clinical file', span: false, dashed: true },
                { to: '/patients', icon: <Search size={22} style={{ color: 'var(--text-on-glass-muted)' }} />, label: 'View All', sub: 'Browse directory', span: false, dashed: true },
              ].map((item, i) => (
                <Link key={i} to={item.to}
                  className={`btn ${item.primary ? 'btn-primary' : 'btn-white'}`}
                  style={{ justifyContent: 'flex-start', padding: '1.25rem', height: 'auto', gridColumn: item.span ? 'span 2' : undefined, borderStyle: item.dashed ? 'dashed' : undefined }}>
                  {item.icon}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.72rem', color: item.primary ? 'rgba(255,255,255,0.75)' : 'var(--text-on-glass-muted)', fontWeight: 500 }}>{item.sub}</div>
                  </div>
                  {item.span && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="card anim-scale delay-2">
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', minHeight: 300 }}>
            <div className="empty-state-icon" style={{ width: 72, height: 72, marginBottom: '1.25rem' }}><Activity size={32} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>Live Activity Feed</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-on-glass-muted)', lineHeight: 1.6 }}>Real-time patient updates &amp; system events will stream here.</p>
            <div style={{ width: '100%', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div className="skeleton" style={{ height: 36, width: '100%' }} />
              <div className="skeleton" style={{ height: 36, width: '85%' }} />
              <div className="skeleton" style={{ height: 36, width: '92%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
