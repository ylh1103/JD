<?php
include('mysql.php');
// 获取所有的景点信息
$res = mysqli_query($link,"select * from scenics");
$arr = [];
while($row = mysqli_fetch_assoc($res)){
    $arr[] = $row;
}
echo json_encode([
    "meta"=>[
        "status"=>0,
        "msg"=>"数据获取成功"
    ],
    "data"=>$arr
]);