<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");





$servername = "localhost";
$username = "root"; // Change if needed
$password = "ROOT"; // Change if needed
$database = "music_player";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch songs from database
$sql = "SELECT * FROM songs";
$result = $conn->query($sql);

$songs = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
}

// Return JSON data
echo json_encode($songs);

$conn->close();
?>
