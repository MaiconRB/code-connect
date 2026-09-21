export const jwtConstants = {
  secret:
    process.env.JWT_SECRET ||
    'code-connect-super-secret-jwt-key-for-development-change-in-production',
};
