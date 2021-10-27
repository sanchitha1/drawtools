// Custom Control
class drawing_app extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-draw-polygon"></i>';

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
    $('#start_draw_modal').modal('show');
  }
}


// View
const myview = new ol.View({
  projection: 'EPSG:4326',
  center: [80.98885377363007, 6.830454104603501], // remeber to set latlon in 'lon' first and 'lat' scecond
  zoom: 17
});

// OSM Layer
const baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Draw vector layer
// 1. Define source
const draw_source = new ol.source.Vector()
// 2. Define layer
const draw_layer = new ol.layer.Vector({
  source: draw_source
})

// Layer Array
const layer_array = [baseLayer]

// Controls Attribute Collapse
const mycontrols = new ol.control.defaults({
  attributionOptions:{
    collapsible:true
  }
}).extend([new drawing_app()]);
// Map
const map = new ol.Map({
  target: 'mymap',
  view: myview,
  layers: layer_array,
  controls: mycontrols,
});