import React        from 'react';
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

// ----------------------------------------------------------------------------

export const FileBrowser = React.createClass({

  displayName: 'ParaViewWeb/FileBrowser',

  propTypes: {
    className: React.PropTypes.string,
    visible: React.PropTypes.bool,
    fileListing: React.PropTypes.object,
    activePath: React.PropTypes.string,

    fetchServerDirectory: React.PropTypes.func,
    storeActiveDirectory: React.PropTypes.func,
    openFiles: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      visible: true,
    };
  },

  path(pathToList, path) {
    const reqPath = (pathToList === path[0]) ? '.' : pathToList;
    this.props.storeActiveDirectory(reqPath);
    this.props.fetchServerDirectory(reqPath);
  },

  directory(name) {
    const pathToList = [].concat(this.props.fileListing.path, name).join('/');
    this.props.storeActiveDirectory(pathToList);
    this.props.fetchServerDirectory(pathToList);
  },

  group(name, files) {
    const basePath = [].concat(this.props.activePath.split('/'));
    basePath.shift(); // Remove the front 'Home'
    const fullPathFiles = files.map(f => [].concat(basePath, f).join('/'));
    this.props.openFiles(fullPathFiles);
  },

  file(name) {
    const pathList = [].concat(this.props.activePath.split('/'), name);
    pathList.shift(); // Remove the front 'Home'
    const fullPath = pathList.join('/');
    this.props.openFiles(fullPath);
  },

  processAction(action, name, files) {
    this[action](name, files);
  },

  render() {
    if (!this.props.visible || !this.props.fileListing) {
      return null;
    }

    return (
      <FileBrowserWidget
        className={this.props.className}
        path={this.props.fileListing.path}
        directories={this.props.fileListing.dirs}
        groups={this.props.fileListing.groups}
        files={this.props.fileListing.files}
        onAction={this.processAction}
      />);
  },
});

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect(
  (state) => {
    return {
      fileListing: selectors.files.getFileListing(state),
      activePath: selectors.files.getActivePath(state),
    };
  },
  () => {
    return {
      fetchServerDirectory: (path) => {
        dispatch(actions.files.fetchServerDirectory(path));
      },
      storeActiveDirectory: (path) => {
        dispatch(actions.files.storeActiveDirectory(path));
      },
      openFiles: (files) => {
        dispatch(actions.proxies.openFiles(files));
        dispatch(actions.ui.updateVisiblePanel(0));
      },
    };
  },
)(FileBrowser);
