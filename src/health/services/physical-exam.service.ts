import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhysicalExamDto } from '../dto/create-physicalExam.dto';
import { PhysicalExam } from '../entities/physical-exam.entity';

@Injectable()
export class PhysicalExamService {
  constructor(
    @InjectRepository(PhysicalExam)
    private readonly patientsRepository: Repository<PhysicalExam>,
  ) {}

  async create(
    createPhysicalExamDto: CreatePhysicalExamDto,
  ): Promise<PhysicalExam> {
    if (createAdminStaffDto.docId) {
      const existingByDocId = await this.adminStaffRepository.findOne({
        where: { docId: createAdminStaffDto.docId },
      });
      if (existingByDocId) {
        throw new BadRequestException(
          `El documento de identidad ${createAdminStaffDto.docId} ya está registrado.`,
        );
      }
    }
    // Crear y guardar el estudiante
    const newStudent = this.adminStaffRepository.create(createAdminStaffDto);
    return await this.adminStaffRepository.save(newStudent);
  }

  async findAll(): Promise<AdminStaff[]> {
    return await this.adminStaffRepository.find({
      where: { deletedAt: null },
      order: { lastName: 'ASC' },
    });
  }
}
