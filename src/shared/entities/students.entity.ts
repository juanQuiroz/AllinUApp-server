import { IsEnum, Matches } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

import { Patient } from 'src/health/entities/patient.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('students')
// @Unique(['docId'])
// @Unique(['studentCode'])
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  motherLastName: string;

  @Column({ nullable: true })
  @Matches(/^\d{8,12}$/, { message: 'docId must be between 8 and 12 digits' })
  docId: string;

  @Column({ nullable: true })
  studentCode: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @IsEnum(Gender, { message: 'gender must be "MASCULINO" or "FEMENINO"' })
  gender: string;

  @Column({ nullable: true })
  @Matches(/^\d{9}$/, { message: 'phone must be exactly 9 digits' })
  phone: string;

  @Column({ nullable: true })
  bornDate: Date;

  @Column({ nullable: true })
  admissionYear: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  career: string;

  @Column({ nullable: true })
  shift: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Patient, (patient) => patient.student)
  patients: Patient[];
}
