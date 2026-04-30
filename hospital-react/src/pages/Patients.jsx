import { Link } from 'react-router-dom';
import { UserPlus, Users, Phone, FolderHeart, Trash2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Patients() {
  const { patients, deletePatient, loading } = useApp();

  if (loading && patients.length === 0) {
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
          <h1 className="section-heading">Patient Directory</h1>
          <p className="section-subheading">Manage all registered patients and their medical histories.</p>
        </div>
        <Link to="/patients/register" className="btn btn-primary"><UserPlus size={16} /> Admit New Patient</Link>
      </div>

      <div className="table-container anim-scale">
        <table>
          <thead>
            <tr>
              <th width="70">Patient ID</th>
              <th>Patient Name</th>
              <th>Demographics</th>
              <th>Contact</th>
              <th>Chief Complaint</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon"><Users size={40} /></div>
                  <div className="empty-state-title">No Patients Registered</div>
                  <p className="empty-state-desc">Start by admitting your first patient into the MediFlow system.</p>
                  <Link to="/patients/register" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Admit First Patient</Link>
                </div>
              </td></tr>
            ) : patients.map(p => (
              <tr key={p.id}>
                <td><span className="badge badge-primary">#{p.id}</span></td>
                <td>
                  <div className="flex-center gap-sm">
                    <div className="avatar-pill" style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', color: '#0284C7' }}>{p.name[0]}</div>
                    <div className="fw-700" style={{ color: 'white' }}>{p.name}</div>
                  </div>
                </td>
                <td><span className="badge badge-neutral">{p.age} yrs • {p.gender}</span></td>
                <td>
                  <div className="flex-center gap-sm text-sm" style={{ color: 'var(--text-on-glass-muted)' }}>
                    <Phone size={14} /><span>{p.contactNumber}</span>
                  </div>
                </td>
                <td><span className="badge badge-warning">{p.disease}</span></td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Link to={`/records/patient/${p.id}`} className="btn btn-white btn-icon" title="View Records">
                      <FolderHeart size={16} style={{ color: 'var(--primary)' }} />
                    </Link>
                    <button className="btn btn-white btn-icon" title="Remove Patient"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                      onClick={() => { if (window.confirm('Remove this patient? This cannot be undone.')) deletePatient(p.id); }}>
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
