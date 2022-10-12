#!/bin/bash

# get our server (network.lesshook.gq)
$(which node || which nodejs) index.js > /tmp/nullnexus_proxy.log
