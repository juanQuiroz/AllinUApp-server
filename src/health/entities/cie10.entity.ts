import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentCie10 } from './appointments-cie.entity';

@Entity('cie10')
export class Cie10 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    () => AppointmentCie10,
    (appointmentCie10) => appointmentCie10.cie10,
  )
  appointmentCie10: AppointmentCie10[];
}
