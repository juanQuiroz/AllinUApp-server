import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/shared/entities/students.entity';
import { AdminStaff } from 'src/shared/entities/admin-staff.entity';
import { OutPatient } from 'src/shared/entities/out-patients.entity';
import { patientType } from 'src/common/enums/patientType.enum';
import { PatientPsyco } from '../entities/patientPsyco.entity';
import { CreatePatientPsycoDto } from '../dto/create-patientPsyco.dto';

@Injectable()
export class PatientsPsycoService {
  constructor(
    @InjectRepository(PatientPsyco)
    private readonly patientsPsycoRepository: Repository<PatientPsyco>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(AdminStaff)
    private readonly adminStaffRepository: Repository<AdminStaff>,
  ) {}

  async create(
    createPatientPsycoDto: CreatePatientPsycoDto,
  ): Promise<PatientPsyco> {
    const { studentId, adminStaffId } = createPatientPsycoDto;
    createPatientPsycoDto;
    // Validar que solo uno de los IDs esté presente
    if ([studentId, adminStaffId].filter((id) => id).length !== 1) {
      throw new BadRequestException(
        'A patient must be associated with exactly one of: Student, AdminStaff.',
      );
    }

    // Verificar si ya existe un paciente registrado
    let existingPatient: PatientPsyco | null = null;
    if (studentId) {
      existingPatient = await this.patientsPsycoRepository.findOne({
        where: { student: { id: studentId } },
      });
    } else if (adminStaffId) {
      existingPatient = await this.patientsPsycoRepository.findOne({
        where: { adminStaff: { id: adminStaffId } },
      });
    }

    if (existingPatient) {
      throw new BadRequestException('Paciente ya registrado');
    }

    // Crear un nuevo paciente
    const patient = this.patientsPsycoRepository.create();

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

    return this.patientsPsycoRepository.save(patient);
  }

  async findAll(): Promise<PatientPsyco[]> {
    return this.patientsPsycoRepository.find({
      relations: ['student', 'adminStaff', 'outPatient'],
    });
  }

  //   async findOne(id: string): Promise<PatientPsyco> {
  //     const patient = await this.patientsRepository.findOne({
  //       where: { id },
  //       relations: ['student', 'adminStaff', 'outPatient', 'clinicalRecords'],
  //     });
  //     if (!patient) {
  //       throw new NotFoundException(`Patient with ID ${id} not found`);
  //     }
  //     return patient;
  //   }

  //   async update(
  //     id: string,
  //     updatePatientDto: UpdatePatientDto,
  //   ): Promise<Patient> {
  //     const patient = await this.findOne(id);
  //     const { studentId, adminStaffId, outPatientId } = updatePatientDto;

  //     if ([studentId, adminStaffId, outPatientId].filter((id) => id).length > 1) {
  //       throw new BadRequestException(
  //         'A patient must be associated with only one of: Student, AdminStaff, or OutPatient.',
  //       );
  //     }

  //     if (studentId) {
  //       patient.student = await this.studentsRepository.findOneBy({
  //         id: studentId,
  //       });
  //       if (!patient.student) {
  //         throw new NotFoundException(`Student with ID ${studentId} not found`);
  //       }
  //     } else if (adminStaffId) {
  //       patient.adminStaff = await this.adminStaffRepository.findOneBy({
  //         id: adminStaffId,
  //       });
  //       if (!patient.adminStaff) {
  //         throw new NotFoundException(
  //           `AdminStaff with ID ${adminStaffId} not found`,
  //         );
  //       }
  //     } else if (outPatientId) {
  //       patient.outPatient = await this.outPatientsRepository.findOneBy({
  //         id: outPatientId,
  //       });
  //       if (!patient.outPatient) {
  //         throw new NotFoundException(
  //           `OutPatient with ID ${outPatientId} not found`,
  //         );
  //       }
  //     }

  //     Object.assign(patient, updatePatientDto);
  //     return this.patientsRepository.save(patient);
  //   }

  //   async remove(id: string): Promise<void> {
  //     const patient = await this.findOne(id);
  //     await this.patientsRepository.softRemove(patient);
  //   }
}
