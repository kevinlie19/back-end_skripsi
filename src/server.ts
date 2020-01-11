import { GraphQLServer } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';

import { decodeJWT } from './helpers/jwt';
import { prisma } from '../generated/prisma-client';
import { schema } from './schema';
import { permissions } from './middlewares/permissions';

export const server = new GraphQLServer({
  schema,
  context: ({ request }: ContextParameters) => {
    let token = request.get('token');
    let userId = decodeJWT(token || '');
    return {
      prisma,
      userId,
    };
  },
  middlewares: [permissions],
});
