module.exports = function(grunt) {

  var htmlminProd = {
    collapseBooleanAttributes: false,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true, // Only if you don't use comment directives!
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  };

  var distDir = 'dist';

  var mainBanner = '\
     /*!                                                                                           \n\
      * This file is protected by Copyright. Please refer to the COPYRIGHT file                    \n\
      * distributed with this source distribution.                                                 \n\
      *                                                                                            \n\
      * This file is part of Angular-REDHAWK <%= pkg.name %>.                                              \n\
      *                                                                                            \n\
      * Angular-REDHAWK <%= pkg.name %> is free software: you can redistribute it and/or modify it         \n\
      * under the terms of the GNU Lesser General Public License as published by the               \n\
      * Free Software Foundation, either version 3 of the License, or (at your                     \n\
      * option) any later version.                                                                 \n\
      *                                                                                            \n\
      * Angular-REDHAWK <%= pkg.name %> is distributed in the hope that it will be useful, but WITHOUT     \n\
      * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or                      \n\
      * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License               \n\
      * for more details.                                                                          \n\
      *                                                                                            \n\
      * You should have received a copy of the GNU Lesser General Public License                   \n\
      * along with this program.  If not, see http://www.gnu.org/licenses/.                        \n\
      *                                                                                            \n\
      * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>          \n\
      */                                                                                           \n\
     ';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: 'scripts/vendor'
        },
        files: {
          'jQuery/dist/jquery.js'                  : 'jQuery/dist/jquery.js',
          'bootstrap-css/js/bootstrap.js'          : 'bootstrap-css/js/bootstrap.js',
          'bytebuffer/dist/ByteBufferAB.js'        : 'bytebuffer/dist/ByteBufferAB.js',
          'protobuf/dist/ProtoBuf.js'              : 'protobuf/dist/ProtoBuf.js',

          'angular/angular.js'                     : 'angular/angular.js',
          'angular-animate/angular-animate.js'     : 'angular-animate/angular-animate.js',
          'angular-bootstrap/ui-bootstrap-tpls.js' : 'angular-bootstrap/ui-bootstrap-tpls.js',
          'angular-recursion/angular-recursion.js' : 'angular-recursion/angular-recursion.js',
          'angular-route/angular-route.js'         : 'angular-route/angular-route.js',
          'angular-resource/angular-resource.js'   : 'angular-resource/angular-resource.js',
          'angular-toastr/dist/angular-toastr.js'  : 'angular-toastr/dist/angular-toastr.js',
          'angular-touch/angular-touch.js'         : 'angular-touch/angular-touch.js',
          'angular-ui-router/release/angular-ui-router.js'  : 'angular-ui-router/release/angular-ui-router.js',

          'bootstrap-css/css/bootstrap.css'        : 'bootstrap-css/css/bootstrap.css',
          'angular-toastr/dist/angular-toastr.css' : 'angular-toastr/dist/angular-toastr.css'
        }
      },
      bootstrap_map: {
        options: { destPrefix: distDir },
        files:   { 'bootstrap.css.map' : 'bootstrap-css/css/bootstrap.css.map' }
      },
      bootstrap_fonts: {
        options: { destPrefix: 'fonts' },
        files:   { '' : 'bootstrap-css/fonts/*' }
      },
      angular_ui_router_map: {
        options: { destPrefix: distDir },
        files:   {'angular-ui-router.js.map': 'angular-ui-router/release/angular-ui-router.js.map'}
      }
    },
    bower: {
      dev: {
        options: {
          copy: false,
          install: true,
          cleanBowerDir: false
        }
      }
    },

    // Clean the dist directory and the generated templates file.
    clean: [distDir, 'fonts', '<%= ngtemplates.directives.dest %>'],

    // Copy images to the dist folder.
    copy: {
      images : {
        files: [
          {
            expand  : true,
            cwd     : 'images',
            dest    : distDir + '/images',
            src     : [ '*.{png,svg,jpg}' ]
          },
          {
            expand  : true,
            cwd     : 'src',
            dest    : distDir,
            src     : [ '**/*.{png,svg,jpg}' ]
          }
        ]
      }
    },

    // Reusable directives and templates
    ngtemplates: {
      directives: {
        cwd: 'src',
        src: 'directives/**/*.html',
        dest: 'scripts/templates.js',
        options: {
          concat: 'dist',
          module: 'redhawk.directives'
        }
      },
      arKit: {
        cwd: 'src',
        src: 'ar-kit/**/*.html',
        dest: 'scripts/ar-kit-templates.js',
        options: {
          concat: 'dist',
          module: 'redhawk.ar-kit'
        }
      }
    },

    // Concatenate JS and CSS files for simpler inclusion
    concat: {
      options: {
        stripBanners: true,
        banner: mainBanner
      },
      dist: {
        src: [
          'src/def.js',     // Ensure top module definitions appears first.
          'src/**/def.js',  // Then other top modules
          'src/**/*.js', 
          'lib/**/*.js'
        ],
        dest: distDir + '/<%= pkg.name %>.js',
      },
      distCss: {
        src: [
          'src/**/*.css'
        ],
        dest: distDir + '/<%= pkg.name %>.css',
      },
      vendorJs: {
        src: [
          'scripts/vendor/jQuery/dist/jquery.js',
          'scripts/vendor/bootstrap-css/js/bootstrap.js',
          'scripts/vendor/bytebuffer/dist/ByteBufferAB.js',
          'scripts/vendor/protobuf/dist/ProtoBuf.js',

          'scripts/vendor/angular/angular.js', 
          'scripts/vendor/angular-animate/angular-animate.js', 
          'scripts/vendor/angular-bootstrap/ui-bootstrap-tpls.js', 
          'scripts/vendor/angular-recursion/angular-recursion.js', 
          'scripts/vendor/angular-route/angular-route.js',
          'scripts/vendor/angular-resource/angular-resource.js', 
          'scripts/vendor/angular-toastr/dist/angular-toastr.js',
          'scripts/vendor/angular-touch/angular-touch.js',
          'scripts/vendor/angular-ui-router/release/angular-ui-router.js'
        ],
        dest: distDir + '/vendor.js'
      },
      vendorCss: {
        src: [
          'scripts/vendor/bootstrap-css/css/bootstrap.css',
          'scripts/vendor/angular-toastr/dist/angular-toastr.css'
        ],
        dest: distDir + '/vendor.css'
      }
    },
    uglify: {
      options: {
          report: 'min',
          mangle: false,
          preserveComments: 'some'
      },
      min: {
        files: {
          'dist/<%= pkg.name %>.min.js': [ distDir + '/<%= pkg.name %>.js'],
          'dist/vendor.min.js' : [ distDir + '/vendor.js' ]
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('default', ['clean', 'copy', 'bower', 'ngtemplates', 'bowercopy', 'concat', 'uglify']);
};
