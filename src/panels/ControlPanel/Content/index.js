import FileBrowserPanel from './FileBrowserPanel';
import FilterPanel      from './FilterPanel';
import InformationPanel from './InformationPanel';
import PipelineBrowser  from './PipelineBrowser';
import React            from 'react';
import SavePanel        from './SavePanel';
import SettingPanel     from './SettingPanel';

/* eslint-disable react/prefer-stateless-function */
class ControlPanelContent extends React.Component {
  render() {
    const proxyManager = this.props.proxyManager,
      view = this.props.activeIdx;

    return (
      <div className={this.props.className}>
        <PipelineBrowser  visible={view === 0} proxyManager={proxyManager} goTo={this.props.onChange} />
        <FileBrowserPanel visible={view === 1} proxyManager={proxyManager} goTo={this.props.onChange} />
        <FilterPanel      visible={view === 2} proxyManager={proxyManager} goTo={this.props.onChange} />
        <SavePanel        visible={view === 3} proxyManager={proxyManager} goTo={this.props.onChange} />
        <InformationPanel visible={view === 4} proxyManager={proxyManager} goTo={this.props.onChange} />
        <SettingPanel     visible={view === 5} proxyManager={proxyManager} goTo={this.props.onChange} />
      </div>);
  }
}

ControlPanelContent.propTypes = {
  activeIdx: React.PropTypes.number,
  className: React.PropTypes.string,
  onChange: React.PropTypes.func,
  proxyManager: React.PropTypes.object,
};

export default ControlPanelContent;
