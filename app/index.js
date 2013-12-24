'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var AppBasicGenerator = module.exports = function AppBasicGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppBasicGenerator, yeoman.generators.Base);

// AppBasicGenerator.prototype.askFor = function askFor() {
//     var cb = this.async();

//     var prompts = [{
//         name: 'appname',
//         message: 'What\'s your project called?'
//     }];

//     // this.prompt(prompts, function (props) {
//     //     this.appname = props.appname;

//     //     cb();
//     // }.bind(this));
// };
AppBasicGenerator.prototype.setDefaults = function app() {
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

AppBasicGenerator.prototype.setupFolders = function app() {
    this.mkdir('src');
    this.mkdir('src/templates');
    this.mkdir('src/styles');
    this.mkdir('src/scripts');

    this.mkdir('public');
    this.mkdir('public/vendor');
    this.mkdir('public/styles');
    this.mkdir('public/scripts');
};

AppBasicGenerator.prototype.copyTemplates = function app() {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
};
AppBasicGenerator.prototype.copyDotFiles = function projectfiles() {
    this.expand(__dirname + '/templates/dotfiles/*').forEach(function (path) {
        this.copy(path,  '.' + path.split('/').pop());
    }.bind(this));
};
AppBasicGenerator.prototype.copyGrunt = function projectfiles() {
    this.template('_Gruntfile.js', 'Gruntfile.js');
};

AppBasicGenerator.prototype._injectDependencies = function _injectDependencies() {
    // var howToInstall = '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
    //     '\nyour HTML by running:' +
    //     '\n' + chalk.yellow.bold('\n  grunt bower-install');

    // if (this.options['skip-install']) {
    //     console.log(howToInstall);
    // }
    // else {
    //     wiredep({
    //         directory: 'app/bower_components',
    //         bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
    //         ignorePath: 'app/',
    //         htmlFile: 'app/index.html',
    //         cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
    //     });
    // }
};
