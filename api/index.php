<?php

use System\App;

require_once './autoload.php';
date_default_timezone_set('America/Montevideo');

$app = new App();
$app->ProcessRoute();