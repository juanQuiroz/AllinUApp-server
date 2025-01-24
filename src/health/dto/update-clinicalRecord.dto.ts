import { PartialType } from '@nestjs/swagger';
import { CreateClinicalRecordDto } from './create-clinicalRecord.dto';

export class UpdateClinicalRecordDto extends PartialType(
  CreateClinicalRecordDto,
) {}
