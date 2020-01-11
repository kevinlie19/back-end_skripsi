import { server } from './server';
import { prisma } from '../generated/prisma-client';

export type Context = {
  prisma: typeof prisma;
  userId: string;
};

async function main(): Promise<void> {
  server.start(() => {
    console.log('Server is running on http://localhost:4000');
  });
}
main().catch((e) => console.error(e));
