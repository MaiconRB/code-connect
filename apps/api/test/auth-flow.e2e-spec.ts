import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaService } from '../src/modules/prisma/prisma.service';

interface UserBody {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  password?: string;
}

interface ErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
}

interface AuthBody {
  access_token: string;
  user: UserBody;
}

describe('Auth & Users Flow (e2e)', () => {
  let app: INestApplication<App>;

  const inMemoryUsers: Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  const mockPrismaService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    user: {
      create: jest
        .fn()
        .mockImplementation(
          ({
            data,
          }: {
            data: { name: string; email: string; password: string };
          }) => {
            const user = {
              id: `uuid-${Date.now()}`,
              name: data.name,
              email: data.email,
              password: data.password,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            inMemoryUsers.push(user);
            return Promise.resolve(user);
          },
        ),
      findUnique: jest
        .fn()
        .mockImplementation(
          ({ where }: { where: { email?: string; id?: string } }) => {
            if (where.email) {
              return Promise.resolve(
                inMemoryUsers.find((u) => u.email === where.email) || null,
              );
            }
            if (where.id) {
              return Promise.resolve(
                inMemoryUsers.find((u) => u.id === where.id) || null,
              );
            }
            return Promise.resolve(null);
          },
        ),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const userData = {
    name: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
    password: 'securePassword123',
  };

  let authToken = '';

  it('deve cadastrar um novo usuário (POST /api/v1/users) -> 201 Created', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/users')
      .send(userData)
      .expect(201);

    const body = response.body as UserBody;
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(userData.name);
    expect(body.email).toBe(userData.email);
    expect(body.createdAt).toBeDefined();
    expect(body.password).toBeUndefined();
  });

  it('deve retornar 409 Conflict ao tentar cadastrar o mesmo e-mail novamente', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/users')
      .send(userData)
      .expect(409);

    const body = response.body as ErrorBody;
    expect(body.statusCode).toBe(409);
    expect(body.message).toContain('Já existe um usuário cadastrado');
  });

  it('deve retornar 400 Bad Request ao enviar dados inválidos de cadastro', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: '',
        email: 'invalid-email',
        password: '123',
      })
      .expect(400);

    const body = response.body as ErrorBody;
    expect(body.statusCode).toBe(400);
  });

  it('deve retornar 401 Unauthorized ao tentar efetuar login com senha errada', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: userData.email,
        password: 'wrongPassword',
      })
      .expect(401);

    const body = response.body as ErrorBody;
    expect(body.statusCode).toBe(401);
  });

  it('deve efetuar login com sucesso e retornar o JWT (POST /api/v1/auth/login) -> 200 OK', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    const body = response.body as AuthBody;
    expect(body).toHaveProperty('access_token');
    expect(body.user.email).toBe(userData.email);
    expect(body.user.name).toBe(userData.name);

    authToken = body.access_token;
  });

  it('deve rejeitar acesso ao perfil se não houver token (GET /api/v1/auth/profile) -> 401 Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/profile')
      .expect(401);

    const body = response.body as ErrorBody;
    expect(body.statusCode).toBe(401);
  });

  it('deve obter os dados do usuário autenticado com AuthGuard (GET /api/v1/auth/profile) -> 200 OK', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const body = response.body as UserBody;
    expect(body.email).toBe(userData.email);
    expect(body.name).toBe(userData.name);
    expect(body.password).toBeUndefined();
  });
});
