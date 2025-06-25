import { Injectable } from '@nestjs/common';
import { ClinicalRecord } from '../entities/clinical-records.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClinicalRecordDto } from '../dto/create-clinicalRecord.dto';
import { Patient } from '../entities/patient.entity';
import { PhysicalExam } from '../entities/physical-exam.entity';

@Injectable()
export class ClinicalRecordsService {
  constructor(
    @InjectRepository(ClinicalRecord)
    private readonly clinicalRecordsRepository: Repository<ClinicalRecord>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(PhysicalExam)
    private readonly physicalExamRepository: Repository<PhysicalExam>,
  ) {}

  async create(
    createClinicalRecordDto: CreateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    const { patientId, physicalExamId, ...clinicalRecordData } =
      createClinicalRecordDto;

    // Incluir las relaciones para obtener el docId
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['student', 'adminStaff', 'outPatient'],
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Obtener el docId según el tipo de paciente
    let docId: string | undefined;
    switch (patient.type) {
      case 'student':
        docId = patient.student?.docId;
        break;
      case 'adminStaff':
        docId = patient.adminStaff?.docId;
        break;
      case 'outPatient':
        docId = patient.outPatient?.docId;
        break;
      default:
        docId = undefined;
    }

    if (!docId) {
      throw new Error('No se encontró el DNI (docId) del paciente');
    }

    // Verificar examen físico opcional
    let physicalExam: PhysicalExam | undefined = undefined;
    if (physicalExamId) {
      physicalExam = await this.physicalExamRepository.findOne({
        where: { id: physicalExamId },
      });

      if (!physicalExam) {
        throw new Error('PhysicalExam not found');
      }
    }

    // Formatear el cr_number como HC={dni}
    const nextCrNumber = `HC${docId}`;

    const clinicalRecord = this.clinicalRecordsRepository.create({
      ...clinicalRecordData,
      patient,
      physicalExam,
      cr_number: nextCrNumber,
    });

    return this.clinicalRecordsRepository.save(clinicalRecord);
  }

  async findAll(): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordsRepository.find({
      relations: [
        'patient',
        'patient.student',
        'patient.adminStaff',
        'patient.outPatient',
      ],
    });
  }

  async findOne(id: string): Promise<ClinicalRecord> {
    const clinicalRecord = await this.clinicalRecordsRepository.findOne({
      where: { id },
      relations: [
        'patient',
        'patient.student',
        'patient.adminStaff',
        'patient.outPatient',
        'appointments',
        'physicalExam',
      ],
    });

    return clinicalRecord;
  }

  async update(
    id: string,
    updateData: Partial<ClinicalRecord>,
  ): Promise<ClinicalRecord> {
    const clinicalRecord = await this.clinicalRecordsRepository.findOne({
      where: { id },
    });

    if (!clinicalRecord) {
      throw new Error('Clinical Record not found');
    }

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.cr_number;
    delete updateData.patient;

    // Merge the updated data with existing record
    const updatedRecord = this.clinicalRecordsRepository.merge(
      clinicalRecord,
      updateData,
    );

    return await this.clinicalRecordsRepository.save(updatedRecord);
  }
}
