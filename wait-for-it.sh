#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

echoerr() {
  if [ "$QUIET" -ne 1 ]; then
    echo "$@" 1>&2
  fi
}

usage() {
  echo "Usage: $0 host:port [-t timeout] [-- command args]"
  exit 1
}

wait_for() {
  for i in $(seq "$TIMEOUT"); do
    nc -z "$HOST" "$PORT" > /dev/null 2>&1
    result=$?
    if [ $result -eq 0 ]; then
      return 0
    fi
    sleep 1
  done
  return 1
}

wait_for_wrapper() {
  if ! wait_for; then
    echoerr "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
    exit 1
  fi
}

while [ $# -gt 0 ]
do
  case "$1" in
    *:* )
    HOSTPORT=(${1//:/ })
    HOST=${HOSTPORT[0]}
    PORT=${HOSTPORT[1]}
    shift
    ;;
    -q | --quiet)
    QUIET=1
    shift
    ;;
    -t)
    TIMEOUT="$2"
    if ! [[ "$TIMEOUT" =~ ^[0-9]+$ ]]; then
      echo "Error: Invalid timeout value"
      exit 1
    fi
    shift 2
    ;;
    --)
    shift
    CMD="$@"
    break
    ;;
    *)
    usage
    ;;
  esac
done

if [ "$HOST" = "" ] || [ "$PORT" = "" ]; then
  usage
fi

wait_for_wrapper

if [ -n "$CMD" ]; then
  exec $CMD
else
  exit 0
fi
