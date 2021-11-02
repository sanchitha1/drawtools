// All global variables
var edit;
var draw;
var snap;
var flag_is_drawing_on = false;
// Custom Control
class drawing_app extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.id = 'button_start'
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
    if (flag_is_drawing_on == false) { // checking if the drawing mode is on
      $('#start_draw_modal').modal('show'); // if not show modal
    } else {
      map.removeInteraction(draw); // if drawing mode is on, then turn it off
      map.removeInteraction(edit); // if edit mode is on, then turn it off
      flag_is_drawing_on = false; // setting the drawing mode to initial status
      document.getElementById('button_start').innerHTML = '<i class ="fas fa-draw-polygon"></i>' // Setting the button to initial state
    }
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
const layer_array = [baseLayer, draw_layer]

// Controls Attribute Collapse
const mycontrols = new ol.control.defaults({
  attributionOptions: {
    collapsible: true
  }
}).extend([new drawing_app()]);
// Map
const map = new ol.Map({
  target: 'mymap',
  view: myview,
  layers: layer_array,
  controls: mycontrols,
});

// Function to start drawing
function start_draw(geom_type) {
  draw = new ol.interaction.Draw({
    type: geom_type,
    source: draw_source
  });
  snap = new ol.interaction.Snap({
    source: draw_source
  })
  $('#start_draw_modal').modal('hide');
  map.addInteraction(draw);
  map.addInteraction(snap);
  flag_is_drawing_on = true; // set to drawing mode is on inside the flag
};

function start_edit() {
  edit = new ol.interaction.Modify({
    source: draw_source
  });
  snap = new ol.interaction.Snap({
    source: draw_source
  })
  $('#start_draw_modal').modal('hide');
  map.addInteraction(edit);
  map.addInteraction(snap);
  flag_is_drawing_on = true; // set to drawing mode is on inside the flag
};