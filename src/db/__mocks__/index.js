const getUserByUsername = jest.fn((username) => {
  if (username === 'exists') {
    return {
      id: '1234',
      username: 'exists',
      passwordhash: '$2b$10$v5NKX/W63IsLjOOwVJ9bPOf9O8SLp3ioEm/OUo1c8yExlzW6tCDou',
    };
  }
  return undefined;
});

const createUser = jest.fn();

const storeRefreshToken = jest.fn();
const getRefreshToken = jest.fn((id) => {
  if (id === '1234') return { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiIxMjM0IiwidXNlcm5hbWUiOiJleGlzdHMiLCJpYXQiOjE1MTYyMzkwMjJ9.UtUmBzvod9dbYqykHf-ddJAJrwh4HSN5JWlwfiz0uCA' };

  return undefined;
});
const deleteRefreshToken = jest.fn();

module.exports = {
  getUserByUsername,
  createUser,
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
};
