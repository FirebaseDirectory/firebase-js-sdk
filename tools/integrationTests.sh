#!/bin/bash
set -ev

# Cleanup the child processes
function cleanup {
  echo "EXIT called: Killing child processes"
  pkill -P $$
}

trap cleanup EXIT

# Variables
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
FIREBASE_CLI="$ROOT/node_modules/.bin/firebase"
WDIO_CLI="$ROOT/node_modules/.bin/wdio"
SERVE_CLI="$ROOT/node_modules/.bin/serve"

# Mount the new SDK
"$SERVE_CLI" $ROOT/dist/browser -p 5000 &

# [ -z "$TRAVIS" ] && { echo "Environment variable FIREBASE_TOKEN not set"; exit 1; }
[ -z "$FIREBASE_TOKEN" ] && { echo "Environment variable FIREBASE_TOKEN not set"; exit 1; }
FIREBASE_PROJECT="$1"
[ -z "$FIREBASE_PROJECT" ] && { echo "Firebase Project ID not passed as first arg"; exit 1; }

startFirebaseServer() {
  # Capture variables
  local DIR="$1"
  local PORT="$2"

  # Enter the passed directory
  pushd $DIR

  # Start firebase server
  "$FIREBASE_CLI" use --add $FIREBASE_PROJECT --token $FIREBASE_TOKEN
  "$FIREBASE_CLI" -p $PORT &
  
  popd
}

# Enter temp dir
pushd $(mktemp -d)

# Clone https://github.com/firebase/quickstart-js
git clone https://github.com/firebase/quickstart-js.git .

# Start servers
startFirebaseServer storage 5001
startFirebaseServer auth 5002
startFirebaseServer database 5003
startFirebaseServer messaging 5004

# Go back to firebase-js-sdk
popd

# Give the servers a few seconds to spin up
sleep 10

# Exec tests
env TS_NODE_PROJECT=tsconfig.test.json "$WDIO_CLI" $ROOT/wdio.conf.js
