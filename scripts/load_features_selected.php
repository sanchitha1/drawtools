<?php
include "../includes/init.php"; // including data base connection

 $areamin = $_POST['areamin'];
 $areamax = $_POST['areamax'];
$valuemin = $_POST['valuemin'];
$valuemax = $_POST['valuemax'];
$assessment = $_POST['assessment'];
//$areamin = 0;
//$areamax = 4000;





 // checking the server request methord, if that successful then below execute
    // $sql = "SELECT gid,id,layer,path,area,assessment,valuation, ST_AsGeoJSON(geom) AS geojson FROM allparcelsnew1 where area between ".$areamin." and ".$areamax." and valuation between ".$valuemin." and ".$valuemax." and assessment = ".$assessment;
    // $sql="SELECT *, ST_AsGeoJSON(geom) AS geojson FROM allparcelsnew1";
    // echo $sql;
    $sql = "SELECT gid,id,layer,path,area,assessment,valuation, ST_AsGeoJSON(geom) AS geojson FROM allparcelsnew1 where area between ".$areamin." and ".$areamax ." and
    assessment = '".$assessment."' and valuation between ".$valuemin." and ".$valuemax; 


    $query = $pdo->query($sql); // query executing

    $geojson = array(
        'type' => 'FeatureCollection',
        'features' => array(),
    );
    foreach ($query as $row) {
        $feature = array
            (
            'type' => 'Feature',

            'geometry' => json_decode($row['geojson'], true),
            'properties' => array
            (
                'gid' => $row['gid'],
                'pid' => $row['id'],
            ),
        );
        array_push($geojson['features'], $feature);
    }

    // pg_close($dsn);
    // header('Content-type: application/json', true);
    echo json_encode($geojson);

