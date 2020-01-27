import { Context } from '../main';
import { queryField, arg, stringArg, mutationField } from 'nexus/dist';

export let questions = queryField('questions', {
  type: 'Question',
  list: true,
  args: {
    category: arg({ type: 'Category', required: true }),
  },
  resolve: async (_, { category }, ctx: Context) => {
    return await ctx.prisma.questions({
      where: {
        category,
      },
    });
  },
});

export let createQuestion = mutationField('createQuestion', {
  type: 'Question',
  args: {
    category: arg({ type: 'Category', required: true }),
    description: stringArg({ required: true }),
    questionChoices: arg({ type: 'QuestionChoices', required: true }),
  },
  resolve: async (
    _,
    { category, description, questionChoices },
    ctx: Context,
  ) => {
    if (questionChoices.choices.length !== 4) {
      throw new Error(
        `Expected 4 choices but got ${questionChoices.choices.length}`,
      );
    } else {
      return await ctx.prisma.createQuestion({
        category,
        description,
        choices: {
          create: questionChoices.choices,
        },
      });
    }
  },
});
