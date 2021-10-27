// Custom config for Jest
// We need special configuration to handle css modules and SVGS.
// We have a special mock of the app.json file used for tests so that we can avoid the environment lookup

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    appConfig: '<rootDir>/config/app.test.json',
    '^.+\\.svg$': 'jest-svg-transformer',
    '\\.(jpg|ico|jpeg|png)$': '<rootDir>/src/helpers/__mocks__/files'
  }
};