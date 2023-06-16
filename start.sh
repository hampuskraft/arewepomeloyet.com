#!/bin/bash -e

if [ $UID -eq 0 ]; then
  fallocate -l 512M /swapfile
  chmod 0600 /swapfile
  mkswap /swapfile
  echo 10 > /proc/sys/vm/swappiness
  swapon /swapfile
  echo 1 > /proc/sys/vm/overcommit_memory
  exec su nextjs -s /bin/bash -c "$0 $@"
fi

node server.js
