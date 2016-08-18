//
// Created by SpencerFricke on 8/17/2016.
//

#ifndef PI_MONGOPLAYER_H
#define PI_MONGOPLAYER_H

#include <bson.h>
#include <mongoc.h>
#include <stdio.h>
#include <stdlib.h>

void updateNumberStatMongo(char** returnMessage, char* body);

void updateModeMongo(char** returnMessage, char* body);

#endif //PI_MONGOPLAYER_H
