import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientPsyco } from './patientPsyco.entity';

@Entity('psychological_reports')
export class PsychologicalReports {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  consultationObservation: string;

  @Column({ nullable: true })
  consultationReason: string;

  @Column('text', { array: true, nullable: true })
  anamnesis: string[];

  @Column('text', { nullable: true })
  techniquesAndInstruments: string;

  @Column('text', { array: true, nullable: true })
  results: string[];

  @Column({ nullable: true })
  conclusions: string;

  @Column({ nullable: true })
  diagnosticPresumption: string;

  @Column({ nullable: true })
  recommendations: string;

  @ManyToOne(
    () => PatientPsyco,
    (patientPsyco) => patientPsyco.psychologicalReports,
  )
  patientPsyco: PatientPsyco;
}
