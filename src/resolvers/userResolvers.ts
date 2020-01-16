import { queryField, mutationField, arg, stringArg, intArg } from 'nexus';

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
  resolve: async (_, { avatarId, ...updateProfileData }, ctx: Context) => {
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
