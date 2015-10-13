import path from 'path';

import gulp from 'gulp';
import less from 'gulp-less';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import browserify from 'browserify';
import watchify from 'watchify';
import envify from 'envify/custom';
import babelify from 'babelify';

const inputPaths = {
  css: path.join('.', 'less', '**', '*.less'),
  js: {
    popup: path.join('.', 'popup', 'index.js'),
    options: path.join('.', 'options', 'index.js'),
    background: path.join('.', 'background', 'index.js')
  },
  font: [
    path.join('.', 'node_modules', 'bootstrap', 'fonts', '**'),
    path.join('.', 'node_modules', 'font-awesome', 'fonts', '**')
  ]
};

const commonOutputDir = path.join('.', 'ext');

const outputPaths = {
  css: path.join(commonOutputDir, 'css'),
  js: path.join(commonOutputDir, 'js'),
  font: path.join(commonOutputDir, 'fonts')
};

gulp.task('styles', ['styles:clean'], () =>
  gulp.src(inputPaths.css)
    .pipe(sourcemaps.init())
      .pipe(less())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputPaths.css))
);

gulp.task('styles:clean', callback => del([outputPaths.css], callback));

gulp.task('fonts:clean', callback => del([outputPaths.font], callback));

gulp.task('fonts', ['fonts:clean'], () =>
  gulp.src(inputPaths.font)
    .pipe(gulp.dest(outputPaths.font))
);

function scripts(entry) {
  let bundleStream = browserify({
     entries: entry,
//     extensions: ['.jsx'],
//     fullPaths: false,
//     builtins: ['buffer', 'crypto'],
//     insertGlobals: true,
//     detectGlobals: false,
     debug: true,

     cache: {},
     packageCache: {}
   })
     .transform(babelify)
     .transform(envify({ NODE_ENV: process.env.NODE_ENV || 'development' }), { global: true })

   return bundleStream;
}

function scriptTask(b, name) {
  return b.bundle()
    .pipe(source(name))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputPaths.js));
}

function defineScriptTask(name, entry, outFileName) {
  var script = scripts(entry);

  function bundle() {
    return scriptTask(script, outFileName)
  }

  const prefix = 'script:' + name

  gulp.task(prefix + ':clean', callback => del([path.join(outputPaths.js, outFileName)], callback));

  gulp.task(prefix, [prefix + ':clean'], bundle);

  gulp.task(prefix + ':watch', () => {
    script = watchify(script);
    script
      .on('update', bundle)
      .on('log', gutil.log);

    return bundle()
  })
}

defineScriptTask('popup', inputPaths.js.popup, 'popup.js')
defineScriptTask('options', inputPaths.js.options, 'options.js')
defineScriptTask('background', inputPaths.js.background, 'background.js')

gulp.task('styles:watch', () => {
  gulp.watch(inputPaths.css, ['styles']);
});

gulp.task('watch', () => gulp.start(['styles:watch', 'script:popup:watch', 'script:options:watch', 'script:background:watch']))

gulp.task('default', () => gulp.start(['fonts', 'styles', 'script:popup', 'script:options', 'script:background']))
