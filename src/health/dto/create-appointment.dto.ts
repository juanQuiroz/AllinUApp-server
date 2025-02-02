import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateDateColumn } from 'typeorm';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class CreateAppointmentDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @IsString()
  @Transform(({ value }) => value.trim())
  condition: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  breathingRate: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  pulse: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  temperature: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  bloodPressure: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  weigth: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  heigth: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  appetite: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  thirst: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  sleep: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  urination: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  dep: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  emergencyReason: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  subjective: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  relevantHistory: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  objective: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  analysis: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  plan: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  evolution: string;

  @IsUUID()
  @IsOptional()
  clinicalRecordId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions?: CreatePrescriptionDto[];
}
