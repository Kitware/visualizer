import React from 'react';
import PropTypes from 'prop-types';

import ProxyEditorWidget from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';
import CheckboxProperty from 'paraviewweb/src/React/Properties/CheckboxProperty';

import style from 'VisualizerStyle/SettingPanel.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

// ----------------------------------------------------------------------------

const LOCAL_RENDERING_PROPS = {
  data: { value: true, id: 'remoteRenderingCheckbox' },
  show: () => true,
  ui: {
    label: 'Remote Rendering',
    componentLabels: [''],
    help:
      'Uncheck for local rendering.  If doing local rendering, all the geometry and the used data arrays will be sent to the browser.',
  },
};

const SHOW_FPS_PROPS = {
  data: { value: false, id: 'showRemoteFpsCheckbox' },
  show: () => true,
  ui: {
    label: 'Show Remote FPS',
    componentLabels: [''],
    help:
      'Check to show effective frame rate (in black text) while in remote rendering mode.',
  },
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

    const checkboxProps = Object.assign({}, LOCAL_RENDERING_PROPS, {
      onChange: this.remoteRenderingBoxChecked,
    });
    checkboxProps.data.value = this.props.isRemoteRenderingEnabled;

    const fpsCheckboxProps = Object.assign({}, SHOW_FPS_PROPS, {
      onChange: this.remoteRenderingShowFpsBoxChecked,
    });
    fpsCheckboxProps.data.value = this.props.showRemoteRenderingFps;

    return (
      <div className={style.container}>
        <CheckboxProperty {...checkboxProps} />
        <CheckboxProperty {...fpsCheckboxProps} />
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
};

SettingPanel.defaultProps = {
  className: '',
  visible: true,
  isRemoteRenderingEnabled: false,
  showRemoteRenderingFps: false,
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
}))(SettingPanel);
