#!/bin/bash
#
# Mp3me test script
#
# Execute every file in same directory as this script
#
#
for test_file in "$(dirname "$0")"/*
do
  if [ "$test_file" != "$0" -a ! -d "$test_file" ]
  then
    echo "$test_file"
    "$test_file"
    EXITCODE=$?
    if [ "$EXITCODE" != 0 ]
    then
      exit $EXITCODE
    fi
  fi
done
