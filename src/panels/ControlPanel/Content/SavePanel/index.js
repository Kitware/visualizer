import React                from 'react';
import CollapsibleWidget    from 'paraviewweb/src/React/Widgets/CollapsibleWidget';

import style                from 'VisualizerStyle/SavePanel.mcss';

const DATASET_MAPPING = {
  'AMR Dataset (Deprecated)': 'vtm',
  'Composite Dataset': 'vtm',
  'Hierarchical DataSet (Deprecated)': 'vtm',
  'Image (Uniform Rectilinear Grid) with blanking': 'vti',
  'Image (Uniform Rectilinear Grid)': 'vti',
  'Multi-block Dataset': 'vtm',
  'Multi-group Dataset': 'vtm',
  'Multi-piece Dataset': 'vtm',
  'Non-Overlapping AMR Dataset': 'vtm',
  'Overlapping AMR Dataset': 'vtm',
  'Point Set': 'vts',
  'Polygonal Mesh': 'vtp',
  'Rectilinear Grid': 'vtr',
  'Structured (Curvilinear) Grid': 'vts',
  'Structured Grid': 'vts',
  Table: 'csv',
  'Unstructured Grid': 'vtu',
};

export default React.createClass({

  displayName: 'ParaViewWeb/SavePanel',

  propTypes: {
    className: React.PropTypes.string,
    goTo: React.PropTypes.func,
    proxyManager: React.PropTypes.object,
    renderer: React.PropTypes.object,
    visible: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      visible: true,
    };
  },

  getInitialState() {
    return {
      url: '',
      width: '500',
      height: '500',
      proxyId: '',
      screenshotPath: 'server-images/savedScreen.png',
      statePath: 'server-state/savedState.pvsm',
      datasetPath: 'server-data/savedDataset.vtk',
      screenMessage: '',
      datasetMessage: '',
      stateMessage: '',
    };
  },

  componentWillMount() {
    this.activeSubscription = this.props.proxyManager.onActiveProxyChange(proxyId => {
      if (this.props.proxyManager.hasActiveProxy()) {
        this.props.proxyManager.getProxy(proxyId)
          .then(proxy => {
            const type = proxy.data.type;
            this.updateDatasetFilename(type);
            this.setState({ proxyId });
          });
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!this.subscription && this.props.proxyManager.getImageProvider()) {
      const provider = this.props.proxyManager.getImageProvider();
      this.subscription = provider.onImageReady(data => {
        const { url } = data;
        this.setState({ url });
      });
      if (provider.getLastImageReadyEvent()) {
        const { url } = provider.getLastImageReadyEvent();
        this.setState({ url });
      }
    }
  },

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
      this.activeSubscription = null;
    }
  },

  updateForm(event) {
    const name = event.target.name,
      value = event.target.value;
    this.setState({ [name]: value });
  },

  resetSize() {
    const image = new Image();
    image.src = this.refs.screenshot.src;
    const { width, height } = image;
    this.setState({ width, height });
  },


  updateDatasetFilename(activeType) {
    var xmlExt = DATASET_MAPPING[activeType] || 'vtk';
    const datasetPath = this.state.datasetPath.replace(/\.[^\.]+$/, `.${xmlExt}`);
    this.setState({ datasetPath });
  },

  saveScreenShot() {
    const { screenshotPath, width, height } = this.state;
    var screenMessage = '';
    this.setState({ screenMessage });
    this.props.proxyManager.saveData(screenshotPath, { size: [width, height] })
      .then(
        ok => {
          this.updateSuccessMessage('screenMessage');
        },
        err => {
          screenMessage = err.message;
          this.setState({ screenMessage });
        });
  },

  saveDataset() {
    const { datasetPath, proxyId } = this.state;
    var datasetMessage = '';
    this.setState({ datasetMessage });
    this.props.proxyManager.saveData(datasetPath, { proxyId })
      .then(
        ok => {
          this.updateSuccessMessage('datasetMessage');
        },
        err => {
          datasetMessage = err.message;
          this.setState({ datasetMessage });
        });
  },

  saveState() {
    const { statePath } = this.state;
    var stateMessage = '';
    this.setState({ stateMessage });
    this.props.proxyManager.saveData(statePath)
      .then(
        ok => {
          this.updateSuccessMessage('stateMessage');
        },
        err => {
          stateMessage = err.message;
          this.setState({ stateMessage });
        });
  },

  updateSuccessMessage(name) {
    this.setState({ [name]: 'success' });
    setTimeout(() => {
      this.setState({ [name]: '' });
    }, 3000);
  },

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div className={ [ this.props.className, style.container ].join(' ') }>
          <CollapsibleWidget open subtitle="Local" title="Screenshot">
            <img ref="screenshot" src={ this.state.url } className={ style.localImage } />
          </CollapsibleWidget>
          <CollapsibleWidget open={false} subtitle="Remote" title="Screenshot">
            <div className={ style.line }>
              <i className={ style.resizeIcon } onClick={ this.resetSize }></i>
              <div className={ style.group }>
                <input
                  type="number"
                  className={ style.sizeInput }
                  name="width"
                  value={ this.state.width }
                  onChange={ this.updateForm }
                />
                x
                <input
                  type="number"
                  className={ style.sizeInput }
                  name="height"
                  value={ this.state.height }
                  onChange={ this.updateForm }
                />
              </div>
            </div>
            <div className={ style.line }>
              <i
                className={ this.state.screenMessage === 'success'
                  ? style.saveIconSuccess : (this.state.screenMessage && this.state.screenMessage.length
                    ? style.saveIconError : style.saveIcon) }
                title={ this.state.screenMessage }
                onClick={ this.saveScreenShot }
              ></i>
              <input
                type="text"
                className={ style.input }
                name="screenshotPath"
                value={ this.state.screenshotPath }
                onChange={ this.updateForm }
              />
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget open={false} subtitle="Remote" title="Dataset" visible={ this.props.proxyManager.hasActiveProxy() }>
            <div className={ style.line }>
              <i
                className={ this.state.datasetMessage === 'success'
                  ? style.saveIconSuccess : (this.state.datasetMessage && this.state.datasetMessage.length
                      ? style.saveIconError : style.saveIcon) }
                title={ this.state.datasetMessage }
                onClick={ this.saveDataset }
              ></i>
              <input
                type="text"
                className={ style.input }
                name="datasetPath"
                value={ this.state.datasetPath }
                onChange={ this.updateForm }
              />
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget open={false} subtitle="Remote" title="State">
            <div className={ style.line }>
              <i
                className={ this.state.stateMessage === 'success'
                  ? style.saveIconSuccess : (this.state.stateMessage && this.state.stateMessage.length
                      ? style.saveIconError : style.saveIcon) }
                title={ this.state.stateMessage }
                onClick={ this.saveState }
              ></i>
              <input
                type="text"
                className={ style.input }
                name="statePath"
                value={ this.state.statePath }
                onChange={ this.updateForm }
              />
            </div>
          </CollapsibleWidget>
      </div>);
  },
});
