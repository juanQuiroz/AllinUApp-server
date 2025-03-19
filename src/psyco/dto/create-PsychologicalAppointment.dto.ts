import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePsychologicalAppointmentDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  consultationReason: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  diagnosis: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  recommendations: string;
}
