import React from 'react';
import PropTypes from 'prop-types';

import ActionList from 'paraviewweb/src/React/Widgets/ActionListWidget';
import style from 'VisualizerStyle/ToggleIcons.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

const ICON_MAPPING = {
  source: style.sourceIcon,
  filter: style.filterIcon,
};

// ----------------------------------------------------------------------------

export function FilterPanel(props) {
  if (!props.visible) {
    return null;
  }

  return (
    <ActionList
      className={props.className}
      list={props.list}
      onClick={props.applyFilter}
    />
  );
}

FilterPanel.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  list: PropTypes.array,
  applyFilter: PropTypes.func.isRequired,
};

FilterPanel.defaultProps = {
  className: '',
  visible: true,
  list: [],
};

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => {
  return {
    list: selectors.proxies
      .getAvailableList(state)
      .map((i) => ({ name: i.name, icon: ICON_MAPPING[i.icon] })),
    applyFilter: (name) => {
      dispatch(
        actions.proxies.createProxy(
          name,
          selectors.proxies.getActiveSourceId(state)
        )
      );
      dispatch(actions.ui.updateVisiblePanel(0));
    },
  };
})(FilterPanel);
