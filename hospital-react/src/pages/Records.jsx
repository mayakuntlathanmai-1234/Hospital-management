import { useParams, Link } from 'react-router-dom';
import { FilePlus, ClipboardList, User, Stethoscope, Clock, Calendar, Search, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Records() {
  const { patientId } = useParams();
  const { records, patients, deleteRecord, loading } = useApp();
  
  const filteredRecords = patientId 
    ? records.filter(r => r.patientId === parseInt(patientId))
    : records;

  const patientName = patientId && patients.find(p => p.id === parseInt(patientId))?.name;

  if (loading && records.length === 0) {
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
          <h1 className="section-heading">
            {patientId ? `Medical Records: ${patientName}` : 'All Medical Records'}
          </h1>
          <p className="section-subheading">Clinical history, diagnoses, and treatment plans for hospital patients.</p>
        </div>
        <div className="flex-center gap-md">
          <Link to="/records/add" className="btn btn-primary"><FilePlus size={16} /> New Clinical Record</Link>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="empty-state card" style={{ padding: '4rem 2rem' }}>
          <div className="empty-state-icon"><ClipboardList size={40} /></div>
          <div className="empty-state-title">No Records Found</div>
          <p className="empty-state-desc">There are no clinical records matching the current selection.</p>
          <Link to="/records/add" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Create First Record</Link>
        </div>
      ) : (
        <div className="records-list">
          {filteredRecords.map((r, i) => (
            <div key={r.id} className={`record-card anim-up delay-${(i % 3) + 1}`}>
              <div className="record-card-header">
                <div className="flex-center gap-md">
                  <div className="avatar-pill" style={{ background: 'var(--primary-tint)', color: 'var(--primary-light)' }}>
                    <ClipboardList size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'white' }}>Case #{r.id} • {r.patientName}</div>
                    <div className="flex-center gap-sm text-xs" style={{ color: 'var(--text-on-glass-muted)', marginTop: 2 }}>
                      <Calendar size={11} /> {new Date(r.recordDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex-center gap-md">
                  <div className="flex-center gap-sm text-sm fw-600" style={{ color: 'var(--secondary)' }}>
                    <Stethoscope size={14} /> Dr. {r.doctorName}
                  </div>
                  <button className="btn btn-white btn-icon" title="Delete Record"
                    style={{ height: 32, width: 32, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                    onClick={() => { if(window.confirm('Delete this clinical record?')) deleteRecord(r.id); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="record-card-body">
                <div>
                  <div className="record-section-title">
                    <div className="icon-tag" style={{ background: 'rgba(239,68,68,0.12)', color: '#FCA5A5' }}><AlertCircle size={14} /></div>
                    <span className="record-section-label">Diagnosis</span>
                  </div>
                  <p className="record-text fw-700">{r.diagnosis}</p>
                </div>
                <div>
                  <div className="record-section-title">
                    <div className="icon-tag" style={{ background: 'rgba(34,197,94,0.12)', color: '#86EFAC' }}><Activity size={14} /></div>
                    <span className="record-section-label">Treatment Plan</span>
                  </div>
                  <p className="record-text">{r.treatment}</p>
                </div>
                {r.notes && (
                  <div style={{ gridColumn: 'span 2', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="record-section-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Clinical Notes</span>
                    <p className="record-text text-sm" style={{ color: 'var(--text-on-glass-muted)' }}>{r.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="record-card-footer">
                <div className="flex-center gap-sm"><Clock size={12} /> Last Updated: {new Date(r.recordDate).toLocaleTimeString()}</div>
                <div className="flex-center gap-sm"><ShieldCheck size={12} /> Signed by Medical Authority</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ShieldCheck({ size, style }) {
  return <Activity size={size} style={style} />; // Placeholder icon
}
