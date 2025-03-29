import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './',
});

// Jest Configration.
const config = {
    coverageProvider: 'v8',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    preset: 'ts-jest',
    moduleDirectories: ['node_modules', 'app'],
};

export default createJestConfig(config);
