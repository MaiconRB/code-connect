import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Ada Lovelace',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'ada@example.com',
  })
  @IsEmail({}, { message: 'Forneça um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha de acesso do usuário (mínimo de 6 caracteres)',
    example: 'senhaForte123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
  password: string;
}
