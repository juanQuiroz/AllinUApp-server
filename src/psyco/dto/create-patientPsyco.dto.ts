import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePatientPsycoDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  adminStaffId?: string;

  @IsOptional()
  @IsUUID()
  outPatientId?: string;
}
