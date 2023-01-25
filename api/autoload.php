<?php

spl_autoload_register(function ($class_name) {
    $a = dirname(__DIR__) . str_replace("\\", "/", "/api/{$class_name}.php");
    if (file_exists($a)) {
        require_once $a;
    }
});