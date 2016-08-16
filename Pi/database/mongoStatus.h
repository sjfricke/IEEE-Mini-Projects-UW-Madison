//
// Created by SpencerFricke on 7/23/2016.
//

#ifndef PISOCKETS_MONGOSTATUS_H
#define PISOCKETS_MONGOSTATUS_H

#include <bson.h>
#include <mongoc.h>
#include <stdio.h>

void getStatusMongo(char** queryResult);
void getPlayerMongo(char** queryResult);

#endif //PISOCKETS_MONGOSTATUS_H
