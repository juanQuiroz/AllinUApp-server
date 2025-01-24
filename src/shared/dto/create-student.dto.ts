import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateStudentDto {
  id: string;

  @Transform(({ value }) => value.trim())
  firstName: string;

  @Transform(({ value }) => value.trim())
  lastName: string;

  @Transform(({ value }) => value.trim())
  motherLastName: string;

  @Transform(({ value }) => value.trim())
  docId: string;

  @Transform(({ value }) => value.trim())
  studentCode: string;

  @Transform(({ value }) => value.trim())
  gender: string;

  @Transform(({ value }) => value.trim())
  phone: string;

  @Transform(({ value }) => value.trim())
  bornDate: Date;

  @Transform(({ value }) => value.trim())
  admissionYear: string;

  @Transform(({ value }) => value.trim())
  address: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  career: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  shift: string;
}
