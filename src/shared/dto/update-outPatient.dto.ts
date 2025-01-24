import { PartialType } from '@nestjs/swagger';
import { CreateOutPatientDto } from './create-outPatient.dto';

export class UpdateOutPatientDto extends PartialType(CreateOutPatientDto) {}
