<?php
$host = 'localhost';
$db = 'infobhoomi_test';
$user = 'postgres';
$pass = '123';
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
