import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, CalendarDays, ClipboardList, Activity, Bell, Settings, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo"><Activity size={22} /></div>
          <div>
            <div className="brand-name">MediFlow</div>
            <div className="brand-sub">Health Management</div>
          </div>
        </div>

        <div className="nav-section-label">Main Menu</div>

        <ul className="nav-links">
          <li><NavLink to="/dashboard"><LayoutDashboard /><span>Dashboard</span></NavLink></li>
          
          {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && (
            <li><NavLink to="/patients"><Users /><span>Patients</span></NavLink></li>
          )}
          
          {(user?.role === 'ADMIN' || user?.role === 'DOCTOR' || user?.role === 'PATIENT') && (
            <li><NavLink to="/doctors"><Stethoscope /><span>Doctors</span></NavLink></li>
          )}
          
          <li><NavLink to="/appointments"><CalendarDays /><span>Appointments</span></NavLink></li>
          <li><NavLink to="/records"><ClipboardList /><span>Medical Records</span></NavLink></li>
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.fullName?.charAt(0) || <User size={18} />}</div>
            <div>
              <div className="sidebar-user-name">{user?.fullName || 'User'}</div>
              <div className="sidebar-user-role">{user?.role?.toLowerCase()}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div>
            <div className="top-bar-title">MediFlow Hospital Management</div>
            <div className="top-bar-subtitle">System online and operational</div>
          </div>
          <div className="top-bar-actions">
            <div className="top-bar-date">{date}</div>
            <button className="top-bar-icon-btn" title="Notifications"><Bell size={18} /></button>
            <button className="top-bar-icon-btn" title="Settings"><Settings size={18} /></button>
            <button className="btn btn-primary btn-sm" onClick={handleLogout}>
              <LogOut size={15} /><span>Logout</span>
            </button>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
