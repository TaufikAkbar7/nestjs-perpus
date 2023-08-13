import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../constants/user.constant';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(65)
  name: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
