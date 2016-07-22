import FileBrowserPanel from './FileBrowserPanel';
import FilterPanel      from './FilterPanel';
import InformationPanel from './InformationPanel';
import PipelineBrowser  from './PipelineBrowser';
import React            from 'react';
import SavePanel        from './SavePanel';
import SettingPanel     from './SettingPanel';

/* eslint-disable react/prefer-stateless-function */
export default class ControlPanelContent extends React.Component {
  render() {
    const { activeIdx } = this.props;

    return (
      <div className={this.props.className}>
        <PipelineBrowser  visible={activeIdx === 0} />
        <FileBrowserPanel visible={activeIdx === 1} />
        <FilterPanel      visible={activeIdx === 2} />
        <SavePanel        visible={activeIdx === 3} />
        <InformationPanel visible={activeIdx === 4} />
        <SettingPanel     visible={activeIdx === 5} />
      </div>);
  }
}

ControlPanelContent.propTypes = {
  activeIdx: React.PropTypes.number,
  className: React.PropTypes.string,
};
