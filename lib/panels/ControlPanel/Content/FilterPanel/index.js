import React        from 'react';
import ActionList   from 'tonic-ui/lib/react/widget/ActionList';


export default React.createClass({

    displayName: 'ParaViewWeb/FilterPanel',

    propTypes: {
        className: React.PropTypes.string,
        goTo: React.PropTypes.func,
        proxyManager: React.PropTypes.object,
        visible: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            visible: true,
        };
    },

    getAlgorithms() {
        var list = [];
        list = list.concat(this.props.proxyManager.getSources().map(name => { return { name, icon: 'fa fa-fw fa-database' };}));
        if(this.props.proxyManager.canApplyFilter()) {
            list = list.concat(this.props.proxyManager.getFilters().map(name => { return { name, icon: 'fa fa-fw fa-plus' };}));
        }
        return list;
    },

    applyFilter(name) {
        this.props.proxyManager.createProxy(name)
            .then(
                ok => {
                    this.props.goTo(0);
                },
                ko => {
                    console.log('ERROR: Create', name, ko);
                });
    },

    render() {
        if(!this.props.visible) {
            return null;
        }
        return <ActionList
                    className={ this.props.className }
                    list={ this.getAlgorithms() }
                    onClick={ this.applyFilter }/>;
    },
});
