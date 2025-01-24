import { Module } from '@nestjs/common';
import { StudentsController } from './controllers/students.controller';
import { AdminStaffController } from './controllers/admin-staff.controller';
import { OutPatientsController } from './controllers/out-patients.controller';
import { StudentsService } from './services/students.service';
import { AdminStaffService } from './services/admin-staff.service';
import { OutPatientsService } from './services/out-patients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/students.entity';
import { MulterModule } from '@nestjs/platform-express';
import { OutPatient } from './entities/out-patients.entity';
import { AdminStaff } from './entities/admin-staff.entity';
import { PatientsService } from 'src/health/services/patients.service';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, OutPatient, AdminStaff]),
    MulterModule.register({
      dest: './uploads',
    }),
    HealthModule, // Importa HealthModule para acceder a PatientsService
  ],
  controllers: [
    StudentsController,
    AdminStaffController,
    OutPatientsController,
  ],
  providers: [StudentsService, AdminStaffService, OutPatientsService],
  exports: [TypeOrmModule],
})
export class SharedModule {}
