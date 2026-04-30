package com.example.hospital_management.service;

import com.example.hospital_management.model.Appointment;
import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment saveAppointment(Appointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus("Pending");
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment existing = appointmentRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setPatient(updated.getPatient());
        existing.setDoctor(updated.getDoctor());
        existing.setAppointmentDate(updated.getAppointmentDate());
        existing.setAppointmentTime(updated.getAppointmentTime());
        existing.setStatus(updated.getStatus());
        existing.setDescription(updated.getDescription());
        return appointmentRepository.save(existing);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public long getCount() {
        return appointmentRepository.count();
    }

    public boolean isDoctorDoubleBooked(Doctor doctor, LocalDate date, LocalTime time) {
        List<Appointment> conflicts = appointmentRepository
                .findByDoctorAndAppointmentDateAndAppointmentTime(doctor, date, time);
        return !conflicts.isEmpty();
    }
}
