// karma.conf.js - Angular 21 Compatible Configuration
module.exports = function(config) {
  config.set({
    // Base path for resolving files
    basePath: '',
    
    // Testing frameworks to use
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    
    // Plugins required for Angular testing with Karma
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    
    // Client configuration
    client: {
      jasmine: {
        // Disable random test execution for easier debugging
        random: false,
        // Timeout for async tests (ms)
        timeoutInterval: 10000
      },
      // Keep test results visible in browser
      clearContext: false
    },
    
    // Test results reporters
    reporters: ['progress', 'kjhtml', 'coverage'],
    
    // Code coverage configuration
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },        // HTML report
        { type: 'text-summary' }, // Console summary
        { type: 'lcovonly' }      // LCOV format for CI/CD
      ],
      // Optional: Set coverage thresholds
      check: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    },
    
    // Test port
    port: 9876,
    
    // Enable colors in output
    colors: true,
    
    // Log level (LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG)
    logLevel: config.LOG_INFO,
    
    // Watch files for changes and re-run tests
    autoWatch: true,
    
    // Browsers to launch
    browsers: ['Chrome'],
    
    // Continuous Integration mode (exit after tests finish)
    singleRun: false,
    
    // Restart Karma when config files change
    restartOnFileChange: true,
    
    // Browser connection timeout
    browserNoActivityTimeout: 60000,
    
    // Capture timeout
    captureTimeout: 60000
  });
};