import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClinicalRecord } from './clinical-records.entity';

@Entity('physical_exam')
export class PhysicalExam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examType: string;

  @Column()
  findings: string;

  @OneToMany(
    () => ClinicalRecord,
    (clinicalRecord) => clinicalRecord.physicalExam,
  )
  clinicalRecords: ClinicalRecord[];
}
