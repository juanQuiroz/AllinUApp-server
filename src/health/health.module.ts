import { Module } from '@nestjs/common';

import { PatientsService } from './services/patients.service';
import { PrescriptionsService } from './services/prescriptions.service';
import { ClinicalRecordsService } from './services/clinical-records.service';
import { PhysicalExamService } from './services/physical-exam.service';
import { Cie10Service } from './services/cie10.service';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsPrescriptionsService } from './services/appointments-prescriptions.service';
import { AppointmentsCie10Service } from './services/appointments-cie10.service';
import { PhysicalExamController } from './controllers/physical-exam.controller';
import { Cie10Controller } from './controllers/cie10.controller';
import { AppointmentsController } from './controllers/appointments.controller';
import { AppointmentsPrescriptionsController } from './controllers/appointments-prescriptions.controller';
import { AppointmentsCie10Controller } from './controllers/appointments-cie10.controller';
import { PatientsController } from './controllers/patients.controller';
import { ClinicalRecordsController } from './controllers/clinical-records.controller';
import { PrescriptionsController } from './controllers/prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { AdminStaff } from 'src/shared/entities/admin-staff.entity';
import { OutPatient } from 'src/shared/entities/out-patients.entity';
import { ClinicalRecord } from './entities/clinical-records.entity';
import { PhysicalExam } from './entities/physical-exam.entity';
import { Cie10 } from './entities/cie10.entity';
import { Appointment } from './entities/appointments.entity';
import { AppointmentPrescriptions } from './entities/appointments-prescriptions.entity';
import { AppointmentCie10 } from './entities/appointments-cie.entity';
import { Prescription } from './entities/prescriptions.entity';
import { Student } from 'src/shared/entities/students.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      AdminStaff,
      OutPatient,
      ClinicalRecord,
      PhysicalExam,
      Cie10,
      Appointment,
      AppointmentPrescriptions,
      AppointmentCie10,
      Prescription,
      Student,
    ]),
    UsersModule,
  ],
  controllers: [
    PhysicalExamController,
    Cie10Controller,
    AppointmentsController,
    AppointmentsPrescriptionsController,
    AppointmentsCie10Controller,
    PatientsController,
    ClinicalRecordsController,
    PrescriptionsController,
  ],
  providers: [
    PatientsService,
    PrescriptionsService,
    ClinicalRecordsService,
    PhysicalExamService,
    Cie10Service,
    AppointmentsService,
    AppointmentsPrescriptionsService,
    AppointmentsCie10Service,
  ],
  exports: [PatientsService],
})
export class HealthModule {}
