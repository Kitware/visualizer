import React from 'react';
import PropTypes from 'prop-types';

import ColorByWidget from 'paraviewweb/src/React/Widgets/ColorByWidget';
import PipelineWidget from 'paraviewweb/src/React/Widgets/GitTreeWidget';
import ProxyEditorWidget from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';

import style from 'VisualizerStyle/PipelineBrowser.mcss';

import { connect } from 'react-redux';
import { selectors, actions, dispatch } from '../../../redux';

// ----------------------------------------------------------------------------

function eventNotHandled(e) {
  console.log('Event not handled', e);
}

// ----------------------------------------------------------------------------

export class PipelineBrowser extends React.Component {
  constructor(props) {
    super(props);

    // callbacks
    this.applyChanges = this.applyChanges.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateColorBy = this.updateColorBy.bind(this);
  }

  applyChanges(changeSet) {
    const changeToPush = [];
    const ids = {};
    Object.keys(changeSet).forEach((key) => {
      const [id, name] = key.split(':');
      const value = changeSet[key];
      ids[id] = true;
      changeToPush.push({ id, name, value });
    });
    const owners = [];
    ['source', 'representation', 'view'].forEach((name) => {
      if (this.props[name]) {
        owners.push(this.props[name].id);
      }
    });

    this.props.propertyChange({ changeSet: changeToPush, owners });
  }

  handleChange(event) {
    switch (event.type) {
      case 'active': {
        if (event.changeSet.length) {
          this.props.setActiveSource(event.changeSet[0].id);
        }
        break;
      }
      case 'visibility': {
        const { idMapOfSourceToRep } = this.props;
        const changeSet = event.changeSet.map((node) => {
          const id = idMapOfSourceToRep[node.id];
          const name = 'Visibility';
          const value = node.visible ? 1 : 0;

          return { id, name, value };
        });
        this.props.propertyChange({ changeSet, invalidatePipeline: true });
        break;
      }
      case 'delete': {
        this.props.deleteProxy(event.changeSet[0].id);
        break;
      }
      default:
        console.log('Warning: Event not managed', event);
        break;
    }
  }

  updateColorBy(event) {
    const fn = this.props[event.type] || eventNotHandled;

    // Ensure proxy refresh when editing them
    if (event.type === 'propertyChange') {
      const owners = [];
      ['source', 'representation', 'view'].forEach((name) => {
        if (this.props[name]) {
          owners.push(this.props[name].id);
        }
      });
      event.owners = owners;
    }
    fn(event);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }
    const sections = [
      this.props.source,
      this.props.representation,
      this.props.view,
    ].filter((i) => !!i);

    return (
      <div className={style.container}>
        <div className={style.pipelineContainer}>
          <PipelineWidget
            nodes={this.props.pipeline.sources}
            actives={[this.props.source ? this.props.source.id : '0']}
            onChange={this.handleChange}
            enableDelete
            width="295"
          />
        </div>
        {// FIXME: show props only when no animation to deal with rendering perf issue
        // The issue is related to the implementation of the Properties handling
        // which require internal states (setState in Props...)
        this.props.playing ? null : (
          <div className={style.proxyEditorContainer}>
            <ProxyEditorWidget
              sections={sections}
              onApply={this.applyChanges}
              onCollapseChange={this.props.updateCollapsableState}
            >
              <ColorByWidget
                className={style.colorBy}
                source={this.props.source}
                representation={this.props.representation}
                scalarBar={this.props.lutImage}
                presets={this.props.presets}
                min={this.props.lutRange ? this.props.lutRange.min : 0}
                max={this.props.lutRange ? this.props.lutRange.max : 1}
                onChange={this.updateColorBy}
                opacityPoints={this.props.opacityPoints}
                onOpacityPointsChange={this.props.setOpacityPoints}
                onOpacityEditModeChange={this.props.onOpacityEditModeChange}
                opacityEditorSize={[250, 90]}
                hidePointControl
                useGaussian
                gaussians={this.props.gaussians}
              />
            </ProxyEditorWidget>
          </div>
        )}
      </div>
    );
  }
}

PipelineBrowser.propTypes = {
  visible: PropTypes.bool,
  presets: PropTypes.object.isRequired, // { presetName: image }
  pipeline: PropTypes.object.isRequired,
  idMapOfSourceToRep: PropTypes.object.isRequired,
  source: PropTypes.object,
  representation: PropTypes.object,
  view: PropTypes.object,
  lutImage: PropTypes.string,
  lutRange: PropTypes.object,
  playing: PropTypes.bool.isRequired,
  opacityPoints: PropTypes.array,
  gaussians: PropTypes.array,

  // actions:
  deleteProxy: PropTypes.func.isRequired,
  setActiveSource: PropTypes.func.isRequired,
  // colorBy: PropTypes.func.isRequired,
  propertyChange: PropTypes.func.isRequired,
  // scalarBar: PropTypes.func.isRequired,
  // updatePreset: PropTypes.func.isRequired,
  // updateScalarRange: PropTypes.func.isRequired,
  updateCollapsableState: PropTypes.func.isRequired,
  setOpacityPoints: PropTypes.func.isRequired,
  onOpacityEditModeChange: PropTypes.func.isRequired,
};

PipelineBrowser.defaultProps = {
  visible: true,
  source: undefined,
  representation: undefined,
  view: undefined,
  lutImage: undefined,
  lutRange: undefined,
  opacityPoints: undefined,
  gaussians: undefined,
};

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect((state) => {
  const props = {
    opacityPoints: selectors.colors.getPiecewisePoints(state),
    idMapOfSourceToRep: selectors.proxies.getSourceToRepresentationMap(state),
    playing: selectors.time.isAnimationPlaying(state), // fix perf issue with Properties UI
    presets: selectors.colors.getPresetsImages(state),
    pipeline: selectors.proxies.getPipeline(state),
    source: selectors.proxies.getSourcePropertyGroup(state),
    representation: selectors.proxies.getRepresentationPropertyGroup(state),
    view: selectors.proxies.getViewPropertyGroup(state),
    lutImage: selectors.colors.getScalarBarImage(state),
    lutRange: selectors.colors.getScalarBarRange(state),
    gaussians: selectors.colors.getPiecewiseGaussians(state),

    propertyChange: ({ changeSet, invalidatePipeline, owners }) => {
      dispatch(actions.proxies.applyChangeSet(changeSet, owners));
      if (invalidatePipeline) {
        dispatch(actions.proxies.fetchPipeline());
      }

      // Make sure we update the full proxy not just the edited properties
      if (owners) {
        owners.forEach((id) => dispatch(actions.proxies.fetchProxy(id)));
      }
    },
    deleteProxy: (id) => {
      dispatch(actions.proxies.deleteProxy(id));
    },
    setActiveSource: (id) => {
      dispatch(actions.active.activate(id, 'source'));
    },
    updateScalarRange: ({ options }) => {
      dispatch(actions.colors.rescaleTransferFunction(options));
      dispatch(
        actions.colors.fetchLookupTableScalarRange(
          selectors.proxies.getActiveSourceId(state)
        )
      );
    },
    updateCollapsableState(name, isOpen, collapseType) {
      dispatch(actions.ui.updateCollapsableState(name, isOpen, collapseType));
    },
    scalarBar: ({ source, visible }) => {
      dispatch(actions.colors.showScalarBar(source, visible));
      // The UI rely on representation proxy state to show scalarbar visibility state
      dispatch(
        actions.proxies.fetchProxy(
          selectors.proxies.getActiveRepresentationId(state)
        )
      );
    },
    colorBy: ({
      representation,
      arrayLocation,
      arrayName,
      colorMode,
      vectorMode,
      vectorComponent,
      rescale,
    }) => {
      dispatch(
        actions.colors.applyColorBy(
          representation,
          colorMode,
          arrayLocation,
          arrayName,
          vectorComponent,
          vectorMode,
          rescale
        )
      );
    },
    updatePreset: ({ representation, preset }) => {
      dispatch(actions.colors.applyPreset(representation, preset));
    },
    setOpacityPoints(points, gaussians) {
      const serverFormat = [];
      points.forEach((p) => {
        serverFormat.push(p.x);
        serverFormat.push(p.y);
        serverFormat.push(p.x2 || p.midpoint || 0.5);
        serverFormat.push(p.y2 || p.sharpness || 0.5);
      });
      dispatch(
        actions.colors.storePiecewiseFunction(
          selectors.colors.getColorByArray(state),
          points,
          serverFormat
        )
      );
      if (gaussians) {
        dispatch(
          actions.colors.storeGuassians(
            selectors.colors.getColorByArray(state),
            gaussians
          )
        );
      }
    },
    onOpacityEditModeChange(isEditing) {
      // Extract updates to push
      if (!isEditing) {
        dispatch(actions.colors.pushPendingServerOpacityPoints());
      }
    },
  };
  return props;
})(PipelineBrowser);
