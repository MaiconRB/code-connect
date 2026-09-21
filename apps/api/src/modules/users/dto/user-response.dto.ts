import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único do usuário',
    example: '1725656400000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Ada Lovelace',
  })
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'ada@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Data e hora de criação do usuário em formato ISO 8601',
    example: '2026-09-06T18:00:00.000Z',
  })
  createdAt: string;
}
