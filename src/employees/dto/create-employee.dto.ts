import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../../generated/prisma';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional() // phone අංකය අත්‍යවශ්‍ය නැති නිසා IsOptional යොදමු
  phone?: string;

  @IsString()
  @IsOptional() // ලිපිනය අත්‍යවශ්‍ය නැති නිසා IsOptional යොදමු
  address?: string;
}
