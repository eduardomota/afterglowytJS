<?php

require "vconfig.php";
require "vaux.php";

$conf = new Configuration;
$checkpoint = new Checkpoint;

if (!$conf->useAsProxy) {
  // Set headers
  header("Access-Control-Allow-Origin: *");

  echo(file_get_contents("./video.js"));

} else {
  // Checkpoint variables
  $checkpoint->paramVideo = $_GET[$conf->paramVideo];         // GET request variable to Video ID
  $checkpoint->paramMode = $_GET[$conf->paramMode];           // GET request variable to Mode
  $checkpoint->paramReferer = $_SERVER["HTTP_REFERER"];       // HTTP referer
  $checkpoint->paramUserAgent = $_SERVER["HTTP_USER_AGENT"];  // Client user agent
  $checkpoint->paramRemoteAddr = $_SERVER["REMOTE_ADDR"];     // Remote IP address
  $checkpoint->paramMethod = $_SERVER["REQUEST_METHOD"];      // Request type (GET, POST, ..)

  // Checkpoint checks
  if (!$conf->bypass) {
    isAnyNullEmpty($checkpoints) ?: killPage();                                        // Is any variable null or empty
    in_array($checkpoint->paramMethod, $conf->methods) ?: killPage();                  // Is request method allowed
    in_array(getDomain($checkpoint->paramReferer), $conf->refDomains) ?: killPage();   // Is referer allowed
    !$conf->useWhitelist ?: in_array($checkpoint->paramRemoteAddr, $conf->ipWhitelist) ?: killPage();     // Is IP whitelist enabled, is remote address in the list
    !$conf->useBlacklist ?: !in_array($checkpoint->paramRemoteAddr, $conf->ipBlacklist) ?: killPage();    // Is IP blacklist enabled, is remote address in the list
    isStringLenEqual($checkpoint->paramVideo, $conf->$idLength) ?: killPage();         // Is video id length equal to configuration
    in_array($checkpoint->paramVideo, $conf->videos) ?: killPage();                    // Is video id allowed
  }

  // Set headers
  header("Content-Type: application/json");

  // Request reply
  if ($conf->useGoogleProxy) {
    $req_random = rand(0, 100);
    $req_reply = file_get_contents("https://images$req_random-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D$conf->paramVideo");
  } else {
    $req_reply = file_get_contents("https://www.youtube.com/get_video_info?video_id=$conf->paramVideo&el=embedded&ps=default&eurl=&gl=US&hl=en");
  }

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
}
