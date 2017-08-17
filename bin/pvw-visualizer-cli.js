#! /usr/bin/env node

var fs = require('fs'),
    shell = require('shelljs'),
    path = require('path'),
    program = require('commander'),
    paraview = process.env.PARAVIEW_HOME,
    pkg = require('../package.json'),
    version = /semantically-release/.test(pkg.version) ? 'development version' : pkg.version;

function quotePath(str) {
  return '"' + str + '"';
}

program
  .version(version)
  .option('-p, --port [8080]', 'Start web server with given port', 8080)
  .option('-d, --data [directory]', 'Data directory to serve')
  .option('-s, --server-only', 'Do not open the web browser\n')

  .option('--paraview [path]', 'Provide the ParaView root path to use\n')

  .option('--load-file [fileToLoad]', 'File to load using data base path as root')
  .option('--exclude-regex [excludeRegex]', 'Regular expression for file filtering')
  .option('--group-regex [groupRegex]', 'Regular expression for grouping files')
  .option('--plugins [pluginList]', 'List of fully qualified path names to plugin objects to load')
  .option('--proxies [proxyFile]', 'Path to a file with json text containing filters to load')
  .option('--no-auto-readers', 'If provided, disables ability to use non-configured readers\n')

  .option('--viewport [1x2560x1440]', 'Configure viewport {scale}x{maxWidth}x{maxHeight}')

  .parse(process.argv);

// Try to find a paraview directory inside /Applications or /opt
const pvPossibleBasePath = [];
['/Applications', '/opt', '/usr/local/opt/'].forEach(function (directoryPath) {
  shell.ls(directoryPath).forEach(function (fileName) {
    if (fileName.toLowerCase().indexOf('paraview') !== -1) {
      pvPossibleBasePath.push(path.join(directoryPath, fileName));
    }
  });
});

if(!paraview) {
    paraview = [];
    [program.paraview].concat(pvPossibleBasePath).forEach(function(directory){
        try {
            if(fs.statSync(directory).isDirectory()) {
                paraview.push(directory);
            }
        } catch(err) {
            // skip
        }
    });
}

if (!process.argv.slice(2).length || !program.help || paraview.length === 0) {
    program.outputHelp();
    process.exit(0);
}

var pvPythonExecs = shell.find(paraview).filter(function(file) { return file.match(/pvpython$/) || file.match(/pvpython.exe$/); });
if(pvPythonExecs.length < 1) {
    console.log('Could not find pvpython in your ParaView HOME directory ($PARAVIEW_HOME)');
    program.outputHelp();
} else {
    const cmdLine = [
        quotePath(pvPythonExecs[0]), '-dr',
        quotePath(path.normalize(path.join(__dirname, '../server/pvw-visualizer.py'))),
        '--content', quotePath(path.normalize(path.join(__dirname, '../dist'))),
        '--port', program.port,
        '--data', quotePath(program.data),
    ];

    if (program.loadFile) {
      cmdLine.push('--load-file');
      cmdLine.push(program.loadFile);
    }

    if (program.excludeRegex) {
      cmdLine.push('--exclude-regex');
      cmdLine.push(program.excludeRegex);
    }

    if (program.groupRegex) {
      cmdLine.push('--group-regex');
      cmdLine.push(program.groupRegex);
    }

    if (program.plugins) {
      cmdLine.push('--plugins');
      cmdLine.push(program.plugins);
    }

    if (program.proxies) {
      cmdLine.push('--proxies');
      cmdLine.push(program.proxies);
    }

    if (!program.autoReaders) {
      cmdLine.push('--no-auto-readers');
    }

    if (program.viewport) {
      var viewport = program.viewport.split('x');
      var options = ['--viewport-scale', '--viewport-max-width', '--viewport-max-height'];
      while (viewport.length) {
        cmdLine.push(options.shift());
        cmdLine.push(viewport.shift());
      }
    }

    console.log('\n===============================================================================');
    console.log('| Execute:');
    console.log('| $', cmdLine.join('\n|\t'));
    console.log('===============================================================================\n');
    shell.exec(cmdLine.join(' '), { async: true }).stdout.on('data', function(data) {
        if (data.indexOf('Starting factory') !== -1) {
            // Open browser if asked
            if (!program.serverOnly) {
                require('open')('http://localhost:' + program.port);
            }
        }
    });
}


