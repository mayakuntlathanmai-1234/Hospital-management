package com.example.hospital_management.controller.rest;

import com.example.hospital_management.dto.PatientDTO;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.service.PatientService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
public class PatientRestController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        Patient patient = patientService.getPatientById(id);
        if (patient == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(convertToDTO(patient));
    }

    @PostMapping
    public PatientDTO createPatient(@Valid @RequestBody PatientDTO dto) {
        Patient patient = convertToEntity(dto);
        return convertToDTO(patientService.savePatient(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id, @Valid @RequestBody PatientDTO dto) {
        Patient updated = patientService.updatePatient(id, convertToEntity(dto));
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    private PatientDTO convertToDTO(Patient p) {
        PatientDTO dto = new PatientDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setAge(p.getAge());
        dto.setGender(p.getGender());
        dto.setContactNumber(p.getContactNumber());
        dto.setEmail(p.getEmail());
        dto.setDisease(p.getDisease());
        return dto;
    }

    private Patient convertToEntity(PatientDTO dto) {
        Patient p = new Patient();
        p.setName(dto.getName());
        p.setAge(dto.getAge());
        p.setGender(dto.getGender());
        p.setContactNumber(dto.getContactNumber());
        p.setEmail(dto.getEmail());
        p.setDisease(dto.getDisease());
        return p;
    }
}
