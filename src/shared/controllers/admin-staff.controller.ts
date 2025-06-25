import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminStaffService } from '../services/admin-staff.service';
import { CreateAdminStaffDto } from '../dto/create-adminStaff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AdminStaff } from '../entities/admin-staff.entity';
import { UpdateAdminStaffDto } from '../dto/update-adminStaff.dto';

@Controller('admin-staff')
export class AdminStaffController {
  constructor(private readonly adminStaffService: AdminStaffService) {}

  @Post()
  create(@Body() createAdminStaffDto: CreateAdminStaffDto) {
    return this.adminStaffService.create(createAdminStaffDto);
  }

  @Post('createAndRegisterAdminStaffPatient')
  async createAndRegisterPatient(
    @Body() createOutPatientDto: CreateAdminStaffDto,
  ) {
    const adminStaff =
      await this.adminStaffService.createAndRegisterPatient(
        createOutPatientDto,
      );

    return {
      message: ` ${adminStaff.type == "TEACHER" ? 'Docente' : 'Personal administrativo'} creado exitosamente.`,
      data: adminStaff,
    };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file || !file.buffer) {
        throw new Error('No file buffer available');
      }

      await this.adminStaffService.createManyFromExcel(file.buffer);
      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error processing the file:', error);
      throw new Error('Error processing the file');
    }
  }

  @Get()
  findAll() {
    return this.adminStaffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdminStaff> {
    return this.adminStaffService.findOne(id);
  }

  @Get('byIdentifier/:identifier')
  findByDocIdOrStudentCode(
    @Param('identifier') identifier: string,
  ): Promise<AdminStaff> {
    return this.adminStaffService.findByDocId(identifier);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminStaffDto: UpdateAdminStaffDto,
  ) {
    return this.adminStaffService.update(id, updateAdminStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminStaffService.remove(id);
  }
}
