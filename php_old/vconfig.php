<?php

/*
  video.php configuration
 */
error_reporting(0);                                 // integer  , Error reporting level

class Configuration {
  public $useAsProxy = false;                       // boolean  , Use youtube as source proxy
  public $useGoogleProxy = false;                   // boolean  , Use google proxy as video sources
  public $bypass = false;                           // boolean  , Bypass all verifications
  public $bypassEmpty = false;                      // boolean  , Bypass not set/empty variables verification
  public $failDie = true;                           // boolean  , Throw "Bad Gateway" on request failure
  public $failStatus = "status=fail";               // string   , Failed request string (Shouldn't be changed)
  public $videos = ["jNQXAC9IVRw", "LeAltgu_pbM"];  // array    , Allowed youtube video ids
  public $idLength = 11;                            // integer  , Video id maximum length
  public $videoType = ["video/mp4", "video/webm"];  // array    , Allowed video mimetypes
  public $useRefDomain = false;                     // boolean  , Use referral domain array
  public $refDomains = ["example.com", "www.example.com"];  // string   , Referer domains allowed
  public $methods = ["GET"];                        // array    , Allowed request methods (shouldn't be changed)
  public $paramVideo = "code";                      // string   , Parameter name for video id
  public $useWhitelist = false;                     // boolean  , Use IP whitelist
  public $ipWhitelist = ["127.0.0.1"];              // array    , IP access whitelist, request will go through
  public $useBlacklist = false;                     // boolean  , Use IP blacklist
  public $ipBlacklist = [];                         // array    , IP access blacklist, request will be blocked
}

?>
