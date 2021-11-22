// All global variables
var button_polygon;
var button_edit;
var button_delete;
var button_point;
var button_line;
var abort = false; // set abort to true from the begining of the inirialization , because if someone start edit after the map loads, he or she must be able to start editing
var edit;
var draw;
var snap;
var select_click;
var flag_is_editing_mode_on = false; // turning off the editing mode begining of the inirializarion of the map to start the editing mode
var flag_is_point_mode_on = false; // turning off the editing mode begining of the inirializarion of the map to start the editing mode
var flag_is_polygon_mode_on = false;
var flag_is_line_mode_on = false;
var point_types = ['Trees', 'ATM', 'Telephone Booth', 'Telephone Poles', 'Electricity Poles'];
var line_types = ['Roads', 'Rivers', 'Utility Lines'];
var polygon_types = ['Buildings', 'Land', 'Grounds', 'Yards'];
var selected_geom_type;
var edit_geom_type;
var feature;
// Custom Control
class polygon_button extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    button_polygon = document.createElement('button'); // Creating button element
    button_polygon.id = 'button_polygon' // Creating button id
    button_polygon.innerHTML = '<i class="fas fa-draw-polygon"></i>'; // Creating button element
    button_polygon.setAttribute('data-toggle', "tooltip"); // Setting attributes to the button
    button_polygon.setAttribute('data-placement', "right"); // Setting attributes to the button
    button_polygon.title = 'Draw polygon';

    var element_polygon = document.createElement('div'); // Creating div element
    element_polygon.className = 'polygon-tool ol-unselectable ol-control'; // Creating element class
    element_polygon.appendChild(button_polygon); // Appending button element as a child element inside the div

    super({
      element: element_polygon,
      target: options.target,
    });

    button_polygon.addEventListener('click', this.start_polygon_draw.bind(this), false);
  }

  start_polygon_draw() { // Function when button is clicked
    selected_geom_type = 'Polygon';
    if (flag_is_polygon_mode_on == false) {
      abort = true; // map on click function will stop execution
      draw = new ol.interaction.Draw({
        type: 'Polygon',
        source: draw_source
      });
      map.addInteraction(draw);
      button_polygon.innerHTML = '<i class ="far fa-stop-circle"></i>'; // Creating button element
      flag_is_polygon_mode_on = true;
    } else {
      abort = false
      map.removeInteraction(draw);
      flag_is_polygon_mode_on = false;
      button_polygon.innerHTML = '<i class="fas fa-draw-polygon"></i>'; // Creating button element
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
    button_edit.setAttribute('data-toggle', "tooltip"); // Setting attributes to the button
    button_edit.setAttribute('data-placement', "right"); // Setting attributes to the button
    button_edit.title = 'Edit features';

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
    if (flag_is_editing_mode_on == false) {
      start_edit();
    } else {
      map.removeInteraction(edit); // if edit mode is on, then turn it off
      flag_is_editing_mode_on = false
      document.getElementById('button_start_edit').innerHTML = '<i class="fas fa-edit"></i>' // Setting the button to initial state
      define_type_of_features(); // Activate the function in editing mode on
      $('#enter_information_modal').modal('show'); // Show form to enter the information when the button is clicked after editing a feature when edit mode is on
    }
  }
}

class point_button extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    button_point = document.createElement('button'); // Creating button element
    button_point.id = 'button_point' // Creating button id
    button_point.innerHTML = '<i class="fas fa-map-marker-alt"></i>'; // Creating button element
    button_point.setAttribute('data-toggle', "tooltip"); // Setting attributes to the button
    button_point.setAttribute('data-placement', "right"); // Setting attributes to the button
    button_point.title = 'Draw point';

    var element_point = document.createElement('div'); // Creating div element
    element_point.className = 'point-tool ol-unselectable ol-control'; // Creating element class
    element_point.appendChild(button_point); // Appending button element as a child element inside the div

    super({
      element: element_point,
      target: options.target,
    });

    button_point.addEventListener('click', this.start_point_draw.bind(this), false);
  }

  start_point_draw() { // Function when button is clicked
    selected_geom_type = 'Point';
    if (flag_is_point_mode_on == false) {
      abort = true; // map on click function will stop execution
      draw = new ol.interaction.Draw({
        type: 'Point',
        source: draw_source
      });
      map.addInteraction(draw);
      button_point.innerHTML = '<i class ="far fa-stop-circle"></i>'; // Creating button element
      flag_is_point_mode_on = true;
    } else {
      abort = false; // map on click function will stop execution
      map.removeInteraction(draw);
      flag_is_point_mode_on = false;
      button_point.innerHTML = '<i class="fas fa-map-marker-alt"></i>'; // Creating button element
    }
  }
}

class line_button extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    button_line = document.createElement('button'); // Creating button element
    button_line.id = 'button_line' // Creating button id
    button_line.innerHTML = '<i class="fas fa-bezier-curve"></i>'; // Creating button element
    button_line.setAttribute('data-toggle', "tooltip"); // Setting attributes to the button
    button_line.setAttribute('data-placement', "right"); // Setting attributes to the button
    button_line.title = 'Draw Line';


    var element_line = document.createElement('div'); // Creating div element
    element_line.className = 'line-tool ol-unselectable ol-control'; // Creating element class
    element_line.appendChild(button_line); // Appending button element as a child element inside the div

    super({
      element: element_line,
      target: options.target,
    });

    button_line.addEventListener('click', this.start_line_draw.bind(this), false);
  }

  start_line_draw() { // Function when button is clicked
    selected_geom_type = 'LineString';
    if (flag_is_line_mode_on == false) {
      abort = true; // map on click function will stop execution
      draw = new ol.interaction.Draw({
        type: 'LineString',
        source: draw_source
      });
      map.addInteraction(draw);
      button_line.innerHTML = '<i class ="far fa-stop-circle"></i>'; // Creating button element
      flag_is_line_mode_on = true;
    } else {
      abort = false; // map on click function will stop execution
      map.removeInteraction(draw);
      flag_is_line_mode_on = false;
      button_line.innerHTML = '<i class="fas fa-bezier-curve"></i>'; // Creating button element
    }
  }
}

class deleting_button extends ol.control.Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    button_delete = document.createElement('button'); // Creating button element
    button_delete.id = 'button_start_delete' // Creating button id
    button_delete.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Creating button element
    button_delete.setAttribute('data-toggle', "tooltip"); // Setting attributes to the button
    button_delete.setAttribute('data-placement', "right"); // Setting attributes to the button
    button_delete.title = 'Delete features';

    var element_delete = document.createElement('div'); // Creating div element
    element_delete.className = 'delete-tool ol-unselectable ol-control'; // Creating element class
    element_delete.appendChild(button_delete); // Appending button element as a child element inside the div

    super({
      element: element_delete,
      target: options.target,
    });

    button_delete.addEventListener('click', this.start_stop_deleting.bind(this), false);
  }

  start_stop_deleting() { // Function when button is clicked
    if (feature) { // if feature exist after click
      var confirm_msg = confirm("Are you sure, you want to permenantly DELETE this feature!?");
      if (confirm_msg == true) { // if clicked ok confirm_msg returns true
        draw_source.removeFeature(feature); // remove clicked feature
      } else { // if clicked cancel confirm_msg returns false
        return false; // Keep clicked feature
      }
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
}).extend([new polygon_button(), new editing_button(), new deleting_button(), new point_button(), new line_button()]);

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
  document.getElementById('button_start_edit').innerHTML = '<i class ="far fa-stop-circle"></i>' // Activating the stop button
  flag_is_editing_mode_on = true; // set to editing mode is on inside the flag
};

// function to find the clicked feature geometry type
map.on('click', function(evt) {
  if (abort) { // if abort == true , function execution will stop
    return;
  }
  feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer) {
      if (abort) { // if abort == true , function execution will stop
        return;
      }
      return feature;
    }, {
      hitTolerance: 8,
    });
  if (feature) { // if feature; exist
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

draw_source.on('addfeature', function(event) {
  console.log("Drawing Finished!")
  define_type_of_features(); // Activate the function in editing mode on
  $('#enter_information_modal').modal('show'); // Show form to enter the information when the button is clicked after editing a feature when edit mode is on
});

$('.ol-zoom-in, .ol-zoom-out').attr('data-toggle', "tooltip") // setting attributes to the Ol default buttons using jQuery

$(function() { // activating tooltip for every element containing 'data-toggle="tooltip"'
  $('[data-toggle="tooltip"]').tooltip()
})

// function to save information in to DATABASE
function save_features_db(){
  // get array of all features
  var feature_array = draw_source.getFeatures();
  // define geoJSON format
  var geo_JSON_format = new ol.format.GeoJSON();
  // use methord to convert feature to GeoJSON
  var feature_Geo_JSON = geo_JSON_format.writeFeaturesObject(feature_array);
  // Array of all GeoJSONs
  var geo_JSON_feature_array = feature_Geo_JSON.features;

  // console.log(geo_JSON_feature_array[0].geometry);

  // Catching the type of feature to the variable
  var type = $('#type_of_features').value;
  // Catching the name of feature to the variable
  var name = $('#name_of_feature').value;
  // Cathing the Geometry of the feaure
  var geom = JSON.stringify(geo_JSON_feature_array[0].geometry);

  
}