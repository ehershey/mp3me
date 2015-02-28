#!/bin/bash
#
# Look for various format files in an incoming queue directory,
# turn them into mp3 files suitable for download as podcast files.
#
# Requirements:
# ffmpeg
# youtube-dl
# eyed3


set -x

# Error on unset variables
#
set -o nounset

incoming_dir=~/Dropbox/Misc/mp3me/queue/incoming
processing_dir=~/Dropbox/Misc/mp3me/queue/processing
processed_dir=~/Dropbox/Misc/mp3me/queue/processed
published_dir=~/Dropbox/Misc/mp3me/queue/published
log_dir=~/Dropbox/Misc/mp3me/queue/log
runtime_dir=~/Dropbox/Misc/mp3me/queue/runtime

mkdir -p "$incoming_dir"
mkdir -p "$processed_dir"
mkdir -p "$processing_dir"
mkdir -p "$published_dir"
mkdir -p "$log_dir"
mkdir -p "$runtime_dir"

# This script will run a script with this name in the same directory
#
feed_script_name=generate_feed.js
podcast_xml_path=~/Dropbox/Web/ernie-podcast.xml

# Lock file for running this script
#
pidfile="$runtime_dir/script_running.$(hostname).pid"

if [ -e "$pidfile" ]
then
  echo "pidfile exists, aborting: $pidfile"
  exit 3
fi
echo "$$" > "$pidfile"

tempfile=$(mktemp /tmp/process_mp3m3_queue.XXXXXX)
find "$incoming_dir"/ -type f > "$tempfile"
while read file
do
  echo "$file"

  logfile="$log_dir/$(basename "$file").log"

  # already audio, probably ready to be published
  #
  if echo "$file" | grep -q \\.mp3$
  then
    echo "Audio/mp3 file"
    # mv "$file" $published_dir/

    # Check for id3 data
    
  # already video, convert to audio
  # 
  elif echo "$file" | grep -q \\.mp4$ || echo "$file" | grep -q \\.3gp$ || echo "$file" | grep -q \\.m4v$ || echo "$file" | grep -q \\.mov$
  then
    echo "Video/mp4 file"
    echo "Logging to $logfile"
    processing_file="$processing_dir/$(basename "$file")"
    mv "$file" "$processing_file"
    audio_file=$(echo "$processing_file" | sed 's/\.[a-zA-Z0-9]*$/.mp3/')

    if ffmpeg -y -i "$processing_file" -af volume=12 "$audio_file" >> "$logfile" 2>&1
    then
      mv "$processing_file" "$processed_dir/"
      if [ -e "$audio_file" ]
      then
        mv "$audio_file" "$incoming_dir"/
      fi
    else
      mv "$processing_file" "$file"
      if [ -e "$audio_file" ]
      then
        rm "$audio_file"
      fi
    fi
  # file with youtube URL
  #
  elif grep -q ^http.*youtube.com/ "$file"
  then
    echo "File containing URL"
    echo "Logging to $logfile"
    processing_file="$processing_dir/$(basename "$file")"
    mv "$file" "$processing_file"
    for url in $(grep ^http.*youtube.com/ "$processing_file")
    do
      pushd "$incoming_dir"
      if youtube-dl --no-playlist --write-description --write-info-json --write-annotations --write-thumbnail --audio-format mp3 --add-metadata --xattrs --extract-audio --format bestaudio "$url" >> "$logfile" 2>&1
      then
        mv "$processing_file" "$processed_dir/"
      else
        mv "$processing_file" "$file"
      fi
      popd
    done
  # file with vimeo URL
  #
  elif grep -q ^http.*vimeo.com/ "$file"
  then
    echo "File containing URL"
    echo "Logging to $logfile"
    processing_file="$processing_dir/$(basename "$file")"
    mv "$file" "$processing_file"
    for url in $(grep ^http.*vimeo.com/ "$processing_file")
    do
      pushd "$incoming_dir"
      if youtube-dl --no-playlist --write-description --write-info-json --write-annotations --write-thumbnail --audio-format mp3 --add-metadata --xattrs --extract-audio "$url" >> "$logfile" 2>&1
      then
        mv "$processing_file" "$processed_dir/"
      else
        mv "$processing_file" "$file"
      fi
      popd
    done
  else
    echo "Can't detect file and next action for: $file"
  fi
done < "$tempfile"



node `dirname $0`/"$feed_script_name" > $podcast_xml_path

rm "$pidfile"
