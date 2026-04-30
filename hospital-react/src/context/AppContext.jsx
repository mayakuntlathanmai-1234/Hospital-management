import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [pRes, dRes, aRes, rRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/appointments'),
        api.get('/records')
      ]);
      setPatients(pRes.data);
      setDoctors(dRes.data);
      setAppointments(aRes.data);
      setRecords(rRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to synchronize data with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const addPatient = async (p) => {
    await api.post('/patients', p);
    await fetchData();
  };

  const deletePatient = async (id) => {
    await api.delete(`/patients/${id}`);
    await fetchData();
  };

  const addDoctor = async (d) => {
    await api.post('/doctors', d);
    await fetchData();
  };

  const deleteDoctor = async (id) => {
    await api.delete(`/doctors/${id}`);
    await fetchData();
  };

  const addAppointment = async (a) => {
    await api.post('/appointments', a);
    await fetchData();
  };

  const deleteAppointment = async (id) => {
    await api.delete(`/appointments/${id}`);
    await fetchData();
  };

  const addRecord = async (r) => {
    await api.post('/records', r);
    await fetchData();
  };

  const deleteRecord = async (id) => {
    await api.delete(`/records/${id}`);
    await fetchData();
  };

  return (
    <AppContext.Provider value={{ 
      patients, doctors, appointments, records, loading, error,
      addPatient, deletePatient, 
      addDoctor, deleteDoctor, 
      addAppointment, deleteAppointment, 
      addRecord, deleteRecord,
      refreshData: fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
