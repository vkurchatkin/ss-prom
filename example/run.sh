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

echo 'Wating for grafana to be up'

GRAFANA_URL="http://$DOCKER_IP:3000/"
GRAFANA_API_URL="http://admin:admin@$DOCKER_IP:3000/api/"

until curl --silent --fail "${GRAFANA_API_URL}org" > /dev/null;  do
  printf '.'
done

echo
echo "Grafana is up on $GRAFANA_URL"

echo "Creating grafana source"

curl -s -f --data-binary @- -X POST  "${GRAFANA_API_URL}datasources" \
  -H 'Content-Type: application/json' \
  --data-binary @- > /dev/null <<EOF
  {
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://prometheus:9090/",
    "access": "proxy",
    "jsonData": {}
  }
EOF

DASHBOARD=$(cat dashboard.json)

echo "Creating grafana dashboard"

curl -s -f --data-binary @- -X POST  "${GRAFANA_API_URL}dashboards/import" \
  -H 'Content-Type: application/json' \
  --data-binary @- > /dev/null <<EOF
  {
    "dashboard": $DASHBOARD,
    "overwrite": true,
    "inputs": [{"name": "DS_PROMETHEUS", "type": "datasource", "pluginId": "prometheus", "value": "Prometheus"}]
  }
EOF

export TARGET_URL="http://$DOCKER_IP:7777/target"

echo "Starting client"

node ./client.js &
CLIENT=$!

wait "$CLIENT"
cleanup
