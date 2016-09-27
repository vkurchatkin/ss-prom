#!/bin/bash

set -e

if [ -z "$DOCKER_HOST" ]; then
  DOCKER_IP=127.0.0.1
else
  DOCKER_IP=`echo $DOCKER_HOST | sed -n 's/tcp:\/\/\(.*\):.*$/\1/p'`
fi

cleanup() {
  echo 'Shutting down'
  kill -TERM "$CLIENT" 2>/dev/null || true
  docker-compose down
  exit 0
}

trap 'cleanup' SIGINT

rm -rf server/node_modules
mkdir -p server/node_modules/ss-prom
cp -r ../dist/* server/node_modules/ss-prom/

docker-compose up --build -d

echo 'Wating for server'

SERVER_URL="http://$DOCKER_IP:7777/"

until curl --silent --fail $SERVER_URL > /dev/null;  do
    printf '.'
done
echo
echo "Server is up on $SERVER_URL"

export TARGET_URL="http://$DOCKER_IP:7777/target"

node ./client.js &
CLIENT=$!

wait "$CLIENT"
cleanup
