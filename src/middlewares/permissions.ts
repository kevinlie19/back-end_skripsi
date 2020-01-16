import { rule, shield } from 'graphql-shield';

let isAuthenticated = rule()(async (_, __, ctx) => {
  return ctx.userId != '';
});

let permissions = shield({
  Query: {
    avatars: isAuthenticated,
    myProfile: isAuthenticated,
  },
  Mutation: {
    addToAvatarCollection: isAuthenticated,
    updateProfile: isAuthenticated,
  },
});

export { permissions };
