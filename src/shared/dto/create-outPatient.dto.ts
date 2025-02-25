import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateOutPatientDto {
  id: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  lastName: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  motherLastName: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  docId: string;

  @Transform(({ value }) => value?.trim() ?? value)
  @IsOptional()
  gender: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  phone: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  bornDate: Date;

  @IsString()
  @Transform(({ value }) => value.trim())
  address: string;
}
