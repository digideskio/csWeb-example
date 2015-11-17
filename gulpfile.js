var gulp          = require('gulp');
var tsconfig      = require('gulp-tsconfig-files');
var exec          = require('child_process').execSync;
var install       = require('gulp-install');
var runSequence   = require('run-sequence');
var del           = require('del');
var uglify        = require('gulp-uglify');
var useref        = require('gulp-useref');
var rename        = require('gulp-rename');
var debug         = require('gulp-debug');
var concat        = require('gulp-concat');
var plumber       = require('gulp-plumber');
var watch         = require('gulp-watch');
var changed       = require('gulp-changed');
var templateCache = require('gulp-angular-templatecache');
var deploy        = require('gulp-gh-pages');
var purify        = require('gulp-purifycss');
var concatCss     = require('gulp-concat-css');

function run(command, cb) {
  console.log('Run command: ' + command);
  try {
    exec(command);
    cb();
  } catch (err) {
    console.log('### Exception encountered on command: ' + command);
    console.log(err.stdout.toString());
    console.log('####################################');
    cb();
    throw err;
  }
}

/** Create a new distribution by copying all required files to the dist folder. */
gulp.task('create_dist', function() {
    var dest = 'dist/';

    // Copy client side files
    // Copy app, images, css, data and swagger
    gulp.src('public/app/**/*.js*')
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/app/'));
    gulp.src('public/css/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/css/'));
    gulp.src('public/data/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/data/'));
    gulp.src('public/swagger/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/swagger/'));
    gulp.src('./public/images/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/images/'));
    // Copy index files and favicon        
    gulp.src(['./public/*.html', './public/favicon.ico', './public/mode-json.js'])
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/'));
    // Copy bower components of csweb, and others (ignoring any linked csweb files)
    gulp.src('public/bower_components/csweb/dist-bower/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/bower_components/csweb/dist-bower/'));
    gulp.src(['public/bower_components/**/*.*', '!public/bower_components/csweb/**/*.*'])
        .pipe(plumber())
        .pipe(gulp.dest(dest + 'public/bower_components/'));

    // Copy server side files
    gulp.src(['./server.js', './server.js.map', './configuration.json', './LICENSE'])
        .pipe(plumber())
        .pipe(gulp.dest(dest));
    // Copy npm modules of csweb, and others (ignoring any linked csweb files)
    gulp.src('node_modules/csweb/node_modules/async/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/async/'))
        .pipe(gulp.dest(dest + 'node_modules/async/'));
    gulp.src('node_modules/csweb/node_modules/bcryptjs/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/bcryptjs/'))
        .pipe(gulp.dest(dest + 'node_modules/bcryptjs/'));
    gulp.src('node_modules/csweb/node_modules/body-parser/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/body-parser/'))
        .pipe(gulp.dest(dest + 'node_modules/body-parser/'));
    gulp.src('node_modules/csweb/node_modules/cors/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/cors/'))
        .pipe(gulp.dest(dest + 'node_modules/cors/'));
    gulp.src('node_modules/csweb/node_modules/express/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/express/'))
        .pipe(gulp.dest(dest + 'node_modules/express/'));
    gulp.src('node_modules/csweb/node_modules/fs-extra/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/fs-extra/'))
        .pipe(gulp.dest(dest + 'node_modules/fs-extra/'));
    gulp.src('node_modules/csweb/node_modules/jwt-simple/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/jwt-simple/'))
        .pipe(gulp.dest(dest + 'node_modules/jwt-simple/'));
    gulp.src('node_modules/csweb/node_modules/kerberos/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/kerberos/'))
        .pipe(gulp.dest(dest + 'node_modules/kerberos/'));
    gulp.src('node_modules/csweb/node_modules/mongodb/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/mongodb/'))
        .pipe(gulp.dest(dest + 'node_modules/mongodb/'));
    gulp.src('node_modules/csweb/node_modules/mqtt/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/mqtt/'))
        .pipe(gulp.dest(dest + 'node_modules/mqtt/'));
    gulp.src('node_modules/csweb/node_modules/mqtt-router/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/mqtt-router/'))
        .pipe(gulp.dest(dest + 'node_modules/mqtt-router/'));
    gulp.src('node_modules/csweb/node_modules/proj4/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/proj4/'))
        .pipe(gulp.dest(dest + 'node_modules/proj4/'));
    gulp.src('node_modules/csweb/node_modules/serve-favicon/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/serve-favicon/'))
        .pipe(gulp.dest(dest + 'node_modules/serve-favicon/'));
    gulp.src('node_modules/csweb/node_modules/sift/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/sift/'))
        .pipe(gulp.dest(dest + 'node_modules/sift/'));
    gulp.src('node_modules/csweb/node_modules/socket.io/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/socket.io/'))
        .pipe(gulp.dest(dest + 'node_modules/socket.io/'));
    gulp.src('node_modules/csweb/node_modules/underscore/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/underscore/'))
        .pipe(gulp.dest(dest + 'node_modules/underscore/'));
    gulp.src('node_modules/csweb/node_modules/chokidar/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/chokidar/'))
        .pipe(gulp.dest(dest + 'node_modules/chokidar/'));
    gulp.src('node_modules/csweb/node_modules/winston/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/winston/'))
        .pipe(gulp.dest(dest + 'node_modules/winston/'));
    gulp.src('node_modules/csweb/node_modules/xml2js/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/xml2js/'))
        .pipe(gulp.dest(dest + 'node_modules/xml2js/'));
    gulp.src('node_modules/csweb/node_modules/lru-cache/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/lru-cache/'))
        .pipe(gulp.dest(dest + 'node_modules/lru-cache/'));
    gulp.src('node_modules/csweb/node_modules/request/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/request/'))
        .pipe(gulp.dest(dest + 'node_modules/request/'));
    return gulp.src('node_modules/csweb/dist-npm/**/*.*')
        .pipe(plumber())
        .pipe(changed(dest + 'node_modules/csweb/dist-npm/'))
        .pipe(gulp.dest(dest + 'node_modules/csweb/dist-npm/'));
    // gulp.src(['node_modules/**/*.*', '!node_modules/csweb/**/*.*'])
    //     .pipe(plumber())
    //     .pipe(gulp.dest(dest + 'node_modules/'));
});

gulp.task('example_tsconfig_files', function() {
  return gulp.src(['./**/*.ts',
            '!./node_modules/**/*.ts',
            '!./dist/**/*.*',
            '!./public/bower_components/**/*.d.ts',
        ],
      {base: ''})
    .pipe(tsconfig({
      path:         'tsconfig.json',
      relative_dir: '',
    }));
});

gulp.task('example_tsc', function(cb) {
  return run('tsc -p .', cb);
});

// Run required npm and bower installs for example folder
gulp.task('example_deps', function(cb) {
  return gulp.src([
      './package.json',       // npm install
      './public/bower.json',  // bower install
    ])
    .pipe(install(cb));
});

gulp.task('init', function(cb) {
  runSequence(
    'example_tsconfig_files',
    'example_tsc',
    cb
  );
});

// Gulp task upstream...
// Configure gulp scripts
// Output application name
var appName    = 'csWebApp';
var path2csWeb = './../csWeb';


gulp.task('clean', function(cb) {
    // NOTE Careful! Removes all generated javascript files and certain folders.
    del([
        path2csWeb + 'dist',
        path2csWeb + 'public/**/*.js',
        path2csWeb + 'public/**/*.js.map'
    ], {
        force: true
    }, cb);
});

gulp.task('deploy-githubpages', function() {
    return gulp.src('dist/public/**/*')
        .pipe(deploy({
            branch: 'master',
            cacheDir: '.deploy'
        }));
});

gulp.task('gh_pages', function() {
    // Create a distribution for the GitHub Pages.
    // Basically the same as the create_dist function, except that a different output folder is used.
    // http://yeoman.io/learning/deployment.html
    console.log('Creating distribution for GitHub Pages');
    console.log('Use the following command to push the gh_pages folder to gh-pages.');
    console.log('git subtree push --prefix example/gh_pages origin gh-pages');
    gulp.src('public/images/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/images/'));

    gulp.src('public/bower_components/angular-utils-pagination/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/bower_components/angular-utils-pagination/'));

    gulp.src(path2csWeb + 'csComp/includes/images/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/cs/images/'));

    gulp.src('public/data/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/data/'));

    gulp.src('public/cs/css/ROsanswebtextregular.ttf')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/css/'));

    gulp.src('public/cs/js/cesium.js')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/cs/js/'));

    gulp.src('public/bower_components/Font-Awesome/fonts/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('gh_pages/fonts/'));

    var assets = useref.assets();

    return gulp.src('public/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('gh_pages/'));
});

gulp.task('create_distxx', function() {
    gulp.src(path2csWeb + 'example/public/images/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/images/'));

    gulp.src(path2csWeb + 'example/public/bower_components/angular-utils-pagination/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/bower_components/angular-utils-pagination/'));

    gulp.src(path2csWeb + 'csComp/includes/images/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/cs/images/'));

    gulp.src(path2csWeb + 'example/public/data/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/data/'));

    gulp.src(path2csWeb + 'example/public/cs/css/ROsanswebtextregular.ttf')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/css/'));

    gulp.src(path2csWeb + 'example/public/cs/js/cesium.js')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/cs/js/'));

    gulp.src(path2csWeb + 'example/public/bower_components/Font-Awesome/fonts/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/fonts/'));

    var assets = useref.assets();

    return gulp.src(path2csWeb + 'example/public/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/'));
});

gulp.task('create_dist_of_server', function() {
    gulp.src(path2csWeb + 'example/node_modules/express/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/express/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/express/'));
    gulp.src(path2csWeb + 'example/node_modules/body-parser/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/body-parser/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/body-parser/'));
    gulp.src(path2csWeb + 'example/node_modules/serve-favicon/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/serve-favicon/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/serve-favicon/'));
    gulp.src(path2csWeb + 'example/node_modules/proj4/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/proj4/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/proj4/'));
    gulp.src(path2csWeb + 'example/node_modules/socket.io/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/socket.io/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/socket.io/'));
    gulp.src(path2csWeb + 'example/node_modules/chokidar/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/chokidar/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/chokidar/'));
    gulp.src(path2csWeb + 'example/node_modules/pg/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/pg/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/pg/'));
    gulp.src(path2csWeb + 'example/node_modules/winston/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/winston/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/winston/'));
    gulp.src(path2csWeb + 'example/node_modules/sqlite3/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/sqlite3/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/sqlite3/'));
    gulp.src(path2csWeb + 'example/node_modules/async/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/async/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/async/'));
    gulp.src(path2csWeb + 'example/node_modules/ws/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/ws/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/ws/'));
    gulp.src(path2csWeb + 'example/node_modules/bcryptjs/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/bcryptjs/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/bcryptjs/'));
    gulp.src(path2csWeb + 'example/node_modules/cors/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/cors/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/cors/'));
    gulp.src(path2csWeb + 'example/node_modules/fs-extra/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/fs-extra/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/fs-extra/'));
    gulp.src(path2csWeb + 'example/node_modules/jwt-simple/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/jwt-simple/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/jwt-simple/'));
    gulp.src(path2csWeb + 'example/node_modules/request/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/request/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/request/'));
    gulp.src(path2csWeb + 'example/node_modules/underscore/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/node_modules/underscore/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/node_modules/underscore/'));
    gulp.src(path2csWeb + 'example/ServerComponents/**/*.*')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/ServerComponents/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/ServerComponents/'));
    gulp.src(path2csWeb + 'example/server.js')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/'));
    gulp.src(path2csWeb + 'example/configuration.json')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/'));
    gulp.src(path2csWeb + 'example/public/favicon.ico')
        .pipe(plumber())
        .pipe(changed(path2csWeb + 'example/dist/public/'))
        .pipe(gulp.dest(path2csWeb + 'example/dist/public/'));
});

gulp.task('create_dist_of_client_and_server', ['create_dist', 'create_dist_of_server']);

gulp.task('minify_csComp', function() {
    // gulp.src(path2csWeb + 'csComp/dist-bower.js')
    //    .pipe(plumber())
    //    .pipe(gulp.dest('public/js/cs'));
    gulp.src(path2csWeb + 'example/public/js/cs/csComp.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path2csWeb + 'example/public/cs/js'));
});

gulp.task('include_js', function() {
    gulp.src(path2csWeb + 'csComp/includes/js/**/*.*')
        // .pipe(debug({
        //     title: 'include_js:'
        // }))
        .pipe(plumber())
        //.pipe(changed('./public/cs/js/'))
        .pipe(gulp.dest(path2csWeb + 'example/public/cs/js'))
        .pipe(gulp.dest(path2csWeb + 'dist-bower/js'));
});

gulp.task('include_css', function() {
    gulp.src(path2csWeb + 'csComp/includes/css/*.*')
        .pipe(plumber())
        //.pipe(changed('./public/cs/css/'))
        .pipe(gulp.dest(path2csWeb + 'example/public/cs/css'))
        .pipe(gulp.dest(path2csWeb + 'dist-bower/css'));
});

gulp.task('include_images', function() {
    gulp.src(path2csWeb + 'csComp/includes/images/**/*.*')
        .pipe(plumber())
        //.pipe(changed('./public/cs/images/'))
        .pipe(gulp.dest(path2csWeb + 'example/public/cs/images/'))
        .pipe(gulp.dest(path2csWeb + 'dist-bower/images'));
});

gulp.task('watch', function() {
    gulp.watch(path2csWeb + 'csServerComp/ServerComponents/**/*.js', ['copy_csServerComp']);
    gulp.watch(path2csWeb + 'csServerComp/Scripts/**/*.ts', ['copy_csServerComp_scripts']);
    //gulp.watch(path2csWeb + 'csServerComp/ServerComponents/**/*.d.ts', ['built_csServerComp.d.ts']);
    gulp.watch(path2csWeb + 'csServerComp/ServerComponents/dynamic/ClientConnection.d.ts', ['built_csServerComp.d.ts']);

    gulp.watch(path2csWeb + 'csComp/includes/**/*.scss', ['sass']);
    gulp.watch(path2csWeb + 'csComp/js/**/*.js', ['built_csComp']);
    gulp.watch(path2csWeb + 'csComp/js/**/*.d.ts', ['built_csComp.d.ts']);
    gulp.watch(path2csWeb + 'csComp/**/*.tpl.html', ['create_templateCache']);
    gulp.watch(path2csWeb + 'csComp/includes/**/*.css', ['include_css']);
    gulp.watch(path2csWeb + 'csComp/includes/**/*.js', ['include_js']);
    gulp.watch(path2csWeb + 'csComp/includes/images/*.*', ['include_images']);
});

gulp.task('all', ['create_templateCache', 'copy_csServerComp', 'built_csServerComp.d.ts', 'copy_csServerComp_scripts', 'built_csComp', 'built_csComp.d.ts', 'include_css', 'include_js', 'include_images', 'copy_example_scripts', 'sass']);

gulp.task('deploy', ['create_dist', 'deploy-githubpages']);

gulp.task('default', ['all', 'watch']);
