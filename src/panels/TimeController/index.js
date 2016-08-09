import React from 'react';
import style from 'VisualizerStyle/TimeController.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../redux';

export const TimeController = React.createClass({

  displayName: 'ParaViewWeb/TimeController',

  propTypes: {
    className: React.PropTypes.string,
    index: React.PropTypes.number,
    values: React.PropTypes.array,
    playing: React.PropTypes.bool,
    setTimeStep: React.PropTypes.func,
    playTime: React.PropTypes.func,
    stopTime: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      index: 0,
      values: [],
      playing: false,
      className: '',
    };
  },

  previous() {
    const timeStep = (this.props.index - 1 + this.props.values.length) % this.props.values.length;
    this.props.setTimeStep(timeStep);
  },

  next() {
    const timeStep = (this.props.index + 1) % this.props.values.length;
    this.props.setTimeStep(timeStep);
  },

  togglePlay() {
    this.props[this.props.playing ? 'stopTime' : 'playTime']();
  },

  render() {
    if (!this.props.values.length) {
      return null;
    }

    const timeSize = (`${this.props.values.length}`.length * 2) + 1;
    const timeClass = style[`time${timeSize}`];

    return (
      <div className={style.container}>
        {
          this.props.playing
          ? <i className={style.stopButton} onClick={this.togglePlay} />
          : <i className={style.playButton} onClick={this.togglePlay} />
        }
        <i onClick={this.previous} className={style.previousButton} />
        <input className={timeClass} type="text" readOnly value={`${this.props.index + 1}/${this.props.values.length}`} />
        <i onClick={this.next} className={style.nextButton} />
      </div>);
  },
});

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect(
  state => ({
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
  })
)(TimeController);
