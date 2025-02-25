import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ClinicalRecordsService } from '../services/clinical-records.service';
import { CreateClinicalRecordDto } from '../dto/create-clinicalRecord.dto';
import { ClinicalRecord } from '../entities/clinical-records.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Controller('clinical-records')
export class ClinicalRecordsController {
  constructor(
    private readonly clinicalRecordsService: ClinicalRecordsService,
  ) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(
    @Body() createClinicalRecordDto: CreateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    try {
      // Llamada al servicio para crear el registro clínico
      return await this.clinicalRecordsService.create(createClinicalRecordDto);
    } catch (error) {
      // Manejo de errores
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @Auth(Role.ADMIN)
  async findAll() {
    const patients = await this.clinicalRecordsService.findAll();
    return {
      message: 'Clinical records retrieved successfully',
      data: patients,
    };
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<ClinicalRecord> {
    const clinicalRecord = await this.clinicalRecordsService.findOne(id);

    if (!clinicalRecord) {
      throw new NotFoundException('Clinical record not found');
    }

    return clinicalRecord;
  }
}
