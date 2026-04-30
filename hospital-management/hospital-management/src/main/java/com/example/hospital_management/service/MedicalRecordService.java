package com.example.hospital_management.service;

import com.example.hospital_management.model.MedicalRecord;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MedicalRecordService {
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<MedicalRecord> getAllRecords() {
        return medicalRecordRepository.findAll();
    }

    public List<MedicalRecord> getRecordsByPatient(Patient patient) {
        return medicalRecordRepository.findByPatient(patient);
    }

    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    @Transactional
    public MedicalRecord saveRecord(MedicalRecord record) {
        if (record.getRecordDate() == null) {
            record.setRecordDate(LocalDateTime.now());
        }
        return medicalRecordRepository.save(record);
    }

    public MedicalRecord getRecordById(Long id) {
        return medicalRecordRepository.findById(id).orElse(null);
    }

    @Transactional
    public MedicalRecord updateRecord(Long id, MedicalRecord updated) {
        MedicalRecord existing = medicalRecordRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setPatient(updated.getPatient());
        existing.setDoctor(updated.getDoctor());
        existing.setDiagnosis(updated.getDiagnosis());
        existing.setTreatment(updated.getTreatment());
        existing.setNotes(updated.getNotes());
        return medicalRecordRepository.save(existing);
    }

    @Transactional
    public void deleteRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public long getCount() {
        return medicalRecordRepository.count();
    }
}
