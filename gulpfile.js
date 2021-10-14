
// Пути к папкам
const progect_folder = "dist";
const source_folder  = "#src";

const path={
    build:{
        html: progect_folder + "/",
        css: progect_folder + "/css/",
        js: progect_folder + "/js/",
        img: progect_folder + "/img/",
        fonts: progect_folder + "/fonts/",
        assets: progect_folder + "/assets/"
    },
    src:{
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
        assets: source_folder + "/assets/**"
    },
    watch:{
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        assets: source_folder + "/assets/**"
    },
    clear: "./" + progect_folder + "/",
    clear_assets: "./" + progect_folder + "/assets/**",
    clear_js: "./" + progect_folder + "/js/**"

};
// ./Пути к папкам

// Подключенные модули
const { src, dest } = require('gulp'),
    gulp            = require('gulp'),
    browsersync     = require('browser-sync').create(),
    fileinclude     = require('gulp-file-include'),
    del             = require('del'),
    scss            = require('gulp-sass')(require('sass')),
    autoprefixer    = require('gulp-autoprefixer'),
    gcmq            = require('gulp-group-css-media-queries'),
    cleanCSS        = require('gulp-clean-css'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify-es').default,
    imagemin        = require('gulp-imagemin'),
    webp            = require('gulp-webp'),
    webpHTML        = require('gulp-webp-html'),
    webpCss         = require('gulp-webp-css'),
    svgSprite       = require('gulp-svg-sprite'),
    ttf2woff        = require('gulp-ttf2woff'),
    ttf2woff2       = require('gulp-ttf2woff2'),
    fonter          = require('gulp-fonter');
    prettify        = require('gulp-html-prettify');
// ./Подключенные модули

// Обновление браузера при внесённых изименениях
function browserSync (params) {
    browsersync.init({
        server:{
            baseDir: "./" + progect_folder + "/"
        },
        port: 5501,
        notify: false
    })
};
// ./Обновление браузера при внесённых изименениях

// Оптимизация html
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webpHTML())
        .pipe(prettify({
            indent_char: ' ', 
            indent_size: 4
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream({stream: true}))
};
// ./Оптимизация html

// Оптимизация стилей
function css() {
    return src(path.src.css)
        .pipe(
            scss({ outputStyle: 'expanded' }).on('error', scss.logError) //compressed
        )
        .pipe(
            gcmq()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
			    cascade: true
		    })
        )
        .pipe(webpCss())
        .pipe(dest(path.build.css))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream({stream: true}))
};
// ./Оптимизация стилей

// Оптимизация скриптов
function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                suffix: ".min",
                extname: ".js"
            })
            )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream({stream: true}))
};
// ./Оптимизация скриптов

// Оптимизация изображний
function images() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3 //0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream({stream: true}))
};
// ./Оптимизация изображний

// Оптимизация шрифтов
function fonts() {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
};
// ./Оптимизация шрифтов

// Оптимизация html
function assets() {
    return src(path.src.assets)
        .pipe(dest(path.build.assets))
};
// ./Оптимизация html

// Конвертирование шрифта из otf в ttf запуск команды (gulp otf2ttf)
gulp.task('otf2ttf', function () {
    return gulp.src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(source_folder + "/fonts/"))
})
// ./Конвертирование шрифта из otf в ttf запуск команды (gulp otf2ttf)


// Конвертирование svg спрайты запуск (gulp svgSprite)
gulp.task('svgSprite', function () {
    return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: "../icons/icons.svg"
            }
        }
    }))
    .pipe(dest(path.build.img))
});
// ./Конвертирование svg спрайты запуск (gulp svgSprite)

// Слижение за изменениями в файлах
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.assets], assets);
    gulp.watch([path.watch.assets], clear_assets);
    gulp.watch([path.watch.js], clear_js);
};
// ./Слижение за изменениями в файлах

// Очистка build 
function clear() {
    return del(path.clear);
};
// ./Очистка build 

// Очистка assets 
function clear_assets() {
    return del(path.clear_assets, {force:true});
};
// ./Очистка assets 

// Очистка js 
function clear_js() {
    return del(path.clear_js, {force:true});
};
// ./Очистка js 

const build = gulp.series(clear, gulp.parallel(js, css, html, images, fonts, assets, clear_assets, clear_js));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.assets  = assets;
exports.fonts   = fonts;
exports.images  = images;
exports.js      = js;
exports.css     = css;
exports.html    = html;
exports.build   = build;
exports.watch   = watch;
exports.default = watch;
