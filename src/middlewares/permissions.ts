import { rule, shield } from 'graphql-shield';

let isAuthenticated = rule()(async (_, __, ctx) => {
  return ctx.userId != '';
});

let permissions = shield({
  Query: {
    avatars: isAuthenticated,
    checkPassword: isAuthenticated,
    leaderboard: isAuthenticated,
    myProfile: isAuthenticated,
    otherProfile: isAuthenticated,
    questions: isAuthenticated,
  },
  Mutation: {
    addToAvatarCollection: isAuthenticated,
    createQuestion: isAuthenticated,
    updateProfile: isAuthenticated,
  },
});

export { permissions };
