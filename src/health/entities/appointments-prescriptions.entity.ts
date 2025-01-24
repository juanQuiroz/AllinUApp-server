import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Appointment } from './appointments.entity';
import { Prescription } from './prescriptions.entity';

@Entity('appointments_prescriptions')
export class AppointmentPrescriptions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.appointmentPrescriptions,
  )
  appointment: Appointment;

  @ManyToOne(
    () => Prescription,
    (prescription) => prescription.appointmentPrescriptions,
  )
  prescription: Prescription;
}
