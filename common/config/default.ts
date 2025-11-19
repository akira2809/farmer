export default {
  cookies: {
    sessionKey: 'sessionIdCookie',
    tokenKey: 'token',
  },
  revalidate: {
    short: 60,
    normal: 3600,
  },
};
