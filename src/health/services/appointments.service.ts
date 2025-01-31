import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointments.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: { email: string },
  ): Promise<Appointment> {
    const { clinicalRecordId, ...appointmentData } = createAppointmentDto;

    // Buscar el usuario autenticado
    const userEntity = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (!userEntity) {
      throw new BadRequestException('User not found');
    }

    const appointment = this.appointmentsRepository.create({
      ...appointmentData,
      clinicalRecord: { id: clinicalRecordId },
      attendedBy: userEntity,
    });

    return await this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      relations: ['clinicalRecord', 'user'],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['clinicalRecord', 'user'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentsRepository.remove(appointment);
  }
}
