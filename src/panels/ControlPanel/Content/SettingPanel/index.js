import React                from 'react';
import ProxyEditorWidget    from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';
import style                from 'VisualizerStyle/SettingPanel.mcss';

export default React.createClass({

  displayName: 'ParaViewWeb/SettingPanel',

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
      settingProxy: null,
    };
  },

  componentWillMount() {
    this.updateSettingProxy();
  },

  updateSettingProxy() {
    this.props.proxyManager.getRenderViewSettings()
      .then(
        proxy => {
          const settingProxy = Object.assign({ name: 'Global settings', collapsed: false }, proxy);
          this.setState({ settingProxy });
        },
        err => {
          console.log('Error fetching setting proxy', err);
        });
  },

  applyChanges(changeSet) {
    const changeToPush = [],
      ids = {};
    for (const key in changeSet) {
      const [id, name] = key.split(':'),
        value = changeSet[key];
      ids[id] = true;
      changeToPush.push({ id, name, value });
    }

    this.props.proxyManager.updateProperties(changeToPush)
      .then(
        ok => {
          this.updateSettingProxy();
        },
        ko => {
          console.log('Error update props', ko);
        });
  },

  render() {
    if (!this.props.visible) {
      return null;
    }
    const sections = [this.state.settingProxy].filter(i => !!i);

    return  (
      <div className={ style.container }>
        <ProxyEditorWidget sections={sections} onApply={ this.applyChanges } />
      </div>);
  },
});
