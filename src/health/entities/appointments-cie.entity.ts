import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cie10 } from './cie10.entity';
import { Appointment } from './appointments.entity';

@Entity('appointments_cie10')
export class AppointmentCie10 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.appointmentCie10)
  appointment: Appointment;

  @ManyToOne(() => Cie10, (cie10) => cie10.appointmentCie10)
  cie10: Cie10;
}
