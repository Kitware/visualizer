import React from 'react';
import PropTypes from 'prop-types';

import VtkRenderer from 'paraviewweb/src/React/Renderers/VtkRenderer';
import VtkGeometryRenderer from 'paraviewweb/src/React/Renderers/VtkGeometryRenderer';
import InlineSvgIconWidget from 'paraviewweb/src/React/Widgets/InlineSvgIconWidget';
import { connect } from 'react-redux';

import style from 'VisualizerStyle/MainView.mcss';

import ControlPanel from './panels/ControlPanel';
import TimeController from './panels/TimeController';
import logo from './logo.isvg';

import network from './network';
import ImageProviders from './ImageProviders';
import LocalRenderingImageProvider from './LocalRenderingImageProvider';
import { selectors, actions, dispatch } from './redux';

export class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: true,
      isRendererBusy: false,
    };

    // callbacks
    this.setImageProvider = this.setImageProvider.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.localImageReady = this.localImageReady.bind(this);
    this.busyStatusUpdated = this.busyStatusUpdated.bind(this);

    // Link resetCamera call to local renderer too
    const resetCamera = () => {
      if (this.renderer && this.renderer.resetCamera) {
        this.renderer.resetCamera();
        if (this.renderer.updateRenderWindowSize) {
          this.renderer.updateRenderWindowSize();
        }
      }
    };
    actions.view.setResetCameraCallback(() => {
      resetCamera();
      // The client need the data to figure out the camera location
      // Therefore we need to wait for the data to show up hoping 0.5s
      // would be enough.
      setTimeout(resetCamera, 500);
    });
  }

  componentWillMount() {
    this.needsSetImageProvider = true;
  }

  componentDidMount() {
    this.setImageProvider();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remoteRendering !== this.props.remoteRendering) {
      if (nextProps.remoteRendering) {
        // Changing back to remote rendering
        const params = this.renderer.getCameraParameters();
        if (params) {
          this.props.updateCamera(
            this.props.viewId,
            params.focalPoint,
            params.viewUp,
            params.position
          );
        }
      }
      ImageProviders.reset();
      this.needsSetImageProvider = true;
    }
  }

  componentDidUpdate() {
    this.setImageProvider();
  }

  setImageProvider() {
    if (this.needsSetImageProvider) {
      if (this.renderer.binaryImageStream) {
        ImageProviders.setImageProvider(this.renderer.binaryImageStream);
      } else {
        if (!this.localRenderingImageProvider) {
          this.localRenderingImageProvider = new LocalRenderingImageProvider();
        }
        ImageProviders.setImageProvider(this.localRenderingImageProvider);
      }
    }
    this.needsSetImageProvider = false;
  }

  resetCamera() {
    this.props.resetCamera();
  }

  toggleMenu() {
    this.setState((prevState) => ({ menuVisible: !prevState.menuVisible }));
  }

  localImageReady(img) {
    if (this.localRenderingImageProvider) {
      this.localRenderingImageProvider.fireImageReady(img);
    }
  }

  busyStatusUpdated(status) {
    this.setState({ isRendererBusy: status });
  }

  render() {
    const Renderer = this.props.remoteRendering
      ? VtkRenderer
      : VtkGeometryRenderer;
    return (
      <div className={style.container}>
        <div className={style.topBar}>
          <div className={style.title}>
            <div className={style.toggleMenu} onClick={this.toggleMenu}>
              <InlineSvgIconWidget
                className={
                  this.props.pendingCount || this.state.isRendererBusy
                    ? style.networkActive
                    : style.networkIdle
                }
                height="34px"
                width="34px"
                icon={logo}
                alt="ParaViewWeb Visualizer"
              />
              Visualizer
            </div>
            <ControlPanel
              className={this.state.menuVisible ? style.menu : style.hiddenMenu}
              resetCamera={this.resetCamera}
            />
          </div>
          <div className={style.buttons}>
            <TimeController />
            <i className={style.resetCameraButton} onClick={this.resetCamera} />
          </div>
        </div>
        <Renderer
          ref={(c) => {
            this.renderer = c;
          }}
          client={this.props.client}
          viewId={this.props.viewId}
          connection={this.props.connection}
          session={this.props.session}
          className={style.viewport}
          onImageReady={
            this.props.provideOnImageReady ? this.localImageReady : null
          }
          viewIdUpdated={this.props.updateActiveViewId}
          onBusyChange={this.busyStatusUpdated}
          showFPS={this.props.remoteFps}
          oldImageStream={!this.props.remoteRendering}
          resizeOnWindowResize
          clearOneTimeUpdatersOnUnmount
          clearInstanceCacheOnUnmount
          interactiveQuality={this.props.interactiveQuality}
          interactiveRatio={this.props.interactiveRatio}
          throttleTime={this.props.throttleTime}
          maxFPS={this.props.maxFPS}
        />
        <div className={style.progressOverlay}>{this.props.progress}</div>
      </div>
    );
  }
}

Visualizer.propTypes = {
  resetCamera: PropTypes.func.isRequired,
  updateCamera: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  connection: PropTypes.object,
  session: PropTypes.object,
  pendingCount: PropTypes.number.isRequired,
  remoteRendering: PropTypes.bool,
  remoteFps: PropTypes.bool,
  viewId: PropTypes.string.isRequired,
  provideOnImageReady: PropTypes.bool,
  updateActiveViewId: PropTypes.func.isRequired,

  interactiveQuality: PropTypes.number.isRequired,
  interactiveRatio: PropTypes.number.isRequired,
  throttleTime: PropTypes.number.isRequired,
  maxFPS: PropTypes.number.isRequired,

  progress: PropTypes.string,
};

Visualizer.defaultProps = {
  remoteRendering: false,
  remoteFps: false,
  provideOnImageReady: false,
  connection: undefined,
  session: undefined,
  progress: '',
};

// Binding --------------------------------------------------------------------

export default connect(
  (state) => {
    const pendingCount = selectors.network.getPendingCount(state);
    const client = network.getClient();
    const connection = network.getConnection();
    const { session } = connection;
    const remoteRendering = selectors.view.getRemoteRenderingState(state);
    const remoteFps = selectors.view.getRemoteFpsState(state);
    const viewId = selectors.active.getActiveView(state);
    const provideOnImageReady = selectors.ui.getVisiblePanel(state) === 3; // SavePanel visible
    const interactiveQuality = selectors.view.getRemoteInteractiveQualityState(
      state
    );
    const interactiveRatio = selectors.view.getRemoteInteractiveRatioState(
      state
    );
    const throttleTime = selectors.view.getThrottleTime(state);
    const maxFPS = selectors.view.getServerMaxFPS(state);
    const progress = selectors.network.getProgressUpdate(state);

    return {
      client,
      connection,
      session,
      pendingCount,
      remoteRendering,
      remoteFps,
      viewId,
      provideOnImageReady,
      interactiveRatio,
      interactiveQuality,
      throttleTime,
      maxFPS,
      progress,
    };
  },
  () => ({
    resetCamera: () => dispatch(actions.view.resetCamera()),
    updateCamera: (viewId, focalPoint, viewUp, position) =>
      dispatch(actions.view.updateCamera(viewId, focalPoint, viewUp, position)),
    updateActiveViewId: (viewId) =>
      dispatch(actions.active.activate(viewId, actions.active.TYPE_VIEW)),
  })
)(Visualizer);
