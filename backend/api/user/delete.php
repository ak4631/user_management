<?php
require_once('../../config/cors.php');
require_once('../../config/database.php');

$data = json_decode(file_get_contents("php://input"), true);

// Validate
if (!isset($data['id'])) {
    echo json_encode(["message" => "User ID is required"]);
    exit;
}

$id = $data['id'];

$sql = "UPDATE users SET is_deleted=1 WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "User deleted successfully"]);
} else {
    echo json_encode(["message" => "Delete failed: " . $stmt->error]);
}
?>