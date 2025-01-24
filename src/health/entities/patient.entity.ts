import {
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClinicalRecord } from './clinical-records.entity';
import { Student } from 'src/shared/entities/students.entity';
import { AdminStaff } from 'src/shared/entities/admin-staff.entity';
import { OutPatient } from 'src/shared/entities/out-patients.entity';
import { patientType } from 'src/common/enums/patientType.enum';
import { IsEnum } from 'class-validator';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: patientType,
    nullable: true,
  })
  @IsEnum(patientType, {
    message: 'type must be "student" or "adminStaff" or "outPatient"',
  })
  type: string;

  @ManyToOne(() => Student, (student) => student.patients, { nullable: true })
  student: Student;

  @ManyToOne(() => AdminStaff, (adminStaff) => adminStaff.patients)
  adminStaff: AdminStaff;

  @ManyToOne(() => OutPatient, (outPatient) => outPatient.patients)
  outPatient: OutPatient;

  @OneToMany(() => ClinicalRecord, (clinicalRecord) => clinicalRecord.patient)
  clinicalRecords: ClinicalRecord[];
}
