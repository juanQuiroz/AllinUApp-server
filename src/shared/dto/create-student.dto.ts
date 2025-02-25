import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateStudentDto {
  id: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  firstName: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  lastName: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  motherLastName: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  docId: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  studentCode: string;

  @Transform(({ value }) => value?.trim() ?? value)
  @IsOptional()
  gender: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  phone: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  bornDate: Date;

  @IsOptional()
  admissionYear: Date;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  address: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  career: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  shift: string;
}
