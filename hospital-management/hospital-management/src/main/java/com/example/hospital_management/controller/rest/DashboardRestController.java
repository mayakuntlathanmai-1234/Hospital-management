package com.example.hospital_management.controller.rest;

import com.example.hospital_management.dto.DashboardDTO;
import com.example.hospital_management.service.AppointmentService;
import com.example.hospital_management.service.DoctorService;
import com.example.hospital_management.service.MedicalRecordService;
import com.example.hospital_management.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardRestController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping("/counts")
    public DashboardDTO getDashboardCounts() {
        return new DashboardDTO(
                patientService.getCount(),
                doctorService.getCount(),
                appointmentService.getCount(),
                medicalRecordService.getCount()
        );
    }
}
