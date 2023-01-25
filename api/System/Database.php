<?php

namespace System;

use Exception;
use PDO;

class Database {

    private static $instances = [];

    public static function Init(): PDO
    {
        $cls = static::class;

        if (!isset(self::$instances[$cls])) {
            $host = $_ENV['HOST'];
            $database = $_ENV['DB'];
            $user = $_ENV['USER'];
            $password = $_ENV['PASSWORD'];
            $charset = $_ENV['CHARSET'];

            $connection = "mysql:host={$host};dbname={$database};charset={$charset}";

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => true,
            ];
            
            self::$instances[$cls] = new PDO($connection, $user, $password, $options);
        }

        return self::$instances[$cls];
    }

    protected function __construct() { }

    protected function __clone() { }

    public function __wakeup()
    {
        throw new Exception("Cannot unserialize a singleton.");
    }
}