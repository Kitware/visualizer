import React from 'react';
import PropTypes from 'prop-types';

import style from 'VisualizerStyle/InformationPanel.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

// ----------------------------------------------------------------------------

function memoryToString(number) {
  let unitIdx = 0;
  let currentValue = number;
  const units = [' KB', ' MB', ' GB', ' TB'];

  while (currentValue > 1000) {
    currentValue /= 1000;
    unitIdx += 1;
  }

  return currentValue.toFixed(2) + units[unitIdx];
}

// ----------------------------------------------------------------------------

export class InformationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayIdx: 0,
    };

    // callbacks
    this.updateArray = this.updateArray.bind(this);
    this.updateTime = this.updateTime.bind(this);
  }

  updateArray(event) {
    const arrayIdx = event.target.value;
    this.setState({ arrayIdx });
  }

  updateTime(event) {
    const timeIdx = event.target.value;
    this.props.setTimeStep(Number(timeIdx));
  }

  render() {
    if (!this.props.visible) {
      return null;
    }
    if (!this.props.proxy) {
      return (
        <center style={{ padding: '20px 10px' }}>
          You must select a Proxy in the Pipeline browser in order to look at
          its informations.
        </center>
      );
    }

    const activeArray = this.props.proxy.data.arrays[
      this.state.arrayIdx % this.props.proxy.data.arrays.length
    ];

    return (
      <div className={style.container}>
        <div className={style.line}>
          <i className={style.iconType} />
          {this.props.proxy.data.type}
        </div>
        <div className={style.line}>
          <i className={style.iconConnectivity} />
          {`${this.props.proxy.data.points} points / ${
            this.props.proxy.data.cells
          } cells`}
        </div>
        <div className={style.line}>
          <i className={style.iconMemory} />
          {memoryToString(this.props.proxy.data.memory)}
        </div>
        <div className={style.line}>
          <i className={style.iconBondingBox} />
          <div>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={this.props.proxy.data.bounds[0]}
                      title="X min"
                    />
                  </td>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={this.props.proxy.data.bounds[1]}
                      title="X max"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={this.props.proxy.data.bounds[2]}
                      title="Y min"
                    />
                  </td>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={this.props.proxy.data.bounds[3]}
                      title="Y max"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={this.props.proxy.data.bounds[4]}
                      title="Z min"
                    />
                  </td>
                  <td>
                    <input
                      readOnly
                      type="text"
                      value={this.props.proxy.data.bounds[5]}
                      title="Z max"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {this.props.timeValues.length ? (
          <div className={style.line}>
            <i className={style.iconTime} />
            <select value={this.props.timeStep} onChange={this.updateTime}>
              {this.props.timeValues.map((t, idx) => (
                <option key={idx} value={idx}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {activeArray ? (
          <div>
            <div className={style.line}>
              <i className={style.iconArray} />
              <select
                value={
                  this.state.arrayIdx % this.props.proxy.data.arrays.length
                }
                onChange={this.updateArray}
              >
                {this.props.proxy.data.arrays.map((a, idx) => (
                  <option key={idx} value={idx}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.line}>
              <i className={style.iconArrayType} />
              {`${activeArray.location} / ${activeArray.type}(${
                activeArray.size
              })`}
            </div>

            <div className={style.line}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>
                      <i className={style.iconRange} />
                    </th>
                    <th>Min</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {activeArray.range.map((range, idx) => (
                    <tr key={idx}>
                      <td>{range.name.length ? range.name : 'Range'}</td>
                      <td>
                        <input readOnly type="text" value={range.min} />
                      </td>
                      <td>
                        <input readOnly type="text" value={range.max} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

InformationPanel.propTypes = {
  visible: PropTypes.bool,

  proxy: PropTypes.object,
  timeStep: PropTypes.number.isRequired,
  timeValues: PropTypes.array.isRequired,
  setTimeStep: PropTypes.func.isRequired,
};

InformationPanel.defaultProps = {
  visible: true,
  proxy: undefined,
};

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => {
  return {
    proxy: selectors.proxies.getActiveSource(state),
    timeStep: selectors.time.getTimeStep(state),
    timeValues: selectors.time.getTimeValues(state),
    setTimeStep(tIdx) {
      dispatch(
        actions.time.applyTimeStep(
          tIdx,
          selectors.proxies.getActiveSourceId(state)
        )
      );
    },
  };
})(InformationPanel);
