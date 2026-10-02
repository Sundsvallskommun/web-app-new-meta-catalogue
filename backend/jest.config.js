const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const esmOnlyDependencies = ['htmlparser2', 'entities', 'domhandler', 'domutils', 'dom-serializer', 'domelementtype'];

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.m?js$': ['ts-jest', { isolatedModules: true, tsconfig: { allowJs: true, module: 'commonjs' } }],
  },
  transformIgnorePatterns: [`/node_modules/(?!(.*/)?(${esmOnlyDependencies.join('|')})/)`],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
};
