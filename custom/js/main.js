// Custom Control
class drawing_app extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'N';

    const element = document.createElement('div');
    element.className = 'draw-tool ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.start_stop_drawing.bind(this), false);
  }

  start_stop_drawing() {
    // this.getMap().getView().setRotation(0);
    alert('You clicked control');
  }
}


// View
const myview = new ol.View({
  projection: 'EPSG:4326',
  center: [80.98885377363007, 6.830454104603501], // remeber to set latlon in 'lon' first and 'lat' scecond
  zoom: 19
});

// OSM Layer
const baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Layer Array
const layer_array = [baseLayer]

// Controls Attribute Collapse
const mycontrols = new ol.control.defaults({
  attributionOptions:{
    collapsible:true
  }
});
// Map
const map = new ol.Map({
  target: 'mymap',
  view: myview,
  layers: layer_array,
  controls: mycontrols,
});