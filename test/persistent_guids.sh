#!/bin/bash
#
# Verify guids in feed match in identical feed generation runs
#
incoming_dir="$(dirname "$0")"/media
feed_script="$(dirname "$0")"/../bin/generate_feed.js

export MP3ME_INCOMING_DIR="$incoming_dir"

if which md5sum &>/dev/null
then
  md5sum=md5sum
else if which md5 &>/dev/null
then
  md5sum=md5
else
  echo "Can't find md5 utility"
  exit 1
fi
fi


guid_hash_one=$("$feed_script" | grep guid | $md5sum)
echo guid_hash_one: $guid_hash_one >&2
guid_hash_two=$("$feed_script" | grep guid | $md5sum)
echo guid_hash_two: $guid_hash_two >&2

test "$guid_hash_one" == "$guid_hash_two"
