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
import { Prescription } from '../entities/prescriptions.entity';
import { AppointmentPrescriptions } from '../entities/appointments-prescriptions.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Prescription)
    private readonly prescriptionsRepository: Repository<Prescription>,

    @InjectRepository(AppointmentPrescriptions)
    private readonly appointmentPrescriptionsRepository: Repository<AppointmentPrescriptions>,
  ) {}

  // async create(
  //   createAppointmentDto: CreateAppointmentDto,
  //   user: { email: string },
  // ): Promise<Appointment> {
  //   const { clinicalRecordId, ...appointmentData } = createAppointmentDto;

  //   // Buscar el usuario autenticado
  //   const userEntity = await this.usersRepository.findOne({
  //     where: { email: user.email },
  //   });

  //   if (!userEntity) {
  //     throw new BadRequestException('User not found');
  //   }

  //   const appointment = this.appointmentsRepository.create({
  //     ...appointmentData,
  //     clinicalRecord: { id: clinicalRecordId },
  //     attendedBy: userEntity,
  //   });

  //   return await this.appointmentsRepository.save(appointment);
  // }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: { email: string },
  ): Promise<Appointment> {
    const { clinicalRecordId, prescriptions, ...appointmentData } =
      createAppointmentDto;

    // Buscar el usuario autenticado
    const userEntity = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    // Crear la cita
    const appointment = this.appointmentsRepository.create({
      ...appointmentData,
      clinicalRecord: { id: clinicalRecordId },
      attendedBy: userEntity,
    });

    // Guardar la cita
    const savedAppointment =
      await this.appointmentsRepository.save(appointment);

    // Procesar las prescripciones si existen
    if (prescriptions && prescriptions.length > 0) {
      for (const prescriptionDto of prescriptions) {
        // Crear la prescripción
        const prescription =
          this.prescriptionsRepository.create(prescriptionDto);
        const savedPrescription =
          await this.prescriptionsRepository.save(prescription);

        // Crear la relación entre la cita y la prescripción
        const appointmentPrescription =
          this.appointmentPrescriptionsRepository.create({
            appointment: savedAppointment,
            prescription: savedPrescription,
          });

        await this.appointmentPrescriptionsRepository.save(
          appointmentPrescription,
        );
      }
    }

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      relations: [
        'clinicalRecord',
        'attendedBy',
        'appointmentPrescriptions.prescription',
      ],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: [
        'clinicalRecord',
        'attendedBy',
        'appointmentPrescriptions.prescription',
      ],
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
