const getUserByUsername = jest.fn((username) => {
  if (username === 'exists') {
    return {
      id: '1234',
      username: 'exists',
      passwordHash: '$2b$10$v5NKX/W63IsLjOOwVJ9bPOf9O8SLp3ioEm/OUo1c8yExlzW6tCDou',
    };
  }
  return undefined;
});

const createUser = jest.fn();

module.exports = {
  getUserByUsername,
  createUser,
};
