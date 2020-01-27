import { rule, shield } from 'graphql-shield';

let isAuthenticated = rule()(async (_, __, ctx) => {
  return ctx.userId != '';
});

let permissions = shield({
  Query: {
    avatars: isAuthenticated,
    leaderboard: isAuthenticated,
    myProfile: isAuthenticated,
    questions: isAuthenticated,
  },
  Mutation: {
    addToAvatarCollection: isAuthenticated,
    createQuestion: isAuthenticated,
    updateProfile: isAuthenticated,
  },
});

export { permissions };
