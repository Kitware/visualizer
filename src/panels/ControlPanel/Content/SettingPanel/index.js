import React                from 'react';
import ProxyEditorWidget    from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';
import style                from 'VisualizerStyle/SettingPanel.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../../redux';

// ----------------------------------------------------------------------------

export const SettingPanel = React.createClass({

  displayName: 'ParaViewWeb/SettingPanel',

  propTypes: {
    className: React.PropTypes.string,
    visible: React.PropTypes.bool,

    sections: React.PropTypes.array,
    fetchSettingProxy: React.PropTypes.func,
    applyChangeSet: React.PropTypes.func,
    updateCollapsableState: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      visible: true,
    };
  },

  applyChanges(changeSet) {
    const changeToPush = [],
      ids = {};
    Object.keys(changeSet).forEach(key => {
      const [id, name] = key.split(':'),
        value = changeSet[key];
      ids[id] = true;
      changeToPush.push({ id, name, value });
    });

    this.props.applyChangeSet(changeToPush);
    this.props.fetchSettingProxy();
  },

  render() {
    if (!this.props.visible) {
      return null;
    }

    return  (
      <div className={style.container}>
        <ProxyEditorWidget
          sections={this.props.sections}
          onApply={this.applyChanges}
          onCollapseChange={this.props.updateCollapsableState}
        />
      </div>);
  },
});

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect(
  state => {
    return {
      sections: [selectors.proxies.getRenderViewSettingsPropertyGroup(state)],
      fetchSettingProxy: () => {
        dispatch(actions.proxies.fetchSettingProxy());
      },
      applyChangeSet: (changeSet) => {
        dispatch(actions.proxies.applyChangeSet(changeSet));
      },
      updateCollapsableState(name, isOpen) {
        dispatch(actions.ui.updateCollapsableState(name, isOpen));
      },
    };
  }
)(SettingPanel);
