package com.example.hospital_management.controller;

import com.example.hospital_management.model.Appointment;
import com.example.hospital_management.model.Doctor;
import com.example.hospital_management.model.Patient;
import com.example.hospital_management.service.AppointmentService;
import com.example.hospital_management.service.PatientService;
import com.example.hospital_management.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import org.springframework.validation.BindingResult;

@Controller
@RequestMapping("/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private PatientService patientService;
    
    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public String listAppointments(Model model) {
        model.addAttribute("appointments", appointmentService.getAllAppointments());
        return "appointments";
    }

    @GetMapping("/book")
    public String showBookingForm(Model model) {
        Appointment appointment = new Appointment();
        appointment.setPatient(new Patient());
        appointment.setDoctor(new Doctor());
        model.addAttribute("appointment", appointment);
        model.addAttribute("patients", patientService.getAllPatients());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        return "appointment-form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute("appointment") Appointment appointment, BindingResult bindingResult, Model model, RedirectAttributes ra) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("patients", patientService.getAllPatients());
            model.addAttribute("doctors", doctorService.getAllDoctors());
            return "appointment-form";
        }
        // Fetch real entities from DB to ensure valid foreign keys
        Patient p = null;
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            p = patientService.getPatientById(appointment.getPatient().getId());
        }
        
        Doctor d = null;
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            d = doctorService.getDoctorById(appointment.getDoctor().getId());
        }

        // Safety check to prevent FK error if entities are not found
        if (p == null || d == null) {
            ra.addFlashAttribute("error", "Error: Patient or Doctor not found. Please ensure they are registered first.");
            return "redirect:/appointments/book";
        }

        appointment.setPatient(p);
        appointment.setDoctor(d);
        appointmentService.saveAppointment(appointment);
        return "redirect:/appointments";
    }

    @GetMapping("/delete/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return "redirect:/appointments";
    }
}
