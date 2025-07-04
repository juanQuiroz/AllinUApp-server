import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { Patient } from './patient.entity';
import { PhysicalExam } from './physical-exam.entity';
import { rhythmType } from 'src/common/enums/rhythmType.enum';
import { IsEnum } from 'class-validator';

@Entity('clinical_records')
export class ClinicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cr_number: string;

  @Column()
  insuranceType: string;

  @Column({ nullable: true })
  app_diseases: string; //enfermedades

  @Column({ nullable: true })
  app_pastSurgeries: string; //Quirurgicos

  @Column({ nullable: true })
  app_allergies: string; // alergias

  @Column({ nullable: true })
  app_pastTransfusions: string; // Transfusiones

  @Column({ nullable: true })
  app_dailyMedications: string; // medicamentos de uso diario

  @Column({ nullable: true })
  apnp_alcohol: string;

  @Column({ nullable: true })
  apnp_smokingHabits: string;

  @Column({ nullable: true })
  apnp_drugUse: string;

  @Column({ nullable: true })
  apnp_immunizations: string;

  @Column({ nullable: true })
  apnp_others: string;

  @Column({ type: 'boolean' })
  af_isFatherAlive: boolean;

  @Column({ type: 'text', nullable: true })
  af_fatherHealthIssue?: string;

  @Column({ type: 'boolean' })
  af_isMotherAlive: boolean;

  @Column({ type: 'text', nullable: true })
  af_motherHealthIssue?: string;

  @Column({ type: 'int', nullable: true })
  af_numberOfSiblings: number;

  @Column({ type: 'int', nullable: true })
  ago_startMenarche?: number; // inicio de la menstruacion

  @Column({
    type: 'enum',
    enum: rhythmType,
    nullable: true,
  })
  @IsEnum(rhythmType, {
    message: 'ago_rhythm must be "regular" or "irregular"',
  })
  ago_rhythm?: string;

  @Column({ type: 'boolean', nullable: true })
  ago_useContraceptiveMethod: boolean; // uso de metodos anticonceptivos

  @Column({ type: 'text', nullable: true })
  ago_contraceptiveMethodName?: string;

  @Column({ type: 'int', nullable: true })
  ago_g?: number;

  @Column({ type: 'int', nullable: true })
  ago_p?: number;

  @Column({ type: 'int', nullable: true })
  ago_a?: number;

  @Column({ type: 'int', nullable: true })
  ago_c?: number;

  @ManyToOne(() => Patient, (patient) => patient.clinicalRecords)
  patient: Patient;

  @ManyToOne(
    () => PhysicalExam,
    (physicalExam) => physicalExam.clinicalRecords,
    { nullable: true },
  )
  physicalExam?: PhysicalExam;

  @OneToMany(() => Appointment, (appointment) => appointment.clinicalRecord, {
    nullable: true,
  })
  appointments?: Appointment[];
}
