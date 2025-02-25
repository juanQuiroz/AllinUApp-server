import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutPatient } from '../entities/out-patients.entity';
import { Repository } from 'typeorm';
import { CreateOutPatientDto } from '../dto/create-outPatient.dto';
import { UpdateOutPatientDto } from '../dto/update-outPatient.dto';
import { PatientsService } from 'src/health/services/patients.service';
import { Patient } from 'src/health/entities/patient.entity';

@Injectable()
export class OutPatientsService {
  constructor(
    @InjectRepository(OutPatient)
    private readonly outPatientRepository: Repository<OutPatient>,
    private readonly patientsService: PatientsService,
  ) {}

  /**
   * Crea un nuevo paciente externo
   * @param createOutPatientDto Datos para crear el paciente
   * @returns El paciente creado
   */
  async create(createOutPatientDto: CreateOutPatientDto): Promise<OutPatient> {
    // Validar si el docId ya existe
    const existingPatient = await this.outPatientRepository.findOne({
      where: { docId: createOutPatientDto.docId },
    });

    if (existingPatient) {
      throw new BadRequestException(
        `El documento de identidad ${createOutPatientDto.docId} ya está registrado.`,
      );
    }

    const newOutPatient = this.outPatientRepository.create(createOutPatientDto);
    return await this.outPatientRepository.save(newOutPatient);
  }

  async createAndRegisterPatient(
    createOutPatientDto: CreateOutPatientDto,
  ): Promise<Patient> {
    // Validar si el docId ya existe
    const existingPatient = await this.outPatientRepository.findOne({
      where: { docId: createOutPatientDto.docId },
    });

    if (existingPatient) {
      throw new BadRequestException(
        `El documento de identidad ${createOutPatientDto.docId} ya está registrado.`,
      );
    }

    const newOutPatient = this.outPatientRepository.create(createOutPatientDto);
    const outPatientCreated =
      await this.outPatientRepository.save(newOutPatient);

    const patientCreated = await this.patientsService.create({
      outPatientId: outPatientCreated.id,
    });

    return patientCreated;
  }

  /**
   * Obtiene todos los pacientes externos
   * @returns Lista de pacientes
   */
  async findAll(): Promise<OutPatient[]> {
    return this.outPatientRepository.find();
  }

  /**
   * Obtiene un paciente por su ID
   * @param id Identificador del paciente
   * @returns El paciente encontrado
   */
  async findOne(id: string): Promise<OutPatient> {
    const outPatient = await this.outPatientRepository.findOne({
      where: { id },
    });
    if (!outPatient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado.`);
    }
    return outPatient;
  }

  /**
   * Actualiza un paciente externo
   * @param id Identificador del paciente
   * @param updateOutPatientDto Datos a actualizar
   * @returns El paciente actualizado
   */

  async update(
    id: string,
    updateStudentDto: UpdateOutPatientDto,
  ): Promise<OutPatient> {
    // Buscar al estudiante por su ID
    const adminStaff = await this.outPatientRepository.findOne({
      where: { id },
    });

    if (!adminStaff) {
      throw new NotFoundException(
        `No se encontró un paciente externo con el ID: ${id}`,
      );
    }

    const updatedStudent = Object.assign(adminStaff, updateStudentDto);
    return this.outPatientRepository.save(updatedStudent);
  }

  /**
   * Elimina un paciente por su ID
   * @param id Identificador del paciente
   */
  async remove(id: string): Promise<void> {
    const outPatient = await this.findOne(id);
    await this.outPatientRepository.remove(outPatient);
  }
}
