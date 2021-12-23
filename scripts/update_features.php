<?php
include "../includes/init.php"; // including data base connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') { // checking the server request methord, if that successful then below execute
    $type = $_POST['type_of_geom']; //  POST method data type
    $name = $_POST['name_of_geom']; //  POST method data type
    $string_geom = $_POST['string_of_geom']; //  POST method data type
    $id = $_POST['id_of_feature'];
    try {
        $sql = "UPDATE feature_drawn SET type = '$type', name = '$name', geom = ST_GeomFromGeoJSON('$string_geom') WHERE feature_id = '$id'"; // query for the record inserting
        $query = $pdo->query($sql); // query executing
    } catch (PDOException $e) {
        echo "Error <br><br>" . $e->getMessage() . "<br>";
        echo "Line Number: " . $e->getLine();
    }
}
