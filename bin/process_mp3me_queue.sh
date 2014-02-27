#!/bin/sh

incoming_dir=$(ls -d /{home,Users}/ernie/Dropbox/Misc/mp3me/queue/incoming 2>/dev/null)

podcast_xml_path=$(ls -d /{home,Users}/ernie/Dropbox/Web/ 2>/dev/null)/ernie-podcast.xml

if [ ! -e "$incoming_dir" ]
then
  echo "no incoming queue dir: $incoming_dir"
  exit 2
fi


for file in $incoming_dir/*
do
  echo $file
  # already audio, probably ready to be listened
  #
  if echo "$file" | grep -q \\.mp3$
  then
    echo "Audio/mp3 file"
    # look for metadata
    #
  # already video, convert to audio
  # 
  elif echo "$file" | grep -q \\.mp4$
  then
    echo "Video/mp4 file"
    audio_file=$(echo $file | sed 's/mp4$/mp3/')
    echo ffmpeg -i $file $audio_file
  # file with youtube URL
  #
  elif grep -q ^http.*youtube.com/ "$file"
  then
    echo "File containing URL"
    for url in $(grep ^http.*youtube.com/ "$file")
    do
      echo youtube-dl -f 17 --title "$url"
    done

  fi
done



node `dirname $0`/generate_ernie_podcast_xml.js > $podcast_xml_path
