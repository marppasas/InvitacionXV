<?php

namespace System;

class Utilities
{

    public static function GetRootPath($path = __DIR__): string {
        $directory = scandir(dirname($path));
        if (in_array(".env", $directory)) {
            return $path;
        } else {
            return self::GetRootPath($path . '/..');
        }
    }

    public static function GetClientIP(): string
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

}