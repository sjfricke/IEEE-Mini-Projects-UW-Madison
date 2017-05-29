//
// Created by SpencerFricke on 7/22/2016.
//

#ifndef PISOCKETS_GETFUNCTIONS_H
#define PISOCKETS_GETFUNCTIONS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../database/mongoStatus.h"

void get_FindMethod(const char *route, char** returnMessage);

void getPlayer(char** returnMessage);
void getStatus(char** returnMessage);
void getHealth(char** returnMessage);
void getLevel(char** returnMessage);
void getCoins(char** returnMessage);

#endif //PISOCKETS_GETFUNCTIONS_H
