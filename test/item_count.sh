#!/bin/bash
#
# Verify number of files in queue equals the number of items in the generated feed
#
incoming_dir="$(dirname "$0")"/media
feed_script="$(dirname "$0")"/../bin/generate_feed.js

export MP3ME_INCOMING_DIR="$incoming_dir"

file_count=$(ls -1 "$incoming_dir"/*.{mp3,m4a} | wc -l)
echo file_count: $file_count >&2
item_count=$("$feed_script" | grep \<item | wc -l)
echo item_count: $item_count >&2

test "$file_count" == "$item_count"
