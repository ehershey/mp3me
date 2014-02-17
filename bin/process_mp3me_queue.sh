#!/bin/sh

incoming_dir=/home/ernie/Dropbox/Misc/mp3me/queue/incoming

podcast_xml_path=/home/ernie/Dropbox/Web/ernie-podcast.xml

for file in $incoming_dir/*
do
  echo $file
done



node generate_ernie_podcast_xml.js > $podcast_xml_path
