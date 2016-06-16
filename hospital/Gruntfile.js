module.exports = function (grunt) {
  grunt.initConfig({
    //Preprocesador css
    stylus: {
      compile: {
        options: {
          compress: true,
          linenos: false
        },
        files: [{
          'www/css/index.css': 'stylus/index.styl',
        }]
      }
    },
    // Compresor de .js
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: false
          //quitar console.log
        }
      },
      js: {
        files: {
          'www/js/index.js': 'javascript/*.js',
        }
      }
    },
    // Compilar Jade
    jadephp: {
      compile: {
        options: {
          client: false,
          pretty: true,
          basedir: 'jade',
          filename: 'base'
        },
        files: {
          'www/index.html': 'jade/index.jade'
        }
      }
    },
    //Observar cambios
    watch: {
      options: {
        nospawn: false,
        livereload: true
      },
      //observar de stylus
      stylesheets: {
        files: ['stylus/*.styl'],
        tasks: ['stylus']
      },
      //observar de js
      scripts: {
        files: ['javascript/*.js'],
        tasks: ['uglify']
      },
      //observar el jade
      jadephp: {
        files: ["jade/*.jade"],
        tasks: ["jadephp"]
      }
    },
    //Notificaciones
    notify: {
      uglify: {
        options: {
          enabled: true,
          max_jshint_notifications: 1,
          message: "uglify iniciado!"
        }
      },
      jadephp: {
        options: {
          enabled: true,
          max_jshint_notifications: 1,
          message: "jade iniciado!"
        }
      },
      stylus: {
        options: {
          enabled: true,
          max_jshint_notifications: 1,
          message: "stylus iniciado!"
        }
      }
    },
    //Server PHP
    php: {
      dist: {
        options: {
          hostname: 'localhost',
          port: 8000,
          base: 'www', // Project root
          keepalive: false,
          open: false,
          directives: {
            'error_log': require('path').resolve('logs/error.log')
          }
        }
      }
    },
    //BrowserSync
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'stylus/*.styl',
            'jade/*.jade',
            'javascript/*.js',
          ]
        },
        options: {
          watchTask: true,
          server: './www',
          notify: false,
          //startPath: '',
          //reloadDelay: 2000,
          //injectChanges: true,
          reloadOnRestart: true,
          ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
          }
        }
      }
    },
    ftp_push: {
      principal: {
        options: {
          host: 'dominio.com',
          dest: '/web/', //a donde subirá
          username: 'usuario',
          password: 'contraseña',
          debug: false // Show JSFTP Debugging information
        },
        files: [
          {
            expand: true,
            cwd: './www', //desde donde
            src: ['**'] // un solo (*) envia solo archivos dos (**) envia archivos y carpetas
          }
        ]
      }
    }
  });

  //Cargamos todos los tasks declarados en package.json
  require('load-grunt-tasks')(grunt);
  // Defino las tareas.
  grunt.registerTask('default', ['stylus', 'uglify', 'jadephp', 'notify', 'browserSync', 'watch']);
  //grunt.registerTask('default', ['stylus', 'uglify', 'jadephp', 'notify', 'php:dist', 'browserSync', 'watch']);
  grunt.registerTask('ftp', ['ftp_push:principal']);
};