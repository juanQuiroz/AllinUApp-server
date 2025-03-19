import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Student } from 'src/shared/entities/students.entity';
import { AdminStaff } from 'src/shared/entities/admin-staff.entity';
import { OutPatient } from 'src/shared/entities/out-patients.entity';
import { patientTypePsyco } from 'src/common/enums/patientType.enum';
import { IsEnum } from 'class-validator';

import { PsychologicalAppointment } from './psychological-appointment.entity';
import { PsychologicalReports } from './psychological-report.entity';

@Entity('patientsPsyco')
export class PatientPsyco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: patientTypePsyco,
    nullable: true,
  })
  @IsEnum(patientTypePsyco, {
    message: 'type must be "student" or "adminStaff"',
  })
  type: string;

  @ManyToOne(() => Student, (student) => student.patients, { nullable: true })
  student: Student;

  @ManyToOne(() => AdminStaff, (adminStaff) => adminStaff.patients)
  adminStaff: AdminStaff;

  @ManyToOne(() => OutPatient, (outPatient) => outPatient.patients)
  outPatient: OutPatient;

  @OneToMany(
    () => PsychologicalReports,
    (psychologicalReport) => psychologicalReport.patientPsyco,
  )
  psychologicalReports: PsychologicalReports[];

  @OneToMany(
    () => PsychologicalAppointment,
    (psychologicalAppointment) => psychologicalAppointment.patientPsyco,
  )
  psychologicalAppointments: PsychologicalAppointment[];
}
