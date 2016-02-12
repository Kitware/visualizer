import React                from 'react';
import ControlPanelContent  from './Content';

import style from 'PVWStyles/ToggleIcons.mcss';

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
        this.setState({activeIdx});
    },

    render() {
        return (<div className={ this.props.className }>
                    <div className={ style.container }>
                        <div className={ style.actions }>
                            <i data-idx='0'
                                onClick={ this.updateActive }
                                style={{ top: '-4px', position: 'relative'}}
                                className={ (this.state.activeIdx === 0 ? style.active : '') + ' fa fa-fw fa-code-fork fa-flip-vertical' }></i>
                            <i data-idx='1'
                                onClick={ this.updateActive }
                                style={{ top: '-1px', position: 'relative'}}
                                className={ (this.state.activeIdx === 1 ? style.active : '') + ' fa fa-fw fa-file-text-o' }></i>
                            <i data-idx='2'
                                onClick={ this.updateActive }
                                className={ (this.state.activeIdx === 2 ? style.active : '') + ' fa fa-fw fa-plus' }></i>
                            <i data-idx='3'
                                onClick={ this.updateActive }
                                className={ (this.state.activeIdx === 3 ? style.active : '') + ' fa fa-fw fa-hdd-o' }></i>
                            <i data-idx='4'
                                onClick={ this.updateActive }
                                className={ (this.state.activeIdx === 4 ? style.active : '') + ' fa fa-fw fa-info' }></i>
                        </div>
                        <div className={ style.actions }>
                            <i data-idx='5'
                                onClick={ this.updateActive }
                                className={ (this.state.activeIdx === 5 ? style.active : '') + ' fa fa-cogs' }></i>
                        </div>
                    </div>
                    <div className={ style.content} >
                        <ControlPanelContent activeIdx={this.state.activeIdx} proxyManager={ this.props.proxyManager } onChange={ this.changeActive }/>
                    </div>
                </div>);
    },
});
