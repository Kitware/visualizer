title: Documentation
---

The ParaView Visualizer is a Web application that aims to enable scientific visualization on the Web using a ParaView backend for data processing and rendering.

If you encounter any problems when using ParaView Visualizer, you can find the solutions in [Troubleshooting](troubleshooting.html) or ask me on [GitHub](https://github.com/kitware/visualizer/issues) or [Mailing list](http://www.paraview.org/mailman/listinfo/paraview). If you can't find the answer, please report it on GitHub.

## What is ParaView Visualizer?

ParaView Visualizer is a standalone application that leverage ParaView capabilities on the backend to produce interactive visualizations over the Web. The Visualizer application can be used locally as a command line tool (demo-mode) or remotely when properly deployed.

The ParaViewWeb Visualizer aims to provide a ParaView like application for your browser.

## Installation

It only takes few minutes to set up ParaView Visualizer. If you encounter a problem and can't find the solution here, please [submit a GitHub issue](https://github.com/kitware/visualizer/issues).

```sh
$ npm install -g pvw-visualizer
$ Visualizer --paraview /Applications/paraview.app --data ~/Desktop
```

For production usage, ParaView Visualizer should be deployed within your Web insfrastructure following the proper requirements: 

1) Serve the Visualizer application to the client (Static content: JS + HTML) using any kind of Web server (Apache, Nginx, Tomcat, Node...).
2) Enable the client to start a new ParaView process on the server side (Cluster). We provide a generic launcher implementation using Python which could be replaced with something more appropriate to your infrastructure. 
3) Configure your network to forward the WebSocket connection to the proper backend host running the ParaView server.

For better rendering performances, the ParaView server should run on a GPU machine. 

### Requirements

Installing ParaView Visualizer as a dependency inside your Web project is quite easy. However, you do need to have a couple of other things installed first:

- [Node.js](http://nodejs.org/)
- [Git](http://git-scm.com/)

If your computer already has these, congratulations! Just install ParaViewWeb Visualizer with npm:

``` bash
$ npm install pvw-visualizer --save
```

If not, please follow the following instructions to install all the requirements.

{% note warn For Mac users %}
You may encounter some problems when compiling. Please install Xcode from App Store first. After Xcode is installed, open Xcode and go to **Preferences -> Download -> Command Line Tools -> Install** to install command line tools.
{% endnote %}

### Install Git

- Windows: Download & install [git](https://git-scm.com/download/win).
- Mac: Install it with [Homebrew](http://mxcl.github.com/homebrew/), [MacPorts](http://www.macports.org/) or [installer](http://sourceforge.net/projects/git-osx-installer/).
- Linux (Ubuntu, Debian): `sudo apt-get install git-core`
- Linux (Fedora, Red Hat, CentOS): `sudo yum install git-core`

### Install Node.js

The best way to install Node.js is with [nvm](https://github.com/creationix/nvm).

cURL:

``` bash
$ curl https://raw.github.com/creationix/nvm/master/install.sh | sh
```

Wget:

``` bash
$ wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
```

Once nvm is installed, restart the terminal and run the following command to install Node.js.

``` bash
$ nvm install 4
```

Alternatively, download and run [the installer](http://nodejs.org/).

### Install pvw-visualizer

``` bash
$ npm install pvw-visualizer --save
```

### Getting pvw-visualizer source code for contributing

``` bash
$ git clone https://github.com/kitware/visualizer.git
$ cd visualizer
$ npm install
```
