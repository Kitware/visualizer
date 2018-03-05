import React from 'react';
import PropTypes from 'prop-types';

import ProxyEditorWidget from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';
import CheckboxProperty from 'paraviewweb/src/React/Properties/CheckboxProperty';
import SliderProperty from 'paraviewweb/src/React/Properties/SliderProperty';

import style from 'VisualizerStyle/SettingPanel.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

// ----------------------------------------------------------------------------

const LOCAL_RENDERING_PROPS = {
  id: 'remoteRenderingCheckbox',
  data: { value: true, id: 'remoteRenderingCheckbox' },
  show: () => true,
  ui: {
    label: 'Remote Rendering',
    componentLabels: [''],
    help:
      'Uncheck for local rendering.  If doing local rendering, all the geometry and the used data arrays will be sent to the browser.',
  },
  viewData: {},
};

const SHOW_FPS_PROPS = {
  id: 'showRemoteFpsCheckbox',
  data: { value: false, id: 'showRemoteFpsCheckbox' },
  show: () => true,
  ui: {
    label: 'Show Rendering stats',
    componentLabels: [''],
    help: 'Check to show frame rate with other details.',
  },
  viewData: {},
};

const IMAGE_QUALITY_PROPS = {
  data: { value: 50, id: 'interactiveQuality' },
  show: () => true,
  ui: {
    domain: { min: 1, max: 100, step: 1 },
    label: 'Interactive image quality (JPEG)',
    componentLabels: [''],
    help: 'Adjust JPEG quality when interacting.',
  },
  viewData: {},
};

const IMAGE_RATIO_PROPS = {
  data: { value: 0.5, id: 'interactiveQuality' },
  show: () => true,
  ui: {
    type: 'double',
    domain: { min: 0.1, max: 1, step: 0.01 },
    label: 'Interactive image ratio',
    componentLabels: [''],
    help: 'Adjust image size when interacting.',
  },
  viewData: {},
};

const EVENT_THROTTLE_PROPS = {
  data: { value: 60, id: 'eventThrottle' },
  show: () => true,
  ui: {
    type: 'double',
    domain: { min: 10, max: 120, step: 1 },
    label: 'Mouse event throttling per second',
    componentLabels: [''],
    help: 'Adjust the number of events per seconds.',
  },
  viewData: {},
};

const SERVER_MAX_FPS_PROPS = {
  data: { value: 30, id: 'serverFPS' },
  show: () => true,
  ui: {
    type: 'double',
    domain: { min: 12, max: 60, step: 1 },
    label: 'Max interactive server FPS',
    componentLabels: [''],
    help:
      'Adjust the maximum number of images the server will push per seconds.',
  },
  viewData: {},
};

// ----------------------------------------------------------------------------

export class SettingPanel extends React.Component {
  constructor(props) {
    super(props);

    // callbacks
    this.applyChanges = this.applyChanges.bind(this);
    this.remoteRenderingBoxChecked = this.remoteRenderingBoxChecked.bind(this);
    this.remoteRenderingShowFpsBoxChecked = this.remoteRenderingShowFpsBoxChecked.bind(
      this
    );

    // Custom props
    this.checkboxProps = Object.assign({}, LOCAL_RENDERING_PROPS, {
      onChange: this.remoteRenderingBoxChecked,
    });
    this.fpsCheckboxProps = Object.assign({}, SHOW_FPS_PROPS, {
      onChange: this.remoteRenderingShowFpsBoxChecked,
    });
    this.qualitySliderProps = Object.assign({}, IMAGE_QUALITY_PROPS, {
      onChange: props.updateRemoteRenderingInteractiveQuality,
    });
    this.ratioSliderProps = Object.assign({}, IMAGE_RATIO_PROPS, {
      onChange: props.updateRemoteRenderingInteractiveRatio,
    });
    this.mouseThrottleProps = Object.assign({}, EVENT_THROTTLE_PROPS, {
      onChange: props.updateEventThrottling,
    });
    this.serverFPSProps = Object.assign({}, SERVER_MAX_FPS_PROPS, {
      onChange: props.updateServerMaxFPS,
    });
  }

  applyChanges(changeSet) {
    const changeToPush = [];
    const ids = {};
    Object.keys(changeSet).forEach((key) => {
      const [id, name] = key.split(':');
      const value = changeSet[key];
      ids[id] = true;
      changeToPush.push({ id, name, value });
    });

    this.props.applyChangeSet(changeToPush);
    this.props.fetchSettingProxy();
  }

  remoteRenderingBoxChecked() {
    this.props.updateRemoteRendering(!this.props.isRemoteRenderingEnabled);
  }

  remoteRenderingShowFpsBoxChecked() {
    this.props.updateRemoteRenderingFps(!this.props.showRemoteRenderingFps);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    // Update custom prop state
    this.checkboxProps.data.value = this.props.isRemoteRenderingEnabled;
    this.fpsCheckboxProps.data.value = this.props.showRemoteRenderingFps;
    this.qualitySliderProps.data.value = this.props.remoteRenderingInteractiveQuality;
    this.ratioSliderProps.data.value = this.props.remoteRenderingInteractiveRatio;
    this.mouseThrottleProps.data.value = Math.round(
      1000 / this.props.throttleTime
    );
    this.serverFPSProps.data.value = this.props.serverMaxFPS;

    return (
      <div className={style.container}>
        <CheckboxProperty {...this.checkboxProps} />
        <CheckboxProperty {...this.fpsCheckboxProps} />
        <SliderProperty {...this.serverFPSProps} />
        <SliderProperty {...this.qualitySliderProps} />
        <SliderProperty {...this.ratioSliderProps} />
        <SliderProperty {...this.mouseThrottleProps} />
        <ProxyEditorWidget
          sections={this.props.sections}
          onApply={this.applyChanges}
          onCollapseChange={this.props.updateCollapsableState}
        />
      </div>
    );
  }
}

SettingPanel.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,

  sections: PropTypes.array.isRequired,
  fetchSettingProxy: PropTypes.func.isRequired,
  applyChangeSet: PropTypes.func.isRequired,
  updateCollapsableState: PropTypes.func.isRequired,
  isRemoteRenderingEnabled: PropTypes.bool,
  updateRemoteRendering: PropTypes.func.isRequired,
  showRemoteRenderingFps: PropTypes.bool,
  updateRemoteRenderingFps: PropTypes.func.isRequired,

  remoteRenderingInteractiveQuality: PropTypes.number,
  updateRemoteRenderingInteractiveQuality: PropTypes.func.isRequired,
  remoteRenderingInteractiveRatio: PropTypes.number,
  updateRemoteRenderingInteractiveRatio: PropTypes.func.isRequired,

  throttleTime: PropTypes.number,
  updateEventThrottling: PropTypes.func.isRequired,

  serverMaxFPS: PropTypes.number,
  updateServerMaxFPS: PropTypes.func.isRequired,
};

SettingPanel.defaultProps = {
  className: '',
  visible: true,
  isRemoteRenderingEnabled: false,
  showRemoteRenderingFps: false,
  remoteRenderingInteractiveQuality: 50,
  remoteRenderingInteractiveRatio: 0.5,
  throttleTime: 16.6,
  serverMaxFPS: 30,
};

// Binding --------------------------------------------------------------------

export default connect((state) => ({
  sections: [selectors.proxies.getRenderViewSettingsPropertyGroup(state)],
  fetchSettingProxy() {
    dispatch(actions.proxies.fetchSettingProxy());
  },
  applyChangeSet(changeSet) {
    dispatch(actions.proxies.applyChangeSet(changeSet));
  },
  updateCollapsableState(name, isOpen) {
    dispatch(actions.ui.updateCollapsableState(name, isOpen));
  },
  isRemoteRenderingEnabled: selectors.view.getRemoteRenderingState(state),
  updateRemoteRendering(isRemote) {
    dispatch(actions.view.setRemoteRendering(isRemote));
  },
  showRemoteRenderingFps: selectors.view.getRemoteFpsState(state),
  updateRemoteRenderingFps(showFps) {
    dispatch(actions.view.setRemoteFps(showFps));
  },
  remoteRenderingInteractiveQuality: selectors.view.getRemoteInteractiveQualityState(
    state
  ),
  updateRemoteRenderingInteractiveQuality(data) {
    dispatch(actions.view.setInteractiveQuality(Number(data.value)));
  },
  remoteRenderingInteractiveRatio: selectors.view.getRemoteInteractiveRatioState(
    state
  ),
  updateRemoteRenderingInteractiveRatio(data) {
    dispatch(actions.view.setInteractiveRatio(Number(data.value)));
  },
  throttleTime: selectors.view.getThrottleTime(state),
  updateEventThrottling(data) {
    dispatch(actions.view.setEventThrottleTime(1000 / Number(data.value)));
  },
  serverMaxFPS: selectors.view.getServerMaxFPS(state),
  updateServerMaxFPS(data) {
    dispatch(actions.view.setServerMaxFPS(Number(data.value)));
  },
}))(SettingPanel);
