import React from 'react';
import style from 'VisualizerStyle/InformationPanel.mcss';

function memoryToString(number) {
  var unitIdx = 0,
    currentValue = number;
  const units = [' KB', ' MB', ' GB', ' TB'];

  while (currentValue > 1000) {
    currentValue /= 1000;
    unitIdx++;
  }

  return currentValue.toFixed(2) + units[unitIdx];
}

export default React.createClass({

  displayName: 'ParaViewWeb/FilterPanel',

  propTypes: {
    className: React.PropTypes.string,
    proxyManager: React.PropTypes.object,
    visible: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      visible: true,
    };
  },

  getInitialState() {
    return {
      arrayIdx: 0,
      proxy: {},
    };
  },

  componentWillMount() {
    this.subscription = this.props.proxyManager.onActiveProxyChange(id => {
      this.updateProxyData(id);
    });
    this.timeSubcription = this.props.proxyManager.onTimeChange((data, envelope) => {
      this.forceUpdate();
    });
  },

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.timeSubcription) {
      this.timeSubcription.unsubscribe();
      this.timeSubcription = null;
    }
  },

  updateProxyData(id) {
    const hasProxy = this.props.proxyManager.hasActiveProxy();
    if (hasProxy) {
      this.props.proxyManager.getProxy(id)
        .then(
          proxy => {
            const arrayIdx = 0;
            this.setState({ proxy, arrayIdx });
          },
          err => {
            console.log('Error fetching proxy', id, err);
          });
    }
  },

  updateArray(event) {
    const arrayIdx = event.target.value;
    this.setState({ arrayIdx });
  },

  updateTime(event) {
    const timeIdx = event.target.value;
    this.props.proxyManager.setTimeStep(Number(timeIdx))
      .then(
        ok => {
          this.updateProxyData(this.state.proxy.id);
        },
        ko => {
          console.log('Error update time', timeIdx, ko);
        });
  },

  render() {
    if (!this.props.visible) {
      return null;
    }
    if (!this.props.proxyManager.hasActiveProxy()) {
      return <center style={{ padding: '20px 10px' }}>You must select a Proxy in the Pipeline browser in order to look at its informations.</center>;
    }

    const activeArray = this.state.proxy.data.arrays[this.state.arrayIdx];

    return (
      <div className={style.container}>
        <div className={style.line}>
          <i className={style.iconType}></i>
          {this.state.proxy.data.type}
        </div>
        <div className={style.line}>
          <i className={style.iconConnectivity}></i>
          {`${this.state.proxy.data.points} points / ${this.state.proxy.data.cells} cells`}
        </div>
        <div className={style.line}>
          <i className={style.iconMemory}></i>
          {memoryToString(this.state.proxy.data.memory)}
        </div>
        <div className={style.line}>
          <i className={style.iconBondingBox}></i>
          <div>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td><input readOnly type="text" value={this.state.proxy.data.bounds[0]} title="X min" /></td>
                  <td><input readOnly type="text" value={this.state.proxy.data.bounds[1]} title="X max" /></td>
                </tr>
                <tr>
                  <td><input readOnly type="text" value={this.state.proxy.data.bounds[2]} title="Y min" /></td>
                  <td><input readOnly type="text" value={this.state.proxy.data.bounds[3]} title="Y max" /></td>
                </tr>
                <tr>
                  <td><input readOnly type="text" value={this.state.proxy.data.bounds[4]} title="Z min" /></td>
                  <td><input readOnly type="text" value={this.state.proxy.data.bounds[5]} title="Z max" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {this.props.proxyManager.getTimeValues().length ?
          <div className={style.line}>
            <i className={style.iconTime}></i>
            <select value={this.props.proxyManager.getTimeStep()} onChange={this.updateTime}>
              {this.props.proxyManager.getTimeValues().map((t, idx) => <option key={idx} value={idx}>{t}</option>)}
            </select>
          </div> : null
        }
        {activeArray ?
          <div>
            <div className={style.line}>
              <i className={style.iconArray}></i>
              <select value={this.state.arrayIdx} onChange={this.updateArray}>
                {this.state.proxy.data.arrays.map((a, idx) => <option key={idx} value={idx}>{a.name}</option>)}
              </select>
            </div>
            <div className={style.line}>
              <i className={style.iconArrayType}></i>
              {`${activeArray.location} / ${activeArray.type}(${activeArray.size})`}
            </div>

            <div className={style.line}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th><i className={style.iconRange}></i></th>
                    <th>Min</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {activeArray.range.map((range, idx) =>
                    <tr key={idx}>
                      <td>{range.name.length ? range.name : 'Range'}</td>
                      <td><input readOnly type="text" value={range.min} /></td>
                      <td><input readOnly type="text" value={range.max} /></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> : null
        }
      </div>);
  },
});
