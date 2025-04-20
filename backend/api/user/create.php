<?php
require_once("../../config/cors.php");
require_once("../../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);
$dob = $data['dob'];

try {
    // Email exists check
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND is_deleted = 0");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo json_encode(["message" => "Email already exists."]);
    } else {
        $sql = "INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $name, $email, $password, $dob);
        $stmt->execute();

        echo json_encode(["message" => "User created successfully"]);
        $stmt->close();
    }

    $checkStmt->close();

} catch (mysqli_sql_exception $e) {
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} finally {
    $conn->close();
}

?>
