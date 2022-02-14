<?php
$host = 'localhost';
$db = 'info_bhoomy';
$user = 'postgres';
$pass = '111111';
$port = '5432';

$dsn = "pgsql:host=$host;dbname=$db;port=$port";

$opt = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    //code...
    $pdo = new PDO($dsn, $user, $pass, $opt);
} catch (PDOException $e) {
    //throw $th;
    echo "Error: " . $e->getMessage() . "<br>";
    echo "Line Number: " . $e->getLine();
}
?>