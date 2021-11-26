<?php
include "../includes/init.php"; // including data base connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') { // checking the server request methord, if that successful then below execute
    $type = $_POST['type_of_geom']; //  POST method data type
    $name = $_POST['name_of_geom']; //  POST method data type
    $string_geom = $_POST['string_of_geom']; //  POST method data type

    $sql = "INSERT INTO feature_drawn (type,name,geom) VALUES ('$type','$name', ST_GeomFromGeoJSON('$string_geom'))"; // query for the record inserting

    $query = $pdo->query($sql); // query executing

    $successful = array("status_code" => 200); // Defining an array with key value pair
    $unsuccessful = array("status_code" => 201); // Defining an array with key value pair

    if ($query) { // if query executed sucessfully then below execute
        echo json_encode($successful); // echo json_encode converting associative array into a JSON object from PHP variables
    } else {
        echo json_encode($unsuccessful); // echo json_encode converting associative array into a JSON object from PHP variables

    }
}
?>