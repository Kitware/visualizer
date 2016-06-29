## [Visualizer](http://kitware.github.io/Visualizer/)

[![Build Status](https://travis-ci.org/Kitware/visualizer.svg)](https://travis-ci.org/Kitware/visualizer)
[![Dependency Status](https://david-dm.org/kitware/pvw-visualizer.svg)](https://david-dm.org/kitware/pvw-visualizer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![npm-download](https://img.shields.io/npm/dm/visualizer.svg)
![npm-version-requirement](https://img.shields.io/badge/npm->=3.0.0-brightgreen.svg)
![node-version-requirement](https://img.shields.io/badge/node->=4.0.0-brightgreen.svg)

### Goal ###

Provide a Web based interface to ParaView 5.0.1+.

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

    -h, --help                       output usage information
    -V, --version                    output the version number
    -p, --port [8080]                Start web server with given port
    -d, --data [directory/http]      Data directory to serve
    -s, --server-only                Do not open the web browser

    --paraview [path]                Provide the ParaView root path to use
```

## Development

To start developing pvw-visualizer, execute the following commands:

```sh
$ git clone https://github.com/Kitware/visualizer.git
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

## Documentation

See the [documentation](https://kitware.github.io/visualizer) for a
getting started guide, advanced documentation, and API descriptions.

#### Licensing

**Visualizer** aka ParaViewWeb:Visualizer is licensed under [BSD Clause 3](LICENSE).

#### Getting Involved

Fork our repository and do great things. At [Kitware](http://www.kitware.com),
we've been contributing to open-source software for 15 years and counting, and
want to make **Visualizer** useful to as many people as possible.
