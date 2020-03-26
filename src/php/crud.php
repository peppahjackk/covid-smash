<?php
include "config.php";


$conn = new mysqli($servername, $dbusername, $dbpass, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . mysqli_connect_error());
}

// This houses all data passed by the javascript or communicating file
$_POST = json_decode(file_get_contents('php://input'), true);

$input_table = $data->table;

if (empty($_POST["table"])) {
  echo 'Error no table given';
} else {
  $table = $_POST["table"];
}

if (empty($_POST["sort"])) {
  $sort = '';
} else {
  $sort = ' ORDER BY ' . $_POST["sort"];
}

if (empty($_POST["filter"])) {
  $filter = '';
} else {
  $filter = ' WHERE ' . $_POST["filter"];
}

if (empty($_POST["limit"])) {
  $limit = '';
} else {
  $limit = ' LIMIT ' . $_POST["limit"];
}

// Fetch All records
if($input_table === 'matches'){
  $table = $tableMatches;
} else if ($input_table === 'picks') {
  $table = $tablePicks;
}

$sql = "select * from " . $table . $filter . $sort . $limit;

$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    // Add each row to an array we'll send to the front end
    $rows[] = $row;
  }

  echo json_encode($rows);

} else {
  echo "0 results";
}
exit;

// // Add record
// if($request == 2){
//   $username = $data->username;
//   $name = $data->name;
//   $email = $data->email;

//   $userData = mysqli_query($conn,"SELECT * FROM users WHERE username='".$username."'");
//   if(mysqli_num_rows($userData) == 0){
//     mysqli_query($conn,"INSERT INTO users(username,name,email) VALUES('".$username."','".$name."','".$email."')");
//     echo "Insert successfully";
//   }else{
//     echo "Username already exists.";
//   }

//   exit;
// }

// // Update record
// if($request == 3){
//   $id = $data->id;
//   $name = $data->name;
//   $email = $data->email;

//   mysqli_query($conn,"UPDATE users SET name='".$name."',email='".$email."' WHERE id=".$id);
 
//   echo "Update successfully";
//   exit;
// }

// // Delete record
// if($request == 4){
//   $id = $data->id;

//   mysqli_query($conn,"DELETE FROM users WHERE id=".$id);

//   echo "Delete successfully";
//   exit;
// }