import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
    email: string;
    name: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Efetuar login e obter token JWT' })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiOkResponse({
    description: 'Dados do usuário autenticado recuperados com sucesso',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    return this.authService.getProfile(req.user.sub);
  }
}
