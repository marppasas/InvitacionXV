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

}