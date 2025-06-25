import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClinicalRecordDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  cr_number: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  insuranceType: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  app_diseases: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  app_pastSurgeries: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  app_allergies: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  app_pastTransfusions: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  app_dailyMedications: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  apnp_alcohol: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  apnp_smokingHabits: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  apnp_drugUse: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  apnp_immunizations: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  apnp_others: string;

  @IsBoolean()
  af_isFatherAlive: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  af_fatherHealthIssue: string;

  @IsBoolean()
  af_isMotherAlive: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  af_motherHealthIssue: string;

  @IsNumber()
  af_numberOfSiblings: number;

  @IsNumber()
  ago_startMenarche: number;

  @IsOptional()
  @IsString()
  ago_rhythm?: string;

  @IsBoolean()
  @IsOptional()
  ago_useContraceptiveMethod: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ago_contraceptiveMethodName: string;

  @IsOptional()
  @IsNumber()
  ago_g?: number;

  @IsOptional()
  @IsNumber()
  ago_p?: number;

  @IsOptional()
  @IsNumber()
  ago_a?: number;

  @IsOptional()
  @IsNumber()
  ago_c?: number;

  @IsUUID()
  patientId: string;

  @IsUUID()
  @IsOptional()
  physicalExamId?: string;
}
