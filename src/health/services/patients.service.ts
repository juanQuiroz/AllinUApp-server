import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Student } from 'src/shared/entities/students.entity';
import { AdminStaff } from 'src/shared/entities/admin-staff.entity';
import { OutPatient } from 'src/shared/entities/out-patients.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { patientType } from 'src/common/enums/patientType.enum';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(AdminStaff)
    private readonly adminStaffRepository: Repository<AdminStaff>,
    @InjectRepository(OutPatient)
    private readonly outPatientsRepository: Repository<OutPatient>,
  ) {}

  // async create(createPatientDto: CreatePatientDto): Promise<Patient> {
  //   const { studentId, adminStaffId, outPatientId } = createPatientDto;

  //   if (
  //     [studentId, adminStaffId, outPatientId].filter((id) => id).length !== 1
  //   ) {
  //     throw new BadRequestException(
  //       'A patient must be associated with exactly one of: Student, AdminStaff, or OutPatient.',
  //     );
  //   }

  //   const patient = this.patientsRepository.create();

  //   if (studentId) {
  //     patient.student = await this.studentsRepository.findOneBy({
  //       id: studentId,
  //     });
  //     if (!patient.student) {
  //       throw new NotFoundException(`Student with ID ${studentId} not found`);
  //     }

  //     patient.type = patientType.STUDENT;
  //   }

  //   if (adminStaffId) {
  //     patient.adminStaff = await this.adminStaffRepository.findOneBy({
  //       id: adminStaffId,
  //     });
  //     if (!patient.adminStaff) {
  //       throw new NotFoundException(
  //         `AdminStaff with ID ${adminStaffId} not found`,
  //       );
  //     }

  //     patient.type = patientType.ADMINSTAFF;
  //   }

  //   if (outPatientId) {
  //     patient.outPatient = await this.outPatientsRepository.findOneBy({
  //       id: outPatientId,
  //     });
  //     if (!patient.outPatient) {
  //       throw new NotFoundException(
  //         `OutPatient with ID ${outPatientId} not found`,
  //       );
  //     }

  //     patient.type = patientType.OUTPATIENT;
  //   }

  //   return this.patientsRepository.save(patient);
  // }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { studentId, adminStaffId, outPatientId } = createPatientDto;

    // Validar que solo uno de los IDs esté presente
    if (
      [studentId, adminStaffId, outPatientId].filter((id) => id).length !== 1
    ) {
      throw new BadRequestException(
        'A patient must be associated with exactly one of: Student, AdminStaff, or OutPatient.',
      );
    }

    // Verificar si ya existe un paciente registrado
    let existingPatient: Patient | null = null;
    if (studentId) {
      existingPatient = await this.patientsRepository.findOne({
        where: { student: { id: studentId } },
      });
    } else if (adminStaffId) {
      existingPatient = await this.patientsRepository.findOne({
        where: { adminStaff: { id: adminStaffId } },
      });
    } else if (outPatientId) {
      existingPatient = await this.patientsRepository.findOne({
        where: { outPatient: { id: outPatientId } },
      });
    }

    if (existingPatient) {
      throw new BadRequestException('Paciente ya registrado');
    }

    // Crear un nuevo paciente
    const patient = this.patientsRepository.create();

    if (studentId) {
      patient.student = await this.studentsRepository.findOneBy({
        id: studentId,
      });
      if (!patient.student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      patient.type = patientType.STUDENT;
    }

    if (adminStaffId) {
      patient.adminStaff = await this.adminStaffRepository.findOneBy({
        id: adminStaffId,
      });
      if (!patient.adminStaff) {
        throw new NotFoundException(
          `AdminStaff with ID ${adminStaffId} not found`,
        );
      }

      patient.type = patientType.ADMINSTAFF;
    }

    if (outPatientId) {
      patient.outPatient = await this.outPatientsRepository.findOneBy({
        id: outPatientId,
      });
      if (!patient.outPatient) {
        throw new NotFoundException(
          `OutPatient with ID ${outPatientId} not found`,
        );
      }

      patient.type = patientType.OUTPATIENT;
    }

    return this.patientsRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find({
      relations: ['student', 'adminStaff', 'outPatient', 'clinicalRecords'],
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['student', 'adminStaff', 'outPatient', 'clinicalRecords'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    const { studentId, adminStaffId, outPatientId } = updatePatientDto;

    if ([studentId, adminStaffId, outPatientId].filter((id) => id).length > 1) {
      throw new BadRequestException(
        'A patient must be associated with only one of: Student, AdminStaff, or OutPatient.',
      );
    }

    if (studentId) {
      patient.student = await this.studentsRepository.findOneBy({
        id: studentId,
      });
      if (!patient.student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }
    } else if (adminStaffId) {
      patient.adminStaff = await this.adminStaffRepository.findOneBy({
        id: adminStaffId,
      });
      if (!patient.adminStaff) {
        throw new NotFoundException(
          `AdminStaff with ID ${adminStaffId} not found`,
        );
      }
    } else if (outPatientId) {
      patient.outPatient = await this.outPatientsRepository.findOneBy({
        id: outPatientId,
      });
      if (!patient.outPatient) {
        throw new NotFoundException(
          `OutPatient with ID ${outPatientId} not found`,
        );
      }
    }

    Object.assign(patient, updatePatientDto);
    return this.patientsRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientsRepository.softRemove(patient);
  }
}
