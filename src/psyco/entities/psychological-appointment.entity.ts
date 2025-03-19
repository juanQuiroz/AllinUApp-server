import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PatientPsyco } from './patientPsyco.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('psychological_appointments')
export class PsychologicalAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  consultationReason: string;

  @Column({ nullable: true })
  diagnosis: string;

  @Column({ nullable: true })
  recommendations: string;

  @ManyToOne(() => PatientPsyco, (patient) => patient.psychologicalAppointments)
  patientPsyco: PatientPsyco;

  @ManyToOne(() => User, { nullable: false })
  attendedBy: User;
}
