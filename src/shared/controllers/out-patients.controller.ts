import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OutPatientsService } from '../services/out-patients.service';
import { CreateOutPatientDto } from '../dto/create-outPatient.dto';
import { UpdateOutPatientDto } from '../dto/update-outPatient.dto';

@Controller('out-patients')
export class OutPatientsController {
  private readonly logger = new Logger(OutPatientsController.name);
  constructor(private readonly outPatientsService: OutPatientsService) {}

  @Post()
  async create(@Body() createOutPatientDto: CreateOutPatientDto) {
    const outPatient =
      await this.outPatientsService.create(createOutPatientDto);

    return {
      message: 'Paciente externo creado exitosamente.',
      data: outPatient,
    };
  }

  @Post('createAndRegisterPatient')
  async createAndRegisterPatient(
    @Body() createOutPatientDto: CreateOutPatientDto,
  ) {
    const outPatient =
      await this.outPatientsService.createAndRegisterPatient(
        createOutPatientDto,
      );

    return {
      message: 'Paciente externo creado exitosamente.',
      data: outPatient,
    };
  }

  @Get()
  async findAll() {
    const outPatient = await this.outPatientsService.findAll();

    return {
      message: 'All out patients retrieved successfully',
      data: outPatient,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOutPatientDto: UpdateOutPatientDto,
  ) {
    return this.outPatientsService.update(id, updateOutPatientDto);
  }
}
