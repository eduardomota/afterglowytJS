# afterglow-yt
A messier youtube integration for HTML5 afterglow player, this is for the people who want "raw" sources on their afterglow player using yt.

Obtain "raw" links to video resources with yt integration, currently functional for one video tag per page only.

## Quick Start

1. Edit `video.php` and add to `$allowed_videos` array the yt videos id (~~https://www.youtube.com/watch?v=~~jNQXAC9IVRw) you want the API to reply to.
2. Add afterglow and `video.js` after it and before closing the `</head>` tag.
   1. Edit `url` variable inside `video.js` file to correspond to `video.php` location on your server.
3. Add your `<video>`tag with custom attributes including:
   1. `id="player"`
   2. `video-id="VIDEOID"`, VIDEOID should be replaced with actual yt video id
   3. `class="afterglow"`, you should also add any other classes you deem relevant
   4. `poster="PATH/TO/IMAGE.JPG"`, PATH/TO/IMAGE.JPG should be replaced with actual poster/thumb image path for the video
   5. `width="1920" height="1080"`, replace width and height values with appropriate measure if necessary
   6. `playsinline`, prevents going full screen when played
   7. `controls`, shows video controls
4. Add `%sources` string inside `<video .... >HERE</video>` to have freshly requested source from yt
5. Sit back and enjoy your new direct sources

## What does what

`video.php` - Requests fresh new `<source src="..." type="...">` for your video tag

`video.js` - Applies freshly obtained sources onto afterglow

## Mini QA

Q. Does this work with more than one video in the same page?

A. No

Q. Will it ever be able to?

A. Maybe, probably not

Q. Why do i have to restrict to a couple of allow video ids?

A. This is strictly needed to restrict potential vulnerabilities of not properly sanitizing parameters such as SQL injection, LFI or others

