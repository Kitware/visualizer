import React from 'react';
import PropTypes from 'prop-types';

import style from 'VisualizerStyle/Loading.mcss';

export default function Loading(props) {
  return (
    <div className={style.container}>
      <div className={style.loader} />
      <div className={style.message}>{props.message}</div>
    </div>
  );
}

Loading.propTypes = {
  message: PropTypes.string,
};

Loading.defaultProps = {
  message: 'Loading ParaView...',
};
