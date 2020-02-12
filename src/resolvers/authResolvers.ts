import { stringArg, mutationField, arg } from 'nexus';
import { sha256 } from 'js-sha256';

import { Context } from '../main';
import { generateJWT } from '../helpers/jwt';

export let register = mutationField('register', {
  type: 'Auth',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
    name: stringArg({ required: true }),
    avatarId: arg({ type: 'ID' }),
  },
  resolve: async (_, { email, password, name, avatarId }, ctx: Context) => {
    let normalizedEmail = email.toLocaleLowerCase();
    let emailUsed = await ctx.prisma.$exists.user({
      email,
    });

    if (emailUsed) {
      throw new Error('Email already exists');
    }

    let hash = sha256(password + process.env.SALT || '');

    let user = await ctx.prisma.createUser({
      email: normalizedEmail,
      name,
      password: hash,
    });

    if (avatarId) {
      user = await ctx.prisma.updateUser({
        where: { email: normalizedEmail },
        data: {
          avatar: {
            connect: {
              id: avatarId,
            },
          },
          avatarCollection: {
            connect: {
              id: avatarId,
            },
          },
        },
      });
    }

    return { token: generateJWT(user.id), user };
  },
});

export let login = mutationField('login', {
  type: 'Auth',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_, { email, password }, ctx: Context) => {
    let normalizedEmail = email.toLocaleLowerCase();
    let user = await ctx.prisma.user({
      email: normalizedEmail,
    });

    if (!user) {
      throw new Error('User not found');
    }
    let hashedPassword = sha256(password + process.env.SALT || '');
    if (user.password === hashedPassword) {
      return { token: generateJWT(user.id), user };
    } else {
      throw new Error('Bad credentials supplied');
    }
  },
});
