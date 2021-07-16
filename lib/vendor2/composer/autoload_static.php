<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitdfb633ca110a695d2face3d669a0e904
{
    public static $prefixLengthsPsr4 = array (
        'a' => 
        array (
            'aymanrb\\UnstructuredTextParser\\' => 31,
        ),
        'P' => 
        array (
            'Psr\\Log\\' => 8,
        ),
        'M' => 
        array (
            'Monolog\\' => 8,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'aymanrb\\UnstructuredTextParser\\' => 
        array (
            0 => __DIR__ . '/..' . '/aymanrb/php-unstructured-text-parser/src',
        ),
        'Psr\\Log\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/log/Psr/Log',
        ),
        'Monolog\\' => 
        array (
            0 => __DIR__ . '/..' . '/monolog/monolog/src/Monolog',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitdfb633ca110a695d2face3d669a0e904::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitdfb633ca110a695d2face3d669a0e904::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}