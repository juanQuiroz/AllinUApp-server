import { IsEnum, Matches } from 'class-validator';
import { AdminStaffType } from 'src/common/enums/AdminStaffType.enum';
import { Gender } from 'src/common/enums/gender.enum';
import { Patient } from 'src/health/entities/patient.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('adminStaff')
export class AdminStaff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AdminStaffType,
    nullable: true,
  })
  @IsEnum(Gender, { message: 'type must be only "TEACHER" or "ADMINPERSONNEL"' })
  type: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  motherLastName: string;

  @Column()
  @Matches(/^\d{8,12}$/, { message: 'docId must be between 8 and 12 digits' })
  docId: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @IsEnum(Gender, { message: 'gender must be only "MASCULINO" or "FEMENINO"' })
  gender: string;

  @Column({ nullable: true })
  @Matches(/^\d{9}$/, { message: 'phone must be exactly 9 digits' })
  phone: string;

  @Column()
  bornDate: Date;

  @Column()
  address: string;

  @Column()
  office: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Patient, (patient) => patient.adminStaff)
  patients: Patient[];
}
