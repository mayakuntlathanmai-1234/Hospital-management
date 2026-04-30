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
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments().stream()
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
        LocalTime time = LocalTime.parse(dto.getAppointmentTime());

        if (appointmentService.isDoctorDoubleBooked(doctor, date, time)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Doctor is already booked for this slot");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setStatus(dto.getStatus());
        appointment.setDescription(dto.getDescription());

        return ResponseEntity.ok(convertToDTO(appointmentService.saveAppointment(appointment)));
    }

    @DeleteMapping("/{id}")
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
