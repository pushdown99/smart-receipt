<?php
include_once __DIR__ . '/vendor/autoload.php';

use aymanrb\UnstructuredTextParser\TextParser;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

try {
  $logger = new Logger('text-parser');
  $logger->pushHandler(new StreamHandler('logs/text-parser.log', Logger::DEBUG));
  $parser = new aymanrb\UnstructuredTextParser\TextParser(__DIR__ . '/templates', $logger);
  echo json_encode($parser->parseText($argv[1], false), JSON_PRETTY_PRINT);
  //echo json_encode($parser->parseText($argv[1], false)->getParsedRawData(), JSON_PRETTY_PRINT);
} catch (Exception $e) {
  echo $e->getMessage();
}


/*
use aymanrb\UnstructuredTextParser\TextParser;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

try {
    $logger = new Logger('text-parser');
    $logger->pushHandler(new StreamHandler('logs/text-parser.log', Logger::DEBUG));

    $parser = new TextParser(__DIR__ . '/templates', $logger);
    //$parseResults = $parser->parseText($argv[1], false)
    echo json_encode($parser->parseText($argv[1], false), JSON_PRETTY_PRINT);
    //echo json_encode($parser->parseText($argv[1], false)->getParsedRawData(), JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo $e->getMessage();
}
*/
?>

