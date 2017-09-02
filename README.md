## [Visualizer](http://kitware.github.io/visualizer/)

[![Build Status](https://travis-ci.org/Kitware/visualizer.svg)](https://travis-ci.org/Kitware/visualizer)
[![Dependency Status](https://david-dm.org/kitware/visualizer.svg)](https://david-dm.org/kitware/pvw-visualizer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![npm-download](https://img.shields.io/npm/dm/visualizer.svg)
![npm-version-requirement](https://img.shields.io/badge/npm->=3.0.0-brightgreen.svg)
![node-version-requirement](https://img.shields.io/badge/node->=5.0.0-brightgreen.svg)

## Goal

Provide a Web based interface to ParaView similar to the ParaView Desktop Qt client. 

## Documentation

See the [documentation](https://kitware.github.io/visualizer) for a getting
started guide, advanced documentation, and API descriptions.

## Pre-requisite 

You will need ParaView, which can be downloaded [here](http://www.paraview.org/download/).  The
table below indicates which versions work together.

| ParaView |              Visualizer             | Visualizer in PV binary |
|:--------:|:-----------------------------------:|:-----------------------:|
| 5.2      | <= 2.0.17                           | 2.0.16                  |
| 5.3      | broken on Linux, otherwise <=2.0.20 | 2.0.18                  |
| 5.4      | <=2.2.0                             | 2.1.4                   |
| master   | 2.3+                                | 2.3.0                   |

To install ParaViewWeb-Visualizer for your command line environment,
you will need to have [Node](https://nodejs.org/en/) which should have [NPM](https://www.npmjs.com/).

## Installation

```
$ npm install -g pvw-visualizer
```

After installing the package you will get one executable **Visualizer** with
the following set of options.

```
$ Visualizer

  Usage: Visualizer [options]

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -p, --port [8080]               Start web server with given port
    -d, --data [directory]          Data directory to serve
    -s, --server-only               Do not open the web browser

    --paraview [path]               Provide the ParaView root path to use

    --load-file [fileToLoad]        File to load using data base path as root
    --exclude-regex [excludeRegex]  Regular expression for file filtering
    --group-regex [groupRegex]      Regular expression for grouping files
    --plugins [pluginList]          List of fully qualified path names to plugin objects to load
    --proxies [proxyFile]           Path to a file with json text containing filters to load
    --no-auto-readers               If provided, disables ability to use non-configured readers

    --viewport [1x2560x1440]        Configure viewport {scale}x{maxWidth}x{maxHeight}
```

## Development

To start developing pvw-visualizer, execute the following commands:

```sh
$ git clone https://github.com/Kitware/visualizer.git
$ cd visualizer
$ npm install
$ npm run build
$ npm link
$ Visualizer

  Usage: Visualizer [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -p, --port [8080]       Start web server with given port
    -d, --data [directory]  Data directory to serve
    -s, --server-only       Do not open the web browser
    
    --paraview [path]       Provide the ParaView root path to use
```

Before you commit, please run:

```sh
$ npm run build:release
```

This creates a minified version of the visualizer JavaScript code in dist/Visualizer.js
which should be added to your commit.

#### Licensing

**Visualizer** aka ParaViewWeb:Visualizer is licensed under [BSD Clause 3](LICENSE).

#### Getting Involved

Fork our repository and [do great things](https://kitware.github.io/visualizer/docs/contributing.html). At [Kitware](http://www.kitware.com),
we've been contributing to open-source software for 15 years and counting, and
want to make **Visualizer** useful to as many people as possible.
