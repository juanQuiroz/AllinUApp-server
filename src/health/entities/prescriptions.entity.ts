import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentPrescriptions } from './appointments-prescriptions.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => AppointmentPrescriptions,
    (appointmentPrescriptions) => appointmentPrescriptions.prescription,
  )
  appointmentPrescriptions: AppointmentPrescriptions[];
}
