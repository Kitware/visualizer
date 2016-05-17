import React        from 'react';
import FileBrowser  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';

export default React.createClass({

  displayName: 'ParaViewWeb/FilterPanel',

  propTypes: {
    className: React.PropTypes.string,
    goTo: React.PropTypes.func,
    proxyManager: React.PropTypes.object,
    visible: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      visible: true,
    };
  },

  getInitialState() {
    return {
      pathToList: '.',
    };
  },

  componentWillMount() {
    this.updateDiretoryListing(this.state.pathToList);
  },

  updateDiretoryListing(pathToList) {
    this.props.proxyManager.listServerDirectory(pathToList)
      .then(
        fileListing => {
          const { dirs, files, groups, path, label } = fileListing;
          const fileLabels = files.map(i => i.label);
          this.setState({ dirs, files: fileLabels, groups, path, label });
        },
        err => {
          console.log('Error fetching sources', err);
        });
  },

  path(pathToList, path) {
    if (pathToList === path[0]) {
      pathToList = '.';
    }
    this.setState({ pathToList });
    this.updateDiretoryListing(pathToList);
  },

  directory(name) {
    const pathToList = [].concat(this.state.path, name).join('/');
    this.setState({ pathToList });
    this.updateDiretoryListing(pathToList);
  },

  group(name, files) {
    const basePath = [].concat(this.state.path);
    basePath.shift(); // Remove the front 'Home'
    const fullPathFiles = files.map(f => [].concat(basePath, f).join('/'));
    this.props.proxyManager.open(fullPathFiles)
      .then(
        ok => {
          this.props.goTo(0);
        },
        ko => {
          console.log('ERROR group loading', ko);
        });
  },

  file(name) {
    const pathList = [].concat(this.state.path, name);
    pathList.shift(); // Remove the front 'Home'
    const fullPath = pathList.join('/');
    this.props.proxyManager.open(fullPath)
      .then(
        ok => {
          this.props.goTo(0);
        },
        ko => {
          console.log('ERROR file loading', ko);
        });
  },

  processAction(action, name, files) {
    this[action](name, files);
  },

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <FileBrowser
        className={this.props.className}
        path={this.state.path}
        directories={this.state.dirs}
        groups={this.state.groups}
        files={this.state.files}
        onAction={this.processAction}
      />);
  },
});
