import { Link } from 'react-router-dom';
import { Users, Stethoscope, CalendarDays, FileText, UserPlus, TrendingUp, CalendarPlus, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const { appointments } = useApp();
  const [counts, setCounts] = useState({ patientCount: 0, doctorCount: 0, appointmentCount: 0, recordCount: 0 });

  useEffect(() => {
    api.get('/dashboard/counts').then(res => setCounts(res.data)).catch(console.error);
  }, []);

  return (
    <section className="anim-up">
      <div className="section-header">
        <div>
          <h1 className="section-heading">Administrator Dashboard</h1>
          <p className="section-subheading">Full system control and hospital oversight.</p>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Patients', value: counts.patientCount, icon: <Users />, bg: '#EFF6FF', color: '#0EA5E9' },
          { label: 'Total Doctors', value: counts.doctorCount, icon: <Stethoscope />, bg: '#F0FDF4', color: '#22C55E' },
          { label: 'Appointments', value: counts.appointmentCount, icon: <CalendarDays />, bg: '#FFFBEB', color: '#F59E0B' },
          { label: 'Medical Records', value: counts.recordCount, icon: <FileText />, bg: '#EEF2FF', color: '#6366F1' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Management Quick Links</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Link to="/patients/register" className="btn btn-white"><UserPlus size={16} /> Admit Patient</Link>
              <Link to="/doctors/add" className="btn btn-white"><Stethoscope size={16} /> Add Specialist</Link>
              <Link to="/appointments" className="btn btn-white"><CalendarDays size={16} /> Monitor Schedule</Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>System Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="badge badge-info" style={{ padding: '1rem', justifyContent: 'flex-start' }}>
                <Activity size={16} style={{ marginRight: '0.5rem' }} /> System online & secure
              </div>
              <div className="badge badge-success" style={{ padding: '1rem', justifyContent: 'flex-start' }}>
                <ShieldCheck size={16} style={{ marginRight: '0.5rem' }} /> SSL Certificate Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
