package com.example.hospital_management.service;

import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public Doctor updateDoctor(Long id, Doctor updated) {
        Doctor existing = doctorRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(updated.getName());
        existing.setSpecialization(updated.getSpecialization());
        existing.setContactNumber(updated.getContactNumber());
        existing.setExperience(updated.getExperience());
        existing.setEmail(updated.getEmail());
        return doctorRepository.save(existing);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public long getCount() {
        return doctorRepository.count();
    }
}
