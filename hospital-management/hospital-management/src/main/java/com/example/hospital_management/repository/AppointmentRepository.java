package com.example.hospital_management.repository;

import com.example.hospital_management.model.Appointment;
import com.example.hospital_management.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorAndAppointmentDateAndAppointmentTime(
            Doctor doctor, LocalDate date, LocalTime time);
}
