/*
jshint esversion:8
 */
document.addEventListener('DOMContentLoaded', function(e) {

  /*
    video.js
      Another javascript interface to interact with Youtube video API

      Video information fetcher configuration
   */
  var config = {
    /*

      mode:
        'proxy' - Use a proxy
        'cors' - Do a CORS request through Google's proxy
     */
    mode: 'cors', // string, Video source mode
    request: { // Request configurations
      method: 'GET', // string, Request method
      proxyUrl: 'https://www.example.com/api/video.php?code={0}', // string, Base proxy URL use '{0}' for the video ID
      corsUrl: 'https://images{0}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D{1}', // string, Base Google proxy URL use '{0}' for the server number and '{1}' for the video ID
      checks: {
        checkAll: false, // boolean, Check all
        idLength: 11, // integer, Video ID length, a video ID length equal to 0 won't be checked
        ids: ['jNQXAC9IVRw', 'LeAltgu_pbM'], // array, Allowed yt video IDs
      }
    },
    document: {
      attribute: 'video-id', // string, Attribute name
      attributeEncoding: 'none', // string, Attribute value encoding, 'none' - No encoding, 'base64' - Base64 encoded
      videoModes: ['1080p:video/mp4', '720p:video/mp4', '360p:video/mp4'], // array, Allowed video modes and mimetype separated by colon by order of preference
      separator: ':', // string, videoModes mode/mimetype separator
      sourceBase: '<source src="{0}" type="{1}">', // string, Video source base string
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

    if (config.request.checks.checkAll) {
      if (!isStrLenEql(videoId)) return null; // Check if video ID is of different length than config
      if (config.request.checks.ids.indexOf(videoId) < 0) return null; // Check if requested videoID is allowed
    }

    if (config.mode === 'cors') {
      url = config.request.corsUrl.format(~~(Math.random() * 10), videoId);
    } else {
      url = config.request.proxyUrl.format(videoId);
    }

    request = new XMLHttpRequest();
    request.open(config.request.method, url);
    request.send();
    request.onreadystatechange = function(e) {
      (function(e, index) {
        if (request.readyState == XMLHttpRequest.DONE) {
          sources = request.responseText;

          if (config.mode === 'cors') {
            meta = parseMeta(sources);
            sources = compileSources(meta);
          }

          setSources(index, sources);
        }
      })(e, index);
    };
  }

  /*
    setSource
      Sets source to video tag
    parameters
      index (integer) - Video element index to set source
      sources (string) - Sources to set video to
   */
  function setSources(index, sources) {
    config.document.videoIds[index].innerHTML = sources;
  }

  /*
    compileSources
      Compile sources as HTML code to be set in tag
    parameters
      sources (array) - Sources to be compiled as HTML
   */
  function compileSources(sources) {
    var compiledSources = '';
    config.document.videoModes.forEach(combo => {
      mode = combo.split(config.document.separator)[0];
      mimetype = combo.split(config.document.separator)[1];
      if (sources.hasOwnProperty(mode)) {
        compiledSources += config.document.sourceBase.format(sources[mode], mimetype);
        if (config.document.videoModes[config.document.videoModes.length] != combo) {
          compiledSources += '\n';
        }
      }
    });
    return compiledSources;
  }

  /*
    parseMeta
      Parse metadata from request reply
    parameters
      data (string) - data to parse meta from
   */
  function parseMeta(data) {
    var parsed = parseStr(data),
      filtered = JSON.parse(decodeURI(unicodeToChar(parsed.player_response.replace(/\+/g, ' ')))),
      streams = filtered.streamingData.formats.concat(filtered.streamingData.adaptiveFormats),
      result = {};
    streams.forEach(function(stream) {
      var itag = stream.itag * 1,
        quality = false,
        itagMap = {
          /*
          iTag reference:
            *pna - No audio
            *pna60 - No audio, 60 fps video
            *p60 - 60 fps video
            *p3d - 3D
            *hdr - HDR
            *_flv - FLV
            *_webm - webM
            *_hls - HLS
            *_3gp - 3GP
            *k - Audio only
            *k_m4a - Audio only, m4a
           */
          5: '240p_flv',
          6: '270p_flv',
          17: '144p_3gp',
          18: '360p',
          22: '720p',
          34: '360p_flv',
          35: '480p_flv',
          36: '180p_3gp',
          37: '1080p',
          38: '3072p',
          43: '360p_webm',
          44: '480p_webm',
          45: '720p_webm',
          46: '1080p_webm',
          82: '360p3d',
          83: '480p3d',
          84: '720p3d',
          85: '1080p3d',
          92: '240p3d_hls',
          93: '360p3d_hls',
          94: '480p3d_hls',
          95: '720p3d_hls',
          96: '1080p_hls',
          100: '360p3d_webm',
          101: '480p3d_webm',
          102: '720p3d_webm',
          132: '240p_hls',
          133: '240pna',
          134: '360pna',
          135: '480pna',
          136: '720pna',
          137: '1080pna',
          138: '2160pna60',
          139: '48k_m4a',
          140: '128k_m4a',
          141: '256k_m4a',
          151: '72p_hls',
          160: '144pna',
          167: '360pna_webm',
          168: '480pna_webm',
          169: '1080pna_webm',
          171: '128k_webm',
          218: '480pna_webm',
          219: '144pna_webm',
          242: '240pna_webm',
          243: '360pna_webm',
          244: '480pna_webm',
          245: '480pna_webm',
          246: '480pna_webm',
          247: '720pna_webm',
          248: '1080pna_webm',
          249: '50k_webm',
          250: '70k_webm',
          251: '160k_webm',
          264: '1440pna',
          266: '2160pna60',
          271: '1440pna_webm',
          272: '4320pna_webm',
          278: '144pna_webm',
          298: '720pna60',
          299: '1080pna60',
          302: '720pna60_webm',
          303: '1080pna60_webm',
          308: '1440pna60_webm',
          313: '2160pna_webm',
          315: '2160pna60_webm',
          330: '144pna60_hdr',
          331: '240pna60_hdr',
          332: '360pna60_hdr',
          333: '480pna60_hdr',
          334: '720pna60_hdr',
          335: '1080pna60_hdr',
          336: '1440pna60_hdr',
          337: '2160pna60_hdr'
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
    if (config.request.checks.idLength === 0) return true;
    return isStr(string) ?
      (string.length === config.request.checks.idLength ?
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

  /*
    unicodeToChar
      Cast a unicode string to character
    parameters
      string (string) - A given string to be converted to character
   */
  function unicodeToChar(string) {
    return string.replace(/\\u[\dA-F]{4}/gi,
      function(match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
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
