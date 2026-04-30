package com.example.hospital_management.service;

import com.example.hospital_management.model.Patient;
import com.example.hospital_management.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    public Patient updatePatient(Long id, Patient updated) {
        Patient existing = patientRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(updated.getName());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setContactNumber(updated.getContactNumber());
        existing.setEmail(updated.getEmail());
        existing.setDisease(updated.getDisease());
        return patientRepository.save(existing);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public long getCount() {
        return patientRepository.count();
    }
}
