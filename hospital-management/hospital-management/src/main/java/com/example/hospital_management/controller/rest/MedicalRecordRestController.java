package com.example.hospital_management.controller.rest;

import com.example.hospital_management.dto.MedicalRecordDTO;
import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.model.MedicalRecord;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.service.DoctorService;
import com.example.hospital_management.service.MedicalRecordService;
import com.example.hospital_management.service.PatientService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/records")
public class MedicalRecordRestController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<MedicalRecordDTO> getAllRecords(org.springframework.security.core.Authentication auth) {
        String email = auth.getName();
        String role = auth.getAuthorities().iterator().next().getAuthority();

        List<MedicalRecord> records;
        if (role.equals("ROLE_ADMIN")) {
            records = medicalRecordService.getAllRecords();
        } else if (role.equals("ROLE_DOCTOR")) {
            records = medicalRecordService.getAllRecords().stream()
                    .filter(r -> r.getDoctor().getEmail().equals(email))
                    .collect(Collectors.toList());
        } else { // ROLE_PATIENT
            records = medicalRecordService.getAllRecords().stream()
                    .filter(r -> r.getPatient().getEmail().equals(email))
                    .collect(Collectors.toList());
        }

        return records.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/patient/{id}")
    public List<MedicalRecordDTO> getRecordsByPatient(@PathVariable Long id, org.springframework.security.core.Authentication auth) {
        // Patients can only see their own records by ID check
        List<MedicalRecordDTO> allByPatient = medicalRecordService.getRecordsByPatientId(id).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"))) {
            return allByPatient.stream()
                    .filter(r -> patientsMatch(id, auth.getName()))
                    .collect(Collectors.toList());
        }
        return allByPatient;
    }
    
    private boolean patientsMatch(Long id, String email) {
        Patient p = patientService.getPatientById(id);
        return p != null && p.getEmail().equals(email);
    }

    @PostMapping
    public ResponseEntity<?> createRecord(@Valid @RequestBody MedicalRecordDTO dto) {
        Patient patient = patientService.getPatientById(dto.getPatientId());
        Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());

        if (patient == null || doctor == null) {
            return ResponseEntity.badRequest().body("Invalid patient or doctor ID");
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(dto.getDiagnosis());
        record.setTreatment(dto.getTreatment());
        record.setNotes(dto.getNotes());

        return ResponseEntity.ok(convertToDTO(medicalRecordService.saveRecord(record)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        medicalRecordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    private MedicalRecordDTO convertToDTO(MedicalRecord r) {
        MedicalRecordDTO dto = new MedicalRecordDTO();
        dto.setId(r.getId());
        dto.setPatientId(r.getPatient().getId());
        dto.setPatientName(r.getPatient().getName());
        dto.setDoctorId(r.getDoctor().getId());
        dto.setDoctorName(r.getDoctor().getName());
        dto.setDiagnosis(r.getDiagnosis());
        dto.setTreatment(r.getTreatment());
        dto.setNotes(r.getNotes());
        dto.setRecordDate(r.getRecordDate().toString());
        return dto;
    }
}
