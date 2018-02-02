import React from 'react';
import PropTypes from 'prop-types';

import style from 'VisualizerStyle/TimeController.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../redux';

export class TimeController extends React.Component {
  constructor(props) {
    super(props);

    // callbacks
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  previous() {
    const timeStep =
      (this.props.index - 1 + this.props.values.length) %
      this.props.values.length;
    this.props.setTimeStep(timeStep);
  }

  next() {
    const timeStep = (this.props.index + 1) % this.props.values.length;
    this.props.setTimeStep(timeStep);
  }

  togglePlay() {
    this.props[this.props.playing ? 'stopTime' : 'playTime']();
  }

  render() {
    if (!this.props.values.length) {
      return null;
    }

    const timeSize = `${this.props.values.length}`.length * 2 + 1;
    const timeClass = style[`time${timeSize}`];

    return (
      <div className={style.container}>
        {this.props.playing ? (
          <i className={style.stopButton} onClick={this.togglePlay} />
        ) : (
          <i className={style.playButton} onClick={this.togglePlay} />
        )}
        <i onClick={this.previous} className={style.previousButton} />
        <input
          className={timeClass}
          type="text"
          readOnly
          value={`${this.props.index + 1}/${this.props.values.length}`}
        />
        <i onClick={this.next} className={style.nextButton} />
      </div>
    );
  }
}

TimeController.propTypes = {
  index: PropTypes.number,
  values: PropTypes.array,
  playing: PropTypes.bool,
  setTimeStep: PropTypes.func.isRequired,
  playTime: PropTypes.func.isRequired, // eslint-disable-line
  stopTime: PropTypes.func.isRequired, // eslint-disable-line
};

TimeController.defaultProps = {
  index: 0,
  values: [],
  playing: false,
};

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => ({
  setTimeStep(index) {
    dispatch(actions.time.applyTimeStep(index, state.active.source));
  },
  playTime() {
    dispatch(actions.time.playTime());
  },
  stopTime() {
    dispatch(actions.time.stopTime());
  },
  index: selectors.time.getTimeStep(state),
  playing: selectors.time.isAnimationPlaying(state),
  values: selectors.time.getTimeValues(state),
}))(TimeController);
