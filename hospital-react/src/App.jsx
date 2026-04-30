import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm';
import Appointments from './pages/Appointments';
import AppointmentForm from './pages/AppointmentForm';
import Records from './pages/Records';
import RecordForm from './pages/RecordForm';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      {/* Protected Routes */}
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/register" element={<PatientForm />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/add" element={<DoctorForm />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointments/book" element={<AppointmentForm />} />
              <Route path="/records" element={<Records />} />
              <Route path="/records/add" element={<RecordForm />} />
              <Route path="/records/patient/:patientId" element={<Records />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
