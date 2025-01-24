import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Student } from '../entities/students.entity';

@Controller('students')
export class StudentsController {
  private readonly logger = new Logger(StudentsController.name);
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('File received:', file);
      console.log('File buffer:', file.buffer); // Verifica que el buffer no sea undefined

      if (!file || !file.buffer) {
        throw new Error('No file buffer available');
      }

      await this.studentsService.createManyFromExcel(file.buffer);
      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error processing the file:', error);
      throw new Error('Error processing the file');
    }
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Get('byIdentifier/:identifier')
  findByDocIdOrStudentCode(
    @Param('identifier') identifier: string,
  ): Promise<Student> {
    return this.studentsService.findByDocIdOrStudentCode(identifier);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
