import { Context } from '../main';
import { queryField } from 'nexus/dist';

export let avatars = queryField('avatars', {
  type: 'Avatar',
  list: true,
  resolve: async (_, __, ctx: Context) => {
    return ctx.prisma.avatars();
  },
});
