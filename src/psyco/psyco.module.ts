import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminStaff } from 'src/shared/entities/admin-staff.entity';
import { Student } from 'src/shared/entities/students.entity';
import { UsersModule } from 'src/users/users.module';
import { PatientsPsycoService } from './services/patientsPsyco.service';
import { PatientPsyco } from './entities/patientPsyco.entity';
import { PatientsPsycoController } from './controllers/patientsPsyco.controller';
import { PsychologicalReports } from './entities/psychological-report.entity';
import { PsychologicalAppointment } from './entities/psychological-appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PsychologicalReports,
      PsychologicalAppointment,
      PatientPsyco,
      AdminStaff,
      Student,
    ]),
    UsersModule,
  ],
  controllers: [PatientsPsycoController],
  providers: [PatientsPsycoService],
  exports: [PatientsPsycoService],
})
export class PsycoModule {}
