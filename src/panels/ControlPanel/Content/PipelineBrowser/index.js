import React                from 'react';
import ColorByWidget        from 'paraviewweb/src/React/Widgets/ColorByWidget';
import PipelineWidget       from 'paraviewweb/src/React/Widgets/GitTreeWidget';
import ProxyEditorWidget    from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';
import style                from 'VisualizerStyle/PipelineBrowser.mcss';

function getIndexedProxyMap(proxyList) {
  const idToProxyMap = {};
  proxyList.forEach(proxy => {
    idToProxyMap[proxy.id] = proxy;
  });
  return idToProxyMap;
}

function eventNotHandled(e) {
  console.log('Event not handled', e);
}

export default React.createClass({

  displayName: 'ParaViewWeb/PipelineBrowser',

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
      proxyList: { sources: [] },
      sourceProxy: null,
      representationProxy: null,
      viewProxy: null,
      min: 0,
      max: 1,
    };
  },

  componentWillMount() {
    this.subscription = this.props.proxyManager.onPipelineChange(() => {
      this.updateProxyList();
    });
    this.activeSubscription = this.props.proxyManager.onActiveProxyChange(id => {
      this.updateActiveProxy(id, 'Source', 'sourceProxy');
    });
    this.updateProxyList();

    // Do not freeze important requests
    setTimeout(() => {
      this.props.proxyManager.listColorMapImages()
        .then(presets => {
          this.setState({ presets });
        });
    }, 500);

    this.colorHandler = {
      propertyChange: ({ changeSet }) => {
        this.props.proxyManager.updateProperties(changeSet)
          .then(
            ok => {
              this.updateActiveProxy(this.state.sourceProxy.id, 'Source', 'sourceProxy');
            });
      },
      colorBy: ({ representation, arrayLocation, arrayName, colorMode, vectorMode, vectorComponent, rescale }) => {
        this.props.proxyManager.colorBy(representation, colorMode, arrayLocation, arrayName, vectorComponent, vectorMode, rescale)
          .then(
            ok => {
              console.log('Update colorBy', ok);
            },
            err => {
              console.log('Error update color', err);
            });
      },
      scalarBar: ({ source, visible }) => {
        this.props.proxyManager.showScalarBar(source, visible)
          .then(
            ok => {
              // console.log('update bar visibility', ok);
            },
            err => {
              console.log('Error update bar visibility', err);
            }
          );
      },
      updatePreset: ({ representation, preset }) => {
        this.props.proxyManager.updateLookupTablePreset(representation, preset)
          .then(
            ok => {
              this.updateRepresentationProxy(representation);
            },
            err => {
              console.log('Error updating preset', err);
            });
      },
      updateScalarRange: ({ options }) => {
        this.props.proxyManager.rescaleTransferFunction(options)
          .then(
            ok => {
              const { min, max } = ok.range;
              this.setState({ min, max });
            },
            err => {
              console.log('Error updateScalarRange', err);
            });
      },
    };
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

  updateProxyList() {
    this.props.proxyManager.listProxies()
      .then(
        proxyList => {
          const proxyMap = getIndexedProxyMap(proxyList.sources);
          this.setState({ proxyList, proxyMap });

          if (!this.state.viewProxy) {
            this.updateActiveProxy(proxyList.view, 'View', 'viewProxy');
          }
        },
        ko => {
          console.log('Error proxyList', ko);
        }
      );
  },

  updateActiveProxy(id, name, key) {
    const collapsed = (key === 'viewProxy');
    this.props.proxyManager.getProxy(id, true)
      .then(
        proxy => {
          this.setState({ [key]: Object.assign({ name, collapsed }, proxy) });
          if (key === 'sourceProxy' && this.state.proxyMap[proxy.id]) {
            this.props.proxyManager.getLookupTableScalarRange(proxy.id)
              .then(
                ok => {
                  const { min, max } = ok;
                  this.setState({ min, max });
                },
                err => {
                  console.log('Error fetching LUT scalar range', err);
                });

            this.updateRepresentationProxy(this.state.proxyMap[proxy.id].rep);
          }
        },
        ko => {
          console.log('error getProxy', name, id, ko);
        });
  },

  updateRepresentationProxy(id) {
    this.props.proxyManager.getLookupTableImage(id)
      .then(
        ok => {
          const scalarBar = ok.image;
          this.setState({ scalarBar });
        }, () => {
          // console.log('No lut for', this.state.proxyMap[proxy.id].rep);
        });

    this.updateActiveProxy(id, 'Representation', 'representationProxy');
  },

  applyChanges(changeSet) {
    const changeToPush = [],
      ids = {};
    Object.keys(changeSet).forEach(key => {
      const [id, name] = key.split(':'),
        value = changeSet[key];
      ids[id] = true;
      changeToPush.push({ id, name, value });
    });

    const dirtyProxyNames = ['sourceProxy', 'representationProxy', 'viewProxy'].filter(key => {
      var keep = false;
      if (this.state[key]) {
        this.state[key].properties.forEach(p => {
          if (ids[p.id]) {
            keep = true;
          }
        });
      }
      return keep;
    });

    this.props.proxyManager.updateProperties(changeToPush)
      .then(
        ok => {
          dirtyProxyNames.forEach(key => {
            this.updateActiveProxy(this.state[key].id, this.state[key].name, key);
          });
        },
        ko => {
          console.log('Error update props', ko);
        });
  },

  handleChange(event) {
    switch (event.type) {
      case 'active': {
        if (event.changeSet.length) {
          this.props.proxyManager.setActiveProxyId(event.changeSet[0].id);
        }
        break;
      }
      case 'visibility': {
        const { proxyMap } = this.state,
          propertyChangeSet = event.changeSet.map(node => {
            const id = proxyMap[node.id].rep,
              name = 'Visibility',
              value = node.visible ? 1 : 0;

            return { id, name, value };
          });
        this.props.proxyManager.updateProperties(propertyChangeSet)
          .then(
            ok => {
              this.updateProxyList();
            },
            ko => {
              console.log('Error updating visibility', ko);
            });
        break;
      }
      case 'delete': {
        this.props.proxyManager.deleteProxy(event.changeSet[0].id);
        break;
      }
      default:
        console.log('Warning: Event not managed', event);
        break;
    }
  },

  updateColorBy(event) {
    const fn = this.colorHandler[event.type] || eventNotHandled;
    fn(event);
  },

  render() {
    if (!this.props.visible) {
      return null;
    }
    const sections = [this.state.sourceProxy, this.state.representationProxy, this.state.viewProxy].filter(i => !!i);

    return (
      <div className={style.container}>
        <div className={style.pipelineContainer}>
          <PipelineWidget
            nodes={this.state.proxyList.sources}
            actives={[ this.props.proxyManager.getActiveProxyId() ]}
            onChange={this.handleChange}
            enableDelete
            width="295"
          />
        </div>
        <div className={style.proxyEditorContainer}>
          <ProxyEditorWidget sections={sections} onApply={this.applyChanges}>
            <ColorByWidget
              className={style.colorBy}
              source={this.state.sourceProxy}
              representation={this.state.representationProxy}
              scalarBar={this.state.scalarBar}
              presets={this.state.presets}
              min={this.state.min}
              max={this.state.max}
              onChange={this.updateColorBy}
            />
          </ProxyEditorWidget>
        </div>
      </div>);
  },
});
