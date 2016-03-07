import React                from 'react';
import ControlPanelContent  from './Content';

import style from 'VisualizerStyle/ToggleIcons.mcss';

export default React.createClass({

  displayName: 'ParaViewWeb/ControlPanel',

  propTypes: {
    className: React.PropTypes.string,
    proxyManager: React.PropTypes.object,
  },

  getInitialState() {
    return {
      activeIdx: 0,
    };
  },

  updateActive(e) {
    this.changeActive(Number(e.target.dataset.idx) || 0);
  },

  changeActive(activeIdx) {
    this.setState({ activeIdx });
  },

  resetCamera() {
    this.props.proxyManager.resetCamera();
  },

  render() {
    return (
      <div className={ this.props.className }>
        <div className={ style.container }>
          <div className={ style.actions }>
            <i data-idx="0"
              onClick={ this.updateActive }
              className={ this.state.activeIdx === 0 ? style.pipelineButtonActive : style.pipelineButton }
            ></i>
            <i data-idx="1"
              onClick={ this.updateActive }
              className={ this.state.activeIdx === 1 ? style.openFileButtonActive : style.openFileButton }
            ></i>
            <i data-idx="2"
              onClick={ this.updateActive }
              className={ this.state.activeIdx === 2 ? style.filterButtonActive : style.filterButton }
            ></i>
            <i data-idx="3"
              onClick={ this.updateActive }
              className={ this.state.activeIdx === 3 ? style.saveButtonActive : style.saveButton }
            ></i>
            <i data-idx="4"
              onClick={ this.updateActive }
              className={ this.state.activeIdx === 4 ? style.infoButtonActive : style.infoButton }
            ></i>
          </div>
          <div className={ style.actions }>
            <i data-idx="5"
              onClick={ this.updateActive }
              className={ this.state.activeIdx === 5 ? style.settingsButtonActive : style.settingsButton }
            ></i>
            <i className={ style.resetCameraIcon } onClick={ this.resetCamera }></i>
          </div>
        </div>
        <div className={ style.content} >
            <ControlPanelContent
              activeIdx={this.state.activeIdx}
              proxyManager={ this.props.proxyManager }
              onChange={ this.changeActive }
            />
        </div>
      </div>);
  },
});
