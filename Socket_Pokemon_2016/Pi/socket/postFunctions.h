//
// Created by SpencerFricke on 7/22/2016.
//

#ifndef PISOCKETS_POSTFUNCTIONS_H
#define PISOCKETS_POSTFUNCTIONS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../database/mongoPokemon.h"
#include "../database/mongoPlayer.h"

void post_FindMethod(const char *route, char** returnMessage, char *body);

void newPokemon(char** returnMessage);

void updatePokemon(char** returnMessage);

void updatePlayerPosition(char** returnMessage, char* body);

void updatePlayerHealth(char** returnMessage, char* body);
void updatePlayerItem(char** returnMessage, char* body);
void updatePlayerScore(char** returnMessage, char* body);
void updatePlayerCoins(char** returnMessage, char* body);

void updatePlayerMode(char** returnMessage, char* body);

#endif //PISOCKETS_POSTFUNCTIONS_H
