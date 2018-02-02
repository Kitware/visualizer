import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import style from 'VisualizerStyle/ToggleIcons.mcss';

import FileBrowserPanel from './FileBrowserPanel';
import FilterPanel from './FilterPanel';
import InformationPanel from './InformationPanel';
import PipelineBrowser from './PipelineBrowser';
import SavePanel from './SavePanel';
import SettingPanel from './SettingPanel';

import { selectors, actions, dispatch } from '../../redux';

export class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    // callbacks
    this.updateActive = this.updateActive.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
  }

  updateActive(e) {
    this.props.updateActivePanel(Number(e.target.dataset.idx) || 0);
  }

  resetCamera() {
    this.props.resetCamera();
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className={style.container}>
          <div className={style.actions}>
            <i
              data-idx="0"
              onClick={this.updateActive}
              className={
                this.props.activeIdx === 0
                  ? style.pipelineButtonActive
                  : style.pipelineButton
              }
            />
            <i
              data-idx="1"
              onClick={this.updateActive}
              className={
                this.props.activeIdx === 1
                  ? style.openFileButtonActive
                  : style.openFileButton
              }
            />
            <i
              data-idx="2"
              onClick={this.updateActive}
              className={
                this.props.activeIdx === 2
                  ? style.filterButtonActive
                  : style.filterButton
              }
            />
            <i
              data-idx="3"
              onClick={this.updateActive}
              className={
                this.props.activeIdx === 3
                  ? style.saveButtonActive
                  : style.saveButton
              }
            />
            <i
              data-idx="4"
              onClick={this.updateActive}
              className={
                this.props.activeIdx === 4
                  ? style.infoButtonActive
                  : style.infoButton
              }
            />
          </div>
          <div className={style.actions}>
            <i
              data-idx="5"
              onClick={this.updateActive}
              className={
                this.props.activeIdx === 5
                  ? style.settingsButtonActive
                  : style.settingsButton
              }
            />
            <i className={style.resetCameraIcon} onClick={this.resetCamera} />
          </div>
        </div>
        <div className={style.content}>
          <PipelineBrowser visible={this.props.activeIdx === 0} />
          <FileBrowserPanel visible={this.props.activeIdx === 1} />
          <FilterPanel visible={this.props.activeIdx === 2} />
          <SavePanel visible={this.props.activeIdx === 3} />
          <InformationPanel visible={this.props.activeIdx === 4} />
          <SettingPanel visible={this.props.activeIdx === 5} />
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  className: PropTypes.string,
  activeIdx: PropTypes.number,

  updateActivePanel: PropTypes.func.isRequired,
  resetCamera: PropTypes.func.isRequired,
};

ControlPanel.defaultProps = {
  className: '',
  activeIdx: 0,
};

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => {
  return {
    activeIdx: selectors.ui.getVisiblePanel(state),
    updateActivePanel(idx) {
      dispatch(actions.ui.updateVisiblePanel(idx));
    },
  };
})(ControlPanel);
