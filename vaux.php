<?php

/*
  Get hostname from referer
  $url - string , URL to retrieve domain from
 */
function getDomain($url) {
    return parse_url($url, PHP_URL_HOST);
}

/*
  Kill page execution with 404 Not Found
 */
function killPage() {
    die("404 Not Found");
}

/*
  Confirm if theres any variable in array is either null or empty
  $vars - array , Set of variables to be tested
 */
function isAnyNullEmpty(array $vars) {
    $results = array();
    foreach ($vars as $var) {
        $result = (isset($var) ? ($var == null ? false : true) : false);
        array_push($results, $result);
    }
    return (in_array(false, $results) ? true : false);
}

/*
  Is string length equal to config
  $var - Variable to be tested for length
  $length - Length of the var
 */
function isStringLenEqual($var, $length) {
    return strlen($var) == $length ? true : false;
}

class Checkpoint {
  public $paramVideo;
  public $paramMode;
  public $paramReferer;
  public $paramUserAgent;
  public $paramRemoteAddr;
  public $paramMethod;
}
?>
