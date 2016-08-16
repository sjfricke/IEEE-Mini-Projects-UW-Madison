#!/bin/bash
#Used to setup mongoDB from scratch in terms of setting the correct DB and Collections

mongo --eval 'load("getStatus.js")'
