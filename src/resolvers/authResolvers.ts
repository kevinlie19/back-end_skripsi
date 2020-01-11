import { stringArg, mutationField } from 'nexus';
import sjcl from 'sjcl';

import { Context } from '../main';
import { generateJWT } from '../helpers/jwt';

export let register = mutationField('register', {
  type: 'Auth',
  args: {
    username: stringArg({ required: true }),
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
    fullName: stringArg({ required: true }),
    avatar: stringArg(),
  },
  resolve: async (
    _,
    { email, username, password, ...createUserData },
    ctx: Context,
  ) => {
    let normalizedEmail = email.toLocaleLowerCase();
    let emailUsed = await ctx.prisma.$exists.user({
      email,
    });
    let usernameUsed = await ctx.prisma.$exists.user({
      username,
    });

    if (emailUsed) {
      throw new Error('Email already exists');
    }
    if (usernameUsed) {
      throw new Error('Username already exists');
    }

    let hash = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(password + process.env.SALT || ''),
    );

    let user = await ctx.prisma.createUser({
      email: normalizedEmail,
      username,
      password: hash,
      ...createUserData,
    });

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
    let hashedPassword = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(password + process.env.SALT || ''),
    );
    if (user.password === hashedPassword) {
      return { token: generateJWT(user.id), user };
    } else {
      throw new Error('Bad credentials supplied');
    }
  },
});
