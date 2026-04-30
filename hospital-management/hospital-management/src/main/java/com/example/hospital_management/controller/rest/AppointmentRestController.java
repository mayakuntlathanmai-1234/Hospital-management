package com.example.hospital_management.controller.rest;

import com.example.hospital_management.dto.AppointmentDTO;
import com.example.hospital_management.model.Appointment;
import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.service.AppointmentService;
import com.example.hospital_management.service.DoctorService;
import com.example.hospital_management.service.PatientService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentRestController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<AppointmentDTO> getAllAppointments(org.springframework.security.core.Authentication auth) {
        String email = auth.getName();
        String role = auth.getAuthorities().iterator().next().getAuthority();

        List<Appointment> appointments;
        if (role.equals("ROLE_ADMIN")) {
            appointments = appointmentService.getAllAppointments();
        } else if (role.equals("ROLE_DOCTOR")) {
            appointments = appointmentService.getAllAppointments().stream()
                    .filter(a -> a.getDoctor().getEmail().equals(email))
                    .collect(Collectors.toList());
        } else { // ROLE_PATIENT
            appointments = appointmentService.getAllAppointments().stream()
                    .filter(a -> a.getPatient().getEmail().equals(email))
                    .collect(Collectors.toList());
        }

        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentDTO dto) {
        Patient patient = patientService.getPatientById(dto.getPatientId());
        Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());

        if (patient == null || doctor == null) {
            return ResponseEntity.badRequest().body("Invalid patient or doctor ID");
        }

        LocalDate date = LocalDate.parse(dto.getAppointmentDate());
        // Double booking check is inside service
        Appointment appointment = convertToEntity(dto);
        return ResponseEntity.ok(convertToDTO(appointmentService.saveAppointment(appointment)));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    private AppointmentDTO convertToDTO(Appointment a) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(a.getId());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientName(a.getPatient().getName());
        dto.setDoctorId(a.getDoctor().getId());
        dto.setDoctorName(a.getDoctor().getName());
        dto.setDoctorSpecialization(a.getDoctor().getSpecialization());
        dto.setAppointmentDate(a.getAppointmentDate().toString());
        dto.setAppointmentTime(a.getAppointmentTime().toString());
        dto.setStatus(a.getStatus());
        dto.setDescription(a.getDescription());
        return dto;
    }
}
