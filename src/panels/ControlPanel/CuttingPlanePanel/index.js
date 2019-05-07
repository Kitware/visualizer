/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';

// import ActionList from 'paraviewweb/src/React/Widgets/ActionListWidget';
import ButtonSelectorWidget from 'paraviewweb/src/React/Widgets/ButtonSelectorWidget';
// import PipelineBrowser from '../PipelineBrowser';
// import style from 'VisualizerStyle/ToggleIcons.mcss';

import { connect } from 'react-redux';
import { actions, dispatch } from '../../../redux';
import selectors from "../../../redux/selectors";
// ----------------------------------------------------------------------------

export function CuttingPlanePanel(props) {
  if (!props.visible) {
    return null;
  }

  return (
    <ButtonSelectorWidget list={props.list} onChange={props.applyFilter} />
  );
}

CuttingPlanePanel.propTypes = {
  visible: PropTypes.bool,
  list: PropTypes.array,
  applyFilter: PropTypes.func.isRequired,
};

CuttingPlanePanel.defaultProps = {
  visible: true,
  list: [],
};

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => {
  return {
    list: [{ name: 'Create Cone' }],
    applyFilter: (index) => {
      dispatch(actions.view.resetCamera());
      const netRequest = actions.proxies.createSlicedGeoemtry(
        "Cone", selectors.proxies.getActiveSourceId(state)
      );
      dispatch(netRequest);
    },
  };
})(CuttingPlanePanel);
