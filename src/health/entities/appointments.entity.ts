import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentCie10 } from './appointments-cie.entity';
import { AppointmentPrescriptions } from './appointments-prescriptions.entity';
import { ClinicalRecord } from './clinical-records.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  description: string;

  // Relación con las tablas intermedias
  @OneToMany(
    () => AppointmentPrescriptions,
    (appointmentPrescriptions) => appointmentPrescriptions.appointment,
  )
  appointmentPrescriptions: AppointmentPrescriptions[];

  @OneToMany(
    () => AppointmentCie10,
    (appointmentCie10) => appointmentCie10.appointment,
  )
  appointmentCie10: AppointmentCie10[];

  @ManyToOne(
    () => ClinicalRecord,
    (clinicalRecord) => clinicalRecord.appointments,
  )
  @JoinColumn({ name: 'clinicalRecordId' })
  clinicalRecord: ClinicalRecord;
}
