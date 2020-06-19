# afterglowytJS
A transparent youtube raw source integration for afterglow HTML5 video player, this integration will help you integrate youtube sources with afterglow seamlessly. This integration request sources asynchronously as soon as the DOM is loaded.

You can also use this with a plain HTML5 video player as it only changes video sources. Check `example.html` for a practical preview.

Obtain "raw" links to video resources with this yt integration, get sources for multiple videos in the same page.

This integration comes in two flavors:

#### Hosted proxy (Proxy)

- Source requests are sent through a proxy that runs PHP and intermediates the request for raw sources.
- Includes a PHP intermediator and client JS: `video.php`, `vaux.php`, `vconfig.php`, and `video.js`.
- Executes on both client and server, may use additional proxy chaining.

#### Remote proxy (CORS)

- Source requests are sent through a google proxy and intermediates the request for raw sources.
- Includes client JS requester: `video.js`.
- Executes on the client only.

## Quick Start (Proxy)

1. Edit `vconfig.php` and add to `$videos` array the yt videos id (https://www.youtube.com/watch?v=**<u>jNQXAC9IVRw</u>**) you want the proxy API to reply to, edit configuration as needed.

  2. Upload `video.php`, `vconfig.php`, `vaux.php`, and `video.js` to your webhost appropriate folder location.

  3. If you're using Apache configure both `.htaccess` and `video.js` to the appropriate values for requests to be valid.

4. Add afterglow player and `video.js` to your HTML page preferably before `</head>` tag closing.
   1. Edit configuration object inside `video.js` file as needed to point to the right proxy location.
   2. Example:
   ```html
   <head>
     <script src="https://cdn.jsdelivr.net/npm/afterglowplayer@1.x"></script>
     <script src="./video.js"></script>
   </head>
   ```
   
5. Add your `<video>` tags with custom attributes as needed and include:
   1. `video-id="VIDEOID"`, (Required) 'VIDEOID' should be replaced with actual yt video id
   2. `class="afterglow"`, (Recommended) 'afterglow' class should be in place for afterglow to work, you should also add any other classes you may need to further style the player element.
   3. `poster="PATH/TO/IMAGE.JPG"`, (Recommended) 'PATH/TO/IMAGE.JPG' should be replaced with actual poster/thumb image path for the video
   4. `width="1920" height="1080"`, (Recommended) replace width and height values with appropriate dimensions as necessary, if you're using afterglow then it's necessary.
   5. `playsinline`, (Optional) prevents going full screen when played
   6. `controls`, (Optional) shows video controls
   7. Example:
   ```html
   <video video-id="VIDEOID" class="afterglow" poster="PATH/TO/IMAGE.JPG" width="1920" height="1080" playsinline controls></video>
   ```
   
6. Sit back and enjoy your new direct sources.

## Quick Start (CORS)

1. Edit `video.js` and add to `ids` array the yt videos id (https://www.youtube.com/watch?v=**<u>jNQXAC9IVRw</u>**) you want the JS requester to reply to, edit configuration as needed.

2. Upload `video.js` to your webhost appropriate folder location.

3. If you're using Apache configure both `.htaccess` and `video.js` to the appropriate values for requests to be valid.

4. Add afterglow player and `video.js` to your HTML page preferably before `</head>` tag closing.

   1. Edit configuration object inside `video.js` file as needed to point to the right proxy location.
   2. Example:

   ```html
   <head>
     <script src="https://cdn.jsdelivr.net/npm/afterglowplayer@1.x"></script>
     <script src="./video.js"></script>
   </head>
   ```

5. Add your `<video>` tags with custom attributes as needed and include:

   1. `video-id="VIDEOID"`, (Required) 'VIDEOID' should be replaced with actual yt video id
   2. `class="afterglow"`, (Recommended) 'afterglow' class should be in place for afterglow to work, you should also add any other classes you may need to further style the player element.
   3. `poster="PATH/TO/IMAGE.JPG"`, (Recommended) 'PATH/TO/IMAGE.JPG' should be replaced with actual poster/thumb image path for the video
   4. `width="1920" height="1080"`, (Recommended) replace width and height values with appropriate dimensions as necessary, if you're using afterglow then it's necessary.
   5. `playsinline`, (Optional) prevents going full screen when played
   6. `controls`, (Optional) shows video controls
   7. Example:

   ```html
   <video video-id="VIDEOID" class="afterglow" poster="PATH/TO/IMAGE.JPG" width="1920" height="1080" playsinline controls></video>
   ```

6. Sit back and enjoy your new direct sources.

## What does what

`video.php` - Requests fresh raw sources `<source src="..." type="...">` for your video tag, this only uses a single GET parameter `code` that corresponds to the yt video id.

`vconfig.php` - Proxy configuration where you are able set which videos are allowed to request for in the `$videos` array.

`vaux.php` - Auxiliary functions for the proxy such as getting domain name and string verification.

`video.js` - Allows the browsers to request and apply `video.php` freshly obtained sources onto afterglow video tags.

## Brief Q&A

Q. Can i use this without afterglow player?

​	A. Yes, just don't add `class="afterglow"` to your video tag. 

Q. Can i use this if i use Cloudflare?

​	A. Yes this is just a simple proxy, video will be streamed directly from third-party servers (googlevideo).

Q. Does this work with multiple `<video>` tags inside the same page?

​	A. Yes, sources are obtained asynchronously as configured.

Q. Can i restrict access to this API?

​	A. You can and should restrict allowed video IDs, IPs and domain referrers via config file. Other restrictions can be applied via custom code or application configurations.

## License

Distributed under MIT License. See `license.md` for more information.
