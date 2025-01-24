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

    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Verify optional
    let physicalExam: PhysicalExam | undefined = undefined;
    if (physicalExamId) {
      physicalExam = await this.physicalExamRepository.findOne({
        where: { id: physicalExamId },
      });

      if (!physicalExam) {
        throw new Error('PhysicalExam not found');
      }
    }

    const currentYear = new Date().getFullYear(); // Año actual
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0'); // Mes actual en formato 'MM'

    // Obtener el último registro basado en el año y el mes actuales
    const lastRecord = await this.clinicalRecordsRepository
      .createQueryBuilder('clinical_record')
      .where('clinical_record.cr_number LIKE :pattern', {
        pattern: `HC${currentYear}${currentMonth}%`,
      })
      .orderBy('clinical_record.cr_number', 'DESC')
      .getOne();

    let nextNumber: number;

    if (lastRecord) {
      // Usar regex para extraer la última parte numérica
      const match = lastRecord.cr_number.match(/HC\d{4}\d{2}(\d{3})$/);
      if (match) {
        const lastNumber = parseInt(match[1], 10); // Convertir a número
        nextNumber = lastNumber + 1; // Incrementar
      } else {
        // Si no coincide con el formato esperado
        throw new Error(
          `Formato inesperado en cr_number: ${lastRecord.cr_number}`,
        );
      }
    } else {
      nextNumber = 1; // No hay registros, iniciar en 1
    }

    // Formatear el próximo `cr_number` sin guiones
    const nextCrNumber = `HC${currentYear}${currentMonth}${nextNumber.toString().padStart(3, '0')}`;

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
      ],
    });

    return clinicalRecord;
  }
}
