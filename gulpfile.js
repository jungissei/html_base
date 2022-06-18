//----------------------------------------------------------------------
//  モード
//----------------------------------------------------------------------
'use strict';

//----------------------------------------------------------------------
//  モジュール読み込み
//----------------------------------------------------------------------
const { src, watch, dest, series, parallel } = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  rename   = require('gulp-rename'),
  uglify = require('gulp-uglify')
;


//----------------------------------------------------------------------
//  関数定義
//----------------------------------------------------------------------
// SCSS コンパイル
const compile_sass = () =>
  src(['./html/lib/**/*.scss', '!./html/lib/**/*.css', '!./html/lib/**/*.css'])
    // sourcemap初期化
    .pipe(sourcemaps.init())

    // watch中にエラーが発生してもwatchが止まらないようにする
    .pipe(plumber({
      outputStyle: 'compressed',
      errorHandler: notify.onError('<%= error.message %>')
    }))

    // sassのコンパイルをする(縮小 : compressed)
    .pipe(sass({
      includePaths: ['./html/lib']
    }))

    // ベンダープレフィックスを自動付与
    .pipe(autoprefixer())

    // sourcemapファイルを出力するパスを指定、書き込み
    .pipe(sourcemaps.write('./'))

    .pipe(dest('./html/lib'));

//JS
const minify_js = () =>
  src(['./html/lib/**/*.js', '!./html/lib/**/*.min.js'])

    // sourcemap初期化
    .pipe(sourcemaps.init())

    // watch中にエラーが発生してもwatchが止まらないようにする
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))

    // コード内の不要な改行やインデントを削除
    .pipe(uglify())

    // 拡張子変更
    .pipe(rename({extname: '.min.js'}))
    .pipe(dest('./html/lib'));

//----------------------------------------------------------------------
//  watch
//----------------------------------------------------------------------
const watch_sass = () =>
  watch(['./html/lib/**/*.scss', '!./html/lib/**/*.css', '!./html/lib/**/*.min.css'], compile_sass);

const watch_js = () =>
  watch(['./html/lib/**/*.js', '!./html/lib/**/*.min.js'], minify_js);


//----------------------------------------------------------------------
//  タスク定義
//----------------------------------------------------------------------
exports.compile = parallel(
  watch_sass,
  watch_js
);
