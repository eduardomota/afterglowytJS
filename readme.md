# afterglow-yt
A transparent youtube raw source integration for HTML5 afterglow player, this integration will help you integrate youtube sources with afterglow seamlessly.

Obtain "raw" links to video resources with this yt integration, get sources for multiple videos in the same page.

## Quick Start

1. Edit `video.php` and add to `$cfg_videos` array the yt videos id (https://www.youtube.com/watch?v=**<u>jNQXAC9IVRw</u>**) you want the API to reply to, edit the configuration at the beggining of the file as needed.
  2. Upload `video.php` to your webhost appropriate folder location.
  3. If you're using Apache configure both `.htaccess` and `video.js` to the appropriate values for requests to be valid.
4. Add afterglow player js and `video.js` to your HTML page preferrably before closing `</head>` tag.
   1. Edit configuration object inside `video.js` file as needed to point to the right proxy location.
   2. Example:
   ```html
   <head>
     <script src="https://cdn.jsdelivr.net/npm/afterglowplayer@1.x"></script>
     <script src="./video.js"></script>
   </head>
   ```
5. Add your `<video>` tags with custom attributes as needed and include:
   1. `video-id="VIDEOID"`, (REQUIRED) 'VIDEOID' should be replaced with actual yt video id
   2. `class="afterglow"`, (RECOMMENDED) 'afterglow' class should be in place for afterglow to work, you should also add any other classes you may need to further style the element.
   3. `poster="PATH/TO/IMAGE.JPG"`, (RECOMMENDED) 'PATH/TO/IMAGE.JPG' should be replaced with actual poster/thumb image path for the video
   4. `width="1920" height="1080"`, (OPTIONAL) replace width and height values with appropriate dimensions as necessary
   5. `playsinline`, (OPTIONAL) prevents going full screen when played
   6. `controls`, (OPTIONAL) shows video controls
   7. Example:
   ```html
   <video video-id="VIDEOID" class="afterglow" poster="PATH/TO/IMAGE.JPG" width="1920" height="1080" playsinline controls></video>
   ```
6. Sit back and enjoy your new direct sources

## What does what

`video.php` - Requests fresh raw sources `<source src="..." type="...">` for your video tag, this only uses a single GET parameter `code` that corresponds to the yt video id, that id should be included in `$cfg_videos` array otherwise the request will fail unless `cfg_bypass` is activated.

`video.js` - Allows the browsers to request and apply `video.php` freshly obtained sources onto afterglow video tags.

## Mini QA

Q. Can i use this if i use Cloudflare?

A. Yes this is just a simple proxy, video will be streamed directly from third-party servers.

Q. Does this work with multiple `<video>` tags inside the same page?

A. Yes, sources are obtained sequentially from the configured proxy.

Q. Can i restrict access to this API?

A. You can and should restrict allowed video IDs, IPs and domain referrers via config file. Other restrictions can be applied via custom code or application configurations.

## License

Distributed under MIT License. See `license.md` for more information.
