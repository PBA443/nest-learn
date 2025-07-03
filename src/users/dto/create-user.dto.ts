import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'user'],{message: 'Role must be either admin or user'})
  @IsString()
  role: 'admin' | 'user';
} 