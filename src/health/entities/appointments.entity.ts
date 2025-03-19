import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { AppointmentCie10 } from './appointments-cie.entity';
import { AppointmentPrescriptions } from './appointments-prescriptions.entity';
import { ClinicalRecord } from './clinical-records.entity';
import { User } from 'src/users/entities/user.entity';
import { Transform } from 'class-transformer';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  condition: string;

  @Column({ nullable: true })
  breathingRate: string;

  @Column({ nullable: true })
  pulse: string;

  @Column({ nullable: true })
  temperature: string;

  @Column({ nullable: true })
  bloodPressure: string;

  @Column({ nullable: true })
  weigth: string;

  @Column({ nullable: true })
  heigth: string;

  @Column({ nullable: true })
  appetite: string;

  @Column({ nullable: true })
  thirst: string;

  @Column({ nullable: true })
  sleep: string;

  @Column({ nullable: true })
  urination: string;

  @Column({ nullable: true })
  dep: string;

  @Column({ nullable: true })
  emergencyReason: string;

  @Column({ nullable: true })
  subjective: string;

  @Column({ nullable: true })
  relevantHistory: string;

  @Column({ nullable: true })
  objective: string;

  @Column({ nullable: true })
  analysis: string;

  @Column({ nullable: true })
  plan: string;

  @Column({ nullable: true })
  evolution: string;

  @ManyToOne(
    () => ClinicalRecord,
    (clinicalRecord) => clinicalRecord.appointments,
  )
  @JoinColumn({ name: 'clinicalRecordId' })
  clinicalRecord: ClinicalRecord;

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

  @ManyToOne(() => User, { nullable: false })
  attendedBy: User;
}
