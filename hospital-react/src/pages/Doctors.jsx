import { Link } from 'react-router-dom';
import { UserPlus, Stethoscope, Phone, Mail, GraduationCap, Trash2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Doctors() {
  const { doctors, deleteDoctor, loading } = useApp();

  if (loading && doctors.length === 0) {
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
          <h1 className="section-heading">Medical Specialists</h1>
          <p className="section-subheading">Manage the panel of qualified doctors and healthcare providers.</p>
        </div>
        <Link to="/doctors/add" className="btn btn-primary"><UserPlus size={16} /> Add New Doctor</Link>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {doctors.length === 0 ? (
          <div className="card anim-scale" style={{ gridColumn: '1 / -1' }}>
            <div className="card-body">
              <div className="empty-state">
                <div className="empty-state-icon" style={{ background: 'var(--glass-white-lg)' }}><Stethoscope size={40} /></div>
                <div className="empty-state-title">No Specialists Found</div>
                <p className="empty-state-desc">You haven't added any doctors to the staff directory yet.</p>
                <Link to="/doctors/add" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Onboard First Doctor</Link>
              </div>
            </div>
          </div>
        ) : doctors.map((d, i) => (
          <div key={d.id} className={`doctor-card anim-up delay-${(i % 4) + 1}`}>
            <div className="doctor-avatar">
              <Stethoscope size={36} />
            </div>
            <h3 className="doctor-name">{d.name}</h3>
            <div className="doctor-spec">
              <span className="badge badge-primary">{d.specialization}</span>
            </div>
            
            <div className="doctor-meta">
              <div className="doctor-meta-item"><GraduationCap size={15} /> <span>{d.experience}+ Years Experience</span></div>
              <div className="doctor-meta-item"><Phone size={15} /> <span>{d.contactNumber}</span></div>
              <div className="doctor-meta-item"><Mail size={15} /> <span>{d.email}</span></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-white" style={{ flex: 1 }}>Profile</button>
              <button className="btn btn-danger-ghost btn-icon" onClick={() => { if(window.confirm('Remove doctor from staff?')) deleteDoctor(d.id); }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
