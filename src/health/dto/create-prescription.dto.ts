import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePrescriptionDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  concentration: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  dosageForm: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => value.trim())
  quantity: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  posology: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  administrationRoute: string;
}
