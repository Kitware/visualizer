import React                from 'react';
import ProxyEditorWidget    from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';
import PipelineWidget       from 'paraviewweb/src/React/Widgets/GitTreeWidget';
import style                from 'VisualizerStyle/PipelineBrowser.mcss';

function getIndexedProxyMap(proxyList) {
    const idToProxyMap = {};
    proxyList.forEach( proxy => {
        idToProxyMap[proxy.id] = proxy;
    });
    return idToProxyMap;
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
            proxyList: {sources: []},
            sourceProxy: null,
            representationProxy: null,
            viewProxy: null,
        };
    },

    componentWillMount() {
        this.subscription = this.props.proxyManager.onPipelineChange( () => {
            this.updateProxyList();
        });
        this.activeSubscription = this.props.proxyManager.onActiveProxyChange( id => {
            this.updateActiveProxy(id, 'Source', 'sourceProxy');
        });
        this.updateProxyList();
    },

    componentWillUnmount() {
        if(this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        if(this.activeSubscription) {
            this.activeSubscription.unsubscribe();
            this.activeSubscription = null;
        }
    },

    updateProxyList() {
        this.props.proxyManager.listProxies()
            .then(
                proxyList => {
                    const proxyMap = getIndexedProxyMap(proxyList.sources);
                    this.setState({proxyList, proxyMap});

                    if(!this.state.viewProxy) {
                        this.updateActiveProxy(proxyList.view, 'View', 'viewProxy');
                    }
                },
                ko => {
                    console.log('Error proxyList', ko);
                }
            );
    },

    updateActiveProxy(id, name, key) {
        const collapsed = false;
        this.props.proxyManager.getProxy(id, true)
            .then(
                proxy => {
                    this.setState({ [key]: Object.assign({name, collapsed}, proxy) });
                    if(key === 'sourceProxy' && this.state.proxyMap[proxy.id]) {
                        this.updateActiveProxy(this.state.proxyMap[proxy.id].rep, 'Representation', 'representationProxy');
                    }
                },
                ko => {
                    console.log('error getProxy', name, id, ko);
                });
    },

    applyChanges(changeSet) {
        const changeToPush = [],
            ids = {};
        for(const key in changeSet) {
            const [id, name] = key.split(':'),
                value = changeSet[key];
            ids[id] = true;
            changeToPush.push({id, name, value});
        }

        const dirtyProxyNames = ['sourceProxy', 'representationProxy', 'viewProxy'].filter(key => {
            var keep = false;
            if(this.state[key]) {
                this.state[key].properties.forEach(p=>{
                    if(ids[p.id]){
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
        switch(event.type) {
            case 'active':
                if(event.changeSet.length) {
                    this.props.proxyManager.setActiveProxyId(event.changeSet[0].id);
                }
            break;
            case 'visibility':
                const { proxyMap } = this.state,
                    propertyChangeSet = event.changeSet.map( node => {
                        const id = proxyMap[node.id].rep,
                            name = 'Visibility',
                            value = node.visible ? 1 : 0;

                        return { id, name, value };
                    })
                this.props.proxyManager.updateProperties(propertyChangeSet)
                    .then(
                        ok => {
                            this.updateProxyList();
                        },
                        ko => {
                            console.log('Error updating visibility', ko);
                        });
            break;
            case 'delete':
                this.props.proxyManager.deleteProxy(event.changeSet[0].id);
            break;
            default:
                console.log('Warning: Event not managed', event)
            break;
        }
    },

    render() {
        if(!this.props.visible) {
            return null;
        }
        const sections = [this.state.sourceProxy, this.state.representationProxy, this.state.viewProxy].filter(i => !!i);

        // name, id, parent, visible
        return <div className={ style.container }>
                <PipelineWidget
                    nodes={ this.state.proxyList.sources }
                    actives={ [ this.props.proxyManager.getActiveProxyId() ] }
                    onChange={ this.handleChange }
                    enableDelete
                    width='300' />
                <ProxyEditorWidget sections={sections} onApply={ this.applyChanges }/>
                </div>;
    },
});
