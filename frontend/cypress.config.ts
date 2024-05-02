import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    userEmail: 'karin.andersson@example.com',
    userPassword: 'password',
    apiUrl: 'http://localhost:3001',
  },

  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    baseUrl: 'http://localhost:3000',
    video: false,
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
  },
});
