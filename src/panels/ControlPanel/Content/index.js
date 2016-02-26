import FileBrowserPanel from './FileBrowserPanel';
import FilterPanel      from './FilterPanel';
import InformationPanel from './InformationPanel';
import PipelineBrowser  from './PipelineBrowser';
import React            from 'react';
import SettingPanel     from './SettingPanel';

export default React.createClass({

    displayName: 'ParaViewWeb/ControlPanelContent',

    propTypes: {
        activeIdx: React.PropTypes.number,
        className: React.PropTypes.string,
        onChange: React.PropTypes.func,
        proxyManager: React.PropTypes.object,
    },

    render() {
        const proxyManager = this.props.proxyManager,
            view = this.props.activeIdx;

        return (<div className={ this.props.className }>
                    <PipelineBrowser  visible={ view === 0 } proxyManager={proxyManager} goTo={ this.props.onChange }/>
                    <FileBrowserPanel visible={ view === 1 } proxyManager={proxyManager} goTo={ this.props.onChange }/>
                    <FilterPanel      visible={ view === 2 } proxyManager={proxyManager} goTo={ this.props.onChange }/>
                    <InformationPanel visible={ view === 4 } proxyManager={proxyManager} goTo={ this.props.onChange }/>
                    <SettingPanel     visible={ view === 5 } proxyManager={proxyManager} goTo={ this.props.onChange }/>
                </div>);
    },
});
