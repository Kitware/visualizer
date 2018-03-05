import * as active from './ducks/active';
import * as colors from './ducks/colors';
import * as files from './ducks/files';
import * as network from './ducks/network';
import * as proxies from './ducks/proxies';
import * as save from './ducks/save';
import * as time from './ducks/time';
import * as ui from './ducks/ui';
import * as view from './ducks/view';

function resetVisualizerState() {
  return { type: 'RESET_VISUALIZER_STATE' };
}

export default {
  active,
  colors,
  files,
  network,
  proxies,
  resetVisualizerState,
  save,
  time,
  ui,
  view,
};
