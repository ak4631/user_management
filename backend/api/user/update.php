<?php
require_once("../../config/cors.php");
require_once("../../config/database.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];
    $name = $data['name'];
    $email = $data['email'];
    $dob = $data['dob'];
    $password = isset($data['password']) && !empty($data['password']) 
                ? password_hash($data['password'], PASSWORD_BCRYPT) 
                : null;

    // 1. Duplicate check
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND is_deleted = 0 AND id != ?");
    $checkStmt->bind_param("si", $email, $id);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo json_encode(["message" => "Email already in use by another user."]);
        exit;
    }
    // 1. Duplicate check

    // 2. Proceed with the update
    if ($password) {
        $sql = "UPDATE users SET name=?, email=?, password=?, dob=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssi", $name, $email, $password, $dob, $id);
        $stmt->execute();
        echo json_encode(["message" => "User updated successfully"]);
    }
    else{
        echo json_encode(["message" => "Please Enter Password"]);
        exit;
    }
    // 2. Proceed with the update
    

} catch (mysqli_sql_exception $e) {
    http_response_code(400);
    echo json_encode(["message" => "Update failed", "error" => $e->getMessage()]);
    exit;
}
?>
