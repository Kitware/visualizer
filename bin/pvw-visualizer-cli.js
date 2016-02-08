#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    paraview = process.env.PARAVIEW_HOME,
    pkg = require('../package.json'),
    version = /semantically-release/.test(pkg.version) ? 'development version' : pkg.version;;

require('shelljs/global');

program
  .version(version)
  .option('-p, --port [8080]', 'Start web server with given port', 8080)
  .option('-d, --data [directory]', 'Data directory to serve')
  .option('-s, --server-only', 'Do not open the web browser\n')

  .option('--paraview [path]', 'Provide the ParaView root path to use\n')

  .parse(process.argv);


if(!paraview) {
    paraview = [];
    [ program.paraview, '/Applications/paraview.app/Contents', '/opt/paraview'].forEach(function(directory){
        try {
            if(fs.statSync(directory).isDirectory()) {
                paraview.push(directory);
            }
        } catch(err) {
            // skip
        }
    });
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
}

var pvPythonExecs = find(paraview).filter(function(file) { return file.match(/pvpython$/) || file.match(/pvpython.exe$/); });
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
    exec(cmdLine.join(' '), {async:true}).stdout.on('data', function(data) {
        if(data.indexOf('Starting factory') !== -1) {
            // Open browser if asked
            if (!program.serverOnly) {
                require('open')('http://localhost:' + program.port);
            }
        }
    });
}


