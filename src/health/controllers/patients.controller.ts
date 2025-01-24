import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientsService.create(createPatientDto);
    return {
      message: 'Patient successfully created',
      data: patient,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const patients = await this.patientsService.findAll();
    return {
      message: 'Patients retrieved successfully',
      data: patients,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const patient = await this.patientsService.findOne(id);
    return {
      message: 'Patient retrieved successfully',
      data: patient,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const updatedPatient = await this.patientsService.update(
      id,
      updatePatientDto,
    );
    return {
      message: 'Patient successfully updated',
      data: updatedPatient,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.patientsService.remove(id);
    return {
      message: 'Patient successfully deleted',
    };
  }
}
