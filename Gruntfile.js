module.exports = (grunt) => {
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    // Configure mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          // Optionally capture the reporter output to a file
          // captureFile: 'results.txt', 
          // Optionally suppress output to standard out (defaults to false)
          quiet: false, 
          // Optionally clear the require cache before running tests (defaults to false)
          // clearRequireCache: false, 
          // Optionally defines which files should keep in cache
          // clearCacheFilter: (key) => true, 
          // Optionally set to not fail on failed tests (will still fail on other errors)
          // noFail: false 
        },
        src: ['test/*.js']
      }
    } 
  });

  grunt.registerTask('default', 'mochaTest');
};

