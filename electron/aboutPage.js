const openAboutWindow = require('about-window').default;
const join = require('path').join;

module.exports = {
  label: 'About ParaViewWeb Visualizer',
  click: () => openAboutWindow({
    icon_path: join(__dirname, 'icon.png'),
    package_json_dir: join(__dirname, '../'),
  }),
};
