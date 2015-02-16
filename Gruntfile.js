module.exports = function ( grunt ) {
  
  // Load required Grunt tasks. These are installed based on the versions listed
  // in "packages.json" when you do "npm install" in this directory.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');
  
  // load in out build configuration file.
  var userConfig = require('./build.config.js');
  
  // this is the configuration object Grunt uses to give each plugin its
  // instructions;.
  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),
    
    /**
     * The banned is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <% pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd" %>) %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * \n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },
    
    /**
     * Creates a changelod on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },
    
    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json",
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },
    
    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],
    
    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fontsm etc.) and javascripts into
     * `build-dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_app_assets: {
        files: [{
          src[ '**' ],
          dest: '<%= build_dir %>/assets/',
          cwd: 'src/assets',
          expand: true
        }]
      },
      build_vendor_assets: {
        files: [{
          src: [ '<%= vendor_files.assets %>' ],
          dest: '<%= build_dir %>/assets/',
          cwd: '.',
          expand: true,
          flatten: true
        }]
      },
      build_appjs: {
        files: [{
          src: ['<%= app_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      build_vendorjs : {
        files: [{
          src: ['<%= vendor_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      build_vendorcss: {
        files: [{
          src: ['<%= vendor_files.css %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      compile_assets: {
        files:[{
          src: ['**'],
          dest: '<%= combile_dir %>/assets',
          cwd: '<%%>'
        }, {
          src: ['<%= vendor_files_.css %>'],
          dest: '<%= compile_dir %>/',
          cwd: '.',
          expand: true
        }]
      }
    },
    
    /**
     * Concatenates multiple source files into a single file.
     */
    concat: {
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>'
          'module.prefix'
          '<%= build_dir %>/src/**/*.js'
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    
    coffee: {
      source: {
        option: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: ['<%= app_files.coffee %>'],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },
    
    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<% meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },
    
    /**
     * Defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our
     * unit tests are linted based on the polices listed in
     * `options`. But we can also specify exclusionary patterns by
     * prefixing them with an exclamation point (!); this is useful
     * when code comes from a third party but is nonetheless inside
     * `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<% app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly:true,
        immed:true,
        newcap:true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    
    /**
     * This does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in m-boilerplate, so we're
     * just using the defaults here.
     */
    coffeelint: {
      src: {
        files: {
          src: ['<%= app_files.coffee %>']
        }
      },
      test: {
        files:{
          src: ['<%= app_files.coffeunit %>']
        }
      }
    },
    
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continous: {
        singleRun: true
      }
    },
    
    /**
     * This task compiles the `index.html` file as a Grunt template.
     * CSS and JS files co-exist here but they get split apart later.
     */
    index: {
      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we
       * simply add all script files directly to the `<head>` of index.html.
       * The `src` property contains the list of included files.
       */
      build: {
        dir: '<% build_dir %>',
        src: [
          '<%= vendor_files.js %>'
          '<%= build_dir %>/src/**/*.js'
          '<%= vendor_files.css %>'
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },
      
      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file.
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>'
          '<%= vendor_files.css %>'
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },
    
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>'
          '<%= test_files.js %>'
        ]
      }
    },
    
    /**
     * For rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on. we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overriden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        liveroad: true
      },
      
      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded.
       */
      grunfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          liveroad: false
        }
      },
      
      /**
       * When out JavaScript source files change, we want to run lint then and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs']
      },
      
      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: ['coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs']
      },
      
      /**
       * When assets are changed, copy them. Note that this will *not* copy
       * new files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copu:build_app_assets', 'copy:build_vendor_assets']
      },
      
      /**
       * When our index.html change, we need to compile it.
       */
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:build']
      }
    }
  };
};
