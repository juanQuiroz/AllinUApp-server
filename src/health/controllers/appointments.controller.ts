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
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // @Post()
  // @Auth(Role.ADMIN)
  // @HttpCode(HttpStatus.CREATED)
  // async create(
  //   @Body() createAppointmentDto: CreateAppointmentDto,
  //   @ActiveUser() user: UserActiveInterface,
  // ) {
  //   const appointment = await this.appointmentsService.create(
  //     createAppointmentDto,
  //     user,
  //   );
  //   return {
  //     message: 'Appointment successfully created',
  //     data: appointment,
  //   };
  // }

  @Post()
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    const appointment = await this.appointmentsService.create(
      createAppointmentDto,
      user,
    );
    return {
      message: 'Appointment successfully created',
      data: appointment,
    };
  }

  @Get()
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const appointments = await this.appointmentsService.findAll();
    return {
      message: 'Appointments retrieved successfully',
      data: appointments,
    };
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const updatedAppointment = await this.appointmentsService.update(
      id,
      updateAppointmentDto,
    );
    return {
      message: 'Appointment successfully updated',
      userMessage: 'Atención actualizada correctamente',
      data: updatedAppointment,
    };
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.appointmentsService.remove(id);
    return { message: 'Appointment successfully deleted' };
  }
}
