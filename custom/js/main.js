// All global variables
var abort_edit = true; // setting abort_edit true on start to not to print gemetry type on console in draw option
var edit;
var draw;
var snap;
var select_click;
var flag_is_drawing_on = false;
var point_types = ['Trees', 'ATM', 'Telephone Booth', 'Telephone Poles', 'Electricity Poles'];
var line_types = ['Roads', 'Rivers', 'Utility Lines'];
var polygon_types = ['Buildings', 'Land', 'Grounds', 'Yards'];
var selected_geom_type;
var edit_geom_type;
// Custom Control
class drawing_app extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    var button_draw = document.createElement('button'); // Creating button element
    button_draw.id = 'button_start' // Creating button id
    button_draw.innerHTML = '<i class="fas fa-draw-polygon"></i>'; // Creating button element

    var element_draw = document.createElement('div'); // Creating div element
    element_draw.className = 'draw-tool ol-unselectable ol-control'; // Creating element class
    element_draw.appendChild(button_draw); // Appending button element as a child element inside the div

    super({
      element: element_draw,
      target: options.target,
    });

    button_draw.addEventListener('click', this.start_stop_drawing_and_editing.bind(this), false);
  }

  start_stop_drawing_and_editing() { // Function when button is clicked
    if (flag_is_drawing_on == false) { // checking if the drawing mode is off
      $('#start_draw_modal').modal('show'); // Then show modal
    } else { // If drawing mode is on
      map.removeInteraction(draw); // if drawing mode is on, then turn it off
      map.removeInteraction(edit); // if edit mode is on, then turn it off
      flag_is_drawing_on = false; // setting the drawing mode to initial status
      abort_edit = true; // if edit mode is on, stopping edit mode will set abort_edit to true -> means it stop the edit function as well as console.log('type');
      document.getElementById('button_start').innerHTML = '<i class ="fas fa-draw-polygon"></i>' // Setting the button to initial state
      define_type_of_features(); // Activate the function in drawing mode on
      $('#enter_information_modal').modal('show'); // Show form to enter the information when the button is clicked after drawing a feature when draw mode is on
    }
  }
}


// View
var myview = new ol.View({
  projection: 'EPSG:4326',
  center: [80.98885377363007, 6.830454104603501], // remeber to set latlon in 'lon' first and 'lat' scecond
  zoom: 17
});

// OSM Layer
var baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

// Draw vector layer
// 1. Define source
var draw_source = new ol.source.Vector()
// 2. Define layer
var draw_layer = new ol.layer.Vector({
  source: draw_source
})

// Layer Array
var layer_array = [baseLayer, draw_layer]

// Controls Attribute Collapse
var mycontrols = new ol.control.defaults({
  attributionOptions: {
    collapsible: true
  }
}).extend([new drawing_app()]);
// Map
var map = new ol.Map({
  target: 'mymap',
  view: myview,
  layers: layer_array,
  controls: mycontrols,
});

// Function to start drawing
function start_draw(geom_type) {
  selected_geom_type = geom_type;
  draw = new ol.interaction.Draw({
    type: geom_type,
    source: draw_source
  });
  snap = new ol.interaction.Snap({
    source: draw_source
  });
  select_click = new ol.interaction.Select({
    condition: ol.events.condition.click,
  });
  $('#start_draw_modal').modal('hide');
  map.addInteraction(draw);
  map.addInteraction(snap);
  map.addInteraction(select_click);
  document.getElementById('button_start').innerHTML = '<i class ="far fa-stop-circle"></i>' // Activating the stop button
  flag_is_drawing_on = true; // set to drawing mode is on inside the flag
};

// Function Start Editing
function start_edit() {
  if (abort_edit) { // if (abort_edit == true) function will stop executing
    return;
  }
  edit = new ol.interaction.Modify({
    source: draw_source
  });
  snap = new ol.interaction.Snap({
    source: draw_source
  });
  select_click = new ol.interaction.Select({
    condition: ol.events.condition.click,
  });
  $('#start_draw_modal').modal('hide');
  map.addInteraction(edit);
  map.addInteraction(snap);
  map.addInteraction(select_click);
  document.getElementById('button_start').innerHTML = '<i class ="far fa-stop-circle"></i>' // Activating the stop button
  flag_is_drawing_on = true; // set to drawing mode is on inside the flag

  
};

// function to find the clicked feature geometry type
map.on('click', function(evt) {
  if (abort_edit) { // if (abort_edit == true) function will stop executing
    return;
  }
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer) {
      if (abort_edit) { // if (abort_edit == true) function will stop executing
        return;
      }
      return feature;
    });
  if (feature) {
    var geometry = feature.getGeometry();
    var type = geometry.getType();
    selected_geom_type = type; // Drop down options of the 'type of feature' is set to clicked geometry type in editing mode
    console.log(type);
    console.log(selected_geom_type); // For debugging purpose
  };
});

// function to add types of feature
function define_type_of_features() {
  var drop_down_of_types = document.getElementById('type_of_features'); // Cathing HTML element with id='types_of_features' <select>
  drop_down_of_types.innerHTML = ''; // Clearing previous values of the element before creating the <options> dynamically
  if (selected_geom_type == 'Point') {
    for (let i = 0; i < point_types.length; i++) {
      var op = document.createElement('option'); // Creating dynamically HTML element <option> inside <select> element
      op.value = point_types[i]; //Assigning values to <option>
      op.innerHTML = point_types[i]; //Creating HTML elements for those assigned values
      drop_down_of_types.appendChild(op); //Appending the created <option> element as a child element of <select> 
    }
  } else if (selected_geom_type == 'LineString') {
    for (let i = 0; i < line_types.length; i++) {
      var op = document.createElement('option'); // Creating dynamically HTML element <option> inside <select> element
      op.value = line_types[i]; //Assigning values to <option>
      op.innerHTML = line_types[i]; //Creating HTML elements for those assigned values
      drop_down_of_types.appendChild(op); //Appending the created <option> element as a child element of <select> 
    }
  } else {
    for (let i = 0; i < polygon_types.length; i++) {
      var op = document.createElement('option'); // Creating dynamically HTML element <option> inside <select> element
      op.value = polygon_types[i]; //Assigning values to <option>
      op.innerHTML = polygon_types[i]; //Creating HTML elements for those assigned values
      drop_down_of_types.appendChild(op); //Appending the created <option> element as a child element of <select> 
    }
  }
}