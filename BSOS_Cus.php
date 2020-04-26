<?php
$cust_name = $_POST["cust_name"];
$temparray = $_POST["add_info"];
$realvalue = NULL;
foreach($temparray AS $value){
    if(!empty($value)){
        $realvalue = (string) $value;
        break;
    }
}
// echo $realvalue;
$temp_explode = explode("|", $realvalue);
$support_type = $temp_explode[0];
$add_info = $temp_explode[1];

if (!empty($cust_name) || !empty($support_type) || !empty($add_info)) {
    $host= "localhost";
    $dbUsername= "root";
    $dbPassword= "";
    $dbName = "mysampletable";
    // Create connection
    $conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);
    if(mysqli_connect_error()){
        die('Connect Error('.mysqli_connect_error().')'. mysqli_connect_error());
    } 
    else {
        $SELECT = "SELECT cust_name From customers Where cust_name = ? Limit 1";
        $INSERT = "INSERT Into customers (cust_name, support_type, add_info) values (?, ?, ?)";
        
        $stmt = $conn->prepare($SELECT);
        $stmt->bind_param("s", $cust_name);
        $stmt->execute();
        $stmt->bind_result($cust_name);
        $stmt->store_result();
        $rnum = $stmt->num_rows;

        if($rnum == 0){
            $stmt->close();

            $stmt = $conn->prepare($INSERT);
            $stmt->bind_param("sss", $cust_name, $support_type, $add_info);
            $stmt->execute();
            header('Location: index.html');
            exit;
           
        } else {
            echo "Request previously sent. Please hold, an agent will be with you shortly...";
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