import { PartialType } from '@nestjs/swagger';
import { CreateAdminStaffDto } from './create-adminStaff.dto';

export class UpdateAdminStaffDto extends PartialType(CreateAdminStaffDto) {}
