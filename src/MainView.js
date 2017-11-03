import React               from 'react';

import VtkRenderer         from 'paraviewweb/src/React/Renderers/VtkRenderer';
import VtkGeometryRenderer from 'paraviewweb/src/React/Renderers/VtkGeometryRenderer';
import InlineSvgIconWidget from 'paraviewweb/src/React/Widgets/InlineSvgIconWidget';
import { connect }         from 'react-redux';

import style               from 'VisualizerStyle/MainView.mcss';

import ControlPanel        from './panels/ControlPanel';
import TimeController      from './panels/TimeController';
import logo                from './logo.isvg';

import network from './network';
import ImageProviders from './ImageProviders';
import LocalRenderingImageProvider from './LocalRenderingImageProvider';
import { selectors, actions, dispatch } from './redux';

export const Visualizer = React.createClass({

  displayName: 'ParaViewWeb/Visualizer',

  propTypes: {
    resetCamera: React.PropTypes.func,
    updateCamera: React.PropTypes.func,
    client: React.PropTypes.object,
    connection: React.PropTypes.object,
    session: React.PropTypes.object,
    pendingCount: React.PropTypes.number,
    remoteRendering: React.PropTypes.bool,
    remoteFps: React.PropTypes.bool,
    viewId: React.PropTypes.string,
    provideOnImageReady: React.PropTypes.bool,
    updateActiveViewId: React.PropTypes.func,
  },

  getInitialState() {
    return {
      menuVisible: true,
      isRendererBusy: false,
    };
  },

  componentWillMount() {
    this.needsSetImageProvider = true;
  },

  componentDidMount() {
    this.setImageProvider();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.remoteRendering !== this.props.remoteRendering) {
      if (nextProps.remoteRendering) {
        // Changing back to remote rendering
        const params = this.renderer.getCameraParameters();
        this.props.updateCamera(this.props.viewId, params.focalPoint, params.viewUp, params.position);
      }
      ImageProviders.reset();
      this.needsSetImageProvider = true;
    }
  },

  componentDidUpdate() {
    this.setImageProvider();
  },

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
  },

  resetCamera() {
    this.props.resetCamera();
    if (this.renderer && this.renderer.resetCamera) {
      this.renderer.resetCamera();
    }
  },

  toggleMenu() {
    this.setState({ menuVisible: !this.state.menuVisible });
  },

  localImageReady(img) {
    if (this.localRenderingImageProvider) {
      this.localRenderingImageProvider.fireImageReady(img);
    }
  },

  busyStatusUpdated(status) {
    this.setState({ isRendererBusy: status });
  },

  render() {
    const Renderer = this.props.remoteRendering ? VtkRenderer : VtkGeometryRenderer;
    return (
      <div className={style.container}>
        <div className={style.topBar}>
          <div className={style.title}>
            <div className={style.toggleMenu} onClick={this.toggleMenu}>
              <InlineSvgIconWidget
                className={this.props.pendingCount || this.state.isRendererBusy ? style.networkActive : style.networkIdle}
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
            <i
              className={style.resetCameraButton}
              onClick={this.resetCamera}
            />
          </div>
        </div>
        <Renderer
          ref={(c) => { this.renderer = c; }}
          client={this.props.client}
          viewId={this.props.viewId}
          connection={this.props.connection}
          session={this.props.session}
          className={style.viewport}
          onImageReady={this.props.provideOnImageReady ? this.localImageReady : null}
          viewIdUpdated={this.props.updateActiveViewId}
          onBusyChange={this.busyStatusUpdated}
          showFPS={this.props.remoteFps}
          oldImageStream={!this.props.remoteRendering}
          resizeOnWindowResize
          clearOneTimeUpdatersOnUnmount
          clearInstanceCacheOnUnmount
        />
      </div>);
  },
});

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

    return {
      client, connection, session, pendingCount, remoteRendering, remoteFps, viewId, provideOnImageReady,
    };
  },
  () => ({
    resetCamera: () => dispatch(actions.view.resetCamera()),
    updateCamera: (viewId, focalPoint, viewUp, position) => dispatch(actions.view.updateCamera(viewId, focalPoint, viewUp, position)),
    updateActiveViewId: viewId => dispatch(actions.active.activate(viewId, actions.active.TYPE_VIEW)),
  }),
)(Visualizer);

