import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/students.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async createManyFromExcel(fileBuffer: Buffer): Promise<Student[]> {
    // Leer el archivo Excel
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Suponiendo que los estudiantes están en la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir el contenido de la hoja en un arreglo de objetos
    const studentsData = XLSX.utils.sheet_to_json(worksheet);

    // Crear los estudiantes a partir de los datos
    const students = studentsData.map((studentData: any) => {
      const student = new Student();

      student.firstName = studentData['firstName'];
      student.lastName = studentData['lastName'];
      student.motherLastName = studentData['motherLastName'];
      student.docId = studentData['docId'];
      student.studentCode = studentData['studentCode'];
      student.gender = studentData['gender'];
      student.phone = studentData['phone'];
      student.bornDate = this.convertToDate(studentData['bornDate']);
      student.admissionYear = this.convertToDate(studentData['admissionYear']);
      student.address = studentData['address'];
      student.career = studentData['career'];
      student.shift = studentData['shift'];

      return student;
    });

    // Guardar los estudiantes en la base de datos
    await this.studentRepository.save(students);

    return students;
  }

  /**
   * Crea un nuevo estudiante
   * @param createStudentDto Datos para crear el estudiante
   * @returns Estudiante creado
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Verificar duplicados por docId
    if (createStudentDto.docId) {
      const existingByDocId = await this.studentRepository.findOne({
        where: { docId: createStudentDto.docId },
      });
      if (existingByDocId) {
        throw new BadRequestException(
          `El documento de identidad ${createStudentDto.docId} ya está registrado.`,
        );
      }
    }

    // Verificar duplicados por studentCode
    if (createStudentDto.studentCode) {
      const existingByStudentCode = await this.studentRepository.findOne({
        where: { studentCode: createStudentDto.studentCode },
      });
      if (existingByStudentCode) {
        throw new BadRequestException(
          `El código de estudiante ${createStudentDto.studentCode} ya está registrado.`,
        );
      }
    }

    // Crear y guardar el estudiante
    const newStudent = this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(newStudent);
  }

  // Obtener todos los estudiantes
  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { deletedAt: null },
      order: { lastName: 'ASC' },
    });
  }

  // Obtener un estudiante por ID
  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!student) {
      throw new NotFoundException(`No se encontró el estudiante con ID ${id}.`);
    }
    return student;
  }

  /**
   * Obtiene un estudiante por documento de identidad o por codigo de estudiante
   * @param identifier docId o studentCode del estudiante
   * @returns Estudiante actualizado
   */
  async findByDocIdOrStudentCode(identifier: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: [{ docId: identifier }, { studentCode: identifier }],
    });

    if (!student) {
      throw new NotFoundException(
        `No se encontró un estudiante con el identificador: ${identifier}`,
      );
    }
    return student;
  }

  /**
   * Actualiza un estudiante existente
   * @param id ID del estudiante
   * @param updateStudentDto Datos para actualizar el estudiante
   * @returns Estudiante actualizado
   */

  // Actualizar estudiante
  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    // Buscar al estudiante por su ID
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException(
        `No se encontró un estudiante con el ID: ${id}`,
      );
    }

    // Actualizar el estudiante
    const updatedStudent = Object.assign(student, updateStudentDto);
    return this.studentRepository.save(updatedStudent);
  }

  // Eliminar estudiante (soft delete)
  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.softRemove(student); // Marca como eliminado sin borrar de la base de datos
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
