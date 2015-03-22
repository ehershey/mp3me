#!/bin/bash
#
# Verify urls in feed are unique
#
incoming_dir="$(dirname "$0")"/media
feed_script="$(dirname "$0")"/../bin/generate_feed.js

export MP3ME_INCOMING_DIR="$incoming_dir"

url_count=$("$feed_script" | tr -d \\n | tr \< \\n | grep ^media:content | wc -l)
echo url_count: $url_count >&2

url_unique_count=$("$feed_script" | tr -d \\n | tr \< \\n | grep ^media:content | sort -u | wc -l)
echo url_unique_count: $url_unique_count >&2

echo "$url_count" == "$url_unique_count"
test "$url_count" == "$url_unique_count"
