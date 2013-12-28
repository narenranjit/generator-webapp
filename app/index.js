'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs-extra');
var wiredep = require('wiredep');
var yeoman = require('yeoman-generator');

var AppBasicGenerator = module.exports = function (args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'], callback: function () {
            this.emit('dependenciesInstalled');
        }.bind(this)});
    });

    this.on('dependenciesInstalled', function wireDependencies() {
        wiredep({
            directory: this.destDir.vendor,
            bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
            exclude: [/sass-bootstrap/],
            ignorePath: this.baseDest,
            src: this.baseDest + 'index.html'
        });
    });

    this.on('dependenciesInstalled', function copyBootstrapFilesToSrc() {
        var bootstrapTarget = this.sourceDir.styles + '/bootstrap';
        fs.copy(process.cwd() + '/' + this.destDir.vendor + '/sass-bootstrap/lib', bootstrapTarget);
    }.bind(this));
};

util.inherits(AppBasicGenerator, yeoman.generators.Base);

AppBasicGenerator.prototype.setDefaults = function () {
    this.baseSrc = 'src/';
    this.sourceDir = {
        scripts: this.baseSrc + 'scripts',
        styles: this.baseSrc + 'styles',
        templates: this.baseSrc + 'templates',
    };

    this.baseDest = 'public/';
    this.destDir = {
        scripts: this.baseDest + 'scripts',
        styles: this.baseDest + 'styles',
        templates: this.baseDest + 'templates',
        vendor: this.baseDest + 'vendor',
    };
};

AppBasicGenerator.prototype.setupFolders = function () {
    var createDirs = function (parent, dirList) {
        this.mkdir(parent);
        Object.keys(dirList).forEach(function  (key) {
            this.mkdir(dirList[key]);
        }.bind(this));
    }.bind(this);

    createDirs(this.baseSrc, this.sourceDir);
    createDirs(this.baseDest, this.destDir);
};

AppBasicGenerator.prototype.copyTemplates = function () {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
};
AppBasicGenerator.prototype.copyDotFiles = function () {
    this.expand(__dirname + '/templates/dotfiles/*').forEach(function (path) {
        this.copy(path,  '.' + path.split('/').pop());
    }.bind(this));
};
AppBasicGenerator.prototype.copyGrunt = function () {
    this.template('_Gruntfile.js', 'Gruntfile.js');
};

AppBasicGenerator.prototype.copyInitialFiles = function () {
    this.template('index.html', this.baseDest + 'index.html');
    this.directory('styles', this.sourceDir.styles);
};
