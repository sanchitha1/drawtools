<?php
include "../includes/init.php"; // including data base connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') { // checking the server request methord, if that successful then below execute
    if (isset($_POST['id_of_feature'])) { // checking if there are data exist from the POST method 
    $id = $_POST['id_of_feature']; //  POST method data type

    $sql = "DELETE FROM feature_drawn WHERE feature_id = :id"; // query for the record delete
    $stmnt = $pdo->prepare($sql);
    $stmnt->execute([":id" => $id]);

    $successful = array("status_code" => 300); // Defining an array with key value pair
    $unsuccessful = array("status_code" => 301); // Defining an array with key value pair

    if ($stmnt) { // if query executed sucessfully then below execute
        echo json_encode($successful); // echo json_encode converting associative array into a JSON object from PHP variables
    } else {
        echo json_encode($unsuccessful); // echo json_encode converting associative array into a JSON object from PHP variables

    }
}
