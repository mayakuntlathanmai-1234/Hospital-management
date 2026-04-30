package com.example.hospital_management.dto;

public class DashboardDTO {
    private long patientCount;
    private long doctorCount;
    private long appointmentCount;
    private long recordCount;

    public DashboardDTO() {}

    public DashboardDTO(long patientCount, long doctorCount, long appointmentCount, long recordCount) {
        this.patientCount = patientCount;
        this.doctorCount = doctorCount;
        this.appointmentCount = appointmentCount;
        this.recordCount = recordCount;
    }

    public long getPatientCount() { return patientCount; }
    public void setPatientCount(long patientCount) { this.patientCount = patientCount; }
    public long getDoctorCount() { return doctorCount; }
    public void setDoctorCount(long doctorCount) { this.doctorCount = doctorCount; }
    public long getAppointmentCount() { return appointmentCount; }
    public void setAppointmentCount(long appointmentCount) { this.appointmentCount = appointmentCount; }
    public long getRecordCount() { return recordCount; }
    public void setRecordCount(long recordCount) { this.recordCount = recordCount; }
}
