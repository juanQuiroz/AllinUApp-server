import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateDateColumn } from 'typeorm';

export class CreatePhysicalExamDto {
  @IsUUID()
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @IsString()
  @Transform(({ value }) => value.trim())
  docId: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  levelOfConsciousness: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  mcFC: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  mcTA: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  mcFR: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  mcT: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => value.trim())
  mcWeight: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => value.trim())
  mcHeight: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => value.trim())
  mcIMC: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  skinAndAppendages: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  tcs: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  soma: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  headAndNeck: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  respiratorySystem: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  breastAssessment: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  cardiovascularSystem: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  abdominalAssessment: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  genitourinarySystem: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  nervousSystem: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  complementaryMethods: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  initialTreatment: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  evolution: string;
}
