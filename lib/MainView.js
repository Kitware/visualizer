import React            from 'react';
import VtkRenderer      from 'tonic-ui/lib/react/renderer/VtkRenderer';
import style            from 'PVWStyles/MainView.mcss';
import ControlPanel     from './panels/ControlPanel';
import TimeController   from './panels/TimeController';
import logo             from './logo.png';

export default React.createClass({

    displayName: 'ParaViewWeb/Visualizer',

    propTypes: {
        proxyManager: React.PropTypes.object,
    },

    getInitialState() {
        return {
            menuVisible: true,
        };
    },

    toggleMenu() {
        this.setState({menuVisible: !this.state.menuVisible});
    },

    resetCamera() {
        this.props.proxyManager.resetCamera();
    },

    render() {
        const { proxyManager } = this.props;

        return (<div className={ style.container }>
                  <div className={ style.topBar }>
                    <div className={ style.title }>
                        <div className={ style.toggleMenu } onClick={ this.toggleMenu }>
                            <img src={logo}/>
                            Visualizer
                        </div>
                        <ControlPanel className={ this.state.menuVisible ? style.menu : style.hiddenMenu } proxyManager={ proxyManager }/>
                    </div>
                    <div className={ style.buttons }>
                        <TimeController proxyManager={ proxyManager }/>
                        <i className='fa fa-arrows-alt' onClick={ this.resetCamera }></i>
                    </div>
                  </div>
                  <VtkRenderer { ...proxyManager.getNetworkAdapter() } className={ style.viewport }/>
                </div>);
    },
});
