/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          rootDir: "./src",
          module: "commonjs",
          target: "ES2020",
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          types: ["node", "jest"],
        },
      },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
    "!src/prisma/client.ts",
    "!src/types/**",
  ],
};
