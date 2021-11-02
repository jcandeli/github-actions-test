module.exports = {
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: ["src/components/**/*.{js,jsx}"],
  coverageReporters: ["clover", "json", "text-summary"],
  coverageThreshold: {
    "./src/components/": {
      branches: 75,
      functions: 75,
      lines: 75,
    },
  },
};
