module.exports = {
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: ["src/components/**/*.{js,jsx}"],
  coverageReporters: ["clover", "json", "text-summary"],
  coverageThreshold: {
    "./src/components/": {
      branches: 10,
      functions: 10,
      lines: 10,
    },
  },
};
