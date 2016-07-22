import { combineReducers } from 'redux';

import active  from './active';
import colors  from './colors';
import files   from './files';
import network from './network';
import proxies from './proxies';
import save    from './save';
import time    from './time';
import ui      from './ui';

export default combineReducers({
  active,
  colors,
  files,
  network,
  proxies,
  save,
  time,
  ui,
});
