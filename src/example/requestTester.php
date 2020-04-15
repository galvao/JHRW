<?php
$intervals = [0, 10];
$rand = random_int(0, 1);

sleep($intervals[$rand]);

header('Content-Type: application/json');
$a = ['foo' => 'bar'];
echo json_encode($a);
