// All global variables
var button_draw;
var button_edit;
var abort = false; // set abort to true from the begining of the inirialization , because if someone start edit after the map loads, he or she must be able to start editing
var edit;
var draw;
var snap;
var select_click;
var flag_is_drawing_mode_on = false; // turning off the drawing mode begining of the inirializarion of the map to start the drawing mode
var flag_is_editing_mode_on = false; // turning off the editing mode begining of the inirializarion of the map to start the editing mode
var point_types = ['Trees', 'ATM', 'Telephone Booth', 'Telephone Poles', 'Electricity Poles'];
var line_types = ['Roads', 'Rivers', 'Utility Lines'];
var polygon_types = ['Buildings', 'Land', 'Grounds', 'Yards'];
var selected_geom_type;
var edit_geom_type;
// Custom Control
class drawing_button extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    button_draw = document.createElement('button'); // Creating button element
    button_draw.id = 'button_start_draw' // Creating button id
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
    if (flag_is_drawing_or_editing_mode_on == false) { // checking if the drawing and editing mode is off
      $('#start_draw_modal').modal('show'); // Then show modal
    } else { // If drawing and editing mode is on
      map.removeInteraction(draw); // if drawing mode is on, then turn it off
      abort = false; // when draw mode is off, map on click function termication will be closed means function can be executed again
      flag_is_drawing_mode_on = false; // setting the drawing and editing mode to initial status
      document.getElementById('button_start_draw').innerHTML = '<i class ="fas fa-draw-polygon"></i>' // Setting the button to initial state
      define_type_of_features(); // Activate the function in drawing and editing mode on
      $('#enter_information_modal').modal('show'); // Show form to enter the information when the button is clicked after drawing a feature when draw mode is on
    }
  }
}

class editing_button extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    button_edit = document.createElement('button'); // Creating button element
    button_edit.id = 'button_start_edit' // Creating button id
    button_edit.innerHTML = '<i class="fas fa-edit"></i>'; // Creating button element

    var element_edit = document.createElement('div'); // Creating div element
    element_edit.className = 'edit-tool ol-unselectable ol-control'; // Creating element class
    element_edit.appendChild(button_edit); // Appending button element as a child element inside the div

    super({
      element: element_edit,
      target: options.target,
    });

    button_edit.addEventListener('click', this.start_stop_editing.bind(this), false);
  }

  start_stop_editing() { // Function when button is clicked
    console.log("hit")
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
}).extend([new drawing_button(), new editing_button()]);

// Map
var map = new ol.Map({
  target: 'mymap',
  view: myview,
  layers: layer_array,
  controls: mycontrols,
});

select_click = new ol.interaction.Select({
  condition: ol.events.condition.click,
  hitTolerance: 1
});
map.addInteraction(select_click);


// Function to start drawing
function start_draw(geom_type) {
  abort = true; // map on click function will stop execution
  selected_geom_type = geom_type;
  draw = new ol.interaction.Draw({
    type: geom_type,
    source: draw_source
  });
  snap = new ol.interaction.Snap({
    source: draw_source
  });
  $('#start_draw_modal').modal('hide');
  map.addInteraction(draw);
  map.addInteraction(snap);
  document.getElementById('button_start_draw').innerHTML = '<i class ="far fa-stop-circle"></i>' // Activating the stop button
  flag_is_drawing_or_editing_mode_on = true; // set to drawing and editing mode is on inside the flag
};

// Function Start Editing
function start_edit() {
  edit = new ol.interaction.Modify({
    source: draw_source
  });
  snap = new ol.interaction.Snap({
    source: draw_source
  });
  map.addInteraction(edit);
  map.addInteraction(snap);
  map.addInteraction(select_click);
  document.getElementById('button_start_draw').innerHTML = '<i class ="far fa-stop-circle"></i>' // Activating the stop button
  flag_is_drawing_or_editing_mode_on = true; // set to drawing and editing mode is on inside the flag


};

// function to find the clicked feature geometry type
map.on('click', function(evt) {
  if (abort) { // if abort == true , function execution will stop
    return;
  }
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer) {
      if (abort) { // if abort == true , function execution will stop
        return;
      }
      return feature;
    }, {
      hitTolerance: 8,
    });
  if (feature) { // if featuer exist
    if (abort) { // if abort == true , function execution will stop
      return;
    }
    var geometry = feature.getGeometry();
    var type = geometry.getType();
    console.log(type);
    selected_geom_type = type;
    console.log(selected_geom_type);
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