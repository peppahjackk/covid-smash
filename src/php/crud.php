<?php
include "config.php";


$conn = new mysqli($servername, $dbusername, $dbpass, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . mysqli_connect_error());
}

// This houses all data passed by the javascript or communicating file
$_POST = json_decode(file_get_contents('php://input'), true);

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
if ($table === 'matches') {
  $table = $tableMatches;
} else if ($table === 'picks') {
  $table = $tablePicks;
} else if ($table === 'users') {
  $table = $tableUsers;
} else {
  echo "ERROR: Invalid table specified" . $input_table;
}

if (empty($_POST["req"]) || $_POST["req"] === 'get') {
  $sql = "select * from " . $table . $filter . $sort . $limit;

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      // Add each row to an array we'll send to the front end
      $rows[] = $row;
    }

    echo json_encode($rows);
  } else {
    echo "0 results";
  }
} else if ($table === $tableUsers) {
  $name = $_POST["name"];
  $user_id = $_POST["user_id"];
  $referrer = $_POST["referrer"];

  $sql = "REPLACE INTO " . $table . " " .
    "(user_id, name, referrer ) " .
    "VALUES ('$user_id', '$name', '$referrer' )";

  if ($conn->query($sql) === FALSE) {
    echo 'Error: ' . $sql . '<br>' . $conn->error;
  } else {
    echo 'Pick data logged';
  }
} else if ($_POST["req"] === 'insert') {
  $game = $_POST["game"];
  $stage = $_POST["stage"];
  $system = $_POST["system"];
  $fighters = $_POST["fighters"];
  $pick_value = $_POST["pick_value"];
  $match_idx = $_POST["match_idx"];

  $sql = "INSERT INTO " . $table . " " .
    "(stage, fighters, in_progress, winning_fighter, winning_picker, pick_value, complete, hidden, game, system, match_idx) " .
    "VALUES ( '$stage', '$fighters', null, null, null, '$pick_value', 0, 0, '$game', '$system', '$match_idx' )";

  if ($conn->query($sql) === FALSE) {
    echo 'Error: ' . $sql . '<br>' . $conn->error;
  } else {
    echo 'Data logged';
  }
} else if ($_POST["req"] === 'update') {
  $updateString = '';

  if (isset($_POST["in_progress"])) {
    if (strlen($updateString) > 0) {
      $updateString .= ', ';
    }

    $updateString .= 'in_progress = "' . json_encode($_POST["in_progress"]) . '"';
  }

  if (isset($_POST["complete"])) {
    if (strlen($updateString) > 0) {
      $updateString .= ', ';
    }

    $updateString .= 'complete = ' . json_encode($_POST["complete"]);
  }

  if (isset($_POST["hidden"])) {
    if (strlen($updateString) > 0) {
      $updateString .= ', ';
    }

    $updateString .= 'hidden = ' . json_encode($_POST["hidden"]);
  }

  if (isset($_POST["winning_fighter"])) {
    if (strlen($updateString) > 0) {
      $updateString .= ', ';
    }

    $updateString .= 'winning_fighter = ' . json_encode($_POST["winning_fighter"]);
  }

  if (isset($_POST["winning_picker"])) {
    if (strlen($updateString) > 0) {
      $updateString .= ', ';
    }

    $updateString .= 'winning_picker = ' . json_encode($_POST["winning_picker"]);
  }


  if ($errorMSG == "") {
    $sqlSet = "UPDATE " . $table . " SET " . $updateString . $filter . $sort . $limit;

    if ($conn->query($sqlSet) === FALSE) {
      echo 'Error: ' . $sqlSet . '<br>' . $conn->error;
    } else {
      echo 'Settings saved';
    }
  } else {
    echo $errorMSG;
  }
} else if ($_POST["req"] === 'replace') {
  $stage = $_POST["stage"];
  $fighter = $_POST["fighter"];
  $referrer = $_POST["referrer"];
  $name = $_POST["name"];
  $pick_value = $_POST["pick_value"];
  $match_id = $_POST["match_id"];
  $match_idx = $_POST["match_idx"];
  $user_id = $_POST["user_id"];
  $pick_id = $_POST["pick_id"];

  $sql = "REPLACE INTO " . $table . " " .
    "(pick_id, match_id, user_id, name, pick_value, net_value, fighter, referrer, match_idx ) " .
    "VALUES ( '$pick_id', '$match_id', '$user_id', '$name', '$pick_value', '$net_value', '$fighter', '$referrer', '$match_idx' )";

  if ($conn->query($sql) === FALSE) {
    echo 'Error: ' . $sql . '<br>' . $conn->error;
  } else {
    echo 'Pick data logged';
  }
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
