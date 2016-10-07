import React          from 'react';
import VtkRenderer    from 'paraviewweb/src/React/Renderers/VtkRenderer';
import SvgIconWidget  from 'paraviewweb/src/React/Widgets/SvgIconWidget';
import { connect }    from 'react-redux';

import style          from 'VisualizerStyle/MainView.mcss';

import ControlPanel   from './panels/ControlPanel';
import TimeController from './panels/TimeController';
import logo           from './logo.svg';

import network from './network';
import ImageProviders from './ImageProviders';
import { selectors, actions, dispatch } from './redux';

export const Visualizer = React.createClass({

  displayName: 'ParaViewWeb/Visualizer',

  propTypes: {
    resetCamera: React.PropTypes.func,
    client: React.PropTypes.object,
    connection: React.PropTypes.object,
    session: React.PropTypes.object,
    pendingCount: React.PropTypes.number,
  },

  getInitialState() {
    return {
      menuVisible: true,
    };
  },

  componentDidMount() {
    ImageProviders.setImageProvider(this.renderer.binaryImageStream);
  },

  toggleMenu() {
    this.setState({ menuVisible: !this.state.menuVisible });
  },

  render() {
    return (
      <div className={style.container}>
        <div className={style.topBar}>
          <div className={style.title}>
            <div className={style.toggleMenu} onClick={this.toggleMenu}>
              <SvgIconWidget
                className={this.props.pendingCount ? style.networkActive : style.networkIdle}
                height="34px"
                width="34px"
                icon={logo}
                alt="ParaViewWeb Visualizer"
              />
              Visualizer
            </div>
            <ControlPanel className={this.state.menuVisible ? style.menu : style.hiddenMenu} />
          </div>
          <div className={style.buttons}>
            <TimeController />
            <i
              className={style.resetCameraButton}
              onClick={this.props.resetCamera}
            />
          </div>
        </div>
        <VtkRenderer
          ref={c => (this.renderer = c)}
          client={this.props.client}
          connection={this.props.connection}
          session={this.props.session}
          className={style.viewport}
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
    const session = connection.session;

    return { client, connection, session, pendingCount };
  },
  () => ({
    resetCamera: () => dispatch(actions.view.resetCamera()),
  })
)(Visualizer);

