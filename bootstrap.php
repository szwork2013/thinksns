<?php

defined('TS_ROOT') || exit('Forbidden');

$path = dirname(__FILE__);
$path .= '/vendor/autoload.php';

if (!class_exists('App\\H5\\Common') && !file_exists($path)) {
    echo 'You must set up the project dependencies, run the following commands:', PHP_EOL,
         'curl -sS https://getcomposer.org/installer | php', PHP_EOL,
         'php composer.phar install', PHP_EOL
    ;

    exit(1);
} elseif (file_exists($path)) {
    require $path;
}

unset($path);
