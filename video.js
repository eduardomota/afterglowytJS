document.addEventListener('DOMContentLoaded', function(e) {

  /*
    video.js configuration
   */
  var config = {
    /*
      mode:
        'proxy' - use a proxy to get video sources
        'cors' - use a cors request to get source through google proxy
     */
    mode: 'cors', // string, Video source mode
    request: { // Request configurations
      method: 'GET', // string, Request method
      proxy: { // Proxy request configurations
        url: {
          prefix: 'https://www.example.com/api/video.php?code=', // string, Proxy URL prefix
          suffix: '' // string, Proxy URL suffix
        }
      },
      checks: {
        // Proxy/CORS checks
        bypassAll: false, // boolean, Bypass checks
        idLength: 11, // integer, Video ID length
        // CORS
        ids: ['jNQXAC9IVRw', 'LeAltgu_pbM'], // array, Allowed yt video IDs
        failed: 'status=fail', // string, Failed status string
        throwBadgateway: true // boolean, Throw bad gateway on failure
      }
    },
    document: {
      attribute: 'video-id', // string, Attribute name
      attributeEncoding: 'none', // string, Attribute value encoding, 'none' - No encoding, 'base64' - Base64 encoded
      videoIds: document.getElementsByTagName('video'), // Get video elements
    }
  };

  /*
    getSources
      Get video sources using a cors or proxy request
    parameters
      videoId (string) - Request video ID
      index (integer) - Video element index
   */
  function getSources(videoId, index) {
    var url, request, reply, streams;
    switch (config.mode) {
      case 'cors': // CORS semi-proxified request
        if (config.request.checks.bypassAll) { // Is bypass all enabled
          if (isStrLenEql(videoId) !== config.request.checks.idLength) return null; // Check if video ID is of different length than config
          if (config.request.checks.ids.indexOf(videoId) < 0) return null; // Check if requested videoID is allowed
        }

        url = "https://images{0}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D{1}".format(~~(Math.random() * 100), videoId);

        request = new XMLHttpRequest();
        request.open(config.request.method, url);
        request.send();
        request.onreadystatechange = function(e) {
          (function(e, index) {
            if (request.readyState == XMLHttpRequest.DONE) {
              reply = request.responseText;
              sources = parseMeta(reply);
              setSources(index, sources, false);
            }
          })(e, index);
        };
        break;

      case 'proxy': // Full proxy request
        if (config.request.checks.bypassAll) { // Is bypass all enabled
          if (isStrLenEql(videoId) !== config.request.checks.idLength) return null; // Check if video ID is of different length than config
        }

        url = config.request.proxy.url.prefix + videoId + config.request.proxy.url.suffix;

        request = new XMLHttpRequest();
        request.open(config.request.method, url);
        request.send();
        request.onreadystatechange = function(e) {
          (function(e, index) {
            if (request.readyState == XMLHttpRequest.DONE) {
              sources = request.responseText;
              setSources(index, sources, true);
            }
          })(e, index);
        };
        break;

      default:
        return null;
    }
  }

  /*
    setSource
      Sets source to video tag
    parameters
      index (integer) - Video element index to set source
      sources (string) - Sources to set video to
   */
  function setSources(index, sources, proxified) {
    if (proxified) {
      config.document.videoIds[index].innerHTML = sources;
    } else {
      config.document.videoIds[index].setAttribute('src', sources['1080p'] || sources['720p'] || sources['360p']);
    }
  }

  /*
    parseMeta
      Parse metadata from request reply
    parameters
      data (string) - data to parse meta from
   */
  function parseMeta(data) {
    var parsed = parseStr(data),
      streams = (parsed.url_encoded_fmt_stream_map + ',' + data.adaptive_fmts).split(','),
      result = {};
    streams.forEach(function(s) {
      var stream = parseStr(s),
        itag = stream.itag * 1,
        quality = false,
        itagMap = {
          18: '360p',
          22: '720p',
          37: '1080p',
          38: '3072p',
          82: '360p3d',
          83: '480p3d',
          84: '720p3d',
          85: '1080p3d',
          133: '240pna',
          134: '360pna',
          135: '480pna',
          136: '720pna',
          137: '1080pna',
          264: '1440pna',
          298: '720p60',
          299: '1080p60na',
          160: '144pna',
          139: "48kbps",
          140: "128kbps",
          141: "256kbps"
        };
      if (itagMap[itag]) result[itagMap[itag]] = stream.url;
    });
    return result;
  }

  /*
    parseStr
      Parse string
    parameters
      data (string) - data to be parsed as string
   */
  function parseStr(data) {
    return data.split('&').reduce(function(params, param) {
      var paramSplit = param.split('=').map(function(value) {
        return decodeURIComponent(value.replace('+', ' '));
      });
      params[paramSplit[0]] = paramSplit[1];
      return params;
    }, {});
  }

  /*
    isStrLenEql
      Is a given string length equal to set configuration
    parameters
      string (string) - A given string to be checked for length
   */
  function isStrLenEql(string) {
    return isStr(string) ?
      (string.length === request.checks.videoIdLength ?
        true :
        false) :
      false;
  }

  /*
    isStr
      Test if a given variable a string
    parameters
      variable (any) - A given variable to test for string type
   */
  function isStr(variable) {
    return (typeof variable === 'string') ? true : false;
  }

  // String format function
  String.prototype.format = function() {
    var a = this;
    for (var k in arguments) {
      a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a;
  };

  /*
    Get video sources sequentially on load
   */
  if (typeof config.document.videoIds === 'object') {
    Array.prototype.forEach.call(config.document.videoIds, function(element, index) {
      var videoId = element.getAttribute(config.document.attribute);
      sources = getSources(videoId, index);
    });
  }

});
