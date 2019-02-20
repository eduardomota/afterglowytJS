<?php
$allowed_videos = ["jNQXAC9IVRw"];  // Allowed yt video ids
$allowed_types = ["video/mp4", "video/webm"];  // Allowed video types

// Set headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Proceed only if code parameter is set
if (isset($_GET['code']) && $_GET['code'] != "") {
    $id=$_GET['code'];

    // Kill if requested id is not allowed
    in_array($id, $allowed_videos) ? true : die('404 Not Found');

    $reply=file_get_contents("http://www.youtube.com/get_video_info?video_id=$id&el=embedded&ps=default&eurl=&gl=US&hl=en");

    if (strpos($reply, 'status=fail') !== false) {
        $x=explode("&", $reply);
        $t=array();
        $g=array();
        $h=array();
        foreach ($x as $r) {
            $c=explode("=", $r);
            $n=$c[0];
            $v=$c[1];
            $y=urldecode($v);
            $t[$n]=$v;
        }
        $x=explode("&", $reply);
        foreach ($x as $r) {
            $c=explode("=", $r);
            $n=$c[0];
            $v=$c[1];
            $h[$n]=urldecode($v);
        }
        $g[]=$h;
        $g[0]['error'] = true;
        echo json_encode($g, JSON_PRETTY_PRINT);
    } else {
        $x=explode("&", $reply);
        $t=array();
        $g=array();
        $h=array();
        foreach ($x as $r) {
            $c=explode("=", $r);
            $n=$c[0];
            $v=$c[1];
            $y=urldecode($v);
            $t[$n]=$v;
        }
        $streams = explode(',', urldecode($t['url_encoded_fmt_stream_map']));
        foreach ($streams as $reply) {
            $x=explode("&", $reply);
            foreach ($x as $r) {
                $c=explode("=", $r);
                $n=$c[0];
                $v=$c[1];
                $h[$n]=urldecode($v);
            }
            $g[]=$h;
        }

        foreach ($g as $object) {
          $e = json_encode($object, JSON_PRETTY_PRINT);
          $e = json_decode($e, JSON_PRETTY_PRINT);

          // Check and build http reply
          foreach ($allowed_types as $type) {
            if (strpos($e['type'], $type) !== false) {
              echo '<source src="' . $e['url'] . '" type="' . $type . '">';
              echo chr(0x0D).chr(0x0A);
            }
          }
        }
    }
} else {
    @$myObj->error = true;
    $myObj->msg = "404 Not Found";

    $myJSON = json_encode($myObj, JSON_PRETTY_PRINT);
    echo $myJSON;
}
