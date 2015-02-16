/**
 * This file/module contains all configuration for the build process
 */
module.exports = {
  /**
   * The `build_dir` folder is where our project are compiled during development.
   */
  build_dir: 'build',
  
  /**
   * The `compile_dir` folder is where our app resides once it's completely built.
   */
  compile_dir: 'bin',
  
  app_files: {
    js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js']
  },
  
  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: []
  },
  
  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all standardized
   * files are collected for compilation, it is the user's job to ensure
   * non-standardized (i.e vendor-related) files are handled appropriately in
   * `vendor_files.js`
   */
  vendor_files: {
    /**
     * The `vendor_files.js` property holds files to be automatically concatenated
     * and minified with out project source files.
     */
    js: [
      'vendor/mithril/mithril.js'
    ],
    
    /**
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     */
    css: [
    ],
    
    /**
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not recommended
     * that you use wildcards.
     */
    assets: [
    ]
  }
};