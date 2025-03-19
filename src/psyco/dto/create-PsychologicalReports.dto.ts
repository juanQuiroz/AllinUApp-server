import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePsychologicalReportsDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  consultationObservation: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  consultationReason: string;

  @IsArray()
  @IsString({ each: true })
  anamnesis: string[];

  @IsArray()
  @IsString({ each: true })
  techniquesAndInstruments: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  results: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  conclusions: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  diagnosticPresumption: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  recommendations: string;
}
