import React from 'react';
import style from 'VisualizerStyle/TimeController.mcss';

export default React.createClass({

    displayName: 'ParaViewWeb/TimeController',

    propTypes: {
        className: React.PropTypes.string,
        proxyManager: React.PropTypes.object,
    },

    getDefaultProps() {
        return {
            className: '',
        };
    },

    getInitialState() {
        return {
            playing: false,
            timeStep: 0,
            timeValues: [],
        };
    },

    componentWillMount() {
        this.timeSubcription = this.props.proxyManager.onTimeChange( (data, envelope) => {
            const { timeStep, timeValues } = data;
            this.setState({ timeStep, timeValues });
        });
    },

    componentWillUnmount() {
        if(this.timeSubcription) {
            this.timeSubcription.unsubscribe();
            this.timeSubcription = null;
        }
    },

    previous() {
        const timeStep = ( this.state.timeStep - 1 + this.state.timeValues.length ) % this.state.timeValues.length;
        this.props.proxyManager.setTimeStep(timeStep);
    },

    next() {
        const timeStep = ( this.state.timeStep + 1 ) % this.state.timeValues.length;
        this.props.proxyManager.setTimeStep(timeStep);
    },

    togglePlay() {
        const playing = !this.state.playing;
        this.setState({playing});
        this.props.proxyManager[ playing ? 'playTime' : 'stopTime']();
    },

    render() {
        if(!this.state.timeValues.length) {
            return null;
        }

        const timeSize = `${this.state.timeValues.length}`.length * 2 + 1;
        const timeClass = style['time' + timeSize];

        return (
            <div className={style.container}>
                {
                    this.state.playing
                    ? <i className={ style.stopButton } onClick={ this.togglePlay }></i>
                    : <i className={ style.playButton } onClick={ this.togglePlay }></i>
                }
                <i onClick={ this.previous } className={ style.previousButton }></i>
                <input className={timeClass} type='text' readOnly value={ `${this.state.timeStep + 1}/${this.state.timeValues.length}`  }/>
                <i onClick={ this.next } className={ style.nextButton }></i>
            </div>);
    },
});
