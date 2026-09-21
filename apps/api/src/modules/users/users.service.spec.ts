import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve cadastrar um novo usuário com sucesso e retornar os dados sanitizados', async () => {
    const createUserDto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123',
    };

    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockImplementation(
      ({ data }: { data: { name: string; email: string; password: string } }) =>
        Promise.resolve({
          id: 'mock-uuid-123',
          name: data.name,
          email: data.email,
          password: data.password,
          createdAt: new Date('2026-09-06T18:00:00.000Z'),
          updatedAt: new Date('2026-09-06T18:00:00.000Z'),
        }),
    );

    const user = await service.create(createUserDto);

    expect(user).toBeDefined();
    expect(user.id).toBe('mock-uuid-123');
    expect(user.name).toBe('Ada Lovelace');
    expect(user.email).toBe('ada@example.com');
    expect(user.createdAt).toBe('2026-09-06T18:00:00.000Z');
    expect((user as Record<string, unknown>).password).toBeUndefined();
    expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
  });

  it('deve hashear a senha antes de salvar no banco', async () => {
    const createUserDto = {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'mySecretPassword',
    };

    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockImplementation(
      ({ data }: { data: { name: string; email: string; password: string } }) =>
        Promise.resolve({
          id: 'mock-uuid-456',
          name: data.name,
          email: data.email,
          password: data.password,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    );

    await service.create(createUserDto);

    const calls = mockPrismaService.user.create.mock.calls as unknown as Array<
      [{ data: { password: string } }]
    >;
    const savedPassword = calls[0][0].data.password;

    expect(savedPassword).not.toBe('mySecretPassword');
    const isMatch = await bcrypt.compare('mySecretPassword', savedPassword);
    expect(isMatch).toBe(true);
  });

  it('deve lançar ConflictException ao tentar cadastrar e-mail duplicado', async () => {
    const createUserDto = {
      name: 'Alan Turing',
      email: 'alan@example.com',
      password: 'password123',
    };

    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'existing-id',
      email: 'alan@example.com',
    });

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    expect(mockPrismaService.user.create).not.toHaveBeenCalled();
  });

  it('deve encontrar usuário por id sanitizado', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'mock-uuid-789',
      name: 'Margaret Hamilton',
      email: 'margaret@example.com',
      password: 'hashedPassword',
      createdAt: new Date('2026-09-06T18:00:00.000Z'),
      updatedAt: new Date('2026-09-06T18:00:00.000Z'),
    });

    const found = await service.findById('mock-uuid-789');
    expect(found.id).toBe('mock-uuid-789');
    expect(found.email).toBe('margaret@example.com');
    expect(found.createdAt).toBe('2026-09-06T18:00:00.000Z');
    expect((found as Record<string, unknown>).password).toBeUndefined();
  });

  it('deve lançar NotFoundException ao buscar usuário com id inexistente', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    await expect(service.findById('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
