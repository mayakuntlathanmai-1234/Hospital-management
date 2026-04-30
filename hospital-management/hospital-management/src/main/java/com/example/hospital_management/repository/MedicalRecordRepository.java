package com.example.hospital_management.repository;

import com.example.hospital_management.model.MedicalRecord;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByPatient(Patient patient);
    
    List<MedicalRecord> findByDoctor(Doctor doctor);
}
