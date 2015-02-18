#!/bin/bash
#
# Verify guids in feed are unique
#
incoming_dir="$(dirname "$0")"/media
feed_script="$(dirname "$0")"/../bin/generate_feed.js

export MP3ME_INCOMING_DIR="$incoming_dir"

guid_count=$("$feed_script" | tr -d \\n | tr \< \\n | grep ^guid | sed 's/.*>//g' | wc -l)
echo guid_count: $guid_count >&2

guid_unique_count=$("$feed_script" | tr -d \\n | tr \< \\n | grep ^guid | sed 's/.*>//g' | sort -u | wc -l)
echo guid_unique_count: $guid_unique_count >&2

echo "$guid_count" == "$guid_unique_count"
test "$guid_count" == "$guid_unique_count"
