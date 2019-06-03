<?php

/*
  video.php configuration
 */
error_reporting(0);                              // integer  , Error reporting level
$cfg_bypass = false;                             // boolean  , Bypass all verifications
$cfg_bypasschck = false;                         // boolean  , Bypass not set/empty variables verification
$cfg_faildie = true;							               // boolean  , Throw 'Bad Gateway' if request fails
$cfg_videos = ["jNQXAC9IVRw", "LeAltgu_pbM"];    // array    , Allowed youtube video ids
$cfg_idlength = 11;                              // integer  , Video id length
$cfg_videotype = ["video/mp4", "video/webm"];    // array    , Allowed video mimetypes
$cfg_refdomains = ["example.com", "www.example.com"];  // string   , Referer domains allowed
$cfg_methods = ["GET"];                          // array    , Allowed request methods
$cfg_ipwlist = true;                             // boolean  , Enable IP whitelist, if disabled blacklist is used
$cfg_ipwlist = ["127.0.0.1"];                    // array    , IP access whitelist, request will go through
$cfg_ipblist = [];                               // array    , IP access blacklist, request will be blocked
$cfg_failstatus = "status=fail";                 // string   , Failed request string (Shouldn't be changed)

/*
  Get hostname from referer
  $url - string , URL to retrieve domain from
 */
function getDomain($url)
{
    return parse_url($url, PHP_URL_HOST);
}

/*
  Kill page execution with 404 Not Found
 */
function killPage()
{
    die("404 Not Found");
}

/*
  Confirm if theres any variable in array is either null or empty
  $vars - array , Set of variables to be tested
 */
function isAnyNullEmpty(array $vars)
{
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
 */
function isStringLenEqual($var)
{
    return strlen($var) == $cfg_idlength ? true : false;
}

// Checkpoint variables for null or empty
$checkpoints = [$_GET["code"],                // GET request "code" variable
                $_SERVER["HTTP_REFERER"],     // HTTP url referer
                $_SERVER["HTTP_USER_AGENT"],  // Client user agent
                $_SERVER["REMOTE_ADDR"],      // Remote IP address
                $_SERVER["REQUEST_METHOD"]    // Request type (GET, POST, ..)
              ];

// Script startup checks
if (!$cfg_bypass) {
    isAnyNullEmpty($checkpoints) ?: killPage();                                    // Checkpoint verification, does Array have unset or empty variables
    in_array($_SERVER["REQUEST_METHOD"], $cfg_methods) ?: killPage();              // Is request method is allowed
    in_array(getDomain($_SERVER["HTTP_REFERER"]), $cfg_refdomains) ?: killPage();	 // Is referer allowed
    $cfg_ipwlist ?                                                                 // Is IP whitelist enabled?
    (in_array($_SERVER["REMOTE_ADDR"], $cfg_ipwlist) ?: killPage()) :              // Check if remote address is in IP whitelist
    !(in_array($_SERVER["REMOTE_ADDR"], $cfg_ipblist)) ?: killPage();              // If whitelist is disabled check if IP is in blacklist
    isStringLenEqual($_GET['code']) ?: killPage();	                               // Is video id length equal to configured
    in_array($_GET['code'], $cfg_videos) ?: killPage();                            // Is video id allowed
}

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$req_videoid = $_GET["code"];
$req_reply = file_get_contents("https://www.youtube.com/get_video_info?video_id=$req_videoid&el=embedded&ps=default&eurl=&gl=US&hl=en");

if (strpos($req_reply, $cfg_failstatus) !== false) {
    !$cfg_faildie ?: die("502 Bad Gateway");
    $req_split = explode("&", $req_reply);
    $keys = array();
    $pairs = array();
    $values = array();

    foreach ($req_split as $fields) {
        $keyvalue = explode("=", $fields);
        $key = $keyvalue[0];
        $value = $keyvalue[1];
        $keys[$key] = $value;
        $values[$key] = urldecode($value);
    }
    $pairs[] = $values;
    $pairs[0]["error"] = true;
    echo(json_encode($pairs, JSON_PRETTY_PRINT));
} else {
    $req_split = explode("&", $req_reply);
    $value = array();
    $ptkey = array();
    $keys = array();

    foreach ($req_split as $part) {
        $split = explode("=", $part);
        $key = $split[0];
        $value = $split[1];
        $etc = urldecode($value);
        $pkey[$key] = $value;
    }

    $streams = explode(',', urldecode($pkey['url_encoded_fmt_stream_map']));

    foreach ($streams as $req_reply) {
        $req_split = explode("&", $req_reply);
        foreach ($req_split as $part) {
            $split = explode("=", $part);
            $key = $split[0];
            $value = $split[1];
            $keys[$key] = urldecode($value);
        }
        $ptkey[] = $keys;
    }
    foreach ($ptkey as $object) {
        $decoded = json_encode($object, JSON_PRETTY_PRINT);
        $decoded = json_decode($decoded, JSON_PRETTY_PRINT);
        // Check and build http reply
        foreach ($cfg_videotype as $videotype) {
            if (strpos($decoded['type'], $videotype) !== false) {
                echo '<source src="' . $decoded['url'] . '" type="' . $videotype . '">';
                echo chr(0x0D).chr(0x0A);
            }
        }
    }
}
