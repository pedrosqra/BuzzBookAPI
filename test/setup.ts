import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import * as net from 'net';

let app: INestApplication;
let prisma: PrismaService;

const PORT = 3333;

function checkPortInUse(
  port: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(port);
  });
}

export const setupApp = async () => {
  const isPortInUse = await checkPortInUse(PORT);
  if (isPortInUse) {
    throw new Error(
      `Port ${PORT} is already in use`
    );
  }

  const moduleRef =
    await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true })
  );
  await app.init();
  await app.listen(PORT);

  prisma = app.get(PrismaService);
  await prisma.cleanDbForTesting();

  const BASE_URL = `http://localhost:${PORT}/`;
  pactum.request.setBaseUrl(BASE_URL);

  return { app, prisma };
};

export async function closeApp(
  app: INestApplication
) {
  if (app) {
    await app.close();
  }
}
