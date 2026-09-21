import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    toResponseDto: jest.fn(
      (u: { id: string; name: string; email: string; createdAt: string }) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      }),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve estar definido', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('deve realizar login com sucesso e retornar token e usuário', async () => {
    const hashedPassword = await bcrypt.hash('linuxPassword', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      name: 'Linus Torvalds',
      email: 'linus@example.com',
      password: hashedPassword,
      createdAt: '2026-09-06T18:00:00.000Z',
    });

    const result = await authService.login({
      email: 'linus@example.com',
      password: 'linuxPassword',
    });

    expect(result).toBeDefined();
    expect(result.access_token).toBe('mocked-jwt-token');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('linus@example.com');
  });

  it('deve lançar UnauthorizedException ao tentar login com senha incorreta', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'user-2',
      name: 'Ken Thompson',
      email: 'ken@example.com',
      password: hashedPassword,
      createdAt: '2026-09-06T18:00:00.000Z',
    });

    await expect(
      authService.login({
        email: 'ken@example.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException quando o usuário não existe', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'nobody@example.com',
        password: 'anyPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve recuperar o perfil do usuário pelo id', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'user-3',
      name: 'Dennis Ritchie',
      email: 'dennis@example.com',
      createdAt: '2026-09-06T18:00:00.000Z',
    });

    const profile = await authService.getProfile('user-3');
    expect(profile).toBeDefined();
    expect(profile.id).toBe('user-3');
    expect(profile.name).toBe('Dennis Ritchie');
  });
});
