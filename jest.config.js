module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./util/setupTest.js'],
  transform: {
    '\\.m?jsx?$': 'babel-jest'
  },
  moduleFileExtensions: ['js'],
  transformIgnorePatterns: []
};
