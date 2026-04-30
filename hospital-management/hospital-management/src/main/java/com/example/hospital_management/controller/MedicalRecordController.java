package com.example.hospital_management.controller;

import com.example.hospital_management.model.MedicalRecord;
import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.service.MedicalRecordService;
import com.example.hospital_management.service.PatientService;
import com.example.hospital_management.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.time.LocalDateTime;

import org.springframework.validation.BindingResult;

@Controller
@RequestMapping("/records")
public class MedicalRecordController {
    @Autowired
    private MedicalRecordService medicalRecordService;
    
    @Autowired
    private PatientService patientService;
    
    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public String listRecords(Model model) {
        model.addAttribute("records", medicalRecordService.getAllRecords());
        return "records";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        MedicalRecord record = new MedicalRecord();
        record.setPatient(new Patient());
        record.setDoctor(new Doctor());
        model.addAttribute("record", record);
        model.addAttribute("patients", patientService.getAllPatients());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        return "record-form";
    }

    @PostMapping("/save")
    public String saveRecord(@ModelAttribute("record") MedicalRecord record, BindingResult bindingResult, Model model, RedirectAttributes ra) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("patients", patientService.getAllPatients());
            model.addAttribute("doctors", doctorService.getAllDoctors());
            return "record-form";
        }
        // Fetch real entities from DB to ensure valid foreign keys
        Patient p = null;
        if (record.getPatient() != null && record.getPatient().getId() != null) {
            p = patientService.getPatientById(record.getPatient().getId());
        }
        
        Doctor d = null;
        if (record.getDoctor() != null && record.getDoctor().getId() != null) {
            d = doctorService.getDoctorById(record.getDoctor().getId());
        }

        if (p == null || d == null) {
            ra.addFlashAttribute("error", "Error: Patient or Doctor not found. Please register them before creating a record.");
            return "redirect:/records/add";
        }

        record.setPatient(p);
        record.setDoctor(d);

        if (record.getRecordDate() == null) {
            record.setRecordDate(LocalDateTime.now());
        }
        
        medicalRecordService.saveRecord(record);
        return "redirect:/records";
    }

    @GetMapping("/patient/{id}")
    public String listPatientRecords(@PathVariable Long id, Model model) {
        model.addAttribute("records", medicalRecordService.getRecordsByPatientId(id));
        model.addAttribute("patient", patientService.getPatientById(id));
        return "patient-records";
    }

    @GetMapping("/delete/{id}")
    public String deleteRecord(@PathVariable Long id) {
        medicalRecordService.deleteRecord(id);
        return "redirect:/records";
    }
}
