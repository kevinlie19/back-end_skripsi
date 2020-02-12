import {
  queryField,
  mutationField,
  arg,
  stringArg,
  intArg,
  idArg,
} from 'nexus';
import { sha256 } from 'js-sha256';

import { Context } from '../main';

export let myProfile = queryField('myProfile', {
  type: 'User',
  resolve: async (_, __, ctx: Context) => {
    let user = await ctx.prisma.user({ id: ctx.userId });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
});

export let updateProfile = mutationField('updateProfile', {
  type: 'User',
  args: {
    email: stringArg(),
    password: stringArg(),
    name: stringArg(),
    avatarId: arg({ type: 'ID' }),
    highestScore: intArg(),
    point: intArg(),
  },
  resolve: async (
    _,
    { avatarId, password, ...updateProfileData },
    ctx: Context,
  ) => {
    if (avatarId) {
      let avatarCollection = await ctx.prisma
        .user({ id: ctx.userId })
        .avatarCollection();

      if (avatarCollection.find(({ id }) => id === avatarId)) {
        return await ctx.prisma.updateUser({
          data: {
            ...updateProfileData,
            avatar: {
              connect: {
                id: avatarId,
              },
            },
          },
          where: {
            id: ctx.userId,
          },
        });
      }
      throw new Error('Cannot change avatar which is not in avatar collection');
    }
    if (password) {
      password = sha256(password + process.env.SALT || '');
    }
    return await ctx.prisma.updateUser({
      data: {
        ...updateProfileData,
      },
      where: {
        id: ctx.userId,
      },
    });
  },
});

export let otherProfile = queryField('otherProfile', {
  type: 'User',
  args: {
    id: idArg({ required: true }),
  },
  resolve: async (_, { id }, ctx: Context) => {
    let user = await ctx.prisma.user({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
});

export let addToAvatarCollection = mutationField('addToAvatarCollection', {
  type: 'User',
  args: {
    avatarId: arg({ type: 'ID' }),
  },
  resolve: async (_, { avatarId }, ctx: Context) => {
    return await ctx.prisma.updateUser({
      data: {
        avatarCollection: {
          connect: {
            id: avatarId,
          },
        },
      },
      where: {
        id: ctx.userId,
      },
    });
  },
});

export let leaderboard = queryField('leaderboard', {
  type: 'User',
  list: true,
  resolve: async (_, __, ctx: Context) => {
    return (await ctx.prisma.users()).sort(
      (a, b) => b.highestScore - a.highestScore,
    );
  },
});

export let checkPassword = queryField('checkPassword', {
  type: 'Boolean',
  args: {
    password: stringArg({ required: true }),
  },
  resolve: async (_, { password }, ctx: Context) => {
    let user = await ctx.prisma.user({
      id: ctx.userId,
    });
    let hashedPassword = sha256(password + process.env.SALT || '');

    if (user?.password === hashedPassword) {
      return true;
    } else {
      return false;
    }
  },
});
