mp3me
=====

Automatically convert youtube playlist into an audio podcast for easy consumption.


Process
-------
1. Human adds videos to a playlist
2. Trigger or cron runs processing script
   1. Download audio from Youtube
   2. Put metadata somewhere
   3. Generate feed
   4. Upload to s3
  


Configuration
------------
config.yaml:

    # Name of s3 bucket to which podcast feed is to be published
    #
    s3_bucket: ernie_mp3me
    
    # Playlist to pull content from.
    # Format is one of:
    # 1) Full playlist URL (https://www.youtube.com/playlist?list=PLDQwMvf1qGKnhqwkWt8jzgIK5uoWRQYWZ)
    # 2) Playlist ID (PLDQwMvf1qGKnhqwkWt8jzgIK5uoWRQYWZ)
    # 3) <playlist name>@<username> (To listen to@ernest)
	#
    youtube_playlist: https://www.youtube.com/playlist?list=PLDQwMvf1qGKnhqwkWt8jzgIK5uoWRQYWZ



Build Status
------------
[![Build Status](https://travis-ci.org/ehershey/mp3me.svg)](https://travis-ci.org/ehershey/mp3me)
