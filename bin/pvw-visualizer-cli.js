#! /usr/bin/env node

var fs = require('fs'),
    shell = require('shelljs'),
    path = require('path'),
    program = require('commander'),
    paraview = process.env.PARAVIEW_HOME,
    pkg = require('../package.json'),
    version = /semantically-release/.test(pkg.version) ? 'development version' : pkg.version;

program
  .version(version)
  .option('-p, --port [8080]', 'Start web server with given port', 8080)
  .option('-d, --data [directory]', 'Data directory to serve')
  .option('-s, --server-only', 'Do not open the web browser\n')

  .option('--paraview [path]', 'Provide the ParaView root path to use\n')

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

if (!process.argv.slice(2).length || paraview.length === 0) {
    program.outputHelp();
    process.exit(0);
}

var pvPythonExecs = shell.find(paraview).filter(function(file) { return file.match(/pvpython$/) || file.match(/pvpython.exe$/); });
if(pvPythonExecs.length < 1) {
    console.log('Could not find pvpython in your ParaView HOME directory ($PARAVIEW_HOME)');
    program.outputHelp();
} else {
    const cmdLine = [
        pvPythonExecs[0], '-dr',
        path.normalize(path.join(__dirname, '../server/pvw-visualizer.py')),
        '--content', path.normalize(path.join(__dirname, '../dist')),
        '--port', program.port,
        '--data', program.data,
    ];

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


