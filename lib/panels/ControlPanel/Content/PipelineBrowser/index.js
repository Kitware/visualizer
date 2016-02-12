import React from 'react';
import PipelineWidget from 'tonic-ui/lib/react/widget/PipelineWidget';

function getIndexedProxyMap(proxyList) {
    const idToProxyMap = {};
    proxyList.forEach( proxy => {
        idToProxyMap[proxy.id] = proxy;
    });
    return idToProxyMap;
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
            proxyList: {sources: []},
        };
    },

    componentWillMount() {
        this.subscription = this.props.proxyManager.onPipelineChange( () => {
            this.updateProxyList();
        });
        this.updateProxyList();
    },

    componentWillUnmount() {
        if(this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    },

    updateProxyList() {
        this.props.proxyManager.listProxies()
            .then(
                proxyList => {
                    const proxyMap = getIndexedProxyMap(proxyList.sources);
                    this.setState({proxyList, proxyMap});
                },
                ko => {
                    console.log('Error proxyList', ko);
                }
            );
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
        // name, id, parent, visible
        return <PipelineWidget
                    nodes={ this.state.proxyList.sources }
                    actives={ [ this.props.proxyManager.getActiveProxyId() ] }
                    onChange={ this.handleChange }
                    enableDelete
                    width='300' />;
    },
});
