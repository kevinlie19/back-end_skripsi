import { prisma } from '../generated/prisma-client';
import datamodelInfo from '../generated/nexus-prisma';
import * as path from 'path';
import { prismaObjectType, makePrismaSchema } from 'nexus-prisma';

import * as resolvers from './resolvers';
import * as types from './typeSchemas';

let Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields([]);
  },
});

let Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields([]);
  },
});

export let schema = makePrismaSchema({
  types: { Query, Mutation, ...resolvers, ...types },
  prisma: {
    datamodelInfo,
    client: prisma,
  },
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
});
