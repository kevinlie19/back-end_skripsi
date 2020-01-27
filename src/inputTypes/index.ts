import { inputObjectType } from 'nexus';

export const QuestionChoice = inputObjectType({
  name: 'QuestionChoice',
  definition(t) {
    t.field('answer', {
      type: 'String',
      required: true,
    });
    t.field('correct', {
      type: 'Boolean',
      required: true,
    });
  },
});

export const QuestionChoices = inputObjectType({
  name: 'QuestionChoices',
  definition(t) {
    t.field('choices', {
      type: 'QuestionChoice',
      required: true,
      list: true,
    });
  },
});
