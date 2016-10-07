/* global Image */
import React             from 'react';
import { connect }       from 'react-redux';
import CollapsibleWidget from 'paraviewweb/src/React/Widgets/CollapsibleWidget';
import style             from 'VisualizerStyle/SavePanel.mcss';

import ImageProviders from '../../../ImageProviders';
import { selectors, actions, dispatch } from '../../../redux';

// ----------------------------------------------------------------------------

export const SavePanel = React.createClass({

  displayName: 'ParaViewWeb/SavePanel',

  propTypes: {
    className: React.PropTypes.string,
    renderer: React.PropTypes.object,
    visible: React.PropTypes.bool,

    proxy: React.PropTypes.object,
    statuses: React.PropTypes.object,
    paths: React.PropTypes.object,

    collapsableState: React.PropTypes.object,

    saveData: React.PropTypes.func,
    updateSavePath: React.PropTypes.func,

    updateCollapsableState: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      visible: true,
      proxy: null,
    };
  },

  getInitialState() {
    return {
      url: '',
      width: '500',
      height: '500',
    };
  },

  componentWillMount() {
    ImageProviders.onImageProvider((provider) => {
      if (provider.getLastImageReadyEvent()) {
        const { url } = provider.getLastImageReadyEvent();
        this.setState({ url });
      }
      this.subscription = provider.onImageReady((data) => {
        const { url } = data;
        this.setState({ url });
      });
    });
  },

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  },

  updateForm(event) {
    const name = event.target.name,
      value = event.target.value;
    this.setState({ [name]: value });
  },

  updatePath(event) {
    const name = event.target.name,
      value = event.target.value;
    this.props.updateSavePath(name, value);
  },

  resetSize() {
    const image = new Image();
    image.src = this.screenshot.src;
    const { width, height } = image;
    this.setState({ width, height });
  },

  updateLocalScreenShotCollapsableState(isOpen) {
    this.props.updateCollapsableState('localScreenShot', isOpen);
  },

  updateScreenShotCollapsableState(isOpen) {
    this.props.updateCollapsableState('screenshot', isOpen);
  },

  updateDataSetCollapsableState(isOpen) {
    this.props.updateCollapsableState('dataset', isOpen);
  },

  updateStateCollapsableState(isOpen) {
    this.props.updateCollapsableState('state', isOpen);
  },

  saveScreenShot() {
    const { width, height } = this.state;
    this.props.saveData('screenshot', this.props.paths.screenshot, { size: [width, height] });
  },

  saveDataset() {
    this.props.saveData('dataset', this.props.paths.dataset, { proxyId: this.props.proxy.id });
  },

  saveState() {
    this.props.saveData('state', this.props.paths.state);
  },

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div className={[this.props.className, style.container].join(' ')}>
        <CollapsibleWidget
          open={!!this.props.collapsableState.localScreenShot}
          subtitle="Local"
          title="Screenshot"
          onChange={this.updateLocalScreenShotCollapsableState}
        >
          <img ref={c => (this.screenshot = c)} src={this.state.url} className={style.localImage} alt="" />
        </CollapsibleWidget>
        <CollapsibleWidget
          open={!!this.props.collapsableState.screenshot}
          subtitle="Remote"
          title="Screenshot"
          onChange={this.updateScreenShotCollapsableState}
        >
          <div className={style.line}>
            <i className={style.resizeIcon} onClick={this.resetSize} />
            <div className={style.group}>
              <input
                type="number"
                className={style.sizeInput}
                name="width"
                value={this.state.width}
                onChange={this.updateForm}
              />
              x
              <input
                type="number"
                className={style.sizeInput}
                name="height"
                value={this.state.height}
                onChange={this.updateForm}
              />
            </div>
          </div>
          <div className={style.line}>
            <i
              className={this.props.statuses.screenshot === 'success'
                ? style.saveIconSuccess : (this.props.statuses.screenshot && this.props.statuses.screenshot.length
                  ? style.saveIconError : style.saveIcon)}
              title={this.props.statuses.screenshot}
              onClick={this.saveScreenShot}
            />
            <input
              type="text"
              className={style.input}
              name="screenshot"
              value={this.props.paths.screenshot}
              onChange={this.updatePath}
            />
          </div>
        </CollapsibleWidget>
        <CollapsibleWidget
          open={!!this.props.collapsableState.dataset}
          subtitle="Remote"
          title="Dataset"
          visible={!!this.props.proxy}
          onChange={this.updateDataSetCollapsableState}
        >
          <div className={style.line}>
            <i
              className={this.props.statuses.dataset === 'success'
                ? style.saveIconSuccess : (this.props.statuses.dataset && this.props.statuses.dataset.length
                    ? style.saveIconError : style.saveIcon)}
              title={this.props.statuses.dataset}
              onClick={this.saveDataset}
            />
            <input
              type="text"
              className={style.input}
              name="dataset"
              value={this.props.paths.dataset}
              onChange={this.updatePath}
            />
          </div>
        </CollapsibleWidget>
        <CollapsibleWidget
          open={!!this.props.collapsableState.state}
          subtitle="Remote"
          title="State"
          onChange={this.updateStateCollapsableState}
        >
          <div className={style.line}>
            <i
              className={this.props.statuses.state === 'success'
                ? style.saveIconSuccess : (this.props.statuses.state && this.props.statuses.state.length
                    ? style.saveIconError : style.saveIcon)}
              title={this.props.statuses.state}
              onClick={this.saveState}
            />
            <input
              type="text"
              className={style.input}
              name="state"
              value={this.props.paths.state}
              onChange={this.updatePath}
            />
          </div>
        </CollapsibleWidget>
      </div>);
  },
});

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect(
  (state) => {
    return {
      proxy: selectors.proxies.getActiveSource(state),
      statuses: selectors.save.getStatuses(state),
      paths: selectors.save.getPaths(state),
      collapsableState: selectors.ui.getCollapsableState(state),
      saveData(type, path, options) {
        dispatch(actions.save.saveData(type, path, options));
      },
      updateSavePath(type, path) {
        dispatch(actions.save.updateSavePath(type, path));
      },
      updateCollapsableState(name, isOpen) {
        dispatch(actions.ui.updateCollapsableState(name, isOpen));
      },
    };
  }
)(SavePanel);
