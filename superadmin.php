<?php
$ad_name = $_POST["ad_name"];
$skill_tags = $_POST["skill_tags"];
$newvalues = implode(",", $skill_tags);

if (!empty($ad_name) || !empty($newvalues)) {
    $host= "localhost";
    $dbUsername= "root";
    $dbPassword= "";
    $dbName = "BSOS_DB";
    // Create connection
    $conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);
    if(mysqli_connect_error()){
        die('Connect Error('.mysqli_connect_error().')'. mysqli_connect_error());
    } 
    else {
        $SELECT = "SELECT ad_name From admins Where ad_name = ? Limit 1";
        $INSERT = "INSERT Into admins (ad_name, skill_tags) values (?, ?)";
        
        $stmt = $conn->prepare($SELECT);
        $stmt->bind_param("s", $ad_name);
        $stmt->execute();
        $stmt->bind_result($ad_name);
        $stmt->store_result();
        $rnum = $stmt->num_rows;

        if($rnum == 0){
            $stmt->close();

            $stmt = $conn->prepare($INSERT);
            $stmt->bind_param("ss", $ad_name, $newvalues);
            $stmt->execute();
            echo "Agent created";
        } else {
            echo "Agent already exists, try again";
        }
        $stmt->close();
        $conn->close();
    }
}
else {
    echo "All fields are required";
    die();
}

?>