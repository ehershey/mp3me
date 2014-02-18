#!/bin/sh

incoming_dir=/home/ernie/Dropbox/Misc/mp3me/queue/incoming

podcast_xml_path=/home/ernie/Dropbox/Web/ernie-podcast.xml

for file in $incoming_dir/*
do
  echo $file
  if echo "$file" | grep -q \\.mp3$
  then
    # look for metadata
    #
    if ! [ -e "$file.metadata" ]
    then
    fi

  fi
done



node `dirname $0`/generate_ernie_podcast_xml.js > $podcast_xml_path
