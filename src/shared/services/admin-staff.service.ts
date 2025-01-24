import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminStaff } from '../entities/admin-staff.entity';
import { Repository } from 'typeorm';
import { CreateAdminStaffDto } from '../dto/create-adminStaff.dto';
import { UpdateAdminStaffDto } from '../dto/update-adminStaff.dto';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';

@Injectable()
export class AdminStaffService {
  constructor(
    @InjectRepository(AdminStaff)
    private readonly adminStaffRepository: Repository<AdminStaff>,
  ) {}

  async createManyFromExcel(fileBuffer: Buffer): Promise<AdminStaff[]> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const adminStaffData = XLSX.utils.sheet_to_json(worksheet);

    const students = adminStaffData.map((row: any) => {
      const adminStaff = new AdminStaff();

      adminStaff.firstName = row['firstName'];
      adminStaff.lastName = row['lastName'];
      adminStaff.motherLastName = row['motherLastName'];
      adminStaff.docId = row['docId'];
      adminStaff.gender = row['gender'];
      adminStaff.phone = row['phone'];
      adminStaff.bornDate = this.convertToDate(row['bornDate']);
      adminStaff.address = row['address'];
      adminStaff.office = row['office'];

      return adminStaff;
    });

    await this.adminStaffRepository.save(students);
    return students;
  }

  async create(createAdminStaffDto: CreateAdminStaffDto): Promise<AdminStaff> {
    // Verificar duplicados por docId
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

  async findOne(id: string): Promise<AdminStaff> {
    const adminStaff = await this.adminStaffRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!adminStaff) {
      throw new NotFoundException(
        `No se encontró el administrativo con ID ${id}.`,
      );
    }
    return adminStaff;
  }

  async findByDocId(docId: string): Promise<AdminStaff> {
    const adminStaff = await this.adminStaffRepository.findOne({
      where: [{ docId }],
    });

    if (!adminStaff) {
      throw new NotFoundException(
        `No se encontró un administrativo con el identificador: ${docId}`,
      );
    }
    return adminStaff;
  }

  async update(
    id: string,
    updateStudentDto: UpdateAdminStaffDto,
  ): Promise<AdminStaff> {
    // Buscar al estudiante por su ID
    const adminStaff = await this.adminStaffRepository.findOne({
      where: { id },
    });

    if (!adminStaff) {
      throw new NotFoundException(
        `No se encontró un administrativo con el ID: ${id}`,
      );
    }

    const updatedStudent = Object.assign(adminStaff, updateStudentDto);
    return this.adminStaffRepository.save(updatedStudent);
  }

  async remove(id: string): Promise<void> {
    const adminStaff = await this.findOne(id);
    await this.adminStaffRepository.softRemove(adminStaff); // Marca como eliminado sin borrar de la base de datos
  }

  private convertToDate(dateInput: any): Date | null {
    // Definir la zona horaria de Lima
    const timezone = 'America/Lima';

    if (typeof dateInput === 'number') {
      // Conversión de números de fecha de Excel
      const excelDate = DateTime.fromMillis(
        (dateInput - 25569) * 86400 * 1000,
        { zone: timezone },
      );
      return excelDate.isValid ? excelDate.toJSDate() : null;
    }

    if (typeof dateInput === 'string') {
      // Conversión de cadena "d/m/yy"
      const parsedDate = DateTime.fromFormat(dateInput, 'd/M/yy', {
        zone: timezone,
      });
      return parsedDate.isValid ? parsedDate.toJSDate() : null;
    }

    // Devolver null si no es cadena ni número
    return null;
  }
}
