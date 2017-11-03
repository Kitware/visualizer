import React        from 'react';
import ActionList   from 'paraviewweb/src/React/Widgets/ActionListWidget';
import style        from 'VisualizerStyle/ToggleIcons.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

const ICON_MAPPING = {
  source: style.sourceIcon,
  filter: style.filterIcon,
};

// ----------------------------------------------------------------------------

export const FilterPanel = React.createClass({

  displayName: 'ParaViewWeb/FilterPanel',

  propTypes: {
    className: React.PropTypes.string,
    visible: React.PropTypes.bool,
    list: React.PropTypes.array,
    applyFilter: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      visible: true,
    };
  },

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <ActionList
        className={this.props.className}
        list={this.props.list}
        onClick={this.props.applyFilter}
      />);
  },
});

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => {
  return {
    list: selectors.proxies.getAvailableList(state).map(i => ({ name: i.name, icon: ICON_MAPPING[i.icon] })),
    applyFilter: (name) => {
      dispatch(actions.proxies.createProxy(name, selectors.proxies.getActiveSourceId(state)));
      dispatch(actions.ui.updateVisiblePanel(0));
    },
  };
})(FilterPanel);
