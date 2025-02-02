import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentPrescriptions } from './appointments-prescriptions.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  concentration: string;

  @Column({ nullable: true })
  dosageForm: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  posology: string;

  @Column({ nullable: true })
  administrationRoute: string;

  @OneToMany(
    () => AppointmentPrescriptions,
    (appointmentPrescriptions) => appointmentPrescriptions.prescription,
  )
  appointmentPrescriptions: AppointmentPrescriptions[];
}
