'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var wiredep = require('wiredep');
var yeoman = require('yeoman-generator');

var AppBasicGenerator = module.exports = function AppBasicGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'], callback: function () {
            this.mkdir('src/styles/bootstrap');
            this.emit('dependenciesInstalled');
        }.bind(this)});

        this.on('dependenciesInstalled', function () {
            wiredep({
                directory: 'public/vendor',
                bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
                exclude: [/sass-bootstrap/],
                src: 'index.html'
            });
        });
    });


};

util.inherits(AppBasicGenerator, yeoman.generators.Base);

AppBasicGenerator.prototype.setDefaults = function () {
    var baseSrc = 'src/';
    this.sourceDir = {
        scripts: baseSrc + 'scripts',
        styles: baseSrc + 'styles',
        templates: baseSrc + 'templates',
    };

    var baseDest = 'public/';
    this.destDir = {
        scripts: baseDest + 'scripts',
        styles: baseDest + 'styles',
        templates: baseDest + 'templates',
        vendor: baseDest + 'vendor',
    };
};

AppBasicGenerator.prototype.setupFolders = function () {
    this.mkdir('src');
    this.mkdir('src/templates');
    this.mkdir('src/styles');
    this.mkdir('src/scripts');

    this.mkdir('public');
    this.mkdir('public/vendor');
    this.mkdir('public/styles');
    this.mkdir('public/scripts');
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
    this.template('index.html', 'index.html');
    this.directory('styles', 'src/styles');
};
