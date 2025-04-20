<?php
require_once("../../config/cors.php");
require_once("../../config/database.php");

$query = "SELECT id,name,email,dob FROM users WHERE is_deleted = 0";
$result = $conn->query($query);
$users = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);
?>