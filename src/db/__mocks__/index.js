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
  if (id === '1234') return 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMzQiLCJ1c2VybmFtZSI6ImV4aXN0cyJ9.ioj2N0kWwS3lB9vr_magnS4fYZL3DPBTerFAPq6RblI';

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
