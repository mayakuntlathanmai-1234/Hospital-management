package com.example.hospital_management.controller.rest;

import com.example.hospital_management.dto.DoctorDTO;
import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.service.DoctorService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
public class DoctorRestController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public DoctorDTO createDoctor(@Valid @RequestBody DoctorDTO dto) {
        Doctor doctor = convertToEntity(dto);
        return convertToDTO(doctorService.saveDoctor(doctor));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorDTO dto) {
        Doctor updated = doctorService.updateDoctor(id, convertToEntity(dto));
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    private DoctorDTO convertToDTO(Doctor d) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setSpecialization(d.getSpecialization());
        dto.setContactNumber(d.getContactNumber());
        dto.setExperience(d.getExperience());
        dto.setEmail(d.getEmail());
        return dto;
    }

    private Doctor convertToEntity(DoctorDTO dto) {
        Doctor d = new Doctor();
        d.setName(dto.getName());
        d.setSpecialization(dto.getSpecialization());
        d.setContactNumber(dto.getContactNumber());
        d.setExperience(dto.getExperience());
        d.setEmail(dto.getEmail());
        return d;
    }
}
