import { combineReducers } from 'redux';

import active from './ducks/active';
import colors from './ducks/colors';
import files from './ducks/files';
import network from './ducks/network';
import proxies from './ducks/proxies';
import save from './ducks/save';
import time from './ducks/time';
import ui from './ducks/ui';
import view from './ducks/view';

export default combineReducers({
  active,
  colors,
  files,
  network,
  proxies,
  save,
  time,
  ui,
  view,
});
