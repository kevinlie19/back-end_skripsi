import { Context } from '../main';
import { queryField } from 'nexus/dist';

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
