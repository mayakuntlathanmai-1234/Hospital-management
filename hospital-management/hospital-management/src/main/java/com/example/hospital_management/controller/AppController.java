package com.example.hospital_management.controller;

import com.example.hospital_management.service.PatientService;
import com.example.hospital_management.service.DoctorService;
import com.example.hospital_management.service.AppointmentService;
import com.example.hospital_management.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("patientCount", patientService.getCount());
        model.addAttribute("doctorCount", doctorService.getCount());
        model.addAttribute("appointmentCount", appointmentService.getCount());
        model.addAttribute("recordCount", medicalRecordService.getAllRecords().size());
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("patientCount", patientService.getCount());
        model.addAttribute("doctorCount", doctorService.getCount());
        model.addAttribute("appointmentCount", appointmentService.getCount());
        model.addAttribute("recordCount", medicalRecordService.getAllRecords().size());
        return "dashboard";
    }
}
